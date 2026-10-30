'use client';

import { useLayoutEffect } from 'react';

export default function GearScrollReset() {
  useLayoutEffect(() => {
    let resetFrame = 0;
    let resetTimer = 0;

    const resetScroll = () => {
      const root = document.documentElement;
      const body = document.body;
      const rootBehavior = root.style.scrollBehavior;
      const bodyBehavior = body?.style.scrollBehavior;

      root.style.scrollBehavior = 'auto';
      if (body) body.style.scrollBehavior = 'auto';

      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }

      root.scrollTop = 0;
      if (body) body.scrollTop = 0;
      root.style.scrollBehavior = rootBehavior;
      if (body) body.style.scrollBehavior = bodyBehavior;
    };

    const resetAfterRestoration = () => {
      resetScroll();
      if (resetFrame) window.cancelAnimationFrame(resetFrame);
      if (resetTimer) window.clearTimeout(resetTimer);
      resetFrame = window.requestAnimationFrame(resetScroll);
      resetTimer = window.setTimeout(resetScroll, 120);
    };

    const handlePageShow = (event) => {
      if (!event.persisted) resetAfterRestoration();
    };

    resetAfterRestoration();
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if (resetFrame) window.cancelAnimationFrame(resetFrame);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, []);

  return null;
}
