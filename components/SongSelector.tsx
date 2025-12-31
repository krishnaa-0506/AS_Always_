'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllSongs as getAllImageKitSongs } from '@/lib/data/imagekitSongs'

interface SongSelectorProps {
  onComplete: (data: { selectedSong?: string }) => void
  initialSong?: string
  relationship?: string
}

export default function SongSelector({ onComplete, initialSong, relationship }: SongSelectorProps) {
  const [selectedSong, setSelectedSong] = useState<string | null>(initialSong || null)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedSongUrl, setUploadedSongUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      try {
        audioRef.current?.pause()
      } catch {
      }
      audioRef.current = null
    }
  }, [])

  const allSongs = getAllImageKitSongs()

  const handleSongSelect = (songId: string) => {
    setSelectedSong(selectedSong === songId ? null : songId)
  }

  const handlePlay = (songId: string) => {
    const songData = allSongs.find((s) => s.id === songId)
    const url = songData?.url
    if (!url) {
      console.error('Song URL not found for ID:', songId)
      return
    }

    const nextIsPlaying = isPlaying !== songId
    setIsPlaying(nextIsPlaying ? songId : null)

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (nextIsPlaying) {
        console.log('Attempting to play song:', url)
        const audio = new Audio(url)
        audio.volume = 1.0
        audio.loop = true
        audio.addEventListener('ended', () => setIsPlaying(null))
        audio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e)
          setIsPlaying(null)
        })
        audio.addEventListener('loadstart', () => console.log('Audio loading started...'))
        audio.addEventListener('canplay', () => console.log('Audio can play now'))
        audioRef.current = audio
        void audio.play().catch(error => {
          console.error('Failed to play audio:', error)
          setIsPlaying(null)
        })
      }
    } catch (error) {
      console.error('Audio playback exception:', error)
      setIsPlaying(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Only accept MP3
    if (!file.name.toLowerCase().endsWith('.mp3')) {
      alert('Only MP3 files are allowed')
      return
    }

    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('File too large. Maximum size is 20MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'audio')
      
      // Try to get messageId from sessionStorage (set during message creation)
      const storedMessageId = sessionStorage.getItem('currentMessageId')
      if (storedMessageId) {
        formData.append('messageId', storedMessageId)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success && result.data?.secure_url) {
        const uploadedUrl = result.data.secure_url
        setUploadedSongUrl(uploadedUrl)
        setSelectedSong(uploadedUrl) // Use URL as selected song
        alert('Song uploaded successfully!')
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Failed to upload song: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleContinue = async () => {
    if (uploadedSongUrl) {
      onComplete({ selectedSong: uploadedSongUrl })
      return
    }

    if (selectedSong) {
      const songData = allSongs.find((s) => s.id === selectedSong)
      if (songData?.url) {
        // Song is already from ImageKit, use the URL directly
        onComplete({ selectedSong: songData.url })
        return
      }
    }

    onComplete({ selectedSong: undefined })
  }

  const handleSkip = () => {
    onComplete({ selectedSong: undefined })
  }

  const selectedSongData = allSongs.find(song => song.id === selectedSong)

  return (
    <motion.div 
      className="glass-panel p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <motion.div 
          className="text-5xl mb-4"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎵
        </motion.div>
        <h2 className="text-2xl font-cinematic text-white mb-2">Choose Background Music</h2>
        <p className="text-white/70">Select a song that captures the emotion of your message (optional)</p>
      </div>

      {/* Selected Song Display */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 mb-8 border border-pink-500/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="text-center">
              <div className="text-pink-300 text-sm mb-2">🎶 Selected Song</div>
              {uploadedSongUrl ? (
                <>
                  <div className="text-xl font-semibold text-white">Your Uploaded Song</div>
                  <div className="text-white/70">Custom MP3</div>
                </>
              ) : (
                <>
                  <div className="text-xl font-semibold text-white">{selectedSongData?.title}</div>
                  <div className="text-white/70">{selectedSongData?.artist}</div>
                  <div className="flex justify-center items-center gap-4 mt-3">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                      {selectedSongData?.emotion?.[0] || 'Music'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                      {selectedSongData?.genre || 'Unknown'}
                    </span>
                    <span className="text-white/60 text-sm">{selectedSongData?.duration || '?:??'}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
       </AnimatePresence>

      {/* Songs Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">
            All Songs ({allSongs.length})
          </h3>
        </div>
        <div className="max-h-96 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {allSongs.map((song) => (
                <motion.div
                  key={song.id}
                  className={`bg-white/5 rounded-xl p-4 border cursor-pointer transition-all ${
                    selectedSong === song.id
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSongSelect(song.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.5 }}
                        >
                          {selectedSong === song.id ? '✓' : '♪'}
                        </motion.div>
                        <div>
                          <h4 className="text-white font-medium text-sm">{song.title}</h4>
                          <p className="text-white/60 text-xs">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                          {song.genre}
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                          {song.emotion?.[0] || '?'}
                        </span>
                        <span className="text-white/60 text-xs">{song.duration || '?:??'}</span>
                      </div>
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlay(song.id)
                      }}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying === song.id ? '⏸️' : '▶️'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upload Option */}
      <div className="mb-8">
        <motion.button
          onClick={() => setShowUpload(!showUpload)}
          className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 border border-dashed border-white/30 text-white/70 hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl mb-2">📤</div>
          <div>Upload Your Own Song</div>
          <div className="text-sm text-white/50 mt-1">
            {showUpload ? 'Click to hide upload options' : 'Have a special song in mind?'}
          </div>
        </motion.button>

        <AnimatePresence>
          {showUpload && (
            <motion.div
              className="mt-4 p-4 bg-white/5 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="file"
                accept="audio/mpeg,.mp3"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white disabled:opacity-50"
              />
              {uploading && (
                <div className="text-center mt-2 text-pink-300">
                  ⏳ Uploading...
                </div>
              )}
              {uploadedSongUrl && (
                <div className="text-center mt-2 text-green-300">
                  ✅ Song uploaded successfully!
                </div>
              )}
              <p className="text-white/60 text-sm mt-2">
                Only MP3 files accepted (max 20MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <motion.button
          onClick={handleSkip}
          className="btn-secondary px-8 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip Music
        </motion.button>
        
        <motion.button
          onClick={handleContinue}
          className="btn-primary px-8 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {selectedSong ? 'Continue with Song →' : 'Continue without Music →'}
        </motion.button>
      </div>

      {/* Music Note */}
      <div className="text-center mt-6">
        <p className="text-white/60 text-sm">
          🎵 Music will play softly in the background during the memory experience
        </p>
      </div>
    </motion.div>
  )
}