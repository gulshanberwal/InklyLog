'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import { SubtleSpinner } from '@/components/SubtleSpinner';
import DashboardTabsSection from '@/components/utils/DashboardTabsSection';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter()
    const pathname = usePathname()
    const [posts, setposts] = useState([])
    const [profileImage, setprofileImage] = useState("")
    const [Name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [refreshPosts, setRefreshPosts] = useState(false)
    const [followersState, setFollowersState] = useState([]);
    const [followingState, setFollowingState] = useState([]);
    const [loading, setLoading] = useState(false)

    const cleanPosts = posts.map((post) => ({
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        subject: post.subject,
        views: post.views,
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt.toString(), // or .toISOString()
        authorId: post.authorId.toString(),
    }));

    const authenticated = status == "authenticated"

    useEffect(() => {
        if (session) {
            setLoading(true)
            if (status !== "authenticated") console.log("you are not logged in")
            let f = async () => {
                let a = await fetch(`/api/register?username=${session.user.username}`)
                let res = await a.json()
                if (!res) return;
                setprofileImage(`${res.profileImage}`)
                setName(`${res.name}`)
                setUsername(`${res.username}`)
                setBio(`${res.bio}`)
                console.log(res.following)

                // Set followers and following directly from populated data
                setFollowersState(res.followers);
                setFollowingState(res.following);
                setLoading(false)
            }
            f()
        }
    }, [authenticated, session, status])

    useEffect(() => {
        if (session) {
            setLoading(true)
            let fetchBlogs = async () => {
                let a = await fetch(`/api/blogs?authorId=${session.user.id}`)
                let res = await a.json()
                setposts(res)
                setLoading(false)
            }
            fetchBlogs()
        }
    }, [authenticated, refreshPosts, session])


    useEffect(() => {
        setLoading(false)
    }, [pathname])



    if (status == "unauthenticated") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    You&lsquo;re not logged in
                </h1>
                <Link href="/login">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                        Go to Login
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        );
    }


    if (status === "loading" || !profileImage || loading) {
        return <SubtleSpinner />
    }

    return (

        <main className="max-w-5xl mx-auto px-4 py-20 relative text-black dark:text-white">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-start gap-4 w-full">
                    {profileImage && (
                        <div
                            className="w-14 shrink-0 h-14 mt-0.5 rounded-full p-[2px] cursor-pointer bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-900 hover:scale-105 transition"
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                                <Image
                                    src={profileImage}
                                    alt="Profile Image"
                                    width={56}
                                    height={56}
                                    className="w-full h-full rounded-full object-cover border border-white dark:border-gray-700"
                                />
                            </div>
                        </div>
                    )}

                    <div className='w-full'>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex justify-between items-center">{Name}<div className=''>
                            <button
                                onClick={() => { setLoading(true); router.push("/dashboard/settings") }}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        </div></h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{username}</p>
                        <p className="mt-1 text-gray-600 break-all dark:text-gray-300 text-sm">{bio}</p>
                    </div>
                </div>

            </div>

            {/* Create Post Button */}
            <div className="mb-6">
                <button
                    onClick={() => { setLoading(true); router.push("/dashboard/new-post") }}
                    className="inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition hover:scale-105"
                >
                    + Create New Post
                </button>
            </div>

            <DashboardTabsSection posts={cleanPosts} followers={followersState} following={followingState} refreshPosts={refreshPosts} setRefreshPosts={setRefreshPosts} />


        </main>
    );
}
