import { useMemo, useState } from 'react';
import { shuffled } from '../../engines/quiz';
import type {
  FillBlankItem,
  FindBugItem,
  FixCodeItem,
  MatchItem,
  McqItem,
  OrderingItem,
  PredictOutputItem,
  QuizItem,
  WhyCrashItem,
} from '../../data/quizzes/types';
import { Explain, btn, codeStyle } from './shared';

/**
 * Eight renderers, one per format (PHASES Phase 4). Each is controlled:
 * (value, onChange) from the runner. After `graded`, each shows its own
 * verdict + explanation. Deterministic option shuffles where it matters.
 */

interface RendererProps {
  item: QuizItem;
  value: unknown;
  onChange: (v: unknown) => void;
  graded: boolean;
  correct: boolean;
}

function VerdictLine({ correct }: { correct: boolean }) {
  return (
    <div
      className="mono"
      style={{
        marginTop: 12,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1,
        color: correct ? 'var(--good)' : 'var(--danger)',
      }}
    >
      {correct ? '✓ CORRECT' : '✖ MISSED'}
    </div>
  );
}

function OptionButton({
  label,
  selected,
  state,
  onClick,
}: {
  label: string;
  selected: boolean;
  state: 'idle' | 'right' | 'wrong';
  onClick: () => void;
}) {
  const border =
    state === 'right' ? 'var(--good)' : state === 'wrong' ? 'var(--danger)' : selected ? 'var(--info)' : 'var(--border-strong)';
  const bg =
    state === 'right' ? 'var(--good-dim)' : state === 'wrong' ? 'var(--danger-dim)' : selected ? 'var(--info-dim)' : 'var(--panel2)';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '11px 15px',
        borderRadius: 10,
        border: `1px solid ${border}`,
        background: bg,
        color: 'var(--text)',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 13.5,
        lineHeight: 1.5,
      }}
    >
      {label}
    </button>
  );
}

/* ── mcq / why-crash (same shape) ───────────────────────────── */

function McqRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as McqItem | WhyCrashItem;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {it.options.map((opt, i) => {
          const selected = value === i;
          const state = graded ? (i === it.answer ? 'right' : selected ? 'wrong' : 'idle') : 'idle';
          return (
            <OptionButton
              key={i}
              label={`${String.fromCharCode(65 + i)}.  ${opt}`}
              selected={selected}
              state={state as 'idle' | 'right' | 'wrong'}
              onClick={() => !graded && onChange(i)}
            />
          );
        })}
      </div>
      {graded && (
        <>
          <VerdictLine correct={correct} />
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

/* ── find-bug: click a line ─────────────────────────────────── */

function FindBugRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as FindBugItem;
  const lines = it.code.split('\n');
  const picked = typeof value === 'number' ? value : null;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <div style={{ ...codeStyle, padding: 0, overflow: 'hidden' }} role="listbox" aria-label="Code lines — pick the buggy one">
        {lines.map((ln, i) => {
          const n = i + 1;
          const isPicked = picked === n;
          const isAnswer = graded && n === it.answerLine;
          const bg = isAnswer ? 'var(--danger-dim)' : isPicked ? 'var(--info-dim)' : 'transparent';
          const border = isAnswer ? 'var(--danger)' : isPicked ? 'var(--info)' : 'transparent';
          return (
            <div
              key={i}
              role="option"
              aria-selected={isPicked}
              tabIndex={0}
              onClick={() => !graded && onChange(n)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !graded) {
                  e.preventDefault();
                  onChange(n);
                }
              }}
              style={{
                display: 'flex',
                gap: 14,
                padding: '1px 14px',
                background: bg,
                borderLeft: `3px solid ${border}`,
                cursor: graded ? 'default' : 'pointer',
                outline: 'none',
              }}
            >
              <span className="mono" style={{ color: 'var(--faint)', userSelect: 'none', minWidth: 18, textAlign: 'right' }}>
                {n}
              </span>
              <span className="mono" style={{ whiteSpace: 'pre-wrap' }}>
                {ln || ' '}
              </span>
            </div>
          );
        })}
      </div>
      {graded && (
        <>
          <VerdictLine correct={correct} />
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

/* ── predict-output: text input ─────────────────────────────── */

function PredictRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as PredictOutputItem;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <pre style={codeStyle}>{it.code}</pre>
      <input
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={graded}
        placeholder="exact stdout…"
        aria-label="Predicted output"
        style={{
          marginTop: 14,
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: `1px solid ${graded ? (correct ? 'var(--good)' : 'var(--danger)') : 'var(--border-strong)'}`,
          background: 'var(--panel2)',
          color: 'var(--text)',
          font: 'inherit',
          fontFamily: "'JetBrains Mono', ui-monospace, Consolas, monospace",
          fontSize: 13,
        }}
      />
      {graded && (
        <>
          <VerdictLine correct={correct} />
          {!correct && (
            <div className="mono" style={{ marginTop: 8, fontSize: 12, color: 'var(--good)' }}>
              expected: {it.answer}
            </div>
          )}
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

/* ── fill-blank: one input per ___ ──────────────────────────── */

function FillBlankRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as FillBlankItem;
  const blanks = it.answers.length;
  const vals = (Array.isArray(value) ? value : []) as string[];
  const segments = it.code.split('___');
  const setVal = (i: number, v: string): void => {
    const next = [...vals];
    next[i] = v;
    onChange(next);
  };
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <pre style={codeStyle}>
        {segments.map((seg, i) => (
          <span key={i}>
            {seg}
            {i < blanks && (
              <input
                value={vals[i] ?? ''}
                onChange={(e) => setVal(i, e.target.value)}
                disabled={graded}
                aria-label={`Blank ${i + 1}`}
                size={Math.max(6, (it.answers[i]?.[0]?.length ?? 6) + 2)}
                style={{
                  background: graded
                    ? it.answers[i].some((a) => (vals[i] ?? '').trim().toLowerCase() === a.toLowerCase())
                      ? 'var(--good-dim)'
                      : 'var(--danger-dim)'
                    : 'var(--bg)',
                  border: `1px solid ${graded ? 'var(--border-strong)' : 'var(--info)'}`,
                  borderRadius: 6,
                  color: 'var(--text)',
                  font: 'inherit',
                  fontSize: 12,
                  padding: '2px 6px',
                  textAlign: 'center',
                }}
              />
            )}
          </span>
        ))}
      </pre>
      {graded && (
        <>
          <VerdictLine correct={correct} />
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

/* ── match: left column → pick right ────────────────────────── */

function MatchRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as MatchItem;
  // stable shuffled right column (seed from item id)
  const seed = useMemo(() => [...it.id].reduce((a, c) => a + c.charCodeAt(0), 7), [it.id]);
  const rights = useMemo(() => {
    const arr = it.pairs.map((p, i) => ({ text: p.right, origin: i }));
    return shuffled(arr, seed);
  }, [it, seed]);
  const assign = (typeof value === 'object' && value !== null ? value : {}) as Record<number, number>;
  const usedRights = new Set(Object.values(assign));

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {it.pairs.map((p, li) => {
          const chosen = assign[li];
          const ok = graded && chosen === li;
          const bad = graded && chosen !== undefined && chosen !== li;
          return (
            <div
              key={li}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                flexWrap: 'wrap',
                border: `1px solid ${graded ? (ok ? 'var(--good)' : bad ? 'var(--danger)' : 'var(--border)') : 'var(--border)'}`,
                borderRadius: 10,
                padding: '9px 13px',
                background: graded && ok ? 'var(--good-dim)' : graded && bad ? 'var(--danger-dim)' : 'var(--panel)',
              }}
            >
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, minWidth: 170 }}>
                {p.left}
              </span>
              <span style={{ color: 'var(--faint)' }}>→</span>
              <select
                value={chosen ?? ''}
                disabled={graded}
                aria-label={`Match for ${p.left}`}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : Number(e.target.value);
                  const next = { ...assign };
                  if (v === undefined) delete next[li];
                  else next[li] = v;
                  onChange(next);
                }}
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--panel2)',
                  color: 'var(--text)',
                  font: 'inherit',
                  fontSize: 13,
                }}
              >
                <option value="">— pick —</option>
                {rights.map((r) => (
                  <option key={r.origin} value={r.origin} disabled={usedRights.has(r.origin) && chosen !== r.origin}>
                    {r.text}
                  </option>
                ))}
              </select>
              {graded && !ok && (
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--good)' }}>
                  was: {it.pairs[li].right}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {graded && (
        <>
          <VerdictLine correct={correct} />
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

/* ── ordering: move steps up/down ───────────────────────────── */

function OrderingRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as OrderingItem;
  const seed = useMemo(() => [...it.id].reduce((a, c) => a + c.charCodeAt(0) * 3, 11), [it.id]);
  const initial = useMemo(() => shuffled(it.steps.map((_, i) => i), seed), [it, seed]);
  const order = (Array.isArray(value) && value.length === it.steps.length ? (value as number[]) : initial);
  const setOrder = (next: number[]): void => onChange(next);
  const move = (i: number, dir: -1 | 1): void => {
    if (graded) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 7 }}>
        {order.map((origin, pos) => {
          const okPos = graded && origin === pos;
          const badPos = graded && origin !== pos;
          return (
            <li
              key={origin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: `1px solid ${graded ? (okPos ? 'var(--good)' : badPos ? 'var(--danger)' : 'var(--border)') : 'var(--border)'}`,
                borderRadius: 10,
                padding: '10px 13px',
                background: graded && okPos ? 'var(--good-dim)' : graded && badPos ? 'var(--danger-dim)' : 'var(--panel)',
              }}
            >
              <span className="mono" style={{ color: 'var(--faint)', fontSize: 12 }}>
                {pos + 1}.
              </span>
              <span style={{ fontSize: 13.5, flex: 1 }}>{it.steps[origin]}</span>
              {!graded && (
                <span style={{ display: 'flex', gap: 5 }}>
                  <button type="button" aria-label="Move up" onClick={() => move(pos, -1)} style={{ ...btn('ghost'), padding: '4px 9px' }}>
                    ↑
                  </button>
                  <button type="button" aria-label="Move down" onClick={() => move(pos, 1)} style={{ ...btn('ghost'), padding: '4px 9px' }}>
                    ↓
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {graded && (
        <>
          <VerdictLine correct={correct} />
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

/* ── fix-code: deep-link runner + honor confirm ─────────────── */

function FixCodeRenderer({ item, value, onChange, graded, correct }: RendererProps) {
  const it = item as FixCodeItem;
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{it.prompt}</div>
      <pre style={codeStyle}>{it.code}</pre>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <a href={it.runnerUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpened(true)} style={{ textDecoration: 'none' }}>
          <button type="button" style={btn('primary')}>
            ↗ Open in {it.runnerName}
          </button>
        </a>
        <span className="mono" style={{ fontSize: 11, color: 'var(--faint)' }}>
          paste · fix · run · verify — then confirm below
        </span>
      </div>
      {!graded && (
        <label style={{ display: 'flex', gap: 9, alignItems: 'center', marginTop: 14, fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked ? true : false)}
            disabled={!opened}
            style={{ accentColor: 'var(--good)', width: 15, height: 15 }}
          />
          <span style={{ opacity: opened ? 1 : 0.55 }}>I fixed it, ran it, and it behaves correctly</span>
        </label>
      )}
      {graded && (
        <>
          <VerdictLine correct={correct} />
          <div
            style={{
              marginTop: 10,
              border: '1px solid var(--good)',
              background: 'var(--good-dim)',
              borderRadius: 10,
              padding: '12px 15px',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <span className="mono" style={{ color: 'var(--good)', fontSize: 10, letterSpacing: 1.5 }}>
              SOLUTION
            </span>
            <div style={{ marginTop: 5 }}>{it.solutionNote}</div>
          </div>
          <Explain text={it.explanation} item={it} />
        </>
      )}
    </div>
  );
}

const RENDERERS: Record<QuizItem['format'], (p: RendererProps) => React.ReactElement> = {
  mcq: McqRenderer,
  'why-crash': McqRenderer,
  'find-bug': FindBugRenderer,
  'predict-output': PredictRenderer,
  'fill-blank': FillBlankRenderer,
  match: MatchRenderer,
  ordering: OrderingRenderer,
  'fix-code': FixCodeRenderer,
};

export function QuizItemView(props: RendererProps) {
  const R = RENDERERS[props.item.format];
  return <R {...props} />;
}
