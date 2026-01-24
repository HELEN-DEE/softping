
import { Heart, Sparkles,  MessageCircle } from 'lucide-react';

export default function HowItWorks() {
        const steps = [
        {
        title: "Write your message",
        description: "Tell them how you feel, your way. We'll help you keep it sweet and simple.",
        icon: MessageCircle
        },
        {
        title: "Get your link",
        description: "We create a unique, private link just for them. Share it however you want.",
        icon: Sparkles
        },
        {
        title: "They respond gently",
        description: "They pick yes, maybe, or no in a kind, pressure-free space. No awkwardness.",
        icon: Heart
        }
    ];

    return (
        <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How it works
            </h2>
            
            
            <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
                <div key={index} className="relative">
                <div className="bg-pink-50 rounded-2xl p-8 border-2 border-red-100 hover:border-red-200 transition-all">
                    
                    <step.icon className="w-8 h-8 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                    {step.description}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

