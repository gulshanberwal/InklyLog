"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoCheckmarkCircleOutline, IoCheckmarkDoneCircle } from "react-icons/io5";
import { Trash2, ArrowRight } from "lucide-react";
import io from "socket.io-client";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { SubtleSpinner } from "@/components/SubtleSpinner";

export default function ConversationPage() {
  const { userId } = useParams();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({})
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetcher = async () => {
      if (status !== "authenticated") return;
      setLoading(true)
      const res = await fetch(`/api/register?id=${userId}`)
      const data = await res.json()
      setUserData(data)
      setLoading(false)
    }
    fetcher()
  }, [userId, status])



  useEffect(() => {
    if (!session?.user?.id || !userId) return;
    if (status !== "authenticated") return;
    setLoading(true)
    // 1. Connect to socket server
    const timeout = setTimeout(() => {

      socketRef.current = io("https://my-socket-server-541r.onrender.com", {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // 2. Join room for this conversation
      socketRef.current.emit("join", {
        senderId: session.user.id,
        receiverId: userId,
      })


      // 4. Listen for new incoming messages
      socketRef.current.on("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });


      // 5. Listen for message read updates (optional)
      socketRef.current.on("message-read", (messageId) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      });

    }, 300);



    const fetcher = async () => {
      if (status !== "authenticated") return;
      const res = await fetch(`/api/messages/conversation?user1=${session?.user?.id}&user2=${userId}`)
      const data = await res.json()
      setMessages(data)

    }
    fetcher()
    setLoading(false)


    // Cleanup on unmount
    return () => {
      clearTimeout(timeout)
      socketRef.current?.disconnect();
    };
  }, [session?.user?.id, userId]);


  useEffect(() => {
    if (status !== "authenticated") return;
    scrollToBottom();
  }, [messages.length + 1]);

  useEffect(() => {
    if (!session?.user?.id || !userId) return;
    if (status !== "authenticated") return;
    fetch("/api/messages/mark-read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: userId,     // person who sent you messages
        receiverId: session?.user?.id, // you are the receiver
      }),
    });
  }, [session?.user?.id, userId]);



  const handleSend = async () => {
    if (status !== "authenticated") return;
    if (!newMessage.trim()) return;
    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: session?.user?.id,
        receiver: userId,
        content: newMessage,
      }),
    });

    const data = await res.json();
    setNewMessage("");

    // Emit the message to the socket server
    socketRef.current?.emit("send-message", data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const handleSelectMessage = (id, senderId) => {
    if (status !== "authenticated") return;
    if (senderId !== session.user.id) return; // Only allow selecting own messages
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (status !== "authenticated") return;
    if (selectedMessages.size === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/messages/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: Array.from(selectedMessages) }),
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => !selectedMessages.has(m._id)));
        setSelectedMessages(new Set());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    const clearSelection = (e) => {
      if (e.key === "Escape") setSelectedMessages(new Set());
    };
    window.addEventListener("keydown", clearSelection);
    return () => window.removeEventListener("keydown", clearSelection);
  }, []);


  if (loading || status == "loading") return <SubtleSpinner />

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

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-4 flex flex-col h-screen relative">
      {/* Top Bar with User Info & Dark Mode Toggle */}
      <div className="fixed top-0 left-0 right-0 z-40 w-full bg-white dark:bg-gray-900 border-b px-4 py-2.5 flex justify-between md:justify-around items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-11 shrink-0 h-11 mt-0.5 rounded-full p-[2px] cursor-pointer bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-900 hover:scale-105 transition"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
              <Image
                src={userData.profileImage || "/default-avatar.png"}
                alt="Profile Image"
                width={56}
                height={56}
                className="w-full h-full rounded-full object-cover border border-white dark:border-gray-700"
              />
            </div>
          </div>
          <div>
            <p className="font-medium text-sm dark:text-white">{userData.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{userData.username}</p>
          </div>
        </div>
        <div className="z-50">
          <ThemeToggle />
        </div>
      </div>

      {/* Delete bar if messages selected */}
      {selectedMessages.size > 0 && (
        <div className="fixed top-[56px] left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b px-4 py-5 shadow-sm flex justify-between md:justify-around items-center">
          <p className="text-sm">{selectedMessages.size} selected</p>
          <button
            onClick={handleDeleteSelected}
            className="text-red-600 flex items-center gap-1"
            disabled={deleting}
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      )}

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-1 custom-scroll mb-4 no-scrollbar mt-2">
        {messages.map((msg, index) => {
          const isSender = msg.sender === session.user.id;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                onClick={() => handleSelectMessage(msg._id, msg.sender)}
                className={`p-3 rounded-2xl shadow-md max-w-xs break-words whitespace-pre-wrap transition-all ${isSender
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                  } ${selectedMessages.has(msg._id) ? "ring-2 ring-red-400" : ""}`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isSender && (
                    <span className="ml-2">
                      {msg.isRead ? (
                        <IoCheckmarkDoneCircle size={18} />
                      ) : (
                        <IoCheckmarkCircleOutline size={18} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          type="text"
          onInput={handleInput}
          className="flex-1 max-h-[35vh] max-md:max-h-[50vh] border h-12 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-gray-800 overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 transition-colors h-12 self-end text-white px-4 py-2 rounded-xl shadow"
        >
          Send
        </button>
      </div>
    </div>

  );
}
