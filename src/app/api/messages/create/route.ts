import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate a unique token (more secure than Math.random)
    const uniqueToken = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Generate a separate tracking token
    const trackingToken = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}-track`;
    
    // Calculate expiry date (Feb 15, or 20 days from now, whichever comes first)
    const feb15 = new Date('2026-02-15T23:59:59');
    const twentyDaysFromNow = new Date();
    twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20);
    const expiresAt = feb15 < twentyDaysFromNow ? feb15 : twentyDaysFromNow;
    
    // Insert message into database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        unique_token: uniqueToken,
        tracking_token: trackingToken,
        sender_name: body.senderName || null,
        recipient_name: body.recipientName || null,
        message_text: body.message,
        theme: body.cardStyle || 'classic',
        activities: body.activities || [],
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      );
    }

    // Generate the shareable links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const messageLink = `${baseUrl}/m/${uniqueToken}`;
    const trackingLink = `${baseUrl}/track/${trackingToken}`;

    return NextResponse.json({
      success: true,
      token: uniqueToken,
      trackingToken: trackingToken,
      link: messageLink,
      trackingLink: trackingLink,
      messageId: data.id
    });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}