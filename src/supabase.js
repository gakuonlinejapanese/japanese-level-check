import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hsulsdgrnaxueiwcflyk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdWxzZGdybmF4dWVpd2NmbHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTYxMzQsImV4cCI6MjA5NjMzMjEzNH0.dYhEtkkB1STVqYL7edihqt0o3-avpmeWC8qGFpZbZyA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
