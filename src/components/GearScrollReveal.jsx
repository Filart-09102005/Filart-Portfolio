'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function GearScrollReveal({
  children,
  className = '',
  targetSelector = '',
  animatePosition = true,
  distance = 20,
  blur = 7,
  duration = 0.75,
  delay = 0,
  initialDelay = 0,
  stagger = 0,
  threshold = 0.45,
  ease = 'power2.out',
  requireScroll = false,
  enabled = true,
  skipIfIntroSeen = false,
  persistKey = '',
  onRevealComplete,
}) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const targets = targetSelector
      ? Array.from(element.querySelectorAll(targetSelector))
      : Array.from(element.children);
    if (!targets.length) return undefined;

    let revealed = false;
    let prepared = false;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const introAlreadySeen = document.documentElement.dataset.portfolioIntroSeen === 'true';
    const clearAnimatedStyles = () => {
      const clearProps = `opacity,visibility,${animatePosition ? 'transform,' : ''}filter`;
      try {
        gsap.killTweensOf(targets);
      } catch {
        // Continue to the direct-style fallback below if GSAP is unavailable.
      }
      try {
        gsap.set(targets, { clearProps });
      } catch {
        targets.forEach((target) => {
          target.style.opacity = '1';
          target.style.visibility = 'visible';
          target.style.filter = 'none';
          if (animatePosition) target.style.removeProperty('transform');
        });
      }
    };
    const revealImmediately = () => {
      clearAnimatedStyles();
      element.dataset.prepared = 'true';
      element.dataset.revealed = 'true';
      onRevealComplete?.();
    };
    let wasPersistentlyRevealed = false;

    if (persistKey) {
      try {
        wasPersistentlyRevealed = window.sessionStorage.getItem(persistKey) === 'seen';
      } catch {
        // The reveal still works for this visit when session storage is unavailable.
      }
    }

    if (prefersReducedMotion || (skipIfIntroSeen && introAlreadySeen) || wasPersistentlyRevealed) {
      revealImmediately();
      return undefined;
    }

    if (!enabled) {
      try {
        gsap.set(targets, {
          autoAlpha: 0,
          ...(animatePosition ? { y: distance } : {}),
          filter: `blur(${blur}px)`,
        });
        element.dataset.prepared = 'true';
      } catch {
        revealImmediately();
      }
      return undefined;
    }

    let didScroll = window.scrollY > 2;
    let frame = 0;
    let observer;

    const prepare = () => {
      if (prepared) return;
      prepared = true;
      try {
        gsap.set(targets, {
          autoAlpha: 0,
          ...(animatePosition ? { y: distance } : {}),
          filter: `blur(${blur}px)`,
        });
        element.dataset.prepared = 'true';
      } catch {
        revealed = true;
        revealImmediately();
      }
    };

    const checkPosition = () => {
      if (revealed || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = element.getBoundingClientRect();
        const revealLine = window.innerHeight * (1 - threshold);

        if (bounds.top <= revealLine && (!requireScroll || didScroll || window.scrollY > 2)) {
          reveal();
        } else {
          prepare();
        }
      });
    };

    const onCapturedScroll = () => {
      didScroll = true;
      checkPosition();
    };

    const onPageShow = () => {
      didScroll = window.scrollY > 2;
      checkPosition();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkPosition();
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      observer?.disconnect();
      window.removeEventListener('scroll', checkPosition);
      document.removeEventListener('scroll', onCapturedScroll, true);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('resize', checkPosition);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      try {
        gsap.fromTo(
          targets,
          {
            autoAlpha: 0,
            ...(animatePosition ? { y: distance } : {}),
            filter: `blur(${blur}px)`,
          },
          {
            autoAlpha: 1,
            ...(animatePosition ? { y: 0 } : {}),
            filter: 'blur(0px)',
            duration,
            delay: !didScroll && window.scrollY <= 2 ? initialDelay : delay,
            stagger,
            ease,
            clearProps: `opacity,visibility,${animatePosition ? 'transform,' : ''}filter`,
            onComplete: () => {
              if (persistKey) {
                try {
                  window.sessionStorage.setItem(persistKey, 'seen');
                } catch {
                  // The element remains revealed for this mount if storage is unavailable.
                }
              }
              element.dataset.revealed = 'true';
              onRevealComplete?.();
            },
          },
        );
      } catch {
        revealImmediately();
      }
    };

    prepare();
    if (revealed) return undefined;
    window.addEventListener('scroll', checkPosition, { passive: true });
    document.addEventListener('scroll', onCapturedScroll, { capture: true, passive: true });
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('resize', checkPosition);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if ('IntersectionObserver' in window) {
      const rootMarginBottom = Math.round(window.innerHeight * threshold);
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting) && (!requireScroll || didScroll || window.scrollY > 2)) reveal();
        },
        { rootMargin: `0px 0px -${rootMarginBottom}px 0px`, threshold: 0.01 },
      );
      observer.observe(element);
    }

    checkPosition();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', checkPosition);
      document.removeEventListener('scroll', onCapturedScroll, true);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('resize', checkPosition);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
      gsap.killTweensOf(targets);
      gsap.set(targets, {
        clearProps: `opacity,visibility,${animatePosition ? 'transform,' : ''}filter`,
      });
      delete element.dataset.prepared;
      delete element.dataset.revealed;
    };
  }, [animatePosition, blur, delay, distance, duration, ease, enabled, initialDelay, onRevealComplete, persistKey, requireScroll, skipIfIntroSeen, stagger, targetSelector, threshold]);

  return <div ref={ref} className={className}>{children}</div>;
}
