import { res } from '../resources';
import type { Stage } from '../types';

export const s16: Stage = {
  id: 's16',
  phase: 'p5',
  title: 'Interview Patterns Sprint',
  goal: 'Map unseen problems to patterns in minutes, think out loud coherently, pass mocks on the core patterns.',
  days: 10,
  canStatements: [
    'Map any unseen problem to a pattern within minutes',
    'Think out loud coherently while coding',
    'Pass mock interviews on the core 15+ patterns',
    'Maintain a personal problem journal with revisit dates',
  ],
  topics: [
    {
      id: 's16.t1',
      order: 1,
      title: 'The interview operating system',
      concept:
        'Clarify → brute force → optimize → code → test. Restating the problem and stating a brute force FIRST is scoring, not stalling — interviewers grade the process.',
      resources: [res('tiH'), res('ctci', 'ch. 7')],
      quizRefs: ['q.s16.1'],
    },
    {
      id: 's16.t2',
      order: 2,
      title: 'The pattern map',
      concept:
        'Arrays/hashing · two pointers · fast & slow · sliding window · cyclic sort · merge intervals · kth-element/quickselect · stack · binary search · linked list · trees · heaps · two heaps · backtracking · graphs · 1-D DP · greedy · divide & conquer. Each pattern card in the app: recognition cues + C-first template + 3 anchor problems.',
      resources: [res('neetcode', '150 roadmap'), res('ctci'), res('epi')],
      quizRefs: ['q.s16.2', 'q.s16.3'],
    },
    {
      id: 's16.t3',
      order: 3,
      title: 'C for interviews',
      concept:
        'C-first with static buffers and helper structs; know when C fights the judge and C++ string/vector is pragmatic — the app flags those problems explicitly.',
      resources: [],
      quizRefs: ['q.s16.4'],
    },
    {
      id: 's16.t4',
      order: 4,
      title: 'Complexity-first communication',
      concept:
        'State time/space BEFORE coding and AGAIN after. "O(n) time, O(1) space" is the sentence interviewers listen for.',
      resources: [res('tiH', 'complexity communication')],
      quizRefs: [],
    },
    {
      id: 's16.t5',
      order: 5,
      title: 'Mock protocol',
      concept:
        'Weekly timed mocks from day 3: 45 min, one problem, out loud, recorded. Self-review against the checklist; peer option via Exercism community.',
      resources: [res('exercism', 'community mentoring')],
      quizRefs: [],
    },
    {
      id: 's16.t6',
      order: 6,
      title: 'Journal & spaced repetition',
      concept:
        'Every solved problem: pattern tag, mistake tag, revisit date. The Forge feeds the journal into its spaced-review engine — your mistakes resurface until they stop happening.',
      resources: [],
      quizRefs: [],
    },
  ],
  drills: [
    { id: 's16.d1', title: '60-problem cadence', detail: 'NeetCode-150 subset across all patterns, C-first.', difficulty: 3, platform: 'leetcode' },
    { id: 's16.d2', title: 'CC Starters weekly', detail: 'Div 3/4 every Wednesday — contest nerves trained out.', difficulty: 2, platform: 'codechef' },
    { id: 's16.d3', title: 'Recorded self-mock ×2', detail: '45 minutes, out loud, checklist-scored.', difficulty: 3, platform: 'local' },
  ],
  build: {
    id: 's16.build',
    name: 'The Journal',
    brief:
      '60+ solved problems with your own written pattern notes + mistake tags feeding spaced review; a personal patterns cheat-sheet generated from the journal.',
    acceptance: [
      '≥60 problems, each tagged with pattern + mistake + revisit date',
      'Spaced-review queue actively resurfacing old mistakes',
      'Cheat-sheet generated from journal data, in your own words',
    ],
  },
  traps: [
    { id: 's16.tr1', mistake: 'Pattern memorization without re-derivation', why: 'templates break on twist problems; understanding survives them. Re-derive each pattern weekly.', quizRefs: ['q.s16.2'] },
    { id: 's16.tr2', mistake: 'Silent coding', why: 'interviewers grade thought process they cannot see. Narrate or fail — even solo mocks.', quizRefs: ['q.s16.1'] },
    { id: 's16.tr3', mistake: 'Skipping the journal', why: 'the #1 self-reported regret. Solved-without-recorded is practice evaporating.', quizRefs: [] },
  ],
};
