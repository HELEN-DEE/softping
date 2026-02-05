import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export type Message = {
    id: string;
    unique_token: string;
    sender_name: string | null;
    recipient_name: string | null;
    message_text: string;
    theme: string;
    activities: string[];
    created_at: string;
    expires_at: string;
    is_opened: boolean;
};

export type Response = {
    id: string;
    message_id: string;
    response_type: 'yes' | 'maybe' | 'no';
    selected_activity: string | null;
    reply_text: string | null;
    created_at: string;
};