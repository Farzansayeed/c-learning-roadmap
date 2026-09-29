import { useState } from 'react';
import { exportData, importData, loadData, saveData } from '../../lib/storage';
import { defaultData, todayKey, type AppData, type RoastIntensity } from '../../lib/schema';
import { importV2 } from '../../lib/v2import';
import { useSettings } from '../../stores/settings';
import { useDaily } from '../../stores/daily';
import { TribunalCard } from '../dread/TribunalCard';

/**
 * Settings — Phase 6 surfaces the full accountability panel: schedule
 * targets, bedtime, the roast dial (decision 2), the tribunal, insurance,
 * pardons, and data export/import (Reset arrives with Phase 7, isolated).
 */

function btn(kind: 'primary' | 'ghost' | 'danger', disabled = false): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '9px 16px',
    borderRadius: 10,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700,
    fontSize: 13,
    font: 'inherit',
    opacity: disabled ? 0.45 : 1,
  };
  if (kind === 'primary')
    return { ...base, border: '1px solid var(--good)', background: 'var(--good-dim)', color: 'var(--good)' };
  if (kind === 'danger')
    return { ...base, border: '1px solid var(--danger)', background: 'var(--danger-dim)', color: 'var(--danger)' };
  return { ...base, border: '1px solid var(--border-strong)', background: 'var(--panel2)', color: 'var(--text)' };
}

const DIALS: { id: RoastIntensity; label: string; note: string }[] = [
  { id: 'mild', label: 'Mild', note: 'roasts cap at tier 2 — firm, never cruel' },
  { id: 'spicy', label: 'Spicy', note: 'roasts cap at tier 4 — the default sharpening' },
  { id: 'nuclear', label: 'Nuclear', note: 'all five tiers. The eldritch speaks.' },
];

function Field({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span className="mono" style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--faint)', textTransform: 'uppercase' }}>
        {label}
      </span>
      {children}
      {note && <span style={{ color: 'var(--faint)', fontSize: 12 }}>{note}</span>}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--panel2)',
  color: 'var(--text)',
  font: 'inherit',
  fontSize: 13,
};

export function SettingsPage() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const refreshDaily = useDaily((s) => s.refresh);
  const [data, setData] = useState<AppData>(() => loadData());
  const [importMsg, setImportMsg] = useState('');

  const patch = (fn: (d: AppData) => void): void => {
    const d = loadData();
    fn(d);
    saveData(d);
    setData({ ...d });
    refreshDaily(todayKey());
    window.dispatchEvent(new CustomEvent('forge:data-changed'));
  };

  const onExport = (): void => {
    const blob = new Blob([exportData(loadData())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-forge-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (file: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      // v4 export first; legacy v2 ledger second (one-way migration).
      const asV4 = importData(text);
      const v2 = asV4 ? null : importV2(text);
      const d = asV4 ?? (v2 ? importData(JSON.stringify(v2.data)) : null);
      if (d) {
        setImportMsg(
          v2
            ? `v2 ledger migrated — ${v2.summary}. Hours, verdicts and XP carried; the old curriculum's checkboxes stay behind.`
            : 'Imported — the ledger continues.',
        );
        setData({ ...d });
        refreshDaily(todayKey());
      } else {
        setImportMsg('Rejected: not a Forge export (v4) or a legacy v2 ledger.');
      }
    };
    reader.readAsText(file);
  };

  const cleanDays = Object.values(data.days).filter((d) => d.verdict === 'pass').length;

  return (
    <div style={{ display: 'grid', gap: 22, maxWidth: 720 }}>
      <header>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px' }}>Settings</h1>
        <p className="mono" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, letterSpacing: 1 }}>
          THE CONTRACT · THE DIAL · THE ESCAPE HATCHES
        </p>
      </header>

      <section aria-label="Schedule" style={{ display: 'grid', gap: 16, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--panel)', padding: '20px 22px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Schedule</h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <Field label="Weekday target (h)">
            <input
              type="number"
              min={0.5}
              max={16}
              step={0.5}
              value={data.settings.weekdayTarget}
              onChange={(e) => patch((d) => (d.settings.weekdayTarget = Math.max(0.5, Number(e.target.value) || 3)))}
              style={inputStyle}
            />
          </Field>
          <Field label="Sunday target (h)">
            <input
              type="number"
              min={0}
              max={16}
              step={0.5}
              value={data.settings.sundayTarget}
              onChange={(e) => patch((d) => (d.settings.sundayTarget = Math.max(0, Number(e.target.value) || 0)))}
              style={inputStyle}
            />
          </Field>
          <Field label="Bedtime" note="past this with the day open → nag, then lockout">
            <input
              type="time"
              value={data.settings.bedtime}
              onChange={(e) => patch((d) => (d.settings.bedtime = e.target.value || '23:30'))}
              style={inputStyle}
            />
          </Field>
          <Field label="Theme">
            <select value={theme} onChange={(e) => setTheme(e.target.value as 'terminal' | 'blueprint')} style={inputStyle}>
              <option value="terminal">Terminal (dark)</option>
              <option value="blueprint">Blueprint (light)</option>
            </select>
          </Field>
        </div>
      </section>

      <section aria-label="Roast intensity" style={{ display: 'grid', gap: 12, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--panel)', padding: '20px 22px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Roast intensity</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DIALS.map((dial) => (
            <button
              key={dial.id}
              type="button"
              onClick={() => patch((d) => (d.settings.roastIntensity = dial.id))}
              style={{
                ...btn(data.settings.roastIntensity === dial.id ? 'primary' : 'ghost'),
                flex: 1,
                minWidth: 120,
              }}
            >
              {dial.label}
            </button>
          ))}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 12.5 }}>
          {DIALS.find((d) => d.id === data.settings.roastIntensity)?.note}
        </p>
      </section>

      <TribunalCard compact />

      <section aria-label="Economy" style={{ display: 'grid', gap: 10, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--panel)', padding: '20px 22px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Economy</h2>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 13 }}>
            🛡 <strong>{data.pardons}</strong> pardon{data.pardons === 1 ? '' : 's'}{' '}
            <span style={{ color: 'var(--faint)' }}>(1 per 10 clean days — erases a fail's roast)</span>
          </span>
          <span style={{ fontSize: 13 }}>
            💤 <strong>{data.insurance}</strong> insurance token{data.insurance === 1 ? '' : 's'}{' '}
            <span style={{ color: 'var(--faint)' }}>(protects a streak from one bad day)</span>
          </span>
          {cleanDays % 10 !== 9 && (
            <span className="mono" style={{ fontSize: 11, color: 'var(--faint)' }}>
              {10 - (cleanDays % 10)} clean days to the next pardon
            </span>
          )}
        </div>
      </section>

      <section aria-label="Data" style={{ display: 'grid', gap: 12, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--panel)', padding: '20px 22px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Data</h2>
        <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6 }}>
          Everything lives in this browser (localStorage, schema v4). Export before clearing
          browser data; imports replace current state. A legacy v2 export
          (<span className="mono">c-learning-roadmap-v1</span>) is also accepted and migrated.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" style={btn('ghost')} onClick={onExport}>
            ⬇ Export JSON
          </button>
          <label style={{ ...btn('ghost'), display: 'inline-flex', alignItems: 'center' }}>
            ⬆ Import JSON
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
                e.target.value = '';
              }}
            />
          </label>
          {importMsg && <span style={{ fontSize: 12.5, color: 'var(--info)' }}>{importMsg}</span>}
        </div>
      </section>

      <p className="mono" style={{ fontSize: 10.5, color: 'var(--faint)', letterSpacing: 1 }}>
        default state: {defaultData().settings.weekdayTarget}h weekdays · {defaultData().settings.sundayTarget}h sundays · bedtime{' '}
        {defaultData().settings.bedtime} — but you changed that, didn't you
      </p>
    </div>
  );
}
