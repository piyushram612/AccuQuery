// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { Conversation, Message } from '../types'; // Make sure your types are correct

// Add your Supabase Project URL and Anon Key here
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define a type for your conversation table row
export type ConversationRow = {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: string;
}