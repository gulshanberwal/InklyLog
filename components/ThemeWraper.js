'use client'

import { useEffect, useState } from 'react'

export default function ThemeWrapper({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent hydration error
    return null
  }

  return children
}
