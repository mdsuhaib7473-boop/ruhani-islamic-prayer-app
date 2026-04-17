import { useMemo, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { ASMA_UL_HUSNA, type AsmaName } from "../data/names";

export default function NamesTab() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return ASMA_UL_HUSNA;
    const q = search.toLowerCase();
    return ASMA_UL_HUSNA.filter(
      (n) =>
        n.arabic.includes(search) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.benefit.toLowerCase().includes(q) ||
        n.number.toString() === search.trim(),
    );
  }, [search]);

  return (
    <div className="flex flex-col h-full" style={{ background: "transparent" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "'Amiri', serif",
            fontWeight: 700,
            fontSize: 32,
            color: theme.gold,
            direction: "rtl",
            lineHeight: 1.2,
          }}
        >
          أَسْمَاءُ اللهِ الحُسْنى
        </div>
        <div
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 10,
            color: theme.textCream,
            letterSpacing: "0.2em",
            marginTop: 2,
          }}
        >
          99 NAMES OF ALLAH
        </div>
      </div>

      {/* Search */}
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
            data-ocid="names.search_input"
            type="text"
            placeholder="Search by name, meaning..."
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
              boxSizing: "border-box" as const,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 16px ${theme.primary}22`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.cardBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        {search.trim() && (
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 12,
              color: theme.textMuted,
              marginTop: 6,
              paddingLeft: 4,
            }}
          >
            {filtered.length} name{filtered.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>

      {/* Names list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 14px 16px",
          minHeight: 0,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {filtered.length === 0 ? (
          <div
            data-ocid="names.empty_state"
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
            <span style={{ fontSize: 32 }}>✨</span>
            <span>No names found</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((name, idx) => (
              <NameCard key={name.number} name={name} index={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NameCard({ name, index }: { name: AsmaName; index: number }) {
  const { theme } = useTheme();
  return (
    <div
      data-ocid={`names.item.${index}`}
      style={{
        borderRadius: 16,
        background: theme.card,
        border: `1px solid ${theme.cardBorder}`,
        padding: "14px 16px",
        animation: `cardSlideUp 0.4s ease ${Math.min(index * 40, 400)}ms both`,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      {/* Number badge */}
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.gold}33, ${theme.gold}11)`,
          border: `1px solid ${theme.gold}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          color: theme.gold,
        }}
      >
        {name.number}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Arabic name */}
        <div
          style={{
            fontFamily: "'Amiri', serif",
            fontWeight: 700,
            fontSize: 26,
            color: theme.textWhite,
            direction: "rtl",
            textAlign: "right",
            lineHeight: 1.4,
            marginBottom: 4,
            textShadow: `0 0 20px ${theme.gold}44`,
          }}
        >
          {name.arabic}
        </div>

        {/* Transliteration */}
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 14,
            color: theme.gold,
            marginBottom: 2,
          }}
        >
          {name.transliteration}
        </div>

        {/* Meaning */}
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: theme.textWhite,
            marginBottom: 6,
          }}
        >
          {name.meaning}
        </div>

        {/* Benefit */}
        <div
          style={{
            background: theme.isLight
              ? "rgba(139,105,20,0.06)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${theme.gold}1a`,
            borderRadius: 8,
            padding: "6px 10px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 300,
            fontSize: 11,
            color: theme.textCream,
            lineHeight: 1.5,
            display: "flex",
            gap: 5,
            alignItems: "flex-start",
          }}
        >
          <span style={{ color: theme.gold, flexShrink: 0 }}>✨</span>
          <span>{name.benefit}</span>
        </div>
      </div>
    </div>
  );
}
