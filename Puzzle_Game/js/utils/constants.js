export const APP_VERSION = "1.0.0";
export const SAVE_KEY = "puzzle-challenge-session-v1";

export const DIFFICULTIES = [
  { id: "3x3", cols: 3, pieces: 9, zh: "入門", en: "Easy", note: "9 片", snapRatio: 0.2 },
  { id: "4x4", cols: 4, pieces: 16, zh: "輕鬆", en: "Casual", note: "16 片", snapRatio: 0.15 },
  { id: "5x5", cols: 5, pieces: 25, zh: "標準", en: "Classic", note: "25 片", snapRatio: 0.15 },
  { id: "6x6", cols: 6, pieces: 36, zh: "進階", en: "Advanced", note: "36 片", snapRatio: 0.12 },
  { id: "8x8", cols: 8, pieces: 64, zh: "專家", en: "Expert", note: "64 片", snapRatio: 0.1 },
  { id: "10x10", cols: 10, pieces: 100, zh: "極限", en: "Master", note: "100 片", snapRatio: 0.1 }
];

export const THEMES = [
  { id: "theme-ocean", label: "海洋", colors: ["#0077B6", "#00B4D8", "#F97316"] },
  { id: "theme-forest", label: "森林", colors: ["#2D6A4F", "#52B788", "#E9A227"] },
  { id: "theme-sunset", label: "夕陽", colors: ["#E85D04", "#F48C06", "#0077B6"] },
  { id: "theme-candy", label: "糖果", colors: ["#D62B7A", "#FF6FB2", "#00A896"] },
  { id: "theme-midnight", label: "午夜", colors: ["#7B2FBE", "#E040FB", "#FFD166"] },
  { id: "theme-gold", label: "金色", colors: ["#C9A227", "#FFD700", "#0F766E"] }
];

export const DEFAULT_SETTINGS = {
  musicVolume: 50,
  sfxVolume: 80,
  muted: false,
  theme: "theme-ocean",
  defaultDifficulty: "4x4",
  language: "zh-TW"
};

export const IMAGE_RULES = {
  maxBytes: 10 * 1024 * 1024,
  minSide: 100,
  outputSize: 800,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"]
};
