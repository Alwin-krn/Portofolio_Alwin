const COOKIE_NAME = 'cookie_consent';
const MAX_AGE_DAYS = 180;

export const OPEN_SETTINGS_EVENT = 'open-cookie-settings';

/** Baca pilihan cookie yang tersimpan. Mengembalikan null jika belum memilih. */
export function getConsent() {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)')
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

/** Kirim status persetujuan ke Google Tag Manager (Consent Mode). */
export function applyConsent(consent) {
  window.dataLayer = window.dataLayer || [];
  // Harus memakai `arguments`, bukan array biasa, agar dikenali GTM.
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
  });
}

/** Simpan pilihan ke cookie lalu terapkan. */
export function saveConsent({ analytics }) {
  const value = { analytics: Boolean(analytics), savedAt: Date.now() };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}` +
    `; max-age=${MAX_AGE_DAYS * 24 * 60 * 60}; path=/; SameSite=Lax${secure}`;
  applyConsent(value);
  return value;
}

/** Panggil dari mana saja (misalnya footer) untuk membuka kembali pengaturan cookie. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
