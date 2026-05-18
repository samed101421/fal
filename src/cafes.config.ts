/**
 * ☕ Kahve Falı — Kafe Konfigürasyon Dosyası
 * 
 * Yeni kafe eklemek için bu dosyaya bir obje ekle ve redeploy et.
 * URL otomatik olarak: fal-six.vercel.app/[slug]
 */

export interface CafeConfig {
  /** URL'de görünen kısa isim (slug). Türkçe karakter ve boşluk OLMAZ. */
  slug: string;
  /** Sayfada görünen tam isim */
  name: string;
  /** İkinci satır (şehir, tür vb.) */
  subtitle: string;
  /** Kısa açıklama / tagline */
  tagline: string;
  /** Logo yerine gösterilecek harf veya emoji */
  logoChar: string;
  /** Ana renk (hex) — butonlar, border, vurgular */
  primaryColor: string;
  /** Ana rengin açık tonu — başlık metni */
  primaryLight: string;
  /** Ana rengin koyu tonu — hover, aktif */
  primaryDark: string;
  /** Arka plan rengi (hex) */
  bgColor: string;
  /** Arka plan orta tonu */
  bgMid: string;
  /** Arka plan en koyu ton */
  bgDeep: string;
  /** Sayfa başlığı (browser tab) */
  pageTitle: string;
  /** SEO meta description */
  metaDescription: string;
  /** Fal prompt'una eklenecek kafe bağlamı */
  promptContext: string;
}

export const cafes: Record<string, CafeConfig> = {
  // ─────────────────────────────────────────
  // 1. QUBBE DÜĞÜN SALONU (ilk müşteri)
  // URL: fal-six.vercel.app/qubbe
  // ─────────────────────────────────────────
  qubbe: {
    slug: "qubbe",
    name: "QUBBE",
    subtitle: "Düğün Salonu",
    tagline: "Özel Kahve Falı Deneyimi",
    logoChar: "Q",
    primaryColor: "#d4af37",
    primaryLight: "#fbf2c0",
    primaryDark: "#aa8c2c",
    bgColor: "#1a0f0a",
    bgMid: "#2d1a11",
    bgDeep: "#0f0705",
    pageTitle: "Qubbe Düğün Salonu – Özel Kahve Falı",
    metaDescription: "Qubbe Düğün Salonu misafirleri için yapay zeka destekli özel kahve falı deneyimi.",
    promptContext: "Kişi, QUBBE Düğün Salonu'nda düzenlenen özel bir etkinliktedir. Bu atmosferi falına yansıt.",
  },

  // ─────────────────────────────────────────
  // 2. DEMO — yeni kafe eklemek için örnek şablon
  // URL: fal-six.vercel.app/demo
  // (Silmeden önce kopyala ve slug'ı değiştir)
  // ─────────────────────────────────────────
  demo: {
    slug: "demo",
    name: "ÖRNEK KAFE",
    subtitle: "Kahve & Fal",
    tagline: "Fincanınızda gizlenen sırlar",
    logoChar: "☕",
    primaryColor: "#7c5cbf",     // mor/lavanta tema
    primaryLight: "#e8d5ff",
    primaryDark: "#5a3d9e",
    bgColor: "#0d0a14",
    bgMid: "#1a1228",
    bgDeep: "#080510",
    pageTitle: "Örnek Kafe – AI Kahve Falı",
    metaDescription: "Yapay zeka ile kahve falı deneyimi yaşayın.",
    promptContext: "Kişi, şık ve modern bir kafede oturmaktadır.",
  },

  // ─────────────────────────────────────────
  // 3. OTTOMAN
  // URL: fal-six.vercel.app/ottoman
  // ─────────────────────────────────────────
  ottoman: {
    slug: "ottoman",
    name: "OTTOMAN",
    subtitle: "Malatya'nın Gözdesi",
    tagline: "Sırlar dünyasına elit bir dokunuş",
    logoChar: "O",
    primaryColor: "#e5e7eb",     // Asil Gümüş / Platin
    primaryLight: "#ffffff",     // Parlak Beyaz
    primaryDark: "#9ca3af",      // Koyu Gümüş
    bgColor: "#000000",          // Saf Siyah
    bgMid: "#111111",            // Modern Koyu Gri
    bgDeep: "#050505",           // Derin Siyah
    pageTitle: "Ottoman – Özel Kahve Falı",
    metaDescription: "Malatya'nın gözdesi Ottoman'da elit ve modern yapay zeka kahve falı deneyimi.",
    promptContext: "Kişi, Malatya'nın en elit, asil ve modern mekanlarından biri olan Ottoman'da kahvesini içmektedir. Fal yorumunu bu lüks ve elit atmosfere uygun yap.",
  },
};

/** Slug'dan kafe config'ini al. Bulunamazsa null döner. */
export function getCafe(slug: string): CafeConfig | null {
  return cafes[slug.toLowerCase()] ?? null;
}

/** Tüm aktif kafe slug'larını listele (sitemap vs. için) */
export function getAllSlugs(): string[] {
  return Object.keys(cafes);
}
