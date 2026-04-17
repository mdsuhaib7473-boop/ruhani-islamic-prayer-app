import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";

const DHIKR_PRESETS = [
  {
    id: 1,
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    meaning: "Glory be to Allah",
    target: 33,
  },
  {
    id: 2,
    arabic: "الْحَمْدُ لِللَّهِ",
    transliteration: "Alhamdulillah",
    meaning: "All praise is for Allah",
    target: 33,
  },
  {
    id: 3,
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    target: 34,
  },
  {
    id: 4,
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    meaning: "There is no god but Allah",
    target: 100,
  },
  {
    id: 5,
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    meaning: "I seek forgiveness from Allah",
    target: 100,
  },
];

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface ConfettiItem {
  id: number;
  left: string;
  delay: string;
}

const OUTER_R = 132;
const PROGRESS_R = 118;
const INNER_R = 105;
const SVG_SIZE = 290;
const CX = SVG_SIZE / 2;

// Play a soft tick sound via Web Audio API
function playTickSound(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
    osc.onended = () => {
      ctx.close().catch(() => {});
    };
  } catch {
    // Web Audio API not available
  }
}

export default function TasbeehTab() {
  const { vibrationEnabled, soundEnabled, customTarget } = useSettings();
  const { theme, themeId } = useTheme();

  // Restore saved state from localStorage
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const saved = localStorage.getItem("ruhani_tasbeeh_dhikr");
      if (saved) {
        const id = Number.parseInt(saved, 10);
        if (DHIKR_PRESETS.some((d) => d.id === id)) return id;
      }
    } catch {}
    return 1;
  });
  const [count, setCount] = useState(() => {
    try {
      const saved = localStorage.getItem("ruhani_tasbeeh_count");
      if (saved) return Math.max(0, Number.parseInt(saved, 10));
    } catch {}
    return 0;
  });
  const [sessionTotal, setSessionTotal] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [confetti] = useState<ConfettiItem[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 1000}ms`,
    })),
  );
  const [tapping, setTapping] = useState(false);
  const celebrationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleCounter = useRef(0);
  const countRef = useRef(count);

  const selected =
    DHIKR_PRESETS.find((d) => d.id === selectedId) ?? DHIKR_PRESETS[0];
  const effectiveTarget = customTarget > 0 ? customTarget : selected.target;
  const progressFraction = Math.min(count / effectiveTarget, 1);
  const progressCircumference = 2 * Math.PI * PROGRESS_R;
  const strokeDashoffset = progressCircumference * (1 - progressFraction);

  const isLayl = themeId === "layl";

  // Sync ref with state
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // Auto-save count and dhikr on every change
  useEffect(() => {
    try {
      localStorage.setItem("ruhani_tasbeeh_count", count.toString());
    } catch {}
  }, [count]);

  useEffect(() => {
    try {
      localStorage.setItem("ruhani_tasbeeh_dhikr", selectedId.toString());
    } catch {}
  }, [selectedId]);

  const handleTap = useCallback(() => {
    if (celebrating) return;

    const currentCount = countRef.current;
    const newCount = currentCount + 1;

    const rippleId = ++rippleCounter.current;
    setRipples((prev) => [...prev, { id: rippleId, x: 0, y: 0 }]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== rippleId)),
      620,
    );

    setTapping(true);
    setTimeout(() => setTapping(false), 200);

    // Vibration feedback
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate(30);

    // Sound feedback
    if (soundEnabled) playTickSound();

    if (newCount >= effectiveTarget) {
      setCount(effectiveTarget);
      countRef.current = effectiveTarget;
      setSessionTotal((prev) => prev + 1);
      setCelebrating(true);
      if (celebrationTimeout.current) clearTimeout(celebrationTimeout.current);
      celebrationTimeout.current = setTimeout(() => {
        const nextIdx = DHIKR_PRESETS.findIndex((d) => d.id === selectedId);
        const next = DHIKR_PRESETS[(nextIdx + 1) % DHIKR_PRESETS.length];
        setSelectedId(next.id);
        setCount(0);
        countRef.current = 0;
        setCelebrating(false);
      }, 2000);
    } else {
      setCount(newCount);
      countRef.current = newCount;
      setSessionTotal((prev) => prev + 1);
    }
  }, [
    celebrating,
    effectiveTarget,
    vibrationEnabled,
    soundEnabled,
    selectedId,
  ]);

  const handleReset = () => {
    if (celebrationTimeout.current) clearTimeout(celebrationTimeout.current);
    setCount(0);
    countRef.current = 0;
    setCelebrating(false);
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate(30);
  };

  const handlePresetChange = (id: number) => {
    setSelectedId(id);
    setCount(0);
    countRef.current = 0;
    setCelebrating(false);
    if (celebrationTimeout.current) clearTimeout(celebrationTimeout.current);
  };

  useEffect(() => {
    return () => {
      if (celebrationTimeout.current) clearTimeout(celebrationTimeout.current);
    };
  }, []);

  const primaryHex = theme.primary;

  const arabicTextShadow = isLayl
    ? `0 0 30px ${theme.gold}cc, 0 0 15px ${theme.gold}88`
    : `0 0 20px ${theme.gold}99`;

  const circleBackground = isLayl
    ? "rgba(4,12,24,0.9)"
    : theme.isLight
      ? `radial-gradient(circle at center, ${theme.bgMid} 0%, ${theme.bg} 70%)`
      : `radial-gradient(circle at center, #0a1a2e 0%, ${theme.bg} 70%)`;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "transparent", position: "relative" }}
    >
      {/* Celebration Overlay */}
      {celebrating && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${theme.gold}1f`,
            animation: "goldScreenGlow 2s ease forwards",
            pointerEvents: "none",
          }}
        >
          {confetti.map((c) => (
            <span
              key={c.id}
              style={{
                position: "absolute",
                top: 0,
                left: c.left,
                color: theme.gold,
                fontSize: 16,
                animation: `confettiFall 2s ease ${c.delay} both`,
              }}
            >
              ✶
            </span>
          ))}
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontWeight: 700,
              fontSize: 52,
              color: theme.gold,
              textShadow: `0 0 40px ${theme.gold}cc, 0 0 80px ${theme.gold}66`,
              direction: "rtl",
              animation: "fadeInUp 0.5s ease",
              textAlign: "center",
            }}
          >
            مَا شَاءَ اللَّهُ
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          padding: "20px 20px 8px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 300,
            fontSize: 12,
            color: isLayl ? theme.gold : theme.textCream,
          }}
        >
          Session: {sessionTotal}
        </div>
        {/* Sound/Vibration indicators */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            display: "flex",
            gap: 6,
          }}
        >
          {soundEnabled && (
            <span
              style={{ fontSize: 14, opacity: 0.7 }}
              title="Sound on"
              aria-label="Sound on"
            >
              🔔
            </span>
          )}
          {vibrationEnabled && (
            <span
              style={{ fontSize: 14, opacity: 0.7 }}
              title="Vibration on"
              aria-label="Vibration on"
            >
              📳
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: "'Amiri', serif",
            fontWeight: 700,
            fontSize: 42,
            color: theme.textWhite,
            direction: "rtl",
            textShadow: arabicTextShadow,
            lineHeight: 1.4,
            marginBottom: 4,
          }}
        >
          {selected.arabic}
        </div>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 16,
            color: theme.textCream,
            marginBottom: 2,
          }}
        >
          {selected.transliteration}
        </div>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: theme.textMuted,
          }}
        >
          {selected.meaning}
        </div>
        {customTarget > 0 && customTarget !== selected.target && (
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              color: theme.gold,
              marginTop: 2,
              opacity: 0.8,
            }}
          >
            Custom target: {customTarget}
          </div>
        )}
      </div>

      {/* Counter area */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ flex: 1, minHeight: 0, paddingTop: 8, paddingBottom: 8 }}
      >
        <div
          style={{
            position: "relative",
            width: SVG_SIZE,
            height: SVG_SIZE,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLayl && (
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          )}

          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            aria-hidden="true"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          >
            <g
              style={{
                transformOrigin: `${CX}px ${CX}px`,
                animation: "rotateRing 12s linear infinite",
              }}
            >
              <circle
                cx={CX}
                cy={CX}
                r={OUTER_R}
                fill="none"
                stroke={theme.gold}
                strokeWidth="1.5"
                opacity="0.5"
              />
              {[0, 90, 180, 270].map((angle) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = CX + OUTER_R * Math.cos(rad);
                const y = CX + OUTER_R * Math.sin(rad);
                return (
                  <text
                    key={angle}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fill={theme.gold}
                  >
                    ✶
                  </text>
                );
              })}
            </g>

            <circle
              cx={CX}
              cy={CX}
              r={PROGRESS_R}
              fill="none"
              stroke={isLayl ? "rgba(5,15,30,0.6)" : theme.bg}
              strokeWidth="8"
              transform={`rotate(-90 ${CX} ${CX})`}
            />
            <circle
              cx={CX}
              cy={CX}
              r={PROGRESS_R}
              fill="none"
              stroke={primaryHex}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={progressCircumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${CX} ${CX})`}
              style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />

            <circle
              cx={CX}
              cy={CX}
              r={INNER_R}
              fill="none"
              stroke={`${primaryHex}33`}
              strokeWidth="2"
              style={{ animation: "pulseGlow 2s ease-in-out infinite" }}
            />
          </svg>

          <button
            type="button"
            data-ocid="tasbeeh.primary_button"
            onClick={handleTap}
            style={{
              width: 210,
              height: 210,
              borderRadius: "50%",
              background: circleBackground,
              border: `1px solid ${primaryHex}4d`,
              boxShadow: `0 0 40px ${primaryHex}26, inset 0 0 40px rgba(0,0,0,0.5)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              animation: tapping ? "tapBounce 200ms ease" : undefined,
              zIndex: 2,
              backdropFilter: isLayl ? "blur(4px)" : undefined,
            }}
          >
            {ripples.map((r) => (
              <div
                key={r.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 60,
                  height: 60,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: `${primaryHex}4d`,
                  animation: "rippleOut 600ms ease-out forwards",
                  pointerEvents: "none",
                }}
              />
            ))}

            <div
              style={{
                overflow: "hidden",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                key={count}
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: count >= 100 ? 72 : 90,
                  color: isLayl ? "#ffffff" : theme.textWhite,
                  lineHeight: 1,
                  animation: "numberFlip 200ms ease-out",
                  display: "block",
                  textShadow: isLayl
                    ? `0 0 20px ${theme.gold}99, 0 0 40px ${theme.gold}66`
                    : undefined,
                }}
              >
                {count}
              </span>
            </div>

            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 18,
                color: theme.gold,
                lineHeight: 1,
                marginTop: -4,
              }}
            >
              / {effectiveTarget}
            </div>
          </button>
        </div>

        <button
          type="button"
          data-ocid="tasbeeh.secondary_button"
          onClick={handleReset}
          style={{
            marginTop: 20,
            padding: "8px 20px",
            width: 120,
            borderRadius: 20,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: isLayl ? "#ffffff" : theme.gold,
            background: isLayl ? "rgba(5,15,30,0.6)" : "transparent",
            border: `1px solid ${theme.gold}`,
            cursor: "pointer",
            display: "block",
            alignSelf: "center",
            flexShrink: 0,
            backdropFilter: isLayl ? "blur(8px)" : undefined,
          }}
        >
          Reset
        </button>
      </div>

      {/* Dhikr chips */}
      <div style={{ padding: "8px 0 12px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            padding: "4px 16px",
            scrollbarWidth: "none",
          }}
        >
          {DHIKR_PRESETS.map((d) => {
            const isSelected = selectedId === d.id;
            return (
              <button
                type="button"
                key={d.id}
                data-ocid="tasbeeh.tab"
                onClick={() => handlePresetChange(d.id)}
                style={{
                  flexShrink: 0,
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: isSelected
                    ? `${primaryHex}26`
                    : isLayl
                      ? "rgba(255,255,255,0.07)"
                      : theme.card,
                  backdropFilter: "blur(10px)",
                  border: isSelected
                    ? `1px solid ${theme.gold}`
                    : isLayl
                      ? "1px solid rgba(201,168,76,0.2)"
                      : `1px solid ${theme.cardBorder}`,
                  boxShadow: isSelected ? `0 0 15px ${theme.gold}33` : "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Amiri', serif",
                    fontSize: 18,
                    color: isSelected ? theme.textWhite : theme.textCream,
                    direction: "rtl",
                  }}
                >
                  ✶ {d.arabic}
                </span>
                <span
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    color: theme.textCream,
                  }}
                >
                  {d.transliteration}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
