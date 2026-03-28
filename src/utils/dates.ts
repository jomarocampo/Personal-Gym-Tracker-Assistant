import {
  format,
  formatDistanceToNow,
  isToday as fnsIsToday,
  isYesterday,
  startOfWeek,
  endOfWeek,
  differenceInMinutes,
  parseISO,
} from "date-fns";

export function formatWorkoutDate(iso: string): string {
  const date = parseISO(iso);
  if (fnsIsToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEE, MMM d");
}

export function formatFullDate(iso: string): string {
  return format(parseISO(iso), "EEEE, MMMM d, yyyy");
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), "MMM d");
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDurationSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function isToday(iso: string): boolean {
  return fnsIsToday(parseISO(iso));
}

export function getRelativeTime(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function getWeekRange(date: Date = new Date()): [Date, Date] {
  return [
    startOfWeek(date, { weekStartsOn: 1 }),
    endOfWeek(date, { weekStartsOn: 1 }),
  ];
}

export function getDurationMinutes(
  startIso: string,
  endIso: string
): number {
  return differenceInMinutes(parseISO(endIso), parseISO(startIso));
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function nowISO(): string {
  return new Date().toISOString();
}
