'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TemplateRedirectPage() {
  useEffect(() => {
    // Automatically redirect to sender page since templates are selected automatically
    const timer = setTimeout(() => {
      window.location.href = '/sender/create'
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <motion.div
        className="text-center max-w-xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-5xl mb-4"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🤖✨
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          AI Template Selection
        </h1>
        
        <p className="text-lg text-white/80 mb-6">
          No need to choose! Our smart system automatically selects the perfect template for your memory.
        </p>
        
        <div className="glass-panel p-4 mb-4">
          <div className="flex items-center justify-center space-x-3 text-white/70">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
        
        <p className="text-white/60 text-sm">
          Taking you to memory creation...
        </p>
      </motion.div>
    </div>
  )
}