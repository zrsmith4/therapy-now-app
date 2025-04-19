
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zgbkypddhyiivvxsgvsb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnYmt5cGRkaHlpaXZ2eHNndnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDQ1MDQsImV4cCI6MjA2MDY4MDUwNH0.aqCtToOx0ETXnk_mvQ1JEVLcZwRKQ0zzwN1Tp019Id4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
