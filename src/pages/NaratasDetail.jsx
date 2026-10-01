import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, MapPin, Calendar, Building2, Wrench, ZoomIn } from 'lucide-react';

import img1 from '../images/pkl-naratas/20240710_090618_lmc_8.4.jpg';
import img2 from '../images/pkl-naratas/20240714_181504_lmc_8.4.jpg';
import img3 from '../images/pkl-naratas/20240714_181827_lmc_8.4.PORTRAIT.jpg';
import img4 from '../images/pkl-naratas/20240714_181832_lmc_8.4.PORTRAIT.jpg';
import img5 from '../images/pkl-naratas/20240714_181841_lmc_8.4.PORTRAIT.jpg';
import img6 from '../images/pkl-naratas/20240714_182027_lmc_8.4.PORTRAIT.jpg';
import img7 from '../images/pkl-naratas/TimePhoto_20240710_092947.jpg';
import img8 from '../images/pkl-naratas/TimePhoto_20240710_102821.jpg';
import img9 from '../images/pkl-naratas/TimePhoto_20240710_103540.jpg';

import { CONTENT } from '../data/content';

const NARATAS_PHOTOS = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9
];

const NARATAS_CONTENT = {
  id: {
    pageTitle: "Dokumentasi Kerja - Technical Support",
    subtitle: "PT. Naratas Sinergi Solusindo",
    period: "Juni - Agustus 2024",
    location: "Bogor, Jawa Barat",
    description: "Selama bekerja sebagai Technical Support di PT. Naratas Sinergi Solusindo, saya bertanggung jawab atas penanganan gangguan server dan penyambungan fiber optik di lapangan. Berikut adalah dokumentasi kegiatan selama periode tersebut.",
    backBtn: "Kembali",
    galleryTitle: "Galeri Dokumentasi",
    activitiesTitle: "Kegiatan Utama",
    activities: [
      {
        title: "Penanganan Gangguan Server",
        desc: "Merespons dan menangani instruksi dari NOC terkait kendala atau gangguan pada server dan jaringan pelanggan."
      },
      {
        title: "Pengukuran Redaman Cahaya",
        desc: "Menggunakan alat OPM untuk memastikan redaman cahaya jaringan berada di bawah standar -10,00 dBm."
      },
      {
        title: "Penyambungan Kabel Fiber Optik",
        desc: "Melakukan proses splicing kabel fiber optik untuk mengatasi rata-rata 2-3 titik gangguan per harinya."
      },
      {
        title: "Pelaporan Perbaikan",
        desc: "Memperbarui status penanganan dan hasil perbaikan jaringan ke grup koordinasi tim."
      }
    ],
    captions: [
      "Dokumentasi Naratas 1", "Dokumentasi Naratas 2", "Dokumentasi Naratas 3",
      "Dokumentasi Naratas 4", "Dokumentasi Naratas 5", "Dokumentasi Naratas 6",
      "Dokumentasi Naratas 7", "Dokumentasi Naratas 8", "Dokumentasi Naratas 9"
    ]
  },
  en: {
    pageTitle: "Work Documentation - Technical Support",
    subtitle: "PT. Naratas Sinergi Solusindo",
    period: "June - August 2024",
    location: "Bogor, West Java",
    description: "During my time as Technical Support at PT. Naratas Sinergi Solusindo, I was responsible for handling server issues and fiber optic splicing in the field. Below is the documentation of activities during that period.",
    backBtn: "Go Back",
    galleryTitle: "Documentation Gallery",
    activitiesTitle: "Key Activities",
    activities: [
      {
        title: "Server Troubleshooting",
        desc: "Responding to and handling instructions from the NOC regarding server or client network issues."
      },
      {
        title: "Light Attenuation Measurement",
        desc: "Using an OPM tool to ensure network light attenuation remains below the -10.00 dBm standard."
      },
      {
        title: "Fiber Optic Splicing",
        desc: "Performing fiber optic cable splicing to resolve an average of 2-3 breakage points daily."
      },
      {
        title: "Repair Reporting",
        desc: "Updating the handling status and network repair results to the team coordination group."
      }
    ],
    captions: [
      "Naratas Documentation 1", "Naratas Documentation 2", "Naratas Documentation 3",
      "Naratas Documentation 4", "Naratas Documentation 5", "Naratas Documentation 6",
      "Naratas Documentation 7", "Naratas Documentation 8", "Naratas Documentation 9"
    ]
  }
};

export default function NaratasDetail({ lang = 'id', isDark = true }) {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const t = NARATAS_CONTENT[lang];

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
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % NARATAS_PHOTOS.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + NARATAS_PHOTOS.length) % NARATAS_PHOTOS.length);
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
                <span>Technical Support</span>
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

          {/* Clean Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NARATAS_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-ambient dark:hover:shadow-ambient-dark
                  bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant hover:border-primary/50 flex flex-col
                  ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${600 + (idx % 6) * 100}ms` }}
              >
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/20 border-b border-outline-variant dark:border-dark-outline-variant flex items-center justify-center">
                  <img
                    src={photo}
                    alt={t.captions[idx]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Card Caption Info */}
                <div className="p-4 flex items-center gap-3 flex-grow">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs md:text-sm font-medium text-on-surface dark:text-dark-on-surface line-clamp-2">
                    {t.captions[idx]}
                  </p>
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
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + NARATAS_PHOTOS.length) % NARATAS_PHOTOS.length); }}
            className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation - Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % NARATAS_PHOTOS.length); }}
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
              src={NARATAS_PHOTOS[lightboxIdx]}
              alt={t.captions[lightboxIdx]}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-scaleIn"
              key={lightboxIdx}
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium text-lg">{t.captions[lightboxIdx]}</p>
              <p className="text-white/50 text-sm mt-1">{lightboxIdx + 1} / {NARATAS_PHOTOS.length}</p>
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
