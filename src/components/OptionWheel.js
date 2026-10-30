"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./OptionWheel.css";

const DEFAULT_ITEMS = [
  "Ambient",
  "House",
  "Techno",
  "Jazz",
  "Lo-Fi",
  "Synthwave",
  "Trance",
  "Funk",
  "Disco",
  "Hip-Hop",
  "Chillwave",
  "Drum & Bass",
];

export default function OptionWheel({
  items = DEFAULT_ITEMS,
  defaultSelected = 3,
  activeIndex = null,
  onChange,
  onSelect,
  onInteractionStart,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = "",
  soundVolume = 0.5,
  className = "",
  ariaLabel = "Option wheel",
}) {
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const hoveredIndexRef = useRef(null);
  const hoverProgressRef = useRef([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);
  const onSelectRef = useRef(onSelect);
  const onInteractionStartRef = useRef(onInteractionStart);
  const pendingSelectRef = useRef(false);
  const selectionRevisionRef = useRef(0);
  const commitFrameRef = useRef(null);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef(null);
  const dragRef = useRef(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef("");
  const lastTickRef = useRef(0);
  const idPrefix = useId();
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const remPx =
    typeof window !== "undefined"
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16;

  useEffect(() => {
    onChangeRef.current = onChange;
    onSelectRef.current = onSelect;
    onInteractionStartRef.current = onInteractionStart;
    cfgRef.current = {
      count: items.length,
      items,
      rowH: Math.max(fontSize * spacing * remPx, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
      draggable,
      soundUrl,
      soundVolume,
    };
  }, [
    blur,
    curve,
    draggable,
    fade,
    fontSize,
    items,
    loop,
    minOpacity,
    onChange,
    onInteractionStart,
    onSelect,
    remPx,
    side,
    smoothing,
    soundUrl,
    soundVolume,
    spacing,
    tilt,
  ]);

  const runFrame = useCallback(function animate(now) {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const cfg = cfgRef.current;
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    const target = targetRef.current;
    const cur = posRef.current;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    posRef.current = next;

    const mirror = cfg.side === "right" ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const radius = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
    let hoverSettling = false;

    for (let i = 0; i < cfg.count; i += 1) {
      const element = itemRefs.current[i];
      if (!element) continue;

      let distanceFromCenter = i - next;
      if (cfg.loop && cfg.count > 1) {
        distanceFromCenter = ((distanceFromCenter % cfg.count) + cfg.count) % cfg.count;
        if (distanceFromCenter > cfg.count / 2) distanceFromCenter -= cfg.count;
      }

      const distance = Math.abs(distanceFromCenter);
      let x = 0;
      let y = distanceFromCenter * cfg.rowH;
      let rotation = 0;

      if (radius > 0) {
        const angle = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, distanceFromCenter * tiltRad),
        );
        y = radius * Math.sin(angle);
        x = -mirror * radius * (1 - Math.cos(angle)) * cfg.curve;
        rotation = (mirror * angle * 180) / Math.PI;
      }

      const hoverTarget = hoveredIndexRef.current === i ? 1 : 0;
      const previousHover = hoverProgressRef.current[i] ?? 0;
      const hoverProgress = previousHover + (hoverTarget - previousHover) * (1 - Math.exp(-dt / 0.12));
      hoverProgressRef.current[i] = hoverProgress;
      if (Math.abs(hoverTarget - hoverProgress) > 0.01) hoverSettling = true;

      const targetOpacity = Math.max(cfg.minOpacity, 1 - distance * cfg.fade);
      const targetBlur = distance * cfg.blur;
      const hoveredOpacity = targetOpacity + (0.94 - targetOpacity) * hoverProgress;

      element.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(3)}deg)`;
      element.style.opacity = String(hoveredOpacity);
      element.style.filter = targetBlur > 0 ? `blur(${targetBlur.toFixed(2)}px)` : "none";
      element.style.setProperty("--ow-p", Math.max(0, 1 - Math.min(distance, 1), hoverProgress).toFixed(4));
      element.style.setProperty("--ow-target-opacity", String(hoveredOpacity));
      element.style.setProperty("--ow-target-filter", targetBlur > 0 ? `blur(${targetBlur.toFixed(2)}px)` : "none");
    }

    rafRef.current = settled && !hoverSettling ? null : requestAnimationFrame(animate);

    if (settled && pendingSelectRef.current && cfg.count > 0) {
      pendingSelectRef.current = false;
      const index = ((Math.round(targetRef.current) % cfg.count) + cfg.count) % cfg.count;
      const revision = selectionRevisionRef.current;
      commitFrameRef.current = requestAnimationFrame(() => {
        commitFrameRef.current = null;
        if (revision !== selectionRevisionRef.current) return;
        const currentCfg = cfgRef.current;
        if (!currentCfg.count) return;
        const currentIndex = ((Math.round(targetRef.current) % currentCfg.count) + currentCfg.count) % currentCfg.count;
        onSelectRef.current?.(currentIndex, currentCfg.items[currentIndex]);
      });
    }
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const playTick = useCallback(() => {
    const { soundUrl: url, soundVolume: volume } = cfgRef.current;
    if (!url) return;

    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;

    if (!audioRef.current || audioUrlRef.current !== url) {
      audioRef.current = new Audio(url);
      audioRef.current.preload = "auto";
      audioUrlRef.current = url;
    }

    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }, []);

  const applyTarget = useCallback(
    (value, snap) => {
      const cfg = cfgRef.current;
      if (!cfg.count) return;

      let nextTarget = value;
      if (!cfg.loop) nextTarget = Math.min(Math.max(nextTarget, 0), cfg.count - 1);
      if (snap) nextTarget = Math.round(nextTarget);
      targetRef.current = nextTarget;

      const index = ((Math.round(nextTarget) % cfg.count) + cfg.count) % cfg.count;
      if (index !== selectedRef.current) {
        selectedRef.current = index;
        setSelectedIndex(index);
        onChangeRef.current?.(index, cfg.items[index]);
        playTick();
      }

      startLoop();
    },
    [playTick, startLoop],
  );

  const queueSelection = useCallback(() => {
    pendingSelectRef.current = true;
    selectionRevisionRef.current += 1;
    if (commitFrameRef.current != null) {
      cancelAnimationFrame(commitFrameRef.current);
      commitFrameRef.current = null;
    }
  }, []);

  const cancelQueuedSelection = useCallback(() => {
    pendingSelectRef.current = false;
    selectionRevisionRef.current += 1;
    if (commitFrameRef.current != null) {
      cancelAnimationFrame(commitFrameRef.current);
      commitFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    function handleWheel(event) {
      event.preventDefault();
      onInteractionStartRef.current?.();
      cancelQueuedSelection();
      const cfg = cfgRef.current;
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        applyTarget(targetRef.current, true);
        queueSelection();
      }, 140);
    }

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget, cancelQueuedSelection, queueSelection]);

  const handlePointerDown = useCallback((event) => {
    if (!cfgRef.current.draggable) return;
    cancelQueuedSelection();
    dragRef.current = { y: event.clientY, start: targetRef.current, id: event.pointerId };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, [cancelQueuedSelection]);

  const handlePointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag) return;
      const deltaY = event.clientY - drag.y;

      if (!dragMovedRef.current && Math.abs(deltaY) > 4) {
        dragMovedRef.current = true;
        onInteractionStartRef.current?.();
        rootRef.current?.setPointerCapture(drag.id);
      }

      if (dragMovedRef.current) {
        applyTarget(drag.start - deltaY / cfgRef.current.rowH, false);
      }
    },
    [applyTarget],
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) {
      applyTarget(targetRef.current, true);
      queueSelection();
    }
  }, [applyTarget, queueSelection]);

  const handleItemClick = useCallback(
    (index) => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      if (!cfg.count) return;

      onInteractionStartRef.current?.();
      const current = targetRef.current;
      let delta = index - (((current % cfg.count) + cfg.count) % cfg.count);
      if (cfg.loop && cfg.count > 1) {
        if (delta > cfg.count / 2) delta -= cfg.count;
        else if (delta < -cfg.count / 2) delta += cfg.count;
      }

      applyTarget(current + delta, true);
      queueSelection();
    },
    [applyTarget, queueSelection],
  );

  const handleKeyDown = useCallback(
    (event) => {
      let delta = null;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") delta = -1;
      else if (event.key === "ArrowDown" || event.key === "ArrowRight") delta = 1;
      if (delta == null) return;
      event.preventDefault();
      onInteractionStartRef.current?.();
      applyTarget(Math.round(targetRef.current) + delta, true);
      queueSelection();
    },
    [applyTarget, queueSelection],
  );

  const handleItemPointerEnter = useCallback((event, index) => {
    if (event.pointerType === "touch") return;
    hoveredIndexRef.current = index;
    startLoop();
  }, [startLoop]);

  const handleWheelPointerLeave = useCallback(() => {
    if (hoveredIndexRef.current == null) return;
    hoveredIndexRef.current = null;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    applyTarget(targetRef.current, false);
  }, [
    applyTarget,
    blur,
    curve,
    fade,
    fontSize,
    items,
    loop,
    minOpacity,
    side,
    smoothing,
    spacing,
    tilt,
  ]);

  useEffect(() => {
    if (activeIndex == null) return;
    applyTarget(activeIndex, true);
  }, [activeIndex, applyTarget]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (commitFrameRef.current != null) cancelAnimationFrame(commitFrameRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      rafRef.current = null;
      audioRef.current?.pause();
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-orientation="vertical"
      aria-activedescendant={`${idPrefix}-option-${selectedIndex}`}
      className={`option-wheel${side === "right" ? " option-wheel--right" : ""}${isDragging ? " option-wheel--dragging" : ""}${className ? ` ${className}` : ""}`}
      style={{
        "--ow-text-color": textColor,
        "--ow-active-color": activeColor,
        "--ow-font-size": `${fontSize}rem`,
        "--ow-inset": typeof inset === "number" ? `${inset}px` : inset,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handleWheelPointerLeave}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          id={`${idPrefix}-option-${index}`}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          role="option"
          aria-selected={selectedIndex === index}
          className={`option-wheel__item${selectedIndex === index ? " option-wheel__item--selected" : ""}`}
          style={{ "--sidebar-stagger-delay": `${index * 38}ms` }}
          onPointerEnter={(event) => handleItemPointerEnter(event, index)}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
