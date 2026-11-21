import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, Pencil, Trash2, ExternalLink, Plus, LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getProjects, deleteProject, reorderProjects } from '../../lib/projects';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setProjects(await getProjects());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const move = async (index, dir) => {
    const next = [...projects];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setProjects(next); // tampilkan dulu, simpan di belakang
    try {
      await reorderProjects(next.map((p) => p.id));
    } catch (e) {
      setError(e.message);
      load();
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Hapus "${p.title_id}" beserta semua foto dan kegiatannya? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusyId(p.id);
    setError('');
    try {
      await deleteProject(p.id);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const iconBtn =
    'p-2 rounded-lg border border-outline-variant dark:border-dark-outline-variant hover:border-primary disabled:opacity-30 disabled:hover:border-outline-variant transition';

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Proyek & Dokumentasi</h1>
            <Link to="/" className="text-sm text-primary hover:underline">Lihat situs</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/profil"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant dark:border-dark-outline-variant hover:border-primary transition">
              <User className="w-4 h-4" /> Edit profil
            </Link>
            <Link to="/admin/proyek/baru"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-primary text-black hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Tambah proyek
            </Link>
            <button onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant dark:border-dark-outline-variant hover:border-primary transition">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        {error && <p role="alert" className="mb-4 text-sm text-red-500">{error}</p>}

        {loading ? (
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Memuat...</p>
        ) : projects.length === 0 ? (
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant">
            Belum ada proyek. Klik "Tambah proyek" untuk membuat yang pertama.
          </p>
        ) : (
          <ul className="space-y-3">
            {projects.map((p, i) => (
              <li key={p.id}
                className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border bg-surface-lowest dark:bg-dark-surface-lowest border-outline-variant dark:border-dark-outline-variant">
                <div className="flex flex-col gap-1">
                  <button aria-label="Naikkan" disabled={i === 0 || busyId} onClick={() => move(i, -1)} className={iconBtn}>
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button aria-label="Turunkan" disabled={i === projects.length - 1 || busyId} onClick={() => move(i, 1)} className={iconBtn}>
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="font-semibold">{p.title_id}</p>
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                    /proyek/{p.slug} — kembali ke "{p.back_section}"
                    {!p.is_published && <span className="ml-2 text-amber-500">Draft</span>}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link to={`/proyek/${p.slug}`} target="_blank" aria-label="Buka halaman" className={iconBtn}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link to={`/admin/proyek/${p.id}`} aria-label="Edit" className={iconBtn}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button aria-label="Hapus" disabled={busyId === p.id} onClick={() => remove(p)}
                    className={`${iconBtn} hover:!border-red-500 hover:text-red-500`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
