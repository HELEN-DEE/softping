"use client";

import React from 'react';
import { Heart, ArrowRight, Sparkle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  
  return (
    <section className="relative px-6 pt-28 pb-18 overflow-hidden bg-[#FFF9FA]">
      
      {/* --- ARTISTIC ELEMENTS (The "Non-AI" Touch) --- */}
      
      {/* Hand-drawn Loop/Doodle (Top Left) */}
      <svg className="absolute top-20 left-10 w-32 h-32 text-red-100 opacity-50 -rotate-12 hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10,50 Q25,10 50,50 T90,50" strokeLinecap="round" />
        <circle cx="90" cy="50" r="3" fill="currentColor" />
      </svg>

      {/* Floating Decorative Line (Bottom Right) */}
      <div className="absolute bottom-20 right-20 hidden lg:block">
        <svg className="w-48 h-24 text-red-200 opacity-40" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0,80 Q50,20 100,80 T200,20" />
          <path d="M5,85 Q55,25 105,85 T205,25" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Modern Label */}
        <div className="inline-flex items-center gap-3 bg-white px-4 py-1.5 rounded-full border border-red-100 mb-10 group cursor-default">
          <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-red-500 transition-colors">
            Made for the anxious hearts
          </span>
        </div>
        
        {/* Heading with "Ink Blot" styling */}
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[0.95] tracking-tighter">
          Ask them out, <br />
          <span className="relative inline-block mt-4">
            <span className="text-red-500 italic">without the anxiety.</span>
            {/* Organic SVG Underline */}
            <svg className="absolute -bottom-4 left-0 w-full h-4 text-red-100" viewBox="0 0 300 20" preserveAspectRatio="none">
              <path d="M5,15 Q150,5 295,15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-14 max-w-lg mx-auto font-medium leading-relaxed">
          Create a personalized digital card in seconds. We handle the delivery and track the response, so you can just focus on being you.
        </p>
        
        {/* Elevated Button Action */}
        <div className="flex flex-col items-center gap-6">
          <button 
            className="group relative bg-gray-900 text-white px-5 py-5 md:px-12 md:py-7 rounded-[2.5rem] text-xl font-black hover:bg-red-500 transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-red-200 active:scale-95 flex items-center gap-4"
            onClick={() => router.push('/create')}
          >
            Create your Message
            <div className="bg-white/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
              <ArrowRight size={20} />
            </div>
          </button>

          {/* Sweet Footer Note */}
          <div className="flex items-center gap-3 text-gray-400">
            <Sparkle size={16} className="fill-current" />
            <span className="text-[11px] font-black uppercase tracking-widest">No pressure • Just vibes</span>
            <Sparkle size={16} className="fill-current" />
          </div>
        </div>

        {/* Decorative Scatter Hearts (Clean & Minimal) */}
        <div className="mt-20 flex justify-center items-center gap-12 opacity-20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <Heart size={20} className="text-red-400" />
            <div className="w-2 h-2 rotate-45 border border-red-400" />
            <Heart size={24} className="text-red-400" fill="currentColor" />
            <div className="w-2 h-2 rounded-full border border-red-400" />
            <Heart size={20} className="text-red-400" />
            <div className="w-1.5 h-1.5 bg-red-400" />
        </div>
      </div>

      {/* The "Paper" Border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 border-t border-dashed border-red-300" />
    </section>
  );
};