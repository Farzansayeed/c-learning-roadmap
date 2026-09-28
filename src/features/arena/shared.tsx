import type { QuizItem } from '../../data/quizzes/types';

/** Shared small styles/blocks for the Arena (tokens only, hand-built density). */

export function btn(kind: 'primary' | 'ghost' | 'danger', disabled = false): React.CSSProperties {
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

export const codeStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', ui-monospace, Consolas, monospace",
  fontSize: 12.5,
  lineHeight: 1.7,
  background: 'var(--panel2)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '14px 16px',
  overflowX: 'auto',
  whiteSpace: 'pre',
};

export const FORMAT_TAG: Record<QuizItem['format'], string> = {
  mcq: 'MCQ',
  'find-bug': 'FIND THE BUG',
  'predict-output': 'PREDICT OUTPUT',
  'why-crash': 'WHY CRASH',
  'fill-blank': 'FILL BLANK',
  match: 'MATCH',
  ordering: 'ORDERING',
  'fix-code': 'FIX THE CODE',
};

export function Explain({ text, item }: { text: string; item: QuizItem }) {
  return (
    <div
      style={{
        marginTop: 14,
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--info)',
        borderRadius: 10,
        background: 'var(--panel2)',
        padding: '12px 15px',
        fontSize: 13,
        lineHeight: 1.65,
        color: 'var(--text)',
      }}
    >
      <span className="mono" style={{ color: 'var(--info)', fontSize: 10, letterSpacing: 1.5 }}>
        WHY
      </span>
      <div style={{ marginTop: 5 }}>{text}</div>
      {item.remedyUrl && (
        <a
          href={item.remedyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{ display: 'inline-block', marginTop: 9, fontSize: 11.5, color: 'var(--info)' }}
        >
          ↗ remedy: {item.remedyLabel ?? item.remedyUrl}
        </a>
      )}
    </div>
  );
}
