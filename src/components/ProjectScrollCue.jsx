'use client';

import { useEffect, useRef } from 'react';

export default function ProjectScrollCue() {
  const ref = useRef(null);

  useEffect(() => {
    const cue = ref.current;
    if (!cue) return undefined;

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        cue.classList.toggle('projects-scroll-cue--hidden', cue.getBoundingClientRect().bottom <= 0);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="projects-scroll-cue" ref={ref}>
      <span>Scroll below to see effect</span>
      <span className="projects-scroll-cue__line" aria-hidden="true" />
    </div>
  );
}
