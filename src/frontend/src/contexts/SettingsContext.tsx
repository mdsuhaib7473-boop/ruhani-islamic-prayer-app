import { type ReactNode, createContext, useContext, useState } from "react";

export type Language = "en" | "hi" | "ur";
export type FontSize = "small" | "medium" | "large";
export type PrayerMethod = "MWL" | "Hanafi" | "Karachi" | "ISNA" | "UmmAlQura";

interface SettingsContextValue {
  vibrationEnabled: boolean;
  setVibrationEnabled: (v: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  defaultTarget: number;
  setDefaultTarget: (v: number) => void;
  customTarget: number;
  setCustomTarget: (v: number) => void;
  language: Language;
  setLanguage: (v: Language) => void;
  fontSize: FontSize;
  setFontSize: (v: FontSize) => void;
  prayerMethod: PrayerMethod;
  setPrayerMethod: (v: PrayerMethod) => void;
  azanEnabled: boolean;
  setAzanEnabled: (v: boolean) => void;
  dailyDuaNotif: boolean;
  setDailyDuaNotif: (v: boolean) => void;
  jummahNotif: boolean;
  setJummahNotif: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function getLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [vibrationEnabled, setVibrationEnabledState] = useState<boolean>(() =>
    getLS("ruhani_vibration", true),
  );
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() =>
    getLS("ruhani_sound", false),
  );
  const [defaultTarget, setDefaultTargetState] = useState<number>(() => {
    const saved = getLS<number>("ruhani_defaultTarget", 33);
    return typeof saved === "number" && saved > 0 ? saved : 33;
  });
  const [customTarget, setCustomTargetState] = useState<number>(() => {
    const saved = getLS<number>("ruhani_customTarget", 33);
    return typeof saved === "number" && saved > 0 ? saved : 33;
  });
  const [language, setLanguageState] = useState<Language>(() =>
    getLS("ruhani_language", "en"),
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(() =>
    getLS("ruhani_fontSize", "medium"),
  );
  const [prayerMethod, setPrayerMethodState] = useState<PrayerMethod>(() =>
    getLS("ruhani_prayerMethod", "MWL"),
  );
  const [azanEnabled, setAzanEnabledState] = useState<boolean>(() =>
    getLS("ruhani_azan_enabled", true),
  );
  const [dailyDuaNotif, setDailyDuaNotifState] = useState<boolean>(() =>
    getLS("ruhani_daily_dua_notif", true),
  );
  const [jummahNotif, setJummahNotifState] = useState<boolean>(() =>
    getLS("ruhani_jummah_notif", true),
  );

  const setVibrationEnabled = (v: boolean) => {
    setVibrationEnabledState(v);
    localStorage.setItem("ruhani_vibration", JSON.stringify(v));
  };
  const setSoundEnabled = (v: boolean) => {
    setSoundEnabledState(v);
    localStorage.setItem("ruhani_sound", JSON.stringify(v));
  };
  const setDefaultTarget = (v: number) => {
    setDefaultTargetState(v);
    localStorage.setItem("ruhani_defaultTarget", JSON.stringify(v));
  };
  const setCustomTarget = (v: number) => {
    setCustomTargetState(v);
    localStorage.setItem("ruhani_customTarget", JSON.stringify(v));
  };
  const setLanguage = (v: Language) => {
    setLanguageState(v);
    localStorage.setItem("ruhani_language", JSON.stringify(v));
  };
  const setFontSize = (v: FontSize) => {
    setFontSizeState(v);
    localStorage.setItem("ruhani_fontSize", JSON.stringify(v));
  };
  const setPrayerMethod = (v: PrayerMethod) => {
    setPrayerMethodState(v);
    localStorage.setItem("ruhani_prayerMethod", JSON.stringify(v));
  };
  const setAzanEnabled = (v: boolean) => {
    setAzanEnabledState(v);
    localStorage.setItem("ruhani_azan_enabled", JSON.stringify(v));
  };
  const setDailyDuaNotif = (v: boolean) => {
    setDailyDuaNotifState(v);
    localStorage.setItem("ruhani_daily_dua_notif", JSON.stringify(v));
  };
  const setJummahNotif = (v: boolean) => {
    setJummahNotifState(v);
    localStorage.setItem("ruhani_jummah_notif", JSON.stringify(v));
  };

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
