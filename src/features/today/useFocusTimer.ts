import { useEffect, useRef, useState } from 'react';
import { loadData, saveData } from '../../lib/storage';
import type { AppData } from '../../lib/schema';

export type FocusState = 'idle' | 'running' | 'paused';

/** Sessions under 30s are noise, not study. */
const MIN_JOURNAL_SECONDS = 30;

export function fmtClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * U7: a plain stopwatch. Start/pause/resume/log; every finished chunk is
 * journaled into focusSessions (date, minutes, strict). Journaling happens
 * on Log, on pagehide, and on unmount — never lost to a refresh mid-session.
 */
export function useFocusTimer(today: string) {
  const [state, setState] = useState<FocusState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [strict, setStrictState] = useState(false);

  const stateRef = useRef<FocusState>('idle');
  const strictRef = useRef(false);
  const startedAtRef = useRef(0);
  const accRef = useRef(0);
  const todayRef = useRef(today);
  todayRef.current = today;

  const apply = (s: FocusState): void => {
    stateRef.current = s;
    setState(s);
  };

  useEffect(() => {
    if (state !== 'running') return;
    const iv = window.setInterval(() => {
      setElapsed(accRef.current + Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [state]);

  function journalNow(): void {
    const secs =
      accRef.current +
      (stateRef.current === 'running' ? Math.floor((Date.now() - startedAtRef.current) / 1000) : 0);
    if (secs < MIN_JOURNAL_SECONDS) return;
    const d: AppData = loadData();
    d.focusSessions.push({
      date: todayRef.current,
      minutes: Math.round(secs / 60),
      strict: strictRef.current,
    });
    saveData(d);
  }

  const start = (): void => {
    accRef.current = 0;
    setElapsed(0);
    startedAtRef.current = Date.now();
    apply('running');
  };
  const pause = (): void => {
    if (stateRef.current !== 'running') return;
    accRef.current += Math.floor((Date.now() - startedAtRef.current) / 1000);
    setElapsed(accRef.current);
    apply('paused');
  };
  const resume = (): void => {
    if (stateRef.current !== 'paused') return;
    startedAtRef.current = Date.now();
    apply('running');
  };
  const finish = (): void => {
    journalNow();
    accRef.current = 0;
    setElapsed(0);
    apply('idle');
  };

  useEffect(() => {
    const onHide = (): void => journalNow();
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      journalNow();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    elapsed,
    strict,
    setStrict: (v: boolean): void => {
      strictRef.current = v;
      setStrictState(v);
    },
    start,
    pause,
    resume,
    finish,
  };
}
