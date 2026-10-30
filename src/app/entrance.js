"use client";

import { useAnimate } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SESSION_KEY = "hans-filart-portfolio-intro-seen";
const easeOut = [0.22, 1, 0.36, 1];

function readIntroPreference() {
  let seen = false;

  try {
    seen = window.sessionStorage.getItem(SESSION_KEY) === "seen";
  } catch {
    // Storage can be unavailable in private browsing. The sequence still works for this visit.
  }

  return {
    seen,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "seen");
  } catch {
    // The intro can still finish normally when session storage is unavailable.
  }

  document.documentElement.dataset.portfolioIntroSeen = "true";
}

export default function Entrance({ children, introContent }) {
  const [scope, animate] = useAnimate();
  const [entered, setEntered] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const controlsRef = useRef(null);
  const completeRef = useRef(false);
  const skipRequestedRef = useRef(false);

  const completeEntrance = useCallback(() => {
    if (completeRef.current) return;

    completeRef.current = true;
    markIntroSeen();
    setEntered(true);
    setIntroVisible(false);
  }, []);

  const skipEntrance = useCallback(async () => {
    if (completeRef.current) return;

    skipRequestedRef.current = true;
    controlsRef.current?.stop();
    await animate(".intro-overlay", { opacity: 0 }, { duration: 0.24, ease: easeOut });
    completeEntrance();
  }, [animate, completeEntrance]);

  useLayoutEffect(() => {
    const { seen, reducedMotion } = readIntroPreference();

    if (seen || reducedMotion) {
      if (reducedMotion) markIntroSeen();
      completeEntrance();
      return;
    }

    const sequence = animate([
      [".intro-label", { opacity: 1, y: 0 }, { duration: 0.27, ease: easeOut }],
      [".intro-rule", { scaleX: 1 }, { duration: 0.58, ease: easeOut, at: 0.08 }],
      [".intro-copy .intro-name-hans", { y: "0%", opacity: 1 }, { duration: 0.66, ease: easeOut, at: 0.22 }],
      [".intro-copy .intro-name-filart", { y: "0%", opacity: 1 }, { duration: 0.66, ease: easeOut, at: 0.34 }],
      [".intro-role", { opacity: 1, y: 0 }, { duration: 0.3, ease: easeOut, at: 0.83 }],
      [".intro-statement", { opacity: 1, y: 0 }, { duration: 0.32, ease: easeOut, at: 0.98 }],
      [".site-rail", { opacity: 1, x: 0 }, { duration: 0.38, ease: easeOut, at: 0.84 }],
      [".site-topbar", { opacity: 1, y: 0 }, { duration: 0.4, ease: easeOut, at: 0.92 }],
      ['[data-site="hero-copy"]', { opacity: 1 }, { duration: 0.24, ease: easeOut, at: 1.22 }],
      [".site-project", { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }, { duration: 0.62, ease: easeOut, at: 1.04 }],
      [".intro-overlay", { opacity: 0 }, { duration: 0.36, ease: easeOut, at: 1.56 }],
    ]);

    controlsRef.current = sequence;
    let cancelled = false;

    sequence.finished.then(() => {
      if (!cancelled && !skipRequestedRef.current) completeEntrance();
    }).catch(() => {
      if (!cancelled && !skipRequestedRef.current) completeEntrance();
    });

    return () => {
      cancelled = true;
      sequence.stop();
    };
  }, [animate, completeEntrance]);

  useEffect(() => {
    if (!introVisible) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") skipEntrance();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [introVisible, skipEntrance]);

  return (
    <div ref={scope} className="experience-shell" data-ready={entered ? "true" : "false"}>
      {children}
      {introVisible && (
        <div className="intro-overlay" role="group" aria-label="Portfolio introduction">
          <div className="intro-layout">
            <div className="intro-rail-space" aria-hidden="true" />
            <div className="intro-main">
              <div className="intro-top-space" aria-hidden="true" />
              <div className="intro-hero-grid">
                <div className="intro-copy" aria-hidden="true">{introContent}</div>
                <div className="intro-empty-column" aria-hidden="true" />
              </div>
            </div>
          </div>
          <button className="intro-skip" type="button" onClick={skipEntrance}>
            Skip intro <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
    </div>
  );
}
