const WARSAW = "Europe/Warsaw";

type WarsawParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function getWarsawParts(date: Date): WarsawParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WARSAW,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hour = map.hour === "24" ? 0 : Number(map.hour);

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

/**
 * Parse `<input type="datetime-local">` as Europe/Warsaw wall time
 * (independent of the server machine timezone — important on Vercel UTC).
 */
export function parseWarsawDateTimeLocal(value: string): Date {
  const match = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return new Date(NaN);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? "0");
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);

  // Find UTC instant whose Warsaw wall clock equals the target.
  let utcMs = targetAsUtc;
  for (let i = 0; i < 3; i++) {
    const wall = getWarsawParts(new Date(utcMs));
    const wallAsUtc = Date.UTC(
      wall.year,
      wall.month - 1,
      wall.day,
      wall.hour,
      wall.minute,
      wall.second,
    );
    utcMs += targetAsUtc - wallAsUtc;
  }

  return new Date(utcMs);
}

/** Google Calendar floating stamp in Warsaw: YYYYMMDDTHHMMSS (+ use ctz=Europe/Warsaw). */
export function toGoogleCalendarWarsawStamp(date: Date): string {
  const p = getWarsawParts(date);
  return `${p.year}${pad2(p.month)}${pad2(p.day)}T${pad2(p.hour)}${pad2(p.minute)}${pad2(p.second)}`;
}

export function formatWarsawDateTimePl(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: WARSAW,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function formatWarsawTimePl(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: WARSAW,
    timeStyle: "short",
  }).format(date);
}

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
