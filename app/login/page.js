'use client';

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          You're already logged in
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 pb-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <Link href={"/register"}>
          <p className="text-blue-600 dark:text-blue-400 text-sm py-1 pl-0.5">Create new account</p>
        </Link>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Login
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>

  );
}
