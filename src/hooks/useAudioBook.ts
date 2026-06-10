"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { catalogBooks } from "../lib/catalogData";

// Helper to convert base64 Data URL to Blob
const base64ToBlob = (base64Data: string, contentType: string) => {
  try {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  } catch (err) {
    console.error("Error converting base64 to blob:", err);
    return null;
  }
};

// Dynamically import or load pdfjs client-side
let pdfjsLib: any = null;
if (typeof window !== "undefined") {
  // We will load pdfjs-dist via import or use CDN if there's any bundle issues
  pdfjsLib = require("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
}

export interface Chapter {
  id: number;
  title: string;
  text: string;
  sentences: string[];
  durationMinutes: number;
}

export interface BookInfo {
  title: string;
  author: string;
  coverUrl: string | null;
  chapters: Chapter[];
}

export interface LibraryBook extends BookInfo {
  id: string;
  addedAt: number;
}

export function useAudioBook() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [uploadedBooks, setUploadedBooks] = useState<LibraryBook[]>([]);
  
  // Player state
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(0.8);
  const [speechPitch, setSpeechPitch] = useState(1.0); // 1.0 is standard, lower is slightly warmer
  
  // Voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Sleep timer
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [chapterElapsedSeconds, setChapterElapsedSeconds] = useState(0);

  // Load voices on mount and restore saved voice/progress
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load initial settings and progress from localStorage
    try {
      const savedBook = localStorage.getItem("vyr_bookInfo");
      if (savedBook) {
        setBookInfo(JSON.parse(savedBook));
      }
      
      const savedUploadedBooks = localStorage.getItem("vyr_uploadedBooks");
      if (savedUploadedBooks) {
        setUploadedBooks(JSON.parse(savedUploadedBooks));
      }
      
      const savedChapter = localStorage.getItem("vyr_currentChapterIndex");
      if (savedChapter) setCurrentChapterIndex(parseInt(savedChapter, 10));
      
      const savedSentence = localStorage.getItem("vyr_currentSentenceIndex");
      if (savedSentence) setCurrentSentenceIndex(parseInt(savedSentence, 10));
      
      const savedSpeed = localStorage.getItem("vyr_playbackSpeed");
      if (savedSpeed) setPlaybackSpeed(parseFloat(savedSpeed));
      
      const savedVolume = localStorage.getItem("vyr_speechVolume");
      if (savedVolume) setSpeechVolume(parseFloat(savedVolume));
      
      const savedPitch = localStorage.getItem("vyr_speechPitch");
      if (savedPitch) setSpeechPitch(parseFloat(savedPitch));
    } catch (e) {
      console.error("Error loading settings from localStorage:", e);
    }

    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Filter Spanish voices (handles case variations and underscores like es_ES, es-MX, es)
      const spanishVoices = voices.filter(voice => 
        /^es[-_]?/i.test(voice.lang) || voice.lang.toLowerCase() === "es"
      );
      
      const list = spanishVoices.length > 0 ? spanishVoices : voices;
      setAvailableVoices(list);
      
      // Attempt to restore saved voice by name
      const savedVoiceName = localStorage.getItem("vyr_selectedVoiceName");
      if (savedVoiceName) {
        const savedVoice = list.find(v => v.name === savedVoiceName);
        if (savedVoice) {
          setSelectedVoice(savedVoice);
          return;
        }
      }
      
      // Default selection: try to find Google Spanish or Microsoft Sabina/Helena, or pick the first Spanish one
      if (spanishVoices.length > 0) {
        const preferred = spanishVoices.find(v => 
          v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Sabina") || v.name.includes("Helena")
        );
        setSelectedVoice(preferred || spanishVoices[0]);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0]);
      }
    };

    loadVoices();
    
    // Fallback retries for Safari/Chrome on mobile where voices are loaded asynchronously
    const retry1 = setTimeout(loadVoices, 100);
    const retry2 = setTimeout(loadVoices, 500);
    const retry3 = setTimeout(loadVoices, 1000);
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      clearTimeout(retry1);
      clearTimeout(retry2);
      clearTimeout(retry3);
    };
  }, []);

  // Save settings and progress to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (bookInfo) {
      localStorage.setItem("vyr_bookInfo", JSON.stringify(bookInfo));
    } else {
      localStorage.removeItem("vyr_bookInfo");
      localStorage.removeItem("vyr_currentChapterIndex");
      localStorage.removeItem("vyr_currentSentenceIndex");
    }
  }, [bookInfo]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vyr_currentChapterIndex", currentChapterIndex.toString());
  }, [currentChapterIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vyr_currentSentenceIndex", currentSentenceIndex.toString());
  }, [currentSentenceIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vyr_playbackSpeed", playbackSpeed.toString());
  }, [playbackSpeed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vyr_speechVolume", speechVolume.toString());
  }, [speechVolume]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vyr_speechPitch", speechPitch.toString());
  }, [speechPitch]);

  useEffect(() => {
    if (typeof window === "undefined" || !selectedVoice) return;
    localStorage.setItem("vyr_selectedVoiceName", selectedVoice.name);
  }, [selectedVoice]);

  // Sleep timer handler
  useEffect(() => {
    if (sleepTimer !== null) {
      setTimerRemaining(sleepTimer * 60);
      
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setSleepTimer(null);
            pauseSpeech();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimerRemaining(null);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sleepTimer]);

  // Elapsed time simulator for visual updates
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setChapterElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying]);

  // Handle voice or speed change during active playback
  useEffect(() => {
    if (isPlaying && bookInfo) {
      speakCurrentSentence();
    }
  }, [selectedVoice, playbackSpeed, speechPitch, speechVolume]);

  const splitSentences = (text: string): string[] => {
    if (!text) return [];
    // Split by sentence markers (. ? !) followed by spaces, keeping looking behind
    return text
      .split(/(?<=[.?!…])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 1);
  };

  const segmentChapters = (fullText: string): { title: string; text: string }[] => {
    // Regex for chapters (Capítulo X, Prólogo, Epílogo, Introducción)
    const chapterRegex = /(?:^|\n)(?:[Cc]ap[íi]tulo\s+\d+|[Cc]ap[íi]tulo\s+[IVXLCDM]+|[Pp]r[oó]logo|[Ee]p[íi]logo|[Ii]ntroducci[oó]n|[Cc]onclusi[oó]n)/gi;
    
    // Find all matches and their indices
    const matches: { index: number; title: string }[] = [];
    let match;
    while ((match = chapterRegex.exec(fullText)) !== null) {
      matches.push({
        index: match.index,
        title: match[0].trim().replace(/\n/g, " ")
      });
    }

    if (matches.length < 2) {
      // Fallback: divide text into segments of ~1500 words
      const words = fullText.split(/\s+/);
      const segments: { title: string; text: string }[] = [];
      const wordsPerSegment = 1500;
      
      for (let i = 0; i < words.length; i += wordsPerSegment) {
        const segmentWords = words.slice(i, i + wordsPerSegment);
        const segmentText = segmentWords.join(" ");
        const chapNum = Math.floor(i / wordsPerSegment) + 1;
        segments.push({
          title: `Parte ${chapNum}: ${segmentText.substring(0, 30)}...`,
          text: segmentText
        });
      }
      return segments;
    }

    // Split text based on matches
    const chapters: { title: string; text: string }[] = [];
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i < matches.length - 1 ? matches[i + 1].index : fullText.length;
      
      // Extract title and body
      const rawText = fullText.substring(start, end).trim();
      const firstLineBreak = rawText.indexOf("\n");
      
      let title = matches[i].title;
      let text = rawText;
      
      if (firstLineBreak !== -1 && firstLineBreak < 60) {
        title = rawText.substring(0, firstLineBreak).trim();
        text = rawText.substring(firstLineBreak).trim();
      }
      
      chapters.push({ title, text });
    }
    return chapters;
  };

  const loadPdf = async (file: File) => {
    setIsLoading(true);
    setProgress(5);
    
    try {
      // 1. Upload PDF to Supabase Storage if available
      let pdfCloudUrl: string | null = null;
      if (supabase) {
        try {
          setProgress(10);
          const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
          const fileName = `${Date.now()}_${cleanName}`;
          const filePath = `${fileName}`;
          
          const { data, error } = await supabase.storage
            .from("books")
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (error) {
            console.error("Error al subir PDF a Supabase Storage:", error);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from("books")
              .getPublicUrl(filePath);
            pdfCloudUrl = publicUrl;
            console.log("PDF subido a Supabase Storage con éxito:", pdfCloudUrl);
          }
        } catch (uploadErr) {
          console.error("Fallo inesperado al subir PDF a Supabase:", uploadErr);
        }
      }
      
      setProgress(20);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setProgress(30);
      const maxPages = pdf.numPages;
      let fullText = "";
      
      // Extract cover page rendering
      let coverUrl: string | null = null;
      try {
        const page1 = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page1.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await page1.render({ canvasContext: context, viewport }).promise;
          coverUrl = canvas.toDataURL("image/jpeg");
        }
      } catch (err) {
        console.error("Error generating cover:", err);
      }
      
      // 2. Upload cover image to Supabase Storage if available
      if (supabase && coverUrl) {
        try {
          setProgress(40);
          const coverBlob = base64ToBlob(coverUrl, "image/jpeg");
          if (coverBlob) {
            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "_");
            const coverFileName = `${Date.now()}_${cleanName}_cover.jpg`;
            const { data, error } = await supabase.storage
              .from("covers")
              .upload(coverFileName, coverBlob, {
                contentType: "image/jpeg",
                cacheControl: '3600',
                upsert: false
              });
              
            if (error) {
              console.error("Error al subir portada a Supabase Storage:", error);
            } else {
              const { data: { publicUrl } } = supabase.storage
                .from("covers")
                .getPublicUrl(coverFileName);
              coverUrl = publicUrl;
              console.log("Portada subida a Supabase Storage con éxito:", coverUrl);
            }
          }
        } catch (coverUploadErr) {
          console.error("Fallo inesperado al subir portada a Supabase:", coverUploadErr);
        }
      }
      
      setProgress(50);
      
      // Extract text page-by-page
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(" ");
        
        fullText += pageText + "\n";
        setProgress(Math.floor(50 + (i / maxPages) * 40));
      }
      
      setProgress(95);
      
      // Segment into chapters
      const rawChapters = segmentChapters(fullText);
      
      const formattedChapters: Chapter[] = rawChapters.map((rc, idx) => {
        const sentences = splitSentences(rc.text);
        // Estimate 150 words per minute
        const words = rc.text.split(/\s+/).length;
        const durationMinutes = Math.max(1, Math.round(words / 150));
        
        return {
          id: idx + 1,
          title: rc.title,
          text: rc.text,
          sentences,
          durationMinutes
        };
      });

      const title = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const bookId = `pdf-${Date.now()}`;
      const info: LibraryBook = {
        id: bookId,
        title,
        author: "Archivo PDF Subido",
        coverUrl,
        chapters: formattedChapters,
        addedAt: Date.now()
      };
      
      setUploadedBooks(prev => {
        // Evitar duplicados por el mismo título para no saturar memoria
        const filtered = prev.filter(b => b.title.toLowerCase() !== title.toLowerCase());
        const updated = [info, ...filtered];
        localStorage.setItem("vyr_uploadedBooks", JSON.stringify(updated));
        return updated;
      });
      
      setProgress(100);
      setTimeout(() => setIsLoading(false), 500);
      
    } catch (error) {
      console.error("Error parsing PDF:", error);
      alert("No se pudo leer el archivo PDF. Intenta con otro archivo.");
      setIsLoading(false);
    }
  };

  const loadDemo = () => {
    setIsLoading(true);
    setProgress(50);
    
    // Create a rich demo content
    const demoInfo: LibraryBook = {
      id: "demo-el-principito",
      title: "El Principito (Demo)",
      author: "Antoine de Saint-Exupéry",
      coverUrl: null, // Will generate default cover in UI
      chapters: [
        {
          id: 1,
          title: "Capítulo I: El Dibujo de la Boa",
          text: "Cuando yo tenía seis años vi una vez una magnífica lámina en un libro sobre la Selva Virgen que se titulaba 'Historias Vividas'. Representaba una serpiente boa que se tragaba a una fiera. En el libro se afirmaba: 'La serpiente boa se traga su presa entera, sin masticarla. Luego no puede moverse y duerme durante los seis meses que dura su digestión'. Reflexioné mucho en ese momento sobre las aventuras de la jungla y a mi vez logré trazar con un lápiz de color mi primer dibujo. Mi dibujo número 1 era así: representaba un sombrero. Enseñé mi obra de arte a las personas mayores y les pregunté si mi dibujo les daba miedo. ¿Por qué habría de asustar un sombrero?, me respondieron. Mi dibujo no representaba un sombrero. Representaba una serpiente boa que digiere un elefante. Dibujé entonces el interior de la serpiente boa a fin de que las personas mayores pudieran comprender. Siempre estas personas tienen necesidad de explicaciones.",
          sentences: [
            "Cuando yo tenía seis años vi una vez una magnífica lámina en un libro sobre la Selva Virgen que se titulaba 'Historias Vividas'.",
            "Representaba una serpiente boa que se tragaba a una fiera.",
            "En el libro se afirmaba: 'La serpiente boa se traga su presa entera, sin masticarla.'",
            "Luego no puede moverse y duerme durante los seis meses que dura su digestión.",
            "Reflexioné mucho en ese momento sobre las aventuras de la jungla y a mi vez logré trazar con un lápiz de color mi primer dibujo.",
            "Mi dibujo número 1 era así: representaba un sombrero.",
            "Enseñé mi obra de arte a las personas mayores y les pregunté si mi dibujo les daba miedo.",
            "¿Por qué habría de asustar un sombrero?, me respondieron.",
            "Mi dibujo no representaba un sombrero.",
            "Representaba una serpiente boa que digiere un elefante.",
            "Dibujé entonces el interior de la serpiente boa a fin de que las personas mayores pudieran comprender.",
            "Siempre estas personas tienen necesidad de explicaciones."
          ],
          durationMinutes: 3
        },
        {
          id: 2,
          title: "Capítulo II: El Encuentro en el Desierto",
          text: "Viví así, solo, sin nadie con quien hablar verdaderamente, hasta que tuve una avería en el desierto de Sahara, hace seis años. Algo se había roto en mi motor. Y como no llevaba conmigo ni mecánico ni pasajeros, me dispuse a realizar, solo, una difícil reparación. Era para mí una cuestión de vida o muerte. Tenía agua de beber apenas para ocho días. La primera noche me dormí sobre la arena, a mil millas de toda tierra habitada. Estaba más aislado que un náufrago en una balsa en medio del océano. Imagínense, pues, mi sorpresa cuando, al romper el día, me despertó una extraña vocecita que decía: —Por favor... ¡dibújame un cordero! —¿Eh? —¡Dibújame un cordero! Me puse en pie de un salto, como herido por el rayo. Me froté los ojos. Miré bien. Y vi a un extraordinario muchachito que me miraba gravemente.",
          sentences: [
            "Viví así, solo, sin nadie con quien hablar verdaderamente, hasta que tuve una avería en el desierto de Sahara, hace seis años.",
            "Algo se había roto en mi motor.",
            "Y como no llevaba conmigo ni mecánico ni pasajeros, me dispuse a realizar, solo, una difícil reparación.",
            "Era para mí una cuestión de vida o muerte.",
            "Tenía agua de beber apenas para ocho días.",
            "La primera noche me dormí sobre la arena, a mil millas de toda tierra habitada.",
            "Estaba más aislado que un náufrago en una balsa en medio del océano.",
            "Imagínense, pues, mi sorpresa cuando, al romper el día, me despertó una extraña vocecita que decía: —Por favor... ¡dibújame un cordero!",
            "—¿Eh?",
            "—¡Dibújame un cordero!",
            "Me puse en pie de un salto, como herido por el rayo.",
            "Me froté los ojos.",
            "Miré bien.",
            "Y vi a un extraordinario muchachito que me miraba gravemente."
          ],
          durationMinutes: 4
        },
        {
          id: 3,
          title: "Capítulo III: El Asteroide B 612",
          text: "Me costó mucho tiempo comprender de dónde venía. El principito, que me hacía muchas preguntas, jamás parecía oír las mías. Fueron palabras salidas al azar las que, poco a poco, me revelaron todo. Así, cuando distinguió por primera vez mi avión me preguntó: —¿Qué es esa cosa? —No es una cosa. Vuela. Es un avión. Es mi avión. Y me sentía orgulloso haciéndole saber que volaba. Entonces exclamó: —¡Cómo! ¿Has caído del cielo? —Sí, respondí modestamente. —¡Ah! ¡Qué curioso! Y el principito soltó una magnífica carcajada que me irritó mucho. Me gusta que mis desgracias se tomen en serio. Y añadió: —¡Entonces tú también vienes del cielo! ¿De qué planeta eres tú? Vislumbré una luz en el misterio de su presencia y le pregunté bruscamente: —¿Vienes, pues, de otro planeta?",
          sentences: [
            "Me costó mucho tiempo comprender de dónde venía.",
            "El principito, que me hacía muchas preguntas, jamás parecía oír las mías.",
            "Fueron palabras salidas al azar las que, poco a poco, me revelaron todo.",
            "Así, cuando distinguió por primera vez mi avión me preguntó: —¿Qué es esa cosa?",
            "—No es una cosa.",
            "Vuela.",
            "Es un avión.",
            "Es mi avión.",
            "Y me sentía orgulloso haciéndole saber que volaba.",
            "Entonces exclamó: —¡Cómo! ¿Has caído del cielo?",
            "—Sí, respondí modestamente.",
            "—¡Ah! ¡Qué curioso!",
            "Y el principito soltó una magnífica carcajada que me irritó mucho.",
            "Me gusta que mis desgracias se tomen en serio.",
            "Y añadió: —¡Entonces tú también vienes del cielo!",
            "¿De qué planeta eres tú?",
            "Vislumbré una luz en el misterio de su presencia y le pregunté bruscamente: —¿Vienes, pues, de otro planeta?"
          ],
          durationMinutes: 5
        }
      ],
      addedAt: Date.now()
    };

    setUploadedBooks(prev => {
      const filtered = prev.filter(b => b.id !== "demo-el-principito");
      const updated = [demoInfo, ...filtered];
      localStorage.setItem("vyr_uploadedBooks", JSON.stringify(updated));
      return updated;
    });
    setProgress(100);
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const speakCurrentSentence = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !bookInfo) return;

    // Cancel active synthesis first
    window.speechSynthesis.cancel();

    const chapter = bookInfo.chapters[currentChapterIndex];
    if (!chapter || chapter.sentences.length === 0) return;

    const sentence = chapter.sentences[currentSentenceIndex];
    if (!sentence) return;

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(sentence);
    utteranceRef.current = utterance; // Keep reference to prevent GC

    // Configure properties
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = playbackSpeed;
    utterance.pitch = speechPitch;
    utterance.volume = speechVolume;

    utterance.onend = () => {
      // Advance to next sentence
      if (currentSentenceIndex < chapter.sentences.length - 1) {
        setCurrentSentenceIndex(prev => prev + 1);
      } else {
        // Last sentence of chapter, check if next chapter exists
        if (currentChapterIndex < bookInfo.chapters.length - 1) {
          setCurrentChapterIndex(prev => prev + 1);
          setCurrentSentenceIndex(0);
          setChapterElapsedSeconds(0);
        } else {
          // Finished the book!
          setIsPlaying(false);
          setCurrentSentenceIndex(0);
          setCurrentChapterIndex(0);
          setChapterElapsedSeconds(0);
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        console.error("SpeechSynthesis error:", e);
        setIsPlaying(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Trigger speech when index changes (while playing)
  useEffect(() => {
    if (isPlaying) {
      speakCurrentSentence();
    }
  }, [currentChapterIndex, currentSentenceIndex, isPlaying]);

  const playSpeech = () => {
    if (!bookInfo) return;
    
    // iOS Safari / Mobile Chrome Web Speech API Gestures Unlock
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        const unlockUtterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(unlockUtterance);
      } catch (e) {
        console.warn("Fallo al desbloquear SpeechSynthesis para móvil:", e);
      }
    }
    
    setIsPlaying(true);
  };

  const pauseSpeech = () => {
    setIsPlaying(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const skipSentence = (delta: number) => {
    if (!bookInfo) return;
    const chapter = bookInfo.chapters[currentChapterIndex];
    if (!chapter) return;

    let targetIdx = currentSentenceIndex + delta;
    if (targetIdx < 0) {
      // Go to previous chapter last sentence
      if (currentChapterIndex > 0) {
        const prevChapIdx = currentChapterIndex - 1;
        const prevChap = bookInfo.chapters[prevChapIdx];
        setCurrentChapterIndex(prevChapIdx);
        setCurrentSentenceIndex(prevChap.sentences.length - 1);
        setChapterElapsedSeconds(0);
      } else {
        setCurrentSentenceIndex(0);
      }
    } else if (targetIdx >= chapter.sentences.length) {
      // Go to next chapter first sentence
      if (currentChapterIndex < bookInfo.chapters.length - 1) {
        setCurrentChapterIndex(prev => prev + 1);
        setCurrentSentenceIndex(0);
        setChapterElapsedSeconds(0);
      } else {
        setCurrentSentenceIndex(chapter.sentences.length - 1);
      }
    } else {
      setCurrentSentenceIndex(targetIdx);
    }
  };

  const seekSentence = (index: number) => {
    if (!bookInfo) return;
    const chapter = bookInfo.chapters[currentChapterIndex];
    if (!chapter) return;

    if (index >= 0 && index < chapter.sentences.length) {
      setCurrentSentenceIndex(index);
    }
  };

  const seekChapter = (index: number) => {
    if (!bookInfo) return;
    if (index >= 0 && index < bookInfo.chapters.length) {
      setCurrentChapterIndex(index);
      setCurrentSentenceIndex(0);
      setChapterElapsedSeconds(0);
    }
  };

  // Load a book from the catalog
  const loadCatalogBook = (bookId: string) => {
    const book = catalogBooks.find(b => b.id === bookId);
    if (!book) return;

    const formattedChapters: Chapter[] = book.chapters.map((ch, idx) => {
      const sentences = splitSentences(ch.text);
      return {
        id: idx + 1,
        title: ch.title,
        text: ch.text,
        sentences,
        durationMinutes: Math.max(1, Math.round(ch.text.split(/\s+/).length / 150))
      };
    });

    const info: BookInfo = {
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      chapters: formattedChapters
    };

    setBookInfo(info);
    setCurrentChapterIndex(0);
    setCurrentSentenceIndex(0);
    setIsPlaying(false);
    setChapterElapsedSeconds(0);
  };

  // Load an uploaded book from the library
  const loadLibraryBook = (book: LibraryBook) => {
    setBookInfo(book);
    setCurrentChapterIndex(0);
    setCurrentSentenceIndex(0);
    setIsPlaying(false);
    setChapterElapsedSeconds(0);
  };

  // Delete a book from the library
  const deleteLibraryBook = (id: string) => {
    setUploadedBooks(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem("vyr_uploadedBooks", JSON.stringify(updated));
      return updated;
    });
    
    // Reset current book if it's the one being deleted
    if (bookInfo && 'id' in bookInfo && (bookInfo as any).id === id) {
      resetBook();
    }
  };

  // Reset book state (e.g. to upload another one)
  const resetBook = () => {
    pauseSpeech();
    setBookInfo(null);
    setCurrentChapterIndex(0);
    setCurrentSentenceIndex(0);
    setChapterElapsedSeconds(0);
    setSleepTimer(null);
  };

  return {
    isLoading,
    progress,
    bookInfo,
    uploadedBooks,
    currentChapterIndex,
    currentSentenceIndex,
    isPlaying,
    playbackSpeed,
    speechVolume,
    speechPitch,
    availableVoices,
    selectedVoice,
    sleepTimer,
    timerRemaining,
    chapterElapsedSeconds,
    
    // Setters
    setPlaybackSpeed,
    setSpeechVolume,
    setSpeechPitch,
    setSelectedVoice,
    setSleepTimer,
    
    // Actions
    loadPdf,
    loadDemo,
    loadCatalogBook,
    loadLibraryBook,
    deleteLibraryBook,
    playSpeech,
    pauseSpeech,
    skipSentence,
    seekSentence,
    seekChapter,
    resetBook
  };
}
