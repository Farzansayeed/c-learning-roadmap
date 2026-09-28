import { create } from 'zustand';
import { buildSchedule, workingDay, type DayEntry } from '../engines/schedule';
import { loadData, saveData } from '../lib/storage';
import { todayKey, type AppData, type Verdict } from '../lib/schema';

function patch(fn: (d: AppData) => void): void {
  const d = loadData();
  fn(d);
  saveData(d);
}

function computeDaily(today: string) {
  const data = loadData();
  const entries = buildSchedule(data, today);
  const entry = workingDay(entries, today);
  const target = new Date(today + 'T00:00:00').getDay() === 0 ? data.settings.sundayTarget : data.settings.weekdayTarget;
  const rec = entry ? data.days[entry.key] : undefined;
  return {
    entries,
    entry: entry ?? null,
    hoursLogged: rec?.hoursLogged ?? 0,
    target,
    verdict: (rec?.verdict ?? null) as Verdict | null,
  };
}

interface DailyStore {
  today: string;
  entry: DayEntry | null;
  hoursLogged: number;
  target: number;
  verdict: Verdict | null;
  addHours: (h: number) => void;
  setHours: (h: number) => void;
  closeDay: (verdict: Verdict) => void;
  /** Tribunal outcome: one atomic patch — postponed map, custom excuse, verdict. */
  postponeDay: (excuseId: string) => void;
  reopenDay: () => void;
  refresh: (today?: string) => void;
}

export const useDaily = create<DailyStore>((set, get) => {
  const today = todayKey();
  const init = computeDaily(today);

  return {
    ...init,
    today,

    addHours: (h) => get().setHours(Math.round((get().hoursLogged + h) * 4) / 4),
    setHours: (h) => {
      const clamped = Math.max(0, Math.min(24, h));
      const key = get().entry?.key;
      if (!key) return;
      patch((d) => {
        if (!d.days[key]) d.days[key] = { key, kind: 'study', itemIds: [], hoursLogged: 0 };
        d.days[key].hoursLogged = clamped;
      });
      set({ hoursLogged: clamped });
    },

    closeDay: (verdict) => {
      const key = get().entry?.key;
      if (!key) return;
      patch((d) => {
        if (!d.days[key]) d.days[key] = { key, kind: 'study', itemIds: [], hoursLogged: 0 };
        d.days[key].verdict = verdict;
        d.days[key].closedAt = new Date().toISOString();
        if (verdict === 'pass') d.xp += 10;
      });
      set({ verdict });
    },

    postponeDay: (excuseId) => {
      const key = get().entry?.key ?? get().today;
      patch((d) => {
        d.postponed[key] = excuseId;
        if (excuseId.startsWith('custom:')) {
          const text = excuseId.slice(7);
          if (text && !d.customExcuses.includes(text)) d.customExcuses.push(text);
        }
        if (!d.days[key]) d.days[key] = { key, kind: 'study', itemIds: [], hoursLogged: 0 };
        d.days[key].verdict = 'postponed';
        d.days[key].closedAt = new Date().toISOString();
      });
      set({ verdict: 'postponed' });
      get().refresh(get().today);
    },

    reopenDay: () => {
      const key = get().entry?.key ?? get().today;
      patch((d) => {
        if (d.days[key]) {
          delete d.days[key].verdict;
          delete d.days[key].closedAt;
        }
        delete d.postponed[key]; // un-postpone the same day it reopened
      });
      set({ verdict: null });
      get().refresh(get().today);
    },

    refresh: (t) => {
      const key = t ?? todayKey();
      set({ today: key, ...computeDaily(key) });
    },
  };
});
