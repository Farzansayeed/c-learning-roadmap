/** '2026-09-29' -> 'Tuesday, Sep 29' (locale-aware). */
export function dateLabel(key: string): string {
  return new Date(key + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/** 3 -> '3h', 6.5 -> '6h 30m', 0.5 -> '30m' */
export function fmtHM(h: number): string {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  if (mm === 0) return `${hh}h`;
  if (hh === 0) return `${mm}m`;
  return `${hh}h ${mm}m`;
}

/** 2.5 -> '2.5', 3 -> '3' — trims trailing zeros for the numeric readout. */
export function fmtHours(h: number): string {
  return String(parseFloat(h.toFixed(2)));
}
