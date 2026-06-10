"use client";

import React, { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface UploadZoneProps {
  isLoading: boolean;
  progress: number;
  onFileSelect: (file: File) => void;
  onLoadDemo: () => void;
}

export default function UploadZone({
  isLoading,
  progress,
  onFileSelect,
  onLoadDemo,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Por favor, sube solo archivos PDF.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  };

  if (isLoading) {
    // Dynamic text based on current progress
    let loadingMessage = "Estamos extrayendo el texto del PDF y dividiendo los capítulos automáticamente.";
    let loadingTitle = "Procesando tu libro...";

    if (progress <= 15) {
      loadingTitle = "Subiendo a la nube...";
      loadingMessage = "Subiendo archivo PDF original a Supabase Storage...";
    } else if (progress <= 35) {
      loadingTitle = "Inicializando lector...";
      loadingMessage = "Preparando motor de extracción de páginas del PDF...";
    } else if (progress <= 48) {
      loadingTitle = "Generando portada...";
      loadingMessage = "Renderizando la primera página y subiéndola como portada física...";
    } else if (progress <= 90) {
      loadingTitle = "Leyendo texto...";
      loadingMessage = "Extrayendo texto y analizando la estructura de las páginas...";
    } else if (progress > 90) {
      loadingTitle = "Segmentando capítulos...";
      loadingMessage = "Separando el contenido en capítulos y calculando tiempos de lectura...";
    }

    return (
      <div className="w-full max-w-xl mx-auto p-12 bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/30 text-center space-y-8">
        <div className="flex justify-center">
          <span className="material-symbols-outlined text-primary text-6xl animate-bounce">
            menu_book
          </span>
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-headline-md text-primary font-bold">
            {loadingTitle}
          </h2>
          <p className="font-body text-on-surface-variant max-w-sm mx-auto text-sm min-h-[40px]">
            {loadingMessage}
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="font-body text-xs font-bold text-secondary">
            {progress}% Completado
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={handleChange}
      />
      <div
        onClick={onButtonClick}
        className={`w-full p-12 bg-surface-container-low rounded-xl border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center gap-6 cursor-pointer relative group ${
          isDragActive
            ? "border-secondary bg-primary-fixed/10 scale-[1.01]"
            : "border-outline-variant hover:border-primary hover:bg-surface-container transition-colors"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        
        {/* Ambient glow */}
        <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
          <span className="material-symbols-outlined text-primary text-4xl">
            upload_file
          </span>
        </div>

        <div className="space-y-2 relative z-10">
          <h3 className="font-display text-headline-md text-primary">
            Sube tu archivo PDF
          </h3>
          <p className="font-body text-on-surface-variant text-sm max-w-xs mx-auto">
            Arrastra tu PDF aquí o haz clic para explorar tus archivos.
          </p>
        </div>

        <button
          type="button"
          onClick={onButtonClick}
          className="bg-primary text-on-primary font-body font-bold px-6 py-2.5 rounded-full hover:bg-primary-container transition-all active:scale-95 text-sm shadow-md z-10"
        >
          Seleccionar Archivo
        </button>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-outline-variant/35"></div>
        <span className="font-body text-xs font-bold text-outline uppercase tracking-wider">
          O prueba de inmediato
        </span>
        <div className="h-px flex-1 bg-outline-variant/35"></div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onLoadDemo();
        }}
        className="w-full py-4 bg-secondary text-on-secondary font-body font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-95 shadow-lg group relative overflow-hidden"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
          auto_stories
        </span>
        <span>Cargar Libro Demo ("El Principito")</span>
        {/* Soft pulse overlay for premium call-to-action */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>

      {/* Connection status indicator */}
      <div className="flex justify-center items-center gap-2 text-[11px] font-body text-on-surface-variant bg-surface-container/40 py-2 px-4 rounded-full border border-outline-variant/15 w-fit mx-auto shadow-sm select-none">
        <span className={`relative flex h-2 w-2`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${supabase ? "bg-emerald-400" : "bg-amber-400"}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${supabase ? "bg-emerald-600" : "bg-amber-500"}`}></span>
        </span>
        <span className="font-semibold uppercase tracking-wider text-[9px] opacity-80">
          {supabase ? "Modo Nube Activo" : "Modo Local Activo"}
        </span>
        <span className="text-outline">|</span>
        <span>
          {supabase 
            ? "Los PDFs y portadas se guardan en Supabase Storage" 
            : "No se detectaron variables de entorno, usando almacenamiento local"}
        </span>
      </div>
    </div>
  );
}
