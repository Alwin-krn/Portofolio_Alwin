import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Server, Wrench, ZoomIn } from 'lucide-react';
import { CONTENT } from '../data/content';

// Import all network images dynamically
const imageModules = import.meta.glob('../images/network-docs/*.png', { eager: true, query: '?url', import: 'default' });
const NETWORK_PHOTOS = Object.values(imageModules);

const NETWORK_CONTENT = {
  id: {
    pageTitle: "Dokumentasi Topologi & Jaringan",
    subtitle: "Infrastruktur & Konfigurasi",
    description: "Kumpulan dokumentasi, topologi, serta screenshot dari berbagai proyek dan konfigurasi jaringan yang telah saya kerjakan atau pelajari (MikroTik, Cisco, dll).",
    backBtn: "Kembali",
    galleryTitle: "Galeri Topologi & Konfigurasi",
    activitiesTitle: "Fokus Konfigurasi",
    activities: [
      {
        title: "Konfigurasi MikroTik",
        desc: "Implementasi Routing, Firewall, Bandwidth Management, dan Hotspot pada perangkat MikroTik."
      },
      {
        title: "Desain Topologi",
        desc: "Merancang topologi jaringan yang efisien menggunakan Cisco Packet Tracer dan GNS3."
      },
      {
        title: "VLAN & Switch Management",
        desc: "Segmentasi jaringan menggunakan VLAN untuk keamanan dan manajemen trafik yang lebih baik."
      },
      {
        title: "Troubleshooting",
        desc: "Analisis log dan pemecahan masalah konektivitas pada berbagai layer OSI."
      }
    ]
  },
  en: {
    pageTitle: "Network Topology & Documentation",
    subtitle: "Infrastructure & Configuration",
    description: "A collection of documentation, topologies, and screenshots from various network projects and configurations I have worked on or studied (MikroTik, Cisco, etc.).",
    backBtn: "Go Back",
    galleryTitle: "Topology & Configuration Gallery",
    activitiesTitle: "Configuration Focus",
    activities: [
      {
        title: "MikroTik Configuration",
        desc: "Implementation of Routing, Firewall, Bandwidth Management, and Hotspot on MikroTik devices."
      },
      {
        title: "Topology Design",
        desc: "Designing efficient network topologies using Cisco Packet Tracer and GNS3."
      },
      {
        title: "VLAN & Switch Management",
        desc: "Network segmentation using VLANs for better security and traffic management."
      },
      {
        title: "Troubleshooting",
        desc: "Log analysis and connectivity troubleshooting across various OSI layers."
      }
    ]
  }
};

export default function NetworkDocs({ lang = 'id', isDark = true }) {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const t = NETWORK_CONTENT[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % NETWORK_PHOTOS.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + NETWORK_PHOTOS.length) % NETWORK_PHOTOS.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface transition-colors duration-500">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary/20 dark:via-transparent dark:to-secondary/20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 md:pt-12 md:pb-24">
          <button
            onClick={() => navigate('/')}
            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 
              bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 backdrop-blur-sm border border-outline-variant dark:border-dark-outline-variant 
              hover:border-primary hover:shadow-ambient dark:hover:shadow-ambient-dark hover:scale-105 active:scale-95
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t.backBtn}
          </button>

          <div className={`mt-10 md:mt-16 flex flex-col md:flex-row md:items-start gap-8 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed dark:bg-primary/20 text-primary text-sm font-medium mb-6">
                <Server className="w-3.5 h-3.5" />
                <span>Dokumentasi Konfigurasi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                {t.pageTitle}
              </h1>
              <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-8 leading-relaxed">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm">
                  <Wrench className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t.subtitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITIES SECTION */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-surface-low dark:bg-dark-surface-low">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t.activitiesTitle}
          </h2>
          <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {t.activities.map((activity, idx) => (
              <div
                key={idx}
                className={`group p-5 md:p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-ambient dark:hover:shadow-ambient-dark
                  bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant hover:border-primary/50
                  ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${400 + idx * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-bold text-base mb-2">{activity.title}</h3>
                <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
                  {activity.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t.galleryTitle}
          </h2>
          <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-[600ms] ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {NETWORK_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-ambient dark:hover:shadow-ambient-dark
                  border-outline-variant dark:border-dark-outline-variant hover:border-primary/50 inline-block w-full
                  ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${600 + (idx % 6) * 100}ms` }}
              >
                <div className="w-full">
                  <img
                    src={photo}
                    alt={`Konfigurasi Jaringan ${idx + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 bg-white/5"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-black translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
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
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + NETWORK_PHOTOS.length) % NETWORK_PHOTOS.length); }}
            className="absolute left-2 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % NETWORK_PHOTOS.length); }}
            className="absolute right-2 md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="w-full max-w-7xl max-h-[90vh] mx-auto px-2 sm:px-12 md:px-16 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={NETWORK_PHOTOS[lightboxIdx]}
              alt={`Detail ${lightboxIdx}`}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-scaleIn bg-black/50"
              key={lightboxIdx}
            />
            <div className="text-center mt-4">
              <p className="text-white/70 text-sm">{lightboxIdx + 1} / {NETWORK_PHOTOS.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
