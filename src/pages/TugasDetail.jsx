import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Globe, ShieldCheck, Database, Layers, Layout, ZoomIn } from 'lucide-react';

import imgLogin from '../images/tugas/Screenshot 2026-10-01 155551.png';
import imgRegister from '../images/tugas/Screenshot 2026-10-01 155755.png';
import imgPassVal from '../images/tugas/Screenshot 2026-10-01 155930.png';
import imgLoginErr from '../images/tugas/Screenshot 2026-10-01 160002.png';
import imgDashboard from '../images/tugas/Screenshot 2026-10-01 161941.png';
import imgDropdown from '../images/tugas/Screenshot 2026-10-01 162024.png';

const TUGAS_PHOTOS = [
  imgDashboard,
  imgLogin,
  imgRegister,
  imgPassVal,
  imgLoginErr,
  imgDropdown
];

const TUGAS_CONTENT = {
  id: {
    pageTitle: "Portal Web & Sistem Informasi Wilayah Terpadu",
    subtitle: "UAS Desain & Pemrograman Web — Universitas Islam As-Syafi'iyah",
    description: "Pengembangan aplikasi portal web modern yang mengintegrasikan sistem autentikasi pengguna lengkap dengan validasi keamanan real-time, manajemen sisa percobaan login, serta Sistem Informasi Wilayah Terpadu yang mencakup lebih dari 91.000 data wilayah Indonesia dengan fitur cascading dropdown yang interaktif.",
    backBtn: "Kembali",
    galleryTitle: "Galeri Dokumentasi & Tangkapan Layar",
    activitiesTitle: "Fitur & Komponen Utama",
    activities: [
      {
        icon: ShieldCheck,
        title: "Autentikasi & Keamanan Akun",
        desc: "Sistem login dan registrasi interaktif dilengkapi validasi password kuat (minimal 8 karakter, huruf besar/kecil, angka, simbol) serta penanganan keamanan batas percobaan login (rate limiting)."
      },
      {
        icon: Database,
        title: "Sistem Informasi Wilayah Terpadu",
        desc: "Pengelolaan dan visualisasi lebih dari 91.611 data wilayah dari 38 Provinsi di Indonesia yang dapat diakses secara instan dan efisien."
      },
      {
        icon: Layers,
        title: "Cascading Dynamic Dropdown",
        desc: "Filter wilayah bertingkat dinamis dari tingkat Provinsi, Kabupaten/Kota, Kecamatan, hingga Kelurahan/Desa yang saling terintegrasi."
      },
      {
        icon: Layout,
        title: "Desain Antarmuka Responsif & Modern",
        desc: "Implementasi antarmuka intuitif bertema Dark Mode dengan indikator statistik ringkas, tata letak rapi, serta pengalaman pengguna yang optimal."
      }
    ],
    captions: [
      "Dashboard Portal & Sistem Informasi Wilayah Terpadu (91.611 Data)",
      "Halaman Autentikasi / Login UIA Portal",
      "Form Registrasi Akun Pengguna Baru",
      "Validasi Keamanan Password Real-Time",
      "Penanganan Gagal Login & Sisa Percobaan (Rate Limiting)",
      "Integrasi Data Wilayah Cascading Dropdown (Provinsi/Kota/Kec/Desa)"
    ]
  },
  en: {
    pageTitle: "Web Portal & Integrated Regional Information System",
    subtitle: "Web Design & Programming Project — Universitas Islam As-Syafi'iyah",
    description: "Development of a modern web portal application integrating full user authentication with real-time security validation, login retry rate limiting, and an Integrated Regional Information System covering over 91,000 regional records across Indonesia with interactive cascading dropdowns.",
    backBtn: "Go Back",
    galleryTitle: "Documentation & Screenshot Gallery",
    activitiesTitle: "Key Features & Components",
    activities: [
      {
        icon: ShieldCheck,
        title: "User Authentication & Security",
        desc: "Interactive login and registration system featuring strong password validation (min 8 chars, uppercase/lowercase, numbers, symbols) and login rate limiting."
      },
      {
        icon: Database,
        title: "Integrated Regional Data System",
        desc: "Management and visualization of 91,611+ regional data points across 38 Indonesian Provinces with instant retrieval."
      },
      {
        icon: Layers,
        title: "Cascading Dynamic Dropdowns",
        desc: "Multi-tiered dynamic location filtering spanning Province, Regency/City, District, down to Village level."
      },
      {
        icon: Layout,
        title: "Responsive & Modern UI Design",
        desc: "Sleek Dark Mode interface featuring metric overview cards, clean visual hierarchy, and an optimized user experience."
      }
    ],
    captions: [
      "Portal Dashboard & Integrated Regional Information System (91,611 Records)",
      "UIA Portal Authentication / Login Page",
      "New User Account Registration Form",
      "Real-Time Password Security Validation",
      "Login Failure Handling & Retry Limits (Rate Limiting)",
      "Regional Data Integration via Cascading Dropdown (Province/City/District/Village)"
    ]
  }
};

export default function TugasDetail({ lang = 'id', isDark = true }) {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const t = TUGAS_CONTENT[lang] || TUGAS_CONTENT.id;

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
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % TUGAS_PHOTOS.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + TUGAS_PHOTOS.length) % TUGAS_PHOTOS.length);
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
                <Globe className="w-3.5 h-3.5" />
                <span>Web Application Project</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                {t.pageTitle}
              </h1>
              <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-8 leading-relaxed">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm">
                  <span className="text-xs font-mono font-medium text-primary">{t.subtitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-surface-low dark:bg-dark-surface-low">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t.activitiesTitle}
          </h2>
          <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {t.activities.map((activity, idx) => {
              const IconComp = activity.icon || Globe;
              return (
                <div
                  key={idx}
                  className={`group p-5 md:p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-ambient dark:hover:shadow-ambient-dark
                    bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant hover:border-primary/50
                    ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${400 + idx * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{activity.title}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
                    {activity.desc}
                  </p>
                </div>
              );
            })}
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
            {TUGAS_PHOTOS.map((photo, idx) => (
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
                    alt={t.captions[idx] || `Screenshot Tugas ${idx + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 bg-white/5"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-medium mb-2 line-clamp-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {t.captions[idx]}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-black translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="w-4 h-4" />
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
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + TUGAS_PHOTOS.length) % TUGAS_PHOTOS.length); }}
            className="absolute left-2 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % TUGAS_PHOTOS.length); }}
            className="absolute right-2 md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="w-full max-w-7xl max-h-[90vh] mx-auto px-2 sm:px-12 md:px-16 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={TUGAS_PHOTOS[lightboxIdx]}
              alt={`Detail ${lightboxIdx}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl animate-scaleIn bg-black/50"
              key={lightboxIdx}
            />
            <div className="text-center mt-4 max-w-xl">
              <p className="text-white font-medium text-sm md:text-base mb-1">{t.captions[lightboxIdx]}</p>
              <p className="text-white/60 text-xs">{lightboxIdx + 1} / {TUGAS_PHOTOS.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
