import { describe, expect, it } from 'vitest';
import { rankOf } from './xp';

describe('xp ranks', () => {
  it('starts at Script Kiddie', () => {
    expect(rankOf(0).name).toBe('Script Kiddie');
    expect(rankOf(149).name).toBe('Script Kiddie');
  });

  it('crosses each threshold exactly at min', () => {
    expect(rankOf(150).name).toBe('Apprentice');
    expect(rankOf(500).name).toBe('Journeyman');
    expect(rankOf(7500).name).toBe('Forge Legend');
  });

  it('progress saturates at the top rank', () => {
    const top = rankOf(999999);
    expect(top.next).toBeNull();
    expect(top.progress).toBe(1);
  });

  it('progress is a clean fraction mid-rank', () => {
    expect(rankOf(325).progress).toBeCloseTo(0.5, 5); // halfway 150→500
  });
});
