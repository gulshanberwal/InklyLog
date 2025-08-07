"use client";
import { useEffect } from "react";
import { useState } from "react";

export default function ViewTracker({ slug, onBlocked }) {
  useEffect(() => {
    // Get all keys from sessionStorage that start with 'viewed-'
    const allViewed = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("viewed-")
    );
    // If this post has already been viewed, return early
    const viewedKey = `viewed-${slug}`;
    if (sessionStorage.getItem(viewedKey)) return;

    // If already viewed 100 posts, do not track more
    if (allViewed.length >= 500) {
      if (onBlocked) onBlocked();
      return;
    }

    // Otherwise, log the view
    fetch("/api/post/view", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    // Mark this post as viewed
    sessionStorage.setItem(viewedKey, "true");
  }, [slug, onBlocked]);

  return null;
}