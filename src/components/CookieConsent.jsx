import { useEffect, useState } from 'react';
import {
  OPEN_SETTINGS_EVENT,
  applyConsent,
  getConsent,
  saveConsent,
} from '../lib/consent';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-lowest dark:focus-visible:ring-offset-dark-surface-lowest';

const btnBase =
  'min-h-[44px] rounded-lg px-4 text-sm font-medium transition-colors md:whitespace-nowrap';
const btnPrimary = `${btnBase} bg-primary text-white hover:bg-primary-container ${focusRing}`;
const btnOutline = `${btnBase} border border-outline-variant hover:bg-surface-low dark:border-dark-outline-variant dark:hover:bg-dark-surface-highest ${focusRing}`;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false); // untuk transisi muncul
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // Saat dimuat: terapkan pilihan lama, atau tampilkan banner jika belum memilih.
  useEffect(() => {
    const saved = getConsent();
    if (saved) {
      applyConsent(saved);
      setAnalytics(Boolean(saved.analytics));
    } else {
      setVisible(true);
    }
  }, []);

  // Tautan "Pengaturan cookie" di footer membuka panel ini lagi.
  useEffect(() => {
    const open = () => {
      const saved = getConsent();
      setAnalytics(Boolean(saved?.analytics));
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // Transisi masuk halus (dimatikan otomatis jika pengguna memilih "reduce motion").
  useEffect(() => {
    if (!visible) {
      setShown(false);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  const choose = (value) => {
    saveConsent({ analytics: value });
    setAnalytics(value);
    setShowSettings(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    // Pembungkus tidak menangkap klik, hanya kartunya. Jarak bawah menghormati
    // area aman di HP (notch / bar gestur).
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5 md:pb-6">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-desc"
        className={`pointer-events-auto mx-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-outline-variant bg-surface-lowest p-4 text-on-surface shadow-ambient motion-safe:transition-all motion-safe:duration-300 dark:border-dark-outline-variant dark:bg-dark-surface-lowest dark:text-dark-on-surface dark:shadow-ambient-dark sm:p-5 md:flex md:max-w-4xl md:gap-8 md:p-6 ${
          showSettings ? 'md:items-end' : 'md:items-center'
        } ${shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      >
        {/* Kolom teks (di desktop: kiri) */}
        <div className="min-w-0 md:flex-1">
          <p id="cookie-title" className="font-display text-base font-semibold">
            Cookie di situs ini
          </p>
          <p
            id="cookie-desc"
            className="mt-1.5 text-sm leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant md:max-w-xl"
          >
            Cookie penting membuat situs berjalan. Cookie analitik bersifat
            opsional dan baru aktif jika kamu setuju.
          </p>

          {showSettings && (
            <div className="mt-4 space-y-4 border-t border-outline-variant pt-4 dark:border-dark-outline-variant md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Penting</p>
                  <p className="text-xs leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant">
                    Menyimpan pilihan cookie dan tema tampilan.
                  </p>
                </div>
                <span className="shrink-0 pt-0.5 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                  Selalu aktif
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p id="cookie-analytics-label" className="text-sm font-medium">
                    Analitik
                  </p>
                  <p className="text-xs leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant">
                    Statistik kunjungan lewat Google Tag Manager.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  aria-labelledby="cookie-analytics-label"
                  onClick={() => setAnalytics((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${focusRing} ${
                    analytics
                      ? 'bg-primary'
                      : 'bg-surface-variant dark:bg-dark-surface-highest'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      analytics ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tombol. HP: bertumpuk, lebar penuh. Desktop: sebaris di kanan, tombol utama paling kanan. */}
        <div className="mt-4 space-y-2 md:mt-0 md:flex md:shrink-0 md:items-center md:gap-2 md:space-y-0">
          {showSettings ? (
            <>
              <button
                type="button"
                onClick={() => choose(analytics)}
                className={`${btnPrimary} w-full md:order-2 md:w-auto md:px-5`}
              >
                Simpan pilihan
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className={`${btnOutline} w-full md:order-1 md:w-auto md:px-5`}
              >
                Kembali
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => choose(true)}
                className={`${btnPrimary} w-full md:order-3 md:w-auto md:px-5`}
              >
                Terima semua
              </button>
              <div className="grid grid-cols-2 gap-2 md:contents">
                <button
                  type="button"
                  onClick={() => choose(false)}
                  className={`${btnOutline} md:order-2 md:px-5`}
                >
                  Hanya yang penting
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className={`${btnOutline} text-primary md:order-1 md:px-5`}
                >
                  Atur
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}