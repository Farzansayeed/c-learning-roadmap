import { maxRoastTier } from '../engines/dread';

/**
 * Roast corpus — v2's personality, ported and re-tiered.
 * Tier 1 = light, Tier 5 = ELDRITCH. The intensity dial caps the tier
 * (mild ≤2, spicy ≤4, nuclear 5) per DESIGN decision 2.
 */

export const PRAISE = [
  'Target smashed. Streak alive. Future self just exhaled.',
  'Done and dusted. That is how days should end.',
  'Clean close. The compiler approves. So do I, briefly.',
  'Every box answered. Somewhere far away, something stopped smiling.',
  'Full marks. The forge almost purred. Do not get sentimental about it.',
];

export const ROASTS: { tier: 1 | 2 | 3 | 4 | 5; lines: string[] }[] = [
  {
    tier: 1,
    lines: [
      'One wasted day is survivable. The tragedy is if it becomes a hobby.',
      'A single lost day. Almost polite, as failures go. The ledger still wrote it down.',
      'Day one of what? Too early to call it a spiral. The paper trail got one page longer.',
    ],
  },
  {
    tier: 2,
    lines: [
      'Twice is a coincidence. Three times is a lifestyle. You are currently shopping for the lifestyle.',
      'Two days rotting in sequence. Whatever picked through yesterday found nothing compiled and one fully charged battery.',
      'The stench of two wasted days reached the higher shelves of the ledger. Even the excuses up there are holding their noses.',
    ],
  },
  {
    tier: 3,
    lines: [
      'It followed you to bed last night. It read your notes. All blank.',
      'Day three. Something has learned your sleep schedule, your scroll rhythm, the exact pitch of your sigh when a build fails.',
      'Three down. The roadmap bent around your absence like a river around a stone — smooth, practiced, indifferent.',
    ],
  },
  {
    tier: 4,
    lines: [
      'Something wearing your face walked into this room while you were doom-scrolling and studied NOTHING.',
      'Four days. The thing that wears your face has started attending your imaginary meetings. It is everything you were supposed to become this week.',
      'Day four bled into day five somewhere around your third meaningless refresh. There are stains on the ceiling shaped like every chapter you skipped.',
    ],
  },
  {
    tier: 5,
    lines: [
      'THE LEDGER IS FULL. THE PAGES ARE YOUR SKIN. KEEP WRITING.',
      'Seven days of silence from your desk. The dust has been catalogued by something patient and scientific.',
      'There is a version of you that finished Stage 1 weeks ago. It stands behind your chair at 3AM doing revision you refused to do.',
    ],
  },
];

export const GHOST_LINES = [
  'Never closed the day. Ghosted your own tracker like it texts first.',
  'The day died unattended. Things ate well that night.',
  'The chair is still warm. Whatever sat in it folded their hands politely and waited for us to notice.',
];

export const EXCUSES = {
  valid: [
    { id: 'college', label: 'College assignments/exams are piling up' },
    { id: 'sick', label: 'I am actually not feeling well' },
    { id: 'family', label: 'Family function / something came up' },
    { id: 'guests', label: 'Guests arrived' },
    { id: 'power', label: 'Power or internet died' },
  ],
  invalid: [
    { id: 'scroll', label: 'Just 5 minutes of reels' },
    { id: 'episode', label: 'One episode will not hurt' },
    { id: 'double', label: 'I will double up tomorrow' },
    { id: 'motivation', label: 'Not feeling motivated today' },
    { id: 'tired', label: 'Too tired anyway' },
    { id: 'brainrest', label: 'Brain needs rest' },
  ],
  customResponses: [
    'Original enough to frame. Framed it. The wall of failure appreciates art.',
    'An excuse of your own crafting. The ledger files it under "artisanal".',
  ],
} as const;

let lastPick = -1;

/** Deterministic-enough non-repeating pick within the allowed tier. */
export function pickRoast(intensity: 'mild' | 'spicy' | 'nuclear', badDays: number): { tier: number; line: string } {
  const cap = maxRoastTier(intensity);
  const tier = Math.min(cap, Math.max(1, badDays)) as 1 | 2 | 3 | 4 | 5;
  const pool = ROASTS.find((r) => r.tier === tier)!.lines;
  let i = Math.floor(Math.random() * pool.length);
  if (i === lastPick && pool.length > 1) i = (i + 1) % pool.length;
  lastPick = i;
  return { tier, line: pool[i] };
}

export function pickPraise(): string {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)];
}
