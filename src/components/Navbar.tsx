"use client";

import React, { useState } from 'react';
import { Heart, Menu, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 py-3">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white/90 backdrop-blur-md border-[3px] border-red-50 rounded-[2.5rem] px-8 py-3 shadow-[0_15px_40px_-12px_rgba(255,182,193,0.2)] flex items-center justify-between">
          
          {/* Logo: Removing the heavy black, using the brand red */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => router.push('/')}
          >
            <div className="bg-red-500 p-2.5 rounded-2xl -rotate-6 group-hover:rotate-0 transition-all duration-300">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black text-gray-900 tracking-tighter">
                SoftPing
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-300">
                Digital Cards
              </span>
            </div>
          </div>

          {/* Desktop Links: Lighter, more elegant spacing */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {['How it works', 'Examples'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            
            {/* CTA Button: Matches the main "Create Your Message" button color */}
            <button 
              onClick={() => router.push('/create')}
              className="bg-[#0F172A] text-white px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              Create Now <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu: Pill style */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white border-[3px] border-red-50 rounded-[3rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col gap-6 text-center">
              {['How it works', 'Examples', 'FAQ'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-xs font-black uppercase tracking-[0.2em] text-gray-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => { router.push('/create'); setIsMenuOpen(false); }}
                className="bg-red-500 text-white py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-red-100"
              >
                Create Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}