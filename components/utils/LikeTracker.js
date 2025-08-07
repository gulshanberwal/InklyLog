"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";

export default function LikeTracker({ slug, initialLikes }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    if (!session || !session.user) return; // wait until session is available
    
    const likedPosts = JSON.parse(
      localStorage.getItem(`likedPosts-${session.user.username}`) || "[]"
    );
    setLiked(likedPosts.includes(slug));
  }, [slug, status == "authenticated"]);
  

  const handleLikeToggle = async () => {

    if (!session || !session.user) return router.push("/notloggedin") 

    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    const res = await fetch("/api/post/like", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: newLikedState ? "like" : "unlike" }),
    }
    );
    let a = await res.json()
    console.log(a)
    // Update localStorage
    let likedPosts = JSON.parse(localStorage.getItem(`likedPosts-${session.user.username}`) || "[]");
    if (newLikedState) {
      likedPosts.push(slug);
    } else {
      likedPosts = likedPosts.filter(s => s !== slug);
    }
    localStorage.setItem(`likedPosts-${session.user.username}`, JSON.stringify(likedPosts));
  };

  return (
    <span
      onClick={handleLikeToggle}
      className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-400"}`}
    >
      <FaHeart size={16} /> {likes}
    </span>
  );
}
