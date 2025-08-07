'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function UserSearch({ onClose }) {
  const { data: session } = useSession()
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/get-search-users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const search = query.toLowerCase();
      setFiltered(
        users.filter((user) =>
          user.username.toLowerCase().startsWith(search) && user.username.toLowerCase() !== session?.user?.username.toLowerCase()
        )
      );
    }
  }, [query, users]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-start pt-24">
      <div
        ref={ref}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg p-4 shadow-lg"
      >
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none mb-4"
        />

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filtered.map((user, index) => (
            <Link
              key={index}
              href={`/public-pages/${user._id}`}
              onClick={onClose}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Image
                src={user.profileImage}
                alt={user.username}
                width={36}
                height={36}
                className="rounded-full object-cover w-9 h-9"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
