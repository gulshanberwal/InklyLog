"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const FollowButton = ({ targetUserId }) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !targetUserId) return;
    setLoading(true)
    const checkFollowing = async () => {
      const res = await fetch("/api/followuser/isfollowing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId, targetUserId }),
      });

      const data = await res.json();
      setLoading(false)
      setIsFollowing(data.isFollowing);
    };

    checkFollowing();
  }, [currentUserId, targetUserId]);

  const handleToggleFollow = async () => {
    if (!currentUserId) return;

    setLoading(true);
    const res = await fetch(`/api/followuser/follow/${targetUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentUserId }),
    });

    const data = await res.json();
    setIsFollowing(data.following);
    setLoading(false);
  };

  if (!currentUserId || currentUserId === targetUserId) return null;

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`px-4 py-2 mb-3 rounded-3xl font-medium transition ${
        isFollowing
          ? "bg-gray-200 text-black hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
