"use client";

import { useCallback, useState } from "react";
import GearScrollReveal from "./GearScrollReveal";

const DEMO_RECOMMENDATIONS = [
  {
    id: "demo-short",
    name: "Demo reader · Short",
    recommendation: "A thoughtful portfolio that’s easy to explore.",
    isDemo: true,
  },
  {
    id: "demo-medium",
    name: "Demo reader · Medium",
    recommendation: "The project descriptions give a clear sense of what Hans builds, while the visual details make the site memorable.",
    isDemo: true,
  },
  {
    id: "demo-long",
    name: "Demo reader · Long",
    recommendation: "I like how the portfolio brings projects, tools, and personal interests together. It feels considered without making it difficult to find the important details.",
    isDemo: true,
  },
  {
    id: "demo-extended",
    name: "Demo reader · Extended",
    recommendation: "This portfolio gives a useful overview of Hans’s work and learning journey. The project sections explain the purpose behind each idea, and the separate pages make it easy to explore more when something catches your attention. The overall presentation feels personal and shows care in both the design and the way the information is organized.",
    isDemo: true,
  },
  {
    id: "demo-projects",
    name: "Demo reader · Projects",
    recommendation: "The project pages make it easy to understand what each product is for.",
    isDemo: true,
  },
  {
    id: "demo-learning",
    name: "Demo reader · Learning",
    recommendation: "I appreciate how the portfolio shares both finished work and the learning behind it. It feels honest and motivating.",
    isDemo: true,
  },
  {
    id: "demo-web",
    name: "Demo reader · Web",
    recommendation: "The web projects feel purposeful, and the descriptions explain the problems they’re meant to solve.",
    isDemo: true,
  },
  {
    id: "demo-mobile",
    name: "Demo reader · Mobile",
    recommendation: "The mobile app work shows a nice mix of practical features and thoughtful interface details.",
    isDemo: true,
  },
  {
    id: "demo-details",
    name: "Demo reader · Details",
    recommendation: "The design feels cohesive from page to page. Small details make it enjoyable to explore without distracting from the work.",
    isDemo: true,
  },
  {
    id: "demo-collaboration",
    name: "Demo reader · Collaboration",
    recommendation: "Hans listens carefully, asks useful questions, and turns ideas into clear next steps. Working through a project together feels organized and collaborative. The portfolio reflects that same care by explaining the goal and thinking behind each piece of work.",
    isDemo: true,
  },
  {
    id: "demo-navigation",
    name: "Demo reader · Navigation",
    recommendation: "There’s a lot to explore, but the navigation makes it easy to find what I’m interested in.",
    isDemo: true,
  },
  {
    id: "demo-growth",
    name: "Demo reader · Growth",
    recommendation: "The portfolio shows steady growth as a developer. The mix of client work, school projects, and personal ideas gives a helpful picture of what Hans is learning and building.",
    isDemo: true,
  },
  {
    id: "demo-purpose",
    name: "Demo reader · Purpose",
    recommendation: "Clear, personal, and easy to browse.",
    isDemo: true,
  },
  {
    id: "demo-overview",
    name: "Demo reader · Overview",
    recommendation: "This site gives a welcoming overview of Hans’s work. The project summaries are concise, and the individual sections make it possible to explore the details at your own pace. I also like that it includes the tools and learning journey behind the finished projects.",
    isDemo: true,
  },
  {
    id: "demo-journey",
    name: "Demo reader · Journey",
    recommendation: "The site makes the development journey feel approachable. It presents real work, explains the context, and leaves room for the next ideas to grow. It’s a strong snapshot of a student developer building experience one project at a time.",
    isDemo: true,
  },
];

function initialFor(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function RecommendationBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState(DEMO_RECOMMENDATIONS);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [headerComplete, setHeaderComplete] = useState(false);
  const finishHeader = useCallback(() => setHeaderComplete(true), []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const name = String(values.name ?? "").trim();
    const email = String(values.email ?? "").trim();
    const recommendation = String(values.recommendation ?? "").trim();

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          recommendation,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true || !result.recommendation) {
        setStatus({
          type: "error",
          message: result.message || "Your recommendation could not be sent. Please try again or email me directly.",
        });
        return;
      }

      setRecommendations((current) => [result.recommendation, ...current]);
      form.reset();
      setIsFormOpen(false);
      setStatus({ type: "success", message: "Thank you. Your recommendation has been added below." });
    } catch {
      setStatus({
        type: "error",
        message: "Could not reach this site’s recommendation service. Check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleForm() {
    setIsFormOpen((open) => !open);
    setStatus({ type: "idle", message: "" });
  }

  return (
    <section className="recommendation-page content-section" aria-labelledby="recommendation-title">
      <GearScrollReveal
        className="recommendation-page__header"
        targetSelector=".recommendation-page__eyebrow, .recommendation-page__title-row, .recommendation-page__description"
        stagger={0.12}
        distance={18}
        blur={6}
        duration={0.76}
        threshold={0.14}
        onRevealComplete={finishHeader}
      >
        <p className="recommendation-page__eyebrow">PEOPLE · PORTFOLIO · PROJECTS</p>
        <div className="recommendation-page__title-row">
          <h1 id="recommendation-title">Recommendation</h1>
          <button
            className="recommendation-page__add"
            type="button"
            aria-expanded={isFormOpen}
            aria-controls="recommendation-form"
            onClick={toggleForm}
          >
            {isFormOpen ? "Close form" : "Add recommendation"}
            <span aria-hidden="true">{isFormOpen ? "×" : "+"}</span>
          </button>
        </div>
        <p className="recommendation-page__description">Recommendations can be about my portfolio, projects, learning, or what it’s like to work and build with me.</p>
      </GearScrollReveal>

      {isFormOpen && (
        <GearScrollReveal
          className="recommendation-form-reveal"
          targetSelector=".recommendation-form__heading, .recommendation-form__fields > label, .recommendation-form__privacy, .recommendation-form__footer"
          stagger={0.1}
          distance={18}
          blur={6}
          duration={0.72}
          threshold={0.12}
        >
          <form className="recommendation-form" id="recommendation-form" onSubmit={handleSubmit}>
            <div className="recommendation-form__heading">
              <div>
                <span className="recommendation-page__eyebrow">SHARE A RECOMMENDATION</span>
                <h2>A few words from you.</h2>
              </div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4.75h16v11.5H9.25L4 20V4.75Z" />
                <path d="M8 9h8M8 12.5h5" />
              </svg>
            </div>

            <div className="recommendation-form__fields">
              <label className="recommendation-form__field">
                <span>Name <b aria-hidden="true">*</b></span>
                <input name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your name" required />
              </label>
              <label className="recommendation-form__field">
                <span>Email <b aria-hidden="true">*</b></span>
                <input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required />
              </label>
              <label className="recommendation-form__field recommendation-form__field--full">
                <span>Your recommendation <b aria-hidden="true">*</b></span>
                <textarea name="recommendation" rows={5} maxLength={3000} placeholder="You can share thoughts about the portfolio, projects, learning, or our work together." required />
              </label>
            </div>

            <p className="recommendation-form__privacy">Your recommendation and name will be shown here after sending. Your email stays private.</p>

            <div className="recommendation-form__footer">
              <button className="recommendation-form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send recommendation"}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </GearScrollReveal>
      )}

      {status.message && (
        <p
          className="recommendation-page__status"
          role={status.type === "error" ? "alert" : "status"}
          aria-live={status.type === "error" ? "assertive" : "polite"}
          data-state={status.type}
        >
          {status.message}
          {status.type === "error" && <> <a href="mailto:filarthg9@gmail.com">Email me directly.</a></>}
        </p>
      )}

      <GearScrollReveal
        className="recommendation-list-reveal"
        targetSelector=".recommendation-page__demo-note, .recommendation-card, .recommendation-empty"
        enabled={headerComplete}
        stagger={0.12}
        distance={18}
        blur={6}
        duration={0.76}
        threshold={0.14}
      >
        {recommendations.some((entry) => entry.isDemo) && (
          <p className="recommendation-page__demo-note" role="note">
            Sample copy for layout preview. These are not real recommendations.
          </p>
        )}

        {recommendations.length ? (
          <div className="recommendation-grid" role="list" aria-label="Submitted recommendations">
            {recommendations.map((entry, index) => (
              <article className={`recommendation-card${entry.isDemo ? " recommendation-card--demo" : ""}`} key={entry.id} role="listitem">
                <span className="recommendation-card__number">
                  {entry.isDemo ? "DEMO · SAMPLE COPY" : `${String(index + 1).padStart(2, "0")} / RECOMMENDATION`}
                </span>
                <blockquote>{entry.recommendation}</blockquote>
                <footer className="recommendation-card__footer">
                  <span className="recommendation-card__avatar" aria-hidden="true">{initialFor(entry.name)}</span>
                  <strong>{entry.name}</strong>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="recommendation-empty" role="status">
            <span className="recommendation-empty__mark" aria-hidden="true">“</span>
            <p className="recommendation-empty__eyebrow">NO RECOMMENDATIONS YET</p>
            <h2>This space is empty for now.</h2>
            <p>Be the first to share a recommendation about my portfolio, projects, learning, or working together.</p>
          </div>
        )}
      </GearScrollReveal>
    </section>
  );
}
