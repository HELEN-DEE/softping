"use client";

import React, { } from 'react';
import { Heart} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  
  return (
    <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
      <div className="inline-block mb-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-red-200 shadow-sm">
          <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
          <span className="text-sm text-red-600 font-medium">Made for the anxious hearts</span>
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Ask them out,<br />
        <span className="text-red-500">
          without the anxiety
        </span>
      </h1>
      
      <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
        Create a gentle, pressure-free way to ask someone out this Valentine&apos;s. 
        No awkward texts. No fear. Just a sweet message and a link.
      </p>
      
      <button className="bg-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-600 hover:shadow-lg transition-all duration-200"
        onClick={() => router.push('/create')}
      >
        Create Your Message
      </button>
      
      <p className="text-sm text-gray-500 mt-4">
        No signup required • Takes 2 minutes • Completely free
      </p>
      
      {/* Decorative hearts */}
      <div className="mt-12 flex justify-center gap-3">
        <Heart className="w-6 h-6 text-red-300" fill="currentColor" />
        <Heart className="w-5 h-5 text-red-400 mt-2" fill="currentColor" />
        <Heart className="w-7 h-7 text-red-500" fill="currentColor" />
        <Heart className="w-5 h-5 text-red-400 mt-2" fill="currentColor" />
        <Heart className="w-6 h-6 text-red-300" fill="currentColor" />
      </div>
    </section>
  );
};
