import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 py-16 bg-white border-t border-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">SoftAsk</span>
            </div>
            <p className="text-gray-400 text-xs font-medium tracking-wide">
              Helping the anxious romantics since 2026.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              <a href="#" className="hover:text-red-500 transition-colors">How it works</a>
              <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
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