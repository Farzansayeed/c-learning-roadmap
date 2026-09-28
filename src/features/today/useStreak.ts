import { useMemo } from 'react';
import { consecutiveBadDays, studyStreak } from '../../engines/dread';
import { loadData } from '../../lib/storage';
import { useDaily } from '../../stores/daily';
import { useProgress } from '../../stores/progress';

export interface Streak {
  /** consecutive past days with progress */
  value: number;
  /** consecutive bad days (for the ☠ state) */
  bad: number;
  /** today already closed as pass */
  hot: boolean;
  /** today already closed as fail */
  dead: boolean;
}

/** Recomputes whenever progress or the daily verdict changes. */
export function useStreak(): Streak {
  const checkedIds = useProgress((s) => s.checkedIds);
  const today = useDaily((s) => s.today);
  const verdict = useDaily((s) => s.verdict);
  return useMemo(() => {
    const d = loadData();
    return {
      value: studyStreak(d, today),
      bad: consecutiveBadDays(d, today),
      hot: verdict === 'pass',
      dead: verdict === 'fail',
    };
    // checkedIds is a dependency on purpose: any toggle re-fires the computation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedIds, today, verdict]);
}
