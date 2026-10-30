"use client";

import { useEffect, useRef, useState } from "react";
import Counter from "./Counter";
import ElasticSlider from "./ElasticSlider";

const LANY_TRACK_ID = "z-SrH7XY1lc";
const LANY_TRACK_URL = `https://www.youtube.com/watch?v=${LANY_TRACK_ID}`;
const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";

let youtubeApiPromise;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => reject(new Error("YouTube player timed out.")), 15000);
    const handleReady = () => {
      previousReady?.();
      window.clearTimeout(timeout);
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube player did not initialize."));
    };

    window.onYouTubeIframeAPIReady = handleReady;

    let script = document.querySelector(`script[src="${YOUTUBE_IFRAME_API}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = YOUTUBE_IFRAME_API;
      script.async = true;
      script.addEventListener("error", () => {
        window.clearTimeout(timeout);
        reject(new Error("YouTube player could not be loaded."));
      }, { once: true });
      document.head.appendChild(script);
    }
  }).catch((error) => {
    youtubeApiPromise = undefined;
    throw error;
  });

  return youtubeApiPromise;
}

const formatTrackTime = (value) => {
  const seconds = Math.max(0, Math.floor(Number(value) || 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

function AboutMusicPlayer() {
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const volumeRef = useRef(48);
  const [playerStatus, setPlayerStatus] = useState("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let active = true;

    loadYouTubeIframeApi()
      .then((youtube) => {
        if (!active || !playerHostRef.current) return;

        playerRef.current = new youtube.Player(playerHostRef.current, {
          width: "100%",
          height: "100%",
          videoId: LANY_TRACK_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady(event) {
              if (!active) return;
              event.target.setVolume(volumeRef.current);
              const total = event.target.getDuration();
              if (Number.isFinite(total) && total > 0) setDuration(total);
              setPlayerStatus("ready");
            },
            onStateChange(event) {
              if (!active) return;
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            },
            onError() {
              if (active) setPlayerStatus("unavailable");
            },
          },
        });
      })
      .catch(() => {
        if (active) setPlayerStatus("unavailable");
      });

    return () => {
      active = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (playerStatus !== "ready") return undefined;

    const syncProgress = () => {
      const player = playerRef.current;
      if (!player) return;

      const nextTime = player.getCurrentTime();
      const nextDuration = player.getDuration();
      if (Number.isFinite(nextTime)) {
        setCurrentTime((previous) => Math.abs(previous - nextTime) > 0.15 ? nextTime : previous);
      }
      if (Number.isFinite(nextDuration) && nextDuration > 0) {
        setDuration((previous) => Math.abs(previous - nextDuration) > 0.5 ? nextDuration : previous);
      }
    };

    const timer = window.setInterval(syncProgress, 500);
    return () => window.clearInterval(timer);
  }, [playerStatus]);

  const handleVolumeChange = (nextVolume) => {
    const next = Math.max(0, Math.min(100, Number(nextVolume) || 0));
    volumeRef.current = next;
    if (playerStatus === "ready") playerRef.current?.setVolume(Math.round(next));
  };

  const togglePlayback = () => {
    if (playerStatus !== "ready" || !playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const seekTo = (value) => {
    const nextTime = Math.max(0, Math.min(duration || 0, Number(value) || 0));
    setCurrentTime(nextTime);
    playerRef.current?.seekTo(nextTime, true);
  };

  const skip = (amount) => {
    const playerTime = playerRef.current?.getCurrentTime();
    seekTo((Number.isFinite(playerTime) ? playerTime : currentTime) + amount);
  };

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section className="about-music" aria-labelledby="about-music-title">
      <p className="about-music__eyebrow">ON REPEAT / TEMPORARY PICK</p>
      <div className="about-music__layout">
        <div className={`about-music__cover${isPlaying ? " about-music__cover--playing" : ""}`}>
          <div ref={playerHostRef} className="about-music__player-host" />
          <div
            className="about-music__cover-art"
            aria-hidden="true"
            style={{ backgroundImage: `url("https://i.ytimg.com/vi/${LANY_TRACK_ID}/hqdefault.jpg")` }}
          />
          {playerStatus === "unavailable" && (
            <a className="about-music__fallback" href={LANY_TRACK_URL} target="_blank" rel="noreferrer">
              Play LANY on YouTube <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        <div className="about-music__details">
          <div className="about-music__track-heading">
            <div>
              <h2 id="about-music-title">ILYSB</h2>
              <p>LANY</p>
            </div>
            <span className={`about-music__status about-music__status--${playerStatus}`} aria-live="polite">
              {playerStatus === "loading" ? "LOADING" : playerStatus === "unavailable" ? "OPEN ON YOUTUBE" : isPlaying ? "NOW PLAYING" : "READY TO PLAY"}
            </span>
          </div>

          <div className="about-music__timeline">
            <span>{formatTrackTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={Math.max(duration, 1)}
              step="1"
              value={Math.min(currentTime, Math.max(duration, 1))}
              onChange={(event) => seekTo(event.target.value)}
              disabled={playerStatus !== "ready" || duration <= 0}
              aria-label="LANY track playback position"
              style={{ "--track-progress": `${progress}%` }}
            />
            <span>-{formatTrackTime(Math.max(0, duration - currentTime))}</span>
          </div>

          <div className="about-music__controls">
            <div className="about-music__transport">
              <button type="button" onClick={() => skip(-10)} disabled={playerStatus !== "ready"} aria-label="Rewind 10 seconds">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14M19 6v12l-10-6 10-6Z" /></svg>
              </button>
              <button
                className="about-music__play"
                type="button"
                onClick={togglePlayback}
                disabled={playerStatus !== "ready"}
                aria-label={isPlaying ? "Pause LANY track" : "Play LANY track"}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>
                )}
              </button>
              <button type="button" onClick={() => skip(10)} disabled={playerStatus !== "ready"} aria-label="Forward 10 seconds">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5v14M5 6v12l10-6-10-6Z" /></svg>
              </button>
            </div>

            <div className="about-music__volume">
              <span className="about-music__volume-label">VOLUME</span>
              <ElasticSlider
                defaultValue={48}
                startingValue={0}
                maxValue={100}
                onChange={handleVolumeChange}
                valuePosition="none"
                ariaLabel="LANY playback volume"
                disabled={playerStatus !== "ready"}
                thickness={5}
                activeThickness={8}
                trackColor="rgba(235, 237, 228, 0.18)"
                rangeColor="var(--sage)"
                iconColor="var(--sage)"
                className="about-music__slider"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <a className="about-music__source" href={LANY_TRACK_URL} target="_blank" rel="noreferrer">
            Open official track on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function AboutTodayClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dateParts = now
    ? new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        weekday: "long",
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).formatToParts(now)
    : [];
  const part = (type) => dateParts.find((value) => value.type === type)?.value ?? "--";

  const units = [
    { key: "day", label: "DAY", value: part("day") },
    { key: "hour", label: now ? `HOUR ${part("dayPeriod")}` : "HOUR", value: part("hour") },
    { key: "minute", label: "MINUTE", value: part("minute") },
    { key: "second", label: "SECOND", value: part("second") },
  ];

  return (
    <section className="about-today home-profile-clock" aria-labelledby="about-today-title">
      <div className="about-today__heading">
        <p className="about-today__eyebrow" id="about-today-title">TODAY / LOCAL TIME</p>
        <span>PHILIPPINES · UTC+08</span>
      </div>

      <div
        className="about-today__units"
        aria-label={now ? `Current time in the Philippines: ${new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", timeStyle: "long" }).format(now)}` : "Current time loading"}
      >
        {units.map((unit) => (
          <div className="about-today__unit" key={unit.key}>
            <div className="about-today__counter-box">
              {now ? (
                <Counter
                  value={Number(unit.value) || 0}
                  minDigits={2}
                  intro={false}
                  motionBlur={false}
                  fontSize="clamp(1.45rem, 2.6vw, 2.05rem)"
                  fontWeight={600}
                  textColor="var(--foreground)"
                />
              ) : <span className="about-today__placeholder">--</span>}
            </div>
            <span className="about-today__unit-label">{unit.label}</span>
          </div>
        ))}
      </div>

      <p className="about-today__date-copy">
        <span>{now ? part("weekday").toUpperCase() : "LOADING DAY"}</span>
        <span>{now ? `${part("month").toUpperCase()} ${part("year")}` : "PHILIPPINES TIME"}</span>
      </p>
      <p className="about-today__note">A little snapshot of today, in Philippine time.</p>
    </section>
  );
}

export default function AboutInteractiveDetails() {
  return (
    <div className="about-extras">
      <AboutMusicPlayer />
    </div>
  );
}
