'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import CinematicBackground from '@/components/CinematicBackground'
import Navigation from '@/components/Navigation'

interface DashboardOption {
  id: string
  title: string
  description: string
  icon: string
  path: string
  color: string
}

const dashboardOptions: DashboardOption[] = [
  {
    id: 'create',
    title: 'Create New Message',
    description: 'Start crafting a beautiful memory for someone special',
    icon: '✨',
    path: '/sender/create',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'history',
    title: 'Message History',
    description: 'View and manage your previously created messages',
    icon: '📚',
    path: '/sender/history',
    color: 'from-purple-500 to-indigo-500'
  }
]

export default function SenderDashboard() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ messages: 0 })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showTips, setShowTips] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          fetchUserStats(data.user.id);
        } else {
          router.push('/auth');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth');
      }
    };
    fetchUser();
  }, [router]);

  // Listen for help event from navigation
  useEffect(() => {
    const handleShowHelp = () => setShowTips(true)
    window.addEventListener('showHelp', handleShowHelp)
    return () => window.removeEventListener('showHelp', handleShowHelp)
  }, [])

  const fetchUserStats = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        const messages = data.messages || []
        
        console.log('Fetched messages:', messages.length)
        
        setStats({
          messages: messages.length
        })
        
        // Get recent messages (last 5)
          const recent = messages
            .slice()
            .sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt || 0).getTime()
              const dateB = new Date(b.createdAt || 0).getTime()
              return dateB - dateA
            })
            .slice(0, 5)
        setRecentMessages(recent)
      } else {
        console.error('Failed to fetch messages:', response.status)
        setStats({ messages: 0 })
        setRecentMessages([])
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats({ messages: 0 })
      setRecentMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Force redirect to landing page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if there's an error
      window.location.href = '/'
    }
  }

  const handleSwitchRole = () => {
    // Directly go to receiver page
    router.push('/receiver')
  }

  const formatDate = (dateInput: any) => {
    if (!dateInput) return ''
    const date = new Date(dateInput)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'VIEWED':
        return 'bg-green-500/20 text-green-200 border-green-500/30'
      case 'GENERATED':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/30'
      case 'CREATED':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30'
      default:
        return 'bg-white/10 text-white/70 border-white/20'
    }
  }

  const getShareText = (code: string, receiverName?: string) => {
    const url = `${window.location.origin}/receiver/experience/${code}`
    return `Hey ${receiverName || 'there'}! I created something special for you on AsAlways. Use code: ${code} to unlock your memory experience. Visit: ${url}`
  }

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    alert('Code copied!')
  }

  const handleOpenPreview = (code: string) => {
    router.push(`/receiver/experience/${code}`)
  }

  const handleShare = async (code: string, receiverName?: string) => {
    const url = `${window.location.origin}/receiver/experience/${code}`
    const text = getShareText(code, receiverName)
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AsAlways Memory',
          text,
          url
        })
      } else {
        await navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
      }
    } catch {
      // user cancelled or share failed
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <CinematicBackground />
        <div className="relative z-10 text-white text-xl">Loading...</div>
      </div>
    )
  }

  const handleOptionSelect = (option: DashboardOption) => {
    router.push(option.path)
  }

  return (
    <div className="relative overflow-hidden">
      <CinematicBackground />
      <Navigation />
      
      <div className="relative z-10 px-4 pt-16 pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="glass-panel p-6 md:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinematic text-white mb-2 break-words">
                  Welcome, {user?.name || 'Sender'}
                </h1>
                <p className="text-white/70 font-soft text-base sm:text-lg">
                  Create unforgettable memories for your loved ones
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showTips && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowTips(false)}
            />
            <motion.div
              className="relative glass-panel p-6 w-full max-w-lg"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-cinematic text-white mb-1">Help / Tips</h2>
                  <p className="text-white/70 text-sm">Quick guide to create and share a memory.</p>
                </div>
                <button
                  className="text-white/60 hover:text-white text-sm transition-colors"
                  onClick={() => setShowTips(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-3 text-left">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-white font-medium mb-1">1) Create</div>
                  <div className="text-white/70 text-sm">Fill details, add up to 5 photos, pick music.</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-white font-medium mb-1">2) Preview</div>
                  <div className="text-white/70 text-sm">Check the flow and accept to generate the code.</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-white font-medium mb-1">3) Share</div>
                  <div className="text-white/70 text-sm">Use WhatsApp or Share; keep the code handy.</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  onClick={() => setShowTips(false)}
                  className="btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowTips(false)
                    router.push('/sender/create')
                  }}
                  className="btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Create New Message
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Options */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {dashboardOptions.map((option, index) => (
              <motion.div
                key={option.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="glass-panel p-8 h-full relative overflow-hidden group-hover:bg-white/15 transition-all duration-500">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div 
                      className="text-4xl mb-4"
                      animate={hoveredCard === option.id ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {option.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-cinematic text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-200 transition-all duration-300">
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 font-soft leading-relaxed mb-6">
                      {option.description}
                    </p>

                    {/* Arrow */}
                    <motion.div
                      className="flex items-center text-white/50 group-hover:text-white transition-colors duration-300"
                      animate={hoveredCard === option.id ? { x: [0, 10, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="mr-2">Let's go</span>
                      <span>→</span>
                    </motion.div>
                  </div>

                  {/* Floating Sparkles */}
                  {hoveredCard === option.id && (
                    <>
                      <motion.div
                        className="absolute top-4 right-4 text-white/30"
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        ✨
                      </motion.div>
                      <motion.div
                        className="absolute bottom-6 left-6 text-pink-300/40"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        💫
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="glass-panel p-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-cinematic text-white">Recent Messages</h2>
              <button
                className="text-white/70 hover:text-white text-sm transition-colors"
                onClick={() => router.push('/sender/history')}
              >
                View all →
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-white/70">No messages yet. Create your first one to see it here.</div>
            ) : (
              <div className="space-y-3">
                {recentMessages.slice(0, 5).map((msg: any) => (
                  <div
                    key={String(msg.code || msg.id)}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="text-white font-medium">
                        For: {msg.receiverName || 'Receiver'}
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        {msg.code ? `Code: ${msg.code}` : ''}
                        {msg.createdAt ? ` • ${formatDate(msg.createdAt)}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusBadgeClass(msg.status)}`}>
                        {msg.status || 'UNKNOWN'}
                      </span>
                      <motion.button
                        onClick={() => handleCopyCode(msg.code)}
                        className="btn-secondary px-4 py-2 text-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Copy Code
                      </motion.button>
                      <motion.button
                        onClick={() => handleOpenPreview(msg.code)}
                        className="btn-secondary px-4 py-2 text-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Open Preview
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare(msg.code, msg.receiverName)}
                        className="btn-primary px-4 py-2 text-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Share
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Show 'Create Your First Message' only if no messages exist */}
          {stats.messages === 0 && (
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-2xl font-cinematic text-white mb-6">Get Started</h2>
              <div className="glass-panel p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-cinematic text-white mb-2">Ready to create magic?</h3>
                  <p className="text-white/70 mb-6">Start by creating your first memory message</p>
                  <motion.button
                    onClick={() => router.push('/sender/create')}
                    className="btn-primary px-8 py-3 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Your First Message
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}