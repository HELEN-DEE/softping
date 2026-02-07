import { Shield, Heart, Sparkles, Wand2 } from 'lucide-react';

export default function WhySection() {
    const reasons = [
        {
            icon: Shield,
            title: "Private & Low Stakes",
            description: "No group chat 'oohs' and 'aahs.' It's just a private link for two people to be real with each other.",
            rotation: "-rotate-1"
        },
        {
            icon: Heart,
            title: "Kindness First",
            description: "We built this to make 'Yes' exciting and 'No' easy. No pressure, no awkwardness, just clarity.",
            rotation: "rotate-2"
        },
        {
            icon: Sparkles,
            title: "Live Excitement",
            description: "The tracker lets you know the second they've seen it. No more staring at gray checkmarks for hours.",
            rotation: "-rotate-1"
        }
    ];

    return (
    <section className="px-6 py-24 bg-[#FFF9FA] relative">
        {/* Decorative divider line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-red-100 to-transparent" />

        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20 relative">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic">
                    Is this actually <span className="text-red-500">necessary?</span>
                </h2>
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                        Maybe not. But jumping off a cliff isn&apos;t necessary either—we just think a 
                        <span className="text-gray-900 font-bold"> soft landing </span> is nicer.
                    </p>
                    {/* Hand-drawn style arrow or squiggle */}
                    <svg className="w-12 h-12 text-red-200 mt-2" viewBox="0 0 50 50" fill="none" stroke="currentColor">
                        <path d="M25,5 Q25,25 45,25 M25,5 Q25,25 5,25" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
                {reasons.map((reason, idx) => (
                <div 
                    key={idx} 
                    className={`relative bg-white p-10 rounded-[3rem] border border-red-50 shadow-[0_15px_40px_rgba(255,182,193,0.1)] transition-all hover:shadow-[0_20px_50px_rgba(255,182,193,0.2)] hover:-translate-y-2 ${reason.rotation}`}
                >
                    {/* Floating Icon */}
                    <div className="absolute -top-6 left-10 w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                        <reason.icon className="w-6 h-6 text-red-400" />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-4 mt-4">
                        {reason.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        {reason.description}
                    </p>
                    
                    {/* Subtle numbering or flourish */}
                    <span className="absolute bottom-6 right-8 text-[10px] font-black text-red-100 tracking-[0.5em]">
                        0{idx + 1}
                    </span>
                </div>
                ))}
            </div>

            {/* Bottom "Final Thought" */}
            <div className="mt-24 text-center">
                <div className="inline-flex items-center gap-4 bg-white border border-red-100 px-8 py-4 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
                    <Wand2 size={18} className="text-red-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 leading-none">
                        Because <span className="text-red-500">your heart</span> deserves a gentler way.
                    </span>
                </div>
            </div>
        </div>
    </section>
  );
}