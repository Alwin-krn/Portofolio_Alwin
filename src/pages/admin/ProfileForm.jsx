import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { CONTENT } from '../../data/content';
import { mergeContent } from '../../data/mergeContent';
import { getProfile, saveProfile, resetProfile } from '../../lib/profile';
import { getProjects } from '../../lib/projects';

const inputCls =
  'w-full px-3 py-2 rounded-xl border text-sm bg-surface-lowest dark:bg-dark-surface-lowest border-outline-variant dark:border-dark-outline-variant focus:outline-none focus:border-primary';
const cardCls =
  'p-4 md:p-5 rounded-2xl border bg-surface-lowest dark:bg-dark-surface-lowest border-outline-variant dark:border-dark-outline-variant';
const iconBtn =
  'p-2 rounded-lg border border-outline-variant dark:border-dark-outline-variant hover:border-primary disabled:opacity-30 disabled:hover:border-outline-variant transition';
const addBtn =
  'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant dark:border-dark-outline-variant hover:border-primary text-sm transition';
const hintCls = 'text-xs text-on-surface-variant dark:text-dark-on-surface-variant';

// [path di content.js, label, textarea?]
const GROUPS = [
  {
    title: 'Beranda (hero)',
    fields: [
      ['hero.badge', 'Label kecil di atas nama (kosongkan untuk menyembunyikan)', false],
      ['hero.title1', 'Judul besar', false],
      ['hero.title2', 'Judul kedua (profesi)', false],
      ['hero.desc', 'Deskripsi singkat (kosongkan untuk menyembunyikan)', true],
      ['hero.btnContact', 'Teks tombol kontak', false],
    ],
  },
  {
    title: 'Tentang saya',
    fields: [
      ['personal.aboutTitle', 'Judul bagian', false],
      ['personal.about', 'Isi', true],
    ],
  },
  {
    title: 'Kontak',
    fields: [
      ['personal.location', 'Lokasi (teks)', false],
      ['personal.waMessage', 'Pesan awal WhatsApp (kosong = pesan bawaan)', true],
    ],
  },
  {
    title: 'Judul bagian halaman',
    fields: [
      ['sectionTitles.experience', 'Pengalaman & pendidikan', false],
      ['sectionTitles.work', 'Sub-judul pekerjaan', false],
      ['sectionTitles.education', 'Sub-judul pendidikan', false],
      ['sectionTitles.projects', 'Proyek', false],
      ['sectionTitles.skills', 'Keahlian', false],
      ['sectionTitles.skillsDesc', 'Deskripsi keahlian', true],
      ['sectionTitles.contact', 'Kontak', false],
      ['sectionTitles.contactDesc', 'Deskripsi kontak', true],
      ['footer', 'Teks footer', false],
    ],
  },
];

const LANGS = ['id', 'en'];
const newKey = () => crypto.randomUUID();

const getIn = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const setIn = (obj, path, value) => {
  const [head, ...rest] = path.split('.');
  return { ...obj, [head]: rest.length ? setIn(obj?.[head] || {}, rest.join('.'), value) : value };
};
const move = (list, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);

// Format wa.me: angka saja dengan kode negara, tanpa + atau 0 di depan.
const normalizePhone = (p) => {
  const digits = String(p || '').replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
};

// Tebakan awal untuk data bawaan content.js yang belum punya projectSlug.
const legacySlug = (company = '') =>
  company.includes('DS3') ? 'intern-ds3' : company.includes('Naratas') ? 'naratas' : '';

// ---------- content.js <-> state form ---------------------------------------
const expText = (e = {}) => ({
  role: e.role ?? '', company: e.company ?? '', period: e.period ?? '', tasks: (e.tasks || []).join('\n'),
});
const eduText = (e = {}) => ({ degree: e.degree ?? '', school: e.school ?? '', period: e.period ?? '' });
const emptyExp = () => ({ _key: newKey(), projectSlug: '', id: expText(), en: expText() });
const emptyEdu = () => ({ _key: newKey(), id: eduText(), en: eduText() });

function fromContent(content) {
  const form = {};
  for (const l of LANGS) {
    let t = {};
    for (const g of GROUPS) for (const [path] of g.fields) t = setIn(t, path, getIn(content[l], path) ?? '');
    t.skills = (content[l].skills || []).join('\n');
    form[l] = t;
  }

  const p = content.id.personal || content.en.personal || {};
  form.shared = {
    name: p.name ?? '', email: p.email ?? '', phone: p.phone ?? '', formattedPhone: p.formattedPhone ?? '',
  };

  const zip = (key, build) => {
    const a = content.id[key] || [];
    const b = content.en[key] || [];
    return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => build(a[i] || {}, b[i] || {}));
  };
  form.experience = zip('experience', (x, y) => ({
    _key: newKey(),
    projectSlug: x.projectSlug ?? y.projectSlug ?? legacySlug(x.company || y.company),
    id: expText(x),
    en: expText(y),
  }));
  form.education = zip('education', (x, y) => ({ _key: newKey(), id: eduText(x), en: eduText(y) }));
  return form;
}

function toContent(form) {
  const out = {};
  for (const l of LANGS) {
    let c = {};
    for (const g of GROUPS) {
      for (const [path] of g.fields) c = setIn(c, path, String(getIn(form[l], path) ?? '').trim());
    }
    const s = form.shared;
    c = setIn(c, 'personal.name', s.name.trim());
    c = setIn(c, 'personal.email', s.email.trim());
    c = setIn(c, 'personal.phone', normalizePhone(s.phone));
    c = setIn(c, 'personal.formattedPhone', s.formattedPhone.trim());
    c.skills = lines(form[l].skills);
    c.experience = form.experience.map((e) => ({
      role: e[l].role.trim(),
      company: e[l].company.trim(),
      period: e[l].period.trim(),
      tasks: lines(e[l].tasks),
      projectSlug: e.projectSlug,
    }));
    c.education = form.education.map((e) => ({
      degree: e[l].degree.trim(), school: e[l].school.trim(), period: e[l].period.trim(),
    }));
    out[l] = c;
  }
  return out;
}

// ---------- komponen kecil --------------------------------------------------
// Satu baris dengan dua kolom: Indonesia di kiri, Inggris di kanan.
function PairRow({ label, values, onChange, multiline, rows = 3, hint }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="grid md:grid-cols-2 gap-3">
        {LANGS.map((l) => {
          const common = {
            value: values[l] ?? '',
            onChange: (e) => onChange(l, e.target.value),
            'aria-label': `${label} (${l === 'id' ? 'Indonesia' : 'Inggris'})`,
            placeholder: l === 'id' ? 'Indonesia' : 'English',
            className: inputCls,
          };
          return multiline ? <textarea key={l} rows={rows} {...common} /> : <input key={l} {...common} />;
        })}
      </div>
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );
}

function SharedField({ id, label, value, onChange, hint, type = 'text' }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );
}

export default function ProfileForm() {
  const [form, setForm] = useState(null);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProfile(), getProjects().catch(() => [])])
      .then(([override, list]) => {
        if (cancelled) return;
        setForm(fromContent(mergeContent(CONTENT, override)));
        setProjects(list);
      })
      .catch((e) => !cancelled && setError(`Gagal memuat: ${e.message}`));
    return () => { cancelled = true; };
  }, []);

  const touch = () => setNotice('');
  const setText = (lang, path, value) => {
    touch();
    setForm((f) => ({ ...f, [lang]: setIn(f[lang], path, value) }));
  };
  const setShared = (key, value) => {
    touch();
    setForm((f) => ({ ...f, shared: { ...f.shared, [key]: value } }));
  };

  // Daftar berpasangan (pengalaman, pendidikan): item ke-N di kiri dan kanan selalu satu data
  const updateItem = (list, key, lang, field, value) => {
    touch();
    setForm((f) => ({
      ...f,
      [list]: f[list].map((it) => (it._key === key ? { ...it, [lang]: { ...it[lang], [field]: value } } : it)),
    }));
  };
  const updateSlug = (key, value) => {
    touch();
    setForm((f) => ({
      ...f,
      experience: f.experience.map((it) => (it._key === key ? { ...it, projectSlug: value } : it)),
    }));
  };
  const moveItem = (list, i, dir) => { touch(); setForm((f) => ({ ...f, [list]: move(f[list], i, dir) })); };
  const removeItem = (list, key) => { touch(); setForm((f) => ({ ...f, [list]: f[list].filter((x) => x._key !== key) })); };
  const addItem = (list) => {
    touch();
    setForm((f) => ({ ...f, [list]: [...f[list], list === 'experience' ? emptyExp() : emptyEdu()] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!form.shared.name.trim()) return setError('Nama wajib diisi.');
    if (!normalizePhone(form.shared.phone)) return setError('Nomor WhatsApp wajib diisi (contoh: 6281234567890).');

    setSaving(true);
    try {
      await saveProfile(toContent(form));
      setNotice('Tersimpan. Buka situs dan muat ulang halaman untuk melihat hasilnya.');
    } catch (err) {
      setError(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm('Kembalikan semua teks profil ke isi bawaan (content.js)? Perubahan yang sudah disimpan akan hilang.')) return;
    setError('');
    setNotice('');
    try {
      await resetProfile();
      setForm(fromContent(CONTENT));
      setNotice('Profil dikembalikan ke isi bawaan.');
    } catch (err) {
      setError(`Gagal mengembalikan: ${err.message}`);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center bg-surface dark:bg-dark-surface text-on-surface-variant dark:text-dark-on-surface-variant">
        {error ? <p role="alert" className="text-red-500">{error}</p> : 'Memuat...'}
      </div>
    );
  }

  const slugKnown = (s) => !s || projects.some((p) => p.slug === s);

  const SaveButton = (
    <button type="submit" disabled={saving}
      className="px-5 py-2.5 rounded-xl font-semibold bg-primary text-black hover:opacity-90 disabled:opacity-50 transition">
      {saving ? 'Menyimpan...' : 'Simpan perubahan'}
    </button>
  );

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
      <form onSubmit={submit} className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit profil</h1>
            <Link to="/admin" className="text-sm text-primary hover:underline">Kembali ke daftar proyek</Link>
          </div>
          {SaveButton}
        </div>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        {notice && <p role="status" className="text-sm text-primary">{notice}</p>}

        {/* Data yang sama untuk dua bahasa */}
        <section className={`${cardCls} space-y-4`}>
          <h2 className="text-lg font-bold">Identitas & kontak</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <SharedField id="name" label="Nama" value={form.shared.name} onChange={(v) => setShared('name', v)} />
            <SharedField id="email" type="email" label="Email" value={form.shared.email} onChange={(v) => setShared('email', v)} />
            <SharedField id="phone" label="Nomor WhatsApp (untuk tautan)" value={form.shared.phone}
              onChange={(v) => setShared('phone', v)}
              hint="Angka saja dengan kode negara, contoh 6281234567890. Awalan 0 diubah otomatis menjadi 62." />
            <SharedField id="fphone" label="Nomor yang ditampilkan" value={form.shared.formattedPhone}
              onChange={(v) => setShared('formattedPhone', v)} hint="Bebas, contoh +62 812-3456-7890." />
          </div>
        </section>

        {/* Teks dua bahasa */}
        {GROUPS.map((g) => (
          <section key={g.title} className={`${cardCls} space-y-5`}>
            <h2 className="text-lg font-bold">{g.title}</h2>
            {g.fields.map(([path, label, multiline]) => (
              <PairRow key={path} label={label} multiline={multiline} rows={path === 'personal.about' ? 6 : 3}
                values={{ id: getIn(form.id, path), en: getIn(form.en, path) }}
                onChange={(l, v) => setText(l, path, v)} />
            ))}
          </section>
        ))}

        {/* Pengalaman */}
        <section className={`${cardCls} space-y-4`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Pengalaman kerja ({form.experience.length})</h2>
            <button type="button" onClick={() => addItem('experience')} className={addBtn}>
              <Plus className="w-4 h-4" /> Tambah pengalaman
            </button>
          </div>
          {form.experience.map((x, i) => (
            <div key={x._key} className="p-4 rounded-xl border border-outline-variant dark:border-dark-outline-variant space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">Pengalaman {i + 1}</span>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => moveItem('experience', i, -1)} className={iconBtn}><ArrowUp className="w-4 h-4" /></button>
                  <button type="button" aria-label="Turunkan" disabled={i === form.experience.length - 1} onClick={() => moveItem('experience', i, 1)} className={iconBtn}><ArrowDown className="w-4 h-4" /></button>
                  <button type="button" aria-label="Hapus pengalaman" onClick={() => removeItem('experience', x._key)} className={`${iconBtn} hover:!border-red-500 hover:text-red-500`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {[['role', 'Posisi'], ['company', 'Perusahaan / instansi'], ['period', 'Periode']].map(([field, label]) => (
                <PairRow key={field} label={label}
                  values={{ id: x.id[field], en: x.en[field] }}
                  onChange={(l, v) => updateItem('experience', x._key, l, field, v)} />
              ))}
              <PairRow label="Tugas" multiline rows={5} hint="Satu tugas per baris."
                values={{ id: x.id.tasks, en: x.en.tasks }}
                onChange={(l, v) => updateItem('experience', x._key, l, 'tasks', v)} />
              <div className="space-y-1.5">
                <label htmlFor={`slug-${x._key}`} className="text-sm font-medium">Tautkan ke halaman dokumentasi</label>
                <select id={`slug-${x._key}`} value={x.projectSlug} onChange={(e) => updateSlug(x._key, e.target.value)} className={inputCls}>
                  <option value="">Tanpa tautan</option>
                  {!slugKnown(x.projectSlug) && <option value={x.projectSlug}>/proyek/{x.projectSlug} (tidak ditemukan)</option>}
                  {projects.map((p) => <option key={p.id} value={p.slug}>{p.title_id} (/proyek/{p.slug})</option>)}
                </select>
              </div>
            </div>
          ))}
        </section>

        {/* Pendidikan */}
        <section className={`${cardCls} space-y-4`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Pendidikan ({form.education.length})</h2>
            <button type="button" onClick={() => addItem('education')} className={addBtn}>
              <Plus className="w-4 h-4" /> Tambah pendidikan
            </button>
          </div>
          {form.education.map((x, i) => (
            <div key={x._key} className="p-4 rounded-xl border border-outline-variant dark:border-dark-outline-variant space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">Pendidikan {i + 1}</span>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => moveItem('education', i, -1)} className={iconBtn}><ArrowUp className="w-4 h-4" /></button>
                  <button type="button" aria-label="Turunkan" disabled={i === form.education.length - 1} onClick={() => moveItem('education', i, 1)} className={iconBtn}><ArrowDown className="w-4 h-4" /></button>
                  <button type="button" aria-label="Hapus pendidikan" onClick={() => removeItem('education', x._key)} className={`${iconBtn} hover:!border-red-500 hover:text-red-500`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {[['degree', 'Jenjang / jurusan'], ['school', 'Sekolah / kampus'], ['period', 'Periode']].map(([field, label]) => (
                <PairRow key={field} label={label}
                  values={{ id: x.id[field], en: x.en[field] }}
                  onChange={(l, v) => updateItem('education', x._key, l, field, v)} />
              ))}
            </div>
          ))}
        </section>

        {/* Keahlian */}
        <section className={`${cardCls} space-y-4`}>
          <h2 className="text-lg font-bold">Keahlian</h2>
          <PairRow label="Daftar keahlian" multiline rows={10} hint="Satu keahlian per baris."
            values={{ id: form.id.skills, en: form.en.skills }}
            onChange={(l, v) => setText(l, 'skills', v)} />
        </section>

        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" onClick={reset}
            className="px-5 py-2.5 rounded-xl border border-outline-variant dark:border-dark-outline-variant hover:!border-red-500 hover:text-red-500 transition">
            Kembalikan ke bawaan
          </button>
          <div className="flex gap-3">
            <Link to="/admin" className="px-5 py-2.5 rounded-xl border border-outline-variant dark:border-dark-outline-variant hover:border-primary transition">Kembali</Link>
            {SaveButton}
          </div>
        </div>
      </form>
    </div>
  );
}
