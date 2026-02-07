"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Loader2, Check, Send, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toPng } from 'html-to-image';

// --- TYPES ---
type MessageData = {
  id: string;
  senderName: string | null;
  recipientName: string | null;
  messageText: string;
  theme: string;
  cardStyle: string;
  activities: string[];
};

type Particle = {
  id: number;
  angle: number;
  velocity: number;
  size: number;
  color: string;
  rotation: number;
};

// --- HEART EXPLOSION COMPONENT ---
const HeartExplosion = ({ trigger }: { trigger: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 60 }).map((_, i) => ({
        id: Math.random(),
        angle: Math.random() * 360,
        velocity: Math.random() * 15 + 10,
        size: Math.random() * 25 + 15,
        color: i % 3 === 0 ? "#ff4d6d" : i % 3 === 1 ? "#ff85a1" : "#ffb3c1",
        rotation: Math.random() * 360,
      }));
      const showTimer = setTimeout(() => setParticles(newParticles), 0);
      const hideTimer = setTimeout(() => setParticles([]), 4000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-100 flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-explode"
          style={{
            '--angle': `${p.angle}deg`,
            '--velocity': `${p.velocity}`,
            '--rotation': `${p.rotation}deg`,
          } as React.CSSProperties}
        >
          <Heart size={p.size} fill={p.color} className="text-transparent" />
        </div>
      ))}
    </div>
  );
};

export default function MessagePage() {
  const params = useParams();
  const token = params.token as string;
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<MessageData | null>(null);
  const [selectedResponse, setSelectedResponse] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [replyText, setReplyText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  const activitiesList = [
    { id: 'coffee', label: '☕ Coffee', icon: '☕' },
    { id: 'movie', label: '🎬 Movie', icon: '🎬' },
    { id: 'dinner', label: '🍽️ Dinner', icon: '🍽️' },
    { id: 'walk', label: '🚶 Walk', icon: '🚶' }
  ];

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/messages/${token}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Message not found');
        } else {
          setMessage(data.message);
          setTimeout(() => setShowExplosion(true), 300);
        }
      } catch  {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMessage();
  }, [token]);

  useEffect(() => {
  if (token) {
    // This calls the PATCH method we just added above
    fetch(`/api/messages/${token}`, { method: 'PATCH' })
      .then(() => console.log("Status updated to Seen"))
      .catch(err => console.error("Update failed", err));
  }
}, [token]);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#FFF9FA',
      });
      const link = document.createElement('a');
      link.download = `ValentineCard.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Could not save image automatically. Please take a screenshot!");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedResponse) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message?.id,
          responseType: selectedResponse,
          selectedActivity: selectedActivity || null,
          replyText: replyText || null,
        }),
      });
      if (response.ok) setSubmitted(true);
    } catch  {
      alert('Error sending response.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFF9FA] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#FFF9FA] flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center border border-red-50 max-w-md">
        <Heart className="w-12 h-12 text-red-100 mx-auto mb-4" />
        <h2 className="text-xl font-black text-gray-800">{error}</h2>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-[#FFF9FA] flex items-center justify-center px-4">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-red-50">
        <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
          <Check className="w-10 h-10 text-white -rotate-12" strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">Sent! 💕</h2>
        <p className="text-gray-500 font-medium italic">Your response has been delivered.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9FA] py-12 px-4 relative flex flex-col items-center overflow-x-hidden">
      <HeartExplosion trigger={showExplosion} />

      <div className="max-w-xl w-full relative z-10 space-y-8 animate-in fade-in duration-700">
        
        

        <div ref={cardRef} className="rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(255,182,193,0.2)]">
          {message && (
            <>
              {message.cardStyle === 'classic' && <ClassicCard message={message} />}
              {message.cardStyle === 'minimalist' && <MinimalistCard message={message} />}
              {message.cardStyle === 'playful' && <PlayfulCard message={message} />}
              {message.cardStyle === 'elegant' && <ElegantCard message={message} />}
              {message.cardStyle === 'modern' && <ModernCard message={message} />}
            </>
          )}
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-10 border border-red-50">
          <h3 className="text-2xl font-black text-gray-900 text-center mb-8 italic">How do you feel?</h3>
          
          <div className="grid gap-3 mb-8">
            <button 
              onClick={() => { setSelectedResponse('yes'); setShowExplosion(false); setTimeout(() => setShowExplosion(true), 10); }} 
              className={`py-5 rounded-2xl font-black text-sm border-2 transition-all ${selectedResponse === 'yes' ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-red-100'}`}
            >
              Yes, I&apos;d love to! 💖
            </button>
            <button onClick={() => setSelectedResponse('maybe')} className={`py-5 rounded-2xl font-black text-sm border-2 transition-all ${selectedResponse === 'maybe' ? 'bg-purple-500 border-purple-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-purple-200'}`}>Let&apos;s talk 💭</button>
            <button onClick={() => setSelectedResponse('no')} className={`py-5 rounded-2xl font-black text-sm border-2 transition-all ${selectedResponse === 'no' ? 'bg-gray-800 border-gray-800 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>Not right now 🤍</button>
          </div>

          {(selectedResponse === 'yes' || selectedResponse === 'maybe') && message?.activities && message.activities.length > 0 && (
            <div className="mb-8 animate-in zoom-in-95 duration-300">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 text-center">Pick an activity</p>
              <div className="grid grid-cols-2 gap-3">
                {message.activities.map((actId) => {
                  const act = activitiesList.find(a => a.id === actId);
                  if (!act) return null;
                  return (
                    <button
                      key={act.id}
                      onClick={() => setSelectedActivity(act.id)}
                      className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedActivity === act.id ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-100 text-gray-500'}`}
                    >
                      <span className="text-3xl">{act.icon}</span>
                      <span className="font-black text-[10px] uppercase tracking-tighter">{act.label.split(' ')[1]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedResponse && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write back something sweet..."
                className="w-full px-6 py-5 bg-gray-50 border-none rounded-4xl outline-none text-gray-700 font-medium h-32 focus:ring-2 focus:ring-red-100 transition-all"
              />
              <button 
                onClick={handleSubmit} 
                disabled={submitting} 
                className="w-full bg-gray-900 text-white py-6 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-red-500 transition-all active:scale-95 shadow-lg"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <>Send Response <Send className="w-5 h-5" /></>}
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button 
            onClick={downloadCard}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500 shadow-sm border border-red-100 hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {isDownloading ? 'Saving...' : 'Save as Photo'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes explode {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          100% { 
            transform: translate(
              calc(cos(var(--angle)) * var(--velocity) * 40px), 
              calc(sin(var(--angle)) * var(--velocity) * 40px)
            ) scale(1) rotate(var(--rotation)); 
            opacity: 0; 
          }
        }
        .animate-explode {
          animation: explode 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// --- CARD STYLES (HEX BASED FOR COMPATIBILITY) ---

function ClassicCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-white p-10 md:p-14 text-center border-b-12 border-[#ef4444]">
      <div className="w-20 h-20 bg-[#ef4444] rounded-3xl mx-auto mb-8 flex items-center justify-center rotate-6 shadow-lg">
        <Heart className="w-10 h-10 text-white" fill="currentColor" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-6 italic">Hey {message.recipientName}!</h2>
      <div className="bg-[#fff5f5] rounded-[2.5rem] p-10 border border-[#fee2e2]">
        <p className="text-gray-800 text-xl font-bold leading-relaxed italic font-serif">&quot;{message.messageText}&quot;</p>
      </div>
      <p className="mt-8 text-[10px] font-black text-red-300 uppercase tracking-[0.4em]">From {message.senderName}</p>
    </div>
  );
}

function ModernCard({ message }: { message: MessageData }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #db2777 100%)' }} className="p-10 md:p-16 text-white text-center">
      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8"><Heart className="w-8 h-8 text-white" fill="currentColor" /></div>
      <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase italic">For {message.recipientName}</h2>
      <div className="bg-white rounded-4xl p-8 text-gray-900 shadow-2xl"><p className="text-lg font-bold italic">{message.messageText}</p></div>
      <p className="mt-10 text-[10px] font-black uppercase tracking-widest opacity-60">Created by {message.senderName}</p>
    </div>
  );
}

function PlayfulCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-[#fff9c4] p-10 md:p-14 text-center border-4 border-dashed border-[#fbc02d]">
      <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tighter">💌 Special Mail!</h2>
      <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-[#fbc02d]">
        <p className="text-gray-800 text-xl font-black italic mb-4">Dear {message.recipientName},</p>
        <p className="text-gray-600 font-bold leading-relaxed">{message.messageText}</p>
      </div>
      <p className="mt-8 font-black text-[#f57f17] uppercase tracking-widest">- {message.senderName} -</p>
    </div>
  );
}

function ElegantCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-white p-12 md:p-20 text-center border border-[#fce7f3]">
      <Heart className="w-6 h-6 text-[#f9a8d4] mx-auto mb-8" fill="currentColor" />
      <h2 className="text-2xl font-serif italic text-gray-800 mb-10 border-b border-[#fce7f3] pb-10 uppercase tracking-[0.3em]">{message.recipientName}</h2>
      <p className="text-gray-600 text-xl italic font-serif">{message.messageText}</p>
      <p className="mt-12 text-[10px] font-bold text-[#f9a8d4] uppercase tracking-widest">— {message.senderName} —</p>
    </div>
  );
}

function MinimalistCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-white p-12 md:p-20 text-left border border-gray-50">
      <Heart className="w-8 h-8 text-[#ef4444] mb-12" fill="currentColor" />
      <h2 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">{message.recipientName},</h2>
      <p className="text-gray-400 text-xl leading-relaxed font-light mb-16">{message.messageText}</p>
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Love, {message.senderName}</p>
    </div>
  );
}