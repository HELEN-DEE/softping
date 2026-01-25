import { Heart } from "lucide-react";

export default function CTASection() {
    return (
    <section className="px-6 py-20 text-center  bg-pink-50">
      <div className="flex justify-center gap-2 max-w-3xl mx-auto mb-6">
        <Heart className="w-8 h-8 text-red-400 animate-pulse" fill="currentColor" />
        <Heart className="w-10 h-10 text-red-500 animate-pulse" fill="currentColor" style={{animationDelay: '0.2s'}} />
        <Heart className="w-8 h-8 text-red-400 animate-pulse" fill="currentColor" style={{animationDelay: '0.4s'}} />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Ready to take the leap?
      </h2>
      <p className="text-xl text-gray-600 mb-10">
        Valentine&apos;s Day is coming. Make it count without the stress.
      </p>
      <button className="bg-red-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-red-600 hover:shadow-lg transition-all duration-200">
        Create Your Message Now
      </button>
    </section>
  );
}