"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Loader2, Check } from 'lucide-react';
import { useParams } from 'next/navigation';

type MessageData = {
  id: string;
  senderName: string | null;
  recipientName: string | null;
  messageText: string;
  theme: string;
  activities: string[];
};

export default function MessagePage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<MessageData | null>(null);
  const [selectedResponse, setSelectedResponse] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [replyText, setReplyText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activities = [
    { id: 'coffee', label: '☕ Coffee', icon: '☕' },
    { id: 'movie', label: '🎬 Movie', icon: '🎬' },
    { id: 'dinner', label: '🍽️ Dinner', icon: '🍽️' },
    { id: 'walk', label: '🚶 Walk', icon: '🚶' }
  ];

  const themeColors = {
    classic: { bg: 'bg-pink-50', primary: 'bg-red-500', border: 'border-red-500' },
    soft: { bg: 'bg-pink-100', primary: 'bg-pink-400', border: 'border-pink-400' },
    playful: { bg: 'bg-purple-50', primary: 'bg-purple-500', border: 'border-purple-500' }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        console.log('🔍 Fetching message with token:', token);
        
        const response = await fetch(`/api/messages/${token}`);
        console.log('📡 Response status:', response.status);
        
        const data = await response.json();
        console.log('📥 Response data:', data);

        if (!response.ok) {
          setError(data.error || 'Message not found');
          setLoading(false);
          return;
        }

        setMessage(data.message);
        setLoading(false);
      } catch (err) {
        console.error('💥 Error fetching message:', err);
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    };

    if (token) {
      fetchMessage();
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!selectedResponse) {
      alert('Please select a response');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message?.id,
          responseType: selectedResponse,
          selectedActivity: selectedActivity || null,
          replyText: replyText || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit response');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('Sorry, something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your message...</p>
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
          <p className="text-sm text-gray-500">
            This link may have expired or already been used.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-red-100 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Response sent! 💕</h2>
          <p className="text-gray-600 text-lg mb-6">
            {selectedResponse === 'yes' && "They'll be so happy to hear from you!"}
            {selectedResponse === 'maybe' && "Thanks for being honest. They'll appreciate your thoughtful response."}
            {selectedResponse === 'no' && "Thank you for responding kindly. It takes courage to be honest."}
          </p>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <p className="text-sm text-gray-700">
              Your response has been delivered privately. This link is now closed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const theme = themeColors[message?.theme as keyof typeof themeColors] || themeColors.classic;

  return (
    <div className={`min-h-screen ${theme.bg} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Message Card */}
        <div className="bg-white border-2 border-red-100 rounded-3xl shadow-lg p-8 md:p-12 mb-6">
          <div className="text-center mb-8">
            {message?.senderName && (
              <div className="inline-block bg-pink-50 border-2 border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                From {message.senderName}
              </div>
            )}
            
            <div className={`w-20 h-20 ${theme.primary} rounded-full mx-auto mb-6 flex items-center justify-center`}>
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>

            {message?.recipientName && (
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hey {message.recipientName}! 👋
              </h2>
            )}
          </div>

          <div className="bg-pink-50 border-2 border-red-100 rounded-2xl p-6 mb-8">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {message?.messageText}
            </p>
          </div>

          {/* Response Options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How do you feel? 💭
            </h3>
            
            <button
              onClick={() => setSelectedResponse('yes')}
              className={`w-full py-4 rounded-xl font-semibold transition-all border-2 ${
                selectedResponse === 'yes'
                  ? `${theme.primary} text-white ${theme.border}`
                  : 'bg-white border-gray-200 text-gray-700 hover:border-red-200'
              }`}
            >
              Yes, I&apos;d love to! 💖
            </button>

            <button
              onClick={() => setSelectedResponse('maybe')}
              className={`w-full py-4 rounded-xl font-semibold transition-all border-2 ${
                selectedResponse === 'maybe'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-red-200'
              }`}
            >
              Maybe, let&apos;s talk 💭
            </button>

            <button
              onClick={() => setSelectedResponse('no')}
              className={`w-full py-4 rounded-xl font-semibold transition-all border-2 ${
                selectedResponse === 'no'
                  ? 'bg-gray-200 text-gray-700 border-gray-400'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              Not right now 🤍
            </button>
          </div>

          {/* Activities Selection (if yes or maybe) */}
          {(selectedResponse === 'yes' || selectedResponse === 'maybe') && 
           message?.activities && 
           message.activities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What sounds good to you?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {message.activities.map((activityId) => {
                  const activity = activities.find(a => a.id === activityId);
                  if (!activity) return null;
                  
                  return (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity.id)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        selectedActivity === activity.id
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-red-200'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{activity.icon}</span>
                      {activity.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Reply */}
          {selectedResponse && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Want to add a personal note? (optional)
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write something sweet..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedResponse || submitting}
            className={`w-full ${theme.primary} text-white py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Response'
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            This link will close after you respond
          </p>
        </div>
      </div>
    </div>
  );
}