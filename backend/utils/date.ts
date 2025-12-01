// normalize a date string or Date object to midnight UTC (date-only)
export function toDateOnly(d?: string | Date): Date {
  const dt = d ? new Date(d) : new Date();
  // normalize to YYYY-MM-DD 00:00:00 UTC
  const normalized = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  return normalized;
}
