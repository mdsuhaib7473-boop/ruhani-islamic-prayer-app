import { useState } from "react";
import {
  type FontSize,
  type Language,
  type PrayerMethod,
  useSettings,
} from "../contexts/SettingsContext";
import { THEMES, type ThemeId, useTheme } from "../contexts/ThemeContext";
import { requestNotificationPermission } from "../utils/duaNotification";
import { scheduleJummahNotification } from "../utils/jummahNotification";

const TARGETS: number[] = [33, 99, 100];

const THEME_META: Array<{
  id: ThemeId;
  arabic: string;
  english: string;
}> = [
  { id: "layl", arabic: "لَيْل", english: "Night" },
  { id: "fajr", arabic: "فَجْر", english: "Dawn" },
  { id: "jannat", arabic: "جَنَّة", english: "Paradise" },
  { id: "noor", arabic: "نُور", english: "Light" },
];

const PRAYER_METHODS: Array<{ id: PrayerMethod; label: string }> = [
  { id: "MWL", label: "MWL" },
  { id: "Hanafi", label: "Hanafi" },
  { id: "Karachi", label: "Karachi" },
  { id: "ISNA", label: "ISNA" },
  { id: "UmmAlQura", label: "Umm Al-Qura" },
];

function Toggle({
  on,
  onToggle,
  ocid,
}: { on: boolean; onToggle: () => void; ocid: string }) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      style={{
        width: 52,
        height: 30,
        borderRadius: 15,
        background: on ? theme.emerald : theme.toggleOff,
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
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: theme.toggleThumb,
          top: 4,
          left: on ? 26 : 4,
          transition: "left 0.3s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }}
      />
    </button>
  );
}

function SectionHeader({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 300,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: theme.gold,
        marginBottom: 8,
        paddingLeft: 4,
      }}
    >
      ✶ {children}
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function SettingRow({
  label,
  subLabel,
  right,
  noBorder,
}: {
  label: string;
  subLabel?: string;
  right: React.ReactNode;
  noBorder?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 16px",
        borderBottom: noBorder ? "none" : `1px solid ${theme.cardBorder}`,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 300,
            fontSize: 15,
            color: theme.textWhite,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        {subLabel && (
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 200,
              fontSize: 11,
              color: theme.textMuted,
            }}
          >
            {subLabel}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

function ThemeSelector() {
  const { theme, themeId, setThemeId } = useTheme();

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionHeader>Themes</SectionHeader>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "16px 8px",
          background: theme.card,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: 16,
        }}
      >
        {THEME_META.map((t) => {
          const isSelected = themeId === t.id;
          const themeColors = THEMES[t.id];
          return (
            <button
              type="button"
              key={t.id}
              data-ocid={`settings.theme.${t.id}.button`}
              onClick={() => setThemeId(t.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: isSelected
                    ? `2.5px solid ${theme.gold}`
                    : `2px solid ${theme.cardBorder}`,
                  boxShadow: isSelected
                    ? `0 0 12px ${themeColors.primary}60`
                    : "none",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "50%",
                    height: "100%",
                    background: themeColors.bg,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "50%",
                    height: "100%",
                    background: themeColors.primary,
                  }}
                />
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: 20,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Amiri', serif",
                    fontSize: 14,
                    color: isSelected ? theme.gold : theme.textCream,
                    direction: "rtl",
                    lineHeight: 1.3,
                    transition: "color 0.3s ease",
                  }}
                >
                  {t.arabic}
                </div>
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 10,
                    color: isSelected ? theme.gold : theme.textMuted,
                    letterSpacing: "0.05em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {t.english}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AboutDisclaimerSection() {
  const { theme } = useTheme();

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: theme.gold,
    marginBottom: 6,
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 300,
    fontSize: 13,
    color: theme.textCream,
    lineHeight: 1.7,
    margin: 0,
  };

  const goldDividerStyle: React.CSSProperties = {
    height: 1,
    border: "none",
    background: `linear-gradient(90deg, transparent, ${theme.gold}55, transparent)`,
    margin: "18px 0",
  };

  const features = [
    "Daily Duas (Morning, Evening, etc.)",
    "Tasbeeh Counter",
    "99 Names of Allah",
    "Prayer Times (based on location)",
  ];

  const disclaimerParagraphs = [
    "All duas and Islamic content in this app are collected from authentic sources such as the Qur'an and Hadith (Sahih, Hasan references where possible). However, there may be minor differences in wording or translation.",
    "Prayer times are calculated based on location and standard calculation methods, and may vary slightly.",
    "Hijri dates are based on calculation and may differ by ±1 day depending on local moon sighting.",
    "Users are advised to verify important religious matters with trusted scholars.",
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionHeader>About &amp; Disclaimer</SectionHeader>
      <GlassCard>
        <div style={{ padding: 20 }}>
          {/* ── About Ruhani ── */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 18,
                color: theme.gold,
                marginBottom: 14,
                textShadow: "0 0 20px rgba(212,168,67,0.4)",
              }}
            >
              About Ruhani
            </div>
            <div style={goldDividerStyle} />
          </div>

          <p style={{ ...bodyStyle, marginBottom: 16 }}>
            Ruhani – Duas &amp; Tasbeeh is a simple Islamic app designed to help
            Muslims stay connected with daily duas, tasbeeh, and remembrance of
            Allah. The app provides authentic supplications with Arabic text,
            transliteration, and meanings for easy understanding.
          </p>

          {/* Features */}
          <div style={{ marginBottom: 4 }}>
            <div style={labelStyle}>Features</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: theme.gold,
                      fontSize: 10,
                      lineHeight: "22px",
                      flexShrink: 0,
                      textShadow: `0 0 8px ${theme.gold}80`,
                    }}
                  >
                    ✦
                  </span>
                  <span
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 300,
                      fontSize: 13,
                      color: theme.textCream,
                      lineHeight: 1.7,
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={goldDividerStyle} />

          {/* ── Disclaimer ── */}
          <div style={{ marginBottom: 0 }}>
            <div style={labelStyle}>Disclaimer</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {disclaimerParagraphs.map((para) => (
                <p key={para.slice(0, 30)} style={bodyStyle}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div style={goldDividerStyle} />

          {/* ── Contact ── */}
          <div style={{ marginBottom: 0 }}>
            <div style={labelStyle}>Contact</div>
            <p style={bodyStyle}>
              <a
                href="mailto:ruhaniapp@gmail.com"
                data-ocid="about.contact.link"
                style={{
                  color: theme.gold,
                  textDecoration: "none",
                  fontWeight: 400,
                  borderBottom: `1px solid ${theme.gold}55`,
                  paddingBottom: 1,
                  transition: "border-color 0.2s ease, opacity 0.2s ease",
                }}
              >
                ruhaniapp@gmail.com
              </a>
            </p>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              height: 1,
              border: "none",
              background: `linear-gradient(90deg, transparent, ${theme.gold}40, transparent)`,
              margin: "20px 0 14px",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 12,
                color: theme.textCream,
                textShadow: `0 0 10px ${theme.gold}50`,
                letterSpacing: "0.03em",
              }}
            >
              Made with ❤️ for the Ummah
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function PrivacyPolicySection() {
  const { theme } = useTheme();

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: theme.gold,
    marginBottom: 6,
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 300,
    fontSize: 13,
    color: theme.textCream,
    lineHeight: 1.7,
    margin: 0,
  };

  const goldDividerStyle: React.CSSProperties = {
    height: 1,
    border: "none",
    background: `linear-gradient(90deg, transparent, ${theme.gold}55, transparent)`,
    margin: "18px 0",
  };

  const collectItems = [
    "Location data (only for accurate Prayer Times)",
    "Basic app usage data (for improving performance)",
    "No sensitive personal data is collected",
  ];

  const useItems = [
    "To provide accurate prayer times based on your location",
    "To improve app performance and user experience",
    "To fix bugs and enhance features",
  ];

  const permissionItems = [
    "Location Permission: Used only to calculate Prayer Times",
    "No unnecessary permissions are requested",
  ];

  const BulletList = ({ items }: { items: string[] }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item) => (
        <div
          key={item}
          style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
        >
          <span
            style={{
              color: theme.gold,
              fontSize: 10,
              lineHeight: "22px",
              flexShrink: 0,
              textShadow: `0 0 8px ${theme.gold}80`,
            }}
          >
            ✦
          </span>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 13,
              color: theme.textCream,
              lineHeight: 1.7,
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionHeader>Privacy Policy</SectionHeader>
      <GlassCard>
        <div style={{ padding: 20 }}>
          {/* Main title */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 18,
                color: theme.gold,
                marginBottom: 14,
                textShadow: "0 0 20px rgba(212,168,67,0.4)",
              }}
            >
              Privacy Policy
            </div>
            <div style={goldDividerStyle} />
          </div>

          {/* Introduction */}
          <p style={{ ...bodyStyle, marginBottom: 16 }}>
            Ruhani – Duas &amp; Tasbeeh respects your privacy and is committed
            to protecting your personal information. This policy explains how we
            collect, use, and safeguard your data.
          </p>

          <div style={goldDividerStyle} />

          {/* Information We Collect */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Information We Collect</div>
            <BulletList items={collectItems} />
          </div>

          <div style={goldDividerStyle} />

          {/* How We Use Information */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>How We Use Information</div>
            <BulletList items={useItems} />
          </div>

          <div style={goldDividerStyle} />

          {/* Permissions */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Permissions</div>
            <BulletList items={permissionItems} />
          </div>

          <div style={goldDividerStyle} />

          {/* Data Sharing */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Data Sharing</div>
            <p style={bodyStyle}>
              We do{" "}
              <strong style={{ color: theme.gold, fontWeight: 700 }}>
                NOT
              </strong>{" "}
              sell, trade, or share your personal data with third parties.
            </p>
          </div>

          <div style={goldDividerStyle} />

          {/* Third-Party Services */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Third-Party Services</div>
            <p style={bodyStyle}>
              The app may use trusted third-party services (such as APIs for
              prayer times), which may collect limited technical data.
            </p>
          </div>

          <div style={goldDividerStyle} />

          {/* Security */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Security</div>
            <p style={bodyStyle}>
              We take reasonable steps to protect your data, but no method is
              100% secure.
            </p>
          </div>

          <div style={goldDividerStyle} />

          {/* Children's Privacy */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Children's Privacy</div>
            <p style={bodyStyle}>
              This app does not knowingly collect data from children under 13.
            </p>
          </div>

          <div style={goldDividerStyle} />

          {/* Changes to Policy */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Changes to Policy</div>
            <p style={bodyStyle}>
              We may update this Privacy Policy from time to time. Changes will
              be reflected on this page.
            </p>
          </div>

          <div style={goldDividerStyle} />

          {/* Contact */}
          <div style={{ marginBottom: 0 }}>
            <div style={labelStyle}>Contact</div>
            <p style={{ ...bodyStyle, marginBottom: 6 }}>
              If you have any questions, contact us at:
            </p>
            <a
              href="mailto:ruhaniapp@gmail.com"
              data-ocid="privacy.contact.link"
              style={{
                color: theme.gold,
                textDecoration: "none",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 400,
                fontSize: 13,
                borderBottom: `1px solid ${theme.gold}55`,
                paddingBottom: 1,
                transition: "border-color 0.2s ease, opacity 0.2s ease",
              }}
            >
              ruhaniapp@gmail.com
            </a>
          </div>

          {/* Footer */}
          <div
            style={{
              height: 1,
              border: "none",
              background: `linear-gradient(90deg, transparent, ${theme.gold}40, transparent)`,
              margin: "20px 0 14px",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 300,
                fontSize: 12,
                color: theme.textMuted,
              }}
            >
              Your privacy matters to us 🤍
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default function SettingsTab() {
  const { theme, themeId } = useTheme();
  const {
    vibrationEnabled,
    setVibrationEnabled,
    soundEnabled,
    setSoundEnabled,
    defaultTarget,
    setDefaultTarget,
    customTarget,
    setCustomTarget,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    prayerMethod,
    setPrayerMethod,
    azanEnabled,
    setAzanEnabled,
    dailyDuaNotif,
    setDailyDuaNotif,
    jummahNotif,
    setJummahNotif,
  } = useSettings();

  const [customInput, setCustomInput] = useState(
    customTarget > 0 && !TARGETS.includes(customTarget)
      ? customTarget.toString()
      : "",
  );

  const headerBackground =
    themeId === "layl"
      ? "linear-gradient(180deg, rgba(4,8,15,0.9) 0%, transparent 100%)"
      : undefined;

  const handleNotifToggle = async (
    setter: (v: boolean) => void,
    currentValue: boolean,
  ) => {
    const newVal = !currentValue;
    if (newVal) {
      // Request permission when enabling
      await requestNotificationPermission();
    }
    setter(newVal);
  };

  const PillButton = ({
    active,
    onClick,
    children,
    ocid,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ocid?: string;
  }) => (
    <button
      type="button"
      data-ocid={ocid ?? "settings.toggle"}
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 10,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: active ? 700 : 300,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: active
          ? `linear-gradient(135deg, ${theme.gold}, ${theme.primary})`
          : theme.card,
        color: active ? "#ffffff" : theme.textCream,
        border: active ? "none" : `1px solid ${theme.cardBorder}`,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: "transparent" }}>
      <div
        className="flex-1 overflow-y-auto"
        style={{
          minHeight: 0,
          padding: "20px 16px 16px",
          background: headerBackground,
        }}
      >
        {/* App branding card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 16px 20px",
            marginBottom: 24,
            background: theme.card,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 20,
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
            style={{ marginBottom: 10 }}
          >
            <path
              d="M24 6 A18 18 0 1 1 6 30 A13 13 0 1 0 24 6Z"
              fill={theme.gold}
            />
          </svg>
          <div
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 14,
              color: theme.textWhite,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Ruhani – Duas &amp; Tasbeeh
          </div>
          <span
            style={{
              background: theme.emerald,
              color: "#ffffff",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              padding: "3px 12px",
              borderRadius: 999,
            }}
          >
            v3.0
          </span>
        </div>

        {/* Theme selector */}
        <ThemeSelector />

        {/* Notifications */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Notifications</SectionHeader>
          <GlassCard>
            <SettingRow
              label="Azan Notifications"
              subLabel="Play Azan sound at prayer times"
              right={
                <Toggle
                  on={azanEnabled}
                  onToggle={() =>
                    handleNotifToggle(setAzanEnabled, azanEnabled)
                  }
                  ocid="settings.switch"
                />
              }
            />
            <SettingRow
              label="Daily Dua Reminder"
              subLabel="Receive a daily dua at 8:00 AM"
              right={
                <Toggle
                  on={dailyDuaNotif}
                  onToggle={() =>
                    handleNotifToggle(setDailyDuaNotif, dailyDuaNotif)
                  }
                  ocid="settings.notif_switch"
                />
              }
            />
            <SettingRow
              label="Jummah Reminder 🕌"
              subLabel="Friday special reminder at 12:00 PM"
              right={
                <Toggle
                  on={jummahNotif}
                  onToggle={async () => {
                    const newVal = !jummahNotif;
                    if (newVal) {
                      await requestNotificationPermission();
                      scheduleJummahNotification();
                    }
                    setJummahNotif(newVal);
                  }}
                  ocid="settings.jummah_switch"
                />
              }
              noBorder
            />
          </GlassCard>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Language</SectionHeader>
          <GlassCard>
            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 200,
                  fontSize: 12,
                  color: theme.textMuted,
                  marginBottom: 12,
                }}
              >
                Dua translation language
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {(["en", "hi", "ur"] as Language[]).map((lang) => (
                  <PillButton
                    key={lang}
                    active={language === lang}
                    onClick={() => setLanguage(lang)}
                    ocid="settings.toggle"
                  >
                    {lang === "en"
                      ? "🇬🇧 English"
                      : lang === "hi"
                        ? "🇮🇳 हिन्दी"
                        : "🇵🇰 اردو"}
                  </PillButton>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Font Size</SectionHeader>
          <GlassCard>
            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 200,
                  fontSize: 12,
                  color: theme.textMuted,
                  marginBottom: 12,
                }}
              >
                App text size
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {(["small", "medium", "large"] as FontSize[]).map((size) => (
                  <PillButton
                    key={size}
                    active={fontSize === size}
                    onClick={() => setFontSize(size)}
                    ocid="settings.toggle"
                  >
                    {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                  </PillButton>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Prayer Method */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Prayer Method</SectionHeader>
          <GlassCard>
            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 200,
                  fontSize: 12,
                  color: theme.textMuted,
                  marginBottom: 12,
                }}
              >
                Calculation method for prayer times
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PRAYER_METHODS.map((m) => (
                  <PillButton
                    key={m.id}
                    active={prayerMethod === m.id}
                    onClick={() => setPrayerMethod(m.id)}
                    ocid="settings.toggle"
                  >
                    {m.label}
                  </PillButton>
                ))}
              </div>
              {prayerMethod === "ISNA" && (
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 200,
                    fontSize: 11,
                    color: theme.textMuted,
                  }}
                >
                  ISNA: North America method (15° Fajr/Isha)
                </div>
              )}
              {prayerMethod === "Hanafi" && (
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 200,
                    fontSize: 11,
                    color: theme.textMuted,
                  }}
                >
                  Hanafi: Uses shadow length x2 for Asr
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Tasbeeh settings */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Tasbeeh Settings</SectionHeader>
          <GlassCard>
            <SettingRow
              label="Vibration"
              subLabel="Haptic feedback on each tap"
              right={
                <Toggle
                  on={vibrationEnabled}
                  onToggle={() => setVibrationEnabled(!vibrationEnabled)}
                  ocid="settings.switch"
                />
              }
            />
            <SettingRow
              label="Sound"
              subLabel="Soft tick on each tap"
              right={
                <Toggle
                  on={soundEnabled}
                  onToggle={() => setSoundEnabled(!soundEnabled)}
                  ocid="settings.switch"
                />
              }
              noBorder
            />
          </GlassCard>
        </div>

        {/* Default target */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Default Target</SectionHeader>
          <GlassCard>
            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 200,
                  fontSize: 12,
                  color: theme.textMuted,
                  marginBottom: 12,
                }}
              >
                Counter target for dhikr sessions
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                {TARGETS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    data-ocid="settings.toggle"
                    onClick={() => {
                      setDefaultTarget(t);
                      setCustomTarget(t);
                      setCustomInput("");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px 0",
                      borderRadius: 12,
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: defaultTarget === t ? 700 : 300,
                      fontSize: 15,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background:
                        defaultTarget === t
                          ? `linear-gradient(135deg, ${theme.gold}, ${theme.primary})`
                          : theme.card,
                      color: defaultTarget === t ? "#ffffff" : theme.textCream,
                      border:
                        defaultTarget === t
                          ? "none"
                          : `1px solid ${theme.cardBorder}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  data-ocid="settings.input"
                  type="number"
                  min="1"
                  max="9999"
                  placeholder="Custom..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onBlur={() => {
                    const n = Number.parseInt(customInput, 10);
                    if (n > 0) {
                      setCustomTarget(n);
                      setDefaultTarget(n);
                    } else if (customInput === "") {
                      setCustomTarget(33);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.textWhite,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 14,
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.gold;
                  }}
                />
                <button
                  type="button"
                  data-ocid="settings.save_button"
                  onClick={() => {
                    const n = Number.parseInt(customInput, 10);
                    if (n > 0) {
                      setCustomTarget(n);
                      setDefaultTarget(n);
                    }
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    background:
                      customInput && Number.parseInt(customInput, 10) > 0
                        ? `linear-gradient(135deg, ${theme.gold}, ${theme.primary})`
                        : theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.textWhite,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Set
                </button>
              </div>
              {customTarget > 0 && !TARGETS.includes(customTarget) && (
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 300,
                    fontSize: 12,
                    color: theme.gold,
                  }}
                >
                  Custom target active: {customTarget}
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* About & Disclaimer */}
        <AboutDisclaimerSection />

        {/* Privacy Policy */}
        <PrivacyPolicySection />

        {/* Bottom blessing */}
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontWeight: 700,
              fontSize: 22,
              color: theme.gold,
              direction: "rtl",
              marginBottom: 8,
            }}
          >
            بَارَكَ اللَّهُ فِيكُم
          </div>
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 13,
              color: theme.textCream,
            }}
          >
            Made with love for the Ummah 🤲
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingBottom: 8 }}>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 200,
              fontSize: 11,
              color: theme.textMuted,
            }}
          >
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.gold }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
