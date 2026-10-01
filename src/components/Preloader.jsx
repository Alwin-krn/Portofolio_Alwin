import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import logoImg from '../images/Logo.png';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 1000);
    const timer2 = setTimeout(() => setVisible(false), 1500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-surface dark:bg-dark-surface transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-pulse-icon">
        <img src={logoImg} alt="Loading Logo" className="w-14 h-14 rounded-full object-contain invert dark:invert-0" />
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          loading...
        </p>
      </div>
    </div>
  );
}
