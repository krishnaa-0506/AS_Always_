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
                opacity: [0, 0.7, 0],
                y: [0, -30, 0],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{
                duration: 7 + (i % 4),
                repeat: Infinity,
                delay: i * 0.25
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

        {/* Mouse tracking gradient overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168,85,247,0.15), transparent 50%)`
          }}
        />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 1 }}
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
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-cinematic text-white mb-6 leading-tight"
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
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-4 font-soft leading-relaxed px-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Create lasting digital memories for those you love
            </motion.p>

            <motion.p 
              className="text-base sm:text-lg text-white/60 mb-8 sm:mb-12 font-soft px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Every moment, every memory, preserved forever
            </motion.p>

            <motion.button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 rounded-full font-medium hover:shadow-xl transition-all mb-8 sm:mb-16 relative group mx-auto block"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">💌 Create Your Memory</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>

            <motion.div
              className="mx-auto max-w-3xl mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-white/80 font-soft text-sm sm:text-base">
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    For love
                  </motion.span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                  >
                    For family
                  </motion.span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                  >
                    For every bond
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 group relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div 
                  className="text-4xl mb-4 relative z-10"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  📸
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white relative z-10">Capture Memories</h3>
                <p className="text-white/60 text-sm relative z-10">Photos, videos, voice notes, and heartfelt messages</p>
                <motion.div
                  className="absolute top-2 right-2 w-1 h-1 bg-pink-400 rounded-full"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.div>

              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 group relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div 
                  className="text-4xl mb-4 relative z-10"
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  🎨
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white relative z-10">AI Magic</h3>
                <p className="text-white/60 text-sm relative z-10">6 Lakh Parameter AI Engine creates beautiful emotional experiences</p>
                <motion.div
                  className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                />
              </motion.div>

              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 group relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div 
                  className="text-4xl mb-4 relative z-10"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: 2
                  }}
                >
                  💝
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white relative z-10">Share Securely</h3>
                <p className="text-white/60 text-sm relative z-10">Private codes for intimate memory sharing</p>
                <motion.div
                  className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              Stories of Bonds
            </motion.h1>
            <motion.p 
              className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Choose the relationship, keep the emotion, and let the memory unfold like a short film.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Partner',
                subtitle: 'Love, longing, forever',
                icon: '❤️',
                gradient: 'from-pink-500/20 to-violet-500/20'
              },
              {
                title: 'Parents',
                subtitle: 'Gratitude, comfort, pride',
                icon: '🏡',
                gradient: 'from-emerald-500/20 to-cyan-500/20'
              },
              {
                title: 'Best Friend',
                subtitle: 'Laughs, loyalty, memories',
                icon: '🤝',
                gradient: 'from-blue-500/20 to-indigo-500/20'
              },
              {
                title: 'Siblings',
                subtitle: 'Mischief, support, always',
                icon: '🧡',
                gradient: 'from-amber-500/20 to-orange-500/20'
              }
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                  initial={{ opacity: 0.35 }}
                  whileHover={{ opacity: 0.6 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, delay: idx * 0.4 }}
                  >
                    {card.icon}
                  </motion.div>
                  <div className="text-xl font-semibold text-white mb-2">{card.title}</div>
                  <div className="text-white/70 text-sm leading-relaxed">{card.subtitle}</div>
                  <div className="mt-5 text-white/60 text-sm">Music + photos + words → cinematic memory</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Three simple steps to create unforgettable digital memories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create & Upload",
                description: "Upload photos, videos, write messages, and record voice notes",
                icon: "📱"
              },
              {
                step: "02", 
                title: "AI Generation",
                description: "Our AI creates beautiful emotional screens with your memories",
                icon: "🤖"
              },
              {
                step: "03",
                title: "Share & Experience",
                description: "Send a secure code to your loved one for a cinematic memory journey",
                icon: "💝"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 h-full">
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <div className="text-sm text-pink-500 font-bold mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-purple-950/30 via-black to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              50 Professional <span className="text-gradient">Templates</span>
            </h2>
            <p className="text-white/60 text-lg max-w-3xl mx-auto">
              Choose from our collection of 50 beautifully designed templates. Each template features 20 unique screens with 
              color palettes, and interactive elements tailored for different relationships and occasions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                name: "Romantic Classic", 
                category: "Romantic Partner", 
                screens: "20 screens",
                gradient: "from-pink-500 to-red-500",
                icon: "💕"
              },
              { 
                name: "Friendship Forever", 
                category: "Best Friend", 
                screens: "20 screens",
                gradient: "from-blue-500 to-purple-500",
                icon: "👫"
              },
              { 
                name: "Family Bonds", 
                category: "Family Member", 
                screens: "20 screens",
                gradient: "from-green-500 to-teal-500",
                icon: "👨‍👩‍👧‍👦"
              },
              { 
                name: "Professional Thanks", 
                category: "Colleague", 
                screens: "20 screens",
                gradient: "from-indigo-500 to-blue-500",
                icon: "🤝"
              }
            ].map((template, index) => (
              <motion.div
                key={template.name}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:border-white/20 transition-all">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${template.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {template.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{template.name}</h3>
                  <p className="text-white/60 text-sm mb-1">{template.category}</p>
                  <p className="text-pink-400 text-xs">{template.screens}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/role-selection">
                <motion.button
                  className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Bonds & Love →
                </motion.button>
              </Link>
              <p className="text-white/40 text-sm mt-3">Sign in to browse our complete collection of 50 templates, each with 20 beautiful screens</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Features
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Everything you need to create beautiful, emotional memories
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎵", title: "Background Music", desc: "Beautiful soundtracks for your memories", color: "from-pink-500 to-rose-500" },
              { icon: "🎭", title: "Multiple Themes", desc: "Choose from romantic, celebration, and more", color: "from-purple-500 to-indigo-500" },
              { icon: "📱", title: "Mobile Friendly", desc: "Works perfectly on all devices", color: "from-blue-500 to-cyan-500" },
              { icon: "🔒", title: "100% Private", desc: "Your memories are secure and encrypted", color: "from-green-500 to-emerald-500" },
              { icon: "⚡", title: "Instant Sharing", desc: "Share with just a simple code", color: "from-yellow-500 to-orange-500" },
              { icon: "🎨", title: "AI Powered", desc: "Smart content generation and layout", color: "from-indigo-500 to-purple-500" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 group relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  initial={false}
                />
                <motion.div 
                  className="text-4xl mb-4 relative z-10"
                  animate={{ 
                    scale: hoveredCard === index ? [1, 1.2, 1] : [1, 1.05, 1],
                    rotate: hoveredCard === index ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.6,
                    repeat: hoveredCard === index ? 1 : 0
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white relative z-10">{feature.title}</h3>
                <p className="text-white/60 text-sm relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Optimization Showcase */}
      <section className="py-20 bg-gradient-to-br from-purple-950/20 via-black to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Perfect for Every Device
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Optimized for mobile, tablet, and desktop experiences
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {[
                  {
                    icon: DevicePhoneMobileIcon,
                    title: "Mobile First Design",
                    description: "Touch-friendly interface optimized for smartphones",
                    features: ["Responsive layouts", "Touch gestures", "Fast loading"]
                  },
                  {
                    icon: ComputerDesktopIcon,
                    title: "Desktop Experience",
                    description: "Full-featured experience on larger screens",
                    features: ["Keyboard shortcuts", "Multi-window support", "HD quality"]
                  },
                  {
                    icon: RocketLaunchIcon,
                    title: "Lightning Fast",
                    description: "Optimized performance for all devices",
                    features: ["Instant loading", "Smooth animations", "Offline support"]
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-3 rounded-lg">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-white/70 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-4 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl mb-2">📱</div>
                      <div className="text-white font-semibold">Mobile</div>
                      <div className="text-white/60 text-sm">70% Users</div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl mb-2">💻</div>
                      <div className="text-white font-semibold">Desktop</div>
                      <div className="text-white/60 text-sm">30% Users</div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl mb-2">⚡</div>
                      <div className="text-white font-semibold">Fast</div>
                      <div className="text-white/60 text-sm">&lt;1s Load</div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl mb-2">🎨</div>
                      <div className="text-white font-semibold">Beautiful</div>
                      <div className="text-white/60 text-sm">Modern UI</div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-pink-500 rounded-full opacity-60"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full opacity-60"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Trusted by Thousands
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <motion.div
                    className="text-4xl mb-4 flex justify-center"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <stat.icon className="w-10 h-10 text-pink-500" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engine Section */}
      <section className="py-20 bg-gradient-to-br from-purple-950/20 via-black to-black">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🤖
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by <span className="text-gradient">6 Lakh Parameter AI Engine</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Our advanced AI engine with 6 lakh parameters creates personalized, emotionally resonant content 
              tailored to your relationship and memories. Every message is unique, crafted with deep understanding 
              of human emotions and connections.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { icon: "🧠", title: "6 Lakh Parameters", desc: "Massive AI model for deep understanding" },
              { icon: "💝", title: "Emotional Intelligence", desc: "Understands relationships and feelings" },
              { icon: "✨", title: "Personalized Content", desc: "20 unique screens per message" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10"
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white/60 text-sm">
            <p className="mb-2">Made with ❤️ by Hynex | Developed by HK</p>
            <div className="flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}