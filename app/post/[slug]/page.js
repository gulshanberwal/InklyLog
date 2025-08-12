
import { notFound } from "next/navigation";
import Image from "next/image";
import dbConnect from "@/lib/mongoose";
import Blogs from "@/models/Blogs";
import Register from "@/models/Register";
import PostContent from "@/components/PostContent";
import { Eye } from "lucide-react"
import PostContentView from "@/components/utils/PostContentView";
import LikeTracker from "@/components/utils/LikeTracker";
import FormatRelativeTime from "@/components/utils/FormatRelativeTime";
import CommentSlideUp from "@/components/CommentSlideUp";

export async function generateMetadata({ params }) {
    const slug = params.slug;
    await dbConnect()
    const post = await Blogs.findOne({ slug: slug });
    return {
        title: post ? post.title : "Post not found",
    };
}

export default async function PostPage({ params }) {
    const slug = params.slug;
    await dbConnect();
    const post = await Blogs.findOne({ slug: slug }).populate("authorId");

    if (!post) return notFound();

    return (
        <main className="max-w-3xl mx-auto px-4 py-28 text-black dark:text-white space-y-6">
            <PostContentView slug={post.slug}>
                {/* Author Section */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-600 overflow-hidden bg-white dark:bg-gray-800">
                        <Image
                            src={post.authorId.profileImage || "/default-avatar.png"}
                            alt={post.authorId.name}
                            width={52}
                            height={52}
                            className="w-full rounded-full h-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                    </div>


                    <div className="text-sm">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {post.authorId.name}{" "}
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                                @{post.authorId.username}
                            </span>
                        </p>
                        <FormatRelativeTime dateString={post.createdAt} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-extrabold tracking-tight leading-tight break-all text-gray-900 dark:text-white">
                    {post.title}
                </h1>

                {/* Divider */}
                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Post Content */}
                <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
                    <PostContent post={JSON.parse(JSON.stringify(post))} />
                </div>

                {/* Post Stats */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {post.views}
                    </div>
                    <LikeTracker slug={post.slug} initialLikes={post.likes} />
                    <div className="flex items-center gap-1">
                        <CommentSlideUp slug={post.slug} commentsLength={post.comments} />
                    </div>
                </div>
            </PostContentView>
        </main>
    );
}
