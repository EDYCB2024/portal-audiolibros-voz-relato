"use client";

import React from "react";

interface VoiceSettingsProps {
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  playbackSpeed: number;
  speechVolume: number;
  speechPitch: number;
  sleepTimer: number | null;
  timerRemaining: number | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onSpeedChange: (speed: number) => void;
  onVolumeChange: (volume: number) => void;
  onPitchChange: (pitch: number) => void;
  onSleepTimerChange: (minutes: number | null) => void;
  onActivateGeminiPreset: () => void;
}

export default function VoiceSettings({
  availableVoices,
  selectedVoice,
  playbackSpeed,
  speechVolume,
  speechPitch,
  sleepTimer,
  timerRemaining,
  onVoiceChange,
  onSpeedChange,
  onVolumeChange,
  onPitchChange,
  onSleepTimerChange,
  onActivateGeminiPreset,
}: VoiceSettingsProps) {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isGeminiPresetActive = 
    playbackSpeed === 0.9 && 
    speechPitch === 0.95 && 
    (selectedVoice !== null && 
      (selectedVoice.name.includes("Natural") || 
       selectedVoice.name.includes("Enhanced") || 
       selectedVoice.name.includes("Google") || 
       selectedVoice.name.includes("Sabina") || 
       selectedVoice.name.includes("Helena")));

  const getVoiceDisplayName = (voice: SpeechSynthesisVoice): string => {
    // Make names prettier
    const cleanName = voice.name
      .replace(/Microsoft|Google|Apple/g, "")
      .replace(/Desktop|Natural/g, "")
      .replace(/-|Slim/g, "")
      .trim();
    
    // Add provider indicator
    let provider = "Local";
    if (voice.name.includes("Google")) provider = "Google";
    else if (voice.name.includes("Microsoft")) provider = "Microsoft";
    else if (voice.name.includes("Apple")) provider = "Apple";

    return `${cleanName} (${provider})`;
  };

  return (
    <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-outline-variant/35 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/30">
        <span className="material-symbols-outlined text-primary">settings_voice</span>
        <h3 className="font-display text-lg text-primary font-bold">Ajustes de Narración</h3>
      </div>

      {/* Gemini Voice Preset Quick Button */}
      <div className="pb-4 border-b border-outline-variant/20">
        <button
          type="button"
          onClick={onActivateGeminiPreset}
          className={`w-full py-3 px-4 rounded-xl font-body font-bold text-sm flex items-center justify-between shadow transition-all duration-300 relative overflow-hidden group cursor-pointer ${
            isGeminiPresetActive
              ? "bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#c782ff] text-white scale-[1.01] shadow-md border-none"
              : "bg-surface-container border border-outline-variant/30 text-on-surface hover:border-[#8ab4f8]/50"
          }`}
        >
          {!isGeminiPresetActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a73e8]/5 via-[#8ab4f8]/5 to-[#c782ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          
          <div className="flex items-center gap-2 relative z-10">
            <span className={`material-symbols-outlined text-lg ${isGeminiPresetActive ? "text-white animate-pulse" : "text-primary"}`}>
              sparkles
            </span>
            <span>Voz Estilo Gemini (Cálida y Natural)</span>
          </div>
          
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full relative z-10 ${
            isGeminiPresetActive 
              ? "bg-white/20 text-white" 
              : "bg-primary/10 text-primary uppercase tracking-wider text-[8px]"
          }`}>
            {isGeminiPresetActive ? "Activo" : "Activar"}
          </span>
        </button>
        <p className="font-body text-[10px] text-on-surface-variant mt-1.5 leading-relaxed pl-1 text-left">
          Ajusta automáticamente la síntesis para emular la voz natural, cálida y pausada de Gemini.
        </p>
      </div>

      {/* Voice Selection */}
      <div className="space-y-2">
        <label className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
          Voz del Narrador
        </label>
        {availableVoices.length > 0 ? (
          <select
            value={selectedVoice?.name || ""}
            onChange={(e) => {
              const voice = availableVoices.find((v) => v.name === e.target.value);
              if (voice) onVoiceChange(voice);
            }}
            className="w-full bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 font-body text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {availableVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {getVoiceDisplayName(voice)}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-on-surface-variant italic">
            Cargando voces del navegador...
          </p>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <span>Velocidad</span>
            <span className="text-secondary font-bold">{playbackSpeed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="2.0"
            step="0.05"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full accent-secondary cursor-pointer h-1 bg-surface-variant rounded-lg appearance-none"
          />
        </div>

        {/* Pitch (Warmth) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <span>Tono (Calidez)</span>
            <span className="text-secondary font-bold">
              {speechPitch === 1.0 ? "Normal" : speechPitch < 1.0 ? "Cálido" : "Agudo"}
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.05"
            value={speechPitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            className="w-full accent-secondary cursor-pointer h-1 bg-surface-variant rounded-lg appearance-none"
          />
        </div>

        {/* Volume */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <span>Volumen</span>
            <span className="text-secondary font-bold">{Math.round(speechVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            value={speechVolume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-secondary cursor-pointer h-1 bg-surface-variant rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* Sleep Timer */}
      <div className="space-y-2 pt-2 border-t border-outline-variant/20">
        <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          <span>Temporizador de Apagado</span>
          {timerRemaining !== null && (
            <span className="text-secondary font-mono text-[11px] animate-pulse bg-secondary/10 px-2 py-0.5 rounded-full">
              {formatTime(timerRemaining)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[null, 5, 15, 30, 60].map((mins) => (
            <button
              key={mins === null ? "off" : mins}
              type="button"
              onClick={() => onSleepTimerChange(mins)}
              className={`py-1.5 px-1 rounded text-center font-body text-xs font-medium border transition-all ${
                sleepTimer === mins
                  ? "bg-secondary text-on-secondary border-secondary shadow-sm"
                  : "bg-surface-container border-outline-variant/20 hover:border-secondary/50 text-on-surface-variant"
              }`}
            >
              {mins === null ? "Off" : `${mins}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
