import { useState, useEffect, useRef } from 'react';
import { Terminal, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { ANCHOR_LINKS } from '../data/content';
import logoImg from '../images/Logo.png';

export default function Navbar({ content, lang, onToggleLang, isDark, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitchText, setGlitchText] = useState({ before: 'Alwin', symbol: '', after: '' });
  const t = content;

  // Logo glitch animation
  useEffect(() => {
    const logoOriginalText = 'Alwin';
    const glitchSymbols = '!<>-_\\/[]{}—=+*^?#';

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * logoOriginalText.length);
      const randomSymbol = glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];

      setGlitchText({
        before: logoOriginalText.substring(0, randomIndex),
        symbol: randomSymbol,
        after: logoOriginalText.substring(randomIndex + 1)
      });

      setTimeout(() => {
        setGlitchText({ before: 'Alwin', symbol: '', after: '' });
      }, 150);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navIndexes = ['000', '001', '002', '003', '004'];

  return (
    <nav className="fixed w-full z-40 transition-all duration-300 bg-surface-lowest/90 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-outline-variant dark:border-dark-outline-variant">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="font-bold text-xl tracking-tighter flex items-center gap-3 group font-mono">
          <span className="flex items-baseline">
            <span className="transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {glitchText.before}
              {glitchText.symbol && <span className="text-primary opacity-70">{glitchText.symbol}</span>}
              {glitchText.after}
            </span>
            <span className="text-primary font-mono text-sm opacity-50 ml-1">.dev</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {t.nav.map((item, idx) => {
              const isDownloadCv = item === 'Unduh CV' || item === 'Download CV' || item === 'Resume';
              const isContact = item === 'Kontak' || item === 'Contact';
              const waMessage = lang === 'id' 
                ? "Halo Alwin, saya melihat portofolio Anda dan tertarik untuk berdiskusi lebih lanjut."
                : "Hello Alwin, I saw your portfolio and I'm interested in discussing further.";
              const waUrl = `https://wa.me/${t.personal.phone}?text=${encodeURIComponent(waMessage)}`;

              return (
                <a
                  key={idx}
                  href={isDownloadCv ? "/CV-Alwin-Dwi-Kurniawan.pdf" : (isContact ? waUrl : `#${ANCHOR_LINKS[idx]}`)}
                  onClick={(e) => {
                    if (!isDownloadCv && !isContact) handleSmoothScroll(e, ANCHOR_LINKS[idx]);
                  }}
                  {...(isDownloadCv ? { download: "CV-Alwin-Dwi-Kurniawan.pdf" } : {})}
                  {...(isDownloadCv || isContact ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="text-sm font-medium text-on-surface-variant hover:text-primary dark:text-dark-on-surface-variant transition-colors flex items-center gap-1.5"
                >
                  <span className="font-mono text-[10px] text-primary opacity-50">{navIndexes[idx] || '005'}</span>
                  {item}
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-2 border-l border-outline-variant dark:border-dark-outline-variant pl-6">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider border border-outline-variant hover:border-primary dark:border-dark-outline-variant dark:hover:border-primary transition-colors"
            >
              <Globe className="text-primary w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-outline-variant hover:border-primary dark:border-dark-outline-variant dark:hover:border-primary transition-colors text-on-surface-variant dark:text-dark-on-surface-variant"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={onToggleLang}
            className="flex items-center justify-center p-2 rounded-lg border border-outline-variant dark:border-dark-outline-variant"
          >
            <span className="text-xs font-bold font-mono">{lang.toUpperCase()}</span>
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 text-on-surface-variant dark:text-dark-on-surface-variant"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-on-surface-variant dark:text-dark-on-surface-variant"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-b bg-surface-lowest border-outline-variant dark:bg-dark-surface dark:border-dark-outline-variant overflow-hidden transition-all duration-300">
          <div className="flex flex-col px-6 py-4 gap-4">
            {t.nav.map((item, idx) => {
              const isDownloadCv = item === 'Unduh CV' || item === 'Download CV' || item === 'Resume';
              const isContact = item === 'Kontak' || item === 'Contact';
              const waMessage = lang === 'id' 
                ? "Halo Alwin, saya melihat portofolio Anda dan tertarik untuk berdiskusi lebih lanjut."
                : "Hello Alwin, I saw your portfolio and I'm interested in discussing further.";
              const waUrl = `https://wa.me/${t.personal.phone}?text=${encodeURIComponent(waMessage)}`;

              return (
                <a
                  key={idx}
                  href={isDownloadCv ? "/CV-Alwin-Dwi-Kurniawan.pdf" : (isContact ? waUrl : `#${ANCHOR_LINKS[idx]}`)}
                  onClick={(e) => {
                    if (!isDownloadCv && !isContact) handleSmoothScroll(e, ANCHOR_LINKS[idx]);
                  }}
                  {...(isDownloadCv ? { download: "CV-Alwin-Dwi-Kurniawan.pdf" } : {})}
                  {...(isDownloadCv || isContact ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="text-sm font-medium py-2 border-b border-outline-variant dark:border-dark-outline-variant text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-2 hover:text-primary"
                >
                  <span className="font-mono text-[10px] text-primary opacity-50">{navIndexes[idx] || '005'}</span>
                  {item}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
