import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token;

    // Fetch message from database
    const { data: message, error } = await supabase
        .from('messages')
        .select('*')
        .eq('unique_token', token)
        .single();

    if (error || !message) {
        return NextResponse.json(
            { error: 'Message not found' },
            { status: 404 }
        );
    }

    // Check if message has expired
    const now = new Date();
    const expiresAt = new Date(message.expires_at);
    
    if (now > expiresAt) {
        return NextResponse.json(
            { error: 'This message has expired' },
            { status: 410 }
        );
    }

    // Check if already responded
    const { data: existingResponse } = await supabase
        .from('responses')
        .select('id')
        .eq('message_id', message.id)
        .single();

    if (existingResponse) {
        return NextResponse.json(
            { error: 'This message has already been responded to' },
            { status: 410 }
        );
        }

    // Mark as opened if not already
        if (!message.is_opened) {
        await supabase
            .from('messages')
            .update({ is_opened: true })
            .eq('id', message.id);
        }

    return NextResponse.json({
        success: true,
        message: {
            id: message.id,
            senderName: message.sender_name,
            recipientName: message.recipient_name,
            messageText: message.message_text,
            theme: message.theme,
            activities: message.activities
        }
    });

    } catch (error) {
        console.error('Error fetching message:', error);
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        );
    }
}