
"use client";
import Image from "next/image";
import { Eye, MessageCircle } from "lucide-react";
import LikeTracker from "./LikeTracker";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

import { useState, useEffect } from "react";

export default function DashboardTabsSection({ posts, followers, following, refreshPosts, setRefreshPosts }) {
    const router = useRouter()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(false)

    const tabClasses = (tab) =>
        `px-4 py-2 text-sm font-semibold rounded-full transition ${activeTab === tab
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`;

    const toastSuccess = () => {
        toast.success(`Post deleted successfully!`)
    }


    const showCustomToast = (postId) => {
        toast.custom((t) => (
            <div className="bg-white w-full dark:bg-blue-50 text-black  px-6 py-4 rounded-lg shadow-lg flex flex-col items-center gap-3 border dark:border-gray-700">
                <span className="text-lg">Are you sure you want to delete this post?</span>
                <div className="flex gap-4">
                    <button
                        onClick={ async () => {
                            toast.dismiss(t.id); // close toast

                            try {
                                const res = await fetch(`/api/blogs/${postId}`, {
                                    method: "DELETE",
                                });

                                if (res.ok) {
                                    setRefreshPosts(!refreshPosts)
                                        toastSuccess()
                                } else {
                                    toast.error("Failed to delete the post.");
                                }
                            } catch (err) {
                                console.error(err);
                                toast.error("An error occurred while deleting.");
                            }
                        }}

                        className="bg-blue-600 hover:scale-105 hover:bg-blue-700 text-white px-4 py-1 rounded-md"
                    >
                        OK
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)} // just close
                        className="bg-black hover:scale-105 text-white px-4 py-1 rounded-md"
                    >
                        No
                    </button>
                </div>
            </div>
        ),
        );
    };

    useEffect(() => {
        setLoading(false)
    }, [pathname])
    

    const handleNav = (section) => {
        if (activeTab === section) return;
        setLoading(true)
        setActiveTab(section)
        setLoading(false)

    };


    if (loading) return <div className="flex justify-center items-center h-[50vh]"> <div className={`w-6 h-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} /></div>

    return (
        <div>
            {/* Tab buttons */}
            <div className="flex gap-2 mb-6">
                <button className={tabClasses("posts")} onClick={() => { handleNav("posts") }}>
                    Posts
                </button>
                <button className={tabClasses("followers")} onClick={() => { handleNav("followers") }}>
                    Followers {followers.length}
                </button>
                <button className={tabClasses("following")} onClick={() => { handleNav("following") }}>
                    Following {following.length}
                </button>
            </div>

            {/* Tab content */}
            <div>
                {activeTab === "posts" && (
                    <div className="flex flex-col gap-3">
                        {posts?.length ? posts.map((post) => (
                            <div
                                key={post.slug}
                                onClick={() => { setLoading(true); router.push(`/post/${post.slug}`)}}
                                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-md transition cursor-pointer group"
                            >
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium overflow-ellipsis break-all dark:text-white">{post.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all mt-1">{post.subject}</p>
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

                                <div className="flex gap-2 mt-3 sm:mt-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLoading(true);
                                            router.push(`/dashboard/edit/${post._id}`);
                                        }}
                                        className="text-sm px-4 py-1 border border-gray-800 text-white rounded-full bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 transition hover:scale-105"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showCustomToast(post._id);
                                        }}
                                        className="text-sm px-4 py-1 border border-blue-400 hover:border-black text-white rounded-full bg-blue-600 hover:bg-black dark:hover:bg-gray-800 transition hover:scale-105"
                                    >
                                        Delete
                                    </button>
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
