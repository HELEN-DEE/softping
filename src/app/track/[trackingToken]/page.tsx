"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Loader2, Eye, Clock, CheckCircle, MessageCircle, Calendar } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type MessageData = {
  id: string;
  senderName: string | null;
  recipientName: string | null;
  messageText: string;
  theme: string;
  activities: string[];
  isOpened: boolean;
  createdAt: string;
  expiresAt: string;
};

type ResponseData = {
  responseType: 'yes' | 'maybe' | 'no';
  selectedActivity: string | null;
  replyText: string | null;
  createdAt: string;
};

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const trackingToken = params.trackingToken as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<MessageData | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);

  const activities = {
    coffee: '☕ Coffee',
    movie: '🎬 Movie',
    dinner: '🍽️ Dinner',
    walk: '🚶 Walk'
  };

  useEffect(() => {
  const fetchTrackingData = async () => {
    try {
      const res = await fetch(`/api/track/${trackingToken}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Tracking link not found');
        setLoading(false);
        return;
      }

      setMessage(data.message);
      setResponse(data.response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tracking data:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (trackingToken) {
    fetchTrackingData();
    // Auto-refresh every 10 seconds to check for new responses
    const interval = setInterval(fetchTrackingData, 10000);
    return () => clearInterval(interval);
  }
}, [trackingToken]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tracking info...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-red-100 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const getResponseEmoji = () => {
    if (!response) return '⏳';
    if (response.responseType === 'yes') return '💖';
    if (response.responseType === 'maybe') return '💭';
    return '🤍';
  };

  const getResponseText = () => {
    if (!response) return 'Waiting for response...';
    if (response.responseType === 'yes') return 'They said YES! 💕';
    if (response.responseType === 'maybe') return 'They said MAYBE - let\'s talk 💬';
    return 'They said not right now 💙';
  };

  const getResponseColor = () => {
    if (!response) return 'bg-gray-100 text-gray-700';
    if (response.responseType === 'yes') return 'bg-red-50 text-red-700 border-red-200';
    if (response.responseType === 'maybe') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Tracker</h1>
          <p className="text-gray-600">See how your message is doing</p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Sent Status */}
          <div className="bg-white border-2 border-red-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Message Status</p>
                <p className="font-semibold text-gray-900">Sent</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              <Calendar className="w-3 h-3 inline mr-1" />
              {formatDate(message!.createdAt)}
            </p>
          </div>

          {/* Opened Status */}
          <div className="bg-white border-2 border-red-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                message?.isOpened ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Eye className={`w-5 h-5 ${message?.isOpened ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Opened</p>
                <p className="font-semibold text-gray-900">
                  {message?.isOpened ? 'Yes! 👀' : 'Not yet'}
                </p>
              </div>
            </div>
            {message?.isOpened && (
              <p className="text-xs text-gray-500">They&apos;ve seen your message</p>
            )}
          </div>
        </div>

        {/* Message Preview */}
        <div className="bg-white border-2 border-red-100 rounded-3xl p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Message</h2>
          
          <div className="bg-pink-50 border-2 border-red-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              {message?.senderName && (
                <span className="text-sm text-gray-600">From: <strong>{message.senderName}</strong></span>
              )}
              {message?.recipientName && (
                <span className="text-sm text-gray-600">To: <strong>{message.recipientName}</strong></span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {message?.messageText}
            </p>
          </div>

          {message?.activities && message.activities.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Activity options:</span>
              {message.activities.map((activityId) => (
                <span key={activityId} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  {activities[activityId as keyof typeof activities]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Response Status */}
        <div className={`bg-white border-2 rounded-3xl p-6 md:p-8 ${getResponseColor()}`}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getResponseEmoji()}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getResponseText()}</h2>
          </div>

          {response ? (
            <div className="space-y-4">
              {/* Selected Activity */}
              {response.selectedActivity && (
                <div className="bg-white border-2 border-red-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">They picked:</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {activities[response.selectedActivity as keyof typeof activities]}
                  </p>
                </div>
              )}

              {/* Personal Note */}
              {response.replyText && (
                <div className="bg-white border-2 border-red-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                    <span className="text-sm font-medium text-gray-700">Their note:</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed italic">
                    &quot;{response.replyText}&quot;
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500 text-center">
                <Clock className="w-3 h-3 inline mr-1" />
                Responded {formatDate(response.createdAt)}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {message?.isOpened 
                  ? "They've opened your message! Waiting for them to respond..." 
                  : "Your message is waiting to be opened. This page updates automatically."}
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking for updates...
              </div>
            </div>
          )}
        </div>

        {/* Expires Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This message expires on {new Date(message!.expiresAt).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
          >
            Back Home
          </button>
          <button
            onClick={() => router.push('/create')}
            className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all"
          >
            Create Another Message
          </button>
        </div>
      </div>
    </div>
  );
}