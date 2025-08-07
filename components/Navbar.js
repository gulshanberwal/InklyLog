'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, PlusSquare, MessagesSquare, User } from "lucide-react";
import UserSearch from './UserSearch';

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession();
  const [profileImage, setprofileImage] = useState(null)
  const [openSearch, setOpenSearch] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(null);


  // const hiddenRoutes = ['/login', '/register',];

  const knownRoutes = ['/', '/dashboard', '/dashboard/settings', '/dashboard/new-post'];

  const showNavbar = knownRoutes.includes(pathname) || pathname.startsWith('/post') || pathname.startsWith('/public-pages')

  useEffect(() => {
    if (session) {
      if (status !== "authenticated") return 
      let f = async () => {
        let a = await fetch(`/api/register?username=${session.user.username}`)
        let res = await a.json()
        if (!res) return;
        setprofileImage(`${res.profileImage}`)
      }
      f()
    }
  }, [status == "authenticated"])

  // Reset spinner when route changes
  useEffect(() => {
    setLoadingRoute(null);
  }, [pathname]);

  // if (hiddenRoutes.includes(pathname)) return null;
  if (!showNavbar) return null;

  const handleNav = (route) => {
    if (pathname === route) return; // Prevent navigation + spinner on same route
    setLoadingRoute(route);
    router.push(route);
  };

  const iconClass = "w-6 h-6";

  return (
    <>

          <nav id="bottom-navbar" className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 max-md:py-3 fixed bottom-0 w-full border-t border-blue-200 dark:border-gray-700 shadow-sm z-50">
            <div className="max-w-4xl mx-auto px-4 flex justify-between sm:justify-around">

              {/* Home Button */}
              <button
                onClick={() => handleNav('/')}
                className="flex flex-col items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {loadingRoute === '/' ? (
                  <div className={`${iconClass} animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} />
                ) : (
                  <Home className={iconClass} />
                )}
                <span className="hidden sm:inline text-xs">Home</span>
              </button>

              {/* Search Button */}
              <button
                onClick={() => setOpenSearch(true)}
                className="flex flex-col items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <Search className={iconClass} />
                <span className="hidden sm:inline text-xs">Search</span>
              </button>

              {openSearch && <UserSearch onClose={() => setOpenSearch(false)} />}

              {/* New Post Button */}
              <button
                onClick={() => handleNav('/dashboard/new-post')}
                className="flex flex-col items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {loadingRoute === '/dashboard/new-post' ? (
                  <div className={`${iconClass} animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} />
                ) : (
                  <PlusSquare className={iconClass} />
                )}
                <span className="hidden sm:inline text-xs">Post</span>
              </button>

              {/* Messages Button */}
              <button
                onClick={() => handleNav(`${session ? "/messages": "/notloggedin"}`)}
                className="flex flex-col items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {loadingRoute === '/messages' ? (
                  <div className={`${iconClass} animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} />
                ) : (
                  <MessagesSquare className={iconClass} />
                )}
                <span className="hidden sm:inline text-xs">Messages</span>
              </button>

              {/* Profile Button */}
              <button
                onClick={() => handleNav(session ? "/dashboard" : "/login")}
                className="flex flex-col items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {loadingRoute === (session ? "/dashboard" : "/login") ? (
                  <div className={`${iconClass} animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} />
                ) : session && profileImage ? (
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-white">
                    <Image
                      src={profileImage}
                      width={28}
                      height={28}
                      className="rounded-full w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                ) : (
                  <User className={iconClass} />
                )}
                <span className="hidden sm:inline text-xs">Profile</span>
              </button>

            </div>
          </nav>
    </>
  );
}
