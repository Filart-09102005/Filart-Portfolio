"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createClient } from "@supabase/supabase-js";
import PulseHeart from "./PulseHeart.jsx";

const STORAGE_KEY = "hans-filart-sidebar-heart-v2";
const LIKED_CHANGE_EVENT = "hans-filart-sidebar-heart-liked";
const COUNTER_TABLE = "portfolio_heart_counter";
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dqshpdllkuqgwkhydnaw.supabase.co";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_5ZReNVciuL9aOF_WoZ9VTQ_VcHVTZfC";
const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;

function readStoredLike() {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") return true;
    if (!stored) return false;
    return JSON.parse(stored)?.liked === true;
  } catch {
    return false;
  }
}

function subscribeToLiked(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LIKED_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LIKED_CHANGE_EVENT, onChange);
  };
}

function readServerLiked() {
  return false;
}

export default function PersistentHeart() {
  const liked = useSyncExternalStore(subscribeToLiked, readStoredLike, readServerLiked);
  const [count, setCount] = useState(0);
  const [syncFailed, setSyncFailed] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    const loadCount = async () => {
      const { data, error } = await supabase
        .from(COUNTER_TABLE)
        .select("total")
        .eq("id", 1)
        .single();

      if (active && !error && Number.isFinite(Number(data?.total))) {
        setCount((current) => Math.max(current, Number(data.total)));
      }
    };

    void loadCount();

    const channel = supabase
      .channel("portfolio-heart-counter")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: COUNTER_TABLE,
          filter: "id=eq.1",
        },
        ({ new: record }) => {
          const nextCount = Number(record?.total);
          if (active && Number.isFinite(nextCount)) {
            setCount(nextCount);
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = useCallback(async () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
      window.dispatchEvent(new Event(LIKED_CHANGE_EVENT));
    } catch {
      // The shared counter still works if this visitor blocks browser storage.
    }

    if (!supabase) return;

    try {
      const { data, error } = await supabase.rpc("increment_portfolio_heart");
      const nextCount = Number(data);
      if (error || !Number.isFinite(nextCount)) throw error || new Error("Invalid heart count");
      setCount((current) => Math.max(current, nextCount));
      setSyncFailed(false);
    } catch {
      setSyncFailed(true);
    }
  }, []);

  return (
    <div className="rail-heart-wrap">
      <span className="rail-heart-label" aria-hidden="true">
        {syncFailed ? "HEART COUNT DID NOT SYNC" : "LIKE THIS PORTFOLIO"}
      </span>
      <PulseHeart
        liked={liked}
        count={count}
        onChange={handleChange}
        showCount
        incrementOnly
        disabled={!supabase}
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
