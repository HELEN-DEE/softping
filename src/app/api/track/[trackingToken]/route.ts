import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

// Explicitly define the context type for Next.js 15
type RouteContext = {
  params: Promise<{ trackingToken: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { trackingToken } = await params;

    // 1. Fetch message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('tracking_token', trackingToken)
      .single();

    if (msgError || !message) {
      return NextResponse.json(
        { error: 'Tracking link not found' },
        { status: 404 }
      );
    }

    // 2. Fetch response (using .maybeSingle() to avoid 406 errors if empty)
    const { data: response } = await supabase
      .from('responses')
      .select('*')
      .eq('message_id', message.id)
      .maybeSingle();

    // 3. Construct the response
    const payload = {
      success: true,
      message: {
        id: message.id,
        senderName: message.sender_name,
        recipientName: message.recipient_name,
        messageText: message.message_text,
        theme: message.theme,
        activities: message.activities,
        isOpened: message.is_opened, // Ensure this matches the UI's 'isOpened'
        createdAt: message.created_at,
        expiresAt: message.expires_at
      },
      response: response ? {
        responseType: response.response_type,
        selectedActivity: response.selected_activity,
        replyText: response.reply_text,
        createdAt: response.created_at
      } : null
    };

    // 4. Return with Cache-Control headers to ensure the "Live" feel
    return new NextResponse(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0', 
      },
    });

  } catch (error) {
    console.error('💥 Error fetching tracking info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}