"use client";

import { useCallback, useEffect, useState } from "react";
import GearScrollReveal from "./GearScrollReveal";

function initialFor(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function RecommendationBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [recommendationsLoadError, setRecommendationsLoadError] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [headerComplete, setHeaderComplete] = useState(false);
  const finishHeader = useCallback(() => setHeaderComplete(true), []);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      try {
        const response = await fetch("/api/recommendations", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success !== true || !Array.isArray(result.recommendations)) {
          throw new Error("Unable to load recommendations");
        }

        if (active) {
          setRecommendations((current) => {
            const loadedIds = new Set(result.recommendations.map((entry) => entry.id));
            const newestLocal = current.filter((entry) => !loadedIds.has(entry.id));
            return [...newestLocal, ...result.recommendations];
          });
          setRecommendationsLoadError(false);
        }
      } catch {
        if (active) setRecommendationsLoadError(true);
      } finally {
        if (active) setIsLoadingRecommendations(false);
      }
    }

    void loadRecommendations();
    return () => {
      active = false;
    };
  }, []);

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
      setIsLoadingRecommendations(false);
      setRecommendationsLoadError(false);
      form.reset();
      setIsFormOpen(false);
      setStatus({
        type: "success",
        message: result.notificationSent === false
          ? "Your recommendation was saved, but the email notification could not be sent."
          : "Thank you. Your recommendation has been added below.",
      });
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
        <p className="recommendation-page__eyebrow">
          <span>01 / RECOMMENDATION</span>
          <span className="recommendation-page__context">PEOPLE · PORTFOLIO · PROJECTS</span>
        </p>
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
        targetSelector=".recommendation-card, .recommendation-empty"
        enabled={headerComplete}
        stagger={0.12}
        distance={18}
        blur={6}
        duration={0.76}
        threshold={0.14}
      >
        {isLoadingRecommendations ? (
          <div className="recommendation-empty" role="status">
            <p>Loading recommendations…</p>
          </div>
        ) : recommendationsLoadError ? (
          <div className="recommendation-empty" role="alert">
            <p>Recommendations are temporarily unavailable. Please refresh and try again.</p>
          </div>
        ) : recommendations.length ? (
          <div className="recommendation-grid" role="list" aria-label="Submitted recommendations">
            {recommendations.map((entry, index) => (
              <article className="recommendation-card" key={entry.id} role="listitem">
                <span className="recommendation-card__number">
                  {`${String(index + 1).padStart(2, "0")} / RECOMMENDATION`}
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
