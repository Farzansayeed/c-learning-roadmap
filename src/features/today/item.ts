import { PHASES, stageById } from '../../data/curriculum';

export interface ItemRef {
  id: string; // 's00:t:s00.t1'
  stageId: string;
  kind: 'topic' | 'drill';
  title: string;
  detail: string;
  url: string; // deep link into roadmap stage detail (U13)
  accent: string; // CSS var
}

const ACCENT_DEFAULT = 'var(--p0)';

/** Parse a queue item id ('s03:t:s03.t4') into a renderable reference. */
export function curriculumItem(id: string): ItemRef | null {
  const m = /^(s\d{2}):(t|d):(s\d{2}\.(?:t|d)\d+)$/.exec(id);
  if (!m) return null;
  const [, stageId, kind, inner] = m;
  const stage = stageById(stageId);
  if (!stage) return null;
  const phase = PHASES.find((p) => p.stageIds.includes(stageId));
  const accent = phase ? `var(--${phase.id})` : ACCENT_DEFAULT;

  if (kind === 't') {
    const t = stage.topics.find((x) => x.id === inner);
    if (!t) return null;
    return { id, stageId, kind: 'topic', title: t.title, detail: t.concept, url: `/roadmap?stage=${stageId}`, accent };
  }
  const d = stage.drills.find((x) => x.id === inner);
  if (!d) return null;
  return { id, stageId, kind: 'drill', title: d.title, detail: d.detail, url: `/roadmap?stage=${stageId}`, accent };
}
