'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import PreviewFloatingIcons from '@/components/PreviewFloatingIcons'
import Navigation from '@/components/Navigation'

interface MemoryScreen {
  id: number
  type: 'intro' | 'photo' | 'video' | 'audio' | 'text' | 'voice' | 'memory' | 'final'
  content: string
  background: string
  animation: string
  duration: number
  emotion: string
  mediaContent?: {
    type: string
    url: string
    filename?: string
    caption?: string
  }
}

export default function MemoryExperience({ params }: { params: { code: string } }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messageData, setMessageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
  const [memoryScreens, setMemoryScreens] = useState<MemoryScreen[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [revealedLines, setRevealedLines] = useState<string[]>([])
  const [isRevealing, setIsRevealing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasReacted, setHasReacted] = useState(false)
  const [isReacting, setIsReacting] = useState(false)

  // Get gradient based on screen index (same as CompactMemoryPreview)
  const getCurrentGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600',
      'bg-gradient-to-tr from-fuchsia-500 via-rose-400 to-pink-300',
      'bg-gradient-to-bl from-purple-500 via-violet-500 to-blue-500',
      'bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-500',
      'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-700',
      'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500',
      'bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-600',
      'bg-gradient-to-bl from-emerald-400 via-teal-500 to-cyan-600',
      'bg-gradient-to-tl from-blue-400 via-indigo-500 to-purple-600',
      'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600',
      'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
      'bg-gradient-to-tr from-teal-400 via-cyan-500 to-blue-600',
      'bg-gradient-to-bl from-lime-400 via-green-500 to-emerald-600',
      'bg-gradient-to-tl from-yellow-400 via-lime-500 to-green-600',
      'bg-gradient-to-r from-orange-400 via-yellow-500 to-lime-600',
      'bg-gradient-to-br from-slate-400 via-gray-500 to-zinc-600',
      'bg-gradient-to-tr from-blue-400 via-slate-500 to-gray-600',
      'bg-gradient-to-bl from-indigo-400 via-blue-500 to-slate-600',
      'bg-gradient-to-tl from-purple-400 via-indigo-500 to-blue-600',
      'bg-gradient-to-r from-gray-400 via-slate-500 to-zinc-600'
    ]
    return gradients[currentScreen % gradients.length]
  }

  // Split content into lines
  const getCurrentLines = () => {
    if (!memoryScreens || memoryScreens.length === 0) {
      return ['Content not available']
    }
    const currentContent = memoryScreens[currentScreen]?.content || ''
    const contentString = typeof currentContent === 'string' ? currentContent : String(currentContent)
    return contentString.split('\n').filter(line => line.trim().length > 0)
  }

  // Dynamic box sizing based on line count
  const getBoxHeight = () => {
    const lineCount = getCurrentLines().length
    if (lineCount <= 5) return 'min-h-[400px]'
    if (lineCount <= 7) return 'min-h-[500px]'
    return 'min-h-[600px]'
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    // Fetch real message data from API - allow multiple times
    const fetchMessageData = async () => {
      try {
        const response = await fetch(`/api/messages/${params.code}`)
        const result = await response.json()
        
        if (result.success && result.message) {
          setMessageData(result.message)
          
          // Track view - mark message as viewed when receiver opens it
          if (!result.message.isViewed) {
            try {
              console.log('📊 Message viewed - status updated in DB')
            } catch (viewError) {
              console.error('Error tracking view:', viewError)
            }
          }
          
          // Initialize background music if available
          if (result.message.selectedSong) {
            // Check if it's a URL or just a name
            let songUrl = result.message.selectedSong
            
            // Decode HTML entities if present
            if (songUrl.includes('&amp;') || songUrl.includes('&#x2F;')) {
              const textarea = document.createElement('textarea')
              textarea.innerHTML = songUrl
              songUrl = textarea.value
            }
            
            if (!songUrl.startsWith('http')) {
              if (songUrl.startsWith('/')) {
              } else if (songUrl.includes('.mp3')) {
                songUrl = `/songs/${songUrl}`
              } else {
                songUrl = `/songs/${songUrl}.mp3`
              }
            }
            
            console.log('Final song URL:', songUrl) // Debug log
              
            const audio = new Audio(songUrl)
            audio.loop = true
            audio.volume = 1.0
            // Handle errors gracefully - don't fail if music doesn't load
            audio.addEventListener('error', (e) => {
              console.warn('Failed to load background music:', songUrl, e)
            })
            audio.addEventListener('canplay', () => {
              console.log('Background music ready to play')
            })
            setBackgroundMusic(audio)
            
            // Auto-play music when experience starts
            setTimeout(() => {
              audio.play().catch(error => {
                console.warn('Auto-play failed, user interaction may be required:', error)
              })
            }, 1000)
          }
          
          // Use real screens from database if available
          if (result.message.screens && result.message.screens.length > 0) {
            const realScreens = result.message.screens.map((screen: any, index: number) => {
              const validTypes: Array<'intro' | 'photo' | 'video' | 'audio' | 'text' | 'voice' | 'memory' | 'final'> = ['intro', 'photo', 'video', 'audio', 'text', 'voice', 'memory', 'final']
              const screenType = screen.type && validTypes.includes(screen.type) ? screen.type :
                (index === 0 ? 'intro' : index === result.message.screens.length - 1 ? 'final' : 'memory')

              // Use image information from screen if available (saved during generation)
              let mediaContent = screen.mediaContent
              if (screen.hasImage && screen.imageUrl) {
                // Get caption from memories if available
                const memories = result.message.memories || []
                const imageMemory = memories.find((m: any) => m.content === screen.imageUrl)
                mediaContent = {
                  type: 'image',
                  url: screen.imageUrl,
                  filename: imageMemory?.filename,
                  caption: imageMemory?.caption || screen.content
                }
              }

              return {
                id: index + 1,
                type: screenType as 'intro' | 'photo' | 'video' | 'audio' | 'text' | 'voice' | 'memory' | 'final',
                content: screen.content,
                background: screen.background,
                animation: screen.animation,
                duration: screen.duration || 5000, // Reduced from 6000 to 5000 for better readability
                emotion: screen.emotion,
                mediaContent: mediaContent
              }
            })
            
            // Handle video memories separately (videos are not distributed like images)
            const videoMemories = (result.message.memories || []).filter((m: any) => m.type === 'VIDEO')
            if (videoMemories.length > 0) {
              const insertedScreens: MemoryScreen[] = []
              const insertInterval = Math.max(3, Math.floor(realScreens.length / (videoMemories.length + 1)))
              
              let videoIdx = 0
              for (let i = 0; i < realScreens.length; i++) {
                insertedScreens.push(realScreens[i])
                
                // Insert video screens every few screens
                if ((i + 1) % insertInterval === 0 && videoIdx < videoMemories.length) {
                  const video = videoMemories[videoIdx]
                  insertedScreens.push({
                    id: 2000 + videoIdx,
                    type: 'video' as const,
                    content: video.caption || `A special memory shared by ${result.message.senderName}`,
                    background: 'from-pink-500 to-purple-600',
                    animation: 'fadeIn',
                    duration: 8000,
                    emotion: 'love',
                    mediaContent: {
                      type: 'video',
                      url: video.content,
                      filename: video.filename,
                      caption: video.caption
                    }
                  })
                  videoIdx++
                }
              }
              
              setMemoryScreens(insertedScreens)
            } else {
              setMemoryScreens(realScreens)
            }
          } else {
            // Enhanced fallback screens
            const createFallbackScreens = (senderName: string, receiverName: string): MemoryScreen[] => {
              return [
                {
                  id: 1,
                  type: 'intro' as const,
                  content: `My Dear ${receiverName}...`,
                  background: 'from-pink-500 to-purple-600',
                  animation: 'fadeIn',
                  duration: 5000,
                  emotion: 'anticipation'
                },
                {
                  id: 2,
                  type: 'memory' as const,
                  content: `${messageData?.textContent || "I wanted to create something special to show you how much you mean to me. Every moment with you is a treasure I hold dear."}`,
                  background: 'from-rose-400 to-pink-500',
                  animation: 'heartbeat',
                  duration: 8000,
                  emotion: 'love'
                },
                {
                  id: 3,
                  type: 'final' as const,
                  content: `Thank you for being in my life.\n\nWith love,\n${senderName}`,
                  background: 'from-pink-600 to-purple-600',
                  animation: 'sparkle',
                  duration: 10000,
                  emotion: 'eternal love'
                }
              ]
            }
            setMemoryScreens(createFallbackScreens(result.message.senderName, result.message.receiverName))
          }
        } else {
          router.push('/receiver?error=invalid-code')
          return
        }
      } catch (error) {
        console.error('Failed to fetch message:', error)
        // Don't redirect on error - allow retry
        setMessageData(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMessageData()
  }, [params.code, router])

  // Line-by-line reveal animation - reduced timing for better readability
  useEffect(() => {
    // Reset revealed lines when screen changes
    setRevealedLines([])
    setIsRevealing(false)
    
    if (isVisible && memoryScreens.length > 0) {
      setIsRevealing(true)
      const lines = getCurrentLines()
      
      // Clear any existing timeouts
      const timeouts: NodeJS.Timeout[] = []
      
      lines.forEach((line, index) => {
        const timeout = setTimeout(() => {
          setRevealedLines(prev => {
            // Prevent duplicates by checking if line already exists
            if (prev.includes(line)) return prev
            return [...prev, line]
          })
          if (index === lines.length - 1) {
            setIsRevealing(false)
          }
        }, index * 300) // Reduced to 300ms - faster for 2 lines reading
        timeouts.push(timeout)
      })
      
      // Cleanup function to clear timeouts
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout))
      }
    }
  }, [currentScreen, isVisible, memoryScreens])

  // Auto advance screens when playing - reduced timing for better readability
  useEffect(() => {
    if (isPlaying && memoryScreens.length > 0 && currentScreen < memoryScreens.length - 1) {
      // Calculate duration based on content length - optimized for 2 lines
      const currentLines = getCurrentLines()
      const lineCount = currentLines.length
      // Much faster: 2 seconds per line, minimum 3 seconds, maximum 8 seconds
      const finalDuration = Math.min(Math.max(lineCount * 2000, 3000), 8000)
      
      const timer = setTimeout(() => {
        handleNext()
      }, finalDuration)
      return () => clearTimeout(timer)
    } else if (isPlaying && currentScreen === memoryScreens.length - 1) {
      setIsPlaying(false)
      setShowControls(true)
    }
  }, [isPlaying, currentScreen, memoryScreens])

  // Auto-play background music when experience starts or when backgroundMusic changes
  useEffect(() => {
    if (backgroundMusic && isPlaying) {
      // Auto-play when experience is playing
      const timer = setTimeout(() => {
        backgroundMusic.play().catch(error => {
          console.warn('Background music auto-play failed:', error)
        })
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [backgroundMusic, isPlaying])

  // Audio control
  const toggleMusic = () => {
    if (backgroundMusic) {
      if (backgroundMusic.paused) {
        backgroundMusic.play().catch(console.error)
      } else {
        backgroundMusic.pause()
      }
    }
  }

  const startExperience = () => {
    // Attempt fullscreen if supported
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {
        console.log('Fullscreen not supported or denied')
      })
    }
    
    setIsPlaying(true)
    setCurrentScreen(0)
    setShowControls(false)
    
    // Ensure background music plays when user starts experience
    if (backgroundMusic) {
      backgroundMusic.play().catch(console.error)
    }
  }

  const pauseExperience = () => {
    const nextState = !isPlaying
    setIsPlaying(nextState)
    if (backgroundMusic) {
      if (nextState) {
        backgroundMusic.play().catch(console.error)
      } else {
        backgroundMusic.pause()
      }
    }
  }

  const handleNext = () => {
    if (memoryScreens.length > 0 && currentScreen < memoryScreens.length - 1) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentScreen(prev => prev + 1)
        setIsVisible(true)
      }, 300)
    }
  }

  const handlePrev = () => {
    if (currentScreen > 0) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentScreen(prev => prev - 1)
        setIsVisible(true)
      }, 300)
    }
  }

  const restartExperience = () => {
    setCurrentScreen(0)
    setIsPlaying(true)
    setShowControls(false)
    if (backgroundMusic) {
      backgroundMusic.currentTime = 0
      backgroundMusic.play().catch(console.error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div 
            className="text-6xl mb-6"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💝
          </motion.div>
          <h2 className="text-2xl text-white font-cinematic mb-4">Preparing Your Experience</h2>
          <div className="loading-spinner mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  const currentScreenData = memoryScreens[currentScreen]

  if (!isPlaying && currentScreen === 0 && !showControls) {
    return (
      <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
        <div className={`absolute inset-0 ${getCurrentGradient()} opacity-80`} />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="text-8xl mb-6"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💌
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-cinematic text-white mb-6">
              A Special Message for You
            </h1>
            
            <p className="text-lg text-white/80 mb-8">
              {messageData?.senderName} has created a cinematic memory journey just for you.
            </p>
            
            <div className="space-y-4 mb-10 max-w-sm mx-auto">
              <div className="glass-panel p-4 text-left border-l-4 border-pink-500">
                <div className="text-white/70 text-sm mb-1">From:</div>
                <div className="text-white font-semibold text-lg">{messageData?.senderName}</div>
              </div>
              <div className="glass-panel p-4 text-left border-l-4 border-purple-500">
                <div className="text-white/70 text-sm mb-1">Personal Code:</div>
                <div className="text-white font-mono text-lg tracking-widest">{params.code}</div>
              </div>
            </div>

            <motion.button
              onClick={startExperience}
              className="bg-white text-black text-lg font-bold px-10 py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-3">
                BEGIN EXPERIENCE
              </span>
            </motion.button>

            <p className="text-white/50 text-sm mt-6">
              Enable sound for the full emotional experience 🎧
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!currentScreenData) {
    return null
  }

  // Get images for current screen
  const hasImage = currentScreenData.mediaContent?.type === 'image'
  const hasVideo = currentScreenData.mediaContent?.type === 'video'
  const imageUrl = hasImage ? (currentScreenData.mediaContent?.url ?? null) : null

  return (
    <div ref={containerRef} className={`min-h-screen ${getCurrentGradient()} relative overflow-hidden ${isFullscreen ? 'cursor-none' : ''}`}>
      <Navigation />
      {/* Floating Icons */}
      <PreviewFloatingIcons screenIndex={currentScreen} />

      {/* Side Controls - Music and Fullscreen */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        <img 
              src="/logo.png" 
              alt="AsAlways Logo"
              className="h-8 w-auto object-contain mb-4"
            />
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-yellow-400/30 transition-all duration-200"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <span className="text-yellow-400 text-lg">{isFullscreen ? '↙️' : '↗️'}</span>
        </button>
        <button
          onClick={toggleMusic}
          className="p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-yellow-400/30 transition-all duration-200"
          title="Toggle Music"
        >
          <span className="text-yellow-400 text-lg">🎵</span>
        </button>
      </div>

      {/* Main Content Area - Fullscreen Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className={`${getBoxHeight()} flex flex-col justify-center`}
              >
                {/* Golden Border Letter Box */}
                <div className="relative">
                  {/* Golden border with glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-gold-500 to-yellow-600 rounded-lg blur-sm opacity-75"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-lg blur-md opacity-50"></div>

                  {/* Main letter box */}
                  <div className="relative bg-black/95 backdrop-blur-sm rounded-lg border-2 border-yellow-400 shadow-2xl shadow-yellow-400/20">
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-lg border border-yellow-300/30"></div>

                    {/* Content area */}
                    <div className="p-6 lg:p-10 xl:p-12">
                      {/* Screen indicator */}
                      <div className="text-center mb-4">
                        <span className="text-yellow-400 text-xs font-medium">
                          Screen {currentScreen + 1} of {memoryScreens.length}
                        </span>
                      </div>

                      {/* Media Display Section */}
                      {(hasImage || hasVideo) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mb-6"
                        >
                          {/* Image */}
                          {hasImage && imageUrl && (
                            <div className="mb-4">
                              <img
                                src={imageUrl}
                                alt="Memory"
                                className="w-full max-w-xl mx-auto rounded-lg border-2 border-yellow-400/30 object-cover"
                                style={{ maxHeight: '300px' }}
                              />
                            </div>
                          )}

                          {/* Video */}
                          {hasVideo && (
                            <div className="mb-4">
                              <video
                                src={currentScreenData.mediaContent!.url}
                                controls
                                className="w-full max-w-xl mx-auto rounded-lg border-2 border-yellow-400/30"
                                style={{ maxHeight: '300px' }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Animated Text Content - Reduced font size */}
                      <div className="text-center space-y-3">
                        <AnimatePresence>
                          {revealedLines.map((line, index) => (
                            <motion.p
                              key={`${currentScreen}-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="text-white text-base sm:text-lg lg:text-xl font-serif italic leading-snug tracking-wide break-words"
                              style={{
                                fontFamily: 'Playfair Display, serif',
                                textShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              {line}
                            </motion.p>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls - Compact at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-sm border-t border-yellow-400/20 p-4">
        {/* Navigation Controls - Compact */}
        <div className="flex items-center justify-center space-x-3 mb-3">
          <button
            onClick={handlePrev}
            disabled={currentScreen === 0}
            className="p-2 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-yellow-400" />
          </button>

          <button
            onClick={pauseExperience}
            className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={memoryScreens.length > 0 ? currentScreen === memoryScreens.length - 1 : true}
            className="p-2 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-yellow-400" />
          </button>
        </div>

        {/* Progress Indicator - Compact */}
        <div className="flex justify-center space-x-1">
          {Array.from({ length: memoryScreens.length }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentScreen ? 'bg-yellow-400 scale-125' :
                i < currentScreen ? 'bg-yellow-400/60' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Completion Overlay */}
      {showControls && currentScreen === memoryScreens.length - 1 && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center p-8 max-w-xl bg-white/5 border border-white/10 rounded-2xl">
            <motion.div 
              className="text-6xl mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {hasReacted ? '💖' : '🎉'}
            </motion.div>
            <h2 className="text-3xl font-cinematic text-white mb-4">
              Experience Complete
            </h2>
            {hasReacted && (
              <p className="text-lg text-green-300 mb-4 animate-pulse">
                💖 Heart Sent
              </p>
            )}
            <p className="text-lg text-white/70 mb-8">
              With all my love, forever.<br/>— {messageData?.senderName}
            </p>
            
            {/* Heart Reaction Button */}
            {!hasReacted && (
              <motion.button
                onClick={async () => {
                  if (isReacting) return
                  setIsReacting(true)
                  try {
                    const code = params.code.toUpperCase()
                    const response = await fetch(`/api/messages/${code}/react`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ type: 'heart' })
                    })
                    
                    const result = await response.json()
                    if (result.success) {
                      setHasReacted(true)
                      console.log('💖 Heart reaction sent successfully and saved to DB')
                    } else {
                      if (result.alreadyReacted) {
                        setHasReacted(true)
                        console.log('💖 You have already sent a heart')
                      } else {
                        console.error('Failed to send reaction:', result.error)
                        // Don't show alert, just log
                      }
                    }
                  } catch (error) {
                    console.error('Error sending reaction:', error)
                    // Don't show alert, just log
                  } finally {
                    setIsReacting(false)
                  }
                }}
                disabled={isReacting}
                className="mb-6 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isReacting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">💖</span>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    💖 Send Heart
                  </span>
                )}
              </motion.button>
            )}
            
            {hasReacted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-green-400 text-base font-semibold"
              >
                ✓ Your heart has been sent!
              </motion.div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartExperience}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-base font-bold transition-all border border-white/20"
              >
                Watch Again
              </button>
              <button
                onClick={() => router.push('/auth')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-[0_0_30px_rgba(236,72,153,0.4)]"
              >
                Send Love Back ❤️
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
