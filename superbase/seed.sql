-- =====================================================================
-- seed.sql — jalankan SETELAH schema.sql
-- Memindahkan TEKS dari 5 halaman lama (Naratas, PKL, Ngobar, Tugas,
-- NetworkDocs) ke database. FOTO tidak ikut: upload lewat /admin.
-- Aman dijalankan ulang (tidak membuat data ganda).
-- =====================================================================

insert into public.projects (
  slug, back_section, badge_icon, photo_style, sort_order,
  badge_id, badge_en, title_id, title_en,
  subtitle_id, subtitle_en, period_id, period_en, location_id, location_en,
  description_id, description_en,
  activities_title_id, activities_title_en, gallery_title_id, gallery_title_en
) values
(
  'naratas', 'pengalaman', 'wrench', 'photo', 0,
  'Technical Support', 'Technical Support',
  'Dokumentasi Kerja - Technical Support', 'Work Documentation - Technical Support',
  'PT. Naratas Sinergi Solusindo', 'PT. Naratas Sinergi Solusindo',
  'Juni - Agustus 2024', 'June - August 2024',
  'Bogor, Jawa Barat', 'Bogor, West Java',
  'Selama bekerja sebagai Technical Support di PT. Naratas Sinergi Solusindo, saya bertanggung jawab atas penanganan gangguan server dan penyambungan fiber optik di lapangan. Berikut adalah dokumentasi kegiatan selama periode tersebut.',
  'During my time as Technical Support at PT. Naratas Sinergi Solusindo, I was responsible for handling server issues and fiber optic splicing in the field. Below is the documentation of activities during that period.',
  'Kegiatan Utama', 'Key Activities', 'Galeri Dokumentasi', 'Documentation Gallery'
),
(
  'pkl-ds3', 'pengalaman', 'wrench', 'photo', 1,
  'Engineering FTTH', 'Engineering FTTH',
  'Dokumentasi PKL - Engineering FTTH', 'Internship Documentation - FTTH Engineering',
  'PT. Datakom Strata Tiga (DS3)', 'PT. Datakom Strata Tiga (DS3)',
  'Januari - April 2023', 'January - April 2023',
  'Depok, Jawa Barat', 'Bekasi, West Java',
  'Selama periode PKL (Praktik Kerja Lapangan) di PT. Datakom Strata Tiga (DS3), saya mendapatkan pengalaman langsung di bidang Engineering FTTH (Fiber To The Home). Berikut adalah dokumentasi kegiatan selama PKL berlangsung.',
  'During my internship at PT. Datakom Strata Tiga (DS3), I gained hands-on experience in FTTH (Fiber To The Home) Engineering. Below is the documentation of activities during the internship period.',
  'Kegiatan Utama', 'Key Activities', 'Galeri Dokumentasi', 'Documentation Gallery'
),
(
  'ngobar', 'proyek', 'presentation', 'photo', 2,
  'Pemateri & Instruktur Utama', 'Main Speaker & Instructor',
  'Workshop NGOBAR (Ngoding Bareng)', 'NGOBAR (Ngoding Bareng) Workshop',
  'HMTF - Universitas Islam As-Syafi''iyah', 'HMTF - Universitas Islam As-Syafi''iyah',
  '20 - 23 Mei 2026', 'May 20 - 23, 2026',
  'Gedung Alawiyah Lantai 4, UIA', 'Alawiyah Building 4th Floor, UIA',
  'Berperan sebagai Pemateri Utama dalam kegiatan Workshop NGOBAR (Ngoding Bareng) yang diselenggarakan oleh Himpunan Mahasiswa Teknik Informatika (HMTF) Universitas Islam As-Syafi''iyah. Workshop ini berfokus pada pengajaran dasar pembuatan struktur halaman web (HTML) dan perancangan gaya tampilan antarmuka (CSS) secara hands-on bagi mahasiswa.',
  'Served as the Keynote Speaker and Main Instructor for the NGOBAR (Ngoding Bareng) Workshop organized by the Informatics Engineering Student Association (HMTF) at Universitas Islam As-Syafi''iyah. The workshop provided hands-on training on HTML structure and CSS styling fundamentals for university students.',
  'Sorotan Kegiatan & Peran Utama', 'Key Highlights & Responsibilities',
  'Galeri Dokumentasi Kegiatan', 'Event Documentation Gallery'
),
(
  'tugas-uas-web', 'proyek', 'globe', 'screenshot', 3,
  'Web Application Project', 'Web Application Project',
  'Portal Web & Sistem Informasi Wilayah Terpadu', 'Web Portal & Integrated Regional Information System',
  'UAS Desain & Pemrograman Web — Universitas Islam As-Syafi''iyah', 'Web Design & Programming Project — Universitas Islam As-Syafi''iyah',
  '', '', '', '',
  'Pengembangan aplikasi portal web modern yang mengintegrasikan sistem autentikasi pengguna lengkap dengan validasi keamanan real-time, manajemen sisa percobaan login, serta Sistem Informasi Wilayah Terpadu yang mencakup lebih dari 91.000 data wilayah Indonesia dengan fitur cascading dropdown yang interaktif.',
  'Development of a modern web portal application integrating full user authentication with real-time security validation, login retry rate limiting, and an Integrated Regional Information System covering over 91,000 regional records across Indonesia with interactive cascading dropdowns.',
  'Fitur & Komponen Utama', 'Key Features & Components',
  'Galeri Dokumentasi & Tangkapan Layar', 'Documentation & Screenshot Gallery'
),
(
  'network-docs', 'proyek', 'server', 'screenshot', 4,
  'Dokumentasi Konfigurasi', 'Configuration Documentation',
  'Dokumentasi Topologi & Jaringan', 'Network Topology & Documentation',
  'Infrastruktur & Konfigurasi', 'Infrastructure & Configuration',
  '', '', '', '',
  'Kumpulan dokumentasi, topologi, serta screenshot dari berbagai proyek dan konfigurasi jaringan yang telah saya kerjakan atau pelajari (MikroTik, Cisco, dll).',
  'A collection of documentation, topologies, and screenshots from various network projects and configurations I have worked on or studied (MikroTik, Cisco, etc.).',
  'Fokus Konfigurasi', 'Configuration Focus',
  'Galeri Topologi & Konfigurasi', 'Topology & Configuration Gallery'
)
on conflict (slug) do nothing;

-- ---------- Kegiatan ---------------------------------------------------
insert into public.project_activities (project_id, icon, title_id, title_en, desc_id, desc_en, sort_order)
select p.id, v.icon, v.title_id, v.title_en, v.desc_id, v.desc_en, v.ord
from (values
  -- naratas (tanpa ikon -> nomor)
  ('naratas', null::text, 'Penanganan Gangguan Server', 'Server Troubleshooting',
   'Merespons dan menangani instruksi dari NOC terkait kendala atau gangguan pada server dan jaringan pelanggan.',
   'Responding to and handling instructions from the NOC regarding server or client network issues.', 0),
  ('naratas', null, 'Pengukuran Redaman Cahaya', 'Light Attenuation Measurement',
   'Menggunakan alat OPM untuk memastikan redaman cahaya jaringan berada di bawah standar -10,00 dBm.',
   'Using an OPM tool to ensure network light attenuation remains below the -10.00 dBm standard.', 1),
  ('naratas', null, 'Penyambungan Kabel Fiber Optik', 'Fiber Optic Splicing',
   'Melakukan proses splicing kabel fiber optik untuk mengatasi rata-rata 2-3 titik gangguan per harinya.',
   'Performing fiber optic cable splicing to resolve an average of 2-3 breakage points daily.', 2),
  ('naratas', null, 'Pelaporan Perbaikan', 'Repair Reporting',
   'Memperbarui status penanganan dan hasil perbaikan jaringan ke grup koordinasi tim.',
   'Updating the handling status and network repair results to the team coordination group.', 3),

  -- pkl-ds3
  ('pkl-ds3', null, 'Penyambungan Fiber Optik (Splicing)', 'Fiber Optic Splicing',
   'Melakukan penyambungan kabel fiber optik menggunakan fusion splicer untuk memastikan konektivitas jaringan yang optimal.',
   'Performing fiber optic cable splicing using a fusion splicer to ensure optimal network connectivity.', 0),
  ('pkl-ds3', null, 'Instalasi FTTH ke Rumah Pelanggan', 'FTTH Installation to Customer Homes',
   'Memasang perangkat ONT/ONU dan melakukan routing kabel fiber optik dari ODP ke rumah pelanggan.',
   'Installing ONT/ONU devices and routing fiber optic cables from ODP to customer homes.', 1),
  ('pkl-ds3', null, 'Pengukuran Redaman Cahaya (OPM)', 'Light Attenuation Measurement (OPM)',
   'Menggunakan Optical Power Meter untuk memastikan redaman cahaya di bawah -25,00 dBm sesuai standar.',
   'Using an Optical Power Meter to ensure light attenuation is below -25.00 dBm according to standards.', 2),
  ('pkl-ds3', null, 'Pemeliharaan ODP (Optical Distribution Point)', 'ODP (Optical Distribution Point) Maintenance',
   'Melakukan pengecekan dan pemeliharaan cabinet distribusi optik untuk menjaga kerapihan dan kualitas jaringan.',
   'Checking and maintaining optical distribution cabinets to ensure neatness and network quality.', 3),

  -- ngobar (dengan ikon)
  ('ngobar', 'presentation', 'Pemateri Utama Workshop', 'Main Workshop Instructor',
   'Menyampaikan materi komprehensif mengenai konsep dasar struktur HTML, sintaks CSS, dan sintaksis tata letak web modern.',
   'Delivered comprehensive sessions covering HTML structural markup, CSS rules, and modern web layout principles.', 0),
  ('ngobar', 'code', 'Live Coding & Demonstrasi', 'Live Coding Demonstrations',
   'Melakukan demonstrasi penyusunan komponen website secara langsung agar peserta memahami sintaks dan implementasi visual.',
   'Conducted real-time live coding demonstrations to show practical component building and styling techniques.', 1),
  ('ngobar', 'users', 'Mentoring & Sesi Hands-on', 'Hands-on Mentoring',
   'Mendampingi peserta secara individu dan kelompok dalam menyelesaikan latihan penulisan kode HTML/CSS di tempat.',
   'Guided participants individually and in groups to solve coding exercises and build responsive web pages.', 2),
  ('ngobar', 'building', 'Kolaborasi Akademik (HMTF UIA)', 'Academic Collaboration (HMTF UIA)',
   'Bekerjasama dengan pengurus Himpunan Mahasiswa Teknik Informatika UIA dalam memfasilitasi peningkatan keahlian teknis web development.',
   'Collaborated with the Informatics Student Association to foster technical web development skills across campus.', 3),

  -- tugas-uas-web (dengan ikon)
  ('tugas-uas-web', 'shield', 'Autentikasi & Keamanan Akun', 'User Authentication & Security',
   'Sistem login dan registrasi interaktif dilengkapi validasi password kuat (minimal 8 karakter, huruf besar/kecil, angka, simbol) serta penanganan sisa percobaan login (rate limiting).',
   'Interactive login and registration system featuring strong password validation (min 8 chars, uppercase/lowercase, numbers, symbols) and login rate limiting.', 0),
  ('tugas-uas-web', 'database', 'Sistem Informasi Wilayah Terpadu', 'Integrated Regional Data System',
   'Pengelolaan dan visualisasi lebih dari 91.611 data wilayah dari 38 Provinsi di Indonesia yang dapat diakses secara instan dan efisien.',
   'Management and visualization of 91,611+ regional data points across 38 Indonesian Provinces with instant retrieval.', 1),
  ('tugas-uas-web', 'layers', 'Cascading Dynamic Dropdown', 'Cascading Dynamic Dropdowns',
   'Filter wilayah bertingkat dinamis dari tingkat Provinsi, Kabupaten/Kota, Kecamatan, hingga Kelurahan/Desa yang saling terintegrasi.',
   'Multi-tiered dynamic location filtering spanning Province, Regency/City, District, down to Village level.', 2),
  ('tugas-uas-web', 'layout', 'Desain Antarmuka Responsif & Modern', 'Responsive & Modern UI Design',
   'Implementasi antarmuka intuitif bertema Dark Mode dengan indikator statistik ringkas, tata letak rapi, serta pengalaman pengguna yang optimal.',
   'Sleek Dark Mode interface featuring metric overview cards, clean visual hierarchy, and an optimized user experience.', 3),

  -- network-docs (tanpa ikon -> nomor)
  ('network-docs', null, 'Konfigurasi MikroTik', 'MikroTik Configuration',
   'Implementasi Routing, Firewall, Bandwidth Management, dan Hotspot pada perangkat MikroTik.',
   'Implementation of Routing, Firewall, Bandwidth Management, and Hotspot on MikroTik devices.', 0),
  ('network-docs', null, 'Desain Topologi', 'Topology Design',
   'Merancang topologi jaringan yang efisien menggunakan Cisco Packet Tracer dan GNS3.',
   'Designing efficient network topologies using Cisco Packet Tracer and GNS3.', 1),
  ('network-docs', null, 'VLAN & Switch Management', 'VLAN & Switch Management',
   'Segmentasi jaringan menggunakan VLAN untuk keamanan dan manajemen trafik yang lebih baik.',
   'Network segmentation using VLANs for better security and traffic management.', 2),
  ('network-docs', null, 'Troubleshooting', 'Troubleshooting',
   'Analisis log dan pemecahan masalah konektivitas pada berbagai layer OSI.',
   'Log analysis and connectivity troubleshooting across various OSI layers.', 3)
) as v(slug, icon, title_id, title_en, desc_id, desc_en, ord)
join public.projects p on p.slug = v.slug
where not exists (
  select 1 from public.project_activities a where a.project_id = p.id
);
