"use client";

import React from "react";
import { Chapter } from "../hooks/useAudioBook";

interface AudioPlayerProps {
  chapter: Chapter | null;
  currentSentenceIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  
  onPlayPause: () => void;
  onSkipSentence: (delta: number) => void;
  onSeekSentence: (index: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function AudioPlayer({
  chapter,
  currentSentenceIndex,
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSkipSentence,
  onSeekSentence,
  onSpeedChange,
}: AudioPlayerProps) {
  if (!chapter) return null;

  const totalSentences = chapter.sentences.length;
  const sentenceProgressPercent = totalSentences > 0 
    ? (currentSentenceIndex / totalSentences) * 100 
    : 0;

  // Time calculations based on estimated chapter duration
  const totalSeconds = chapter.durationMinutes * 60;
  const elapsedSeconds = totalSentences > 0
    ? Math.round((currentSentenceIndex / totalSentences) * totalSeconds)
    : 0;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value);
    const targetIdx = Math.min(
      totalSentences - 1,
      Math.max(0, Math.floor((percent / 100) * totalSentences))
    );
    onSeekSentence(targetIdx);
  };

  const speeds = [1.0, 1.25, 1.5, 2.0];
  const toggleSpeed = () => {
    const currentIdx = speeds.indexOf(playbackSpeed);
    const nextIdx = (currentIdx + 1) % speeds.length;
    onSpeedChange(speeds[nextIdx]);
  };

  return (
    <div className="space-y-6">
      {/* Time and Progress Slider */}
      <div className="space-y-3">
        <div className="flex justify-between font-body text-xs font-bold text-on-surface-variant">
          <span>{formatTime(elapsedSeconds)}</span>
          <span>-{formatTime(remainingSeconds)}</span>
        </div>
        
        {/* Customized Progress Bar */}
        <div className="relative w-full h-2 bg-surface-variant rounded-full group">
          <div 
            className="absolute top-0 left-0 h-full bg-secondary rounded-full"
            style={{ width: `${sentenceProgressPercent}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={sentenceProgressPercent}
            onChange={handleProgressChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer accent-secondary"
          />
          {/* Mock thumb hover styling */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary border-2 border-white shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${sentenceProgressPercent}% - 8px)` }}
          ></div>
        </div>
      </div>

      {/* Main Player Controls */}
      <div className="flex items-center justify-between px-2 pt-2">
        {/* Speed button */}
        <button
          type="button"
          onClick={toggleSpeed}
          className="text-on-surface-variant hover:text-primary transition-colors text-sm font-bold min-w-[48px] py-2 bg-surface-container rounded-lg border border-outline-variant/20 hover:scale-95 active:scale-95 transition-all text-center"
          title="Cambiar Velocidad"
        >
          {playbackSpeed.toFixed(2)}x
        </button>

        {/* Play/Pause controls */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onSkipSentence(-2)} // Jump back ~2 sentences
            className="text-on-surface-variant hover:text-secondary hover:scale-110 transition-all active:scale-90"
            title="Retroceder Frase"
          >
            <span className="material-symbols-outlined text-3xl">replay_30</span>
          </button>
          
          <button
            type="button"
            onClick={onPlayPause}
            className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform relative z-10">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <button
            type="button"
            onClick={() => onSkipSentence(2)} // Jump forward ~2 sentences
            className="text-on-surface-variant hover:text-secondary hover:scale-110 transition-all active:scale-90"
            title="Adelantar Frase"
          >
            <span className="material-symbols-outlined text-3xl">forward_30</span>
          </button>
        </div>

        {/* Dummy Bookmark button to balance interface */}
        <button
          type="button"
          onClick={() => alert("Marcador guardado en la posición actual (Demostración).")}
          className="text-on-surface-variant hover:text-primary py-2 px-3 bg-surface-container rounded-lg border border-outline-variant/20 hover:scale-95 active:scale-95 transition-all"
          title="Agregar Marcador"
        >
          <span className="material-symbols-outlined text-xl">bookmark</span>
        </button>
      </div>

      {/* Extra Actions */}
      <div className="flex justify-around pt-4 border-t border-outline-variant/30 text-center">
        <div className="flex flex-col items-center gap-0.5 text-xs text-on-surface-variant font-medium">
          <span className="text-secondary font-bold font-mono">
            {currentSentenceIndex + 1} / {totalSentences}
          </span>
          <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Frase Actual</span>
        </div>
        
        <div className="flex flex-col items-center gap-0.5 text-xs text-on-surface-variant font-medium">
          <span className="text-primary font-bold">
            {chapter.durationMinutes}m
          </span>
          <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Duración Est.</span>
        </div>
      </div>
    </div>
  );
}
