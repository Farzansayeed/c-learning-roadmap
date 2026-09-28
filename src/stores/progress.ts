import { create } from 'zustand';
import { loadData, saveData } from '../lib/storage';
import type { AppData } from '../lib/schema';

interface ProgressStore {
  checkedIds: ReadonlySet<string>;
  toggle: (id: string) => void;
  isChecked: (id: string) => boolean;
}

function patch(fn: (d: AppData) => void): void {
  const d = loadData();
  fn(d);
  saveData(d);
}

export const useProgress = create<ProgressStore>((set, get) => ({
  checkedIds: new Set(Object.keys(loadData().checked).filter((k) => loadData().checked[k])),
  toggle: (id) => {
    const next = new Set(get().checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    patch((d) => {
      d.checked[id] = !d.checked[id];
    });
    set({ checkedIds: next });
  },
  isChecked: (id) => get().checkedIds.has(id),
}));
