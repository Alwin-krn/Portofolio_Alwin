import { supabase, PHOTO_BUCKET } from './supabase';

// ---------- Helper ----------------------------------------------------

export const photoUrl = (path) =>
  supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;

const bySort = (a, b) => a.sort_order - b.sort_order;

const normalize = (p) =>
  p && {
    ...p,
    project_activities: [...(p.project_activities || [])].sort(bySort),
    project_photos: [...(p.project_photos || [])].sort(bySort),
  };

// Insert baris baru & upsert baris yang sudah punya id dipisah supaya
// kolom tiap request konsisten.
async function writeRows(table, rows) {
  const existing = rows.filter((r) => r.id);
  const fresh = rows.filter((r) => !r.id);
  if (existing.length) {
    const { error } = await supabase.from(table).upsert(existing);
    if (error) throw error;
  }
  if (fresh.length) {
    const { error } = await supabase.from(table).insert(fresh);
    if (error) throw error;
  }
}

// ---------- Baca (publik & admin) ---------------------------------------

// Daftar proyek. RLS sudah menyembunyikan yang belum dipublikasikan dari
// pengunjung; admin yang login otomatis melihat semuanya.
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

// column: 'slug' (halaman publik) atau 'id' (form admin)
export async function getProject(column, value) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_activities(*), project_photos(*)')
    .eq(column, value)
    .maybeSingle();
  if (error) throw error;
  return normalize(data);
}

// ---------- Tulis (admin) -----------------------------------------------

export async function saveProject({
  project,
  activities,
  photos,
  removedActivityIds,
  removedPhotos,
}) {
  let id = project.id;

  const payload = { ...project };
  ['id', 'sort_order', 'created_at', 'updated_at', 'project_activities', 'project_photos'].forEach(
    (k) => delete payload[k]
  );

  if (id) {
    const { error } = await supabase.from('projects').update(payload).eq('id', id);
    if (error) throw error;
  } else {
    // Proyek baru ditaruh di urutan paling akhir
    const { data: last } = await supabase
      .from('projects')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);
    payload.sort_order = (last?.[0]?.sort_order ?? -1) + 1;

    const { data, error } = await supabase.from('projects').insert(payload).select('id').single();
    if (error) throw error;
    id = data.id;
  }

  // Kegiatan
  if (removedActivityIds.length) {
    const { error } = await supabase.from('project_activities').delete().in('id', removedActivityIds);
    if (error) throw error;
  }
  await writeRows(
    'project_activities',
    activities.map((a, i) => ({
      ...(a.id ? { id: a.id } : {}),
      project_id: id,
      icon: a.icon || null,
      title_id: a.title_id || '',
      title_en: a.title_en || '',
      desc_id: a.desc_id || '',
      desc_en: a.desc_en || '',
      sort_order: i,
    }))
  );

  // Foto yang dihapus: file di Storage dulu, baru barisnya
  if (removedPhotos.length) {
    const { error: rmErr } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove(removedPhotos.map((p) => p.image_path));
    if (rmErr) throw rmErr;
    const { error } = await supabase
      .from('project_photos')
      .delete()
      .in('id', removedPhotos.map((p) => p.id));
    if (error) throw error;
  }

  // Foto baru di-upload, lalu semua baris foto disimpan dengan urutan terbaru
  const photoRows = [];
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    let image_path = p.image_path;
    if (p.file) {
      const ext = (p.file.name.split('.').pop() || 'jpg').toLowerCase();
      image_path = `${id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(image_path, p.file, { contentType: p.file.type, upsert: false });
      if (error) throw error;
    }
    photoRows.push({
      ...(p.id ? { id: p.id } : {}),
      project_id: id,
      image_path,
      caption_id: p.caption_id || '',
      caption_en: p.caption_en || '',
      sort_order: i,
    });
  }
  await writeRows('project_photos', photoRows);

  return id;
}

// Hapus file foto di Storage dulu, baru baris proyek (foto & kegiatan
// ikut terhapus lewat ON DELETE CASCADE).
export async function deleteProject(id) {
  const { data: photos, error: selErr } = await supabase
    .from('project_photos')
    .select('image_path')
    .eq('project_id', id);
  if (selErr) throw selErr;

  if (photos.length) {
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove(photos.map((p) => p.image_path));
    if (error) throw error;
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderProjects(ids) {
  const { error } = await supabase.rpc('reorder_projects', { ids });
  if (error) throw error;
}
