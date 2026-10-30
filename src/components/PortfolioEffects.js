"use client";

import ClickSpark from "./ClickSpark";

export default function PortfolioEffects({ children }) {
  return (
    <ClickSpark
      className="portfolio-click-spark"
      sparkColor={["#a8b99f", "#eeeee7"]}
      sparkSize={12}
      sparkRadius={28}
      sparkCount={8}
      sparkWidth={1.6}
      duration={480}
      easing="ease-out"
      randomness={0.22}
      glow={0.18}
      style={{
        position: "relative",
        width: "100%",
        height: "auto",
        minHeight: "100svh",
        flex: "1 0 auto",
      }}
    >
      {children}
    </ClickSpark>
  );
}
