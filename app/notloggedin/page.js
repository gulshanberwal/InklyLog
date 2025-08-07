"use client"
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

const notloggedin = () => {
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

export default notloggedin
