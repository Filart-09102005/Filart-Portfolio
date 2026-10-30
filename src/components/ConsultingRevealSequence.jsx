"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ContactForm from "./ContactForm";
import GearScrollReveal from "./GearScrollReveal";

export default function ConsultingRevealSequence({ children }) {
  const [headerComplete, setHeaderComplete] = useState(false);
  const [formShellComplete, setFormShellComplete] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [pathwaysComplete, setPathwaysComplete] = useState(false);

  const finishHeader = useCallback(() => setHeaderComplete(true), []);
  const finishFormShell = useCallback(() => setFormShellComplete(true), []);
  const finishForm = useCallback(() => setFormComplete(true), []);
  const finishPathways = useCallback(() => setPathwaysComplete(true), []);

  return (
    <section className="contact-page content-section" aria-labelledby="consulting-title">
      <GearScrollReveal
        targetSelector=".contact-page__eyebrow, .contact-page__header h1, .contact-page__header > p:last-child"
        stagger={0.12}
        distance={18}
        blur={6}
        duration={0.72}
        threshold={0.12}
        onRevealComplete={finishHeader}
      >
        <header className="contact-page__header">
          <p className="contact-page__eyebrow">08 / CONSULTING <span aria-hidden="true" /></p>
          <h1 id="consulting-title">Tell me about<br />your <span>idea.</span></h1>
          <p>I’m open to web commissions, system ideas, portfolio feedback, and thoughtful consultations. Share a few details and I’ll reply with next steps.</p>
        </header>
      </GearScrollReveal>

      <GearScrollReveal
        className="contact-form-shell-reveal"
        targetSelector=".contact-form"
        enabled={headerComplete}
        distance={18}
        blur={6}
        duration={0.62}
        threshold={0.16}
        onRevealComplete={finishFormShell}
      >
        <GearScrollReveal
          className="contact-form-reveal"
          targetSelector=".contact-form__heading, .contact-form__fields > .contact-form__field, .contact-form__helper, .contact-form__footer"
          enabled={formShellComplete}
          stagger={0.08}
          distance={18}
          blur={6}
          duration={0.72}
          threshold={0.16}
          onRevealComplete={finishForm}
        >
          <ContactForm />
        </GearScrollReveal>
      </GearScrollReveal>

      <GearScrollReveal
        className="contact-pathways"
        targetSelector=".contact-pathway"
        enabled={formComplete}
        stagger={0.14}
        distance={18}
        blur={6}
        duration={0.78}
        threshold={0.18}
        onRevealComplete={finishPathways}
      >
        <article className="contact-pathway">
          <span className="contact-pathway__number">01 / PROJECTS</span>
          <h2>See what I&apos;m building.</h2>
          <p>Explore my client systems, student work, and personal projects.</p>
          <Link href="/Projects">View projects <span aria-hidden="true">↗</span></Link>
        </article>
        <article className="contact-pathway">
          <span className="contact-pathway__number">02 / RECOMMENDATIONS</span>
          <h2>Explore other perspectives.</h2>
          <p>Recommendations can cover my portfolio, projects, learning, and collaboration.</p>
          <Link href="/Recommendation">Recommendations <span aria-hidden="true">↗</span></Link>
        </article>
      </GearScrollReveal>

      <GearScrollReveal enabled={pathwaysComplete} distance={14} blur={5} duration={0.72} threshold={0.16}>
        {children}
      </GearScrollReveal>
    </section>
  );
}
