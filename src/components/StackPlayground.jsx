"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Matter from "matter-js";
import GearScrollReveal from "./GearScrollReveal";

const { Bodies, Body, Composite, Constraint, Engine, Sleeping } = Matter;
const ACCENTS = ["#40c9ee", "#8de7a2", "#a69cff", "#f2bd71", "#84b9f4", "#c4a0ee"];
const BRAND_STYLES = {
  PHP: { logo: "php.svg", accent: "#777BB4" },
  Laravel: { logo: "laravel.svg", accent: "#FF2D20" },
  React: { logo: "react.svg", accent: "#61DAFB" },
  Vite: { logo: "vitejs.svg", accent: "#646CFF" },
  "Next.js": { logo: "nextjs.svg", accent: "#E8E8E8" },
  Vue: { logo: "vuejs.svg", accent: "#4FC08D" },
  HTML: { logo: "html5.svg", accent: "#E34F26" },
  CSS: { logo: "css3.svg", accent: "#1572B6" },
  "React Native": { logo: "reactnative.svg", accent: "#61DAFB" },
  Kotlin: { logo: "kotlin.svg", accent: "#7F52FF" },
  Java: { logo: "java.svg", accent: "#F89820" },
  "Tailwind CSS": { logo: "tailwindcss.svg", accent: "#06B6D4" },
  daisyUI: { logo: "daisyui.svg", accent: "#1AD1A5" },
  "shadcn/ui": { logo: "shadcnui.svg", accent: "#E8E8E8" },
  "React Bits": { logo: "reactbits.svg", accent: "#A78BFA" },
  "C++": { logo: "cplusplus.svg", accent: "#00599C" },
  MySQL: { logo: "mysql.svg", accent: "#4479A1" },
  Supabase: { logo: "supabase.svg", accent: "#3FCF8E" },
  Firebase: { logo: "firebase.svg", accent: "#FFCA28" },
  "VS Code": { logo: "vscode.svg", accent: "#007ACC" },
  Cursor: { logo: "cursor.svg", accent: "#D1D5DB", monochrome: true },
  Antigravity: { logo: "antigravity.svg", accent: "#B8A4FF" },
  OAuth: { logo: "oauth.svg", accent: "#A78BFA", monochrome: true },
  OpenAI: { logo: "openai.svg", accent: "#74AA9C", monochrome: true },
  Anthropic: { logo: "anthropic.svg", accent: "#D97757", monochrome: true },
};
const WALL_SIZE = 96;
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ResetButton({ className = "", onClick }) {
  return (
    <button
      className={`stack-playground__reset${className ? ` ${className}` : ""}`}
      type="button"
      aria-label="Reset skills and drop them again"
      title="Drop the skills again"
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 8.25A8 8 0 1 1 4 12M4.5 3.5v4.75h4.75" />
      </svg>
    </button>
  );
}

export default function StackPlayground({
  items,
  className = "",
  showToolbar = true,
  showHint = true,
  showResetButton = false,
  revealSequence = false,
  revealEnabled = true,
}) {
  const [resetCount, setResetCount] = useState(0);
  const [stackMode, setStackMode] = useState("gravity");
  const [headingComplete, setHeadingComplete] = useState(false);
  const [actionsComplete, setActionsComplete] = useState(false);
  const [arenaComplete, setArenaComplete] = useState(false);
  const arenaRef = useRef(null);
  const runtimeRef = useRef(null);
  const sequenceActive = revealSequence && showToolbar;
  const headingRevealEnabled = !sequenceActive || revealEnabled;
  const actionsRevealEnabled = !sequenceActive || (revealEnabled && headingComplete);
  const arenaRevealEnabled = !sequenceActive || (revealEnabled && actionsComplete);
  const hintRevealEnabled = !sequenceActive || arenaComplete;
  const simulationEnabled = arenaRevealEnabled;
  const completeHeading = useCallback(() => setHeadingComplete(true), []);
  const completeActions = useCallback(() => setActionsComplete(true), []);
  const completeArena = useCallback(() => setArenaComplete(true), []);

  useIsomorphicLayoutEffect(() => {
    const arena = arenaRef.current;
    if (!arena || !simulationEnabled) return undefined;

    const chips = Array.from(arena.querySelectorAll("[data-stack-chip]"));
    if (!chips.length) return undefined;

    const width = arena.clientWidth;
    const height = arena.clientHeight;
    if (!width || !height) return undefined;

    const measurements = chips.map((element) => ({
      element,
      width: element.offsetWidth,
      height: element.offsetHeight,
    }));
    const maxChipWidth = Math.max(...measurements.map((chip) => chip.width));
    const maxChipHeight = Math.max(...measurements.map((chip) => chip.height));
    const isCenterMode = stackMode === "center";
    const floatInset = isCenterMode ? Math.max(12, Math.min(width * 0.08, 48)) : 0;
    const floatLeft = floatInset;
    const floatRight = width - floatInset;
    const horizontalPadding = isCenterMode
      ? floatInset
      : Math.min(20, Math.max(8, (width - maxChipWidth) / 2));
    const packingWidth = isCenterMode ? floatRight - floatLeft : width - horizontalPadding * 2;
    const centerTargets = new Array(measurements.length);
    const centerRows = [];
    if (isCenterMode) {
      let currentRow = [];
      let currentRowWidth = 0;
      measurements.forEach((chip, index) => {
        const nextWidth = currentRowWidth + (currentRow.length ? 10 : 0) + chip.width;
        if (currentRow.length && nextWidth > packingWidth) {
          centerRows.push(currentRow);
          currentRow = [];
          currentRowWidth = 0;
        }
        currentRow.push({ ...chip, index });
        currentRowWidth += (currentRow.length > 1 ? 10 : 0) + chip.width;
      });
      if (currentRow.length) centerRows.push(currentRow);

      const rowHeights = centerRows.map((row) => Math.max(...row.map((chip) => chip.height)));
      const contentHeight = rowHeights.reduce((total, rowHeight) => total + rowHeight, 0);
      const rowGap = centerRows.length > 1
        ? clamp((height - 32 - contentHeight) / (centerRows.length - 1), 5, 16)
        : 0;
      const gridHeight = contentHeight + rowGap * Math.max(0, centerRows.length - 1);
      let rowTop = Math.max(16, (height - gridHeight) / 2);

      centerRows.forEach((row, rowIndex) => {
        const rowWidth = row.reduce((total, chip) => total + chip.width, 0) + 10 * (row.length - 1);
        let chipLeft = (width - rowWidth) / 2;
        row.forEach((chip) => {
          centerTargets[chip.index] = {
            x: chipLeft + chip.width / 2,
            y: rowTop + rowHeights[rowIndex] / 2,
          };
          chipLeft += chip.width + 10;
        });
        rowTop += rowHeights[rowIndex] + rowGap;
      });
    }
    let cursorX = horizontalPadding;
    let row = 0;

    const engine = Engine.create({
      enableSleeping: true,
      positionIterations: 7,
      velocityIterations: 5,
    });
    engine.gravity.x = 0;
    engine.gravity.y = 1;
    engine.gravity.scale = isCenterMode ? 0.0007 : 0.001;

    const bounds = [
      Bodies.rectangle(-WALL_SIZE / 2, height / 2, WALL_SIZE, height + WALL_SIZE * 4, { isStatic: true }),
      Bodies.rectangle(width + WALL_SIZE / 2, height / 2, WALL_SIZE, height + WALL_SIZE * 4, { isStatic: true }),
      Bodies.rectangle(width / 2, height + WALL_SIZE / 2, width + WALL_SIZE * 2, WALL_SIZE, { isStatic: true }),
    ];
    Composite.add(engine.world, bounds);

    const anchors = [];
    const bodies = measurements.map((chip, index) => {
      const leftLimit = isCenterMode ? floatLeft : 0;
      const rightEdge = isCenterMode ? floatRight : width;
      const centerTarget = centerTargets[index];
      if (isCenterMode) {
        const rightLimit = floatRight;
        if (cursorX > horizontalPadding && cursorX + chip.width > rightLimit) {
          row += 1;
          cursorX = horizontalPadding;
        }
      }
      const minX = leftLimit + chip.width / 2 + 2;
      const maxX = Math.max(minX, rightEdge - chip.width / 2 - 2);
      const x = centerTarget?.x ?? minX + Math.random() * (maxX - minX);
      const y = centerTarget
        ? Math.min(centerTarget.y - 115, -chip.height / 2 - 42 - row * (maxChipHeight + 11))
        : -chip.height / 2 - 42 - Math.random() * Math.max(maxChipHeight * 5, height * 0.62);
      if (isCenterMode) cursorX += chip.width + 10;
      const body = Bodies.rectangle(x, y, chip.width, chip.height, {
        chamfer: { radius: Math.min(chip.height / 2, 12) },
        density: 0.001,
        friction: 0.82,
        frictionStatic: 0.92,
        frictionAir: isCenterMode ? 0.035 : 0.018,
        restitution: 0.08,
        slop: 0.01,
        ...(isCenterMode ? { collisionFilter: { group: -1 } } : {}),
      });

      Body.setAngle(body, isCenterMode ? 0 : (Math.random() - 0.5) * 0.2);
      if (!isCenterMode) {
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 0.7, y: Math.random() * 0.18 });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.045);
      }
      chip.element.style.transform = `translate3d(${x - chip.width / 2}px, ${y - chip.height / 2}px, 0) rotate(${body.angle}rad)`;
      if (!sequenceActive) chip.element.style.opacity = "1";
      chip.element.dataset.physicsReady = "true";
      Composite.add(engine.world, body);
      if (centerTarget) {
        const anchor = Constraint.create({
          pointA: centerTarget,
          bodyB: body,
          pointB: { x: 0, y: 0 },
          length: 0,
          stiffness: 0.022,
          damping: 0.16,
        });
        Composite.add(engine.world, anchor);
        anchors[index] = anchor;
      }
      return body;
    });

    const runtime = {
      arena,
      engine,
      bodies,
      anchors,
      measurements,
      raf: 0,
      last: 0,
      drag: null,
      mode: stackMode,
      floatLeft,
      floatRight,
      centerTargets,
    };
    runtimeRef.current = runtime;

    const render = (now) => {
      if (runtimeRef.current !== runtime) return;
      const delta = runtime.last ? Math.min(32, now - runtime.last) : 16;
      runtime.last = now;
      Engine.update(engine, delta);

      bodies.forEach((body, index) => {
        const { element, width: chipWidth, height: chipHeight } = measurements[index];
        element.style.transform = `translate3d(${body.position.x - chipWidth / 2}px, ${body.position.y - chipHeight / 2}px, 0) rotate(${body.angle}rad)`;
      });

      const settled = runtime.mode === "center"
        ? bodies.every((body, index) => {
          const target = runtime.centerTargets[index];
          return Math.hypot(body.position.x - target.x, body.position.y - target.y) < 3
            && Math.hypot(body.velocity.x, body.velocity.y) < 0.15;
        })
        : bodies.every((body) => body.isSleeping);
      if (!runtime.drag && settled) {
        runtime.raf = 0;
        return;
      }
      runtime.raf = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (!runtime.raf) {
        runtime.last = 0;
        runtime.raf = window.requestAnimationFrame(render);
      }
    };

    runtime.start = start;
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      }, { threshold: 0.05 });
      observer.observe(arena);
    } else {
      start();
    }

    let observedWidth = width;
    let observedHeight = height;
    const resizeObserver = "ResizeObserver" in window
      ? new ResizeObserver(() => {
        const nextWidth = arena.clientWidth;
        const nextHeight = arena.clientHeight;
        if (Math.abs(nextWidth - observedWidth) < 2 && Math.abs(nextHeight - observedHeight) < 2) return;
        observedWidth = nextWidth;
        observedHeight = nextHeight;
        setResetCount((count) => count + 1);
      })
      : null;
    resizeObserver?.observe(arena);

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(runtime.raf);
      if (runtime.drag) Composite.remove(engine.world, runtime.drag.constraint);
      measurements.forEach(({ element }) => {
        delete element.dataset.physicsReady;
      });
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      if (runtimeRef.current === runtime) runtimeRef.current = null;
    };
  }, [items, resetCount, sequenceActive, simulationEnabled, stackMode]);

  const pointerPoint = (event) => {
    const arena = arenaRef.current;
    if (!arena) return null;
    const rect = arena.getBoundingClientRect();
    return {
      x: event.clientX - rect.left - arena.clientLeft,
      y: event.clientY - rect.top - arena.clientTop,
    };
  };

  const handlePointerDown = (event, index) => {
    const runtime = runtimeRef.current;
    const point = pointerPoint(event);
    const body = runtime?.bodies[index];
    if (!runtime || !point || !body || event.button > 0) return;

    event.preventDefault();
    const dx = point.x - body.position.x;
    const dy = point.y - body.position.y;
    const cos = Math.cos(body.angle);
    const sin = Math.sin(body.angle);
    const constraint = Constraint.create({
      pointA: point,
      bodyB: body,
      pointB: { x: dx * cos + dy * sin, y: -dx * sin + dy * cos },
      length: 0,
      stiffness: 0.22,
      damping: 0.12,
    });

    const anchor = runtime.anchors[index];
    if (anchor) Composite.remove(runtime.engine.world, anchor);
    Composite.add(runtime.engine.world, constraint);
    runtime.drag = {
      body,
      constraint,
      anchor,
      pointerId: event.pointerId,
      width: runtime.measurements[index].width,
      height: runtime.measurements[index].height,
    };
    Sleeping.set(body, false);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    runtime.start();
  };

  const handlePointerMove = (event) => {
    const runtime = runtimeRef.current;
    if (!runtime?.drag || runtime.drag.pointerId !== event.pointerId) return;
    const point = pointerPoint(event);
    if (point) {
      const arena = runtime.arena;
      const minX = runtime.mode === "center" ? runtime.floatLeft + runtime.drag.width / 2 : runtime.drag.width / 2;
      const maxX = runtime.mode === "center"
        ? runtime.floatRight - runtime.drag.width / 2
        : arena.clientWidth - runtime.drag.width / 2;
      const maxY = arena.clientHeight - runtime.drag.height / 2;
      point.x = clamp(point.x, minX, maxX);
      point.y = clamp(point.y, runtime.drag.height / 2, maxY);
      runtime.drag.constraint.pointA = point;
    }
  };

  const handlePointerUp = (event) => {
    const runtime = runtimeRef.current;
    if (!runtime?.drag || runtime.drag.pointerId !== event.pointerId) return;
    const { body, constraint, anchor } = runtime.drag;
    Composite.remove(runtime.engine.world, constraint);
    if (anchor) {
      Body.setAngle(body, 0);
      Body.setAngularVelocity(body, 0);
      Composite.add(runtime.engine.world, anchor);
      Sleeping.set(body, false);
    }
    runtime.drag = null;
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture may already be released after a cancel event.
    }
    runtime.start();
  };

  return (
    <section
      className={`stack-playground${className ? ` ${className}` : ""}`}
      aria-labelledby={showToolbar ? "stack-playground-title" : undefined}
      aria-label={showToolbar ? undefined : "Featured falling technology stack"}
    >
      {showToolbar && (
        <div className="stack-playground__toolbar">
          <GearScrollReveal
            className="stack-playground__heading-reveal"
            enabled={headingRevealEnabled}
            stagger={0.12}
            distance={18}
            blur={6}
            duration={0.72}
            ease="power2.out"
            threshold={0.16}
            onRevealComplete={sequenceActive ? completeHeading : undefined}
          >
            <p className="stack-playground__eyebrow">DRAG TO EXPLORE</p>
            <h2 id="stack-playground-title">My stack</h2>
          </GearScrollReveal>
          <GearScrollReveal
            className="stack-playground__actions"
            enabled={actionsRevealEnabled}
            stagger={0.1}
            distance={16}
            blur={6}
            duration={0.68}
            ease="power2.out"
            threshold={0.18}
            onRevealComplete={sequenceActive ? completeActions : undefined}
          >
            <span>{String(items.length).padStart(2, "0")} SKILLS</span>
            <div className="stack-playground__mode-toggle" role="group" aria-label="Skill layout mode">
              <button
                className="stack-playground__mode-button"
                type="button"
                aria-pressed={stackMode === "gravity"}
                aria-label="Gravity pile mode"
                title="Let the skills fall and collect at the bottom."
                onClick={() => setStackMode("gravity")}
              >
                Gravity
              </button>
              <button
                className="stack-playground__mode-button"
                type="button"
                aria-pressed={stackMode === "center"}
                aria-label="Center float mode"
                title="Let the skills fall into a centered layout for easier reading."
                onClick={() => setStackMode("center")}
              >
                Center float
              </button>
            </div>
            <ResetButton onClick={() => setResetCount((count) => count + 1)} />
          </GearScrollReveal>
        </div>
      )}

      {showResetButton && !showToolbar && (
        <ResetButton
          className="stack-playground__reset--home"
          onClick={() => setResetCount((count) => count + 1)}
        />
      )}

      <GearScrollReveal
        className="stack-playground__arena-reveal"
        targetSelector=".stack-playground__chip"
        animatePosition={false}
        enabled={arenaRevealEnabled}
        stagger={0.055}
        distance={18}
        blur={6}
        duration={0.68}
        ease="power2.out"
        threshold={0.22}
        onRevealComplete={sequenceActive ? completeArena : undefined}
      >
        <ul
          ref={arenaRef}
          className="stack-playground__arena"
          aria-describedby={showHint ? "stack-playground-hint" : undefined}
        >
          {items.map((item, index) => {
            const brand = BRAND_STYLES[item.name];
            const accent = brand?.accent ?? ACCENTS[item.categoryIndex % ACCENTS.length];
            const detail = [item.group, item.detail, item.highlight].filter(Boolean).join(" · ");

            return (
              <li className="stack-playground__slot" key={item.name}>
                <button
                  className="stack-playground__chip"
                  type="button"
                  data-stack-chip
                  style={{
                    "--stack-accent": accent,
                    "--stack-logo": brand?.logo ? `url("/stack-icons/${brand.logo}")` : "none",
                    "--stack-logo-filter": brand?.monochrome ? "brightness(0) invert(1)" : "none",
                  }}
                  title={detail}
                  aria-label={`${item.name}. ${detail}. Drag it toward the top and release to drop it.`}
                  onPointerDown={(event) => handlePointerDown(event, index)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onLostPointerCapture={handlePointerUp}
                >
                  <span className="stack-playground__mark" aria-hidden="true">
                    {brand?.logo ? <span className="stack-playground__logo" /> : item.mark}
                  </span>
                  <span className="stack-playground__chip-copy">
                    <strong>{item.name}</strong>
                    <small>{item.categoryLabel}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </GearScrollReveal>
      {showHint && (
        <GearScrollReveal
          className="stack-playground__hint-reveal"
          enabled={hintRevealEnabled}
          distance={18}
          blur={6}
          duration={0.68}
          ease="power2.out"
          threshold={0.24}
        >
          <p className="stack-playground__hint" id="stack-playground-hint">
            {stackMode === "center"
              ? "Center float keeps every skill easy to see. Drag one upward and release it to settle it back into place."
              : "Drag a skill upward and release it. Gravity brings it back into the stack. Reset to drop them all again."}
          </p>
        </GearScrollReveal>
      )}
    </section>
  );
}
