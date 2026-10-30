"use client";

import { useCallback, useSyncExternalStore } from "react";
import PulseHeart from "./PulseHeart.jsx";

const STORAGE_KEY = "hans-filart-sidebar-heart-liked";
const CHANGE_EVENT = "hans-filart-sidebar-heart-change";
const INITIAL_COUNT = 1204;
let fallbackLiked = false;
let fallbackCount = INITIAL_COUNT;

function readStoredState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true" || stored === "false") {
      return { liked: stored === "true", count: INITIAL_COUNT };
    }

    const state = stored ? JSON.parse(stored) : null;
    return {
      liked: typeof state?.liked === "boolean" ? state.liked : false,
      count: Number.isSafeInteger(state?.count) && state.count >= 0 ? state.count : INITIAL_COUNT,
    };
  } catch {
    return { liked: fallbackLiked, count: fallbackCount };
  }
}

function readLiked() {
  return readStoredState().liked;
}

function readCount() {
  return readStoredState().count;
}

function subscribe(onStoreChange) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function readServerLiked() {
  return false;
}

function readServerCount() {
  return INITIAL_COUNT;
}

export default function PersistentHeart() {
  const liked = useSyncExternalStore(subscribe, readLiked, readServerLiked);
  const count = useSyncExternalStore(subscribe, readCount, readServerCount);

  const handleChange = useCallback((nextLiked, nextCount) => {
    fallbackLiked = nextLiked;
    fallbackCount = nextCount;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked: nextLiked, count: nextCount }));
    } catch {
      // Keep the toggle usable if browser storage is unavailable.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <div className="rail-heart-wrap">
      <span className="rail-heart-label" aria-hidden="true">
        LIKE THIS PORTFOLIO
      </span>
      <PulseHeart
        liked={liked}
        count={count}
        onChange={handleChange}
        incrementOnly
        showCount
        label="Add a like to this portfolio"
        size={24}
        corner={20}
        likedColor="#f06c7d"
        idleColor="#8b8b93"
        pillColor="#232326"
        textColor="#f5f5f5"
        className="sidebar-heart"
      />
    </div>
  );
}
