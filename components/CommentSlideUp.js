"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import { X } from "lucide-react";
import FormatRelativeTime from "./utils/FormatRelativeTime";
import { toast } from "sonner";

export default function CommentSlideUp({ slug, commentsLength }) {
    const { data: session } = useSession();
    const [showComments, setShowComments] = useState(false);
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);
    const [navHeight, setNavHeight] = useState(0);
    const [loading, setLoading] = useState(true)
    const [commentLoading, setCommentLoading] = useState(false)



    useEffect(() => {
        const navbar = document.getElementById("bottom-navbar");
        if (navbar) {
            setNavHeight(navbar.offsetHeight);
        }

        const handleResize = () => {
            const newHeight = navbar?.offsetHeight || 0;
            setNavHeight(newHeight);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    useEffect(() => {
        if (showComments) {
            fetch(`/api/post/comments?slug=${slug}`)
                .then(res => res.json())
                .then(data => { setComments(data); setContent(""); setLoading(false) }).catch(()=> setLoading(false))
            
        }
    }, [slug, showComments]);


    useEffect(() => {
        if (showComments) {
            // Lock scroll
            document.body.style.overflow = "hidden";
        } else {
            // Unlock scroll
            document.body.style.overflow = "";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [showComments]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) return toast.info("You must be logged in");
        setLoading(true)
        setCommentLoading(true)

        const res = await fetch("/api/post/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postSlug: slug,
                authorId: session.user.id,
                content,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Comment failed:", errorData);
            setLoading(false)
            setCommentLoading(false)
            return;
        }

        const updatedComments = await res.json();
        setComments(updatedComments);
        setContent("");
        setLoading(false)
        setCommentLoading(false)
    };


    return (
        <>
            {/* 💬 Comments Button */}
            <button
                onClick={(e) => { setShowComments(true) }}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                <MessageCircle size={16} /> {commentsLength || 0}
            </button>

            {/* 🌫️ Background Overlay when open */}
            {showComments && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setShowComments(false)} // click outside to close
                />
            )}

            {/* 🧾 Slide-up Comments Panel */}
            <div
                style={{ paddingBottom: `${navHeight + 8}px` }}
                className={`fixed bottom-0 overflow-y-auto left-0 w-full max-h-[100%] h-4/5 bg-white dark:bg-gray-900 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_15px_rgba(255,255,255,0.05)] rounded-t-2xl transition-transform duration-300 ease-in-out z-50
  ${showComments ? "translate-y-0" : "translate-y-full"} flex flex-col overflow-hidden`}
            >
                {/* 🚪 Close Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Comments</h2>
                    <button
                        onClick={() => setShowComments(false)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
                    >
                        <X />
                    </button>
                </div>

                {/* 📝 Comment Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Write your comment here..."
                    />
                    <div className="mt-3 text-right">
                        <button
                            type="submit"
                            className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition"
                        >
                            {commentLoading ? <span className="animate-pulse">Loading...</span> : <span>Post Comment</span>}
                        </button>
                    </div>
                </form>

                {/* 💬 Comment List */}
                <div className=" px-6 py-4 space-y-6 bg-white dark:bg-gray-900">
                    {loading ? <div className="flex justify-center items-center h-[50vh]"> <div className={`w-6 h-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} /></div> : <>
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-400 dark:text-gray-500">No comments yet.</p>
                        ) : (

                            comments.map((comment) => (
                                <div key={comment._id} className="flex items-start gap-3">
                                    {/* 🖼️ Profile Image */}
                                    <img
                                        src={comment.authorId.profileImage || "/default-avatar.png"} // fallback if no image
                                        alt={comment.authorId.name}
                                        className="w-9 h-9 rounded-full object-cover border dark:border-gray-700"
                                    />

                                    {/* 💬 Comment Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {comment.authorId.name}
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">@{comment.authorId.username}</span>
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">{comment.content}</p>
                                        <FormatRelativeTime dateString={comment.createdAt} />
                                    </div>
                                </div>
                            ))
                        )}</>}
                </div>
            </div>
        </>
    );
}