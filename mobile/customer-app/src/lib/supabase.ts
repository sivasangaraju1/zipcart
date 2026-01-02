import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbtzwdeqzfrjdlegemcs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidHp3ZGVxemZyamRsZWdlbWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDIwMTQsImV4cCI6MjA4MjkxODAxNH0.7u0c8RuWRvHIKEEnbo_zxRW1FQ0800Lgb0mRFe0lYZU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
