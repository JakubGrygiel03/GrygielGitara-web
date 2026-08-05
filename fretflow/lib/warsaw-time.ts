const WARSAW = "Europe/Warsaw";

/** YYYY-MM-DD in Europe/Warsaw */
export function formatWarsawDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: WARSAW,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getWarsawHour(date: Date = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: WARSAW,
    hour: "2-digit",
    hour12: false,
  }).format(date);
  return Number.parseInt(hour, 10);
}

/** Tomorrow's calendar date (YYYY-MM-DD) in Warsaw. */
export function getWarsawTomorrowDate(now: Date = new Date()): string {
  const today = formatWarsawDate(now);
  const [y, m, d] = today.split("-").map(Number);
  // Noon UTC on abstract calendar day keeps Warsaw date stable across DST edges.
  return formatWarsawDate(new Date(Date.UTC(y, m - 1, d + 1, 12, 0, 0)));
}

/**
 * Reminder window around noon Warsaw.
 * Paired with a daily Vercel cron at 10:00 UTC:
 * - summer (CEST): 12:00 Warsaw
 * - winter (CET): 11:00 Warsaw (closest single daily slot)
 */
export function isWarsawReminderWindow(now: Date = new Date()): boolean {
  const hour = getWarsawHour(now);
  return hour === 11 || hour === 12;
}
