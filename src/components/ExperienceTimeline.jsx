"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ExperienceTimeline({ entries }) {
  const timelineRef = useRef(null);

  useGSAP(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(timelineElement.querySelectorAll("[data-experience-entry]"));
    const line = timelineElement.querySelector("[data-experience-line]");
    const progressLine = timelineElement.querySelector("[data-experience-progress]");
    const comet = timelineElement.querySelector("[data-experience-comet]");
    if (!items.length || !line || !progressLine || !comet) return;

    const markers = items.map((item) => item.querySelector("[data-experience-marker]"));
    const markerGlows = markers.map((marker) => marker.querySelector("[data-experience-marker-glow]"));
    const connectors = items.map((item) => item.querySelector("[data-experience-connector]"));
    const copyGroups = items.map((item) => Array.from(item.querySelectorAll("[data-experience-copy]")));
    const lineBounds = line.getBoundingClientRect();
    const totalUnits = items.length * 1.35;
    const markerStops = markers.map((marker) => {
      const bounds = marker.getBoundingClientRect();
      const fraction = (bounds.top + bounds.height / 2 - lineBounds.top) / Math.max(1, lineBounds.height);
      return Math.max(0, Math.min(totalUnits, fraction * totalUnits));
    });

    gsap.set(progressLine, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(comet, { y: 0, force3D: true });
    gsap.set(markers, { opacity: 0, scale: 0.55, transformOrigin: "center center" });
    gsap.set(markerGlows, { opacity: 0, scale: 0.45, transformOrigin: "center center" });
    connectors.forEach((connector, index) => {
      gsap.set(connector, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: items[index].classList.contains("experience-entry--left") ? "right center" : "left center",
      });
    });
    gsap.set(copyGroups.flat(), { opacity: 0, y: 20, filter: "blur(5px)" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: timelineElement,
        start: "top 20%",
        end: "bottom bottom",
        scrub: 0.85,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(progressLine, { scaleY: 1, duration: totalUnits, ease: "none" }, 0);
    timeline.to(comet, { y: () => line.getBoundingClientRect().height, duration: totalUnits, ease: "none" }, 0);

    items.forEach((item, index) => {
      const markerAt = markerStops[index];
      const nextMarkerAt = markerStops[index + 1] ?? totalUnits;
      const interval = Math.max(0.45, nextMarkerAt - markerAt);
      const revealAt = markerAt + Math.min(0.1, interval * 0.08);
      const copyTargets = copyGroups[index];

      timeline.to(markers[index], { opacity: 1, scale: 1, duration: 0.16, ease: "none" }, markerAt);
      timeline.to(markerGlows[index], { opacity: 1, scale: 1, duration: 0.1, ease: "none" }, markerAt);
      timeline.to(markerGlows[index], { opacity: 0.28, scale: 0.7, duration: 0.48, ease: "none" }, markerAt + 0.12);
      timeline.to(connectors[index], { opacity: 1, scaleX: 1, duration: 0.2, ease: "none" }, markerAt + 0.04);

      if (!copyTargets.length) return;

      const stagger = Math.min(0.12, interval / (copyTargets.length * 5));
      const copyDuration = Math.max(0.2, Math.min(0.34, interval * 0.32));
      timeline.to(
        copyTargets,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: copyDuration,
          stagger,
          ease: "none",
        },
        revealAt,
      );
    });

    return () => timeline.scrollTrigger?.kill();
  }, { scope: timelineRef, dependencies: [entries.length], revertOnUpdate: true });

  return (
    <div className="experience-timeline" ref={timelineRef} role="list" aria-label="Experience timeline">
      <span className="experience-timeline__line" data-experience-line aria-hidden="true" />
      <span className="experience-timeline__progress" data-experience-progress aria-hidden="true" />
      <span className="experience-timeline__comet" data-experience-comet aria-hidden="true" />
      {entries.map((entry, index) => (
        <article
          className={`experience-entry experience-entry--${index % 2 === 0 ? "right" : "left"}`}
          data-experience-entry
          role="listitem"
          aria-labelledby={`experience-${entry.id}`}
          key={entry.id}
        >
          <span className="experience-entry__node" data-experience-marker aria-hidden="true">
            <span className="experience-entry__node-glow" data-experience-marker-glow />
          </span>
          <span className="experience-entry__connector" data-experience-connector aria-hidden="true" />
          <div className="experience-entry__content">
            <p className="experience-entry__type" data-experience-copy>
              <span>{String(index + 1).padStart(2, "0")}</span> / {entry.type}
              {entry.period && <span className="experience-entry__period"> · {entry.period}</span>}
            </p>
            <h2 id={`experience-${entry.id}`} data-experience-copy>{entry.title}</h2>
            <div className="experience-entry__details" data-experience-copy>
              <p>{entry.description}</p>
              {entry.href && (
                <a href={entry.href} target="_blank" rel="noreferrer">
                  {entry.linkLabel} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
