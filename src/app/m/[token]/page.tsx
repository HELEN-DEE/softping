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
    // This calls the PATCH method e
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
    <div className="min-h-screen bg-[#FFF9FA] py-18 px-4 relative flex flex-col items-center overflow-x-hidden">
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

// --- CARD STYLES ---

function ClassicCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-white p-10 md:p-16 text-center flex flex-col items-center shadow-[0_20px_50px_rgba(255,182,193,0.2)] rounded-[2.5rem] border-2 border-red-50">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-red-100 blur-2xl opacity-30 rounded-full scale-150" />
        <div className="relative w-20 h-20 bg-[#ef4444] rounded-4xl flex items-center justify-center mx-auto shadow-xl shadow-red-200 rotate-3">
          <Heart className="w-10 h-10 text-white -rotate-3" fill="currentColor" />
        </div>
      </div>
      <h2 className="text-3xl font-black mb-4 tracking-tighter text-gray-900">Dearest {message.recipientName},</h2>
      <div className="flex-1 flex items-center justify-center py-6">
        <p className="text-gray-700 text-xl md:text-2xl font-bold leading-relaxed italic border-x-2 border-red-50 px-6">
          &quot;{message.messageText}&quot;
        </p>
      </div>
      <div className="mt-8">
        <div className="w-12 h-1 bg-red-100 mx-auto mb-4 rounded-full" />
        <p className="text-[10px] font-black text-red-300 tracking-[0.4em] uppercase">Love always, {message.senderName}</p>
      </div>
    </div>
  );
}

function ModernCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-white p-10 md:p-16 text-left border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden relative min-h-112.5">
      {/* Sophisticated accent glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-50/50 blur-[80px] rounded-full -mr-20 -mt-20" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-baseline gap-2 mb-12">
          <span className="text-6xl font-black text-gray-900 tracking-tighter">Hi.</span>
          <div className="h-3 w-3 bg-[#ef4444] rounded-full animate-pulse" />
        </div>
        
        <h2 className="text-sm font-black text-gray-300 uppercase tracking-widest mb-6">A message for {message.recipientName}</h2>
        
        <div className="border-l-4 border-red-100 pl-8 py-2 flex-1">
          <p className="text-gray-900 text-2xl md:text-3xl font-medium leading-tight tracking-tight">
            {message.messageText}
          </p>
        </div>
        
        <div className="mt-12 flex items-center justify-between border-t border-gray-50 pt-8">
          <p className="text-xs font-black text-gray-900 uppercase tracking-tighter italic">
            Sent by {message.senderName}
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 bg-red-100 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayfulCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-[#FFF9FA] p-10 md:p-16 text-center items-center rounded-[3rem] border-2 border-red-100">
      <div className="w-20 h-20 bg-white rounded-4xl flex items-center justify-center mb-8 border border-red-100 shadow-sm -rotate-6">
        <Heart className="w-10 h-10 text-red-400" fill="currentColor" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">For {message.recipientName}!</h2>
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-red-50 relative">
        {/* <div className="absolute -top-3 -right-3 bg-yellow-300 text-[10px] font-black px-3 py-1 rounded-full border-2 border-gray-900 rotate-12">
          OPEN ME! 💌
        </div> */}
        <p className="text-gray-700 text-xl font-bold leading-relaxed italic">
          &quot;{message.messageText}&quot;
        </p>
      </div>
      <p className="mt-10 text-xs font-black text-red-400 uppercase tracking-[0.3em]">
        Xoxo, {message.senderName}
      </p>
    </div>
  );
}

function ElegantCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-[#FFFCFB] p-12 md:p-20 text-center items-center border border-[#F5EBE0] rounded-[3rem] shadow-sm">
      <div className="mb-12 opacity-50">
        <svg width="60" height="30" viewBox="0 0 40 20" fill="none" className="mx-auto text-[#D4A373]">
          <path d="M0 10C10 10 10 0 20 0C30 0 30 10 40 10C30 10 30 20 20 20C10 20 10 10 0 10Z" fill="currentColor" />
        </svg>
      </div>
      
      <h2 className="text-xs font-light tracking-[0.5em] text-[#B89C8E] uppercase mb-6">To</h2>
      <h2 className="text-4xl font-serif italic text-[#6B5E51] mb-12 tracking-tight">{message.recipientName}</h2>
      
      <div className="py-10 border-y border-[#F5EBE0] max-w-[90%] mx-auto">
        <p className="text-[#8D7B6D] text-2xl font-serif leading-loose italic">
          {message.messageText}
        </p>
      </div>
      
      <div className="mt-12 flex flex-col items-center">
        <p className="text-[11px] font-medium tracking-[0.4em] text-[#B89C8E] uppercase">
          With Sincerity, {message.senderName}
        </p>
      </div>
    </div>
  );
}

function MinimalistCard({ message }: { message: MessageData }) {
  return (
    <div className="bg-white p-12 md:p-20 text-left border border-gray-100 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex-1">
        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 mb-12">Private Message</h2>
        <p className="text-5xl font-light text-gray-900 tracking-tighter mb-10">{message.recipientName}</p>
        <p className="text-gray-500 text-2xl font-light leading-relaxed max-w-[90%] mb-20 italic">
          {message.messageText}
        </p>
      </div>
      <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">
          From {message.senderName}
        </p>
        <div className="w-2 h-2 rounded-full bg-red-400" />
      </div>
    </div>
  );
}