# Portofolio Alwin Dwi Kurniawan

Website portofolio pribadi yang menampilkan profil, proyek, dan kemampuan saya di bidang **Web Development, Jaringan, dan Data**.

🔗 **Live site:** [https://alwin.my.id](https://www.alwin.my.id)

## Fitur

- Tampilan responsif untuk desktop dan mobile
- Profil singkat dan daftar proyek
- Unduh CV langsung dari situs
- SEO dasar: `robots.txt`, `sitemap.xml`, meta description, dan canonical URL

## Teknologi

- [Vite](https://vitejs.dev/) sebagai build tool
- [Tailwind CSS](https://tailwindcss.com/) untuk styling
- PostCSS

## Struktur Proyek

```
Portofolio_Alwin/
├── public/              # Aset statis (favicon, CV, robots.txt, sitemap.xml)
├── src/                 # Kode sumber aplikasi
├── index.html           # Titik masuk aplikasi
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Menjalankan di Lokal

Pastikan [Node.js](https://nodejs.org/) sudah terpasang.

```bash
# 1. Clone repo
git clone https://github.com/Alwin-krn/Portofolio_Alwin.git
cd Portofolio_Alwin

# 2. Pasang dependensi
npm install

# 3. Jalankan mode pengembangan
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk membuat versi produksi:

```bash
npm run build
npm run preview
```

## Kontak

- Website: [alwin.my.id](https://alwin.my.id)
- GitHub: [@Alwin-krn](https://github.com/Alwin-krn)

---

© 2026 Alwin Dwi Kurniawan
