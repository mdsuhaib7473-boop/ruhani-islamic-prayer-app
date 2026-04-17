const JUMMAH_NOTIF_KEY = "ruhani_jummah_notif";
const LAST_JUMMAH_DATE_KEY = "ruhani_jummah_notif_date";

function msUntilFridayNoon(): number {
  const now = new Date();
  const target = new Date(now);

  // getDay(): 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  const currentDay = now.getDay();
  const daysUntilFriday = (5 - currentDay + 7) % 7;

  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(12, 0, 0, 0);

  // If it's Friday but noon already passed, schedule for next Friday
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }

  return target.getTime() - now.getTime();
}

function isFriday(): boolean {
  return new Date().getDay() === 5;
}

function getTodayFridayStr(): string {
  const now = new Date();
  // Friday date string
  const target = new Date(now);
  const daysUntilFriday = (5 - now.getDay() + 7) % 7;
  target.setDate(now.getDate() + daysUntilFriday);
  return target.toDateString();
}

let jummahTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleJummahNotification(): void {
  // Check if enabled
  try {
    const enabled = JSON.parse(
      localStorage.getItem(JUMMAH_NOTIF_KEY) ?? "true",
    ) as boolean;
    if (!enabled) return;
  } catch {
    return;
  }

  // Don't double-fire for the same Friday
  const thisFridayStr = getTodayFridayStr();
  const lastFired = localStorage.getItem(LAST_JUMMAH_DATE_KEY);
  if (lastFired === thisFridayStr && isFriday()) return;

  if (jummahTimer !== null) {
    clearTimeout(jummahTimer);
    jummahTimer = null;
  }

  const delay = msUntilFridayNoon();

  jummahTimer = setTimeout(async () => {
    // Re-check enabled state at fire time
    try {
      const stillEnabled = JSON.parse(
        localStorage.getItem(JUMMAH_NOTIF_KEY) ?? "true",
      ) as boolean;
      if (!stillEnabled) return;
    } catch {
      return;
    }

    // Only fire on Friday
    if (!isFriday()) {
      jummahTimer = null;
      scheduleJummahNotification();
      return;
    }

    // Show browser notification if permission granted
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification("Jummah Mubarak 🕌", {
          body: "It is the blessed day of Jumu'ah. Don't forget to recite Surah Al-Kahf and send blessings upon the Prophet ﷺ",
          icon: "/favicon.ico",
          tag: "ruhani-jummah",
        });
      } catch {}
    }

    // Mark fired for this Friday
    try {
      localStorage.setItem(LAST_JUMMAH_DATE_KEY, new Date().toDateString());
    } catch {}

    // Reschedule for next Friday
    jummahTimer = null;
    scheduleJummahNotification();
  }, delay);
}
