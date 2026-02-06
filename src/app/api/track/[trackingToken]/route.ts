import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackingToken: string }> }
) {
  try {
    const { trackingToken } = await params;
    console.log('🔍 Looking for message with tracking token:', trackingToken);

    // Fetch message from database using tracking_token
    const { data: message, error } = await supabase
      .from('messages')
      .select('*')
      .eq('tracking_token', trackingToken)
      .single();

    console.log('📤 Message found:', message);
    console.log('📤 Error:', error);

    if (error || !message) {
      return NextResponse.json(
        { error: 'Tracking link not found' },
        { status: 404 }
      );
    }

    // Fetch response if it exists
    const { data: response } = await supabase
      .from('responses')
      .select('*')
      .eq('message_id', message.id)
      .single();

    console.log('📬 Response found:', response);

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        senderName: message.sender_name,
        recipientName: message.recipient_name,
        messageText: message.message_text,
        theme: message.theme,
        activities: message.activities,
        isOpened: message.is_opened,
        createdAt: message.created_at,
        expiresAt: message.expires_at
      },
      response: response ? {
        responseType: response.response_type,
        selectedActivity: response.selected_activity,
        replyText: response.reply_text,
        createdAt: response.created_at
      } : null
    });

  } catch (error) {
    console.error('💥 Error fetching tracking info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}