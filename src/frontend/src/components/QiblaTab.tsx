import { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

// ─── Kaaba coordinates (Makkah al-Mukarramah) ────────────────────────────────
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

// ─── Great-circle bearing formula ────────────────────────────────────────────
function qiblaBearing(userLat: number, userLng: number): number {
  const meccaLat = (KAABA_LAT * Math.PI) / 180;
  const meccaLng = (KAABA_LNG * Math.PI) / 180;
  const uLat = (userLat * Math.PI) / 180;
  const dLng = meccaLng - (userLng * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(meccaLat);
  const x =
    Math.cos(uLat) * Math.sin(meccaLat) -
    Math.sin(uLat) * Math.cos(meccaLat) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Simplified magnetic declination approximation (World Magnetic Model) ────
// Acceptable accuracy for a mobile compass app (±1–2° typical error)
function getMagneticDeclination(lat: number, lng: number): number {
  return -0.00319 * lng + 0.00552 * lat + -0.0000143 * lat * lng;
}

// ─── Exponential smoothing with wrap-around handling ─────────────────────────
function smoothAngle(prev: number, next: number, alpha: number): number {
  let diff = next - prev;
  // Handle wrap-around
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (prev + alpha * diff + 360) % 360;
}

// ─── Kaaba SVG icon (28×28px, centered at 0,0) ────────────────────────────────
function KaabaSVGIcon() {
  return (
    <g>
      {/* Main cube body */}
      <rect
        x="-12"
        y="-13"
        width="24"
        height="22"
        rx="2"
        fill="#1a1a2e"
        stroke="#d4a843"
        strokeWidth="0.8"
      />
      {/* Kiswa gold band (lower half) */}
      <rect
        x="-12"
        y="-1"
        width="24"
        height="7"
        rx="0"
        fill="#d4a843"
        opacity="0.85"
      />
      {/* Gold door at center-bottom */}
      <rect
        x="-4"
        y="3"
        width="8"
        height="6"
        rx="1"
        fill="#c9a84c"
        stroke="#f0c84a"
        strokeWidth="0.5"
      />
      {/* Door arch top line */}
      <line x1="-4" y1="3" x2="4" y2="3" stroke="#f0c84a" strokeWidth="0.8" />
      {/* Top gold trim line */}
      <rect
        x="-12"
        y="-13"
        width="24"
        height="2"
        rx="1"
        fill="#d4a843"
        opacity="0.6"
      />
    </g>
  );
}

// ─── Error reason type ────────────────────────────────────────────────────────
type GeoErrorReason = "denied" | "unavailable" | "timeout" | null;

export default function QiblaTab() {
  const { theme } = useTheme();

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [permissionState, setPermissionState] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");
  const [geoErrorReason, setGeoErrorReason] = useState<GeoErrorReason>(null);

  // Smoothed true-north heading (declination applied)
  const [trueNorthHeading, setTrueNorthHeading] = useState<number | null>(null);
  const [hasCompass, setHasCompass] = useState<boolean | null>(null);
  const [qiblaFound, setQiblaFound] = useState(false);

  const prevHeadingRef = useRef<number | null>(null);
  const wasFoundRef = useRef(false);
  const orientationRef = useRef<((e: DeviceOrientationEvent) => void) | null>(
    null,
  );
  const userCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Derived values
  const bearing = coords ? qiblaBearing(coords.lat, coords.lng) : null;
  const distance = coords
    ? haversineDistance(coords.lat, coords.lng, KAABA_LAT, KAABA_LNG)
    : null;

  // needleRotation: how many degrees to rotate the needle/arrow so it visually points to Qibla
  // bearing is from North; trueNorthHeading is the phone's heading from North
  // rotating the needle by (bearing - trueNorthHeading) keeps the arrow aimed at Mecca
  const needleRotation =
    bearing !== null && trueNorthHeading !== null
      ? (bearing - trueNorthHeading + 360) % 360
      : (bearing ?? 0);

  // ── "Facing Qibla" detection ─────────────────────────────────────────────
  useEffect(() => {
    if (bearing === null || trueNorthHeading === null || hasCompass !== true)
      return;
    const norm = ((needleRotation % 360) + 360) % 360;
    const aligned = norm <= 5 || norm >= 355;
    setQiblaFound(aligned);
    if (aligned && !wasFoundRef.current) {
      if (navigator.vibrate) navigator.vibrate(200);
    }
    wasFoundRef.current = aligned;
  }, [trueNorthHeading, bearing, hasCompass, needleRotation]);

  // ── Geolocation request ──────────────────────────────────────────────────
  const requestLocation = () => {
    setPermissionState("loading");
    setGeoErrorReason(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        userCoordsRef.current = { lat, lng };
        setPermissionState("granted");
        requestCompass(lat, lng);
      },
      (err) => {
        setPermissionState("denied");
        if (err.code === err.PERMISSION_DENIED) {
          setGeoErrorReason("denied");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoErrorReason("unavailable");
        } else {
          setGeoErrorReason("timeout");
        }
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  // ── Compass / DeviceOrientation ──────────────────────────────────────────
  const requestCompass = (lat: number, lng: number) => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DOE.requestPermission === "function"
    ) {
      DOE.requestPermission()
        .then((state: string) => {
          if (state === "granted") listenToOrientation(lat, lng);
          else setHasCompass(false);
        })
        .catch(() => setHasCompass(false));
    } else if (typeof DeviceOrientationEvent !== "undefined") {
      listenToOrientation(lat, lng);
    } else {
      setHasCompass(false);
    }
  };

  const listenToOrientation = (lat: number, lng: number) => {
    let received = false;
    const declination = getMagneticDeclination(lat, lng);

    const handler = (e: DeviceOrientationEvent) => {
      if (!received) {
        received = true;
        setHasCompass(true);
      }

      const raw =
        (e as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading ??
        (e.alpha !== null ? (360 - e.alpha) % 360 : null);

      if (raw === null) return;

      // Apply magnetic declination to get true-north heading
      const trueRaw = (raw + declination + 360) % 360;

      // Exponential smoothing (α = 0.15 → new reading weight)
      setTrueNorthHeading((prev) => {
        if (prev === null) {
          prevHeadingRef.current = trueRaw;
          return trueRaw;
        }
        const smoothed = smoothAngle(prev, trueRaw, 0.15);
        prevHeadingRef.current = smoothed;
        return smoothed;
      });
    };

    orientationRef.current = handler;
    window.addEventListener("deviceorientation", handler, true);

    setTimeout(() => {
      if (!received) setHasCompass(false);
    }, 2000);
  };

  // ── Cleanup orientation listener ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (orientationRef.current)
        window.removeEventListener(
          "deviceorientation",
          orientationRef.current,
          true,
        );
    };
  }, []);

  // ─── Shared card style ────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: theme.card,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 16,
    backdropFilter: "blur(12px)",
  };

  // ─── Compass SVG content: glowing Qibla arrow + Kaaba icon ───────────────
  // These are rendered INSIDE the rotating group so they stay fixed at Qibla bearing
  const renderQiblaArrow = (b: number) => {
    const cx = 130;
    const cy = 130;
    const lineRadius = 88;
    const iconRadius = 95;

    const bRad = (b * Math.PI) / 180;
    const lineTipX = cx + lineRadius * Math.sin(bRad);
    const lineTipY = cy - lineRadius * Math.cos(bRad);
    const iconX = cx + iconRadius * Math.sin(bRad);
    const iconY = cy - iconRadius * Math.cos(bRad);

    const arrowSize = 6;
    const perpX = -Math.cos(bRad);
    const perpY = Math.sin(bRad);
    const ax1 = lineTipX + arrowSize * perpX - arrowSize * Math.sin(bRad);
    const ay1 = lineTipY + arrowSize * perpY + arrowSize * Math.cos(bRad);
    const ax2 = lineTipX - arrowSize * perpX - arrowSize * Math.sin(bRad);
    const ay2 = lineTipY - arrowSize * perpY + arrowSize * Math.cos(bRad);

    return (
      <>
        {/* Glowing Qibla line */}
        <line
          x1={cx}
          y1={cy}
          x2={lineTipX}
          y2={lineTipY}
          stroke="#d4a843"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter:
              "drop-shadow(0 0 6px #d4a843) drop-shadow(0 0 12px #f0c84a88)",
          }}
        />
        {/* Arrowhead */}
        <polygon
          points={`${lineTipX},${lineTipY} ${ax1},${ay1} ${ax2},${ay2}`}
          fill="#d4a843"
          style={{ filter: "drop-shadow(0 0 4px #d4a843)" }}
        />
        {/* Kaaba icon at bearing on rim */}
        <g
          transform={`translate(${iconX}, ${iconY})`}
          style={{ filter: "drop-shadow(0 0 4px #d4a84388)" }}
        >
          <KaabaSVGIcon />
        </g>
      </>
    );
  };

  // ─── Error message helper ─────────────────────────────────────────────────
  const geoErrorMessage = () => {
    switch (geoErrorReason) {
      case "denied":
        return (
          <>
            <strong
              style={{ color: "#f0c84a", display: "block", marginBottom: 6 }}
            >
              Location access was denied.
            </strong>
            Please enable location permissions in your browser or device
            settings, then tap "Request Permission" again.
            <br />
            <span
              style={{
                fontSize: 11,
                opacity: 0.7,
                marginTop: 6,
                display: "block",
              }}
            >
              On iOS: Settings → Safari → Location → Allow.
              <br />
              On Android: Settings → Apps → Browser → Permissions → Location →
              Allow.
            </span>
          </>
        );
      case "unavailable":
        return "Location unavailable. Please check your GPS signal and try again.";
      case "timeout":
        return "Location request timed out. Make sure GPS is enabled and try again.";
      default:
        return "Could not get your location. Please try again.";
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "transparent" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
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
          اتَّجَاهُ الْقِبْلَة
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
          QIBLA DIRECTION
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px 16px",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── IDLE ───────────────────────────────────────────────────────────── */}
        {permissionState === "idle" && (
          <div
            data-ocid="qibla.card"
            style={{
              ...cardStyle,
              padding: "40px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 56 }}>🧭</div>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 16,
                color: theme.textWhite,
              }}
            >
              Qibla Finder
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
              Allow location access to find the direction of the Ka'bah in Mecca
            </div>
            <button
              type="button"
              data-ocid="qibla.primary_button"
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
              📍 Request Permission &amp; Find Qibla
            </button>
          </div>
        )}

        {/* ── LOADING ─────────────────────────────────────────────────────────── */}
        {permissionState === "loading" && (
          <div
            data-ocid="qibla.loading_state"
            style={{
              ...cardStyle,
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              width: "100%",
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
              Getting your location…
            </div>
          </div>
        )}

        {/* ── DENIED / ERROR ───────────────────────────────────────────────────── */}
        {permissionState === "denied" && (
          <div
            data-ocid="qibla.error_state"
            style={{
              ...cardStyle,
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              textAlign: "center",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 40 }}>
              {geoErrorReason === "denied" ? "🚫" : "📡"}
            </div>
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 400,
                fontSize: 13,
                color: theme.textWhite,
                lineHeight: 1.65,
                maxWidth: 300,
              }}
            >
              {geoErrorMessage()}
            </div>
            <button
              type="button"
              data-ocid="qibla.secondary_button"
              onClick={requestLocation}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${theme.gold}22, ${theme.gold}11)`,
                border: `1px solid ${theme.gold}`,
                color: theme.gold,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: `0 2px 10px ${theme.gold}22`,
              }}
            >
              📍 Request Permission Again
            </button>
          </div>
        )}

        {/* ── GRANTED ─────────────────────────────────────────────────────────── */}
        {permissionState === "granted" && bearing !== null && (
          <>
            {/* Compass container */}
            <div
              data-ocid="qibla.canvas_target"
              style={{
                position: "relative",
                width: 260,
                height: 260,
                marginBottom: 12,
                flexShrink: 0,
              }}
            >
              {/* Outer static ring: background, tick marks, cardinal labels */}
              <svg
                width="260"
                height="260"
                viewBox="0 0 260 260"
                style={{ position: "absolute", top: 0, left: 0 }}
                aria-hidden="true"
              >
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  fill={theme.card}
                  stroke={theme.cardBorder}
                  strokeWidth="1"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="118"
                  fill="none"
                  stroke={theme.gold}
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                {/* Cardinal labels — static, always correct orientation */}
                {(
                  [
                    ["N", 130, 22],
                    ["S", 130, 245],
                    ["E", 242, 135],
                    ["W", 18, 135],
                  ] as [string, number, number][]
                ).map(([label, x, y]) => (
                  <text
                    key={label}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="14"
                    fontFamily="'Nunito', sans-serif"
                    fontWeight="600"
                    fill={label === "N" ? theme.primary : theme.textMuted}
                  >
                    {label}
                  </text>
                ))}
                {/* Tick marks — static */}
                {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
                  const rad = ((deg - 90) * Math.PI) / 180;
                  const isMajor = deg % 90 === 0;
                  return (
                    <line
                      key={deg}
                      x1={130 + 105 * Math.cos(rad)}
                      y1={130 + 105 * Math.sin(rad)}
                      x2={130 + (isMajor ? 93 : 98) * Math.cos(rad)}
                      y2={130 + (isMajor ? 93 : 98) * Math.sin(rad)}
                      stroke={theme.textMuted}
                      strokeWidth={isMajor ? 1.5 : 0.8}
                      opacity={0.5}
                    />
                  );
                })}
                {/* Center pivot */}
                <circle
                  cx="130"
                  cy="130"
                  r="5"
                  fill={theme.gold}
                  opacity="0.9"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="2.5"
                  fill={theme.isLight ? "#fff" : "#0a0a18"}
                />
              </svg>

              {/* Rotating layer — spins by needleRotation so arrow always aims at Qibla */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 260,
                  height: 260,
                  transform: `rotate(${needleRotation}deg)`,
                  transformOrigin: "130px 130px",
                  transition: hasCompass ? "transform 0.25s ease-out" : "none",
                }}
              >
                <svg
                  width="260"
                  height="260"
                  viewBox="0 0 260 260"
                  role="img"
                  aria-label="Qibla compass needle"
                >
                  {/* The Qibla arrow + Kaaba icon are rendered at bearing=0 (straight up)
                      because the entire group is already rotated to needleRotation degrees */}
                  {renderQiblaArrow(0)}

                  {/* North indicator — rotates with needle (shows current phone-north) */}
                  <polygon
                    points="130,14 134,26 130,22 126,26"
                    fill={theme.primary}
                    opacity="0.9"
                  />
                  <polygon
                    points="130,246 134,234 130,238 126,234"
                    fill={theme.textMuted}
                    opacity="0.35"
                  />
                </svg>
              </div>
            </div>

            {/* ── Calibration message ──────────────────────────────────────────── */}
            {hasCompass === true && !qiblaFound && (
              <div
                data-ocid="qibla.calibration_hint"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: `${theme.gold}0d`,
                  border: `1px solid ${theme.gold}33`,
                }}
              >
                <span style={{ fontSize: 13, lineHeight: 1 }}>ℹ️</span>
                <span
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: 12,
                    color: "#c9a84c",
                    letterSpacing: "0.02em",
                  }}
                >
                  Move your phone in figure-8 motion for accuracy
                </span>
              </div>
            )}

            {/* ── Qibla Found banner ───────────────────────────────────────────── */}
            <div
              data-ocid="qibla.found_state"
              style={{
                height: 44,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {hasCompass === true && (
                <div
                  style={{
                    opacity: qiblaFound ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 22px",
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${theme.gold}22, ${theme.gold}11)`,
                    border: `1px solid ${theme.gold}66`,
                    boxShadow: qiblaFound
                      ? `0 0 18px ${theme.gold}55, 0 0 36px ${theme.gold}22`
                      : "none",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🕋</span>
                  <span
                    style={{
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: 13,
                      color: "#f0c84a",
                      letterSpacing: "0.1em",
                      textShadow: "0 0 8px #f0c84a99, 0 0 20px #d4a84366",
                    }}
                  >
                    ✦ Facing Qibla ✓
                  </span>
                </div>
              )}
            </div>

            {/* ── Info card ─────────────────────────────────────────────────────── */}
            <div
              style={{
                ...cardStyle,
                padding: "20px",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Amiri', serif",
                  fontWeight: 700,
                  fontSize: 28,
                  color: theme.gold,
                  marginBottom: 4,
                }}
              >
                {bearing.toFixed(1)}°
              </div>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 300,
                  fontSize: 13,
                  color: theme.textCream,
                  marginBottom: 8,
                }}
              >
                Qibla Direction from your location
              </div>

              {distance !== null && (
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 12,
                    color: theme.textMuted,
                  }}
                >
                  🕋 Distance to Mecca:{" "}
                  {distance < 1000
                    ? `${Math.round(distance)} km`
                    : `${(distance / 1000).toFixed(1)}k km`}
                </div>
              )}

              {/* Fallback: no compass */}
              {hasCompass === false && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    background: `${theme.gold}11`,
                    border: `1px solid ${theme.gold}33`,
                    borderRadius: 8,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    color: theme.textCream,
                    lineHeight: 1.6,
                  }}
                >
                  ⚠️ Live compass not available. Showing static Qibla direction
                  based on your location. Face{" "}
                  <strong>{bearing.toFixed(0)}°</strong> clockwise from North.
                </div>
              )}

              {/* Live compass active status */}
              {hasCompass === true && (
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    color: theme.emerald,
                  }}
                >
                  ✅ Live compass active · True North corrected
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
