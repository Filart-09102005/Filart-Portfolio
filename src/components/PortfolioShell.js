"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import AnimatedContent from "./AnimatedContent";
import PersistentHeart from "./PersistentHeart";
import SidebarNavigation from "./SidebarNavigation";

const MOBILE_RAIL_QUERY = "(max-width: 1050px)";

function subscribeToRailBreakpoint(onChange) {
  const mediaQuery = window.matchMedia(MOBILE_RAIL_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getRailBreakpointSnapshot() {
  return window.matchMedia(MOBILE_RAIL_QUERY).matches;
}

function getRailBreakpointServerSnapshot() {
  return false;
}

export default function PortfolioShell({ children, hideTopbar = false, hideGlobalTopbar = true, animateMainOnMount = true }) {
  const isMobileRail = useSyncExternalStore(
    subscribeToRailBreakpoint,
    getRailBreakpointSnapshot,
    getRailBreakpointServerSnapshot,
  );
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarOpen = isMobileRail ? mobileSidebarOpen : desktopSidebarOpen;
  const closeSidebarAfterNavigation = useCallback(() => {
    if (!isMobileRail || !mobileSidebarOpen) {
      setMobileSidebarOpen(false);
      return undefined;
    }

    setMobileSidebarOpen(false);
    return new Promise((resolve) => window.setTimeout(resolve, 400));
  }, [isMobileRail, mobileSidebarOpen]);
  const frameClassName = [
    "site-frame",
    hideTopbar && "site-frame--home",
    !desktopSidebarOpen && "site-frame--rail-collapsed",
    mobileSidebarOpen && "site-frame--mobile-rail-open",
  ].filter(Boolean).join(" ");

  const toggleSidebar = () => {
    if (isMobileRail) {
      setMobileSidebarOpen((open) => !open);
      return;
    }

    setDesktopSidebarOpen((open) => !open);
  };

  const pageContent = (
    <>
      {!hideTopbar && !hideGlobalTopbar && (
        <header className="site-topbar">
          <Link className="mobile-monogram" href="/Home" aria-label="Hans Filart, home">
            HF<span>.</span>
          </Link>
          <p className="topbar-location">
            <span className="status-mark" aria-hidden="true" />
            INDEPENDENT DEVELOPER <span className="topbar-divider">/</span> PHILIPPINES
          </p>
          <nav className="topbar-nav" aria-label="Main navigation">
            <Link href="/Projects">Projects <span>01</span></Link>
            <Link href="/AboutMe">About <span>02</span></Link>
            <Link href="/Consulting">Consulting <span>03</span></Link>
            <Link href="/Recommendation">Recommendations <span>04</span></Link>
          </nav>
        </header>
      )}
      <main id="top" className="portfolio-content">
        {children}
      </main>
    </>
  );

  return (
    <div className={frameClassName}>
      <button
        className="sidebar-rail-toggle"
        type="button"
        aria-label={sidebarOpen ? "Collapse sidebar" : "Show sidebar"}
        aria-controls="portfolio-sidebar"
        aria-expanded={sidebarOpen}
        onClick={toggleSidebar}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        className="mobile-rail-backdrop"
        type="button"
        aria-label="Close sidebar navigation"
        aria-hidden={!isMobileRail || !mobileSidebarOpen}
        tabIndex={isMobileRail && mobileSidebarOpen ? 0 : -1}
        onClick={() => setMobileSidebarOpen(false)}
      />
      <aside
        className="site-rail"
        id="portfolio-sidebar"
        aria-label="Portfolio sidebar"
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
      >
        <Link className="rail-brand" href="/Home" aria-label="Hans Filart, home">
          <span className="rail-brand__full">HANS FILART</span>
          <span className="rail-brand__short" aria-hidden="true">HF</span>
        </Link>
        <div className="rail-wheel-shell">
          <SidebarNavigation onNavigate={closeSidebarAfterNavigation} />
        </div>
        <PersistentHeart />
      </aside>

      <div className="site-main">
        {hideTopbar && (
          <Link className="mobile-monogram home-mobile-brand" href="/Home" aria-label="Hans Filart, home">
            HF<span>.</span>
          </Link>
        )}
        {animateMainOnMount ? (
          <AnimatedContent
            className="site-main-motion"
            trigger="mount"
            distance={22}
            duration={0.72}
            ease="power3.out"
            initialOpacity={0}
            stagger={0.08}
          >
            {pageContent}
          </AnimatedContent>
        ) : (
          <div className="site-main-motion">{pageContent}</div>
        )}
      </div>
    </div>
  );
}

