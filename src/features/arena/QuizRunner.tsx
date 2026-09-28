import { useMemo, useState } from 'react';
import { isCorrect, selectItems, score, type Answered } from '../../engines/quiz';
import type { QuizItem, QuizSet } from '../../data/quizzes/types';
import { useQuiz } from '../../stores/quiz';
import { btn, FORMAT_TAG } from './shared';
import { QuizItemView } from './renderers';

/**
 * QuizRunner — one item at a time, instant feedback (DESIGN.md §4),
 * commit on finish (XP + spaced-review routing), re-rolled retry on fail.
 */

interface RunResult {
  pct: number;
  passed: boolean;
  xp: number;
  missed: QuizItem[];
}

export function QuizRunner({ set, onExit }: { set: QuizSet; onExit: () => void }) {
  const clearAnswers = useQuiz((s) => s.clearAnswers);
  const commit = useQuiz((s) => s.commit);
  const [seed, setSeed] = useState(() => Date.now());
  const ordered = useMemo(() => selectItems(set.items, set.items.length, seed), [set, seed]);
  const [idx, setIdx] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<RunResult | null>(null);

  const item = ordered[idx];
  const answers = useQuiz((s) => s.answers);
  const setAnswer = useQuiz((s) => s.setAnswer);
  const value = answers[item.id];
  const graded = item.id in checked;
  const answeredCount = Object.keys(answers).length;

  const check = (): void => {
    if (value === undefined || graded) return;
    setChecked((c) => ({ ...c, [item.id]: isCorrect(item, value) }));
  };

  const next = (): void => {
    if (idx + 1 < ordered.length) setIdx(idx + 1);
    else finish();
  };

  const finish = (): void => {
    const answered: Answered[] = ordered.map((it) => ({ itemId: it.id, correct: checked[it.id] ?? false }));
    const s = score(ordered, answered, set.passMark);
    const { xp, missed } = commit({ setId: set.id, items: ordered, passed: s.passed });
    setResult({ pct: Math.round(s.pct * 100), passed: s.passed, xp, missed });
  };

  const retry = (): void => {
    clearAnswers();
    setChecked({});
    setIdx(0);
    setResult(null);
    setSeed(Date.now()); // decision 7: re-rolled variants on retry
  };

  if (result) {
    return (
      <div style={{ maxWidth: 720, display: 'grid', gap: 20 }}>
        <div
          style={{
            border: `1px solid ${result.passed ? 'var(--good)' : 'var(--danger)'}`,
            background: result.passed ? 'var(--good-dim)' : 'var(--danger-dim)',
            borderRadius: 16,
            padding: '26px 26px',
          }}
        >
          <div className="mono" style={{ fontSize: 11, letterSpacing: 2, color: 'var(--muted)' }}>
            {set.title}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6, color: result.passed ? 'var(--good)' : 'var(--danger)' }}>
            {result.pct}% — {result.passed ? 'GATE CLEARED' : result.passed === false && set.kind === 'boss' ? 'GATE HOLDS' : 'NOT QUITE'}
          </div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
            {ordered.length - result.missed.length}/{ordered.length} correct · pass mark {Math.round(set.passMark * 100)}% · +{result.xp} xp
            {result.passed ? '' : ' · misses routed to spaced review'}
          </div>
        </div>

        {result.missed.length > 0 && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--faint)' }}>
              MISSED — DUE BACK IN SPACED REVIEW
            </div>
            {result.missed.map((m) => (
              <div
                key={m.id}
                style={{
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--warn)',
                  borderRadius: 10,
                  background: 'var(--panel)',
                  padding: '10px 14px',
                  fontSize: 13,
                }}
              >
                <span className="mono" style={{ color: 'var(--warn)', fontSize: 10, letterSpacing: 1, marginRight: 10 }}>
                  {FORMAT_TAG[m.format]}
                </span>
                {m.targets}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!result.passed && (
            <button type="button" style={btn('primary')} onClick={retry}>
              ⟲ Retry — re-rolled, right now
            </button>
          )}
          <button type="button" style={btn('ghost')} onClick={onExit}>
            ← Back to the Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <button type="button" style={{ ...btn('ghost'), padding: '6px 12px' }} onClick={onExit} aria-label="Leave quiz">
          ←
        </button>
        <div>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--faint)' }}>
            {set.title}
          </div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--info)', marginTop: 3, letterSpacing: 1.5 }}>
            {FORMAT_TAG[item.format]} · {idx + 1}/{ordered.length}
            {checked[item.id] === true ? ' · ✓ so far' : ''}
          </div>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round((answeredCount / ordered.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quiz progress"
          style={{ marginLeft: 'auto', width: 120, height: 6, borderRadius: 99, background: 'var(--panel2)', border: '1px solid var(--border)' }}
        >
          <div
            style={{
              width: `${Math.round((answeredCount / ordered.length) * 100)}%`,
              height: '100%',
              borderRadius: 99,
              background: 'var(--info)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 16,
          background: 'var(--panel)',
          padding: '22px 24px',
        }}
      >
        <QuizItemView
          item={item}
          value={value}
          onChange={(v) => setAnswer(item.id, v)}
          graded={graded}
          correct={checked[item.id] === true}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {!graded ? (
          <button type="button" style={btn('primary')} disabled={value === undefined} onClick={check}>
            Check answer
          </button>
        ) : (
          <button type="button" style={btn('primary')} onClick={next}>
            {idx + 1 < ordered.length ? 'Next →' : 'Finish — see the verdict'}
          </button>
        )}
        {value !== undefined && !graded && (
          <span className="mono" style={{ alignSelf: 'center', fontSize: 11, color: 'var(--faint)' }}>
            answer locked in — check it
          </span>
        )}
      </div>
    </div>
  );
}
