import { useEffect, useRef, useState } from "react";
import DuasTab from "./components/DuasTab";
import NamesTab from "./components/NamesTab";
import PrayerTimesTab from "./components/PrayerTimesTab";
import SettingsTab from "./components/SettingsTab";
import TasbeehTab from "./components/TasbeehTab";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { scheduleDailyDuaNotification } from "./utils/duaNotification";
import { scheduleJummahNotification } from "./utils/jummahNotification";

type Tab = "tasbeeh" | "duas" | "prayer" | "names" | "settings";

// ─── Islamic Background ─────────────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 85}%`,
  size: Math.random() > 0.5 ? 2 : 1,
  duration: `${2 + Math.random() * 3}s`,
  delay: `${Math.random() * 4}s`,
}));

function IslamicBackground() {
  const { theme, themeId } = useTheme();

  if (themeId === "layl") {
    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(ellipse at top, #0d2137 0%, #050d1a 50%, #020810 100%)",
            zIndex: 0,
          }}
        />
        <svg
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            opacity: 0.07,
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="islamicStar8Layl"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="30,5 33.5,22 50,15 38.5,27 55,30 38.5,33 50,45 33.5,38 30,55 26.5,38 10,45 21.5,33 5,30 21.5,27 10,15 26.5,22"
                fill="#c9a84c"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicStar8Layl)" />
        </svg>
        <div
          style={{
            position: "fixed",
            width: 200,
            height: 200,
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(201,168,76,0.08)",
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "fixed",
            width: 150,
            height: 150,
            top: "40%",
            left: -40,
            background: "rgba(26,107,74,0.06)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "fixed",
            width: 180,
            height: 180,
            bottom: 80,
            right: -30,
            background: "rgba(201,168,76,0.05)",
            borderRadius: "50%",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {STARS.map((s) => (
          <div
            key={s.id}
            style={{
              position: "fixed",
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#ffffff",
              animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        ))}
        <svg
          viewBox="0 0 480 200"
          preserveAspectRatio="xMidYMax meet"
          style={{
            position: "fixed",
            bottom: 56,
            left: 0,
            right: 0,
            width: "100%",
            height: "30vh",
            minHeight: 140,
            maxHeight: 220,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="32" y="30" width="22" height="170" fill="#0a1e32" />
          <ellipse cx="43" cy="30" rx="11" ry="18" fill="#0a1e32" />
          <rect x="39" y="10" width="8" height="20" fill="#0a1e32" />
          <rect x="26" y="70" width="34" height="6" fill="#0a1e32" />
          <rect x="26" y="90" width="34" height="6" fill="#0a1e32" />
          <rect x="426" y="30" width="22" height="170" fill="#0a1e32" />
          <ellipse cx="437" cy="30" rx="11" ry="18" fill="#0a1e32" />
          <rect x="433" y="10" width="8" height="20" fill="#0a1e32" />
          <rect x="420" y="70" width="34" height="6" fill="#0a1e32" />
          <rect x="420" y="90" width="34" height="6" fill="#0a1e32" />
          <ellipse cx="155" cy="110" rx="55" ry="40" fill="#0a1e32" />
          <rect x="100" y="110" width="110" height="90" fill="#0a1e32" />
          <ellipse cx="325" cy="110" rx="55" ry="40" fill="#0a1e32" />
          <rect x="270" y="110" width="110" height="90" fill="#0a1e32" />
          <ellipse cx="240" cy="70" rx="90" ry="70" fill="#0a1e32" />
          <rect x="150" y="70" width="180" height="130" fill="#0a1e32" />
          <rect x="55" y="140" width="370" height="60" fill="#0a1e32" />
          <ellipse cx="200" cy="150" rx="14" ry="20" fill="#0a1e32" />
          <ellipse cx="240" cy="150" rx="14" ry="20" fill="#0a1e32" />
          <ellipse cx="280" cy="150" rx="14" ry="20" fill="#0a1e32" />
        </svg>
      </>
    );
  }

  return (
    <>
      {!theme.isLight &&
        STARS.map((s) => (
          <div
            key={s.id}
            style={{
              position: "fixed",
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#ffffff",
              animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.04,
        }}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="islamicStar"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="30,5 33.5,22 50,15 38.5,27 55,30 38.5,33 50,45 33.5,38 30,55 26.5,38 10,45 21.5,33 5,30 21.5,27 10,15 26.5,22"
              fill={theme.gold}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamicStar)" />
      </svg>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${theme.isLight ? "rgba(139,105,20,0.06)" : "rgba(212,168,67,0.08)"} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {!theme.isLight && (
        <svg
          viewBox="0 0 480 80"
          preserveAspectRatio="xMidYMax meet"
          style={{
            position: "fixed",
            bottom: 56,
            left: 0,
            right: 0,
            width: "100%",
            height: 80,
            pointerEvents: "none",
            zIndex: 1,
            opacity: 0.6,
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="60" y="20" width="18" height="60" fill="#0a1a20" />
          <ellipse cx="69" cy="20" rx="9" ry="14" fill="#0a1a20" />
          <rect x="65" y="6" width="8" height="14" fill="#0a1a20" />
          <rect x="402" y="20" width="18" height="60" fill="#0a1a20" />
          <ellipse cx="411" cy="20" rx="9" ry="14" fill="#0a1a20" />
          <rect x="407" y="6" width="8" height="14" fill="#0a1a20" />
          <ellipse cx="240" cy="50" rx="130" ry="50" fill="#0a1a20" />
          <rect x="110" y="50" width="260" height="30" fill="#0a1a20" />
          <ellipse cx="160" cy="52" rx="40" ry="28" fill="#0a1a20" />
          <ellipse cx="320" cy="52" rx="40" ry="28" fill="#0a1a20" />
        </svg>
      )}
    </>
  );
}

// ─── Splash Screen ───────────────────────────────────────────────────────────
const SPLASH_SUBTITLE = "DUAS & TASBEEH";
const SPLASH_LETTER_ITEMS = "RUHANI".split("").map((letter, i) => ({
  letter,
  key: `${letter}-pos${i}`,
  delay: `${i * 80}ms`,
}));

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [fading, setFading] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 0);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => setPhase(4), 2000);
    const t5 = setTimeout(() => setFading(true), 2800);
    const t6 = setTimeout(() => {
      if (!done.current) {
        done.current = true;
        onDone();
      }
    }, 3200);
    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, [onDone]);

  const crescentPath = "M 60,30 A 30,30 0 1,1 60,90 A 22,22 0 1,0 60,30";
  const circumference = 320;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        opacity: fading ? 0 : 1,
        transition: "opacity 400ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          marginBottom: 24,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          role="img"
          aria-label="Crescent moon"
        >
          <path
            d={crescentPath}
            fill="none"
            stroke="#d4a843"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: phase >= 1 ? 0 : circumference,
              transition: "stroke-dashoffset 1.5s ease-in-out",
            }}
          />
        </svg>
        {phase >= 1 &&
          [
            { x: 10, y: 10, d: "0.3s" },
            { x: 100, y: 15, d: "0.5s" },
            { x: 15, y: 90, d: "0.7s" },
            { x: 95, y: 85, d: "0.9s" },
            { x: 108, y: 50, d: "1.1s" },
          ].map((s) => (
            <span
              key={`${s.x}-${s.y}`}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                color: "#d4a843",
                fontSize: 10,
                animation: `starAppear 0.4s ease ${s.d} both`,
              }}
            >
              ✶
            </span>
          ))}
      </div>

      <div
        style={{
          fontFamily: "'Amiri', serif",
          fontWeight: 700,
          fontSize: 52,
          color: "#d4a843",
          textShadow:
            "0 0 30px rgba(212,168,67,0.8), 0 0 60px rgba(212,168,67,0.4)",
          direction: "rtl",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 600ms ease, transform 600ms ease",
          marginBottom: 8,
        }}
      >
        رُوحَانِي
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 32,
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 18,
            color: "#c8b48a",
            letterSpacing: "0.4em",
            height: 28,
          }}
        >
          {phase >= 3 &&
            SPLASH_LETTER_ITEMS.map((item) => (
              <span
                key={item.key}
                style={{
                  animation: `letterAppear 0.3s ease ${item.delay} both`,
                  display: "inline-block",
                }}
              >
                {item.letter}
              </span>
            ))}
        </div>
        <div
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 10,
            color: "#c8b48a88",
            letterSpacing: "0.3em",
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 800ms ease 500ms",
          }}
        >
          {SPLASH_SUBTITLE}
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Amiri', serif",
          fontSize: 18,
          color: "#c8b48a",
          direction: "rtl",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 600ms ease",
          position: "absolute",
          bottom: 60,
        }}
      >
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </div>
    </div>
  );
}

// ─── Custom Nav Icons ────────────────────────────────────────────────────────
function TasbeehIcon({ color }: { color: string }) {
  const beadAngles = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  const r = 9;
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {beadAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 12 + r * Math.cos(rad);
        const cy = 12 + r * Math.sin(rad);
        return (
          <circle
            key={angle}
            cx={cx}
            cy={cy}
            r={i === 6 ? 2.2 : 1.5}
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
        );
      })}
      <circle
        cx="12"
        cy="22"
        r="2"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

function DuasIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5 C8 3 4 4 3 6 L3 19 C4 17 8 16 12 18"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 5 C16 3 20 4 21 6 L21 19 C20 17 16 16 12 18"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="12" y1="5" x2="12" y2="18" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function PrayerIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 A7 7 0 1 1 5.5 14.5 A5 5 0 1 0 12 3Z"
        fill={color}
        opacity="0.9"
      />
      <circle
        cx="18"
        cy="18"
        r="5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <polyline
        points="18,15.5 18,18 20,19.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NamesIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <text
        x="2"
        y="17"
        fontSize="15"
        fontFamily="serif"
        fill={color}
        fontWeight="bold"
      >
        99
      </text>
    </svg>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 8.5 L13.5 5 L12 3.5 L10.5 5 L12 8.5Z M15.5 10.5 L19 9.5 L19.5 7.5 L17.5 7 L15.5 10.5Z M15.5 13.5 L19 14.5 L19.5 16.5 L17.5 17 L15.5 13.5Z M12 15.5 L13.5 19 L12 20.5 L10.5 19 L12 15.5Z M8.5 13.5 L5 14.5 L4.5 16.5 L6.5 17 L8.5 13.5Z M8.5 10.5 L5 9.5 L4.5 7.5 L6.5 7 L8.5 10.5Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
  );
}

// ─── App Inner ───────────────────────────────────────────────────────────────
const NAV_ITEMS: Array<{ id: Tab; label: string }> = [
  { id: "tasbeeh", label: "Tasbeeh" },
  { id: "duas", label: "Duas" },
  { id: "prayer", label: "Prayer" },
  { id: "names", label: "Names" },
  { id: "settings", label: "Settings" },
];

function AppInner() {
  const { theme, themeId } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("tasbeeh");
  const [animKeys, setAnimKeys] = useState<Record<Tab, number>>({
    tasbeeh: 0,
    duas: 0,
    prayer: 0,
    names: 0,
    settings: 0,
  });

  // Schedule daily dua notification and Jummah reminder on mount
  useEffect(() => {
    scheduleDailyDuaNotification();
    scheduleJummahNotification();
  }, []);

  const handleTabChange = (id: Tab) => {
    if (id !== activeTab) {
      setActiveTab(id);
      setAnimKeys((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  const navBackground = themeId === "layl" ? "#010810" : theme.navBg;

  const getIcon = (id: Tab, color: string) => {
    switch (id) {
      case "tasbeeh":
        return <TasbeehIcon color={color} />;
      case "duas":
        return <DuasIcon color={color} />;
      case "prayer":
        return <PrayerIcon color={color} />;
      case "names":
        return <NamesIcon color={color} />;
      case "settings":
        return <SettingsIcon color={color} />;
    }
  };

  return (
    <>
      {themeId !== "layl" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgMid} 100%)`,
            zIndex: 0,
            transition: "background 400ms ease",
          }}
        />
      )}
      <IslamicBackground />

      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 3,
          opacity: showSplash ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tab content — all tabs rendered, only active one visible */}
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            {NAV_ITEMS.map(({ id }) => (
              <div
                key={`${id}-${animKeys[id]}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: activeTab === id ? "flex" : "none",
                  flexDirection: "column",
                  animation:
                    activeTab === id ? "tabSlideIn 280ms ease" : undefined,
                }}
              >
                {id === "tasbeeh" && <TasbeehTab />}
                {id === "duas" && <DuasTab />}
                {id === "prayer" && <PrayerTimesTab />}
                {id === "names" && <NamesTab />}
                {id === "settings" && <SettingsTab />}
              </div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <nav
            style={{
              display: "flex",
              background: navBackground,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              position: "relative",
              zIndex: 10,
              transition: "background 400ms ease",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent 0%, ${theme.gold} 30%, ${theme.primary} 50%, ${theme.gold} 70%, transparent 100%)`,
              }}
            />
            {NAV_ITEMS.map(({ id }) => {
              const isActive = activeTab === id;
              const iconColor = isActive ? theme.gold : theme.navInactive;
              return (
                <button
                  type="button"
                  key={id}
                  data-ocid={`nav.${id}.link`}
                  onClick={() => handleTabChange(id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    minWidth: 0,
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        width: 32,
                        height: 24,
                        background: `${theme.primary}26`,
                        borderRadius: "50%",
                        filter: "blur(8px)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {getIcon(id, iconColor)}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppInner />
      </SettingsProvider>
    </ThemeProvider>
  );
}
