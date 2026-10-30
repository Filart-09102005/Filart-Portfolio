"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import OptionWheel from "./OptionWheel";

const PAGES = [
  { label: "RECOMMENDATION", href: "/Recommendation" },
  { label: "EXPERIENCE", href: "/Experience" },
  { label: "PROJECTS", href: "/Projects" },
  { label: "GEARS", href: "/Gear" },
  { label: "HOME", href: "/Home" },
  { label: "STACKS", href: "/Stack" },
  { label: "ABOUT ME", href: "/AboutMe" },
  { label: "CONSULTING", href: "/Consulting" },
  { label: "CERTIFICATIONS", href: "/Certification" },
];
const PAGE_LABELS = PAGES.map((page) => page.label);

export default function SidebarNavigation({ onNavigate }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = Math.max(0, PAGES.findIndex((page) => page.href === pathname));

  const navigateToPage = useCallback((index) => {
    const page = PAGES[index];
    if (!page) return;

    const closeTransition = onNavigate?.();
    if (page.href === pathname) return;

    if (closeTransition && typeof closeTransition.then === "function") {
      closeTransition.then(() => router.push(page.href));
      return;
    }

    router.push(page.href);
  }, [onNavigate, pathname, router]);

  return (
    <OptionWheel
      ariaLabel="Portfolio page navigation"
      className="portfolio-wheel"
      items={PAGE_LABELS}
      defaultSelected={activeIndex}
      activeIndex={activeIndex}
      textColor="#6f786c"
      activeColor="#dce7d4"
      fontSize={1.6}
      spacing={1.9}
      curve={1.35}
      tilt={7}
      blur={0.45}
      fade={0.28}
      minOpacity={0.24}
      smoothing={90}
      inset="calc(50% - 84px)"
      draggable
      onSelect={navigateToPage}
    />
  );
}
