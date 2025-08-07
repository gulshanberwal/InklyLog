// components/TabsSection.js
"use client";
import Image from "next/image";
import FormatRelativeTime from "./FormatRelativeTime";
import { Eye, MessageCircle } from "lucide-react";
import LikeTracker from "./LikeTracker";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function TabsSection({ posts, followers, following }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false)

  const tabClasses = (tab) =>
    `px-4 py-2 text-sm font-semibold rounded-full transition ${activeTab === tab
      ? "bg-blue-600 text-white"
      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    }`;

  const handleNav = (section) => {
    if (activeTab === section) return;
    setLoading(true)
    setActiveTab(section)
    setLoading(false)

  };


  useEffect(() => {
    setLoading(false)
  }, [pathname])

  if (loading) return <div className="flex justify-center items-center h-[50vh]"> <div className={`w-6 h-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} /></div>

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        <button className={tabClasses("posts")} onClick={() => handleNav("posts")}>
          Posts
        </button>
        <button className={tabClasses("followers")} onClick={() => handleNav("followers")}>
          Followers
        </button>
        <button className={tabClasses("following")} onClick={() => handleNav("following")}>
          Following
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "posts" && (
          <div className="flex flex-col gap-3">
            {posts?.length ? posts.map((post) => (
              <div
                onClick={() => { setLoading(true); router.push(`/post/${post.slug}`) }}
                key={post.slug}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium break-all dark:text-white">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all mt-1">{post.subject}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-1">
                    <div>
                      <FormatRelativeTime dateString={post.createdAt} />
                    </div>
                    <div className="flex gap-4 items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {post.views}
                      </div>
                      <div className="flex items-center gap-1 pointer-events-none">
                        <LikeTracker slug={post.slug} initialLikes={post.likes} />
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" /> {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : <p>No posts yet.</p>}
          </div>
        )}

        {(activeTab === "followers" || activeTab === "following") && (
          <div className="grid gap-3">
            {(activeTab === "followers" ? followers : following)?.length ? (
              (activeTab === "followers" ? followers : following).map((user) => (
                <div
                  key={user._id}
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-3 flex items-center gap-4 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                >
                  <div
                    className="w-11 self-start h-11 mt-0.5 rounded-full cursor-pointer bg-gradient-to-tr hover:scale-105 transition"
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                      <Image
                        src={user.profileImage}
                        alt="Profile Image"
                        width={56}
                        height={56}
                        className="w-full rounded-full h-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col -ml-1">
                    <span className="text-sm font-medium dark:text-white">{user.name}</span>
                    <span className="text-xs text-gray-500">@{user.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>{activeTab === "followers" ? "No followers." : "Not following anyone."}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
