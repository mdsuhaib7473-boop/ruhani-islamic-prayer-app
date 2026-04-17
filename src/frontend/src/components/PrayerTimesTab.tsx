import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { requestNotificationPermission } from "../utils/duaNotification";

type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
type AzanablePrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
type AzanPrefs = Record<AzanablePrayer, boolean>;

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const PRAYER_DISPLAY: Record<PrayerName, { label: string; icon: string }> = {
  fajr: { label: "Fajr", icon: "🌙" },
  sunrise: { label: "Sunrise", icon: "🌅" },
  dhuhr: { label: "Dhuhr", icon: "☀️" },
  asr: { label: "Asr", icon: "🌤" },
  maghrib: { label: "Maghrib", icon: "🌇" },
  isha: { label: "Isha", icon: "⭐" },
};

const AZAN_PRAYERS: AzanablePrayer[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul Qi'dah",
  "Dhul Hijjah",
];

// --- Hijri date calculation ---
// Local Umm al-Qura algorithm: converts Gregorian date to Hijri
// using the Islamic calendar epoch (1 Muharram 1 AH = JDN 1948439.5)
function toHijriLocal(date: Date): HijriDate {
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();

  // Gregorian date → Julian Day Number
  const JD =
    367 * Y -
    Math.floor((7 * (Y + Math.floor((M + 9) / 12))) / 4) +
    Math.floor((275 * M) / 9) +
    D +
    1721013.5;

  // JDN → Hijri (Islamic epoch offset)
  const N = Math.floor(JD) - 1948438;
  const year = Math.floor((11 * N + 3) / 355);
  const N1 = N - Math.floor((355 * year) / 11);
  let month = Math.floor((11 * N1 + 5) / 325) + 1;
  // clamp month to valid range 1–12
  if (month < 1) month = 1;
  if (month > 12) month = 12;
  const day = N1 - Math.floor((325 * (month - 1)) / 11) + 1;

  return { day, month, year, monthName: HIJRI_MONTHS[month - 1] ?? "" };
}

// Fetch Hijri date from AlAdhan API; returns null on any failure
async function fetchHijriFromApi(date: Date): Promise<HijriDate | null> {
  try {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    const url = `https://api.aladhan.com/v1/gToH?date=${d}-${m}-${y}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        hijri?: {
          day: string;
          month?: { number: number; en: string };
          year: string;
        };
      };
    };
    const hijri = json?.data?.hijri;
    if (!hijri) return null;
    const day = Number.parseInt(hijri.day, 10);
    const month = hijri.month?.number ?? 1;
    const year = Number.parseInt(hijri.year, 10);
    const monthName = HIJRI_MONTHS[month - 1] ?? hijri.month?.en ?? "";
    if (Number.isNaN(day) || Number.isNaN(year) || year < 1400) return null;
    return { day, month, year, monthName };
  } catch {
    return null;
  }
}

function formatTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function computePrayerTimes(
  lat: number,
  lng: number,
  method: string,
  date: Date,
): Record<PrayerName, Date> | null {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const JD = (y: number, m: number, d: number) => {
    const a = Math.floor((14 - m) / 12);
    const yr = y + 4800 - a;
    const mo = m + 12 * a - 3;
    return (
      d +
      Math.floor((153 * mo + 2) / 5) +
      365 * yr +
      Math.floor(yr / 4) -
      Math.floor(yr / 100) +
      Math.floor(yr / 400) -
      32045
    );
  };

  const y = date.getFullYear();
  const mo = date.getMonth() + 1;
  const d = date.getDate();
  const julDay = JD(y, mo, d) + 12 / 24;
  const D = julDay - 2451545.0;
  const g = (357.529 + 0.98560028 * D) % 360;
  const q = (280.459 + 0.98564736 * D) % 360;
  const L =
    (q + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g))) % 360;
  const e = 23.439 - 0.00000036 * D;
  const RA =
    toDeg(
      Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L))),
    ) / 15;
  const decl = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L))));
  const EqT = q / 15 - ((RA + 24) % 24);
  const noon = 12 - EqT - lng / 15;
  const sunriseAngle = -0.833;
  const fajrAngle =
    method === "ISNA"
      ? 15
      : method === "Karachi"
        ? 18
        : method === "UmmAlQura"
          ? 18.5
          : 18;
  const ishaAngle =
    method === "ISNA"
      ? 15
      : method === "Karachi"
        ? 18
        : method === "UmmAlQura"
          ? 90 / 60
          : method === "Hanafi"
            ? 18
            : 17;

  const hour = (angle: number) => {
    const val =
      (-Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl))) /
      (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));
    if (val < -1 || val > 1) return null;
    return toDeg(Math.acos(val)) / 15;
  };

  const sunriseH = hour(sunriseAngle);
  const fajrH = hour(fajrAngle);
  if (sunriseH === null || fajrH === null) return null;

  const asrFactor = method === "Hanafi" ? 2 : 1;
  const asrAngle = toDeg(
    Math.atan(1 / (asrFactor + Math.tan(toRad(Math.abs(lat - decl))))),
  );
  const asrH = hour(-asrAngle);
  if (asrH === null) return null;

  const ishaH = method === "UmmAlQura" ? sunriseH + 1.5 : hour(ishaAngle);
  if (ishaH === null) return null;

  const toDate = (hours: number) => {
    const tzOffset = -date.getTimezoneOffset() / 60;
    const total = hours + tzOffset;
    const h = Math.floor(total) % 24;
    const m = Math.round((total - Math.floor(total)) * 60);
    const result = new Date(date);
    result.setHours(h < 0 ? h + 24 : h, m >= 60 ? 59 : m, 0, 0);
    return result;
  };

  return {
    fajr: toDate(noon - fajrH),
    sunrise: toDate(noon - sunriseH),
    dhuhr: toDate(noon),
    asr: toDate(noon + asrH),
    maghrib: toDate(noon + sunriseH),
    isha: toDate(noon + ishaH),
  };
}

function getNextPrayer(times: Record<PrayerName, Date>): PrayerName {
  const now = new Date();
  const prayers: PrayerName[] = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ];
  for (const p of prayers) {
    if (now < times[p]) return p;
  }
  return "fajr";
}

function playAzanTone(): void {
  try {
    const ctx = new AudioContext();
    const notes = [
      { freq: 392, dur: 0.4, start: 0 },
      { freq: 440, dur: 0.4, start: 0.5 },
      { freq: 494, dur: 0.6, start: 1.0 },
      { freq: 440, dur: 0.4, start: 1.8 },
      { freq: 392, dur: 0.8, start: 2.3 },
      { freq: 349, dur: 0.6, start: 3.2 },
      { freq: 330, dur: 1.0, start: 3.9 },
    ];
    let lastEnd = 0;
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);
      gain.gain.setValueAtTime(0, ctx.currentTime + note.start);
      gain.gain.linearRampToValueAtTime(
        0.25,
        ctx.currentTime + note.start + 0.05,
      );
      gain.gain.linearRampToValueAtTime(
        0,
        ctx.currentTime + note.start + note.dur,
      );
      osc.start(ctx.currentTime + note.start);
      osc.stop(ctx.currentTime + note.start + note.dur);
      lastEnd = Math.max(lastEnd, note.start + note.dur);
    }
    setTimeout(
      () => {
        ctx.close().catch(() => {});
      },
      (lastEnd + 0.5) * 1000,
    );
  } catch {
    // Web Audio API not available
  }
}

function loadAzanPrefs(): AzanPrefs {
  try {
    const stored = localStorage.getItem("ruhani_azan_prefs");
    if (stored) return JSON.parse(stored) as AzanPrefs;
  } catch {}
  return { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
}

function saveAzanPrefs(prefs: AzanPrefs): void {
  try {
    localStorage.setItem("ruhani_azan_prefs", JSON.stringify(prefs));
  } catch {}
}

export default function PrayerTimesTab() {
  const { theme, themeId } = useTheme();
  const { prayerMethod, azanEnabled } = useSettings();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationName, setLocationName] = useState<string>("");
  const [prayerTimes, setPrayerTimes] = useState<Record<
    PrayerName,
    Date
  > | null>(null);
  const [permissionState, setPermissionState] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");
  const [now, setNow] = useState(new Date());
  const [azanPrefs, setAzanPrefs] = useState<AzanPrefs>(() => loadAzanPrefs());
  const [showAzanSettings, setShowAzanSettings] = useState(false);
  const [hijri, setHijri] = useState<HijriDate>(() => toHijriLocal(new Date()));
  const [hijriLoading, setHijriLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const azanTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hijriDateKeyRef = useRef<string>("");

  // Live clock — 1 second interval for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Hijri date: fetch from API, fall back to local algorithm, refresh daily
  useEffect(() => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    if (hijriDateKeyRef.current === dateKey) return;
    hijriDateKeyRef.current = dateKey;
    setHijriLoading(true);
    // Optimistically set local result immediately so UI is never blank
    setHijri(toHijriLocal(today));
    fetchHijriFromApi(today)
      .then((result) => {
        if (result) setHijri(result);
        setHijriLoading(false);
      })
      .catch(() => setHijriLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleAzan = useCallback(
    (times: Record<PrayerName, Date>) => {
      for (const t of azanTimersRef.current) clearTimeout(t);
      azanTimersRef.current = [];
      if (!azanEnabled) return;
      const nowMs = Date.now();
      for (const prayer of AZAN_PRAYERS) {
        if (!azanPrefs[prayer]) continue;
        const delay = times[prayer].getTime() - nowMs;
        if (delay <= 0) continue;
        const t = setTimeout(() => {
          playAzanTone();
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(
                `🕌 Time for ${PRAYER_DISPLAY[prayer].label} Prayer`,
                {
                  body: `${PRAYER_DISPLAY[prayer].icon} ${formatTime(times[prayer])}`,
                  icon: "/favicon.ico",
                  tag: `ruhani-azan-${prayer}`,
                },
              );
            } catch {}
          }
        }, delay);
        azanTimersRef.current.push(t);
      }
    },
    [azanEnabled, azanPrefs],
  );

  const requestLocation = async () => {
    setPermissionState("loading");
    await requestNotificationPermission();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        setPermissionState("granted");
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        )
          .then((r) => r.json())
          .then((data: Record<string, Record<string, string>>) => {
            const city =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              data?.address?.county ||
              "";
            const country = data?.address?.country_code?.toUpperCase() || "";
            if (city) setLocationName(`${city}, ${country}`);
          })
          .catch(() => {});
      },
      () => {
        setPermissionState("denied");
      },
      { timeout: 10000 },
    );
  };

  // Recompute when coords or method changes
  useEffect(() => {
    if (!coords) return;
    const times = computePrayerTimes(
      coords.lat,
      coords.lng,
      prayerMethod,
      new Date(),
    );
    setPrayerTimes(times);
    if (times) scheduleAzan(times);

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const msUntilMidnight = (() => {
      const d = new Date();
      d.setHours(24, 0, 0, 0);
      return d.getTime() - Date.now();
    })();
    const t = setTimeout(() => {
      const newTimes = computePrayerTimes(
        coords.lat,
        coords.lng,
        prayerMethod,
        new Date(),
      );
      setPrayerTimes(newTimes);
      if (newTimes) scheduleAzan(newTimes);
    }, msUntilMidnight);
    refreshTimerRef.current = t;
    return () => clearTimeout(t);
  }, [coords, prayerMethod, scheduleAzan]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const t of azanTimersRef.current) clearTimeout(t);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const isLayl = themeId === "layl";
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;
  const countdownMs =
    nextPrayer && prayerTimes
      ? Math.max(0, prayerTimes[nextPrayer].getTime() - now.getTime())
      : null;

  const cardStyle = {
    background: theme.card,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 16,
    backdropFilter: "blur(12px)" as const,
  };

  const toggleAzanPref = (prayer: AzanablePrayer) => {
    const updated = { ...azanPrefs, [prayer]: !azanPrefs[prayer] };
    setAzanPrefs(updated);
    saveAzanPrefs(updated);
  };

  // Determine if today is Friday for Jummah badge
  const isFriday = now.getDay() === 5;

  return (
    <div className="flex flex-col h-full" style={{ background: "transparent" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 12px",
          flexShrink: 0,
        }}
      >
        {/* Top row: title + azan button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
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
              أَوْقَاتُ الصَّلَاة
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
              PRAYER TIMES
            </div>
          </div>
          {permissionState === "granted" && (
            <button
              type="button"
              data-ocid="prayer.azan_toggle"
              onClick={() => setShowAzanSettings((v) => !v)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                background: azanEnabled
                  ? `${theme.gold}22`
                  : "rgba(255,255,255,0.06)",
                border: `1px solid ${azanEnabled ? theme.gold : theme.cardBorder}`,
                color: azanEnabled ? theme.gold : theme.textMuted,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
                transition: "all 0.2s ease",
              }}
            >
              <span>{azanEnabled ? "🔔" : "🔕"}</span>
              <span>Azan</span>
            </button>
          )}
        </div>

        {/* Prominent Hijri date — always visible */}
        <div
          data-ocid="prayer.hijri_date"
          style={{
            background: `linear-gradient(135deg, ${theme.card}, ${theme.gold}0e)`,
            border: `1px solid ${theme.gold}40`,
            borderRadius: 14,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: `0 0 16px ${theme.gold}18`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 10,
                color: theme.textMuted,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Hijri Date
            </div>
            <div
              style={{
                fontFamily: "'Amiri', serif",
                fontWeight: 700,
                fontSize: 22,
                color: theme.gold,
                lineHeight: 1.2,
                textShadow: `0 0 12px ${theme.gold}66`,
                opacity: hijriLoading ? 0.7 : 1,
                transition: "opacity 0.4s ease",
              }}
            >
              {hijri.day} {hijri.monthName} {hijri.year} AH
            </div>
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                color: theme.textMuted,
                marginTop: 3,
              }}
            >
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            {locationName && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 300,
                  fontSize: 11,
                  color: theme.textMuted,
                }}
              >
                <span>📍</span>
                <span>{locationName}</span>
                <span
                  style={{
                    marginLeft: 4,
                    background: `${theme.gold}22`,
                    border: `1px solid ${theme.gold}44`,
                    color: theme.gold,
                    borderRadius: 999,
                    padding: "1px 7px",
                    fontSize: 9,
                  }}
                >
                  {prayerMethod}
                </span>
              </div>
            )}
          </div>
          {/* Right: crescent icon or Jummah badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {isFriday ? (
              <div
                style={{
                  background: `linear-gradient(135deg, ${theme.gold}, ${theme.primary})`,
                  borderRadius: 10,
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Amiri', serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#ffffff",
                    direction: "rtl",
                    lineHeight: 1.2,
                  }}
                >
                  الجُمُعة
                </div>
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: 9,
                    color: "rgba(255,255,255,0.85)",
                    letterSpacing: "0.06em",
                  }}
                >
                  JUMMAH
                </div>
              </div>
            ) : (
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M18 6 A12 12 0 1 1 6 20 A9 9 0 1 0 18 6Z"
                  fill={theme.gold}
                  opacity="0.75"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px 16px",
          minHeight: 0,
        }}
      >
        {/* Azan per-prayer settings */}
        {showAzanSettings && permissionState === "granted" && (
          <div
            style={{
              ...cardStyle,
              padding: "16px",
              marginBottom: 16,
              animation: "tabSlideIn 200ms ease",
            }}
          >
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: theme.gold,
                marginBottom: 12,
              }}
            >
              ✶ Per-Prayer Azan
            </div>
            {AZAN_PRAYERS.map((prayer, i) => (
              <div
                key={prayer}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: i < AZAN_PRAYERS.length - 1 ? 10 : 0,
                  marginBottom: i < AZAN_PRAYERS.length - 1 ? 10 : 0,
                  borderBottom:
                    i < AZAN_PRAYERS.length - 1
                      ? `1px solid ${theme.cardBorder}`
                      : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 14,
                    color: theme.textWhite,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{PRAYER_DISPLAY[prayer].icon}</span>
                  <span>{PRAYER_DISPLAY[prayer].label}</span>
                </div>
                <button
                  type="button"
                  data-ocid={`prayer.azan_pref.${prayer}`}
                  onClick={() => toggleAzanPref(prayer)}
                  role="switch"
                  aria-checked={azanPrefs[prayer]}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: azanPrefs[prayer]
                      ? theme.emerald
                      : theme.toggleOff,
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: theme.toggleThumb,
                      top: 3,
                      left: azanPrefs[prayer] ? 23 : 3,
                      transition: "left 0.3s ease",
                    }}
                  />
                </button>
              </div>
            ))}
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 200,
                fontSize: 11,
                color: theme.textMuted,
                marginTop: 8,
              }}
            >
              Global Azan toggle is in Settings → Notifications
            </div>
          </div>
        )}

        {/* Next prayer countdown */}
        {permissionState === "granted" && nextPrayer && prayerTimes && (
          <div
            data-ocid="prayer.countdown_card"
            style={{
              ...cardStyle,
              padding: "20px",
              marginBottom: 16,
              background: `linear-gradient(135deg, ${theme.card}, ${theme.gold}0f)`,
              border: `1px solid ${theme.gold}44`,
              boxShadow: `0 0 20px ${theme.gold}22`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: theme.textMuted,
                marginBottom: 6,
              }}
            >
              Next Prayer
            </div>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 20,
                color: theme.gold,
                marginBottom: 4,
              }}
            >
              {PRAYER_DISPLAY[nextPrayer].icon}{" "}
              {PRAYER_DISPLAY[nextPrayer].label}
            </div>
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                color: theme.textCream,
                marginBottom: 12,
              }}
            >
              {formatTime(prayerTimes[nextPrayer])}
            </div>
            {countdownMs !== null && (
              <div
                style={{
                  fontFamily: "system-ui, monospace",
                  fontWeight: 700,
                  fontSize: 36,
                  color: theme.gold,
                  letterSpacing: "0.08em",
                  textShadow: `0 0 20px ${theme.gold}88`,
                }}
              >
                {formatCountdown(countdownMs)}
              </div>
            )}
          </div>
        )}

        {/* Permission request */}
        {permissionState === "idle" && (
          <div
            data-ocid="prayer.card"
            style={{
              ...cardStyle,
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 48 }}>🕌</div>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 16,
                color: theme.textWhite,
              }}
            >
              Prayer Times
            </div>
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                color: theme.textMuted,
                lineHeight: 1.6,
              }}
            >
              Allow location access to get accurate prayer times for your city
            </div>
            <button
              type="button"
              data-ocid="prayer.primary_button"
              onClick={requestLocation}
              style={{
                padding: "12px 28px",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${theme.gold}, ${theme.primary})`,
                border: "none",
                color: "#ffffff",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: `0 4px 16px ${theme.gold}44`,
              }}
            >
              📍 Allow Location
            </button>
          </div>
        )}

        {/* Loading */}
        {permissionState === "loading" && (
          <div
            data-ocid="prayer.loading_state"
            style={{
              ...cardStyle,
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: `3px solid ${theme.cardBorder}`,
                borderTop: `3px solid ${theme.gold}`,
                borderRadius: "50%",
                animation: "rotateRing 1s linear infinite",
              }}
            />
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 14,
                color: theme.textMuted,
              }}
            >
              Getting your location...
            </div>
          </div>
        )}

        {/* Denied */}
        {permissionState === "denied" && (
          <div
            data-ocid="prayer.error_state"
            style={{
              ...cardStyle,
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40 }}>🚫</div>
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: theme.textWhite,
              }}
            >
              Location access denied
            </div>
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 12,
                color: theme.textMuted,
                lineHeight: 1.5,
              }}
            >
              Please enable location permissions in your browser settings and
              try again
            </div>
            <button
              type="button"
              data-ocid="prayer.secondary_button"
              onClick={requestLocation}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                background: "transparent",
                border: `1px solid ${theme.gold}`,
                color: theme.gold,
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Prayer time cards */}
        {permissionState === "granted" && prayerTimes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(Object.keys(PRAYER_DISPLAY) as PrayerName[]).map((prayer) => {
              const isNext = prayer === nextPrayer;
              const isPast = now > prayerTimes[prayer];
              const display = PRAYER_DISPLAY[prayer];
              const isAzanable = (AZAN_PRAYERS as string[]).includes(prayer);
              const azanOn =
                isAzanable &&
                azanEnabled &&
                azanPrefs[prayer as AzanablePrayer];
              return (
                <div
                  key={prayer}
                  data-ocid={`prayer.item.${Object.keys(PRAYER_DISPLAY).indexOf(prayer) + 1}`}
                  style={{
                    ...cardStyle,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: isNext
                      ? `0 0 20px ${theme.gold}33, inset 0 0 20px ${theme.gold}08`
                      : undefined,
                    border: isNext
                      ? `1px solid ${theme.gold}66`
                      : `1px solid ${theme.cardBorder}`,
                    opacity: isPast && !isNext ? 0.55 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <span style={{ fontSize: 22 }}>{display.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: isNext ? 700 : 400,
                          fontSize: 16,
                          color: isNext ? theme.gold : theme.textWhite,
                        }}
                      >
                        {display.label}
                      </div>
                      {isNext && (
                        <div
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 300,
                            fontSize: 11,
                            color: theme.gold,
                            opacity: 0.8,
                          }}
                        >
                          Next Prayer
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {isAzanable && azanEnabled && (
                      <span
                        style={{ fontSize: 14, opacity: azanOn ? 0.9 : 0.25 }}
                        title={azanOn ? "Azan on" : "Azan off"}
                      >
                        🔔
                      </span>
                    )}
                    <div
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: isNext ? 700 : 300,
                        fontSize: 18,
                        color: isNext ? theme.gold : theme.textCream,
                      }}
                    >
                      {formatTime(prayerTimes[prayer])}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {permissionState === "granted" && (
          <div
            style={{
              textAlign: "center",
              padding: "16px 0 8px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 200,
              fontSize: 11,
              color: theme.textMuted,
              lineHeight: 1.5,
            }}
          >
            Prayer times calculated using {prayerMethod} method
            {isLayl ? " · " : ""}
            <br />
            Change method in Settings → Prayer Method
          </div>
        )}
      </div>
    </div>
  );
}
