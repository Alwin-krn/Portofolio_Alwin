import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Wrench, Server, Globe, Presentation, Code, Users, Building2,
  Shield, Database, Layers, LayoutDashboard,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { photoUrl } from '../lib/projects';

// Gambar sampul lokal: dipakai selama proyek belum punya foto di Supabase.
// (Jangan hapus folder fotonya sebelum foto sudah diupload lewat admin.)
import topoThumbnail from '../images/topologi-utama.png';
import tugasThumbnail from '../images/tugas/Screenshot 2026-10-01 161941.png';
import ngobarThumbnail from '../images/Ngobar(ngoding bareng)20-23Mei2026/IMG-20260524-WA0125.jpg';

const LOCAL_COVERS = {
  'network-docs': topoThumbnail,
  'tugas-uas-web': tugasThumbnail,
  ngobar: ngobarThumbnail,
};

// Nama ikon di admin -> ikon lucide
const ICON_MAP = {
  wrench: Wrench,
  server: Server,
  globe: Globe,
  presentation: Presentation,
  code: Code,
  users: Users,
  building: Building2,
  shield: Shield,
  database: Database,
  layers: Layers,
  layout: LayoutDashboard,
};

const same = (arr) => ({ id: arr, en: arr });

// Tampil jika Supabase tidak bisa dijangkau atau belum ada proyek sama sekali.
const FALLBACK = [
  {
    slug: 'network-docs',
    icon: 'server',
    cover: topoThumbnail,
    titles: { id: 'Topologi & Konfigurasi', en: 'Network Topology' },
    descs: {
      id: 'Dokumentasi proyek konfigurasi MikroTik, desain topologi Cisco, dan troubleshooting.',
      en: 'Documentation of MikroTik configuration projects, Cisco topology designs, and troubleshooting.',
    },
    tags: same(['MikroTik', 'Cisco', 'Topologi']),
  },
  {
    slug: 'tugas-uas-web',
    icon: 'globe',
    cover: tugasThumbnail,
    titles: { id: 'Portal Web & Data Wilayah', en: 'Web Portal & Regional Data' },
    descs: {
      id: 'Pengembangan aplikasi portal web interaktif, validasi autentikasi pengguna, dan Sistem Informasi Wilayah Terpadu (UIA).',
      en: 'Development of interactive web portal application, user authentication validation, and Integrated Regional Information System (UIA).',
    },
    tags: same(['Web Dev', 'Autentikasi', 'Cascading Data']),
  },
  {
    slug: 'ngobar',
    icon: 'presentation',
    cover: ngobarThumbnail,
    titles: { id: 'Workshop NGOBAR (Ngoding Bareng)', en: 'NGOBAR Web Dev Workshop' },
    descs: {
      id: 'Pelatihan dasar pembuatan kerangka dan gaya website (HTML & CSS) sebagai Pemateri Utama diselenggarakan HMTF UIA.',
      en: 'Hands-on web development workshop (HTML & CSS) as Keynote Speaker organized by HMTF UIA.',
    },
    tags: same(['Pemateri', 'HTML & CSS', 'HMTF UIA']),
  },
];

// Baris database -> bentuk kartu
const toCard = (p) => {
  const first = [...(p.project_photos || [])].sort((a, b) => a.sort_order - b.sort_order)[0];
  return {
    slug: p.slug,
    icon: p.badge_icon,
    cover: first ? photoUrl(first.image_path) : LOCAL_COVERS[p.slug] || null,
    titles: { id: p.title_id, en: p.title_en || p.title_id },
    descs: { id: p.description_id, en: p.description_en || p.description_id },
    tags: {
      id: [p.badge_id].filter(Boolean),
      en: [p.badge_en || p.badge_id].filter(Boolean),
    },
  };
};

export default function ProjectCards({ lang }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(null); // null = masih memuat

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(
          'id, slug, badge_icon, badge_id, badge_en, title_id, title_en, description_id, description_en, sort_order, created_at, project_photos(image_path, sort_order)'
        )
        .eq('back_section', 'proyek')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Gagal memuat proyek dari Supabase:', error);
        setItems(FALLBACK);
      } else if (!data || data.length === 0) {
        setItems(FALLBACK);
      } else {
        setItems(data.map(toCard));
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (!items) return <div className="min-h-[200px]" aria-busy="true" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => {
        const Icon = ICON_MAP[p.icon] || Server;
        const title = p.titles[lang] || p.titles.id;
        const desc = p.descs[lang] || p.descs.id;
        const tags = p.tags[lang] || p.tags.id || [];
        const go = () => navigate(`/proyek/${p.slug}`);

        return (
          <div
            key={p.slug}
            role="link"
            tabIndex={0}
            onClick={go}
            onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
            className="animate-fadeIn cursor-pointer group rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 glow-border hover:shadow-ambient dark:hover:shadow-ambient-dark bg-surface-lowest border-outline-variant dark:bg-dark-surface-lowest dark:border-dark-outline-variant flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-outline-variant dark:border-dark-outline-variant bg-black/20">
              {p.cover ? (
                <img
                  src={p.cover}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                  <Icon className="w-12 h-12 opacity-60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Konten kartu */}
            <div className="p-5 md:p-6 flex-grow flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg xl:text-xl text-on-surface dark:text-dark-on-surface line-clamp-2">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-6 leading-relaxed flex-grow line-clamp-3">
                {desc}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded border border-outline-variant dark:border-dark-outline-variant">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}