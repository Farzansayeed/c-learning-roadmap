import { create } from 'zustand';
import { loadData, saveData } from '../lib/storage';
import type { AppData, ThemeName } from '../lib/schema';

/**
 * P0 slice: the settings the shell needs (theme).
 * Phase 3 widens this to the full settings surface.
 */
interface SettingsStore {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
}

function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute('data-theme', theme);
}

function initialTheme(): ThemeName {
  const t = loadData().settings.theme;
  applyTheme(t); // html is the single scope — must agree before first paint
  return t;
}

export const useSettings = create<SettingsStore>((set, get) => ({
  theme: initialTheme(),
  setTheme: (t) => {
    applyTheme(t);
    patch((d) => {
      d.settings.theme = t;
    });
    set({ theme: t });
  },
  toggleTheme: () => get().setTheme(get().theme === 'terminal' ? 'blueprint' : 'terminal'),
}));

function patch(fn: (d: AppData) => void): void {
  const d = loadData();
  fn(d);
  saveData(d);
}
