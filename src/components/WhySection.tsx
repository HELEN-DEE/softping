import { Heart, Sparkles, Shield } from 'lucide-react';

export default function WhySection() {
    const reasons = [
        {
        icon: Shield,
        title: "Low pressure",
        description: "No public posts. No group chats. Just you and them."
        },
        {
        icon: Heart,
        title: "Respectful",
        description: "They can say no kindly. You can ask without fear."
        },
        {
        icon: Sparkles,
        title: "Actually works",
        description: "Takes the scary out of asking. Makes the sweet part easy."
        }
    ];


    return (
    <section className="px-6 py-20  mx-auto bg-pink-50">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                Why people love SoftAsk
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                Because asking someone out shouldn&apos;t feel like jumping off a cliff
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
                {reasons.map((reason, idx) => (
                <div key={idx} className="text-center bg-white p-8 rounded-2xl border-2 border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {reason.title}
                    </h3>
                    <p className="text-gray-600">
                    {reason.description}
                    </p>
                </div>
                ))}
            </div>
        </div>
    </section>
  );
}