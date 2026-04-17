import { duas as DUAS } from "../data/duas";

const DAILY_DUA_NOTIF_KEY = "ruhani_daily_dua_notif";
const HIGHLIGHT_KEY = "ruhani_highlight_dua";
const LAST_SCHEDULED_KEY = "ruhani_dua_notif_scheduled_date";

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getTodaysDua() {
  const day = getDayOfYear(new Date());
  const index = day % DUAS.length;
  return DUAS[index];
}

function msUntil8AM(): number {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    8,
    0,
    0,
    0,
  );
  // If 8 AM already passed today, schedule for tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

let scheduledTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleDailyDuaNotification(): void {
  // Check if enabled
  try {
    const enabled = JSON.parse(
      localStorage.getItem(DAILY_DUA_NOTIF_KEY) ?? "true",
    ) as boolean;
    if (!enabled) return;
  } catch {
    return;
  }

  // Don't double-schedule for same day
  const todayStr = new Date().toDateString();
  const lastScheduled = localStorage.getItem(LAST_SCHEDULED_KEY);
  if (lastScheduled === todayStr) return;

  if (scheduledTimer !== null) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }

  const delay = msUntil8AM();

  scheduledTimer = setTimeout(async () => {
    // Re-check enabled state at fire time
    try {
      const stillEnabled = JSON.parse(
        localStorage.getItem(DAILY_DUA_NOTIF_KEY) ?? "true",
      ) as boolean;
      if (!stillEnabled) return;
    } catch {
      return;
    }

    const dua = getTodaysDua();
    if (!dua) return;

    // Store highlight key so DuasTab can scroll to it
    try {
      sessionStorage.setItem(HIGHLIGHT_KEY, dua.id.toString());
    } catch {}

    // Show browser notification if permission granted
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      try {
        const snippet =
          dua.arabic.length > 40 ? `${dua.arabic.slice(0, 40)}...` : dua.arabic;
        const n = new Notification(`🤲 ${dua.name}`, {
          body: snippet,
          icon: "/favicon.ico",
          tag: "ruhani-daily-dua",
        });
        n.onclick = () => {
          window.focus();
          try {
            sessionStorage.setItem(HIGHLIGHT_KEY, dua.id.toString());
          } catch {}
        };
      } catch {}
    }

    // Mark scheduled for today
    try {
      localStorage.setItem(LAST_SCHEDULED_KEY, new Date().toDateString());
    } catch {}

    // Reschedule for tomorrow
    scheduledTimer = null;
    scheduleDailyDuaNotification();
  }, delay);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

export function getDailyDua() {
  return getTodaysDua();
}

export function getDuaHighlightId(): number | null {
  try {
    const v = sessionStorage.getItem(HIGHLIGHT_KEY);
    if (v !== null) {
      sessionStorage.removeItem(HIGHLIGHT_KEY);
      return Number.parseInt(v, 10);
    }
  } catch {}
  return null;
}
