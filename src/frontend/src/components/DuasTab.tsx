import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { type AuthenticityTag, CATEGORIES, type Dua, duas } from "../data/duas";

function getFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem("ruhani_favorites");
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveFavorites(favs: Set<number>) {
  localStorage.setItem("ruhani_favorites", JSON.stringify([...favs]));
}

const CATEGORY_EMOJIS: Record<string, string> = {
  All: "✨",
  Morning: "☀️",
  Evening: "🌙",
  "After Salah": "🙏",
  Eating: "🍽️",
  Sleep: "😴",
  Home: "🏠",
  Protection: "🛡️",
  Travel: "🚗",
  Masjid: "🕌",
  Weather: "🌧️",
  Purification: "💧",
  "Health & Sickness": "🤲",
  "Family & Children": "👨\u200d👩\u200d👧",
  "Rizq & Barakah": "💰",
  "Knowledge & Wisdom": "📚",
  General: "💫",
  "Stress & Anxiety": "🤲",
  Forgiveness: "🤍",
  Food: "🍽️",
  Favorites: "❤️",
};

const TAG_COLORS: Record<
  AuthenticityTag,
  { bg: string; text: string; label: string }
> = {
  Sahih: { bg: "rgba(46,204,113,0.18)", text: "#2ecc71", label: "✓ Sahih" },
  Hasan: { bg: "rgba(52,152,219,0.18)", text: "#5dade2", label: "✓ Hasan" },
  Weak: { bg: "rgba(231,76,60,0.18)", text: "#e67e73", label: "~ Weak" },
  Quran: { bg: "rgba(201,168,76,0.22)", text: "#d4a843", label: "✶ Quran" },
};

const ALL_CATEGORIES = [...CATEGORIES, "Favorites"];

export default function DuasTab() {
  const { theme, themeId } = useTheme();
  const { language } = useSettings();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<number>>(getFavorites);
  const [highlightedDuaId, setHighlightedDuaId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Deep-link: on mount check sessionStorage for a dua ID to highlight
  useEffect(() => {
    const raw = sessionStorage.getItem("ruhani_highlight_dua");
    if (!raw) return;
    const id = Number.parseInt(raw, 10);
    if (Number.isNaN(id)) {
      sessionStorage.removeItem("ruhani_highlight_dua");
      return;
    }
    const target = duas.find((d) => d.id === id);
    if (!target) {
      sessionStorage.removeItem("ruhani_highlight_dua");
      return;
    }
    // Clear search and select the dua's category so it's visible
    setSearch("");
    setActiveCategory(target.category);
    setHighlightedDuaId(id);
    sessionStorage.removeItem("ruhani_highlight_dua");

    // Scroll to the card after a short delay to allow render
    const scrollTimer = setTimeout(() => {
      const card = scrollContainerRef.current?.querySelector<HTMLElement>(
        `[data-dua-id="${id}"]`,
      );
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);

    // Remove highlight after 2.5s
    const clearTimer = setTimeout(() => {
      setHighlightedDuaId(null);
    }, 2700);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavorites(next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = duas;
    if (activeCategory === "Favorites") {
      result = result.filter((d) => favorites.has(d.id));
    } else if (activeCategory !== "All") {
      result = result.filter((d) => d.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.arabic.includes(search) ||
          (d.transliteration?.toLowerCase().includes(q) ?? false) ||
          d.translation.toLowerCase().includes(q) ||
          (d.translationHi?.toLowerCase().includes(q) ?? false) ||
          (d.translationUr?.includes(search) ?? false) ||
          d.source.toLowerCase().includes(q) ||
          (d.name?.toLowerCase().includes(q) ?? false),
      );
    }
    return result;
  }, [activeCategory, favorites, search]);

  const headerBackground =
    themeId === "layl"
      ? "linear-gradient(180deg, rgba(4,8,15,0.9) 0%, transparent 100%)"
      : theme.isLight
        ? `linear-gradient(180deg, ${theme.bg}f2 0%, transparent 100%)`
        : "linear-gradient(180deg, rgba(8,15,30,0.95) 0%, transparent 100%)";

  return (
    <div
      className="flex flex-col"
      style={{ background: "transparent", height: "100%", overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 12px",
          background: headerBackground,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 3 A7 7 0 1 1 3.5 14 A5 5 0 1 0 10 3Z"
            fill={theme.gold}
          />
          <text x="14" y="7" fontSize="6" fill={theme.gold}>
            ✶
          </text>
        </svg>
        <div>
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontWeight: 700,
              fontSize: 36,
              color: theme.gold,
              direction: "rtl",
              lineHeight: 1.2,
            }}
          >
            اَلدُّعَاء
          </div>
          <div
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 11,
              color: theme.textCream,
              letterSpacing: "0.25em",
              marginTop: 2,
            }}
          >
            SUPPLICATIONS
          </div>
        </div>
        {/* Language indicator */}
        <div
          style={{
            marginLeft: "auto",
            background: `${theme.gold}22`,
            border: `1px solid ${theme.gold}44`,
            color: theme.gold,
            borderRadius: 999,
            padding: "3px 10px",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11,
            fontWeight: 400,
          }}
        >
          {language === "hi" ? "हि" : language === "ur" ? "اردو" : "EN"}
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "0 16px 10px", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="7" stroke={theme.gold} strokeWidth="2" />
            <path
              d="M16.5 16.5 L21 21"
              stroke={theme.gold}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            data-ocid="duas.search_input"
            type="text"
            placeholder="Search duas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: 16,
              background: theme.card,
              backdropFilter: "blur(8px)",
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textWhite,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              outline: "none",
              transition: "border-color 300ms, box-shadow 300ms",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 20px ${theme.primary}26`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.cardBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Category pills */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "0 16px 12px",
          flexShrink: 0,
          scrollbarWidth: "none",
        }}
      >
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              type="button"
              key={cat}
              data-ocid="duas.tab"
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: 999,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: isActive ? 600 : 300,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                background: isActive ? theme.primary : theme.card,
                color: isActive ? theme.pillText : theme.textCream,
                border: isActive ? "none" : `1px solid ${theme.cardBorder}`,
              }}
            >
              {CATEGORY_EMOJIS[cat] ?? ""} {cat}
            </button>
          );
        })}
      </div>

      {/* Dua cards list */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0 14px 16px",
          minHeight: 0,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {filtered.length === 0 ? (
          <div
            data-ocid="duas.empty_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 160,
              color: theme.textMuted,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>🌙</span>
            <span>No duas found</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((dua, idx) => (
              <DuaCard
                key={dua.id}
                dua={dua}
                index={idx + 1}
                isFavorite={favorites.has(dua.id)}
                onToggleFavorite={() => toggleFavorite(dua.id)}
                language={language}
                highlighted={highlightedDuaId === dua.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DuaCard({
  dua,
  index,
  isFavorite,
  onToggleFavorite,
  language,
  highlighted,
}: {
  dua: Dua;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  language: string;
  highlighted?: boolean;
}) {
  const { theme } = useTheme();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayTranslation =
    language === "hi" && dua.translationHi
      ? dua.translationHi
      : language === "ur" && dua.translationUr
        ? dua.translationUr
        : dua.translation;

  const handleFavorite = () => {
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 320);
    onToggleFavorite();
  };

  const buildShareText = () =>
    [
      dua.arabic,
      dua.transliteration ? `\n${dua.transliteration}` : "",
      `\n${dua.translation}`,
      language === "hi" && dua.translationHi ? `\n${dua.translationHi}` : "",
      language === "ur" && dua.translationUr ? `\n${dua.translationUr}` : "",
      `\n— ${dua.source}`,
    ].join("");

  const handleCopy = () => {
    const text = buildShareText();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch(() => {
          fallbackCopy(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
    } else {
      fallbackCopy(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleWhatsApp = () => {
    const text = buildShareText();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const tagStyle = dua.tag ? TAG_COLORS[dua.tag] : null;

  return (
    <div
      data-ocid={`duas.item.${index}`}
      data-dua-id={dua.id}
      style={{
        borderRadius: 18,
        background: theme.card,
        border: `1px solid ${highlighted ? "#d4a843" : theme.cardBorder}`,
        boxShadow: highlighted
          ? "0 0 0 2px #d4a843, 0 0 28px 6px rgba(212,168,67,0.45), 0 2px 20px rgba(0,0,0,0.3)"
          : theme.isLight
            ? "0 2px 12px rgba(139,105,20,0.1)"
            : "0 2px 20px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden",
        padding: "14px 14px 14px 18px",
        animation: highlighted
          ? `cardSlideUp 0.4s ease ${index * 60}ms both, duaGlowPulse 2.5s ease forwards`
          : `cardSlideUp 0.4s ease ${index * 60}ms both`,
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* Left gold bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(180deg, ${theme.gold}, ${theme.gold}cc, ${theme.gold})`,
          borderRadius: "3px 0 0 3px",
        }}
      />

      {/* Top row: category badge + authenticity tag + actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: `${theme.gold}26`,
              border: `1px solid ${theme.gold}4d`,
              color: theme.gold,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              padding: "2px 10px",
              borderRadius: 999,
            }}
          >
            {dua.category}
          </span>
          {tagStyle && (
            <span
              style={{
                background: tagStyle.bg,
                border: `1px solid ${tagStyle.text}55`,
                color: tagStyle.text,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 999,
                letterSpacing: "0.03em",
              }}
            >
              {tagStyle.label}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* WhatsApp share */}
          <button
            type="button"
            data-ocid="duas.secondary_button"
            onClick={handleWhatsApp}
            style={{
              background: "transparent",
              border: "1px solid rgba(37,211,102,0.3)",
              borderRadius: 999,
              cursor: "pointer",
              padding: "3px 8px",
              color: "#25d366",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              lineHeight: 1,
            }}
            title="Share on WhatsApp"
          >
            <span style={{ fontSize: 13 }}>💬</span>
          </button>
          {/* Copy button */}
          <button
            type="button"
            data-ocid="duas.button"
            onClick={handleCopy}
            style={{
              background: "transparent",
              border: `1px solid ${copied ? theme.gold : theme.cardBorder}`,
              borderRadius: 999,
              cursor: "pointer",
              padding: "3px 8px",
              color: copied ? theme.gold : theme.textMuted,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              lineHeight: 1,
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            title="Copy to clipboard"
          >
            {copied ? "✓" : "⧉"}
          </button>
          {/* Heart/favorite button */}
          <button
            type="button"
            data-ocid="duas.toggle"
            onClick={handleFavorite}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              animation: heartAnimating ? "heartPop 300ms ease" : undefined,
              lineHeight: 1,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isFavorite ? theme.gold : "none"}
              aria-hidden="true"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke={isFavorite ? theme.gold : theme.textMuted}
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dua name */}
      {dua.name && (
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: theme.textCream,
            marginBottom: 6,
          }}
        >
          {dua.name}
        </div>
      )}

      {/* Arabic text */}
      <div
        style={{
          fontFamily: "'Amiri', serif",
          fontWeight: 700,
          fontSize: 22,
          color: theme.textWhite,
          direction: "rtl",
          lineHeight: 1.8,
          marginBottom: 8,
          textAlign: "right",
        }}
      >
        {dua.arabic}
      </div>

      {/* Transliteration */}
      {dua.transliteration && (
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 13,
            color: theme.textCream,
            marginBottom: 6,
            lineHeight: 1.5,
          }}
        >
          {dua.transliteration}
        </div>
      )}

      {/* Translation (language aware) */}
      <div
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 300,
          fontSize: 13,
          color: theme.textWhite,
          lineHeight: 1.6,
          marginBottom: 8,
          direction: language === "ur" ? "rtl" : "ltr",
        }}
      >
        {displayTranslation}
      </div>

      {/* When to read + Benefit */}
      {(dua.when || dua.benefit) && (
        <div
          style={{
            background: theme.isLight
              ? "rgba(139,105,20,0.06)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${theme.gold}22`,
            borderRadius: 10,
            padding: "8px 10px",
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {dua.when && (
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                color: theme.textCream,
                display: "flex",
                gap: 5,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{ color: theme.gold, fontWeight: 600, flexShrink: 0 }}
              >
                ⏰
              </span>
              <span>{dua.when}</span>
            </div>
          )}
          {dua.benefit && (
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                color: theme.textCream,
                display: "flex",
                gap: 5,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{ color: theme.gold, fontWeight: 600, flexShrink: 0 }}
              >
                ✶
              </span>
              <span>{dua.benefit}</span>
            </div>
          )}
        </div>
      )}

      {/* Source + optional note */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 200,
            fontSize: 11,
            color: theme.gold,
            opacity: 0.8,
          }}
        >
          {dua.source}
        </div>
        {dua.note && (
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 11,
              color: theme.textMuted,
            }}
          >
            {dua.note}
          </div>
        )}
      </div>
    </div>
  );
}

function fallbackCopy(text: string) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    // Silent
  }
}
