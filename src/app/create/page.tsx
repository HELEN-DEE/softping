"use client";

import React, { useState } from 'react';
import { Heart, Copy, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    recipientName: '',
    message: '',
    theme: 'classic',
    activities: [] as string[]
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const templates = [
    {
      id: 'romantic',
      label: 'Romantic',
      text: "Hey! I know this might be unexpected, but I've been thinking about you a lot lately. Would you maybe want to go out with me this Valentine's? No pressure at all, just thought it could be nice 💕"
    },
    {
      id: 'casual',
      label: 'Casual',
      text: "So... I've been wanting to ask you something. Want to hang out on Valentine's? Could be fun! No worries if not 😊"
    },
    {
      id: 'funny',
      label: 'Funny',
      text: "Okay so I've been practicing this in the mirror for days... want to be my Valentine? I promise I'm less awkward in person (maybe) 😅"
    }
  ];

  const activities = [
    { id: 'coffee', label: '☕ Coffee', icon: '☕' },
    { id: 'movie', label: '🎬 Movie', icon: '🎬' },
    { id: 'dinner', label: '🍽️ Dinner', icon: '🍽️' },
    { id: 'walk', label: '🚶 Walk', icon: '🚶' }
  ];

  const themes = [
    { id: 'classic', label: 'Classic Red', color: 'bg-red-500' },
    { id: 'soft', label: 'Soft Pink', color: 'bg-pink-400' },
    { id: 'playful', label: 'Playful Purple', color: 'bg-purple-500' }
  ];

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setFormData({ ...formData, message: template.text });
  };

  const toggleActivity = (activityId: string) => {
    const current = formData.activities;
    if (current.includes(activityId)) {
      setFormData({ ...formData, activities: current.filter(a => a !== activityId) });
    } else {
      setFormData({ ...formData, activities: [...current, activityId] });
    }
  };

  const generateLink = async () => {
  setIsLoading(true);
  
  try {
    console.log('🚀 Starting API call...');
    console.log('📦 Sending data:', {
      senderName: formData.senderName,
      recipientName: formData.recipientName,
      message: formData.message,
      theme: formData.theme,
      activities: formData.activities,
    });

    const response = await fetch('/api/messages/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderName: formData.senderName,
        recipientName: formData.recipientName,
        message: formData.message,
        theme: formData.theme,
        activities: formData.activities,
      }),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    const data = await response.json();
    console.log('📥 Data received:', data);

    if (!response.ok) {
      console.error('❌ Error from API:', data.error);
      alert(`API Error: ${data.error || 'Unknown error'}`);
      setIsLoading(false);
      return;
    }

    if (!data.link) {
      console.error('❌ No link in response:', data);
      alert('No link was generated. Check console for details.');
      setIsLoading(false);
      return;
    }

    console.log('✅ Setting link:', data.link);
    setGeneratedLink(data.link);
    setStep(3);
  } catch (error) {
    console.error('💥 Catch block error:', error);
    alert(`Error: ${error}`);
  } finally {
    setIsLoading(false);
  }
};

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-2 border-red-100 rounded-3xl p-6 mb-6 shadow-sm">
          <button 
            onClick={() => step === 1 ? router.push('/') : setStep(step - 1)}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors mb-4"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Your Message</h1>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-red-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white border-2 border-red-100 rounded-3xl p-8 shadow-sm">
          {/* Step 1: Basic Info & Message */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="Alex"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Their name (optional)
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="Sam"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quick templates (optional)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="px-4 py-2 bg-pink-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-all border-2 border-red-100 hover:border-red-200"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell them how you feel..."
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none transition-colors"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be genuine. Be you. That&apos;s what matters most.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.message.trim()}
                className="w-full bg-red-500 text-white py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Choose Options
              </button>
            </div>
          )}

          {/* Step 2: Activities & Theme */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  What would you like to do? (optional)
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  They&apos;ll be able to pick their favorite option
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => toggleActivity(activity.id)}
                      disabled={isLoading}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        formData.activities.includes(activity.id)
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-red-200'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{activity.icon}</span>
                      {activity.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose a theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setFormData({ ...formData, theme: theme.id })}
                      disabled={isLoading}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        formData.theme === theme.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-200'
                      }`}
                    >
                      <div className={`w-12 h-12 ${theme.color} rounded-full mx-auto mb-2`}></div>
                      <span className="text-sm">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateLink}
                disabled={isLoading}
                className="w-full bg-red-500 text-white py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating your link...
                  </>
                ) : (
                  'Generate Link 🎉'
                )}
              </button>
            </div>
          )}

          {/* Step 3: Share Link */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900">Your message is ready! 💕</h2>
              <p className="text-gray-600 text-lg">
                Share this link with them. They&apos;ll see your message and can respond privately.
              </p>

              <div className="bg-pink-50 border-2 border-red-200 rounded-2xl p-6">
  <label className="block text-sm font-semibold text-gray-700 mb-3 text-left">
    Your unique link
  </label>
  <div className="flex flex-col sm:flex-row items-stretch gap-3">
    <input
      type="text"
      value={generatedLink}
      readOnly
      onClick={(e) => e.currentTarget.select()}
      className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-red-200 text-gray-700 text-sm"
    />
    <button
      onClick={copyLink}
      className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
    >
      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  </div>
  
  {/* DEBUG: Show what we got back */}
  <p className="text-xs text-gray-500 mt-2">
    Link: {generatedLink || 'No link generated yet'}
  </p>
</div>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-left">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  📱 Tips for sharing:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Send it via text, DM, or any messaging app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>No pressure - they can respond in their own time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>The link is private and only works once</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Messages expire on Feb 15th</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Back Home
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      senderName: '',
                      recipientName: '',
                      message: '',
                      theme: 'classic',
                      activities: []
                    });
                    setGeneratedLink('');
                  }}
                  className="flex-1 bg-red-500 text-white py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Decorative hearts at bottom */}
        {step !== 3 && (
          <div className="mt-8 flex justify-center gap-3">
            <Heart className="w-5 h-5 text-red-300" fill="currentColor" />
            <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
            <Heart className="w-5 h-5 text-red-300" fill="currentColor" />
          </div>
        )}
      </div>
    </div>
  );
}