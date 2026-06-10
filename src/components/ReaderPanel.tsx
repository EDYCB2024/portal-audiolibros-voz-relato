"use client";

import React, { useEffect, useRef } from "react";
import { Chapter } from "../hooks/useAudioBook";

interface ReaderPanelProps {
  chapter: Chapter | null;
  currentSentenceIndex: number;
  onSentenceClick: (index: number) => void;
}

export default function ReaderPanel({
  chapter,
  currentSentenceIndex,
  onSentenceClick,
}: ReaderPanelProps) {
  const activeRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active sentence
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSentenceIndex]);

  if (!chapter) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8 bg-surface-container/30 rounded-xl border border-outline-variant/20">
        <p className="font-body text-sm text-on-surface-variant italic">
          Carga un audiolibro para comenzar a leer y escuchar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/35 flex flex-col h-[480px]">
      <div className="pb-4 border-b border-outline-variant/30 shrink-0">
        <h2 className="font-display text-xl text-primary font-bold">{chapter.title}</h2>
        <p className="font-body text-xs text-on-surface-variant mt-1">
          Haz clic en cualquier frase para saltar la narración directamente allí.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mt-6 pr-2 custom-scrollbar font-body text-base md:text-lg leading-relaxed text-on-surface text-justify space-y-4"
      >
        <p>
          {chapter.sentences.map((sentence, index) => {
            const isActive = index === currentSentenceIndex;
            return (
              <span
                key={index}
                ref={isActive ? activeRef : null}
                onClick={() => onSentenceClick(index)}
                className={`cursor-pointer transition-all duration-300 inline mr-2 ${
                  isActive
                    ? "sentence-highlight font-semibold text-primary"
                    : "hover:text-primary hover:bg-primary-fixed/10"
                }`}
                title="Haz clic para escuchar desde aquí"
              >
                {sentence}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
