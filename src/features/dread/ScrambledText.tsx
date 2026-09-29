import { useEffect, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * ScrambledText — text resolves from glyph noise (Phase 6 RoastOverlay).
 * U9: renders plain text immediately under prefers-reduced-motion.
 */
export function ScrambledText({ text, speed = 28 }: { text: string; speed?: number }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [out, setOut] = useState(reduced ? text : '');

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = text.length;
    const iv = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 2);
      let next = '';
      for (let i = 0; i < total; i++) {
        if (text[i] === ' ' || i < settled) next += text[i];
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(next);
      if (settled >= total) window.clearInterval(iv);
    }, speed);
    return () => window.clearInterval(iv);
  }, [text, speed, reduced]);

  return <span aria-label={text}>{out}</span>;
}
