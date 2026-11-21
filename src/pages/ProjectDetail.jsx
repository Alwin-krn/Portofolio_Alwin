import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn,
  MapPin, Calendar, Building2, Wrench,
} from 'lucide-react';

import { CONTENT } from '../data/content';
import { getProject, photoUrl } from '../lib/projects';
import { ICONS } from '../lib/icons';

const UI = {
  id: {
    back: 'Kembali',
    notFound: 'Halaman tidak ditemukan',
    notFoundDesc: 'Proyek ini belum ada atau sudah dihapus.',
    error: 'Gagal memuat data. Periksa koneksi lalu muat ulang halaman.',
    loading: 'Memuat...',
  },
  en: {
    back: 'Go Back',
    notFound: 'Page not found',
    notFoundDesc: 'This project does not exist or has been removed.',
    error: 'Failed to load data. Check your connection and reload the page.',
    loading: 'Loading...',
  },
};

const chipCls =
  'flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm';

export default function ProjectDetail({ lang = 'id', isDark = true, slug: slugProp }) {
  const params = useParams();
  const slug = slugProp || params.slug;
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const ui = UI[lang] || UI.id;
  // Ambil teks sesuai bahasa; jika kosong, jatuh ke Bahasa Indonesia
  const tx = (key) => (project && (project[`${key}_${lang}`] || project[`${key}_id`])) || '';

  const activities = project?.project_activities ?? [];
  const photos = project?.project_photos ?? [];
  const urls = photos.map((p) => photoUrl(p.image_path));
  const isShot = project?.photo_style === 'screenshot';

  // Ambil data
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setLoaded(false);
    window.scrollTo(0, 0);

    getProject('slug', slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) return setStatus('notfound');
        setProject(data);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));

    return () => { cancelled = true; };
  }, [slug]);

  // Animasi masuk setelah data siap
  useEffect(() => {
    if (status !== 'ready') return;
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [status]);

  // Navigasi keyboard untuk lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const n = photos.length;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i + 1) % n);
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i - 1 + n) % n);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, photos.length]);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  // Kembali ke beranda, langsung ke section yang diatur di admin (kolom back_section)
  const goBack = () =>
    navigate('/', { state: { scrollTo: project?.back_section || 'proyek' } });

  // ---------- State non-ready -------------------------------------------
  if (status !== 'ready') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
        {status === 'loading' && <p className="text-on-surface-variant dark:text-dark-on-surface-variant">{ui.loading}</p>}
        {status === 'error' && <p>{ui.error}</p>}
        {status === 'notfound' && (
          <>
            <h1 className="text-2xl font-bold">{ui.notFound}</h1>
            <p className="text-on-surface-variant dark:text-dark-on-surface-variant">{ui.notFoundDesc}</p>
          </>
        )}
        {status !== 'loading' && (
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-outline-variant dark:border-dark-outline-variant hover:border-primary transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {ui.back}
          </button>
        )}
      </div>
    );
  }

  const BadgeIcon = ICONS[project.badge_icon] || Wrench;
  const reveal = loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
  const badge = tx('badge');
  const subtitle = tx('subtitle');
  const period = tx('period');
  const location = tx('location');

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface transition-colors duration-500">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary/20 dark:via-transparent dark:to-secondary/20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 md:pt-12 md:pb-24">
          <button
            onClick={goBack}
            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500
              bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 backdrop-blur-sm border border-outline-variant dark:border-dark-outline-variant
              hover:border-primary hover:shadow-ambient dark:hover:shadow-ambient-dark hover:scale-105 active:scale-95
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {ui.back}
          </button>

          <div className={`mt-10 md:mt-16 flex flex-col md:flex-row md:items-start gap-8 transition-all duration-700 delay-150 ${reveal}`}>
            <div className="max-w-3xl">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed dark:bg-primary/20 text-primary text-sm font-medium mb-6">
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badge}</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                {tx('title')}
              </h1>
              <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-8 leading-relaxed">
                {tx('description')}
              </p>

              <div className="flex flex-wrap gap-4">
                {subtitle && (
                  <div className={chipCls}>
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{subtitle}</span>
                  </div>
                )}
                {period && (
                  <div className={chipCls}>
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{period}</span>
                  </div>
                )}
                {location && (
                  <div className={chipCls}>
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITIES SECTION */}
      {activities.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-6 bg-surface-low dark:bg-dark-surface-low">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-300 ${reveal}`}>
              {tx('activities_title')}
            </h2>
            <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {activities.map((a, idx) => {
                const Icon = a.icon ? ICONS[a.icon] : null;
                return (
                  <div
                    key={a.id}
                    className={`group p-5 md:p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-ambient dark:hover:shadow-ambient-dark
                      bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant hover:border-primary/50
                      ${reveal}`}
                    style={{ transitionDelay: `${400 + idx * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      {Icon ? (
                        <Icon className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-lg">{String(idx + 1).padStart(2, '0')}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-base mb-2">{a[`title_${lang}`] || a.title_id}</h3>
                    <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
                      {a[`desc_${lang}`] || a.desc_id}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PHOTO GALLERY SECTION */}
      {photos.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-500 ${reveal}`}>
              {tx('gallery_title')}
            </h2>
            <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-[600ms] ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, idx) => {
                const caption = photo[`caption_${lang}`] || photo.caption_id;
                return (
                  <div
                    key={photo.id}
                    onClick={() => openLightbox(idx)}
                    className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-ambient dark:hover:shadow-ambient-dark
                      bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant hover:border-primary/50 flex flex-col
                      ${reveal}`}
                    style={{ transitionDelay: `${600 + (idx % 6) * 100}ms` }}
                  >
                    <div className={`relative w-full overflow-hidden bg-black/20 border-b border-outline-variant dark:border-dark-outline-variant flex items-center justify-center ${isShot ? 'aspect-video' : 'aspect-[4/3]'}`}>
                      <img
                        src={urls[idx]}
                        alt={caption || `${tx('title')} ${idx + 1}`}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isShot ? 'object-top' : ''}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIn className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex items-center gap-3 flex-grow">
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs md:text-sm font-medium text-on-surface dark:text-dark-on-surface line-clamp-2">
                        {caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && photos[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + photos.length) % photos.length); }}
            className="absolute left-2 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % photos.length); }}
            className="absolute right-2 md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div
            className="w-full max-w-7xl max-h-[90vh] mx-auto px-2 sm:px-12 md:px-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={urls[lightboxIdx]}
              alt={photos[lightboxIdx][`caption_${lang}`] || photos[lightboxIdx].caption_id || `Foto ${lightboxIdx + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl animate-scaleIn bg-black/50"
              key={lightboxIdx}
            />
            <div className="text-center mt-4 max-w-xl">
              <p className="text-white font-medium text-sm md:text-base mb-1">
                {photos[lightboxIdx][`caption_${lang}`] || photos[lightboxIdx].caption_id}
              </p>
              <p className="text-white/60 text-xs">{lightboxIdx + 1} / {photos.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-8 px-6 text-center border-t border-outline-variant bg-surface-low text-on-surface-variant dark:border-dark-outline-variant dark:bg-dark-surface-low dark:text-dark-on-surface-variant">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {CONTENT[lang].personal.name}. {CONTENT[lang].footer}
        </p>
      </footer>
    </div>
  );
}
