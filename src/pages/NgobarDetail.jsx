import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Code2, Users, Calendar, MapPin, Building2, Presentation, ZoomIn } from 'lucide-react';

import img1 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG-20260524-WA0125.jpg';
import img2 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG-20260524-WA0128.jpg';
import img3 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG-20260524-WA0147.jpg';
import img4 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG-20260524-WA0148.jpg';
import img5 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG_0003.JPG';
import img6 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG_0061.JPG';
import img7 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG_0079.JPG';
import img8 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG_0080.JPG';
import img9 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG_0102.JPG';
import img10 from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG_0110.JPG';

const NGOBAR_PHOTOS = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10
];

const NGOBAR_CONTENT = {
  id: {
    pageTitle: "Workshop NGOBAR (Ngoding Bareng)",
    subtitle: "Panduan Dasar Menyusun Kerangka & Gaya Website",
    organizer: "HMTF - Universitas Islam As-Syafi'iyah",
    period: "20 - 23 Mei 2026",
    location: "Gedung Alawiyah Lantai 4, UIA",
    roleBadge: "Pemateri & Instruktur Utama",
    description: "Berperan sebagai Pemateri Utama dalam kegiatan Workshop NGOBAR (Ngoding Bareng) yang diselenggarakan oleh Himpunan Mahasiswa Teknik Informatika (HMTF) Universitas Islam As-Syafi'iyah. Workshop ini berfokus pada pengajaran dasar pembuatan struktur halaman web (HTML) dan perancangan gaya tampilan antarmuka (CSS) secara hands-on bagi mahasiswa.",
    backBtn: "Kembali",
    galleryTitle: "Galeri Dokumentasi Kegiatan",
    activitiesTitle: "Sorotan Kegiatan & Peran Utama",
    activities: [
      {
        icon: Presentation,
        title: "Pemateri Utama Workshop",
        desc: "Menyampaikan materi komprehensif mengenai konsep dasar struktur HTML, sintaks CSS, dan sintaksis tata letak web modern."
      },
      {
        icon: Code2,
        title: "Live Coding & Demonstrasi",
        desc: "Melakukan demonstrasi penyusunan komponen website secara langsung agar peserta memahami sintaks dan implementasi visual."
      },
      {
        icon: Users,
        title: "Mentoring & Sesi Hands-on",
        desc: "Mendampingi peserta secara individu dan kelompok dalam menyelesaikan latihan penulisan kode HTML/CSS di tempat."
      },
      {
        icon: Building2,
        title: "Kolaborasi Akademik (HMTF UIA)",
        desc: "Bekerjasama dengan pengurus Himpunan Mahasiswa Teknik Informatika UIA dalam memfasilitasi peningkatan keahlian teknis web development."
      }
    ],
    captions: [
      "Sesi Pemaparan Materi Workshop NGOBAR oleh Alwin Dwi Kurniawan",
      "Pembagian Sertifkasi kepada Pemateri oleh Ketua Acara HMTF UIA",
      "Penyampaian Konsep Dasar HTML & Styling CSS di Laboratorium",
      "Dokumentasi Bersama Panitia HMTF & Peserta Workshop NGOBAR",
      "Sesi Konsultasi dan Pemecahan Kendala Kode (Troubleshooting)",
      "Dokumentasi Pembukaan dan Pengenalan Program NGOBAR",
      "Sesi Demonstrasi Komponen Antarmuka Web oleh Pemateri",
      "Antusiasme Peserta Selama Pelatihan Ngoding Bareng HMTF",
      "Pendampingan Praktik Pembuatan Layout Website Responsif",
      "Pendampingan dan Diskusi Kode Bersama Peserta Workshop"
    ]
  },
  en: {
    pageTitle: "NGOBAR (Ngoding Bareng) Workshop",
    subtitle: "Fundamentals of Website Structure & Styling",
    organizer: "HMTF - Universitas Islam As-Syafi'iyah",
    period: "May 20 - 23, 2026",
    location: "Alawiyah Building 4th Floor, UIA",
    roleBadge: "Main Speaker & Instructor",
    description: "Served as the Keynote Speaker and Main Instructor for the NGOBAR (Ngoding Bareng) Workshop organized by the Informatics Engineering Student Association (HMTF) at Universitas Islam As-Syafi'iyah. The workshop provided hands-on training on HTML structure and CSS styling fundamentals for university students.",
    backBtn: "Go Back",
    galleryTitle: "Event Documentation Gallery",
    activitiesTitle: "Key Highlights & Responsibilities",
    activities: [
      {
        icon: Presentation,
        title: "Main Workshop Instructor",
        desc: "Delivered comprehensive sessions covering HTML structural markup, CSS rules, and modern web layout principles."
      },
      {
        icon: Code2,
        title: "Live Coding Demonstrations",
        desc: "Conducted real-time live coding demonstrations to show practical component building and styling techniques."
      },
      {
        icon: Users,
        title: "Hands-on Mentoring",
        desc: "Guided participants individually and in groups to solve coding exercises and build responsive web pages."
      },
      {
        icon: Building2,
        title: "Academic Collaboration (HMTF UIA)",
        desc: "Collaborated with the Informatics Student Association to foster technical web development skills across campus."
      }
    ],
    captions: [
      "NGOBAR Workshop Presentation Session by Alwin Dwi Kurniawan",
      "Participants Following the Hands-On HTML/CSS Coding Session",
      "Delivering HTML Structural & CSS Styling Fundamentals",
      "Group Documentation with HMTF Committee & Participants",
      "Direct Code Troubleshooting & Consultation Session",
      "Opening & Program Introduction for NGOBAR HMTF UIA",
      "Live Demonstration of Web Interface Component Styling",
      "Participant Engagement During the HMTF Coding Session",
      "Guiding Practical Building of Responsive Web Layouts",
      "Code Assistance and Mentoring with Workshop Participants"
    ]
  }
};

export default function NgobarDetail({ lang = 'id', isDark = true }) {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const t = NGOBAR_CONTENT[lang] || NGOBAR_CONTENT.id;

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
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % NGOBAR_PHOTOS.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + NGOBAR_PHOTOS.length) % NGOBAR_PHOTOS.length);
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
                <Presentation className="w-3.5 h-3.5" />
                <span>{t.roleBadge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                {t.pageTitle}
              </h1>
              <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-8 leading-relaxed">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lowest/80 dark:bg-dark-surface-lowest/80 border border-outline-variant dark:border-dark-outline-variant backdrop-blur-sm">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t.organizer}</span>
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
      <section className="py-12 md:py-16 px-4 md:px-6 bg-surface-low dark:bg-dark-surface-low">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t.activitiesTitle}
          </h2>
          <div className={`w-16 h-1 bg-primary rounded-full mb-10 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 scale-x-100 origin-left' : 'opacity-0 scale-x-0'}`}></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {t.activities.map((activity, idx) => {
              const IconComp = activity.icon || Code2;
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

          {/* Clean Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NGOBAR_PHOTOS.map((photo, idx) => (
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
                    alt={t.captions[idx] || `Foto NGOBAR ${idx + 1}`}
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
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + NGOBAR_PHOTOS.length) % NGOBAR_PHOTOS.length); }}
            className="absolute left-2 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % NGOBAR_PHOTOS.length); }}
            className="absolute right-2 md:left-auto md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="w-full max-w-7xl max-h-[90vh] mx-auto px-2 sm:px-12 md:px-16 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={NGOBAR_PHOTOS[lightboxIdx]}
              alt={`Detail ${lightboxIdx}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl animate-scaleIn bg-black/50"
              key={lightboxIdx}
            />
            <div className="text-center mt-4 max-w-xl">
              <p className="text-white font-medium text-sm md:text-base mb-1">{t.captions[lightboxIdx]}</p>
              <p className="text-white/60 text-xs">{lightboxIdx + 1} / {NGOBAR_PHOTOS.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
