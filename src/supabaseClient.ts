import { createClient } from '@supabase/supabase-js';  

const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';  
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';  

export const supabase = createClient(supabaseUrl, supabaseKey);  