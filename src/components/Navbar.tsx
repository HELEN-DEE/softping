"use client";

import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';

export default function Navbar() {

     const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b-2 border-red-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SoftPing</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
              How it works
            </a>
            <a href="#examples" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
              Examples
            </a>
            <a href="#faq" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
              FAQ
            </a>
            <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-all">
              Create Message
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-red-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col gap-4">
              <a 
                href="#how-it-works" 
                className="text-gray-700 hover:text-red-500 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How it works
              </a>
              <a 
                href="#examples" 
                className="text-gray-700 hover:text-red-500 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Examples
              </a>
              <a 
                href="#faq" 
                className="text-gray-700 hover:text-red-500 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all w-full">
                Create Message
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
