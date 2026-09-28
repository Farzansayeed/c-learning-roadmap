import { res } from '../resources';
import type { Stage } from '../types';

export const s04: Stage = {
  id: 's04',
  phase: 'p2',
  title: 'Structs & ADTs in C',
  goal: 'Design custom types — the building material of every data structure ahead — and make them real databases with file I/O.',
  days: 6,
  canStatements: [
    'Design struct-based types with clean APIs',
    'Use ->, typedef, nested structs fluently',
    'Implement an opaque type behind a .h/.c interface',
    'Persist struct records to file and reload them',
    'Explain why self-referential structs make linked structures possible',
  ],
  topics: [
    {
      id: 's04.t1',
      order: 1,
      title: 'struct basics & copy semantics',
      concept:
        'A struct bundles named fields into one value. Assignment copies the whole thing — unlike arrays. Knowing copy vs reference is the difference between editing data and editing a photocopy.',
      resources: [res('king', 'ch. 16')],
      quizRefs: ['q.s04.1'],
    },
    {
      id: 's04.t2',
      order: 2,
      title: 'typedef, nesting, arrays of structs',
      concept:
        'typedef gives your type a name people can say. Arrays of structs are your first "database tables" — rows with typed columns.',
      resources: [res('king', 'ch. 16')],
      quizRefs: ['q.s04.2'],
    },
    {
      id: 's04.t3',
      order: 3,
      title: 'Struct pointers & ->',
      concept:
        '(*p).field has a shortcut: p->field. Passing big structs by pointer avoids copying — and lets the callee modify the original.',
      resources: [res('king', 'ch. 16')],
      viz: res('pythonTutor', 'struct memory layout'),
      quizRefs: ['q.s04.3'],
    },
    {
      id: 's04.t4',
      order: 4,
      title: 'Self-referential structs',
      concept:
        'A struct containing a pointer to its own type: struct Node { int v; struct Node *next; }. This one line is the seed of every linked list and tree in Phase 3.',
      resources: [res('king', 'ch. 17 (intro)')],
      viz: res('pythonTutor', 'draw the boxes and arrows live'),
      quizRefs: ['q.s04.4'],
    },
    {
      id: 's04.t5',
      order: 5,
      title: 'Enums, unions, bit fields',
      concept:
        'Enums name integers; unions overlay multiple views on one memory block (a float is four bytes — prove it); bit fields pack flags tight.',
      resources: [res('king', 'ch. 16')],
      quizRefs: ['q.s04.5'],
    },
    {
      id: 's04.t6',
      order: 6,
      title: 'Design: header/impl split & opaque types',
      concept:
        'The .h promises, the .c delivers. An opaque struct — defined only in the .c — hides every detail behind init/destroy functions. This pattern shapes every later build.',
      resources: [res('jacobSorber', 'writing C libraries')],
      quizRefs: ['q.s04.6'],
    },
    {
      id: 's04.t7',
      order: 7,
      title: 'File I/O & persistence',
      concept:
        'fopen/fclose bookend every file. Text modes are human-readable; binary fwrite/fwrite of structs are fast but padding-dependent — not portable across compilers. Check every fopen for NULL, every fread for count.',
      resources: [res('king', 'ch. 22')],
      quizRefs: ['q.s04.7', 'q.s04.8'],
    },
    {
      id: 's04.t8',
      order: 8,
      title: 'Line-based formats & CSV',
      concept:
        'fgets reads a line safely (always with a size bound); parse with sscanf or by hand. CSV is just line-based with commas — and the reason you never trust strtok blindly.',
      resources: [res('king', 'ch. 13 + 22')],
      quizRefs: [],
    },
  ],
  drills: [
    { id: 's04.d1', title: 'Student database', detail: 'add/search/display — persisted to file and reloaded.', difficulty: 2, platform: 'local' },
    { id: 's04.d2', title: 'Struct-based stack', detail: 'a struct holding its own array + top index.', difficulty: 1, platform: 'local' },
    { id: 's04.d3', title: 'Bank-account module', detail: '.h/.c split, opaque handle, init/destroy pairs.', difficulty: 2, platform: 'local' },
    { id: 's04.d4', title: 'Enum state machine', detail: 'traffic light or vending machine via enum + switch.', difficulty: 2, platform: 'local' },
    { id: 's04.d5', title: 'CSV export/import', detail: 'write the student DB to CSV, read it back, byte-identical.', difficulty: 2, platform: 'local' },
    { id: 's04.d6', title: 'Hex-inspect padding', detail: 'binary-dump a struct; find the padding bytes and explain each.', difficulty: 3, platform: 'local' },
  ],
  build: {
    id: 's04.build',
    name: 'Library System',
    brief:
      'Books + members + issue/return. Each entity is an ADT behind .h/.c with init/destroy; records persist to file across runs; everything valgrind-clean.',
    acceptance: [
      'Three entity ADTs, opaque where sensible',
      'State survives restart (file persistence)',
      'fopen/fread checks everywhere; graceful corrupt-file handling',
      'Zero leaks, zero warnings',
    ],
  },
  traps: [
    { id: 's04.tr1', mistake: 'Copying a struct thinking it is a reference', why: 'struct assignment duplicates; edits hit the copy. Use pointers to share.', quizRefs: ['q.s04.1'] },
    { id: 's04.tr2', mistake: 'Freeing the struct but not its heap members', why: 'the struct itself is stack or freed, but its char* name still leaks. Free members first.', quizRefs: ['q.s04.3'] },
    { id: 's04.tr3', mistake: 'Self-reference by value', why: 'struct Node { struct Node next; } is infinite size — the compiler rejects it. It must be a pointer.', quizRefs: ['q.s04.4'] },
    { id: 's04.tr4', mistake: 'Unchecked fopen/fread', why: 'fopen returns NULL on failure; fread returns fewer items on short reads. Check both or crash mysteriously.', quizRefs: ['q.s04.7'] },
    { id: 's04.tr5', mistake: 'Binary files assumed portable', why: 'struct padding differs between compilers/platforms — a binary dump on one machine may misread on another.', quizRefs: ['q.s04.8'] },
  ],
};
