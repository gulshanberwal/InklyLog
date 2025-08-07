'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageKit from 'imagekit-javascript';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SubtleSpinner } from '@/components/SubtleSpinner';

export default function SettingsPage() {
    const { data: session, status, update } = useSession();


    const [profileImage, setprofileImage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false)

    const [userData, setUserData] = useState({
        profileImage: '',
        name: '',
        username: '',
        bio: '',
        createdAt: '',
    });


const authenticated = status == "authenticated"

    useEffect(() => {
        if (session) {
            let f = async () => {
                setLoading(true)
                let a = await fetch(`/api/register?username=${session.user.username}`)
                let res = await a.json()
                setUserData(res)
                setprofileImage(`${res.profileImage}`)
                setLoading(false)
            }
            f()
        }
        else {
            console.log("session not found!")
        }
    }, [authenticated, editMode == false, session])



    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true)
            // ✅ Step 1: Get auth signature from your backend
            const res = await fetch('/api/imagekit-auth'); // This is the bug line you saw
            const auth = await res.json();

            // ✅ Step 2: Create ImageKit instance
            const imagekit = new ImageKit({
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
                urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
            });

            // ✅ Step 3: Upload
            imagekit.upload(
                {
                    file,
                    fileName: file.name,
                    signature: auth.signature,
                    token: auth.token,
                    expire: auth.expire,
                },
                (err, result) => {
                    setLoading(false)
                    if (err) {
                        console.error("Upload error:", err);
                    } else {
                        setprofileImage(result.url)
                        setUserData((prev) => ({ ...prev, profileImage: result.url }));
                        console.log("Uploaded:", result.url);
                    }
                }
            );
        } catch (error) {
            setLoading(true)
            console.error("Something went wrong:", error);
        }
    };






    const handleSave = async () => {
        const res = await fetch(`/api/register?usernametoget=${session.user.username}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        let a = await res.json()
        let user = a.user
        if (res.ok) setEditMode(false);
        await update({ name: user.name });
        console.log(user)
    };

    console.log(session)


    if (status === "unauthenticated") {

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    You&apos;re not logged in
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

    if (status === "loading") {
        return <SubtleSpinner />
    }


    return (
        <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 py-20 px-4 text-gray-800 dark:text-gray-100">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6">
                    ⚙️ Profile Settings
                </h1>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6 mb-8">
                    {loading ? (
                        <p className="text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                            Loading...
                        </p>
                    ) : (
                        <label htmlFor="avatarInput" className="cursor-pointer group relative">
                            <div className="w-20 h-20 rounded-full border-4 border-blue-500 overflow-hidden shadow-md hover:opacity-80 transition">
                                
                                    <Image
                                        src={profileImage || "/default-avatar.png"}
                                        alt="avatar"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                
                            </div>

                            {editMode && (
                                <span className="absolute bottom-0 right-0 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 dark:text-blue-400 font-medium rounded-sm group-hover:underline">
                                    Change
                                </span>
                            )}
                        </label>
                    )}
                    {editMode && (
                        <input
                            type="file"
                            accept="image/*"
                            id="avatarInput"
                            onChange={handleUpload}
                            className="hidden"
                        />
                    )}
                </div>

                {/* Profile Fields */}
                <div className="space-y-5">
                    {["name", "username", "bio"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {field}
                            </label>
                            {editMode ? (
                                <input
                                    type="text"
                                    disabled={field == "username"}
                                    value={userData[field]}
                                    onChange={(e) =>
                                        setUserData({ ...userData, [field]: e.target.value })
                                    }
                                    className={`${field == "username"
                                        ? "text-gray-300 dark:text-gray-500 border-gray-200"
                                        : ""
                                        } w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                />
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">
                                    {userData[field] || "—"}
                                </p>
                            )}
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Account Created
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                            {userData.createdAt
                                ? new Date(userData.createdAt).toLocaleDateString()
                                : "—"}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex gap-3">
                    {editMode ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-md"
                            >
                                Save Changes
                            </button>

                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setprofileImage(userData.profileImage);
                                }}
                                className="border border-gray-400 text-gray-600 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <div className='flex gap-3'>
                            <button
                                onClick={() => {
                                    setEditMode(true);
                                    console.log(session);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-md"
                            >
                                Edit Profile
                            </button>

                            <button
                                onClick={() => signOut()}
                                className="bg-red-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-md"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
