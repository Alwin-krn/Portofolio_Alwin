import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUp, ArrowDown, Trash2, Plus, ImagePlus } from 'lucide-react';
import { getProject, saveProject, photoUrl } from '../../lib/projects';
import { ICONS } from '../../lib/icons';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // sama dengan batas bucket project-photos
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SECTION_SUGGESTIONS = ['proyek', 'pengalaman'];

// [kolom, label, textarea?]. Setiap kolom punya pasangan _id dan _en.
const TEXT_FIELDS = [
  ['badge', 'Label kecil di atas judul', false],
  ['title', 'Judul halaman', false],
  ['subtitle', 'Instansi / subjudul', false],
  ['period', 'Periode', false],
  ['location', 'Lokasi', false],
  ['description', 'Deskripsi', true],
  ['activities_title', 'Judul bagian kegiatan', false],
  ['gallery_title', 'Judul galeri', false],
];

const EMPTY_PROJECT = {
  slug: '',
  back_section: 'proyek',
  badge_icon: 'wrench',
  photo_style: 'photo',
  is_published: true,
  badge_id: '', badge_en: '',
  title_id: '', title_en: '',
  subtitle_id: '', subtitle_en: '',
  period_id: '', period_en: '',
  location_id: '', location_en: '',
  description_id: '', description_en: '',
  activities_title_id: 'Kegiatan Utama', activities_title_en: 'Key Activities',
  gallery_title_id: 'Galeri Dokumentasi', gallery_title_en: 'Documentation Gallery',
};

const newKey = () => crypto.randomUUID();

const move = (list, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

const inputCls =
  'w-full px-3 py-2 rounded-xl border text-sm bg-surface-lowest dark:bg-dark-surface-lowest border-outline-variant dark:border-dark-outline-variant focus:outline-none focus:border-primary';
const cardCls =
  'p-4 md:p-5 rounded-2xl border bg-surface-lowest dark:bg-dark-surface-lowest border-outline-variant dark:border-dark-outline-variant';
const iconBtn =
  'p-2 rounded-lg border border-outline-variant dark:border-dark-outline-variant hover:border-primary disabled:opacity-30 disabled:hover:border-outline-variant transition';

export default function ProjectForm() {
  const { id } = useParams();
  const isNew = id === 'baru';
  const navigate = useNavigate();

  const [project, setProject] = useState(EMPTY_PROJECT);
  const [activities, setActivities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [removedActivityIds, setRemovedActivityIds] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Muat data saat edit
  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    getProject('id', id)
      .then((data) => {
        if (cancelled) return;
        if (!data) return setError('Proyek tidak ditemukan.');
        const { project_activities, project_photos, ...rest } = data;
        setProject(rest);
        setActivities(project_activities.map((a) => ({ ...a, _key: newKey() })));
        setPhotos(project_photos.map((p) => ({ ...p, _key: newKey(), preview: photoUrl(p.image_path) })));
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id, isNew]);

  const set = (key, value) => setProject((p) => ({ ...p, [key]: value }));

  // ---------- Kegiatan ---------------------------------------------------
  const addActivity = () =>
    setActivities((a) => [...a, { _key: newKey(), icon: '', title_id: '', title_en: '', desc_id: '', desc_en: '' }]);
  const updateActivity = (key, field, value) =>
    setActivities((list) => list.map((a) => (a._key === key ? { ...a, [field]: value } : a)));
  const removeActivity = (a) => {
    if (a.id) setRemovedActivityIds((ids) => [...ids, a.id]);
    setActivities((list) => list.filter((x) => x._key !== a._key));
  };

  // ---------- Foto -------------------------------------------------------
  const addFiles = (fileList) => {
    const added = [];
    const rejected = [];
    for (const file of Array.from(fileList)) {
      if (!ALLOWED_TYPES.includes(file.type)) rejected.push(`${file.name} (bukan JPG/PNG/WebP)`);
      else if (file.size > MAX_PHOTO_BYTES) rejected.push(`${file.name} (lebih dari 5 MB)`);
      else added.push({ _key: newKey(), file, preview: URL.createObjectURL(file), caption_id: '', caption_en: '' });
    }
    if (added.length) setPhotos((p) => [...p, ...added]);
    setError(rejected.length ? `File ditolak: ${rejected.join(', ')}` : '');
  };
  const updatePhoto = (key, field, value) =>
    setPhotos((list) => list.map((p) => (p._key === key ? { ...p, [field]: value } : p)));
  const removePhoto = (p) => {
    if (p.id) setRemovedPhotos((r) => [...r, { id: p.id, image_path: p.image_path }]);
    if (p.file) URL.revokeObjectURL(p.preview);
    setPhotos((list) => list.filter((x) => x._key !== p._key));
  };

  // ---------- Simpan -------------------------------------------------------
  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const slug = project.slug.trim();
    if (!/^[a-z0-9-]+$/.test(slug)) return setError('Slug hanya boleh huruf kecil, angka, dan tanda hubung (contoh: pkl-ds3).');
    if (!project.title_id.trim()) return setError('Judul (Indonesia) wajib diisi.');

    setSaving(true);
    try {
      await saveProject({
        project: { ...project, slug, back_section: project.back_section.trim() || 'proyek' },
        activities,
        photos,
        removedActivityIds,
        removedPhotos,
      });
      navigate('/admin');
    } catch (err) {
      setError(
        err.code === '23505'
          ? 'Slug sudah dipakai proyek lain. Pakai slug yang berbeda.'
          : `Gagal menyimpan: ${err.message}`
      );
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface text-on-surface-variant dark:text-dark-on-surface-variant">Memuat...</div>;
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
      <form onSubmit={submit} className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{isNew ? 'Tambah proyek' : 'Edit proyek'}</h1>
            <Link to="/admin" className="text-sm text-primary hover:underline">Kembali ke daftar</Link>
          </div>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold bg-primary text-black hover:opacity-90 disabled:opacity-50 transition">
            {saving ? 'Menyimpan...' : 'Simpan perubahan'}
          </button>
        </div>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

        {/* Pengaturan umum */}
        <section className={`${cardCls} space-y-4`}>
          <h2 className="text-lg font-bold">Pengaturan</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-sm font-medium">Slug (alamat halaman)</label>
              <input id="slug" required value={project.slug} onChange={(e) => set('slug', e.target.value)}
                placeholder="pkl-ds3" className={inputCls} />
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                Halaman akan berada di /proyek/{project.slug || 'slug'}
              </p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="back" className="text-sm font-medium">Tombol Kembali menuju section</label>
              <input id="back" list="sections" value={project.back_section}
                onChange={(e) => set('back_section', e.target.value)} className={inputCls} />
              <datalist id="sections">
                {SECTION_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
              </datalist>
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                Isi dengan id section di beranda.
              </p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="icon" className="text-sm font-medium">Ikon label</label>
              <select id="icon" value={project.badge_icon} onChange={(e) => set('badge_icon', e.target.value)} className={inputCls}>
                {Object.keys(ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="style" className="text-sm font-medium">Jenis gambar</label>
              <select id="style" value={project.photo_style} onChange={(e) => set('photo_style', e.target.value)} className={inputCls}>
                <option value="photo">Foto (rasio 4:3)</option>
                <option value="screenshot">Tangkapan layar (rasio 16:9, potong dari atas)</option>
              </select>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={project.is_published} onChange={(e) => set('is_published', e.target.checked)} />
            Tampilkan di situs (hilangkan centang untuk menyimpan sebagai draft)
          </label>
        </section>

        {/* Teks dua bahasa */}
        <section className={`${cardCls} space-y-5`}>
          <h2 className="text-lg font-bold">Teks halaman</h2>
          {TEXT_FIELDS.map(([key, label, multiline]) => (
            <div key={key} className="space-y-1.5">
              <p className="text-sm font-medium">{label}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {['id', 'en'].map((l) => {
                  const field = `${key}_${l}`;
                  const common = {
                    id: field,
                    value: project[field],
                    onChange: (e) => set(field, e.target.value),
                    'aria-label': `${label} (${l === 'id' ? 'Indonesia' : 'Inggris'})`,
                    placeholder: l === 'id' ? 'Indonesia' : 'English',
                    className: inputCls,
                  };
                  return multiline ? <textarea key={field} rows={5} {...common} /> : <input key={field} {...common} />;
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Kegiatan */}
        <section className={`${cardCls} space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Kegiatan ({activities.length})</h2>
            <button type="button" onClick={addActivity}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant dark:border-dark-outline-variant hover:border-primary text-sm transition">
              <Plus className="w-4 h-4" /> Tambah kegiatan
            </button>
          </div>
          {activities.length === 0 && (
            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
              Belum ada kegiatan. Bagian ini disembunyikan di halaman publik jika kosong.
            </p>
          )}
          {activities.map((a, i) => (
            <div key={a._key} className="p-4 rounded-xl border border-outline-variant dark:border-dark-outline-variant space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">Kegiatan {i + 1}</span>
                <div className="flex items-center gap-2">
                  <select aria-label="Ikon kegiatan" value={a.icon || ''} onChange={(e) => updateActivity(a._key, 'icon', e.target.value)} className={`${inputCls} !w-auto`}>
                    <option value="">Nomor (tanpa ikon)</option>
                    {Object.keys(ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => setActivities((l) => move(l, i, -1))} className={iconBtn}><ArrowUp className="w-4 h-4" /></button>
                  <button type="button" aria-label="Turunkan" disabled={i === activities.length - 1} onClick={() => setActivities((l) => move(l, i, 1))} className={iconBtn}><ArrowDown className="w-4 h-4" /></button>
                  <button type="button" aria-label="Hapus kegiatan" onClick={() => removeActivity(a)} className={`${iconBtn} hover:!border-red-500 hover:text-red-500`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input aria-label="Judul kegiatan (Indonesia)" placeholder="Judul (Indonesia)" value={a.title_id} onChange={(e) => updateActivity(a._key, 'title_id', e.target.value)} className={inputCls} />
                <input aria-label="Judul kegiatan (Inggris)" placeholder="Title (English)" value={a.title_en} onChange={(e) => updateActivity(a._key, 'title_en', e.target.value)} className={inputCls} />
                <textarea aria-label="Deskripsi kegiatan (Indonesia)" rows={3} placeholder="Deskripsi (Indonesia)" value={a.desc_id} onChange={(e) => updateActivity(a._key, 'desc_id', e.target.value)} className={inputCls} />
                <textarea aria-label="Deskripsi kegiatan (Inggris)" rows={3} placeholder="Description (English)" value={a.desc_en} onChange={(e) => updateActivity(a._key, 'desc_en', e.target.value)} className={inputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* Foto */}
        <section className={`${cardCls} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Foto ({photos.length})</h2>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant dark:border-dark-outline-variant hover:border-primary text-sm cursor-pointer transition">
              <ImagePlus className="w-4 h-4" /> Tambah foto
              <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only"
                onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
            </label>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
            JPG, PNG, atau WebP, maksimal 5 MB per file. Foto baru di-upload saat kamu menekan Simpan perubahan.
          </p>
          {photos.length === 0 && (
            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
              Belum ada foto. Galeri disembunyikan di halaman publik jika kosong.
            </p>
          )}
          <ul className="space-y-3">
            {photos.map((p, i) => (
              <li key={p._key} className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl border border-outline-variant dark:border-dark-outline-variant">
                <img src={p.preview} alt={`Pratinjau foto ${i + 1}`}
                  className="w-full sm:w-40 h-28 object-cover rounded-lg bg-black/20 shrink-0" />
                <div className="flex-1 grid md:grid-cols-2 gap-3 content-start">
                  <input aria-label={`Caption foto ${i + 1} (Indonesia)`} placeholder="Caption (Indonesia)" value={p.caption_id} onChange={(e) => updatePhoto(p._key, 'caption_id', e.target.value)} className={inputCls} />
                  <input aria-label={`Caption foto ${i + 1} (Inggris)`} placeholder="Caption (English)" value={p.caption_en} onChange={(e) => updatePhoto(p._key, 'caption_en', e.target.value)} className={inputCls} />
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => setPhotos((l) => move(l, i, -1))} className={iconBtn}><ArrowUp className="w-4 h-4" /></button>
                  <button type="button" aria-label="Turunkan" disabled={i === photos.length - 1} onClick={() => setPhotos((l) => move(l, i, 1))} className={iconBtn}><ArrowDown className="w-4 h-4" /></button>
                  <button type="button" aria-label="Hapus foto" onClick={() => removePhoto(p)} className={`${iconBtn} hover:!border-red-500 hover:text-red-500`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex justify-end gap-3">
          <Link to="/admin" className="px-5 py-2.5 rounded-xl border border-outline-variant dark:border-dark-outline-variant hover:border-primary transition">Batal</Link>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold bg-primary text-black hover:opacity-90 disabled:opacity-50 transition">
            {saving ? 'Menyimpan...' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
