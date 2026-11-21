// Tidak mengimpor Supabase, supaya beranda tetap aman walaupun .env bermasalah.

const CACHE_KEY = 'profile-content-v1';

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Objek digabung per kunci. Array dan teks dari `over` menggantikan bawaan.
// Teks kosong ('') tetap menimpa, jadi kolom bisa dikosongkan untuk menyembunyikan bagian.
export function deepMerge(base, over) {
  if (over === undefined || over === null) return base;
  if (isPlainObject(base) && isPlainObject(over)) {
    const out = { ...base };
    for (const key of Object.keys(over)) out[key] = deepMerge(base[key], over[key]);
    return out;
  }
  return over;
}

export function mergeContent(base, override) {
  return isPlainObject(override) ? deepMerge(base, override) : base;
}

export function readProfileCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeProfileCache(content) {
  try {
    if (content) localStorage.setItem(CACHE_KEY, JSON.stringify(content));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    /* penyimpanan tidak tersedia, abaikan */
  }
}
