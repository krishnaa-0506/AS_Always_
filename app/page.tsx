'use client'

import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CinematicBackground from '@/components/CinematicBackground'
import Navigation from '@/components/Navigation'
import { 
  HeartIcon, 
  PhotoIcon, 
  SpeakerWaveIcon, 
  SparklesIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  StarIcon,
  SparklesIcon as MagicIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowContent(true), 500)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    checkMobile()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    router.push('/role-selection')
  }

  const handleExploreTemplates = () => {
    router.push('/auth')
  }

  const features = [
    {
      icon: PhotoIcon,
      title: "Memory Integration",
      description: "Transform your photos, videos, and voice notes into beautiful experiences",
      color: "from-pink-500 to-rose-500",
      animation: "float"
    },
    {
      icon: SparklesIcon,
      title: "AI-Powered Content",
      description: "Unique quotes and messages tailored to your relationship and tone",
      color: "from-purple-500 to-indigo-500",
      animation: "pulse"
    },
    {
      icon: SpeakerWaveIcon,
      title: "Immersive Audio",
      description: "Background music and voice messages create emotional connections",
      color: "from-blue-500 to-cyan-500",
      animation: "spin"
    }
  ]

  const stats = [
    { number: "10K+", label: "Love Stories Shared", icon: HeartIcon },
    { number: "50", label: "Beautiful Templates", icon: SparklesIcon },
    { number: "20", label: "Screens Per Message", icon: PhotoIcon },
    { number: "24/7", label: "Available Always", icon: StarIcon }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-cinematic text-gradient mb-8"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            AsAlways
          </motion.h1>
          <motion.div 
            className="loading-spinner mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-white/70 mt-6 text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Creating magical memories...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation showGetStarted />
      
      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden">
        <CinematicBackground />

        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 19) % 100}%`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 4 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <div
                className={
                  i % 3 === 0
                    ? 'text-pink-400/40'
                    : i % 3 === 1
                      ? 'text-violet-400/40'
                      : 'text-cyan-400/35'
                }
                style={{ fontSize: i % 4 === 0 ? 20 : i % 4 === 1 ? 14 : 18 }}
              >
                {i % 2 === 0 ? '✦' : '♥'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          {/* Floating hearts */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              className="absolute text-pink-400/30 text-2xl"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
                rotate: [0, 10, -10, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              💖
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
          <motion.div 
            className="text-center max-w-5xl mx-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <motion.img
                src="/logo.png"
                alt="AsAlways Logo"
                className="h-14 w-14 object-contain"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-cinematic text-white mb-4 sm:mb-6 leading-tight"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(168,85,247,0.5)",
                    "0 0 40px rgba(236,72,153,0.5)",
                    "0 0 20px rgba(168,85,247,0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                AsAlways
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-3 sm:mb-4 font-soft leading-relaxed px-2 sm:px-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Create lasting digital memories for those you love
            </motion.p>

            <motion.p 
              className="text-sm sm:text-base md:text-lg text-white/60 mb-6 sm:mb-8 font-soft px-2 sm:px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Every moment, every memory, preserved forever
            </motion.p>

            <motion.button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full font-medium hover:shadow-xl transition-all mb-6 sm:mb-8 md:mb-16 relative group mx-auto block overflow-hidden"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="relative z-10 flex items-center gap-2"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.3)",
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 10px rgba(255,255,255,0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💌 Create Your Memory
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(236,72,153,0.4)",
                    "0 0 0 20px rgba(236,72,153,0)",
                    "0 0 0 0 rgba(236,72,153,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            <motion.div
              className="mx-auto max-w-2xl sm:max-w-3xl mb-6 sm:mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-white/80 font-soft text-sm sm:text-base relative z-10">
                  <motion.span
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    💕 For love
                  </motion.span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <motion.span
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                    className="flex items-center gap-1"
                  >
                    👨‍👩‍👧‍👦 For family
                  </motion.span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <motion.span
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    🤝 For every bond
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/10 group relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div 
                  className="text-3xl sm:text-4xl mb-3 sm:mb-4 relative z-10"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  📸
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-white relative z-10">Capture Memories</h3>
                <p className="text-sm sm:text-base text-white/70 relative z-10">Transform photos into lasting experiences</p>
              </motion.div>

              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/10 group relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div 
                  className="text-3xl sm:text-4xl mb-3 sm:mb-4 relative z-10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                    filter: [
                      "hue-rotate(0deg)",
                      "hue-rotate(90deg)",
                      "hue-rotate(0deg)"
                    ]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity
                  }}
                >
                  ✨
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-white relative z-10">AI-Powered Content</h3>
                <p className="text-sm sm:text-base text-white/70 relative z-10">Unique messages tailored to your relationship</p>
              </motion.div>

              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/10 group relative overflow-hidden sm:col-span-2 md:col-span-1"
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div 
                  className="text-3xl sm:text-4xl mb-3 sm:mb-4 relative z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    x: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity
                  }}
                >
                  🎵
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-white relative z-10">Personal Soundtrack</h3>
                <p className="text-sm sm:text-base text-white/70 relative z-10">Add music that makes every moment special</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )

}