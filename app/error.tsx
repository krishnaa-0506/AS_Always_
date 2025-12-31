'use client'

import { useEffect } from 'react'
import CinematicBackground from '@/components/CinematicBackground'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <CinematicBackground />
      <div className="relative z-10 text-center text-white">
        <h2 className="text-4xl font-cinematic mb-4">Something went wrong!</h2>
        <p className="text-lg mb-8">{error.message}</p>
        <button onClick={() => reset()} className="btn-primary">Try again</button>
      </div>
    </div>
  )
}
