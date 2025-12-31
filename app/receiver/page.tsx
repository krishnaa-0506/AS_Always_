'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import CinematicBackground from '@/components/CinematicBackground'
import Navigation from '@/components/Navigation'

export default function ReceiverPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Handle error messages from URL
    const searchParams = new URLSearchParams(window.location.search)
    const errorType = searchParams.get('error')
    
    if (errorType === 'invalid-code') {
      setError('Invalid code. Please check and try again.')
    } else if (errorType === 'server-error') {
      setError('An error occurred. Please try again.')
    }

    // Clear the error from URL without refreshing the page
    if (errorType) {
      window.history.replaceState({}, '', '/receiver')
    }
  }, [])

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const normalizedCode = code.trim().toUpperCase()
    
    if (normalizedCode.length !== 6) {
      setError('Please enter a valid 6-character code')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/messages/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: normalizedCode })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred. Please try again.')
        setIsValidating(false)
        return
      }

      if (!data.valid) {
        setError(data.error || 'Invalid code. Please check and try again.')
        setIsValidating(false)
        return
      }

      // If code is valid, redirect to experience page
      router.push(`/receiver/experience/${code}`)
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setCode(upperValue)
    if (error) setError('')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicBackground />
      <Navigation />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div 
          className="glass-panel p-8 max-w-lg w-full mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💝
            </motion.div>
            <h1 className="text-3xl font-cinematic text-white mb-3">
              You Have a Special Message
            </h1>
            <p className="text-white/70 font-soft">
              Someone created a beautiful memory experience just for you
            </p>
          </motion.div>

          {/* Code Input Form */}
          <motion.form 
            onSubmit={handleCodeSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <label className="block text-white font-medium mb-3">
                Enter Your Memory Code
              </label>
              
              {/* Code Input */}
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white text-center text-2xl font-mono tracking-widest placeholder-white/30 focus:bg-white/20 focus:border-pink-500 transition-all"
                  placeholder="ABC123"
                  maxLength={6}
                />
                
                {/* Character indicators */}
                <div className="flex justify-center gap-2 mt-3">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i < code.length 
                          ? 'bg-pink-500' 
                          : 'bg-white/20'
                      }`}
                      animate={i === code.length ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p 
                    className="text-red-400 text-sm mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={code.length !== 6 || isValidating}
              className="w-full btn-primary text-lg py-4 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isValidating ? { scale: 1.02 } : {}}
              whileTap={!isValidating ? { scale: 0.98 } : {}}
            >
              <AnimatePresence mode="wait">
                {isValidating ? (
                  <motion.div
                    key="validating"
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Unlocking Memory...
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlock"
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    🔓 Unlock Your Memory
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          {/* Help Section */}
          <motion.div 
            className="mt-8 pt-6 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-white/60 text-sm mb-4">
              Don't have a code? Ask the person who sent you here!
            </p>
            
            <div className="space-y-2">
              <motion.button
                onClick={() => router.push('/role-selection')}
                className="btn-secondary text-sm px-6 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your Own Memory
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Hearts */}
          <div className="absolute -top-10 -left-10 pointer-events-none">
            <motion.div
              className="text-pink-300/30 text-3xl"
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              💕
            </motion.div>
          </div>

          <div className="absolute -bottom-10 -right-10 pointer-events-none">
            <motion.div
              className="text-purple-300/30 text-2xl"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, -20, 20, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}