"use client";

import React from "react";
import { useAudioBook } from "../hooks/useAudioBook";
import UploadZone from "../components/UploadZone";
import VoiceSettings from "../components/VoiceSettings";
import ChapterList from "../components/ChapterList";
import ReaderPanel from "../components/ReaderPanel";
import AudioPlayer from "../components/AudioPlayer";
import { catalogBooks, CatalogBook } from "../lib/catalogData";

export default function Home() {
  const {
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
    resetBook,
  } = useAudioBook();

  // Navigation states
  const [currentSection, setCurrentSection] = React.useState<"inicio" | "explorar" | "detalles" | "reproductor" | "biblioteca">("inicio");
  const [selectedBookId, setSelectedBookId] = React.useState<string | null>(null);
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = React.useState<string>("Cualquier duración");
  const [minRating, setMinRating] = React.useState<number>(0);
  const [activeTab, setActiveTab] = React.useState<"lectura" | "capitulos" | "ajustes">("lectura"); // For mobile reader view

  const handleFileSelect = (file: File) => {
    loadPdf(file);
    setCurrentSection("biblioteca");
  };

  const handleCloseBook = () => {
    resetBook();
    setCurrentSection("biblioteca");
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSpeech();
    } else {
      playSpeech();
    }
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentSection("detalles");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startListeningBook = (bookId: string) => {
    loadCatalogBook(bookId);
    setCurrentSection("reproductor");
    setActiveTab("lectura");
    setTimeout(() => {
      playSpeech();
    }, 100);
  };

  const currentChapter = bookInfo && bookInfo.chapters[currentChapterIndex]
    ? bookInfo.chapters[currentChapterIndex]
    : null;

  const currentDetailsBook = selectedBookId 
    ? catalogBooks.find(b => b.id === selectedBookId) 
    : null;

  // Filter books dynamically for the Explore view
  const filteredBooks = catalogBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenres.length === 0 || selectedGenres.includes(book.genre);

    let matchesDuration = true;
    if (selectedDuration === "Menos de 3 horas") {
      matchesDuration = book.durationMinutes < 180;
    } else if (selectedDuration === "3 a 10 horas") {
      matchesDuration = book.durationMinutes >= 180 && book.durationMinutes <= 600;
    } else if (selectedDuration === "Más de 10 horas") {
      matchesDuration = book.durationMinutes > 600;
    }

    const matchesRating = book.rating >= minRating;

    return matchesSearch && matchesGenre && matchesDuration && matchesRating;
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedDuration("Cualquier duración");
    setMinRating(0);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      
      {/* 1. Sidebar Navigation (Desktop only) */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 w-64 bg-surface-container-low border-r border-outline-variant/30 shadow-md py-6 px-6 z-30 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="mb-8 px-2 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
          <div>
            <h1 className="font-display text-xl text-primary font-bold tracking-tight">Voz & Relato</h1>
            <p className="font-body text-[10px] text-on-surface-variant opacity-75 font-semibold uppercase tracking-wider">Tu biblioteca personal</p>
          </div>
        </div>

        <nav className="flex-grow space-y-1">
          <button
            onClick={() => setCurrentSection("inicio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-body font-semibold text-sm cursor-pointer ${
              currentSection === "inicio"
                ? "text-primary bg-primary-fixed/25 font-bold shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Inicio</span>
          </button>
          
          <button
            onClick={() => setCurrentSection("explorar")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-body font-semibold text-sm cursor-pointer ${
              currentSection === "explorar"
                ? "text-primary bg-primary-fixed/25 font-bold shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Explorar</span>
          </button>
          
          <button
            onClick={() => setCurrentSection("biblioteca")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-body font-semibold text-sm cursor-pointer ${
              currentSection === "biblioteca"
                ? "text-primary bg-primary-fixed/25 font-bold shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">local_library</span>
            <span>Mi Biblioteca</span>
          </button>
          
          <button
            onClick={() => setCurrentSection("reproductor")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-body font-semibold text-sm cursor-pointer ${
              currentSection === "reproductor"
                ? "text-primary bg-primary-fixed/25 font-bold shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">headphones</span>
            <span>Lector PDF</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/25">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant/35">
              <img 
                alt="Usuario Perfil" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDEfLtxLY2ta8QSYSrvl34PEYlNG0B-AmQN75bFKn-5yGljygZSKxvct0SZYtRUVf0eCdYEiLz6vGbdFixspceb2GO8tr_sORhcpPgabnY88j6BRZ42zblsnlwrKzgYuIgqNjZ3u4wDOM5DK4KQEPf7NnFk3hogKd6F5bx4GOGnndpJMYI3lvOd78dJyBXDeBgL4AgoUstmIqfqA9Vm1ed4_zlAFOYeCJn_48muHgPB1Uc6LdpsrcHkE3PPmpv-qDhIsU7PKhCL4Fc"
              />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="font-body text-xs font-bold text-primary truncate leading-tight">Alejandro V.</p>
              <p className="text-[10px] text-on-surface-variant truncate italic mt-0.5">Lector Platinum</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <main className="flex-grow min-h-screen flex flex-col relative">
        
        {/* Mobile Header (Visible only on mobile) */}
        <header className="md:hidden sticky top-0 z-30 bg-background/90 backdrop-blur-md px-margin-mobile py-4 border-b border-outline-variant/15 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
            <span className="font-display text-lg text-primary font-bold">Voz & Relato</span>
          </div>
          <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
        </header>

        {/* Desktop Header Search Bar */}
        {currentSection !== "reproductor" && (
          <header className="hidden md:flex justify-between items-center px-margin-desktop py-6 sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/10">
            <div className="relative w-full max-w-lg">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input
                type="text"
                placeholder="Busca por título, autor o narrador..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentSection !== "explorar") setCurrentSection("explorar");
                }}
                className="w-full pl-12 pr-4 py-2.5 bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-xl font-body text-sm shadow-inner outline-none transition-all"
              />
            </div>
            
            <nav className="flex gap-8 items-center ml-8">
              <button
                onClick={() => setCurrentSection("inicio")}
                className={`font-body text-sm font-semibold transition-colors cursor-pointer ${
                  currentSection === "inicio" ? "text-primary border-b-2 border-primary pb-1 font-bold" : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                Biblioteca
              </button>
              <button
                onClick={() => setCurrentSection("explorar")}
                className={`font-body text-sm font-semibold transition-colors cursor-pointer ${
                  currentSection === "explorar" ? "text-primary border-b-2 border-primary pb-1 font-bold" : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                Explorar
              </button>
              <button
                onClick={() => setCurrentSection("biblioteca")}
                className={`font-body text-sm font-semibold transition-colors cursor-pointer ${
                  currentSection === "biblioteca" ? "text-primary border-b-2 border-primary pb-1 font-bold" : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                Mi Biblioteca
              </button>
              <button
                onClick={() => setCurrentSection("reproductor")}
                className="font-body text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
              >
                Lector
              </button>
            </nav>
          </header>
        )}

        {/* Dynamic Vistas Render */}
        <div className="flex-1 px-margin-mobile md:px-margin-desktop py-6">
          
          {/* A. SECCIÓN INICIO */}
          {currentSection === "inicio" && (
            <div className="space-y-12 animate-fade-in pb-16">
              
              {/* Hero Section: Recommendation of the Month */}
              <section className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6">
                  <span className="text-secondary-fixed-dim font-bold tracking-widest text-xs font-body block uppercase">
                    RECOMENDACIÓN DEL MES
                  </span>
                  <h1 className="font-display text-headline-md md:text-display-lg font-bold leading-tight">
                    El Alquimista del Viento
                  </h1>
                  <p className="font-body text-sm md:text-base text-on-primary-container max-w-xl">
                    Sumérgete en una odisea sonora narrada por voces maestras. Descubre por qué esta historia ha cautivado a miles de oyentes este mes.
                  </p>
                  <div className="flex gap-4 flex-wrap pt-2">
                    <button
                      onClick={() => startListeningBook("el-alquimista-del-viento")}
                      className="bg-secondary text-on-secondary font-body font-bold px-6 py-3 rounded-full hover:bg-secondary-container transition-all active:scale-95 text-sm shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      <span>Escuchar ahora</span>
                    </button>
                    <button
                      onClick={() => handleBookSelect("el-alquimista-del-viento")}
                      className="border border-on-primary-container/45 text-on-primary font-body font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm cursor-pointer"
                    >
                      Detalles
                    </button>
                  </div>
                </div>

                <div className="w-56 shrink-0 flex justify-center relative group select-none">
                  <div className="absolute -inset-4 bg-secondary/10 rounded-[2rem] blur-3xl opacity-60"></div>
                  <img
                    alt="Book Cover"
                    className="w-44 h-64 object-cover rounded-lg cover-shadow relative z-10 transform group-hover:rotate-1 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPymZrhxThRifGLYdc-ai47yY7ragUxoYPsPfQfWzFnEB7wZuGgyI-Hd6lGZLjirb08RQn56TMsBQFnZcAJpi2Ybs2zPSMVMW_sVWdO9t7NAfWufsEeLvXUNvClX_eq_MKSpMTXdvypnbO9WNqXGnr6-AgnZ72DHwxX5s5XdhDIWxHwvkITYwt6X-GQYmNH5FwZgVxEg1-Lyo_BfVpAxgsvpS1MuF08kOePBSGzCQLH8fClS5SO_Y1CFc1D7fgcFyERyQyyE84rvKk"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-background p-3 rounded-full shadow-lg z-20 border border-outline-variant/30 text-secondary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
                  </div>
                </div>
              </section>

              {/* Grid: Recommended for You */}
              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="font-display text-headline-md text-primary font-bold">Recomendados para ti</h2>
                    <div className="h-0.5 w-12 bg-secondary rounded-full mt-1.5"></div>
                  </div>
                  <button onClick={() => setCurrentSection("explorar")} className="text-secondary font-body font-bold text-xs hover:underline cursor-pointer">Ver todo</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {catalogBooks.slice(1, 6).map((book) => (
                    <div 
                      key={book.id} 
                      onClick={() => handleBookSelect(book.id)}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl book-card-shadow bg-surface-container-low border border-outline-variant/15">
                        <img 
                          alt={book.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                          src={book.coverUrl}
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-5xl transition-transform group-hover:scale-110">play_circle</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display text-sm text-primary font-bold group-hover:text-secondary transition-colors line-clamp-1 leading-snug">{book.title}</h3>
                        <p className="font-body text-xs text-on-surface-variant truncate">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20 space-y-6">
                <h2 className="font-display text-headline-md text-primary font-bold text-center">Categorías Populares</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { icon: "history_edu", label: "HISTORIA" },
                    { icon: "auto_stories", label: "FICCIÓN" },
                    { icon: "psychology", label: "MENTE" },
                    { icon: "science", label: "CIENCIA" },
                    { icon: "castle", label: "FANTASÍA" },
                    { icon: "business_center", label: "NEGOCIOS" }
                  ].map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedGenres([cat.label.charAt(0) + cat.label.slice(1).toLowerCase()]);
                        setCurrentSection("explorar");
                      }}
                      className="bg-background p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-primary-fixed/20 transition-all cursor-pointer group shadow-sm border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-primary text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <span className="font-body text-[10px] font-bold text-primary tracking-wider">{cat.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Weekly Trends */}
              <section className="space-y-6">
                <h2 className="font-display text-headline-md text-primary font-bold">Tendencias de la semana</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trend 1 */}
                  <div 
                    onClick={() => handleBookSelect("el-alquimista-del-viento")}
                    className="flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer border border-transparent hover:border-outline-variant/30 bg-surface-container/20"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-lg shadow border border-outline-variant/20">
                      <img 
                        alt="Trend" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVRZZbjaQOeWEPvDE9PxqMl5wkJpBLuW2d40PSqxG4ssjeG4OmBiKTOi7qqPf-m4bl1_g_QlFPbRLXklZjhDQ6QBifWsq08DsX6qgcLywpx5jqwXcerfaLO6wRVXuCLt2nUjOfGihH7B5cs0zxqmXvVmxo1j0D7ujM6YIq9guPZRM2xz_pildEcwfe35uxw866HqIqs8TXu4R5zVH-YJscRoMIuKR2m66gNlc5D8N54C0BhkMmdyXD2q0eF-AizFBWpowfffHuY_Ut"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-secondary font-bold text-[9px] font-body uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">#1 TRENDING</span>
                        <span className="text-on-surface-variant text-[10px] font-semibold font-mono">14h 32m de audio</span>
                      </div>
                      <h4 className="font-display text-md text-primary font-bold group-hover:text-secondary transition-colors truncate">El Alquimista del Viento</h4>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">Una exploración profunda sobre el futuro de la alquimia y el destino de la humanidad...</p>
                    </div>
                  </div>
                  
                  {/* Trend 2 */}
                  <div 
                    onClick={() => handleBookSelect("el-laberinto-de-papel")}
                    className="flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer border border-transparent hover:border-outline-variant/30 bg-surface-container/20"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-lg shadow border border-outline-variant/20">
                      <img 
                        alt="Trend" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSOmjcXJ2iTZLGrD7JHIxjmldA4i9PxZPyDCtRoz4peWuizDu8Q7HfjFMg8s0FRTsmroQiQ9rLY6gRUU-rpic09m_5nxlm1fpmEkfV4VrGdFereIOO59RooY69Sg2A32Gcp5__sLdHqZdvYEg2NCT9bB1Cmm4fEfr5vzI3AwHww6jKm7EPsJlAaf80RxHoArh6VU4SaTYpEet75iZl3Tfh3G7KNd1SgwGMCO2hy-bKIymv8qSwqM7Ap9aKEVFrikGRWsGRGzy7QNxN"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-secondary font-bold text-[9px] font-body uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">#2 TRENDING</span>
                        <span className="text-on-surface-variant text-[10px] font-semibold font-mono">12h 30m de audio</span>
                      </div>
                      <h4 className="font-display text-md text-primary font-bold group-hover:text-secondary transition-colors truncate">El Laberinto de Papel</h4>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">Un fascinante enigma policíaco ambientado en las galerías subterráneas de un monasterio antiguo...</p>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* B. SECCIÓN EXPLORAR */}
          {currentSection === "explorar" && (
            <div className="flex flex-col lg:flex-row gap-8 items-start animate-fade-in pb-16">
              
              {/* Filters Sidebar Column */}
              <aside className="w-full lg:w-60 shrink-0 space-y-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
                
                {/* Search field inside filters on mobile */}
                <div className="block md:hidden">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                    <input
                      type="text"
                      placeholder="Buscar audiolibros..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-lg font-body text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-sm font-bold text-primary mb-3">Géneros</h3>
                  <div className="space-y-2">
                    {["Ficción", "Misterio", "Biografía", "Historia", "Poesía"].map((genre) => (
                      <label key={genre} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
                        />
                        <span className="font-body text-xs text-on-surface-variant group-hover:text-primary transition-colors font-medium">
                          {genre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-4">
                  <h3 className="font-display text-sm font-bold text-primary mb-3">Duración</h3>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg font-body text-xs focus:ring-1 focus:ring-primary py-2 px-3 focus:outline-none"
                  >
                    <option>Cualquier duración</option>
                    <option>Menos de 3 horas</option>
                    <option>3 a 10 horas</option>
                    <option>Más de 10 horas</option>
                  </select>
                </div>

                <div className="border-t border-outline-variant/20 pt-4">
                  <h3 className="font-display text-sm font-bold text-primary mb-3">Calificación</h3>
                  <div className="space-y-2">
                    {[5.0, 4.0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                        className={`flex items-center gap-1.5 w-full text-left font-body text-xs font-semibold py-1 rounded-md transition-all ${
                          minRating === rating 
                            ? "text-secondary bg-secondary/5 px-2 -mx-2" 
                            : "text-on-surface-variant hover:text-secondary"
                        }`}
                      >
                        <div className="flex text-secondary">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {rating >= 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating >= 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating >= 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating >= 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating < 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating < 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating < 5.0 && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                          {rating < 5.0 && <span className="material-symbols-outlined text-sm">star</span>}
                        </div>
                        <span>{rating >= 5.0 ? "5.0 de 5" : "4.0 o más"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 border border-primary text-primary font-body font-bold rounded-full hover:bg-primary-fixed/20 transition-all text-xs cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              </aside>

              {/* Book Grid Content */}
              <div className="flex-1 space-y-6">
                
                {/* Horizontal Quick-Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 scroll-hide">
                  <button
                    onClick={() => { setSelectedGenres([]); }}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full font-body text-xs font-bold transition-all cursor-pointer ${
                      selectedGenres.length === 0
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    Todos
                  </button>
                  {["Ficción", "Misterio", "Historia", "Poesía", "Biografía"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenres([g])}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full font-body text-xs font-bold transition-all cursor-pointer ${
                        selectedGenres.includes(g)
                          ? "bg-primary text-on-primary shadow-sm"
                          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* Books Grid */}
                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleBookSelect(book.id)}
                        className="group cursor-pointer space-y-3"
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden book-card-shadow bg-surface-container-low border border-outline-variant/15">
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={book.coverUrl}
                            alt={book.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                startListeningBook(book.id);
                              }}
                              className="bg-secondary text-on-secondary py-2 rounded-full font-body text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow"
                            >
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                              <span>Escuchar</span>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-display text-sm text-primary group-hover:text-secondary transition-colors line-clamp-1 leading-snug font-bold">
                            {book.title}
                          </h4>
                          <p className="font-body text-xs text-on-surface-variant truncate">{book.author}</p>
                          <div className="flex items-center gap-1 mt-1 text-secondary">
                            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="font-body text-[10px] text-on-surface-variant font-bold">
                              {book.rating} • {book.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/35 p-6">
                    <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">search_off</span>
                    <p className="font-display text-md text-primary font-bold">No se encontraron audiolibros</p>
                    <p className="font-body text-xs text-on-surface-variant mt-1">Prueba a limpiar los filtros de búsqueda o cambiar tu selección.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 bg-primary text-on-primary text-xs font-body font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-primary-container"
                    >
                      Restablecer Filtros
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* C. SECCIÓN DETALLES */}
          {currentSection === "detalles" && currentDetailsBook && (
            <div className="space-y-16 animate-fade-in pb-16">
              
              {/* Hero Section: Cover + Action */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                
                {/* Left side book cover */}
                <div className="md:col-span-4 max-w-[280px] mx-auto md:max-w-none w-full relative group">
                  <div className="relative rounded-lg overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.01] border border-outline-variant/20">
                    <img
                      alt={currentDetailsBook.title}
                      className="w-full h-auto aspect-[2/3] object-cover"
                      src={currentDetailsBook.coverUrl}
                    />
                    <div className="absolute inset-0 book-spine-glow pointer-events-none"></div>
                  </div>
                  {currentDetailsBook.bestseller && (
                    <div className="absolute -top-4 -right-4 bg-secondary text-on-secondary px-5 py-1.5 rounded-full font-body text-[10px] font-bold shadow-lg rotate-3">
                      Bestseller
                    </div>
                  )}
                </div>

                {/* Right side metadata */}
                <div className="md:col-span-8 space-y-6">
                  <nav className="flex items-center gap-1.5 font-body text-[10px] font-bold text-on-surface-variant opacity-75 uppercase tracking-wider">
                    <span className="cursor-pointer hover:text-primary" onClick={() => setCurrentSection("inicio")}>Audiolibros</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span>{currentDetailsBook.genre}</span>
                  </nav>
                  
                  <h1 className="font-display text-headline-md md:text-display-lg text-primary font-bold leading-tight">
                    {currentDetailsBook.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-body text-xs md:text-sm text-on-surface">
                    <p>
                      <span className="text-on-surface-variant font-medium mr-1.5">Escrito por:</span>
                      <span className="font-bold border-b border-outline-variant/35">{currentDetailsBook.author}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                      <span className="text-on-surface-variant font-medium">Narrado por:</span>
                      <span className="font-bold border-b border-outline-variant/35">{currentDetailsBook.narrator}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex text-secondary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0.5" }}>star_half</span>
                    </div>
                    <span className="font-body text-xs text-on-surface-variant">({currentDetailsBook.reviewsCount} reseñas)</span>
                    <div className="h-4 w-px bg-outline-variant/35"></div>
                    <span className="font-body text-[10px] bg-surface-container-high px-3 py-1 rounded-full text-primary font-bold uppercase tracking-wider">{currentDetailsBook.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => startListeningBook(currentDetailsBook.id)}
                      className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-body text-xs font-bold flex items-center gap-2.5 shadow hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      <span>Escuchar Muestra</span>
                    </button>
                    <button
                      onClick={() => alert("¡Muestra añadida a tu biblioteca local!")}
                      className="border-2 border-primary text-primary hover:bg-surface-container-low px-8 py-3.5 rounded-xl font-body text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      Añadir a Biblioteca — $18.99
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-outline-variant/20 text-xs">
                    <div>
                      <p className="font-body text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Idioma</p>
                      <p className="font-body font-bold text-primary">Español</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Categoría</p>
                      <p className="font-body font-bold text-primary">{currentDetailsBook.genre}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Editor</p>
                      <p className="font-body font-bold text-primary">{currentDetailsBook.publisher}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Publicado</p>
                      <p className="font-body font-bold text-primary">{currentDetailsBook.published}</p>
                    </div>
                  </div>
                </div>

              </section>

              {/* Bento Grid: Synopsis + Narrator Bio + Reviews */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left column: Synopsis & Narrator (lg:col-span-8) */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Synopsis Box */}
                  <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/25">
                    <h2 className="font-display text-lg text-primary font-bold mb-4">Sinopsis Detallada</h2>
                    <p className="font-body text-xs md:text-sm text-on-surface leading-relaxed opacity-95">
                      {currentDetailsBook.synopsis}
                    </p>
                    <div className="mt-6 flex gap-2 flex-wrap">
                      <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full font-body text-[10px] font-bold">#Literatura</span>
                      <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full font-body text-[10px] font-bold">#NarraciónPremium</span>
                      <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full font-body text-[10px] font-bold">#Clásico</span>
                    </div>
                  </div>

                  {/* Narrator Bio Box */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm">
                    <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-xl shadow border border-outline-variant/25">
                      <img
                        alt={currentDetailsBook.narrator}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7qtfn9D7Mq4XL2Meg36Hs8K-JBNz3qyiLwCRwIUBWMCyWqz-yXAKK5NU7UOS2fbAgd7Ifag_vV5dcD5pmKQWXjNPk_PyZ6ePwtUVIGLX7RHQCb3E87Oq-6tvpr_c06cAwwJgWhEIhem0EhpIwdcJQHgn0vAFvmCOp1TqCgiaj8ZQN8MCd4BR6Fu37k6cbqCMV-tMp8k_ygMfqRbYVmnnp7jzcngFeEJ7NUf3eweXp_eZBL9bceFGP8FgT1ENeZZ8YGCUj-x3slLg2"
                      />
                    </div>
                    <div className="text-center sm:text-left min-w-0">
                      <h3 className="font-display text-md text-primary font-bold mb-1">Sobre el Narrador</h3>
                      <p className="font-body text-[11px] text-on-surface-variant italic mb-3">"La voz que da vida al alma del papel."</p>
                      <p className="font-body text-xs text-on-surface leading-relaxed">
                        Reconocido actor de voz con amplia trayectoria en doblaje y audiolibros. Su entonación cálida y versátil permite sumergirse emocionalmente en cada capítulo de forma única y disfrutable.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column: Reviews (lg:col-span-4) */}
                <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
                  <div className="flex justify-between items-end pb-3 border-b border-outline-variant/20">
                    <h3 className="font-display text-sm text-primary font-bold">Opiniones</h3>
                    <button onClick={() => alert("¡Próximamente podrás dejar tu reseña!")} className="text-secondary font-body font-bold text-[10px] hover:underline cursor-pointer uppercase">Escribir</button>
                  </div>
                  
                  {/* Reviews lists */}
                  <div className="space-y-4">
                    <div className="space-y-1 pb-3 border-b border-outline-variant/15 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">Isabel R.</span>
                        <span className="text-[10px] text-secondary">★★★★★</span>
                      </div>
                      <p className="text-on-surface-variant italic">"Inolvidable. La combinación de la pluma y la voz es sencillamente hipnótica. No pude dejar de escuchar."</p>
                    </div>
                    
                    <div className="space-y-1 pb-3 border-b border-outline-variant/15 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">Javier M.</span>
                        <span className="text-[10px] text-secondary">★★★★☆</span>
                      </div>
                      <p className="text-on-surface-variant italic">"Excelente producción sonora. Los matices que aporta el narrador a cada personaje son increíbles. Muy recomendado."</p>
                    </div>
                  </div>
                </div>

              </section>

            </div>
          )}

          {/* D. SECCIÓN REPRODUCTOR INMERSIVO (Lector PDF) */}
          {currentSection === "reproductor" && (
            <div>
              {!bookInfo ? (
                /* Landing Page / Upload Screen inside page */
                <div className="space-y-12 py-4 animate-fade-in">
                  <section className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-6">
                      <span className="text-secondary-fixed-dim font-bold tracking-widest text-xs font-body block uppercase">
                        Tecnología de Lectura Inteligente
                      </span>
                      <h1 className="font-display text-display-lg-mobile md:text-headline-md lg:text-display-lg font-bold leading-tight">
                        Lector de PDFs & Audiolibro
                      </h1>
                      <p className="font-body text-body-lg text-on-primary-container max-w-xl">
                        Sube tus propios archivos PDF para dividirlos automáticamente por capítulos y escucharlos en el navegador con voces naturales.
                      </p>
                      <div className="flex gap-2 flex-wrap pt-2">
                        <span className="px-3 py-1 bg-white/10 text-on-primary rounded-full font-body text-xs uppercase tracking-wider font-semibold">
                          100% Lado del Cliente
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-on-primary rounded-full font-body text-xs uppercase tracking-wider font-semibold">
                          Cloud Storage Activo
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-64 shrink-0 flex justify-center">
                      <div className="relative group select-none">
                        <div className="absolute -inset-4 bg-secondary/20 rounded-[2rem] blur-3xl opacity-60"></div>
                        <div className="w-44 h-64 bg-gradient-to-br from-primary to-primary-container rounded-lg cover-shadow flex flex-col justify-between p-6 border border-primary-fixed/20 relative z-10">
                          <span className="text-[10px] text-on-primary-container font-body font-bold tracking-wider uppercase">Lector PDF</span>
                          <div className="space-y-1">
                            <h4 className="font-display text-md text-white leading-tight font-bold">Tu Libro PDF</h4>
                            <p className="font-body text-[10px] text-on-primary-container italic">Arrastra el archivo</p>
                          </div>
                          <div className="h-0.5 bg-secondary rounded-full w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="py-2">
                    <UploadZone
                      isLoading={isLoading}
                      progress={progress}
                      onFileSelect={handleFileSelect}
                      onLoadDemo={loadDemo}
                    />
                  </section>
                </div>
              ) : (
                /* Full Screen Reader and Player controls */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in pb-16">
                  
                  {/* Column 1: Book Info */}
                  <section className="lg:col-span-3 flex flex-col items-center text-center lg:text-left gap-6 sticky top-24">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-3xl opacity-50"></div>
                      {bookInfo.coverUrl ? (
                        <img
                          src={bookInfo.coverUrl}
                          alt={bookInfo.title}
                          className="w-48 h-72 md:w-56 md:h-84 object-cover rounded-lg cover-shadow relative z-10 border border-outline-variant/30"
                        />
                      ) : (
                        <div className="w-48 h-72 md:w-56 md:h-84 bg-gradient-to-br from-primary to-primary-container rounded-lg cover-shadow border border-primary-fixed/20 relative z-10 flex flex-col justify-between p-6 text-left">
                          <span className="text-[10px] text-on-primary-container font-body font-bold tracking-widest uppercase">Audiolibro PDF</span>
                          <div className="space-y-3">
                            <h2 className="font-display text-xl text-white leading-tight font-bold">{bookInfo.title}</h2>
                            <p className="font-body text-xs text-on-primary-container italic">{bookInfo.author}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="h-0.5 bg-secondary rounded-full w-1/4"></div>
                            <span className="material-symbols-outlined text-secondary text-2xl">headphones</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 w-full px-4 lg:px-0">
                      <h1 className="font-display text-headline-md text-primary font-bold line-clamp-2 leading-tight">{bookInfo.title}</h1>
                      <p className="font-body text-sm text-on-surface-variant italic">{bookInfo.author}</p>
                      <div className="flex gap-2 justify-center lg:justify-start flex-wrap mt-2">
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-body text-[10px] uppercase font-bold tracking-wider">{bookInfo.chapters.length} Capítulos</span>
                        <button
                          onClick={handleCloseBook}
                          className="px-2.5 py-0.5 border border-outline-variant/40 hover:border-primary text-on-surface-variant hover:text-primary transition-all rounded-full font-body text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                        >
                          Cerrar Libro
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Column 2: Reader Panel */}
                  <section className={`${activeTab === "lectura" ? "block" : "hidden lg:block"} lg:col-span-5 h-full w-full space-y-6`}>
                    {/* Mobile back / close bar */}
                    <div className="flex lg:hidden justify-between items-center bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/15 mb-3">
                      <div className="overflow-hidden min-w-0 flex-1 pr-3 text-left">
                        <span className="font-display text-xs font-bold text-primary truncate block">{bookInfo.title}</span>
                      </div>
                      <button
                        onClick={handleCloseBook}
                        className="flex items-center gap-1 text-[11px] text-error hover:bg-error-container/20 font-body font-bold py-1.5 px-3 border border-error/25 rounded-lg transition-all cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                        <span>Cerrar Libro</span>
                      </button>
                    </div>

                    {/* Mobile tabs for reader options */}
                    <div className="flex lg:hidden bg-surface-container p-1 rounded-xl border border-outline-variant/20 mb-4 text-xs font-bold font-body">
                      <button onClick={() => setActiveTab("lectura")} className={`flex-1 py-2 rounded-lg text-center ${activeTab === "lectura" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>Lectura</button>
                      <button onClick={() => setActiveTab("capitulos")} className={`flex-1 py-2 rounded-lg text-center ${activeTab === "capitulos" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>Capítulos</button>
                      <button onClick={() => setActiveTab("ajustes")} className={`flex-1 py-2 rounded-lg text-center ${activeTab === "ajustes" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>Ajustes</button>
                    </div>

                    <ReaderPanel
                      chapter={currentChapter}
                      currentSentenceIndex={currentSentenceIndex}
                      onSentenceClick={seekSentence}
                    />

                    {/* Mobile AudioPlayer Controls */}
                    <div className="block lg:hidden bg-surface-container-low p-6 rounded-xl shadow-sm border border-outline-variant/35">
                      <AudioPlayer
                        chapter={currentChapter}
                        currentSentenceIndex={currentSentenceIndex}
                        isPlaying={isPlaying}
                        playbackSpeed={playbackSpeed}
                        onPlayPause={handlePlayPause}
                        onSkipSentence={skipSentence}
                        onSeekSentence={seekSentence}
                        onSpeedChange={setPlaybackSpeed}
                      />
                    </div>
                  </section>

                  {/* Column 3: Sidebar Panel */}
                  <aside className="lg:col-span-4 flex flex-col gap-6 w-full">
                    {/* Playback Controls (Hidden on mobile active screen layouts) */}
                    <div className="hidden lg:block bg-surface-container-low p-6 rounded-xl shadow-sm border border-outline-variant/35">
                      <AudioPlayer
                        chapter={currentChapter}
                        currentSentenceIndex={currentSentenceIndex}
                        isPlaying={isPlaying}
                        playbackSpeed={playbackSpeed}
                        onPlayPause={handlePlayPause}
                        onSkipSentence={skipSentence}
                        onSeekSentence={seekSentence}
                        onSpeedChange={setPlaybackSpeed}
                      />
                    </div>

                    {/* Voice and Speech (Conditional on mobile tabs) */}
                    <div className={`${activeTab === "ajustes" ? "block" : "hidden lg:block"}`}>
                      <VoiceSettings
                        availableVoices={availableVoices}
                        selectedVoice={selectedVoice}
                        playbackSpeed={playbackSpeed}
                        speechVolume={speechVolume}
                        speechPitch={speechPitch}
                        sleepTimer={sleepTimer}
                        timerRemaining={timerRemaining}
                        onVoiceChange={setSelectedVoice}
                        onSpeedChange={setPlaybackSpeed}
                        onVolumeChange={setSpeechVolume}
                        onPitchChange={setSpeechPitch}
                        onSleepTimerChange={setSleepTimer}
                      />
                    </div>

                    {/* Chapters List (Conditional on mobile tabs) */}
                    <div className={`${activeTab === "capitulos" ? "block" : "hidden lg:block"}`}>
                      <ChapterList
                        chapters={bookInfo.chapters}
                        currentChapterIndex={currentChapterIndex}
                        isPlaying={isPlaying}
                        onChapterSelect={(idx) => {
                          seekChapter(idx);
                          setActiveTab("lectura");
                        }}
                      />
                    </div>
                  </aside>

                </div>
              )}
            </div>
          )}

          {/* E. SECCIÓN MI BIBLIOTECA */}
          {currentSection === "biblioteca" && (
            <div className="space-y-8 animate-fade-in pb-16">
              <div>
                <h2 className="font-display text-headline-md text-primary font-bold">Mi Biblioteca</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Aquí encontrarás todos los libros PDF que has cargado en este dispositivo.
                </p>
                <div className="h-0.5 w-12 bg-secondary rounded-full mt-2"></div>
              </div>

              {uploadedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {uploadedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="group relative bg-surface-container-low p-4 rounded-xl border border-outline-variant/15 hover:border-primary/30 transition-all shadow-sm flex flex-col justify-between"
                    >
                      {/* Delete button (floating on card hover) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Estás seguro de que quieres eliminar "${book.title}" de tu biblioteca?`)) {
                            deleteLibraryBook(book.id);
                          }
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Eliminar libro"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>

                      <div 
                        onClick={() => {
                          loadLibraryBook(book);
                          setCurrentSection("reproductor");
                        }}
                        className="cursor-pointer space-y-3 flex-grow"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg book-card-shadow bg-surface-container border border-outline-variant/10">
                          {book.coverUrl ? (
                            <img
                              className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                              src={book.coverUrl}
                              alt={book.title}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex flex-col justify-between p-4 text-left">
                              <span className="text-[8px] text-on-primary-container font-body font-bold tracking-widest uppercase">PDF</span>
                              <h4 className="font-display text-sm text-white leading-tight font-bold line-clamp-3">{book.title}</h4>
                              <span className="material-symbols-outlined text-secondary text-xl self-end">headphones</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 pt-1 text-left">
                          <h4 className="font-display text-xs text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                            {book.title}
                          </h4>
                          <p className="font-body text-[10px] text-on-surface-variant truncate">
                            {book.chapters.length} capítulos
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-outline-variant/10 mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            loadLibraryBook(book);
                            setCurrentSection("reproductor");
                          }}
                          className="flex-1 bg-primary text-on-primary py-1.5 rounded-lg font-body text-[10px] font-bold flex items-center justify-center gap-1 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">headphones</span>
                          <span>Leer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/35 p-6 max-w-lg mx-auto">
                  <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">folder_open</span>
                  <p className="font-display text-md text-primary font-bold">Tu biblioteca está vacía</p>
                  <p className="font-body text-xs text-on-surface-variant mt-1">
                    Ve a la sección Lector PDF y arrastra un archivo de libro PDF para procesarlo y guardarlo aquí.
                  </p>
                  <button
                    onClick={() => setCurrentSection("reproductor")}
                    className="mt-6 bg-primary text-on-primary text-xs font-body font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-primary-container shadow"
                  >
                    Subir mi primer PDF
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* 3. Persistent Floating Bottom Player Bar (Visible only when a book is loaded and user is NOT in the full player view) */}
        {bookInfo && currentSection !== "reproductor" && (
          <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-40 glass-player rounded-2xl shadow-xl p-3 flex items-center gap-4 animate-slide-up border border-outline-variant/35 select-none">
            {/* Thumbnail */}
            <div 
              onClick={() => setCurrentSection("reproductor")}
              className="w-11 h-11 rounded-lg overflow-hidden shrink-0 shadow-sm border border-outline-variant/20 cursor-pointer hover:scale-105 transition-transform"
            >
              {bookInfo.coverUrl ? (
                <img className="w-full h-full object-cover" src={bookInfo.coverUrl} alt={bookInfo.title} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-md">menu_book</span>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div 
              onClick={() => setCurrentSection("reproductor")}
              className="flex-grow min-w-0 cursor-pointer"
            >
              <p className="font-bold text-xs truncate text-primary leading-tight">{bookInfo.title}</p>
              <p className="text-[10px] text-on-surface-variant opacity-75 truncate mt-0.5">
                {currentChapter ? currentChapter.title : "Muestra"}
              </p>
            </div>

            {/* Desktop progress track */}
            {currentChapter && (
              <div className="hidden md:flex flex-col items-center justify-center gap-1 w-1/3 min-w-[180px]">
                <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${currentChapter.sentences.length > 0 ? (currentSentenceIndex / currentChapter.sentences.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-[9px] font-bold text-on-surface-variant font-mono">
                  <span>Frase {currentSentenceIndex + 1}</span>
                  <span>{currentChapter.sentences.length} frases</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => skipSentence(-2)}
                className="text-primary hover:text-secondary opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                title="Retroceder"
              >
                <span className="material-symbols-outlined text-[22px]">replay_30</span>
              </button>
              
              <button 
                onClick={handlePlayPause}
                className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
              
              <button 
                onClick={() => skipSentence(2)}
                className="text-primary hover:text-secondary opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                title="Adelantar"
              >
                <span className="material-symbols-outlined text-[22px]">forward_30</span>
              </button>
            </div>

            <button 
              onClick={handleCloseBook}
              className="hidden md:flex w-7 h-7 items-center justify-center text-outline hover:text-primary hover:bg-surface-container rounded-full cursor-pointer transition-colors"
              title="Cerrar reproductor"
            >
              <span className="material-symbols-outlined text-md">close</span>
            </button>
          </div>
        )}

        {/* 4. Mobile Bottom Navigation Bar (Visible only on mobile/tablet) */}
        <nav className="fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-4 py-2 pb-safe md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)] bg-surface-container-low/95 border-t border-outline-variant/15 backdrop-blur-lg rounded-t-xl select-none">
          <button
            onClick={() => setCurrentSection("inicio")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full cursor-pointer transition-all ${
              currentSection === "inicio"
                ? "bg-secondary-container/60 text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span className="font-body text-[9px] mt-0.5">Inicio</span>
          </button>
          
          <button
            onClick={() => setCurrentSection("explorar")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full cursor-pointer transition-all ${
              currentSection === "explorar"
                ? "bg-secondary-container/60 text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
            <span className="font-body text-[9px] mt-0.5">Explorar</span>
          </button>

          <button
            onClick={() => setCurrentSection("biblioteca")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full cursor-pointer transition-all ${
              currentSection === "biblioteca"
                ? "bg-secondary-container/60 text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">local_library</span>
            <span className="font-body text-[9px] mt-0.5">Biblioteca</span>
          </button>
          
          <button
            onClick={() => setCurrentSection("reproductor")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full cursor-pointer transition-all ${
              currentSection === "reproductor"
                ? "bg-secondary-container/60 text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">headphones</span>
            <span className="font-body text-[9px] mt-0.5">Lector</span>
          </button>
        </nav>

        {/* Ambient background glows */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-15%] w-[40%] h-[40%] rounded-full bg-primary/3 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-secondary/3 blur-[150px]"></div>
        </div>

      </main>
    </div>
  );
}
