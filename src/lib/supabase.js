import { createClient } from '@supabase/supabase-js';

// Isi di file .env (lihat .env.example). Anon key AMAN dipublikasikan
// selama RLS aktif (sudah diatur di supabase/schema.sql).
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const PHOTO_BUCKET = 'project-photos';
