import { res } from '../resources';
import type { Stage } from '../types';

export const s09: Stage = {
  id: 's09',
  phase: 'p3',
  title: 'Linear Data Structures II',
  goal: 'Hash tables in full depth, advanced string handling, pattern matching.',
  days: 6,
  canStatements: [
    'Build a hash table from scratch (both collision strategies) and explain every design decision',
    'Choose hashing vs balanced structures with justification',
    'Manipulate C strings safely at an advanced level',
    'Implement naive pattern matching; explain KMP conceptually',
  ],
  topics: [
    {
      id: 's09.t1',
      order: 1,
      title: 'Hash concept & load factor',
      concept:
        'A hash function turns a key into an array index: O(1) average. The load factor (elements/buckets) decides when to grow — past ~0.75, collisions eat the average case.',
      resources: [res('weiss', 'ch. 5.1–5.2')],
      viz: res('visualgo', 'hashing viz'),
      quizRefs: ['q.s09.1'],
    },
    {
      id: 's09.t2',
      order: 2,
      title: 'Hash functions',
      concept:
        'For ints, multiply-and-mix; for strings, FNV/djb2 (multiply by prime, add char). A bad hash sends everything to one bucket — a disguised linked list.',
      resources: [res('weiss', 'ch. 5.2')],
      quizRefs: ['q.s09.2'],
    },
    {
      id: 's09.t3',
      order: 3,
      title: 'Chaining',
      concept:
        'Each bucket holds a linked list of collisions. Simple, tolerant of load, pays pointer overhead — your S08 list gets its first real job.',
      resources: [res('weiss', 'ch. 5.3')],
      viz: res('galles', 'hash animations'),
      quizRefs: ['q.s09.3'],
    },
    {
      id: 's09.t4',
      order: 4,
      title: 'Open addressing & tombstones',
      concept:
        'Colliding entries probe onward (linear/quadratic). Deleting needs tombstones — a "deleted" marker that keeps probe chains intact. The full-vs-stop subtlety is a top interview bug.',
      resources: [res('weiss', 'ch. 5.3')],
      quizRefs: ['q.s09.4', 'q.s09.5'],
    },
    {
      id: 's09.t5',
      order: 5,
      title: 'Rehashing & growth',
      concept:
        'Past the load factor, allocate double buckets and re-hash everything — old indexes are invalid. Amortized O(1) survives, thanks to S07.',
      resources: [res('weiss', 'ch. 5.3')],
      quizRefs: ['q.s09.6'],
    },
    {
      id: 's09.t6',
      order: 6,
      title: 'Strings II: tokenizing & splitting',
      concept:
        'strtok mutates its input and is not reentrant — know its dangers, then write your own split/join on char* with correct allocation discipline.',
      resources: [res('king', 'ch. 13 (advanced)')],
      quizRefs: [],
    },
    {
      id: 's09.t7',
      order: 7,
      title: 'Pattern matching',
      concept:
        'Naive search: try every position, O(nm). KMP precomputes a failure table so it never re-compares — O(n+m). Implement naive; build the KMP intuition, implementation optional.',
      resources: [res('erickson', 'string algorithms'), res('cpAlgorithms', 'string matching')],
      viz: res('visualgo', 'string viz'),
      quizRefs: ['q.s09.7'],
    },
  ],
  drills: [
    { id: 's09.d1', title: 'Word-frequency counter', detail: 'read a text file, count with your hash map, print top words.', difficulty: 2, platform: 'local' },
    { id: 's09.d2', title: 'Mini spell-checker', detail: 'load a dictionary into the map, time lookups.', difficulty: 2, platform: 'local' },
    { id: 's09.d3', title: 'Two-sum rewrite', detail: 'O(n²) nested loop → O(n) with your hash map.', difficulty: 2, platform: 'local' },
    { id: 's09.d4', title: 'Probe-sequence tracer', detail: 'print insertion probes; watch clustering form with linear probing.', difficulty: 3, platform: 'local' },
    { id: 's09.d5', title: 'Custom split/join', detail: 'char** split(const char*, char delim) with clean allocation + free helper.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's09.build',
    name: 'HashKV',
    brief:
      'A string→string hash table: chaining, load-factor-driven rehash, stats mode (collisions per bucket, probe counts), CLI with put/get/del/stats. Benchmark: 10⁶ ops timed.',
    acceptance: [
      'Chaining + rehashing at 0.75 load, both proven',
      'Stats mode exposes bucket occupancy + probe counts',
      '10⁶-op benchmark completes with sane average lookup time',
      'valgrind-clean including value-string ownership',
    ],
  },
  traps: [
    { id: 's09.tr1', mistake: 'Hash function returning constant-ish values', why: 'sum of chars maxes out small — buckets cluster. Multiply-by-prime mixing spreads them.', quizRefs: ['q.s09.2'] },
    { id: 's09.tr2', mistake: 'Never rehashing', why: 'load factor hits 1.0 and every op degrades to a linked-list walk. Growth is not optional.', quizRefs: ['q.s09.6'] },
    { id: 's09.tr3', mistake: 'Tombstone breaks "empty means stop"', why: 'in open addressing, a deleted slot must NOT terminate probes — search continues past tombstones.', quizRefs: ['q.s09.4'] },
    { id: 's09.tr4', mistake: 'Leaking value strings on delete/overwrite', why: 'who owns the key/value memory? Decide (table copies everything) and enforce it.', quizRefs: ['q.s09.3'] },
  ],
};
