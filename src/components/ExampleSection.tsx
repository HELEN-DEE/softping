import { Heart } from "lucide-react";

export default function ExampleSection() {
    return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Here&apos;s what they&apos;ll see
        </h2>
        <div className="flex justify-center mb-12">
          <Heart className="w-8 h-8 text-red-400" fill="currentColor" />
        </div>
        
        <div className="bg-pink-50 rounded-3xl shadow-lg p-8 md:p-12 border-2 border-red-100">
          <div className="text-center mb-8">
            <div className="inline-block bg-white border-2 border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              From Alex
            </div>
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 mb-8 border-2 border-red-100">
            <p className="text-gray-700 text-lg leading-relaxed">
              Hey! I know this is a little different, but I&apos;ve been wanting to ask you something. 
              Would you maybe want to grab coffee this Valentine&apos;s? No pressure at all – just thought it could be nice 💕
            </p>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-red-500 text-white py-4 rounded-full font-semibold hover:bg-red-600 transition-all border-2 border-red-500">
              Yes, I&apos;d love to! 💖
            </button>
            <button className="w-full bg-white text-red-500 py-4 rounded-full font-semibold hover:bg-red-50 transition-all border-2 border-red-200">
              Maybe, let&apos;s talk 💭
            </button>
            <button className="w-full bg-white text-gray-600 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200">
              Not right now 🤍
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}