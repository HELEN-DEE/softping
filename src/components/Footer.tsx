import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 py-12 bg-white border-t border-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo & Tagline - Kept exactly as your original */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">SoftPing</span>
            </div>
            <p className="text-gray-400 text-xs font-medium tracking-wide">
              Helping the anxious romantics
            </p>
          </div>

          {/* Personal Signature & Date */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium italic">
              <span>Designed with</span>
              <Heart className="w-2.5 h-2.5 text-gray-300 fill-current" />
              <span>by <span className="text-gray-400 not-italic font-bold hover:text-red-400 transition-colors cursor-default">Helen Dee</span></span>
            </div>
            <p className="text-[10px] text-gray-300 font-medium">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}