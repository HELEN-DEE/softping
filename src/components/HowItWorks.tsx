import {ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
        title: "Design your vibe",
        description: "Pick a style that feels like you. Write your heart out or use one of our templates.",
        
        tag: "The Craft"
        },
        {
        title: "Share the magic",
        description: "Get a unique, private link. Send it via DM, WhatsApp, or even a QR code.",
        
        tag: "The Spark"
        },
        {
        title: "Watch it happen",
        description: "Get notified when they open it and see their response in your private dashboard.",
        
        tag: "The Reveal"
        }
    ];

    return (
        <section id="how-it-works" className="px-6 py-32 bg-white relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 800 800">
            <path d="M0,400 Q200,100 400,400 T800,400" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic">
                Three steps to <span className="text-red-500">yes.</span>
            </h2>
            <div className="w-24 h-1 bg-red-100 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-red-100 -translate-y-1/2 z-0" />

            {steps.map((step, index) => (
                <div key={index} className="relative group z-10">
                {/* Step Card */}
                <div className="bg-white p-8 rounded-[3rem] border-[3px] border-red-50 shadow-[0_10px_30px_rgba(255,182,193,0.05)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(255,182,193,0.15)] group-hover:-translate-y-3 flex flex-col items-center text-center">
                    
                    

                    <div className="inline-block px-3 py-1 bg-red-50 rounded-full mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-400">
                        {step.tag}
                    </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">
                    {step.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {step.description}
                    </p>

                    {/* Numbering Ornament */}
                    <div className="mt-8 w-10 h-10 rounded-full border border-red-100 flex items-center justify-center text-[10px] font-black text-red-200">
                    0{index + 1}
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* Bottom CTA to keep them moving */}
            <div className="mt-20 text-center">
            <button className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors group">
                See Example Cards <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            </div>
        </div>
        </section>
    );
}