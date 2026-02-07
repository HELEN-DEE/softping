"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Loader2, Eye, CheckCircle,  ArrowLeft, Plus, Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

// --- TYPES ---
interface MessageData {
  id: string;
  senderName: string | null;
  recipientName: string | null;
  messageText: string;
  isOpened: boolean;
  createdAt: string;
  expiresAt: string;
}

interface ResponseData {
  responseType: 'yes' | 'maybe' | 'no';
  selectedActivity: string | null;
  replyText: string | null;
  createdAt: string;
}

interface TrackingResponse {
  success: boolean;
  message: MessageData;
  response: ResponseData | null;
  error?: string;
}

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const trackingToken = typeof params?.trackingToken === 'string' ? params.trackingToken : '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<MessageData | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);

  const activities: Record<string, string> = {
    coffee: '☕ Coffee Date',
    movie: '🎬 Movie Night',
    dinner: '🍽️ Romantic Dinner',
    walk: '🚶 Sunset Walk'
  };

  const fetchTrackingData = useCallback(async () => {
    try {
      const res = await fetch(`/api/track/${trackingToken}`); 
      const data: TrackingResponse = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Tracking link not found');
      } else {
        setMessage(data.message);
        setResponse(data.response);
      }
    } catch  {
      setError('Connection lost. Retrying...');
    } finally {
      setLoading(false);
    }
  }, [trackingToken]);

  useEffect(() => {
    if (trackingToken) {
      fetchTrackingData();
      const interval = setInterval(fetchTrackingData, 5000);
      return () => clearInterval(interval);
    }
  }, [trackingToken, fetchTrackingData]);

  if (loading) return (
    <div className="min-h-screen bg-[#FFF9FA] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-red-300 animate-spin" />
    </div>
  );

  if (error && !message) return (
    <div className="min-h-screen bg-[#FFF9FA] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-4xl shadow-xl text-center border border-red-50 max-w-sm">
        <Heart className="w-10 h-10 text-red-100 mx-auto mb-4" />
        <p className="font-bold text-gray-800">{error}</p>
        <button onClick={() => router.push('/')} className="mt-6 text-red-500 font-bold text-sm underline">Go Back Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9FA] py-24 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Home</span>
          </button>
          <div className="bg-white px-4 py-1.5 rounded-full border border-red-50 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Live Tracker</span>
          </div>
        </div>

        {/* Status Overview Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-red-50 flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${message?.isOpened ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-300'}`}>
              <Eye size={22} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
              {message?.isOpened ? 'Seen' : 'Unread'}
            </span>
          </div>
          
          <div className="h-10 w-px bg-gray-100" />

          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${response ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'}`}>
              <CheckCircle size={22} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
              {response ? 'Replied' : 'Waiting'}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-red-50 relative overflow-hidden">
          {!response ? (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <Heart className="w-16 h-16 text-red-50 animate-pulse" fill="currentColor" />
                <Clock className="w-6 h-6 text-red-300 absolute bottom-0 right-0 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Waiting for a heart beat...</h2>
              <p className="text-gray-400 text-sm mt-2">Your message for {message?.recipientName} is live.</p>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">
                    {response.responseType === 'yes' ? '💖' : response.responseType === 'maybe' ? '💭' : '🤍'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  {response.responseType === 'yes' ? "It's a Yes!" : 
                    response.responseType === 'maybe' ? "They said Maybe" : "Not this time"}
                </h2>
              </div>

              <div className="space-y-4">
                {response.selectedActivity && (
                  <div className="bg-red-50/30 p-6 rounded-4xl border border-red-50/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Proposed Plan</p>
                    <p className="text-lg font-bold text-gray-800">{activities[response.selectedActivity] || 'Activity'}</p>
                  </div>
                )}
                
                {response.replyText && (
                  <div className="bg-gray-50/50 p-6 rounded-4xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Their Message</p>
                    <p className="text-lg font-medium text-gray-700 italic leading-relaxed">
                      &quot;{response.replyText}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push('/create')}
          className="w-full bg-gray-900 text-white py-6 rounded-full font-black text-lg hover:bg-red-500 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          <Plus size={20} strokeWidth={3} /> Create New Message
        </button>

      </div>
    </div>
  );
}