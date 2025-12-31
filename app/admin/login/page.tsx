'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import CinematicBackground from '@/components/CinematicBackground'

const ADMIN_SECRET_CODE = '306206'

export default function AdminLogin() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (attempts >= 3) {
      setError('Too many failed attempts. Access denied.')
      return
    }

    setIsValidating(true)
    setError('')

    // Simulate validation delay
    setTimeout(() => {
      if (code === ADMIN_SECRET_CODE) {
        // Store admin session in both sessionStorage and cookie
        sessionStorage.setItem('asalways-admin', 'authenticated')
        
        // Set cookie for middleware and API authentication
        document.cookie = 'asalways-admin=authenticated; path=/; max-age=86400; samesite=lax'
        
        router.push('/admin/dashboard')
      } else {
        setAttempts(prev => prev + 1)
        setError(`Invalid admin code. ${3 - attempts - 1} attempts remaining.`)
        setCode('')
      }
      setIsValidating(false)
    }, 1500)
  }

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setCode(numericValue)
    if (error) setError('')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24">
        <motion.div 
          className="glass-panel p-8 max-w-lg w-full mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <img 
                src="/logo.png" 
                alt="AsAlways Logo"
                className="h-12 w-12 mx-auto mb-4"
              />
              <motion.div 
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [0.8, 1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              >
                ⚙️
              </motion.div>
            </div>
            <h1 className="text-3xl font-cinematic text-white mb-3">
              Admin Access
            </h1>
            <p className="text-white/70 font-soft">
              Enter the secret admin code to continue
            </p>
          </motion.div>

          {/* Warning Banner */}
          <motion.div 
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-red-400 text-xl">🛡️</div>
              <div>
                <div className="text-red-300 font-semibold text-sm">Restricted Area</div>
                <div className="text-red-200/80 text-xs">Authorized personnel only</div>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <label className="block text-white font-medium mb-3">
                Admin Secret Code
              </label>
              
              {/* Code Input */}
              <div className="relative">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white text-center text-2xl font-mono tracking-widest placeholder-white/30 focus:bg-white/20 focus:border-orange-500 transition-all"
                  placeholder="• • • • • •"
                  maxLength={6}
                  disabled={attempts >= 3}
                />
                
                {/* Character indicators */}
                <div className="flex justify-center gap-2 mt-3">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i < code.length 
                          ? 'bg-orange-500' 
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
                  <motion.div 
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-red-300 text-sm flex items-center gap-2">
                      ⚠️ {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Attempt Counter */}
              {attempts > 0 && attempts < 3 && (
                <motion.div 
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < attempts ? 'bg-red-500' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    Failed attempts: {attempts}/3
                  </p>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={code.length !== 6 || isValidating || attempts >= 3}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg"
              whileHover={!isValidating && attempts < 3 ? { scale: 1.02 } : {}}
              whileTap={!isValidating && attempts < 3 ? { scale: 0.98 } : {}}
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
                    Validating Access...
                  </motion.div>
                ) : attempts >= 3 ? (
                  <motion.div
                    key="blocked"
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    🚫 Access Blocked
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    🔑 Access Admin Panel
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          {/* Security Info */}
          <motion.div 
            className="mt-8 pt-6 border-t border-white/20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-white/50 text-xs mb-4">
              🔒 All admin access attempts are logged and monitored
            </p>
            
            <motion.button
              onClick={() => router.push('/role-selection')}
              className="text-white/60 hover:text-white text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              ← Back to Role Selection
            </motion.button>
          </motion.div>

          {/* Background Security Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
            }} />
          </div>
        </motion.div>
      </div>

      {/* Floating Security Icons */}
      <div className="absolute top-20 left-10 pointer-events-none">
        <motion.div
          className="text-orange-300/30 text-2xl"
          animate={{ 
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🛡️
        </motion.div>
      </div>

      <div className="absolute bottom-20 right-10 pointer-events-none">
        <motion.div
          className="text-red-300/30 text-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          🔐
        </motion.div>
      </div>
    </div>
  )
}