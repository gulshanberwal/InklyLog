'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { IoHelpSharp } from "react-icons/io5";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react'; // Spinner

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path) => {
    if (pathname === path) return; // Prevent spinner if already on the route
    setLoading(true);
    router.push(path);
  };

  useEffect(() => {
    setLoading(false)
  }, [pathname])
  

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-blue-100 dark:border-gray-700 shadow-sm z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo / Theme Toggle */}
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-wide">
          InklyLog
        </Link>

        {/* Center: Tagline */}
        <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 font-medium">
          Share your thoughts with the world
        </p>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {/* Help Icon with Spinner */}
          <button
            onClick={() => handleNavigate("/about")}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <IoHelpSharp className="h-5 w-5" />
            )}
          </button>

          {/* Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
