"use client";

import React, { useRef, useState } from 'react';
import { Heart, Palette } from 'lucide-react';

export default function ExampleSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress || 0);
    }
  };

  const templates = [
    {
      name: "Classic Red",
      id: "classic",
      content: (
        <div className="bg-white p-8 h-full flex flex-col items-center text-center border-2 border-red-50 rounded-4xl">
          <div className="w-12 h-12 bg-[#ef4444] rounded-2xl flex items-center justify-center mb-6 rotate-3 shadow-md">
            <Heart className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tighter text-center">Dearest Jamie,</h3>
          <p className="text-gray-600 text-sm font-bold italic leading-relaxed mb-6">&quot;Would you maybe want to grab coffee this Valentine&apos;s? No pressure at all 💕&quot;</p>
        </div>
      )
    },
    {
      name: "Architectural Modern",
      id: "modern",
      content: (
        <div className="bg-white p-8 h-full flex flex-col border border-gray-100 rounded-4xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 blur-3xl rounded-full -mr-12 -mt-12" />
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-black text-gray-900 tracking-tighter">Hi.</span>
            <div className="h-2 w-2 bg-[#ef4444] rounded-full" />
          </div>
          <div className="border-l-2 border-red-100 pl-4 mb-6">
            <p className="text-gray-900 text-sm font-medium leading-snug tracking-tight italic">&quot;I&apos;ve been wanting to ask you something for a while now...&quot;</p>
          </div>
        </div>
      )
    },
    {
      name: "Champagne Elegant",
      id: "elegant",
      content: (
        <div className="bg-[#FFFCFB] p-8 h-full flex flex-col items-center text-center border border-[#F5EBE0] rounded-4xl">
          <div className="mb-6 opacity-40">
            <svg width="30" height="15" viewBox="0 0 40 20" fill="none" className="text-[#D4A373]">
              <path d="M0 10C10 10 10 0 20 0C30 0 30 10 40 10C30 10 30 20 20 20C10 20 10 10 0 10Z" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-lg font-serif italic text-[#6B5E51] mb-6 tracking-tight">For Jamie</h3>
          <p className="text-[#8D7B6D] text-sm font-serif leading-loose italic mb-6">&quot;If you&apos;re free, I&apos;d love to take you to that new spot ✨&quot;</p>
        </div>
      )
    }
  ];

  return (
    <section id='examples' className="px-6 pt-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full mb-3">
              <Palette size={12} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">The Gallery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic">
              Beautifully <span className="text-red-500 text-shadow-sm">Personal.</span>
            </h2>
          </div>
          <p className="text-gray-400 font-medium max-w-xs text-sm leading-relaxed">
            Choose a style that matches your vibe. Clean, bold, or classic.
          </p>
        </div>

        {/* Desktop: Grid (all visible, no scroll) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
          {templates.map((card) => (
            <div key={card.id} className="h-100">
              {card.content}
            </div>
          ))}
        </div>

        {/* Mobile/Tablet: Carousel (with custom progress bar, NO scrollbar) */}
        <div className="md:hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar"
          >
            {templates.map((card) => (
              <div key={card.id} className="flex-none w-70 sm:w-[320px] h-80 snap-center">
                {card.content}
              </div>
            ))}
          </div>

          {/* Custom Progress Bar (Mobile Only) */}
          <div className="max-w-xs mx-auto mt-4">
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${Math.max(scrollProgress, 33.33)}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 px-1">
              <span>Swipe</span>
              <span>{templates.length} Styles</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* CSS to completely hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
}