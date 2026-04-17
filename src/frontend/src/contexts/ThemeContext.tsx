import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeId = "layl" | "fajr" | "jannat" | "noor";

export interface ThemeTokens {
  id: ThemeId;
  bg: string;
  bgMid: string;
  primary: string;
  gold: string;
  card: string;
  cardBorder: string;
  textWhite: string;
  textCream: string;
  textMuted: string;
  navBg: string;
  navInactive: string;
  emerald: string;
  toggleOff: string;
  toggleThumb: string;
  pillText: string;
  isLight: boolean;
}

export const THEMES: Record<ThemeId, ThemeTokens> = {
  layl: {
    id: "layl",
    bg: "#04080f",
    bgMid: "#080f1e",
    primary: "#d4a843",
    gold: "#d4a843",
    card: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(212,168,67,0.12)",
    textWhite: "#f5efe0",
    textCream: "#c8b48a",
    textMuted: "#7a6e56",
    navBg: "#020810",
    navInactive: "rgba(245,239,224,0.35)",
    emerald: "#1a6b4a",
    toggleOff: "#2a3a3a",
    toggleThumb: "#f5efe0",
    pillText: "#04080f",
    isLight: false,
  },
  fajr: {
    id: "fajr",
    bg: "#0d0a1a",
    bgMid: "#12102a",
    primary: "#9b7fd4",
    gold: "#c4a04a",
    card: "rgba(155,127,212,0.08)",
    cardBorder: "rgba(155,127,212,0.2)",
    textWhite: "#f0ecff",
    textCream: "#c4b8e0",
    textMuted: "#7a7090",
    navBg: "#080612",
    navInactive: "rgba(240,236,255,0.35)",
    emerald: "#6b4a9b",
    toggleOff: "#2a3a3a",
    toggleThumb: "#f0ecff",
    pillText: "#0d0a1a",
    isLight: false,
  },
  jannat: {
    id: "jannat",
    bg: "#021a0a",
    bgMid: "#041a0c",
    primary: "#2ecc71",
    gold: "#f0c040",
    card: "rgba(46,204,113,0.07)",
    cardBorder: "rgba(46,204,113,0.2)",
    textWhite: "#e8fff2",
    textCream: "#a0d4b4",
    textMuted: "#567a64",
    navBg: "#010e05",
    navInactive: "rgba(232,255,242,0.35)",
    emerald: "#1a6b4a",
    toggleOff: "#2a3a3a",
    toggleThumb: "#e8fff2",
    pillText: "#021a0a",
    isLight: false,
  },
  noor: {
    id: "noor",
    bg: "#f5efe0",
    bgMid: "#ede4cc",
    primary: "#8b6914",
    gold: "#8b6914",
    card: "rgba(139,105,20,0.08)",
    cardBorder: "rgba(139,105,20,0.2)",
    textWhite: "#2a1f0a",
    textCream: "#2a1f0a",
    textMuted: "#5a4a2a",
    navBg: "#e8dfc8",
    navInactive: "rgba(42,31,10,0.4)",
    emerald: "#1a5c3a",
    toggleOff: "#d0c4a0",
    toggleThumb: "#2a1f0a",
    pillText: "#f5efe0",
    isLight: true,
  },
};

function applyThemeToDom(theme: ThemeTokens) {
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", theme.bg);
  root.style.setProperty("--theme-bg-mid", theme.bgMid);
  root.style.setProperty("--theme-primary", theme.primary);
  root.style.setProperty("--theme-gold", theme.gold);
  root.style.setProperty("--theme-card", theme.card);
  root.style.setProperty("--theme-card-border", theme.cardBorder);
  root.style.setProperty("--theme-text-white", theme.textWhite);
  root.style.setProperty("--theme-text-cream", theme.textCream);
  root.style.setProperty("--theme-text-muted", theme.textMuted);
  root.style.setProperty("--theme-nav-bg", theme.navBg);
  root.style.setProperty("--theme-nav-inactive", theme.navInactive);
  root.style.setProperty("--theme-emerald", theme.emerald);
  root.style.setProperty("--theme-toggle-off", theme.toggleOff);
  root.style.setProperty("--theme-toggle-thumb", theme.toggleThumb);
  root.style.setProperty("--theme-pill-text", theme.pillText);
}

// Apply theme synchronously before first render to avoid flash
function initTheme(): ThemeId {
  let saved: ThemeId = "layl";
  try {
    const v = localStorage.getItem("ruhani_theme");
    if (v && v in THEMES) saved = v as ThemeId;
  } catch {
    // ignore
  }
  applyThemeToDom(THEMES[saved]);
  return saved;
}

const savedThemeId = initTheme();

interface ThemeContextValue {
  theme: ThemeTokens;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(savedThemeId);

  const theme = THEMES[themeId];

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id);
    applyThemeToDom(THEMES[id]);
    try {
      localStorage.setItem("ruhani_theme", id);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
