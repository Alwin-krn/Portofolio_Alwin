import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, MapPin, Calendar, Building2, Wrench, ZoomIn } from 'lucide-react';

// PKL DS3 photos
import pkl01 from '../images/pkl-ds3/pkl-01.jpg';
import pkl02 from '../images/pkl-ds3/pkl-02.jpg';
import pkl03 from '../images/pkl-ds3/pkl-03.jpg';
import pkl04 from '../images/pkl-ds3/pkl-04.jpg';
import pkl05 from '../images/pkl-ds3/pkl-05.jpg';
import pkl06 from '../images/pkl-ds3/pkl-06.jpg';
import pkl07 from '../images/pkl-ds3/pkl-07.jpg';
import pkl08 from '../images/pkl-ds3/pkl-08.jpg';
import pkl09 from '../images/pkl-ds3/pkl-09.jpg';
import pkl10 from '../images/pkl-ds3/pkl-10.jpg';
import pkl11 from '../images/pkl-ds3/pkl-11.jpg';
import pkl12 from '../images/pkl-ds3/pkl-12.jpg';
import pkl13 from '../images/pkl-ds3/pkl-13.jpg';
import pkl14 from '../images/pkl-ds3/pkl-14.jpg';
import pkl15 from '../images/pkl-ds3/pkl-15.jpg';
import pkl16 from '../images/pkl-ds3/pkl-16.jpg';
import pkl17 from '../images/pkl-ds3/pkl-17-manjat.jpg';
import pkl18 from '../images/pkl-ds3/pkl-18-group.jpg';

import { CONTENT } from '../data/content';

const PKL_PHOTOS = [
  pkl01, pkl02, pkl03, pkl04, pkl05, pkl06,
  pkl07, pkl08, pkl09, pkl10, pkl11, pkl12,
  pkl13, pkl14, pkl15, pkl16, pkl17, pkl18
];

const PKL_CONTENT = {
  id: {
    pageTitle: "Dokumentasi PKL - Engineering FTTH",
    subtitle: "PT. Datakom Strata Tiga (DS3)",
    period: "Januari - April 2023",
    location: "Depok, Jawa Barat",
    description: "Selama periode PKL (Praktik Kerja Lapangan) di PT. Datakom Strata Tiga (DS3), saya mendapatkan pengalaman langsung di bidang Engineering FTTH (Fiber To The Home). Berikut adalah dokumentasi kegiatan selama PKL berlangsung.",
    backBtn: "Kembali",
    galleryTitle: "Galeri Dokumentasi",
    activitiesTitle: "Kegiatan Utama",
    activities: [
      {
        title: "Penyambungan Fiber Optik (Splicing)",
        desc: "Melakukan penyambungan kabel fiber optik menggunakan fusion splicer untuk memastikan konektivitas jaringan yang optimal."
      },
      {
        title: "Instalasi FTTH ke Rumah Pelanggan",
        desc: "Memasang perangkat ONT/ONU dan melakukan routing kabel fiber optik dari ODP ke rumah pelanggan."
      },
      {
        title: "Pengukuran Redaman Cahaya (OPM)",
        desc: "Menggunakan Optical Power Meter untuk memastikan redaman cahaya di bawah -25,00 dBm sesuai standar."
      },
      {
        title: "Pemeliharaan ODP (Optical Distribution Point)",
        desc: "Melakukan pengecekan dan pemeliharaan cabinet distribusi optik untuk menjaga kerapihan dan kualitas jaringan."
      }
    ],
    captions: [
      "Dokumentasi PKL 1", "Dokumentasi PKL 2", "Dokumentasi PKL 3",
      "Dokumentasi PKL 4", "Dokumentasi PKL 5", "Dokumentasi PKL 6",
      "Dokumentasi PKL 7", "Dokumentasi PKL 8", "Dokumentasi PKL 9",
      "Dokumentasi PKL 10", "Dokumentasi PKL 11", "Dokumentasi PKL 12",
      "Dokumentasi PKL 13", "Dokumentasi PKL 14", "Perangkat Jaringan",
      "Server Rack & Fiber Optic", "Manjat Tiang ODP", "Foto Saat Anasis Jaringan"
    ]
  },
  en: {
    pageTitle: "Internship Documentation - FTTH Engineering",
    subtitle: "PT. Datakom Strata Tiga (DS3)",
    period: "January - April 2023",
    location: "Bekasi, West Java",
    description: "During my internship at PT. Datakom Strata Tiga (DS3), I gained hands-on experience in FTTH (Fiber To The Home) Engineering. Below is the documentation of activities during the internship period.",
    backBtn: "Go Back",
    galleryTitle: "Documentation Gallery",
    activitiesTitle: "Key Activities",
    activities: [
      {
        title: "Fiber Optic Splicing",
        desc: "Performing fiber optic cable splicing using a fusion splicer to ensure optimal network connectivity."
      },
      {
        title: "FTTH Installation to Customer Homes",
        desc: "Installing ONT/ONU devices and routing fiber optic cables from ODP to customer homes."
      },
      {
        title: "Light Attenuation Measurement (OPM)",
        desc: "Using an Optical Power Meter to ensure light attenuation is below -25.00 dBm according to standards."
      },
      {
        title: "ODP (Optical Distribution Point) Maintenance",
        desc: "Checking and maintaining optical distribution cabinets to ensure neatness and network quality."
      }
    ],
    captions: [
      "Documentation 1", "Documentation 2", "Documentation 3",
      "Documentation 4", "Documentation 5", "Documentation 6",
      "Documentation 7", "Documentation 8", "Documentation 9",
      "Documentation 10", "Documentation 11", "Documentation 12",
      "Documentation 13", "Documentation 14", "Network Equipment",
      "Server Rack & Fiber Optic", "Climbing ODP Pole", "Group Photo with PKL Team"
    ]
  }
};

export default function PklDetail({ lang = 'id', isDark = true }) {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const t = PKL_CONTENT[lang];

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
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % PKL_PHOTOS.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + PKL_PHOTOS.length) % PKL_PHOTOS.length);
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

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-24">
          {/* Back button */}
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

          {/* Title area */}
          <div className={`mt-10 md:mt-16 flex flex-col md:flex-row md:items-start gap-8 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Text content */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed dark:bg-primary/20 text-primary text-sm font-medium mb-6">
                <Wrench className="w-3.5 h-3.5" />
                <span>Engineering FTTH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                {t.pageTitle}
              </h1>
              <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-8 leading-relaxed">
                {t.description}
              </p>

              {/* Info cards */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t.subtitle}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t.period}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITIES SECTION */}
      <section className="py-16 px-6 bg-surface-low dark:bg-dark-surface-low">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t.activitiesTitle}
          </h2>
          <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.activities.map((activity, idx) => (
              <div
                key={idx}
                className={`group p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-ambient dark:hover:shadow-ambient-dark
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
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t.galleryTitle}
          </h2>
          <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-[600ms] ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PKL_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-ambient dark:hover:shadow-ambient-dark
                  border-outline-variant dark:border-dark-outline-variant hover:border-primary/50
                  ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${600 + (idx % 6) * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo}
                    alt={t.captions[idx]}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${idx === 13 ? 'object-[center_25%]' : ''}`}
                    loading="lazy"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 md:p-6">
                  <p className="text-white font-medium text-xs md:text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {t.captions[idx]}
                  </p>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 shrink-0">
                    <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
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
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation - Previous */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + PKL_PHOTOS.length) % PKL_PHOTOS.length); }}
            className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation - Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % PKL_PHOTOS.length); }}
            className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="w-full max-w-5xl max-h-[85vh] mx-auto px-4 sm:px-12 md:px-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={PKL_PHOTOS[lightboxIdx]}
              alt={t.captions[lightboxIdx]}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-scaleIn"
              key={lightboxIdx}
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium text-lg">{t.captions[lightboxIdx]}</p>
              <p className="text-white/50 text-sm mt-1">{lightboxIdx + 1} / {PKL_PHOTOS.length}</p>
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
