'use client';

import { useCallback, useState } from "react";
import GearScrollReveal from "./GearScrollReveal";
import LightRays from "./LightRays";

export default function HomeIntroSequence({ children, afterRays }) {
  const [raysComplete, setRaysComplete] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const finishRays = useCallback(() => setRaysComplete(true), []);
  const finishProfile = useCallback(() => setProfileComplete(true), []);

  return (
    <div className="home-first-viewport">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="home-rays" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#d2dfca"
            raysSpeed={0.2}
            lightSpread={0.62}
            rayLength={2.4}
            rayDensity={0.72}
            raySharpness={0.24}
            glow={0.24}
            haze={0.28}
            atmosphere={0.08}
            intensity={0.7}
            pulsating={false}
            fadeDistance={1.25}
            saturation={0.18}
            followMouse={false}
            cursorShadow={false}
            clickPulse={false}
            noiseAmount={0.015}
            distortion={0.012}
            lightMode={false}
            opacity={0.82}
            maxDevicePixelRatio={1.5}
            intro
            finishIntroWhenOffscreen
            onIntroComplete={finishRays}
            className="home-rays-canvas"
          />
        </div>

        <GearScrollReveal
          className="home-profile-reveal"
          enabled={raysComplete}
          targetSelector=".hero-profile-visual, .identity-name, .identity-role, .identity-statement, .home-profile-summary__label, .home-profile-summary > p:last-child"
          distance={18}
          blur={6}
          duration={0.72}
          stagger={0.14}
          threshold={0.12}
          onRevealComplete={finishProfile}
        >
          {children}
        </GearScrollReveal>
      </section>

      <GearScrollReveal
        className="home-github-reveal"
        enabled={profileComplete}
        distance={18}
        blur={6}
        duration={0.76}
        threshold={0.05}
      >
        {afterRays}
      </GearScrollReveal>
    </div>
  );
}
