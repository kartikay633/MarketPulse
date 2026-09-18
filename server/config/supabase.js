// ROADMAP: Section 6 — Supabase Admin Client (Backend)
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xkrswdqptfgqqipvhxbq.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseSecretKey) {
  logger.warn('SUPABASE_SECRET_KEY not provided in environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabaseAdmin;
