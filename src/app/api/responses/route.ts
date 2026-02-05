import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messageId, responseType, selectedActivity, replyText } = body;

        // Validate required fields
        if (!messageId || !responseType) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
        }

        // Check if message exists
        const { data: message, error: messageError } = await supabase
        .from('messages')
        .select('id')
        .eq('id', messageId)
        .single();

        if (messageError || !message) {
        return NextResponse.json(
            { error: 'Message not found' },
            { status: 404 }
        );
        }

        // Check if already responded
        const { data: existingResponse } = await supabase
        .from('responses')
        .select('id')
        .eq('message_id', messageId)
        .single();

        if (existingResponse) {
        return NextResponse.json(
            { error: 'Response already submitted' },
            { status: 400 }
        );
        }

        // Create response
        const { data, error } = await supabase
        .from('responses')
        .insert({
            message_id: messageId,
            response_type: responseType,
            selected_activity: selectedActivity || null,
            reply_text: replyText || null
        })
        .select()
        .single();

        if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
            { error: 'Failed to save response' },
            { status: 500 }
        );
        }

        return NextResponse.json({
        success: true,
        response: data
        });

    } catch (error) {
        console.error('Error creating response:', error);
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        );
    }
}