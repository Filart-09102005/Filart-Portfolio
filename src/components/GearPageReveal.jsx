'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import GearScrollReveal from './GearScrollReveal';
import GearScrollReset from './GearScrollReset';

function GearCard({ item }) {
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const markImageLoaded = useCallback(() => setImageLoaded(true), []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete || image.naturalWidth <= 0) return undefined;

    const frame = window.requestAnimationFrame(markImageLoaded);
    return () => window.cancelAnimationFrame(frame);
  }, [item.image, markImageLoaded]);

  return (
    <article className="gear-card">
      <div className="gear-card__image">
        <Image
          ref={imageRef}
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 560px) 44vw, (max-width: 1050px) 42vw, 360px"
          className={`gear-card__image-media${imageLoaded ? ' gear-card__image-media--loaded' : ''}`}
          onLoad={markImageLoaded}
          onError={markImageLoaded}
        />
      </div>
      <div className="gear-card__copy">
        <p className="gear-card__brand">{item.brand}</p>
        <h3>{item.name}</h3>
        <p className="gear-card__description">{item.description}</p>
      </div>
    </article>
  );
}

export default function GearPageReveal({ deskSetupGear, everydayCarryGear }) {
  const [headerComplete, setHeaderComplete] = useState(false);
  const [deskHeadingComplete, setDeskHeadingComplete] = useState(false);
  const [deskGridComplete, setDeskGridComplete] = useState(false);
  const [carryHeadingComplete, setCarryHeadingComplete] = useState(false);

  const completeHeader = useCallback(() => setHeaderComplete(true), []);
  const completeDeskHeading = useCallback(() => setDeskHeadingComplete(true), []);
  const completeDeskGrid = useCallback(() => setDeskGridComplete(true), []);
  const completeCarryHeading = useCallback(() => setCarryHeadingComplete(true), []);

  return (
    <section className="gear-page content-section" aria-labelledby="gear-title">
      <GearScrollReset />
      <header className="gear-page__header">
        <GearScrollReveal
          className="gear-page__header-reveal"
          stagger={0.14}
          duration={0.72}
          distance={18}
          blur={6}
          ease="power2.out"
          threshold={0.12}
          onRevealComplete={completeHeader}
        >
          <p className="gear-page__eyebrow">04 / GEAR</p>
          <h1 id="gear-title">Gear</h1>
          <p>The hardware and tools I use to build, create, and stay productive, including my desk setup, everyday carry, and the kit I shoot content with.</p>
        </GearScrollReveal>
      </header>
      <div className="gear-collections">
        <section className="gear-group" aria-labelledby="desk-setup-title">
          <GearScrollReveal
            className="gear-group__heading"
            enabled={headerComplete}
            stagger={0.12}
            duration={0.68}
            distance={18}
            blur={6}
            ease="power2.out"
            threshold={0.18}
            onRevealComplete={completeDeskHeading}
          >
            <h2 id="desk-setup-title">Desk Setup</h2>
            <span>05 ITEMS</span>
          </GearScrollReveal>
          <GearScrollReveal
            className="gear-grid"
            enabled={deskHeadingComplete}
            stagger={0.14}
            duration={0.72}
            distance={18}
            blur={6}
            ease="power2.out"
            threshold={0.2}
            onRevealComplete={completeDeskGrid}
          >
            {deskSetupGear.map((item) => <GearCard key={item.name} item={item} />)}
          </GearScrollReveal>
        </section>

        <section className="gear-group" aria-labelledby="everyday-carry-title">
          <GearScrollReveal
            className="gear-group__heading"
            enabled={deskGridComplete}
            stagger={0.12}
            duration={0.68}
            distance={18}
            blur={6}
            ease="power2.out"
            threshold={0.18}
            onRevealComplete={completeCarryHeading}
          >
            <h2 id="everyday-carry-title">Everyday Carry</h2>
            <span>02 ITEMS</span>
          </GearScrollReveal>
          <GearScrollReveal
            className="gear-grid"
            enabled={carryHeadingComplete}
            stagger={0.14}
            duration={0.72}
            distance={18}
            blur={6}
            ease="power2.out"
            threshold={0.2}
          >
            {everydayCarryGear.map((item) => <GearCard key={item.name} item={item} />)}
          </GearScrollReveal>
        </section>
      </div>
    </section>
  );
}
