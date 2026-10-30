'use client';

import { useCallback, useState } from 'react';
import GearScrollReveal from './GearScrollReveal';
import StackPlayground from './StackPlayground';

export default function StackPageReveal({ items }) {
  const [headerComplete, setHeaderComplete] = useState(false);
  const [playgroundReady, setPlaygroundReady] = useState(false);
  const completeHeader = useCallback(() => setHeaderComplete(true), []);
  const revealPlayground = useCallback(() => setPlaygroundReady(true), []);

  return (
    <section className="stack-page content-section" aria-labelledby="stack-title">
      <header className="stack-page__header">
        <GearScrollReveal
          className="stack-page__header-reveal"
          targetSelector=".stack-page__eyebrow p, .stack-page__eyebrow > span, .stack-page__intro h1, .stack-page__intro > p"
          stagger={0.18}
          distance={18}
          blur={6}
          duration={0.96}
          delay={0.08}
          initialDelay={0.12}
          ease="power3.out"
          threshold={0.18}
          onRevealComplete={completeHeader}
        >
          <div className="stack-page__eyebrow">
            <p><span>03</span> / STACKS</p>
            <span>TOOLS SHAPE IDEAS</span>
          </div>
          <div className="stack-page__intro">
            <h1 id="stack-title">Technology<br /><span>stack.</span></h1>
            <p>A practical mix of tools I use to build web and mobile projects, work with data, and keep learning.</p>
          </div>
        </GearScrollReveal>
      </header>

      <GearScrollReveal
        className="stack-page__playground-reveal"
        targetSelector=".stack-playground"
        enabled={headerComplete}
        distance={18}
        blur={6}
        duration={0.88}
        ease="power2.out"
        threshold={0.16}
        onRevealComplete={revealPlayground}
      >
        <StackPlayground items={items} revealSequence revealEnabled={playgroundReady} />
      </GearScrollReveal>
    </section>
  );
}
