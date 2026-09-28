import { res } from '../../data/curriculum/resources';
import type { Stage } from '../../data/curriculum/types';
import type { Resource } from '../../data/curriculum/types';

const KIND_TAG: Record<Resource['kind'], string> = {
  book: 'BOOK',
  video: 'VIDEO',
  site: 'SITE',
  tool: 'TOOL',
  viz: 'VIZ',
  practice: 'PRACTICE',
};

const KIND_COLOR: Record<Resource['kind'], string> = {
  book: 'var(--warn)',
  video: 'var(--danger)',
  site: 'var(--info)',
  tool: 'var(--good)',
  viz: 'var(--p3)',
  practice: 'var(--p4)',
};

function ResourceChip({ r }: { r: Resource }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 11.5,
        fontWeight: 600,
        padding: '4px 11px',
        borderRadius: 99,
        border: '1px solid var(--border-strong)',
        color: 'var(--text)',
        textDecoration: 'none',
      }}
    >
      <span style={{ color: KIND_COLOR[r.kind], fontSize: 9, letterSpacing: 1 }}>{KIND_TAG[r.kind]}</span>
      {r.label}
      {r.note && <span style={{ color: 'var(--faint)' }}>· {r.note}</span>}
    </a>
  );
}

interface StageDetailProps {
  stage: Stage;
  accent: string;
  checkedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
}

/** Full stage view — every topic in order with concept, resources, viz; drills; build; traps. */
export function StageDetail({ stage, accent, checkedIds, onToggle }: StageDetailProps) {
  return (
    <div style={{ display: 'grid', gap: 26 }}>
      <header>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>
          <span className="mono" style={{ color: accent, fontSize: 15, marginRight: 10 }}>
            {stage.id.toUpperCase()}
          </span>
          {stage.title}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6, maxWidth: 640 }}>{stage.goal}</p>
        <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 5 }}>
          {stage.canStatements.map((c) => (
            <li key={c} style={{ fontSize: 13.5, color: 'var(--text)', display: 'flex', gap: 9 }}>
              <span style={{ color: 'var(--good)' }}>✓</span>
              {c}
            </li>
          ))}
        </ul>
      </header>

      <section aria-label="Learning path">
        <h3 className="mono" style={{ fontSize: 10.5, letterSpacing: 2.5, color: 'var(--faint)', textTransform: 'uppercase' }}>
          Learning path — in order
        </h3>
        <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12, marginTop: 12 }}>
          {stage.topics.map((t) => {
            const itemId = `${stage.id}:t:${t.id}`;
            const done = checkedIds.has(itemId);
            return (
              <li
                key={t.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  background: 'var(--panel)',
                  padding: '16px 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span className="mono" style={{ color: accent, fontSize: 12, fontWeight: 600 }}>
                    {String(t.order).padStart(2, '0')}
                  </span>
                  <label style={{ display: 'flex', alignItems: 'baseline', gap: 10, cursor: 'pointer', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggle(itemId)}
                      aria-label={`Topic complete: ${t.title}`}
                      style={{ accentColor: 'var(--good)', width: 15, height: 15, transform: 'translateY(1px)' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: 15, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--faint)' : 'var(--text)' }}>
                      {t.title}
                    </span>
                  </label>
                </div>
                <p style={{ margin: '10px 0 0 38px', color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6 }}>
                  {t.concept}
                </p>
                {(t.resources.length > 0 || t.viz) && (
                  <div style={{ margin: '12px 0 0 38px', display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {t.resources.map((r) => (
                      <ResourceChip key={r.id + r.note} r={r} />
                    ))}
                    {t.viz && <ResourceChip r={res(t.viz.id as never, t.viz.note)} />}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {stage.drills.length > 0 && (
        <section aria-label="Drills">
          <h3 className="mono" style={{ fontSize: 10.5, letterSpacing: 2.5, color: 'var(--faint)', textTransform: 'uppercase' }}>
            Drills
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8, marginTop: 12 }}>
            {stage.drills.map((d) => {
              const itemId = `${stage.id}:d:${d.id}`;
              const done = checkedIds.has(itemId);
              return (
                <li
                  key={d.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'baseline',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '11px 15px',
                    background: 'var(--panel)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => onToggle(itemId)}
                    aria-label={`Drill complete: ${d.title}`}
                    style={{ accentColor: 'var(--good)', width: 15, height: 15, transform: 'translateY(1px)' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 13.5, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--faint)' : 'var(--text)' }}>
                    {d.title}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: 12.5, flex: 1 }}>{d.detail}</span>
                  <span
                    className="mono"
                    title={d.platform ?? 'local'}
                    style={{ fontSize: 9.5, letterSpacing: 1, color: 'var(--faint)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                  >
                    {d.platform ?? 'local'} · {'●'.repeat(d.difficulty)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-label="Flagship build">
        <h3 className="mono" style={{ fontSize: 10.5, letterSpacing: 2.5, color: 'var(--faint)', textTransform: 'uppercase' }}>
          Flagship build
        </h3>
        <div
          style={{
            marginTop: 12,
            border: `1px solid ${accent}`,
            borderRadius: 14,
            padding: '18px 20px',
            background: 'var(--panel)',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16, color: accent }}>{stage.build.name}</div>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: '8px 0 12px', lineHeight: 1.6 }}>{stage.build.brief}</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
            {stage.build.acceptance.map((a) => (
              <li key={a} className="mono" style={{ fontSize: 12, color: 'var(--text)', display: 'flex', gap: 8 }}>
                <span style={{ color: accent }}>▢</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Traps">
        <h3 className="mono" style={{ fontSize: 10.5, letterSpacing: 2.5, color: 'var(--faint)', textTransform: 'uppercase' }}>
          Traps — where beginners bleed
        </h3>
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {stage.traps.map((tr) => (
            <div
              key={tr.id}
              style={{
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--danger)',
                borderRadius: 10,
                padding: '11px 15px',
                background: 'var(--panel)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--danger)' }}>{tr.mistake}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 4, lineHeight: 1.55 }}>{tr.why}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
