'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, Check, RotateCcw, ArrowLeft } from 'lucide-react'
import PreviewFloatingIcons from './PreviewFloatingIcons'

interface CompactMemoryPreviewProps {
  content: string[]
  relationship?: string
  media?: {
    images?: string[]
    video?: string
    voice?: string
  }
  selectedSong?: string
  onAccept?: () => void
  onBack?: () => void
}

export default function CompactMemoryPreview({
  content,
  relationship = 'romantic',
  media = {},
  selectedSong,
  onAccept,
  onBack
}: CompactMemoryPreviewProps) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [revealedLines, setRevealedLines] = useState<string[]>([])
  const [isRevealing, setIsRevealing] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)

  // Media handling
  const hasImages = media.images && media.images.length > 0
  const hasVideo = media.video && media.video.length > 0
  const hasVoice = media.voice && media.voice.length > 0

  // Show 1 image only on screens 7–11 (indices 6–10)
  const imageSlotIndex = currentScreen - 6
  const currentImage = hasImages && imageSlotIndex >= 0 && imageSlotIndex < (media.images?.length || 0)
    ? media.images![imageSlotIndex]
    : undefined

  // Get gradient based on relationship and screen
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

  // Split content into lines (assuming content is already line-separated)
  const getCurrentLines = () => {
    if (!Array.isArray(content) || content.length === 0) {
      return ['Content not available']
    }
    const currentContent = content[currentScreen] || ''
    // Ensure currentContent is a string
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

  // Auto-play background music when component mounts or when selectedSong changes
  useEffect(() => {
    if (selectedSong && backgroundMusic) {
      // Auto-play when user navigates to next screen or when music is selected
      const timer = setTimeout(() => {
        backgroundMusic.play().catch(console.error)
        setIsPlaying(true)
      }, 500) // Small delay to ensure smooth transition
      
      return () => clearTimeout(timer)
    }
  }, [selectedSong, backgroundMusic])

  // Initialize background music when selectedSong changes
  useEffect(() => {
    if (selectedSong) {
      let songUrl = selectedSong
      if (!songUrl.startsWith('http')) {
        if (songUrl.startsWith('/')) {
          // Already a URL
        } else if (songUrl.includes('.mp3')) {
          songUrl = `/songs/${songUrl}`
        } else {
          songUrl = `/songs/${songUrl}.mp3`
        }
      }
        
      const audio = new Audio(songUrl)
      audio.loop = true
      audio.volume = 1.0
      audio.addEventListener('error', (e) => {
        console.warn('Failed to load background music:', songUrl, e)
      })
      setBackgroundMusic(audio)
    } else {
      setBackgroundMusic(null)
    }
  }, [selectedSong])

  // Auto advance screens when playing
  useEffect(() => {
    if (isPlaying && Array.isArray(content) && content.length > 0 && currentScreen < content.length - 1) {
      const timer = setTimeout(() => {
        handleNext()
      }, 4000) // 4 seconds per screen
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentScreen, content])

  // Line-by-line reveal animation
  useEffect(() => {
    // Reset revealed lines when screen changes
    setRevealedLines([])
    setIsRevealing(false)
    
    if (isVisible) {
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
        }, index * 800) // 800ms delay between lines
        timeouts.push(timeout)
      })
      
      // Cleanup function to clear timeouts
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout))
      }
    }
  }, [currentScreen, isVisible])

  const handleNext = () => {
    if (Array.isArray(content) && content.length > 0 && currentScreen < content.length - 1) {
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

  const togglePlayPause = () => {
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Content Container */}
      <div className={`relative ${getCurrentGradient()} rounded-2xl overflow-hidden shadow-2xl`}>
        {/* Lucide Floating Icons */}
        <PreviewFloatingIcons screenIndex={currentScreen} />

        {/* Main Content Box */}
        <div className="relative z-10 p-8">
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
                    <div className="p-8 lg:p-12">
                      {/* Screen indicator */}
                      <div className="text-center mb-6">
                        <span className="text-yellow-400 text-sm font-medium">
                          Screen {currentScreen + 1} of {Array.isArray(content) ? content.length : 0}
                        </span>
                      </div>

                      {/* Media Display Section */}
                      {((!!currentImage) || hasVideo) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mb-8"
                        >
                          {/* Image (screens 7–11 only) */}
                          {!!currentImage && (
                            <div className="mb-6">
                              <img
                                src={currentImage}
                                alt="Memory"
                                className="w-full max-w-md mx-auto rounded-lg border-2 border-yellow-400/30 object-cover"
                                style={{ maxHeight: '220px' }}
                              />
                            </div>
                          )}

                          {/* Video */}
                          {hasVideo && (
                            <div className="mb-6">
                              <video
                                src={media.video!}
                                controls
                                className="w-full max-w-sm mx-auto rounded-lg border-2 border-yellow-400/30"
                                style={{ maxHeight: '150px' }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Animated Text Content */}
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

                      {/* Voice Message */}
                      {hasVoice && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="mt-8 text-center"
                        >
                          <audio
                            src={media.voice!}
                            controls
                            className="mx-auto"
                            style={{
                              filter: 'sepia(1) hue-rotate(35deg) saturate(1.5)',
                            }}
                          />
                          <p className="text-yellow-400 text-sm mt-2">Voice Message</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="relative z-20 bg-black/80 backdrop-blur-sm border-t border-yellow-400/20 p-6">
          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={handlePrev}
              disabled={currentScreen === 0}
              className="p-3 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-yellow-400" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black" />
              ) : (
                <Play className="w-6 h-6 text-black" />
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={Array.isArray(content) ? currentScreen === content.length - 1 : true}
              className="p-3 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6 text-yellow-400" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-1 mb-6">
            {Array.isArray(content) && Array.from({ length: content.length }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentScreen ? 'bg-yellow-400 scale-125' :
                  i < currentScreen ? 'bg-yellow-400/60' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              onClick={onAccept}
              className="flex items-center space-x-2 px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>Accept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}