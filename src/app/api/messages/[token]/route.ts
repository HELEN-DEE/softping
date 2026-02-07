import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { token } = await params;

    // Fetch message
    const { data: message, error } = await supabase
      .from('messages')
      .select('*')
      .eq('unique_token', token)
      .single();

    if (error || !message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    //  Check Expiry
    if (new Date() > new Date(message.expires_at)) {
      return NextResponse.json({ error: 'This message has expired' }, { status: 410 });
    }

    // Return the data
    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        senderName: message.sender_name,
        recipientName: message.recipient_name,
        messageText: message.message_text,
        cardStyle: message.theme, 
        activities: message.activities,
        isOpened: message.is_opened
      }
    });

  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH HANDLER - This marks the message as opened
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { token } = await params;

    const { error } = await supabase
      .from('messages')
      .update({ is_opened: true })
      .eq('unique_token', token);

    if (error) {
      console.error('Error updating is_opened:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}