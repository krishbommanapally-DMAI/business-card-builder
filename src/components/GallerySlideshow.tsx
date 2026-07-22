/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySlideshowProps {
  items: GalleryItem[];
  isDark?: boolean;
  primaryColor?: string;
}

export default function GallerySlideshow({ items, isDark = false, primaryColor = '#3B82F6' }: GallerySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Filter valid items
  const validItems = items && items.length > 0 ? items : [];

  useEffect(() => {
    if (!isPlaying || validItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validItems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPlaying, validItems.length]);

  if (validItems.length === 0) return null;

  const currentItem = validItems[currentIndex] || validItems[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validItems.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validItems.length);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Slideshow Frame */}
      <div 
        className={`relative w-full aspect-16/10 rounded-2xl overflow-hidden group shadow-md border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200/80'
        }`}
      >
        {/* Main Display Image */}
        {currentItem.type === 'video' ? (
          <video 
            src={currentItem.url} 
            controls 
            className="w-full h-full object-cover" 
          />
        ) : (
          <img 
            src={currentItem.url} 
            alt={currentItem.title || 'Gallery image'}
            onClick={() => setLightboxOpen(true)}
            className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in"
          />
        )}

        {/* Dark Gradient Overlay for Caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges: Counter & Play/Pause */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 tracking-wider">
            {currentIndex + 1} / {validItems.length}
          </span>

          <div className="flex items-center gap-1.5">
            {validItems.length > 1 && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
            )}
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              title="Expand Fullscreen"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        {/* Prev / Next Navigation Controls */}
        {validItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Title Caption overlay */}
        {currentItem.title && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <h5 className="text-xs font-bold text-white drop-shadow-md truncate">
              {currentItem.title}
            </h5>
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      {validItems.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-1">
          {validItems.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              style={{
                backgroundColor: idx === currentIndex ? primaryColor : undefined
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-5'
                  : `w-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'}`
              }`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white z-10">
            <span className="text-xs font-bold tracking-widest text-slate-300">
              {currentItem.title || `Photo ${currentIndex + 1} of ${validItems.length}`}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Lightbox Content */}
          <div className="relative max-w-4xl max-h-[80vh] flex items-center justify-center my-auto" onClick={(e) => e.stopPropagation()}>
            {currentItem.type === 'video' ? (
              <video src={currentItem.url} controls autoPlay className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl" />
            ) : (
              <img src={currentItem.url} alt={currentItem.title || ''} className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl" />
            )}

            {validItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Footer dots */}
          <div className="flex items-center gap-2 z-10">
            {validItems.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
