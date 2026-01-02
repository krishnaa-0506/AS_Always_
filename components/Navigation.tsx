'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

export default function Navigation({ showGetStarted = false }: { showGetStarted?: boolean }) {
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()
  const isSenderDashboard = pathname === '/sender'

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }

  const handleSwitchRole = () => {
    window.location.href = '/receiver'
  }

  const handleHelp = () => {
    // This will be handled by the parent component
    const event = new CustomEvent('showHelp')
    window.dispatchEvent(event)
  }

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
        <div className="flex items-center space-x-4">
          {isSenderDashboard && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                <EllipsisVerticalIcon className="w-6 h-6 text-white" />
              </button>

              {showMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleHelp()
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm"
                    >
                      Help / Tips
                    </button>
                    <button
                      onClick={() => {
                        handleSwitchRole()
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm"
                    >
                      Switch to Receiver
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {showGetStarted && (
            <motion.button
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/role-selection'}
            >
              Get Started
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  )
}