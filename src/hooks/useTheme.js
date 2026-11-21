import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

// Default selalu terang. Preferensi sistem (prefers-color-scheme) sengaja diabaikan;
// mode gelap hanya aktif jika pengunjung memilihnya sendiri lewat tombol tema.
function readTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* penyimpanan tidak tersedia, abaikan */
    }
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  return { theme, setTheme, toggle };
}
