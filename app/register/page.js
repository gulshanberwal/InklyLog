'use client';

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageKit from "imagekit-javascript";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubtleSpinner } from "@/components/SubtleSpinner";


export default function RegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const pathname = usePathname()
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const res = await fetch('/api/imagekit-auth');
      const auth = await res.json();

      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
      });

      imagekit.upload(
        {
          file,
          fileName: file.name,
          signature: auth.signature,
          token: auth.token,
          expire: auth.expire,
        },
        (err, result) => {
          setLoading(false);
          if (err) {
            console.error("Upload error:", err); // Even if empty, log it
          } else {
            setImageUrl(result.url); // ✅ Save to stat
          }
        }
      );
    } catch (error) {
      setLoading(false);
      console.error("Something went wrong:", error);
    }
  };


  const allowedPatternName = /^[a-zA-Z0-9_ ]*$/;
  const allowedPatternUsername = /^[a-zA-Z0-9_]*$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setScreenLoading(true)
    let form = e.target

    const formData = new FormData();
    formData.append("name", form.name.value);
    formData.append("username", form.username.value);
    formData.append("password", form.password.value);
    formData.append("bio", form.bio.value);
    formData.append("profileImage", imageUrl); // 🔵 using uploaded URL

    const name = form.name.value.trim();
    const username = form.username.value.trim();

    if (!allowedPatternName.test(name)) {
      setError("Name can only contain letters, numbers, underscores, and spaces.");
      setScreenLoading(false)
      return;
    }

    if (!allowedPatternUsername.test(username)) {
      setError("Username can only contain letters, numbers, and underscores (no spaces).");
      setScreenLoading(false)
      return;
    }


    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
      setScreenLoading(false)

    }
  };

  useEffect(() => {
    setScreenLoading(false)
  }, [pathname])



  const handleNameChange = (e) => {
    const value = e.target.value;
    if (allowedPatternName.test(value)) {
      e.target.value = value; // keep it
    } else {
      e.target.value = value.replace(/[^a-zA-Z0-9_ ]/g, ""); // strip bad chars
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (allowedPatternUsername.test(value)) {
      e.target.value = value;
    } else {
      e.target.value = value.replace(/[^a-zA-Z0-9_]/g, "");
    }
  };


  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          You&lsquo;re already Registered
        </h1>
        <Link href="/">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            Go to Home
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    );
  }

  if (screenLoading) return <SubtleSpinner />


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 max-md:py-20">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create Account</h2>

        <input
          name="name"
          type="text"
          maxLength={18}
          placeholder="Full Name"
          onChange={handleNameChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="username"
          maxLength={18}
          type="text"
          placeholder="Username(cannot change it again)"
          onClick={handleUsernameChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="bio"
          type="text"
          placeholder="Bio"
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* File upload input */}
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4 border border-gray-200 dark:border-gray-600">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Upload Profile Image</span>
            <input
              type="file"
              required
              accept="image/*"
              onChange={handleUpload}
              className="mt-2 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 
            file:rounded-full file:border-0 
            file:text-sm file:font-semibold 
            file:bg-blue-50 file:text-blue-700 
            hover:file:bg-blue-100 transition"
            />
          </label>

          {loading && <p className="text-blue-600 font-medium animate-pulse">Loading...</p>}

          {imageUrl && (
            <div className="mt-4">
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md ring-2 ring-blue-300">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Link href={"/login"}>
          <p className="text-blue-600 dark:text-blue-400 text-sm py-1 pl-0.5">Already have an account</p>
        </Link>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Register
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
