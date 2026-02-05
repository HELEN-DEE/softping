import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    console.log('🔵 API route called');
    
    // Check environment variables
    console.log(' Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(' Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log(' Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    console.log('First 20 chars of key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));


    
    const body = await request.json();
    console.log('📦 Body received:', body);
    
    // Generate a unique token
    const uniqueToken = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
    console.log('🎫 Generated token:', uniqueToken);
    
    // Calculate expiry date
    const feb15 = new Date('2026-02-15T23:59:59');
    const twentyDaysFromNow = new Date();
    twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20);
    const expiresAt = feb15 < twentyDaysFromNow ? feb15 : twentyDaysFromNow;
    console.log('📅 Expires at:', expiresAt);
    
    // Prepare data for insertion
    const insertData = {
      unique_token: uniqueToken,
      sender_name: body.senderName || null,
      recipient_name: body.recipientName || null,
      message_text: body.message,
      theme: body.theme || 'classic',
      activities: body.activities || [],
      expires_at: expiresAt.toISOString()
    };
    console.log('💾 Inserting data:', insertData);
    
    // Insert message into database
    const { data, error } = await supabase
      .from('messages')
      .insert(insertData)
      .select()
      .single();

    console.log('📤 Supabase response - data:', data);
    console.log('📤 Supabase response - error:', error);

    if (error) {
      console.error('❌ Supabase error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to create message', details: error.message },
        { status: 500 }
      );
    }

    // Generate the shareable link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const link = `${baseUrl}/m/${uniqueToken}`;
    console.log('🔗 Generated link:', link);

    return NextResponse.json({
      success: true,
      token: uniqueToken,
      link: link,
      messageId: data.id
    });

  } catch (error) {
    console.error('💥 Catch block error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}