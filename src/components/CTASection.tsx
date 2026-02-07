import { Heart, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-6 py-32 text-center bg-white relative overflow-hidden">
      {/* Subtle background element to break the clinical white */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-50/50 blur-[100px] rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="h-[1px] w-12 bg-red-100" />
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <div className="h-[1px] w-12 bg-red-100" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter italic">
          Ready to <span className="text-red-500">take the leap?</span>
        </h2>
        
        <p className="text-lg text-gray-400 font-medium mb-12 max-w-md mx-auto leading-relaxed">
          Valentine’s Day is a moment. Make yours count with a message that feels like you.
        </p>

        <button className="group relative bg-gray-900 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 hover:bg-red-500 hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 hover:shadow-red-200 flex items-center gap-3 mx-auto">
          Create Your Message
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}