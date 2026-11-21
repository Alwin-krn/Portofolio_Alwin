import { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, GraduationCap, CheckCircle2, Mail, Phone, MapPin, ChevronRight, ArrowUpRight } from 'lucide-react';

import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import CookieConsent from './components/CookieConsent';
import ScrollProgress from './components/ScrollProgress';
import WhatsAppPopup from './components/WhatsAppPopup';

// Halaman yang memakai Supabase dimuat secara lazy, jadi beranda tetap tampil
// walaupun konfigurasi Supabase (.env) bermasalah.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const RequireAdmin = lazy(() => import('./components/RequireAdmin'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'));
const ProjectCards = lazy(() => import('./components/ProjectCards'));
const ProfileForm = lazy(() => import('./pages/admin/ProfileForm'));

import { CONTENT } from './data/content';
import { mergeContent, readProfileCache, writeProfileCache } from './data/mergeContent';
import { useScrollReveal } from './hooks/useScrollReveal';
import heroBg from './images/hero-bg.jpg';

function HomePage({ lang, setLang, isDark, setIsDark, content }) {
  const navigate = useNavigate();
  const location = useLocation();

  const containerRef = useScrollReveal([lang]);

  const t = content[lang];
  const currentYear = new Date().getFullYear();

  // Saat kembali dari halaman detail, langsung scroll ke bagian yang dituju
  // (misalnya 'pengalaman' atau 'proyek'), lalu hapus state agar refresh tidak mengulanginya.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;

    const timer = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      navigate(location.pathname, { replace: true, state: null });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.state, location.pathname, navigate]);

  // Link WhatsApp dengan pesan yang sudah terisi (mengikuti bahasa aktif)
  const waMessage =
    t.personal.waMessage ||
    (lang === 'id'
      ? 'Halo Alwin, saya melihat portofolio Anda dan ingin berdiskusi.'
      : 'Hi Alwin, I saw your portfolio and would like to talk.');
  const waLink = `https://wa.me/${t.personal.phone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div ref={containerRef} className="noise-overlay bg-surface text-on-surface dark:bg-dark-surface dark:text-dark-on-surface transition-colors duration-500 selection:bg-primary/20 selection:text-primary min-h-screen">
      <Preloader />
      <ScrollProgress />
      <CustomCursor />
      <WhatsAppPopup lang={lang} />

      <Navbar
        content={t}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'id' ? 'en' : 'id')}
        isDark={isDark}
        onToggleTheme={() => setIsDark(d => !d)}
      />

      <main>
        {/* HERO SECTION */}
        <section id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover object-center" />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          </div>

          <div className="relative z-10 px-6 max-w-7xl mx-auto w-full pt-32 pb-20 md:pt-48 md:pb-32">
            <div className="flex flex-col items-start text-left max-w-4xl">
              {t.hero.badge && (
              <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-black/30 backdrop-blur-sm text-primary text-sm font-mono mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>{t.hero.badge}</span>
              </div>
              )}

              <h1 className="reveal reveal-blur text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-none mb-4 reveal-delay-1 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="text-glow">{t.hero.title1}</span>
              </h1>

              <p className="reveal reveal-delay-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-10 tracking-wide uppercase text-glow" style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '0.15em' }}>
                {t.hero.title2}
              </p>

              {t.hero.desc && (
              <p className="reveal reveal-delay-2 text-lg md:text-xl max-w-2xl mb-10 text-gray-300">
                {t.hero.desc}
              </p>
              )}

              <div className="reveal reveal-delay-3 flex flex-wrap gap-4">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group px-8 py-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-black transition-all duration-300 hover:shadow-glow active:scale-95 backdrop-blur-sm bg-black/20"
                >
                  {t.hero.btnContact} <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Dot grid overlay */}
          <div className="absolute inset-0 dot-grid-bg opacity-30 pointer-events-none z-[1]"></div>
        </section>

        {/* ABOUT SECTION */}
        <section id="tentang" className="py-24 px-6 border-t border-outline-variant dark:border-dark-outline-variant">
          <div className="max-w-4xl mx-auto">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-xs text-primary opacity-70">001</span>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.personal.aboutTitle}</h2>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant">
                {t.personal.about}
              </p>
            </div>
          </div>
        </section>

        {/* EXPERIENCE & EDUCATION SECTION */}
        <section id="pengalaman" className="py-24 px-6 max-w-7xl mx-auto border-t border-outline-variant dark:border-dark-outline-variant">
          <div className="reveal mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-primary opacity-70">002</span>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.sectionTitles.experience}</h2>
            </div>
            <div className="w-20 h-0.5 bg-primary rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="reveal flex items-center gap-3 mb-8 text-primary">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-lg font-bold font-mono text-on-surface dark:text-dark-on-surface">{t.sectionTitles.work}</h3>
              </div>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-primary before:via-primary/20 before:to-transparent">
                {t.experience.map((exp, idx) => {
                  // Slug diatur di admin (Edit profil). Tebakan dari nama perusahaan
                  // hanya dipakai untuk data bawaan content.js yang belum punya projectSlug.
                  const slug =
                    exp.projectSlug ??
                    (exp.company.includes('DS3') ? 'intern-ds3' : exp.company.includes('Naratas') ? 'naratas' : '');
                  const hasLink = Boolean(slug);
                  const linkPath = hasLink ? `/proyek/${slug}` : '';

                  return (
                    <div key={idx} className="reveal relative flex items-center justify-between group" style={{ transitionDelay: `${idx * 200}ms` }}>
                      {/* Timeline Dot */}
                      <div className="absolute left-5 -translate-x-1/2 flex items-center justify-center w-10 h-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 group-hover:ring-primary/30 group-hover:shadow-glow transition-all duration-300"></div>
                      </div>
                      
                      <div
                        className={`ml-12 md:ml-14 w-full p-5 md:p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 glow-border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant ${hasLink ? 'cursor-pointer' : ''}`}
                        onClick={hasLink ? () => navigate(linkPath) : undefined}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-lg text-on-surface dark:text-dark-on-surface">{exp.role}</h4>
                              {hasLink && (
                                <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-3 py-1 rounded-full border border-primary/30 text-primary w-fit">{exp.period}</span>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                          {exp.tasks.map((task, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <ChevronRight className="text-primary shrink-0 mt-0.5 w-4 h-4" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                        {hasLink && (
                          <div className="mt-4 pt-3 border-t border-outline-variant dark:border-dark-outline-variant">
                            <span className="text-xs font-mono font-medium text-primary flex items-center gap-1">
                              {lang === 'id' ? 'Lihat Dokumentasi →' : 'View Documentation →'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="reveal flex items-center gap-3 mb-8 text-primary mt-16 md:mt-0">
                <GraduationCap className="w-5 h-5" />
                <h3 className="text-lg font-bold font-mono text-on-surface dark:text-dark-on-surface">{t.sectionTitles.education}</h3>
              </div>
              <div className="space-y-6">
                {t.education.map((edu, idx) => (
                  <div key={idx} className="reveal p-5 md:p-6 rounded-xl border transition-all duration-300 glow-border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant" style={{ transitionDelay: `${idx * 200}ms` }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-lg text-on-surface dark:text-dark-on-surface">{edu.degree}</h4>
                        <p className="font-medium text-sm md:text-base text-on-surface-variant dark:text-dark-on-surface-variant">{edu.school}</p>
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full border border-primary/30 text-primary w-fit">{edu.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="proyek" className="py-24 px-6 border-t border-outline-variant dark:border-dark-outline-variant bg-surface-low dark:bg-dark-surface-low">
          <div className="max-w-6xl mx-auto">
            <div className="reveal flex items-center gap-3 mb-12">
              <span className="font-mono text-xs text-primary opacity-70">003</span>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.sectionTitles.projects}</h2>
            </div>
            
            <Suspense fallback={<div className="min-h-[200px]" />}>
              <ProjectCards lang={lang} />
            </Suspense>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="keahlian" className="py-24 px-6 border-t border-outline-variant dark:border-dark-outline-variant">
          <div className="max-w-7xl mx-auto">
            <div className="reveal mb-16 text-left">
              <div className="flex items-center justify-start gap-3 mb-4">
                <span className="font-mono text-xs text-primary opacity-70">004</span>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.sectionTitles.skills}</h2>
              </div>
              <p className="max-w-2xl text-on-surface-variant dark:text-dark-on-surface-variant">{t.sectionTitles.skillsDesc}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {t.skills.map((skill, idx) => (
                <div key={idx} className="reveal px-5 py-3 rounded-lg border flex items-center gap-2 cursor-default transition-all duration-300 hover:scale-105 glow-border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant text-on-surface dark:text-dark-on-surface" style={{ transitionDelay: `${(idx % 5) * 100}ms` }}>
                  <CheckCircle2 className="text-primary w-4 h-4" />
                  <span className="font-medium text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-outline-variant dark:border-dark-outline-variant">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-start gap-2 md:gap-3 mb-2 md:mb-4">
              <span className="font-mono text-[10px] md:text-xs text-primary opacity-70">005</span>
              <h2 className="reveal text-2xl md:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.sectionTitles.contact}</h2>
            </div>
            <p className="reveal text-sm md:text-lg mb-8 md:mb-12 text-on-surface-variant dark:text-dark-on-surface-variant text-left">{t.sectionTitles.contactDesc}</p>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column: Contact Links */}
              <div className="space-y-3 md:space-y-4">
                <a href={`mailto:${t.personal.email}`} className="reveal flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] glow-border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg border border-primary/30 flex items-center justify-center text-primary shrink-0"><Mail className="w-4 h-4 md:w-5 md:h-5" /></div>
                  <div className="min-w-0 flex-1"><p className="text-xs md:text-sm font-mono font-medium text-on-surface-variant dark:text-dark-on-surface-variant">Email</p><p className="font-medium text-sm md:text-base break-all">{t.personal.email}</p></div>
                </a>
                <a href={waLink} target="_blank" rel="noreferrer" className="reveal reveal-delay-1 flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] glow-border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg border border-primary/30 flex items-center justify-center text-primary shrink-0"><Phone className="w-4 h-4 md:w-5 md:h-5" /></div>
                  <div className="min-w-0 flex-1"><p className="text-xs md:text-sm font-mono font-medium text-on-surface-variant dark:text-dark-on-surface-variant">WhatsApp</p><p className="font-medium text-sm md:text-base break-words">{t.personal.formattedPhone}</p></div>
                </a>
              </div>

              {/* Right Column: Location & Map */}
              <div>
                <div className="reveal reveal-delay-2 h-full rounded-xl border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant overflow-hidden flex flex-col">
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-outline-variant dark:border-dark-outline-variant">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg border border-primary/30 flex items-center justify-center text-primary shrink-0"><MapPin className="w-4 h-4 md:w-5 md:h-5" /></div>
                    <div className="min-w-0 flex-1"><p className="text-xs md:text-sm font-mono font-medium text-on-surface-variant dark:text-dark-on-surface-variant">Lokasi</p><p className="font-medium text-sm md:text-base break-words">{t.personal.location}</p></div>
                  </div>
                  <div className="w-full h-48 md:flex-grow min-h-[200px]">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.08316279932!2d106.90151044717147!3d-6.284245648580629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d8546ad633d%3A0x79e8de8965402078!2sKota%20Bks%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1709400000000!5m2!1sid!2sid" width="100%" height="100%" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Bekasi" className="border-0 grayscale dark:invert dark:contrast-75 transition-all duration-500 block"></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-6 text-center border-t border-outline-variant dark:border-dark-outline-variant">
        <p className="text-sm font-mono text-on-surface-variant dark:text-dark-on-surface-variant">
          &copy; {currentYear} {t.personal.name}. {t.footer}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('id');

  // Isi profil dari Supabase (tabel site_profile) ditimpa di atas content.js.
  // Cache lokal dipakai agar tidak ada kedipan teks lama saat halaman dibuka.
  const [override, setOverride] = useState(readProfileCache);
  useEffect(() => {
    let cancelled = false;
    import('./lib/profile')
      .then((m) => m.getProfile())
      .then((data) => {
        if (cancelled) return;
        writeProfileCache(data);
        setOverride(data);
      })
      .catch(() => { /* Supabase bermasalah: tetap pakai content.js / cache */ });
    return () => { cancelled = true; };
  }, []);
  const content = useMemo(() => mergeContent(CONTENT, override), [override]);

  // Default TERANG. Gelap hanya jika pengunjung pernah memilihnya.
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      /* penyimpanan tidak tersedia, abaikan */
    }
  }, [isDark]);

  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          {/* Beranda */}
          <Route
            path="/"
            element={<HomePage lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} content={content} />}
          />

          {/* Halaman detail proyek (dibaca dari Supabase) */}
          <Route path="/proyek/:slug" element={<ProjectDetail lang={lang} isDark={isDark} content={content} />} />
          {/* Slug lama pkl-ds3 diganti intern-ds3; link lama tetap jalan */}
          <Route path="/proyek/pkl-ds3" element={<Navigate to="/proyek/intern-ds3" replace />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/profil" element={<RequireAdmin><ProfileForm /></RequireAdmin>} />
          <Route path="/admin/proyek/:id" element={<RequireAdmin><ProjectForm /></RequireAdmin>} />

          {/* Redirect dari link lama supaya link yang sudah tersebar tetap jalan */}
          <Route path="/naratas-support" element={<Navigate to="/proyek/naratas" replace />} />
          <Route path="/pkl-ftth" element={<Navigate to="/proyek/intern-ds3" replace />} />
          <Route path="/ngobar-workshop" element={<Navigate to="/proyek/ngobar" replace />} />
          <Route path="/tugas-web" element={<Navigate to="/proyek/tugas-uas-web" replace />} />
          <Route path="/network-docs" element={<Navigate to="/proyek/network-docs" replace />} />

          {/* Jalur tidak dikenal kembali ke beranda */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </>
  );
}
