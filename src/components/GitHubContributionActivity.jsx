const GITHUB_USERNAME = "Filart-09102005";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const CONTRIBUTION_WEEKS = 53;
const WEEKDAYS = 7;

function getPreviewLevel(week, weekday) {
  const seed = Math.sin((week + 1) * 37.719 + (weekday + 1) * 19.137) * 10000;
  const value = seed - Math.floor(seed);

  if (value < 0.2) return 0;
  if (value < 0.42) return 1;
  if (value < 0.64) return 2;
  if (value < 0.84) return 3;
  return 4;
}

const contributionDays = Array.from({ length: CONTRIBUTION_WEEKS * WEEKDAYS }, (_, index) => {
  const week = Math.floor(index / WEEKDAYS);
  const weekday = index % WEEKDAYS;

  return {
    week,
    weekday,
    level: getPreviewLevel(week, weekday),
  };
});

export default function GitHubContributionActivity() {
  return (
    <section className="home-github-activity" aria-label="GitHub contribution activity preview">
      <header className="home-github-activity__header">
        <p><span>01</span> — github</p>
        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
          @{GITHUB_USERNAME} <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="home-github-activity__visual">
        <div
          className="home-github-activity__grid"
          style={{ "--github-contribution-weeks": CONTRIBUTION_WEEKS }}
          role="img"
          aria-label="Decorative GitHub contribution heatmap preview"
        >
          {contributionDays.map((day) => (
            <span
              className="home-github-activity__day"
              data-level={day.level}
              key={`${day.week}-${day.weekday}`}
              aria-hidden="true"
              style={{ gridColumn: day.week + 1, gridRow: day.weekday + 1 }}
            />
          ))}
        </div>
        <p className="home-github-activity__total">CONTRIBUTION ACTIVITY · LAST 12 MONTHS</p>
        <div className="home-github-project-divider" aria-hidden="true" />
        <p className="home-github-scroll-cue">
          <span>SCROLL TO VIEW CONTENT</span>
          <span className="home-github-scroll-cue__line" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
