import { res } from '../resources';
import type { Stage } from '../types';

export const s18: Stage = {
  id: 's18',
  phase: 'p5',
  title: 'Maintain the Blade',
  goal: 'Retain everything: spaced review, weekly contests, monthly re-implementations — the metronome.',
  days: 0, // ongoing
  canStatements: [
    'Retain all prior stages via spaced review',
    'Hold a weekly contest cadence without tilt',
    'Re-implement one data structure per month, timed',
  ],
  topics: [
    {
      id: 's18.t1',
      order: 1,
      title: 'Spaced review engine',
      concept:
        'The app resurfaces your weakest quizzes weekly (SM-2-lite). Retention is scheduled, not hoped for.',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's18.t2',
      order: 2,
      title: 'Contest cadence',
      concept:
        'CodeChef Starters weekly (Div 3/4 → climb), occasional LeetCode contests. Speed under pressure is a separate skill — it decays without reps.',
      resources: [res('codechef'), res('leetcode', 'contests')],
      quizRefs: [],
    },
    {
      id: 's18.t3',
      order: 3,
      title: 'Monthly re-implementation',
      concept:
        'One data structure from scratch, timed, every month. The blade stays sharp or it does not.',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's18.t4',
      order: 4,
      title: 'Weekly war story',
      concept:
        'One ADM war story per week — design intuition grows by osmosis, one anecdote at a time.',
      resources: [res('skiena', 'war stories')],
      quizRefs: [],
    },
    {
      id: 's18.t5',
      order: 5,
      title: 'Advanced Horizons',
      concept:
        'What exists beyond this roadmap — pick ONE and go deep: Fenwick & segment trees (range queries) · B-trees & skip lists (databases) · suffix trees/arrays (strings) · randomized algorithms · indexing/ISAM (DB internals) · multithreading → the S19 concurrency & sockets extension.',
      resources: [res('cpAlgorithms', 'advanced structures')],
      quizRefs: [],
    },
  ],
  drills: [],
  build: {
    id: 's18.build',
    name: 'The 90-Day Heatmap',
    brief:
      'No artifact to build — the stage is the metronome. Its "artifact" is a 90-day review heatmap you are proud of.',
    acceptance: [
      '≥80% of spaced-review quizzes on schedule for 90 days',
      'Weekly contest streak ≥ 10 weeks',
      'Three re-implementations logged with timings',
    ],
  },
  traps: [
    { id: 's18.tr1', mistake: 'Contest tilt', why: 'chasing rating over learning turns contests into slot machines. Review problems > rating numbers.', quizRefs: [] },
    { id: 's18.tr2', mistake: 'Review decay ("I\u2019ll remember it")', why: 'memory curves do not negotiate. The queue does the remembering so you do not have to.', quizRefs: [] },
    { id: 's18.tr3', mistake: 'Habit collapse after "finishing"', why: 'that is what this stage exists to prevent — the roadmap ends, the cadence does not.', quizRefs: [] },
  ],
};
