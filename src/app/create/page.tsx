"use client";

import React, { useState } from 'react';
import { Heart, Copy, Check, ArrowLeft, Loader2, X, Eye, Brush, Zap, Share2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Type Definitions ---
interface FormData {
  senderName: string;
  recipientName: string;
  message: string;
  cardStyle: string;
  activities: string[];
}

interface Activity {
  id: string;
  label: string;
}

interface CardStyle {
  id: string;
  label: string;
  description: string;
  preview: string;
}

interface MessageTemplate {
  id: string;
  label: string;
  text: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    recipientName: '',
    message: '',
    cardStyle: 'classic',
    activities: []
  });

  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [trackingLink, setTrackingLink] = useState<string>('');
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);

  const messageTemplates: MessageTemplate[] = [
    { id: 'romantic', label: 'Romantic', text: "Hey! I've been thinking about you a lot lately. Would you want to go out with me this Valentine's? 💕" },
    { id: 'casual', label: 'Casual', text: "So... I've been wanting to ask you something. Want to hang out on Valentine's? Could be fun! 😊" },
    { id: 'funny', label: 'Funny', text: "I've been practicing this in the mirror for days... want to be my Valentine? I promise I'm less awkward in person (maybe) 😅" }
  ];

  const activityList: Activity[] = [
    { id: 'coffee', label: '☕ Coffee' },
    { id: 'movie', label: '🎬 Movie' },
    { id: 'dinner', label: '🍽️ Dinner' },
    { id: 'walk', label: '🚶 Walk' }
  ];

  const cardStyles: CardStyle[] = [
    { id: 'classic', label: 'Classic', description: 'Sweet & Timeless', preview: '💖' },
    { id: 'minimalist', label: 'Minimal', description: 'Clean & Modern', preview: '🤍' },
    { id: 'playful', label: 'Playful', description: 'Fun & Vibrant', preview: '💕' },
    { id: 'elegant', label: 'Elegant', description: 'Sophisticated', preview: '💝' },
    { id: 'modern', label: 'Modern', description: 'Bold Gradient', preview: '✨' }
  ];

  const toggleActivity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(id) 
        ? prev.activities.filter(a => a !== id) 
        : [...prev.activities, id]
    }));
  };

  const generateLink = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedLink(data.link);
        setTrackingLink(data.trackingLink);
        setStep(3);
      } else {
        alert("Oops! " + (data.error || "Something went wrong"));
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (link: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(link);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const shareNative = async () => {
    const shareData = {
      title: '💕 Valentine\'s Message',
      text: 'Someone sent you a special Valentine\'s message!',
      url: generatedLink
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        copyToClipboard(generatedLink, setCopiedMessage);
        alert('Link copied to clipboard! 💕');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  const shareToWhatsApp = () => {
    const text = `💕 Someone sent you a special Valentine's message! Open it here: ${generatedLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToSnapchat = () => {
    const url = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(generatedLink)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const text = `💕 Someone sent you a special Valentine's message!`;
    const url = `https://twitter.com/messages/compose?text=${encodeURIComponent(text + ' ' + generatedLink)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    copyToClipboard(generatedLink, setCopiedMessage);
    alert('Link copied! Open Instagram and paste it in your DMs 💕');
  };

  const shareToTelegram = () => {
    const text = `💕 Someone sent you a special Valentine's message! Open it here:`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(generatedLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] text-gray-900 font-sans selection:bg-red-100 overflow-x-hidden">
      
      {/* Navigation Header */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/70 backdrop-blur-xl z-50 border-b border-red-50 px-6 flex items-center justify-between">
        <button 
          onClick={() => step === 1 ? router.push('/') : setStep(step - 1)} 
          className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-red-500 bg-white shadow-sm border border-red-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${s <= step ? 'bg-red-500' : 'bg-red-100'}`} />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <main className="pt-20 min-h-screen flex flex-col">
        
        {/* STEP 1: WRITING */}
        {step === 1 && (
          <div className="flex-1 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(255,182,193,0.15)] border border-red-50 space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-black tracking-tight mb-2 text-gray-900">Write your heart out</h1>
                <p className="text-gray-500 font-medium">Keep it simple, keep it you.</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">From <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Your Name" value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-200 outline-none font-medium transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">To <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Their Name" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-200 outline-none font-medium transition-all" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {messageTemplates.map(t => (
                  <button key={t.id} onClick={() => setFormData({...formData, message: t.text})} className="px-3 py-2 lg:px-5 lg:py-2.5 bg-white border border-red-100 rounded-full text-xs font-bold text-gray-500 hover:text-red-500 hover:border-red-500 transition-all active:scale-95 shadow-sm">
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Message <span className="text-red-500">*</span></label>
                <textarea rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="What would you like to say?" className="w-full px-6 py-5 bg-gray-50 border-none rounded-4xl focus:ring-2 focus:ring-red-200 outline-none resize-none text-base lg:text-lg leading-relaxed transition-all" />
              </div>

              <button 
                onClick={() => setStep(2)} 
                disabled={!formData.senderName.trim() || !formData.recipientName.trim() || !formData.message.trim()} 
                className="w-full bg-gray-900 text-white py-6 rounded-4xl text-xl font-black hover:bg-red-500 transition-all shadow-xl shadow-red-100/50 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                Continue <Heart className="w-5 h-5" fill="currentColor" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOMIZATION */}
        {step === 2 && (
          <div className="flex-1 grid lg:grid-cols-2 animate-in fade-in duration-700">
            <div className="p-8 md:p-16 lg:overflow-y-auto lg:h-[calc(100vh-80px)] space-y-12 max-w-2xl mx-auto w-full">
              <section>
                <h2 className="text-3xl font-black mb-6 flex items-center gap-3">The Vibe <Brush className="text-red-500" /></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cardStyles.map(s => (
                    <button key={s.id} onClick={() => setFormData({...formData, cardStyle: s.id})} className={`flex items-center gap-4 p-5 rounded-[2.5rem] border-2 transition-all text-left ${formData.cardStyle === s.id ? 'border-red-500 bg-white shadow-xl scale-[1.02]' : 'border-transparent bg-white/60 hover:bg-white hover:border-red-100'}`}>
                      <span className="text-3xl bg-red-50 w-14 h-14 flex items-center justify-center rounded-2xl">{s.preview}</span>
                      <div>
                        <p className="font-black text-gray-900 leading-tight">{s.label}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">Suggest Plans <Zap className="text-red-500" fill="currentColor" /></h2>
                <div className="grid grid-cols-2 gap-4">
                  {activityList.map(a => (
                    <button key={a.id} onClick={() => toggleActivity(a.id)} className={`p-6 rounded-[2.5rem] border-2 transition-all font-black text-sm flex flex-col items-center gap-3 ${formData.activities.includes(a.id) ? 'bg-gray-900 border-gray-900 text-white shadow-xl' : 'bg-white border-transparent hover:border-red-200 text-gray-400'}`}>
                      <span className="text-3xl">{a.label.split(' ')[0]}</span>
                      {a.label.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </section>

              <div className="pt-6">
                <button onClick={generateLink} disabled={isLoading} className="w-full bg-red-500 text-white py-7 rounded-[2.5rem] text-2xl font-black hover:bg-red-600 transition-all shadow-2xl active:scale-95 disabled:grayscale flex items-center justify-center">
                  {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : "Generate & Send"}
                </button>
              </div>
            </div>

            {/* Desktop Preview */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-white/40 border-l border-red-50 sticky top-20 h-[calc(100vh-80px)]">
                <div className="absolute inset-0 bg-[radial-gradient(#fee2e2_1px,transparent_1px)] bg-size-[20px_20px] opacity-30" />
                <PreviewPhone formData={formData} activityList={activityList} />
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-red-300">Live Card Preview</p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="flex-1 flex items-center justify-center p-6 animate-in zoom-in-95">
            <div className="w-full max-w-md bg-white rounded-[4rem] p-12 text-center shadow-2xl border border-red-50 space-y-8">
              <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center mx-auto rotate-12 shadow-xl shadow-red-200">
                <Check className="w-10 h-10 text-white -rotate-12" strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900">Boom! It&apos;s Ready.</h2>
              
              <div className="space-y-4">
                {/* Message Link Section */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-left ml-4 text-gray-400 uppercase tracking-widest">Share this link</p>
                  <div className="bg-gray-50 p-3 rounded-2xl flex items-center border border-gray-100">
                    <input readOnly value={generatedLink} className="bg-transparent flex-1 px-3 text-xs font-bold text-gray-500 outline-none overflow-hidden text-ellipsis" />
                    <button onClick={() => copyToClipboard(generatedLink, setCopiedMessage)} className="bg-white p-3 rounded-xl shadow-sm hover:text-red-500 transition-colors">
                      {copiedMessage ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Social Platform Icons - Icon Only */}
                  <div className="flex gap-2 mt-3 justify-center">
                    {/* WhatsApp */}
                    <button 
                      onClick={shareToWhatsApp}
                      className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center hover:bg-[#20BA5A] transition-all active:scale-95 shadow-sm"
                      aria-label="Share on WhatsApp"
                    >
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </button>
                    
                    {/* Snapchat */}
                    <button 
                      onClick={shareToSnapchat}
                      className="w-12 h-12 bg-[#FFFC00] rounded-xl flex items-center justify-center hover:bg-[#FFED00] transition-all active:scale-95 shadow-sm"
                      aria-label="Share on Snapchat"
                    >
                      <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.06-1.286.119-.225.044-.404.074-.539.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.12-.055-.18-.015-.255.166-.464.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg>
                    </button>

                    {/* X/Twitter */}
                    <button 
                      onClick={shareToTwitter}
                      className="w-12 h-12 bg-black rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
                      aria-label="Share on X/Twitter"
                    >
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </button>

                    {/* Instagram */}
                    <button 
                      onClick={shareToInstagram}
                      className="w-12 h-12 bg-linear-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] rounded-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-95 shadow-sm"
                      aria-label="Share on Instagram"
                    >
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                    </button>

                    {/* Telegram */}
                    <button 
                      onClick={shareToTelegram}
                      className="w-12 h-12 bg-[#0088cc] rounded-xl flex items-center justify-center hover:bg-[#0077b5] transition-all active:scale-95 shadow-sm"
                      aria-label="Share on Telegram"
                    >
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </button>
                  </div>

                  {/* Native Share - More Options */}
                  <button 
                    onClick={shareNative}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:border-red-300 hover:text-red-500 transition-all active:scale-95 shadow-sm mt-3"
                  >
                    <Share2 className="w-4 h-4" />
                    More Options
                  </button>
                </div>

                {/* Tracking Link Section */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-left ml-4 text-gray-400 uppercase tracking-widest">Track Responses (Private)</p>
                  <div className="bg-gray-50 p-3 rounded-2xl flex items-center border border-gray-100">
                    <input readOnly value={trackingLink} className="bg-transparent flex-1 px-3 text-xs font-bold text-gray-500 outline-none overflow-hidden text-ellipsis" />
                    <button onClick={() => copyToClipboard(trackingLink, setCopiedTracking)} className="bg-white p-3 rounded-xl shadow-sm hover:text-purple-500 transition-colors">
                      {copiedTracking ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-400 italic text-left ml-4">
                    ⚠️ Keep this link private - it shows when they open and respond
                  </p>
                </div>
              </div>

              <button onClick={() => setStep(1)} className="text-gray-300 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors">Start Over</button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Mobile Preview Button */}
      {step === 2 && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button onClick={() => setShowMobilePreview(true)} className="bg-gray-900 text-white h-14 px-6 rounded-2xl font-black shadow-2xl flex items-center gap-2 active:scale-95 transition-all">
            <Eye className="w-5 h-5 text-red-400" /> Preview
          </button>
        </div>
      )}

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobilePreview(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-[#FFF9FA] rounded-t-[2.5rem] p-6 pb-12 animate-in slide-in-from-bottom duration-500 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-center mb-4"><div className="w-12 h-1.5 bg-gray-200 rounded-full" /></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl">Card Preview</h3>
              <button onClick={() => setShowMobilePreview(false)} className="p-2 bg-white rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6 max-w-sm mx-auto">
              <CardDisplay formData={formData} />
              {formData.activities.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.activities.map(a => (
                    <div key={a} className="bg-white p-4 rounded-2xl text-[10px] font-black text-center border border-red-50 shadow-sm">
                      {activityList.find(i => i.id === a)?.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function PreviewPhone({ formData, activityList }: { formData: FormData; activityList: Activity[] }) {
  return (
    <div className="w-[320px] aspect-[9/19.5] bg-gray-900 rounded-[3.5rem] border-10 border-gray-800 shadow-2xl overflow-hidden relative">
      <div className="h-full w-full bg-[#FFF9FA] overflow-y-auto p-5 pt-12 pb-20 hide-scrollbar">
        <CardDisplay formData={formData} />
        {formData.activities.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-2">
            {formData.activities.map(a => (
              <div key={a} className="bg-white p-3 rounded-2xl text-[10px] font-black text-center border border-red-50 shadow-sm">
                {activityList.find(i => i.id === a)?.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CardDisplay({ formData }: { formData: FormData }) {
  const from = formData.senderName || "Someone";
  const to = formData.recipientName || "Recipient";
  const msg = formData.message || "Your message...";
  
  // Clean base: consistent padding and rounded corners
  const baseClasses = "relative w-full rounded-[2.5rem] p-10 flex flex-col min-h-[420px] transition-all duration-500";

  switch (formData.cardStyle) {
    case 'minimalist':
      return (
        <div className={`${baseClasses} bg-white border border-gray-100 shadow-sm text-left`}>
          <div className="flex-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 mb-10">To</h2>
            <p className="text-4xl font-light text-gray-900 tracking-tight mb-8 leading-none">{to}</p>
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-[90%]">
              {msg}
            </p>
          </div>
          <div className="pt-10">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">
              {from}
            </p>
          </div>
        </div>
      );

    case 'playful':
      return (
        <div className={`${baseClasses} bg-[#FFF9FA] border-2 border-red-100 text-center items-center`}>
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-8 border border-red-100">
            <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">For {to}!</h2>
          <div className="flex-1 w-full bg-white rounded-3xl p-6 shadow-sm border border-red-50">
            <p className="text-gray-700 text-base font-bold leading-relaxed italic">
              &quot;{msg}&quot;
            </p>
          </div>
          <p className="mt-8 text-xs font-black text-red-400 uppercase tracking-widest">
            Xoxo, {from}
          </p>
        </div>
      );

    case 'elegant':
      return (
        <div className={`${baseClasses} bg-[#FFFCFB] border border-[#F5EBE0] text-center items-center`}>
          {/* Subtle floral/refined ornament */}
          <div className="mb-10 opacity-40">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="text-[#D4A373]">
              <path d="M0 10C10 10 10 0 20 0C30 0 30 10 40 10C30 10 30 20 20 20C10 20 10 10 0 10Z" fill="currentColor" />
            </svg>
          </div>
          
          <h2 className="text-sm font-light tracking-[0.4em] text-[#B89C8E] uppercase mb-4">To</h2>
          <h2 className="text-3xl font-serif italic text-[#6B5E51] mb-8">{to}</h2>
          
          <div className="flex-1 flex flex-col justify-center max-w-[85%]">
            <p className="text-[#8D7B6D] text-lg font-serif leading-loose italic">
              {msg}
            </p>
          </div>
          
          <div className="mt-10 pt-8 border-t border-[#F5EBE0] w-1/2">
            <p className="text-[10px] font-medium tracking-[0.3em] text-[#B89C8E] uppercase">
              With Sincerity, {from}
            </p>
          </div>
        </div>
      );

    case 'modern':
      return (
        <div className={`${baseClasses} bg-white border border-gray-100 overflow-hidden`}>
          {/* A soft, sophisticated accent glow instead of a border */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="relative z-10 flex-1">
            <div className="flex items-baseline gap-2 mb-12">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">Hi.</span>
              <div className="h-2 w-2 bg-red-500 rounded-full" />
            </div>
            
            <h2 className="text-lg font-bold text-gray-400 mb-6">For {to}</h2>
            
            <div className="border-l-2 border-red-100 pl-6 py-2">
              <p className="text-gray-900 text-xl font-medium leading-snug tracking-tight">
                {msg}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">
              Sent by {from}
            </p>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1 h-1 bg-red-200 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      );

    default: // Classic
      return (
        <div className={`${baseClasses} bg-white border-2 border-red-50 shadow-[0_20px_40px_rgba(255,182,193,0.2)] text-center items-center`}>
          <div className="mb-8">
            <Heart className="w-10 h-10 text-red-500 animate-bounce" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Dearest {to},</h2>
          <div className="flex-1 flex items-center justify-center">
             <p className="text-gray-700 text-xl font-bold leading-relaxed italic">
               &quot;{msg}&quot;
             </p>
          </div>
          <div className="mt-8">
            <div className="w-8 h-1 bg-red-100 mx-auto mb-4 rounded-full" />
            <p className="text-[10px] font-black text-red-300 tracking-[0.2em] uppercase">Love always, {from}</p>
          </div>
        </div>
      );
  }
}