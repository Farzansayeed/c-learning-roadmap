/**
 * storage.ts — owns all persistence for The Forge (DESIGN.md §3.3).
 * - debounced writes (U15, 150ms) with flush on pagehide
 * - structural validation on read (corrupt state -> fresh default, never a crash)
 * - export/import round-trip
 * - migration hook point (v2 importer arrives in Phase 8; unknown versions rejected)
 */
import { AppData, STORAGE_KEY, defaultData, isValidAppData } from './schema';

const DEBOUNCE_MS = 150;

let timer: ReturnType<typeof setTimeout> | null = null;
let pending: AppData | null = null;

function writeNow(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full/blocked — state stays in memory, app keeps working
  }
  // Only consume the pending buffer if THIS write was it — a fallback
  // default-write must never cancel an in-flight debounced save.
  if (pending === data) pending = null;
}

/** Debounced save (U15). Multiple calls within the window coalesce. */
export function saveData(data: AppData): void {
  pending = data;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => writeNow(pending as AppData), DEBOUNCE_MS);
}

/** Force any pending write to disk immediately (pagehide, tests, beforeunload). */
export function flushSave(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (pending) writeNow(pending);
}

/**
 * Validated load. Anything wrong -> fresh default (persisted back).
 * Serves the in-flight debounced state when present — it is newer than disk,
 * and reading disk mid-debounce silently reverts the last mutation (the
 * close-day-right-after-postpone class of races).
 */
export function loadData(): AppData {
  if (pending) return pending;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return persistDefault();
    const parsed: unknown = JSON.parse(raw);
    if (isValidAppData(parsed)) return parsed;
    return persistDefault();
  } catch {
    return persistDefault();
  }
}

function persistDefault(): AppData {
  const fresh = defaultData();
  writeNow(fresh);
  return fresh;
}

/** Replace all state (import). Validates before accepting. */
export function importData(json: string): AppData | null {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!isValidAppData(parsed)) return null;
    flushSave();
    writeNow(parsed);
    return parsed;
  } catch {
    return null;
  }
}

export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushSave);
}
