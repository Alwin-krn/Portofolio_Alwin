import { supabase } from './supabase';
import { writeProfileCache } from '../data/mergeContent';

const TABLE = 'site_profile';

// Mengembalikan objek { id: {...}, en: {...} }, atau null kalau belum pernah disimpan.
export async function getProfile() {
  const { data, error } = await supabase.from(TABLE).select('content').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data?.content ?? null;
}

export async function saveProfile(content) {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: 1, content, updated_at: new Date().toISOString() });
  if (error) throw error;
  writeProfileCache(content);
}

// Hapus semua perubahan; situs kembali memakai isi content.js.
export async function resetProfile() {
  const { error } = await supabase.from(TABLE).delete().eq('id', 1);
  if (error) throw error;
  writeProfileCache(null);
}
