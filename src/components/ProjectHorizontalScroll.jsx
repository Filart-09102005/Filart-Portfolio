'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ProjectHorizontalScroll({ children }) {
  const sceneRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const scene = sceneRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!scene || !viewport || !track) return undefined;

    const page = scene.closest('.projects-page');
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const items = Array.from(track.querySelectorAll('[data-project-item]'));
      const line = track.querySelector('[data-project-line-fill]');
      if (!items.length || !line) return undefined;

      let timeline;
      let refreshTimer;
      let previousWidth = 0;
      let previousTrackWidth = 0;
      let resizeFrame = 0;

      const revealParts = items.map((item) => ({
        item,
        visual: item.querySelector('[data-project-visual]'),
        marker: item.querySelector('[data-project-marker]'),
        copy: item.querySelector('[data-project-copy]'),
      }));

      const buildTimeline = () => {
        const viewportWidth = viewport.clientWidth;
        const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 32;
        const endGutter = Number.parseFloat(window.getComputedStyle(track).paddingRight) || 0;
        const cardWidth = window.matchMedia('(max-width: 700px)').matches
          ? Math.min(390, Math.max(270, viewportWidth * 0.9))
          : Math.max(180, (viewportWidth - gap * 2 - endGutter) / 3);
        viewport.style.setProperty('--project-card-width', `${cardWidth}px`);
        const trackWidth = track.scrollWidth;
        const travel = Math.max(trackWidth - viewportWidth, 0);
        const firstItemWidth = items[0]?.offsetWidth ?? 0;
        const initialVisibleCount = Math.min(
          items.length,
          3,
          Math.max(1, Math.floor((viewportWidth + gap) / (firstItemWidth + gap))),
        );
        const revealDistance = Math.max(firstItemWidth * 0.9, 160);

        if (timeline) {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          timeline = undefined;
        }

        previousWidth = viewportWidth;
        previousTrackWidth = trackWidth;
        gsap.set(track, { x: 0 });
        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

        revealParts.forEach(({ visual, marker, copy }) => {
          gsap.set(visual, { autoAlpha: 0, y: -28, filter: 'blur(5px)' });
          gsap.set(marker, { autoAlpha: 0, y: -10, scale: 0.55, transformOrigin: 'center center' });
          gsap.set(copy, { autoAlpha: 0, y: 24, filter: 'blur(5px)' });
        });

        if (travel <= 1) {
          scene.classList.remove('projects-horizontal--enhanced');
          page?.style.removeProperty('padding-bottom');
          revealParts.forEach(({ visual, marker, copy }) => {
            gsap.set([visual, marker, copy], { clearProps: 'all' });
          });
          return;
        }

        let previousX = 0;
        const phases = revealParts.map(({ item, visual, marker, copy }, index) => {
          const lineProgress = Math.min(
            1,
            Math.max(0, (item.offsetLeft + item.offsetWidth - 14) / Math.max(trackWidth - 28, 1)),
          );
          let targetX = previousX;
          let advanceDistance = 0;

          if (index >= initialVisibleCount) {
            const desiredLeft = Math.max(0, viewportWidth - endGutter - item.offsetWidth);
            targetX = Math.max(-travel, desiredLeft - item.offsetLeft);
            advanceDistance = Math.abs(targetX - previousX);
          }

          const transitionDistance = index >= initialVisibleCount
            ? Math.max(advanceDistance, revealDistance)
            : 0;
          const phaseDistance = Math.max(transitionDistance, revealDistance);
          previousX = targetX;

          return {
            item,
            visual,
            marker,
            copy,
            targetX,
            transitionDistance,
            phaseDistance,
            lineProgress,
          };
        });
        const sequenceDistance = phases.reduce((distance, phase) => distance + phase.phaseDistance, 0);

        const intro = scene.previousElementSibling;
        const introGap = intro
          ? Number.parseFloat(window.getComputedStyle(intro).marginBottom) || 0
          : 0;
        const releaseSpace = Math.max(
          0,
          window.innerHeight - scene.getBoundingClientRect().height - introGap + 1,
        );
        page?.style.setProperty('padding-bottom', `${Math.ceil(releaseSpace)}px`);

        scene.classList.add('projects-horizontal--enhanced');

        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: () => {
              const intro = scene.previousElementSibling;
              const cueGap = intro ? scene.getBoundingClientRect().top - intro.getBoundingClientRect().bottom : 0;
              return `top ${Math.max(cueGap, 0)}px`;
            },
            end: () => `+=${Math.max(sequenceDistance, 1)}`,
            scrub: true,
            pin: scene,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        let cursor = 0;
        phases.forEach(({ visual, marker, copy, targetX, transitionDistance, phaseDistance, lineProgress }) => {
          if (transitionDistance > 0) {
            timeline.to(track, { x: targetX, duration: transitionDistance, ease: 'none' }, cursor);
          }

          timeline.to(line, { scaleX: lineProgress, duration: revealDistance, ease: 'none' }, cursor);
          timeline.fromTo(visual,
            { autoAlpha: 0, y: -28, filter: 'blur(5px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: revealDistance, ease: 'none', immediateRender: false },
            cursor,
          );
          timeline.fromTo(marker,
            { autoAlpha: 0, y: -10, scale: 0.82, transformOrigin: 'center center' },
            { autoAlpha: 1, y: 0, scale: 1, duration: revealDistance, ease: 'none', immediateRender: false },
            cursor,
          );
          timeline.fromTo(copy,
            { autoAlpha: 0, y: 24, filter: 'blur(5px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: revealDistance, ease: 'none', immediateRender: false },
            cursor,
          );

          cursor += phaseDistance;
        });

        ScrollTrigger.refresh();
      };

      const scheduleRefresh = () => {
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0;
          const width = viewport.clientWidth;
          const trackWidth = track.scrollWidth;
          if (Math.abs(width - previousWidth) > 1 || Math.abs(trackWidth - previousTrackWidth) > 1) {
            buildTimeline();
            ScrollTrigger.refresh();
          }
        });
      };

      buildTimeline();
      const resizeObserver = new ResizeObserver(scheduleRefresh);
      resizeObserver.observe(viewport);
      resizeObserver.observe(track);

      // The page entrance animation finishes shortly after mount; refresh once it releases its transform.
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 850);

      return () => {
        resizeObserver.disconnect();
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        if (refreshTimer) window.clearTimeout(refreshTimer);
        timeline?.scrollTrigger?.kill();
        timeline?.kill();
        page?.style.removeProperty('padding-bottom');
        scene.classList.remove('projects-horizontal--enhanced');
        gsap.set([track, line, ...items], { clearProps: 'all' });
        gsap.set(items.flatMap((item) => Array.from(item.querySelectorAll('[data-project-visual], [data-project-marker], [data-project-copy]'))), { clearProps: 'all' });
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className="projects-horizontal" ref={sceneRef} aria-label="Project timeline">
      <div className="projects-horizontal__viewport" ref={viewportRef} tabIndex={0} aria-label="Portfolio projects arranged in a horizontal timeline">
        <div className="projects-horizontal__track" ref={trackRef}>
          <span className="projects-horizontal__line" aria-hidden="true">
            <span data-project-line-fill />
          </span>
          {children}
        </div>
      </div>
    </section>
  );
}
