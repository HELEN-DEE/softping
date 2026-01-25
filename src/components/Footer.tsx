import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="px-6 py-12 bg-white border-t-2 border-red-100">
        <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            <span className="font-semibold text-gray-900">SoftAsk</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
            Made with care for the anxious romantics
            </p>
            <div className="flex gap-6 justify-center text-sm text-gray-500">
            <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-red-500 transition-colors">How it works</a>
            <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
            </div>
        </div>
        </footer>
    );
}