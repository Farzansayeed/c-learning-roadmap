import { PHASES, STAGES } from './index';
import { RESOURCES } from './resources';
import type { ResourceId } from './resources';

export interface ValidationIssue {
  code: string;
  message: string;
}

export interface ValidationReport {
  ok: boolean;
  issues: ValidationIssue[];
  stats: {
    stages: number;
    topics: number;
    drills: number;
    builds: number;
    traps: number;
    quizRefs: number;
    vizLinks: number;
    totalDays: number;
  };
}

function collectIssues(): ValidationReport {
  const issues: ValidationIssue[] = [];
  const stats = { stages: 0, topics: 0, drills: 0, builds: 0, traps: 0, quizRefs: 0, vizLinks: 0, totalDays: 0 };
  const seenStageIds = new Set<string>();
  const seenTopicIds = new Set<string>();
  const seenQuizRefs = new Map<string, string[]>(); // quizId -> [locations]

  // ── Phase consistency ──
  const phaseIds = new Set(PHASES.map((p) => p.id));
  if (PHASES.length !== 6) issues.push({ code: 'PHASE_COUNT', message: `expected 6 phases, got ${PHASES.length}` });
  const stageIdsInPhases = PHASES.flatMap((p) => p.stageIds);
  if (stageIdsInPhases.length !== STAGES.length)
    issues.push({ code: 'PHASE_STAGES', message: 'phases reference a different number of stages than exist' });

  // ── Stages ──
  for (const s of STAGES) {
    stats.stages += 1;
    if (seenStageIds.has(s.id)) issues.push({ code: 'DUP_STAGE', message: s.id });
    seenStageIds.add(s.id);
    if (!phaseIds.has(s.phase)) issues.push({ code: 'BAD_PHASE', message: `${s.id}: phase ${s.phase} unknown` });

    if (s.canStatements.length === 0) issues.push({ code: 'NO_CAN', message: s.id });
    if (s.topics.length === 0) issues.push({ code: 'NO_TOPICS', message: s.id });
    if (!s.build?.name) issues.push({ code: 'NO_BUILD', message: s.id });
    if (s.traps.length < 3 && s.id !== 's17')
      issues.push({ code: 'FEW_TRAPS', message: `${s.id}: ${s.traps.length} traps (<3)` });

    stats.totalDays += s.days;
    stats.builds += 1;

    // topics: ordered, unique ids, resources resolve
    let lastOrder = 0;
    for (const t of s.topics) {
      stats.topics += 1;
      if (seenTopicIds.has(t.id)) issues.push({ code: 'DUP_TOPIC', message: t.id });
      seenTopicIds.add(t.id);
      if (t.order <= lastOrder) issues.push({ code: 'TOPIC_ORDER', message: `${s.id}: ${t.id} out of order` });
      lastOrder = t.order;
      if (!t.concept || t.concept.length < 40)
        issues.push({ code: 'THIN_CONCEPT', message: `${t.id} concept too thin (${t.concept?.length ?? 0} chars)` });
      for (const r of t.resources) {
        if (!(r.id in RESOURCES)) issues.push({ code: 'BAD_RESOURCE', message: `${t.id}: ${r.id}` });
      }
      if (t.viz) {
        stats.vizLinks += 1;
        if (!(t.viz.id in RESOURCES)) issues.push({ code: 'BAD_VIZ', message: `${t.id}: ${t.viz.id}` });
        if (t.viz.kind !== 'viz') issues.push({ code: 'VIZ_KIND', message: `${t.id}: ${t.viz.id} is not a viz resource` });
      }
      for (const q of t.quizRefs) {
        stats.quizRefs += 1;
        if (!seenQuizRefs.has(q)) seenQuizRefs.set(q, []);
        seenQuizRefs.get(q)!.push(`${s.id}/${t.id}`);
      }
    }

    // drills & traps
    stats.drills += s.drills.length;
    const drillIds = new Set<string>();
    for (const d of s.drills) {
      if (drillIds.has(d.id)) issues.push({ code: 'DUP_DRILL', message: d.id });
      drillIds.add(d.id);
    }
    stats.traps += s.traps.length;
    for (const tr of s.traps) {
      for (const q of tr.quizRefs) {
        stats.quizRefs += 1;
        if (!seenQuizRefs.has(q)) seenQuizRefs.set(q, []);
        seenQuizRefs.get(q)!.push(`${s.id}/${tr.id}`);
      }
    }
  }

  // every stage referenced by a phase exists
  for (const sid of stageIdsInPhases) {
    if (!seenStageIds.has(sid)) issues.push({ code: 'PHANTOM_STAGE', message: sid });
  }

  // quiz refs: exactly ONE owning TOPIC per quiz id; trap refs are free
  // (a trap legitimately references the quizzes that test it — that's the
  // bidirectional topic↔trap linking CURRICULUM.md specifies)
  const topicOwner = new Map<string, string>();
  for (const s of STAGES) {
    for (const t of s.topics) {
      for (const q of t.quizRefs) {
        if (topicOwner.has(q))
          issues.push({ code: 'QUIZ_DUP_REF', message: `${q} owned by both ${topicOwner.get(q)} and ${t.id}` });
        else topicOwner.set(q, t.id);
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    stats,
  };
}

let cached: ValidationReport | null = null;

/** Full structural validation of the curriculum (memoized). */
export function validateCurriculum(): ValidationReport {
  if (!cached) cached = collectIssues();
  return cached;
}

/** Resource ids that are never referenced by any stage (canon hygiene). */
export function unusedResources(): ResourceId[] {
  const used = new Set<string>();
  for (const s of STAGES) {
    for (const t of s.topics) {
      t.resources.forEach((r) => used.add(r.id));
      if (t.viz) used.add(t.viz.id);
    }
  }
  return (Object.keys(RESOURCES) as ResourceId[]).filter((id) => !used.has(id));
}
