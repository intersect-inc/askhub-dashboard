'use client'

import { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

export const FlyLayer = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {children}
    </div>,
    document.body
  )
}
