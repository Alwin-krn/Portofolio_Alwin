import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Briefcase, GraduationCap, CheckCircle2, Mail, Phone, MapPin, ChevronRight, ArrowUpRight, Server, Globe } from 'lucide-react';

import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import PklDetail from './pages/PklDetail';
import NaratasDetail from './pages/NaratasDetail';
import NetworkDocs from './pages/NetworkDocs';
import TugasDetail from './pages/TugasDetail';
import WhatsAppPopup from './components/WhatsAppPopup';

import { CONTENT } from './data/content';
import { useScrollReveal } from './hooks/useScrollReveal';
import heroBg from './images/hero-bg.jpg';
import topoThumbnail from './images/topologi-utama.png';
import tugasThumbnail from './images/tugas/Screenshot 2026-10-01 161941.png';

function HomePage({ lang, setLang, isDark, setIsDark }) {
  const navigate = useNavigate();

  const containerRef = useScrollReveal([lang]);

  const t = CONTENT[lang];
  const currentYear = new Date().getFullYear();

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
                <a href="contact" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }} className="group px-8 py-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-black transition-all duration-300 hover:shadow-glow active:scale-95 backdrop-blur-sm bg-black/20">
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
                  const isDs3 = exp.company.includes('DS3');
                  const isNaratas = exp.company.includes('Naratas');
                  const hasLink = isDs3 || isNaratas;
                  const linkPath = isDs3 ? '/pkl-ftth' : (isNaratas ? '/naratas-support' : '');

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                className="reveal cursor-pointer group rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 glow-border hover:shadow-ambient dark:hover:shadow-ambient-dark bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant flex flex-col"
                onClick={() => navigate('/network-docs')}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-outline-variant dark:border-dark-outline-variant bg-black/20">
                  <img 
                    src={topoThumbnail} 
                    alt="Topologi Jaringan Thumbnail" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  
                  {/* Arrow Icon over image */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 md:p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                      <Server className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg xl:text-xl text-on-surface dark:text-dark-on-surface line-clamp-2">
                      {lang === 'id' ? 'Topologi & Konfigurasi' : 'Network Topology'}
                    </h3>
                  </div>
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-6 leading-relaxed flex-grow line-clamp-3">
                    {lang === 'id' ? 'Dokumentasi proyek konfigurasi MikroTik, desain topologi Cisco, dan troubleshooting.' : 'Documentation of MikroTik configuration projects, Cisco topology designs, and troubleshooting.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">MikroTik</span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">Cisco</span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">Topologi</span>
                  </div>
                </div>
              </div>

              {/* Project 2: Web Portal & Data Wilayah */}
              <div 
                className="reveal cursor-pointer group rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 glow-border hover:shadow-ambient dark:hover:shadow-ambient-dark bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant flex flex-col"
                onClick={() => navigate('/tugas-web')}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-outline-variant dark:border-dark-outline-variant bg-black/20">
                  <img 
                    src={tugasThumbnail} 
                    alt="Portal Web & Data Wilayah Thumbnail" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  
                  {/* Arrow Icon over image */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 md:p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg xl:text-xl text-on-surface dark:text-dark-on-surface line-clamp-2">
                      {lang === 'id' ? 'Portal Web & Data Wilayah' : 'Web Portal & Regional Data'}
                    </h3>
                  </div>
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-6 leading-relaxed flex-grow line-clamp-3">
                    {lang === 'id' ? 'Pengembangan aplikasi portal web interaktif, validasi autentikasi pengguna, dan Sistem Informasi Wilayah Terpadu (UIA).' : 'Development of interactive web portal application, user authentication validation, and Integrated Regional Information System (UIA).'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">Web Dev</span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">Autentikasi</span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">Cascading Data</span>
                  </div>
                </div>
              </div>

              {/* Placeholder Project 3 */}
              <div 
                className="reveal cursor-pointer group rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 glow-border hover:shadow-ambient dark:hover:shadow-ambient-dark bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant flex flex-col opacity-60 hover:opacity-100 hidden md:flex"
              >
                {/* Empty Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-outline-variant dark:border-dark-outline-variant bg-black/10 flex items-center justify-center">
                  <span className="text-on-surface-variant dark:text-dark-on-surface-variant text-sm font-mono tracking-widest">COMING SOON</span>
                </div>

                {/* Card Content */}
                <div className="p-5 md:p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-low dark:bg-dark-surface-low border border-outline-variant dark:border-dark-outline-variant flex items-center justify-center text-on-surface-variant group-hover:scale-110 transition-transform shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg xl:text-xl text-on-surface dark:text-dark-on-surface line-clamp-2">
                      {lang === 'id' ? 'Proyek Mendatang' : 'Upcoming Project'}
                    </h3>
                  </div>
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-6 leading-relaxed flex-grow">
                    {lang === 'id' ? 'Detail proyek akan segera ditambahkan di sini.' : 'Project details will be added here soon.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant border-dashed opacity-50">Label</span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant border-dashed opacity-50">Label</span>
                  </div>
                </div>
              </div>
            </div>
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
                <a href={`https://wa.me/${t.personal.phone}`} target="_blank" rel="noreferrer" className="reveal reveal-delay-1 flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] glow-border bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant">
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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Routes>
      <Route path="/" element={<HomePage lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} />} />
      <Route path="/pkl-ftth" element={<PklDetail lang={lang} isDark={isDark} />} />
      <Route path="/naratas-support" element={<NaratasDetail lang={lang} isDark={isDark} />} />
      <Route path="/network-docs" element={<NetworkDocs lang={lang} isDark={isDark} />} />
      <Route path="/tugas-web" element={<TugasDetail lang={lang} isDark={isDark} />} />
    </Routes>
  );
}
