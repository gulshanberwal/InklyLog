"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { SubtleSpinner } from "@/components/SubtleSpinner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const pathname = usePathname()
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true)
    fetch(`/api/messages?userId=${session.user.id}`)
      .then(res => res.json())
      .then(setMessages).finally(() => setLoading(false))
  }, [session?.user?.id]);


  useEffect(() => {
    setLoading(false)
  }, [pathname])

  if (loading) return <SubtleSpinner />

  if (status == "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          You&lsquo;re not logged in
        </h1>
        <Link href="/login">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10 rounded-lg  dark:text-gray-400">
        No messages found.
      </p>
    )
  }

  return (
    <div className=" max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Messages</h1>

      
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-2">
        {messages.map((msg) => (
          <div
            key={msg.senderId}
            onClick={() => { setLoading(true); router.push(`/messages/${msg.senderId}`) }}
            className="flex items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 group"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div
                className="w-11 shrink-0 h-11 rounded-full p-[2px] cursor-pointer bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-900 hover:scale-105 transition"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  <Image
                    src={msg.profileImage}
                    alt={msg.name}
                    width={56}
                    height={56}
                    className="w-full h-full rounded-full object-cover border border-white dark:border-gray-700"
                  />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {msg.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                  {msg.lastMessage}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2 text-sm">
              <p className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
