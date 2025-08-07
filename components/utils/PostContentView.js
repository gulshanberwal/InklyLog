"use client";
import { useState } from "react";
import ViewTracker from "./ViewTracker";

export default function PostContentView({ slug, children }) {
  const [isBlocked, setIsBlocked] = useState(false);

  return (
    <>
      <ViewTracker slug={slug} onBlocked={() => setIsBlocked(true)} />
      {isBlocked ? (
        <div className="text-center text-red-500 font-semibold py-10">
          You have reached the maximum number of viewable posts, Please open the website in new tab or restart it.
        </div>
      ) : (
        children
      )}
    </>
  );
}
