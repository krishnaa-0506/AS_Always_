'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CinematicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(102, 126, 234, 0.4) 0%, 
            rgba(118, 75, 162, 0.3) 25%, 
            rgba(255, 107, 107, 0.2) 50%,
            rgba(0, 0, 0, 0.9) 100%)`,
        }}
        animate={{
          background: [
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(102, 126, 234, 0.4) 0%, 
              rgba(118, 75, 162, 0.3) 25%, 
              rgba(255, 107, 107, 0.2) 50%,
              rgba(0, 0, 0, 0.9) 100%)`,
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 107, 107, 0.4) 0%, 
              rgba(78, 205, 196, 0.3) 25%, 
              rgba(224, 86, 253, 0.2) 50%,
              rgba(0, 0, 0, 0.9) 100%)`,
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(102, 126, 234, 0.4) 0%, 
              rgba(118, 75, 162, 0.3) 25%, 
              rgba(255, 107, 107, 0.2) 50%,
              rgba(0, 0, 0, 0.9) 100%)`
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Floating Particles */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `linear-gradient(45deg, 
              rgba(255, 255, 255, 0.3), 
              rgba(255, 107, 107, 0.2))`,
            left: `${(i * 4.7) % 100}%`,
            top: `${(i * 3.1) % 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 25, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Animated Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(224, 86, 253, 0.1), rgba(254, 202, 87, 0.1))',
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}