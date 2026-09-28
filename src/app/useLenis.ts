import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Lenis inertial scrolling (decision 16).
 * Hard-disabled under prefers-reduced-motion (U9) — native scroll takes over.
 */
export function useLenis(): void {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
    });

    const onChange = (e: MediaQueryListEvent): void => {
      if (e.matches) lenis.destroy();
    };
    mq.addEventListener('change', onChange);

    return () => {
      mq.removeEventListener('change', onChange);
      lenis.destroy();
    };
  }, []);
}
