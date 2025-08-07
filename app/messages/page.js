"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { SubtleSpinner } from "@/components/SubtleSpinner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const pathname = usePathname()
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true)
    fetch(`/api/messages?userId=${session.user.id}`)
      .then(res => res.json())
      .then(setMessages);
    setLoading(false)
  }, [session?.user?.id]);


  useEffect(() => {
    setLoading(false)
  }, [pathname])

  if (loading) return <SubtleSpinner />

  if (status == "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          You're not logged in
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

  return (
    <div className=" max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-10 rounded-lg  dark:text-gray-400">
          No messages found.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-2">
          {messages.map((msg) => (
            <div
              key={msg.senderId}
              onClick={() => router.push(`/messages/${msg.senderId}`)}
              className="flex items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 group"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <img
                  src={msg.profileImage || "/default-avatar.png"}
                  alt={msg.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
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
                {!msg.isRead && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">● New</span>
                )}
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
