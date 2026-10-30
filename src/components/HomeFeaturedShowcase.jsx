"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BounceCards from "./BounceCards";
import GearScrollReveal from "./GearScrollReveal";
import StackPlayground from "./StackPlayground";

const HOME_PANEL_REVEAL = {
  distance: 18,
  blur: 6,
  duration: 0.64,
  ease: "power2.out",
  requireScroll: true,
};

function ShowcaseHeading({ number, title, href, action, compact = false }) {
  return (
    <header className="home-showcase__heading">
      <div>
        <p>{compact ? `${number} — ${title.toLowerCase()}` : `${number} / ${title}`}</p>
        {!compact && (
          <h2>{title === "PROJECTS" ? "Selected work" : title === "CERTIFICATIONS" ? "Learning milestones" : "Tools I reach for"}</h2>
        )}
      </div>
      <Link href={href}>{action} <span aria-hidden="true">↗</span></Link>
    </header>
  );
}

function ProjectFace({ project }) {
  return (
    <div className="home-showcase-face home-showcase-face--project">
      <Image src={project.image} alt="" fill sizes="(max-width: 760px) 78vw, 320px" />
      <span className="home-showcase-face__index">{project.number} / PROJECT</span>
      <div className="home-showcase-face__project-copy">
        <small>{project.type}</small>
        <strong>{project.name}</strong>
        <span>{project.description}</span>
      </div>
    </div>
  );
}

function HomeProjectCarousel({ projects, focusedIndex, onFocus, deck }) {
  const middle = 1;
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [keyboardIndex, setKeyboardIndex] = useState(-1);
  const [touchDetailsIndex, setTouchDetailsIndex] = useState(-1);

  return (
    <div
      className="home-project-carousel"
      style={{
        height: deck.containerHeight,
        "--home-project-card-width": `${deck.width}px`,
        "--home-project-card-height": `${deck.height}px`,
      }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured projects. Select a side card to bring it into focus."
    >
      {projects.map((project, index) => {
        const slot = index === focusedIndex ? middle : index === middle ? focusedIndex : index;
        const offset = (slot - middle) * deck.spread;
        const isFocused = index === focusedIndex;
        const rotation = isFocused ? 0 : offset < 0 ? -8 : 8;

        return (
          <button
            className="home-project-carousel__card"
            type="button"
            key={project.number}
            aria-label={`Focus ${project.name}. ${project.description}`}
            aria-pressed={isFocused}
            data-focused={isFocused ? "true" : undefined}
            data-details-open={touchDetailsIndex === index ? "true" : undefined}
            style={{
              transform: `translate(-50%, -50%) translate3d(${offset}px, 0, 0) rotate(${rotation}deg)`,
              zIndex: hoveredIndex === index || keyboardIndex === index ? 4 : isFocused ? 3 : 2,
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHoveredIndex(index);
            }}
            onPointerLeave={() => setHoveredIndex(-1)}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") setTouchDetailsIndex(index);
            }}
            onFocus={() => setKeyboardIndex(index)}
            onBlur={() => setKeyboardIndex(-1)}
            onClick={() => onFocus(index)}
          >
            <ProjectFace project={project} />
          </button>
        );
      })}
    </div>
  );
}

export default function HomeFeaturedShowcase({ projects, certificates, stack }) {
  const [focusedProject, setFocusedProject] = useState(1);
  const [projectDeck, setProjectDeck] = useState({ spread: 164, width: 330, height: 264, containerHeight: 312 });
  const [secondaryDeck, setSecondaryDeck] = useState({ spread: 164, width: 330, height: 250, containerHeight: 312 });
  const showcaseRef = useRef(null);
  const projectPanelRef = useRef(null);

  useEffect(() => {
    const roots = Array.from(showcaseRef.current?.querySelectorAll(".home-project-carousel, .home-showcase-bounce") ?? []);
    const projectRoot = projectPanelRef.current?.querySelector(".home-project-carousel");
    if (!projectRoot || !roots.length) return undefined;

    const updateDeck = () => {
      const projectRootWidth = projectRoot.clientWidth;
      if (!projectRootWidth) return;
      const width = Math.min(330, window.innerWidth * 0.76, projectRootWidth * 0.76);
      const height = width * 0.8;
      const rotatedWidth = width * 0.988 + height * 0.156;
      const spread = Math.max(0, Math.min(164, (projectRootWidth - rotatedWidth) / 2 - 2));
      const containerHeight = Math.max(248, height + 48);
      setProjectDeck((current) => (
        Math.abs(current.spread - spread) < 1
          && Math.abs(current.width - width) < 1
          ? current
          : { spread, width, height, containerHeight }
      ));

      const narrowestSecondaryRoot = roots
        .filter((root) => root !== projectRoot)
        .reduce((narrowest, root) => Math.min(narrowest, root.clientWidth || narrowest), Infinity);
      if (Number.isFinite(narrowestSecondaryRoot)) {
        const secondaryWidth = Math.min(330, window.innerWidth * 0.78, narrowestSecondaryRoot * 0.76);
        const secondaryHeight = Math.min(250, secondaryWidth * 0.758);
        const secondaryRotatedWidth = secondaryWidth * 0.988 + secondaryHeight * 0.156;
        const secondaryCardSpread = Math.max(0, Math.min(226, (narrowestSecondaryRoot - secondaryRotatedWidth) / 2 - 2));
        const secondaryContainerHeight = Math.max(248, secondaryHeight + 48);
        setSecondaryDeck((current) => (
          Math.abs(current.spread - secondaryCardSpread) < 1
            && Math.abs(current.width - secondaryWidth) < 1
            ? current
            : {
              spread: secondaryCardSpread,
              width: secondaryWidth,
              height: secondaryHeight,
              containerHeight: secondaryContainerHeight,
            }
        ));
      }
    };

    updateDeck();
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(updateDeck) : null;
    roots.forEach((root) => resizeObserver?.observe(root));
    window.addEventListener("resize", updateDeck, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateDeck);
    };
  }, []);

  const certificateCards = certificates.slice(0, 3).map((certificate) => ({
    src: certificate.src,
    alt: `${certificate.title}. ${certificate.issuer}`,
    objectFit: "contain",
  }));
  const featuredStackItems = stack.slice(0, 6).map((item, index) => ({
    ...item,
    mark: item.mark ?? item.name.slice(0, 2).toUpperCase(),
    group: item.area,
    detail: item.highlight,
    categoryLabel: item.area.split(" ")[0],
    categoryIndex: index,
  }));

  const deckProps = {
    containerWidth: 860,
    containerHeight: secondaryDeck.containerHeight,
    cardWidth: secondaryDeck.width,
    cardHeight: secondaryDeck.height,
    spread: secondaryDeck.spread,
    rotation: 9,
    arc: 3,
    animationDelay: 0.3,
    animationStagger: 0.12,
    bounciness: 0.55,
    hoverScale: 1.035,
    pushDistance: 42,
    borderWidth: 1,
    borderColor: "rgba(168, 185, 159, 0.34)",
    radius: 18,
    style: {
      width: "min(100%, 860px)",
      height: secondaryDeck.containerHeight,
      "--bounce-cards-width": `${secondaryDeck.width}px`,
      "--bounce-cards-height": `${secondaryDeck.height}px`,
    },
  };
  return (
    <section ref={showcaseRef} className="home-featured-snapshot" aria-label="Featured projects, certifications, and technology stack">
      <div className="home-featured-snapshot__grid">
        <GearScrollReveal
          {...HOME_PANEL_REVEAL}
          className="home-featured-panel-reveal home-featured-panel-reveal--projects"
          targetSelector="section > *"
          stagger={0.055}
          threshold={0.12}
        >
        <section
          ref={projectPanelRef}
          className="home-feature-panel home-feature-panel--showcase home-feature-panel--projects"
         
          aria-label="Featured projects"
        >
          <ShowcaseHeading number="02" title="PROJECTS" href="/Projects" action="ALL PROJECTS" compact />
          <HomeProjectCarousel
            projects={projects.slice(0, 3)}
            focusedIndex={focusedProject}
            onFocus={setFocusedProject}
            deck={projectDeck}
          />
        </section>
        </GearScrollReveal>

        <GearScrollReveal
          {...HOME_PANEL_REVEAL}
          className="home-featured-panel-reveal"
          targetSelector="section > *"
          stagger={0.055}
          threshold={0.16}
        >
        <section className="home-feature-panel home-feature-panel--showcase" aria-label="Selected certificates">
          <ShowcaseHeading number="09" title="CERTIFICATIONS" href="/Certification" action="ALL CERTIFICATES" />
          <p className="home-showcase__description">Three learning milestones from my studies and community.</p>
          <BounceCards
            {...deckProps}
            className="home-showcase-bounce home-showcase-bounce--certificates"
            images={certificateCards}
          />
          <p className="home-showcase__hint">SELECTED CERTIFICATES · 03</p>
        </section>
        </GearScrollReveal>

        <GearScrollReveal
          {...HOME_PANEL_REVEAL}
          className="home-featured-panel-reveal"
          targetSelector="section > *"
          stagger={0.055}
          threshold={0.16}
        >
        <section className="home-feature-panel home-feature-panel--showcase" aria-label="Selected tools and technologies">
          <ShowcaseHeading number="03" title="STACK" href="/Stack" action="ALL TECHNOLOGIES" />
          <p className="home-showcase__description">The tools I use most across web development and backend work.</p>
          <StackPlayground
            className="stack-playground--home"
            items={featuredStackItems}
            showToolbar={false}
            showHint={false}
            showResetButton
          />
        </section>
        </GearScrollReveal>
        <div className="home-dot-divider home-dot-divider--stack" data-lines="3" aria-hidden="true" />
      </div>
    </section>
  );
}
