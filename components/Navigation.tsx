'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Navigation({ showGetStarted = false }: { showGetStarted?: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-cinematic text-white"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="AsAlways Logo"
              className="h-8 w-8 object-contain"
            />
            <Link href="/">AsAlways</Link>
          </div>
        </motion.h1>

        {/* Right side */}
        {showGetStarted ? (
          <div className="flex items-center space-x-4">
            <motion.button
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/role-selection'}
            >
              Get Started
            </motion.button>
          </div>
        ) : null}
      </div>
    </nav>
  )
}