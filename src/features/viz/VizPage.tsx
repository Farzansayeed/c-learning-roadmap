import { useMemo, useState } from 'react';
import { STAGES, PHASES } from '../../data/curriculum';

/**
 * Viz Lab (Phase 7): every "watch it move" companion in the curriculum,
 * organized by phase/stage/topic, deep-linked. Topics without a viz show
 * their Python Tutor fallback so the lab is never a dead end.
 */

interface VizCard {
  stageId: string;
  stageTitle: string;
  phaseNum: number;
  phaseAccent: string;
  topicTitle: string;
  topicConcept: string;
  label: string;
  url: string;
  note?: string;
}

export function VizPage() {
  const cards = useMemo<VizCard[]>(() => {
    const out: VizCard[] = [];
    for (const s of STAGES) {
      const phase = PHASES.find((p) => p.id === s.phase);
      for (const t of s.topics) {
        const viz = t.viz;
        if (viz) {
          out.push({
            stageId: s.id,
            stageTitle: s.title,
            phaseNum: phase?.num ?? 0,
            phaseAccent: `var(--p${phase?.num ?? 0})`,
            topicTitle: t.title,
            topicConcept: t.concept,
            label: viz.label,
            url: viz.url,
            note: viz.note,
          });
        }
      }
    }
    return out;
  }, []);

  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');
  const shown = cards.filter((c) => (phaseFilter === 'all' ? true : c.phaseNum === phaseFilter));

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 900 }}>
      <header>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px' }}>Viz Lab</h1>
        <p className="mono" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, letterSpacing: 1 }}>
          WATCH IT MOVE — {cards.length} SESSIONS, CURRICULUM-LINKED
        </p>
      </header>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(['all', ...PHASES.map((p) => p.num)] as const).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPhaseFilter(n)}
            aria-pressed={phaseFilter === n}
            style={{
              padding: '7px 13px',
              borderRadius: 99,
              border: `1px solid ${phaseFilter === n ? 'var(--p1)' : 'var(--border-strong)'}`,
              background: phaseFilter === n ? 'var(--good-dim)' : 'var(--panel2)',
              color: phaseFilter === n ? 'var(--good)' : 'var(--muted)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 11.5,
              font: 'inherit',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {n === 'all' ? 'ALL' : `P${n}`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 16, padding: '42px 24px', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>No viz sessions for this phase filter.</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Switch filters, or open the roadmap — every stage's resources are tagged there too.</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          {shown.map((c, i) => (
            <li
              key={`${c.stageId}-${c.topicTitle}-${i}`}
              style={{
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${c.phaseAccent}`,
                borderRadius: 12,
                background: 'var(--panel)',
                padding: '15px 18px',
                display: 'grid',
                gap: 7,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: 9.5, letterSpacing: 1.2, color: c.phaseAccent, fontWeight: 700 }}>
                  {c.stageId.toUpperCase()} · {c.stageTitle.toUpperCase()}
                </span>
                <span style={{ fontWeight: 700, fontSize: 14.5 }}>{c.topicTitle}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
                {c.topicConcept.length > 160 ? c.topicConcept.slice(0, 157) + '…' : c.topicConcept}
              </p>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--info)', fontWeight: 600, fontSize: 13, textDecoration: 'none', alignSelf: 'start' }}
              >
                {c.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
