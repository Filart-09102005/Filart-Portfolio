"use client";

import { useCallback, useSyncExternalStore } from "react";
import PulseHeart from "./PulseHeart.jsx";

const STORAGE_KEY = "hans-filart-sidebar-heart-v2";
const CHANGE_EVENT = "hans-filart-sidebar-heart-change";
const INITIAL_COUNT = 0;
let fallbackLiked = false;

function readStoredState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true" || stored === "false") {
      const liked = stored === "true";
      return { liked, count: liked ? 1 : 0 };
    }

    const state = stored ? JSON.parse(stored) : null;
    const liked = typeof state?.liked === "boolean" ? state.liked : false;
    return {
      liked,
      count: liked ? 1 : 0,
    };
  } catch {
    return { liked: fallbackLiked, count: fallbackLiked ? 1 : 0 };
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

  const handleChange = useCallback((nextLiked) => {
    const likedByThisVisitor = Boolean(nextLiked);
    fallbackLiked = likedByThisVisitor;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked: likedByThisVisitor }));
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
        showCount
        label="Like this portfolio"
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
