"use client";

import React from "react";
import { Chapter } from "../hooks/useAudioBook";

interface ChapterListProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  isPlaying: boolean;
  onChapterSelect: (index: number) => void;
}

export default function ChapterList({
  chapters,
  currentChapterIndex,
  isPlaying,
  onChapterSelect,
}: ChapterListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
        <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
        <h3 className="font-display text-lg text-primary font-bold">Capítulos</h3>
      </div>
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1.5 custom-scrollbar">
        {chapters.map((chapter, index) => {
          const isActive = index === currentChapterIndex;
          return (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(index)}
              className={`w-full p-3 rounded-lg text-left transition-all flex justify-between items-center group cursor-pointer ${
                isActive
                  ? "bg-primary-fixed/20 border-l-4 border-primary shadow-sm"
                  : "bg-transparent hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <p
                  className={`font-body text-sm truncate ${
                    isActive ? "font-bold text-primary" : "text-on-surface group-hover:text-primary transition-colors"
                  }`}
                >
                  {chapter.title}
                </p>
                <p className="text-[11px] text-on-surface-variant opacity-85 mt-0.5">
                  {chapter.durationMinutes} minutos • {chapter.sentences.length} frases
                </p>
              </div>

              {isActive ? (
                isPlaying ? (
                  /* Mini equalizer anim */
                  <div className="flex items-end gap-0.5 h-6 shrink-0">
                    <span className="w-[3px] bg-primary rounded-full bar-anim"></span>
                    <span className="w-[3px] bg-primary rounded-full bar-anim"></span>
                    <span className="w-[3px] bg-primary rounded-full bar-anim"></span>
                    <span className="w-[3px] bg-primary rounded-full bar-anim"></span>
                  </div>
                ) : (
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">
                    play_arrow
                  </span>
                )
              ) : (
                <span className="material-symbols-outlined text-outline-variant text-xl opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  play_circle
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
