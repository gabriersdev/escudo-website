"use client";

import React, {useState, useEffect, useRef} from 'react';
import Image from "next/image";

export interface ImageGridProps {
  images?: string[] | string;
  urls?: string;
  baseUrl?: string;
  fileName?: string;
  range?: number[] | string;
  altContext?: string;
}

export function ImageGrid(props: ImageGridProps) {
  let images: string[] = [];
  let errorMsg: string | null = null;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  if (props.baseUrl || props.fileName || props.range) {
    if (!props.baseUrl || !props.fileName || !props.range) {
      errorMsg = "Quando usar o formato base-path, informe baseUrl, fileName e range.";
    } else if (!props.fileName.includes('[]')) {
      errorMsg = "O fileName deve conter '[]' como placeholder para a numeração (Ex: apresentacao-[].png).";
    } else {
      let parsedRange: number[] = [];
      if (typeof props.range === 'string') {
        try {
          parsedRange = JSON.parse(props.range);
        } catch {
          parsedRange = props.range.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        }
      } else if (Array.isArray(props.range)) {
        parsedRange = props.range;
      }
      
      if (!Array.isArray(parsedRange) || parsedRange.length === 0) {
        errorMsg = "O range fornecido é inválido. Use [inicio, fim] ou [num1, num2, num3].";
      } else {
        let numbersToUse: number[] = [];
        if (parsedRange.length === 2) {
          const start = parsedRange[0];
          const end = parsedRange[1];
          if (start > end) {
            errorMsg = "No range [inicio, fim], o início deve ser menor ou igual ao fim.";
          } else {
            for (let i = start; i <= end; i++) {
              numbersToUse.push(i);
            }
          }
        } else {
          numbersToUse = parsedRange;
        }
        
        if (!errorMsg) {
          images = numbersToUse.map(num => {
            const name = props.fileName!.replace('[]', num.toString());
            const baseUrl = props.baseUrl!.endsWith('/') ? props.baseUrl : `${props.baseUrl}/`;
            return `${baseUrl}${name}`;
          });
        }
      }
    }
  } else {
    let rawImages = props.images;
    if (typeof props.urls === 'string') {
      rawImages = props.urls.split(',').map((u: string) => u.trim());
    } else if (typeof rawImages === 'string') {
      try {
        rawImages = JSON.parse(rawImages);
      } catch {
        rawImages = (rawImages as string).split(',').map((u: string) => u.trim());
      }
    }
    if (Array.isArray(rawImages)) {
      images = rawImages;
    }
  }
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (selectedImage && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!selectedImage && dialog.open) {
      dialog.close();
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setSelectedImage(null);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);
  
  if (errorMsg) {
    return (
      <div className="p-4 border-2 border-red-500 rounded my-8 text-black bg-white">
        <p className="font-bold text-red-500">Erro: {errorMsg}</p>
        <pre className="text-sm mt-2 overflow-auto">Props: {JSON.stringify(props, null, 2)}</pre>
      </div>
    );
  }
  
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="p-4 border-2 border-red-500 rounded my-8 text-black bg-white">
        <p className="font-bold text-red-500">Erro: ImageGrid carregou, mas não recebeu imagens válidas.</p>
        <pre className="text-sm mt-2 overflow-auto">Props: {JSON.stringify(props, null, 2)}</pre>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 cursor-pointer group"
            onClick={() => setSelectedImage(src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              width={1000}
              height={1000}
              src={src}
              alt={props.altContext ? `${props.altContext} - Imagem ${idx + 1}` : `Imagem do grid #${idx + 1}`}
              className="w-full h-full object-cover !m-0 transition-transform duration-300 group-hover:scale-105  bg-white"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
            />
          </div>
        ))}
      </div>
      
      <dialog
        ref={dialogRef}
        className={`backdrop:bg-gray-900/90 backdrop:backdrop-blur-sm bg-transparent fixed inset-0 z-50 m-0 w-full max-w-none h-full items-center justify-center p-4 sm:p-12 ${selectedImage ? 'flex' : 'hidden'}`}
        onClick={(e) => {
          if (e.target === dialogRef.current) setSelectedImage(null);
        }}
      >
        {selectedImage && (
          <div className="relative w-full h-full max-w-6xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              width={1920}
              height={1080}
              src={selectedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain rounded-md  bg-white"
              priority
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 sm:-top-8 sm:-right-8 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
