import { useMemo, useState } from 'react';
import { RESOURCES, type ResourceId } from '../../data/curriculum/resources';
import { STAGES, PHASES } from '../../data/curriculum';

/**
 * Library (Phase 7): the full canon, searchable and filterable.
 * Books · video spine · viz tools · practice platforms · references,
 * each tagged with the phases that use it (derived from stage references).
 */

type Kind = 'book' | 'video' | 'viz' | 'practice' | 'site' | 'tool';

const KIND_TAG: Record<Kind, string> = {
  book: 'BOOK',
  video: 'VIDEO',
  viz: 'VIZ',
  practice: 'PRACTICE',
  site: 'REFERENCE',
  tool: 'TOOL',
};

/** Which stages reference each resource → which phases it serves. */
function usePhaseTags(): Record<ResourceId, string[]> {
  return useMemo(() => {
    const tags = {} as Record<ResourceId, string[]>;
    for (const id of Object.keys(RESOURCES) as ResourceId[]) tags[id] = [];
    for (const s of STAGES) {
      const phaseNum = PHASES.find((p) => p.id === s.phase)?.num ?? 0;
      const tag = `P${phaseNum}`;
      const seen = new Set<string>();
      for (const t of s.topics) {
        for (const r of t.resources) {
          if (!seen.has(r.id)) {
            seen.add(r.id);
            if (!tags[r.id as ResourceId]?.includes(tag)) tags[r.id as ResourceId]?.push(tag);
          }
        }
        if (t.viz && !seen.has(t.viz.id)) {
          seen.add(t.viz.id);
          if (!tags[t.viz.id as ResourceId]?.includes(tag)) tags[t.viz.id as ResourceId]?.push(tag);
        }
      }
    }
    return tags;
  }, []);
}

export function LibraryPage() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<Kind | 'all'>('all');
  const tags = usePhaseTags();

  const kinds = Object.keys(KIND_TAG) as Kind[];
  const q = query.trim().toLowerCase();

  const results = (Object.keys(RESOURCES) as ResourceId[])
    .map((id) => {
      const r = RESOURCES[id] as { label: string; url: string; kind: string; note?: string };
      return { id, label: r.label, url: r.url, kind: r.kind, note: r.note, phases: tags[id] ?? [] };
    })
    .filter((r) => (kind === 'all' ? true : r.kind === kind))
    .filter((r) =>
      q === ''
        ? true
        : r.label.toLowerCase().includes(q) ||
          (r.note?.toLowerCase().includes(q) ?? false) ||
          r.phases.some((p) => p.toLowerCase().includes(q)),
    );

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 900 }}>
      <header>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px' }}>Library</h1>
        <p className="mono" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, letterSpacing: 1 }}>
          THE CANON — {Object.keys(RESOURCES).length} RESOURCES, NO FILLER
        </p>
      </header>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the canon… (title, note, phase)"
          aria-label="Search resources"
          style={{
            flex: 1,
            minWidth: 220,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--panel2)',
            color: 'var(--text)',
            font: 'inherit',
            fontSize: 13,
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', ...kinds] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              style={{
                padding: '7px 13px',
                borderRadius: 99,
                border: `1px solid ${kind === k ? 'var(--p1)' : 'var(--border-strong)'}`,
                background: kind === k ? 'var(--good-dim)' : 'var(--panel2)',
                color: kind === k ? 'var(--good)' : 'var(--muted)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 11.5,
                font: 'inherit',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {k === 'all' ? 'ALL' : KIND_TAG[k]}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 16, padding: '42px 24px', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Nothing matches "{query}".</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>The canon is curated — try a shorter search.</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 9 }}>
          {results.map((r) => (
            <li
              key={r.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 12,
                background: 'var(--panel)',
                padding: '14px 17px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: 1.2,
                  fontWeight: 700,
                  color: 'var(--info)',
                  border: '1px solid var(--info-dim)',
                  background: 'var(--info-dim)',
                  borderRadius: 6,
                  padding: '3px 7px',
                  flex: 'none',
                }}
              >
                {KIND_TAG[r.kind as Kind]}
              </span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
                >
                  {r.label} <span style={{ color: 'var(--info)' }}>↗</span>
                </a>
                {r.note && (
                  <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2 }}>{r.note}</div>
                )}
              </div>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--faint)', flex: 'none' }}>
                {r.phases.length ? r.phases.join(' · ') : 'reference'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
