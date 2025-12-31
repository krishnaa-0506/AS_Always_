'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CinematicBackground from '@/components/CinematicBackground'
import EnhancedMessageForm from '@/components/EnhancedMessageForm'
import Navigation from '@/components/Navigation'

import MemoryUpload from '@/components/MemoryUpload'
import SongSelector from '@/components/SongSelector'
import MemoryPreview from '@/components/MemoryPreview'
import GeneratingScreens from '@/components/GeneratingScreens'

type Step = 'form' | 'memories' | 'song' | 'preview' | 'generating' | 'complete'

interface CloudinaryUpload {
  id: string
  secure_url: string
  original_filename: string
  resource_type: 'image' | 'video' | 'raw'
  bytes: number
  width?: number
  height?: number
  duration?: number
}

interface MessageData {
  senderName: string
  senderAge?: string
  receiverName: string
  receiverAge?: string
  relationship: string
  receiverGender: string
  emotionTag?: string
  occasion?: string
  personalityTraits?: string[]
  selectedTemplate?: string
  selectedTheme?: string
  memories: CloudinaryUpload[]
  selectedSong?: string
  textContent: string | undefined
  message?: string
}

  // Component that uses useSearchParams
  function CreateMessageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState<Step>('form')
    const [user, setUser] = useState<any>(null)
    const [messageData, setMessageData] = useState<MessageData>({
      senderName: '',
      receiverName: '',
      relationship: '',
      receiverGender: '',
      memories: [],
      textContent: undefined
    })

    // Fetch user on mount
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/auth/me')
          if (res.ok) {
            const data = await res.json()
            if (data.success && data.user) {
              setUser(data.user)
              setMessageData(prev => ({
                ...prev,
                senderName: data.user.name || prev.senderName,
                senderId: data.user.id // Add senderId here
              }))
            }
          }
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }
      }
      fetchUser()
    }, [])

    const [generatedCode, setGeneratedCode] = useState<string>('')
  const [generatedScreens, setGeneratedScreens] = useState<any[]>([])
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null)

  // Handle template parameter from URL
  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      setMessageData(prev => ({ ...prev, selectedTemplate: templateId }))
    }
  }, [searchParams])

  const steps = [
    { id: 'form', title: 'Details', emoji: '📝' },
    { id: 'memories', title: 'Memories', emoji: '📸' },
    { id: 'song', title: 'Music', emoji: '🎵' },
    { id: 'preview', title: 'Preview', emoji: '👀' },
    { id: 'generating', title: 'Creating', emoji: '✨' },
    { id: 'complete', title: 'Ready!', emoji: '🎉' }
  ]

  const handleStepComplete = (stepData: any) => {
    setMessageData(prev => ({ ...prev, ...stepData }))
    
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as Step)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as Step)
    } else {
      router.push('/sender')
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return <EnhancedMessageForm onComplete={handleStepComplete} initialData={messageData} />
      case 'memories':
        return <MemoryUpload onComplete={handleStepComplete} initialMemories={messageData.memories.map((m) => ({
          ...m,
          resource_type: m.resource_type === 'image' ? 'PHOTO' : m.resource_type === 'video' ? 'VIDEO' : 'VOICE'
        }))} />
      case 'song':
        return <SongSelector onComplete={handleStepComplete} initialSong={messageData.selectedSong} />
      case 'preview':
        return <MemoryPreview 
          messageData={messageData} 
          generatedContent={generatedScreens}
          onAccept={() => setCurrentStep('generating')}
          onBack={handleBack}
        />
      case 'generating':
        return <GeneratingScreens messageData={messageData} onComplete={(code, screens, template) => {
          setGeneratedCode(code)
          setGeneratedScreens(screens)
          setGeneratedTemplate(template)
          setCurrentStep('complete')
        }} />
      case 'complete':
        return <CompletionScreen 
          code={generatedCode} 
          messageData={messageData}
          screens={generatedScreens}
          template={generatedTemplate}
        />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicBackground />
      <Navigation />
      
      <div className="relative z-10 px-4 pt-16 pb-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index
                
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-110' 
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white/20 text-white/60'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      animate={isActive ? { 
                        boxShadow: ['0 0 0 0 rgba(244, 63, 94, 0.4)', '0 0 0 10px rgba(244, 63, 94, 0)', '0 0 0 0 rgba(244, 63, 94, 0.4)']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isCompleted ? '✓' : step.emoji}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-cinematic text-white mb-1">
                {steps.find(step => step.id === currentStep)?.title}
              </h2>
              <p className="text-white/60">
                Step {steps.findIndex(step => step.id === currentStep) + 1} of {steps.length}
              </p>
            </div>
          </motion.div>


        </div>
      </div>

      {/* Step Content */}
      <div className="relative z-10 flex-1 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Completion Screen Component
function CompletionScreen({ 
  code, 
  messageData,
  screens = [],
  template
}: { 
  code: string
  messageData: MessageData
  screens?: any[]
  template?: any
}) {
  const router = useRouter()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

  const getShareText = () => {
    const url = `${window.location.origin}/receiver`
    return `Hey ${messageData.receiverName}! I created something special for you on AsAlways. Use code: ${code} to unlock your memory experience. Visit: ${url}`
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank')
  }

  const handleNativeShare = async () => {
    const url = `${window.location.origin}/receiver`
    const text = getShareText()
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

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code)
    alert('Code copied!')
  }

  return (
    <motion.div 
      className="text-center glass-panel p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-6xl mb-6"
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎉
      </motion.div>
      
      <h2 className="text-3xl font-cinematic text-white mb-4">
        Your Message is Ready!
      </h2>
      
      <p className="text-white/70 mb-8">
        Your personalized memory experience has been created for {messageData.receiverName}. 
        Share the code below to let them unlock their special journey.
      </p>

      {/* Generated Code */}
      <motion.div 
        className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-white/80 text-sm mb-2">Your Memory Code</div>
        <div className="text-4xl font-bold text-white tracking-widest font-mono">
          {code}
        </div>
      </motion.div>

      {/* Share Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.button
          onClick={handleWhatsApp}
          className="btn-primary flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📱 WhatsApp
        </motion.button>
        <motion.button
          onClick={handleNativeShare}
          className="btn-secondary flex items-center justify-center gap-2 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📤 Share
        </motion.button>
        <motion.button
          onClick={handleCopyCode}
          className="btn-secondary flex items-center justify-center gap-2 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📋 Copy Code
        </motion.button>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <motion.button
          onClick={() => router.push('/sender')}
          className="btn-primary px-8 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏠 Back to Dashboard
        </motion.button>
      </div>
    </motion.div>
  )
}

// Loading component for Suspense boundary
function CreateMessageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-white">Loading...</p>
      </div>
    </div>
  )
}

// Main export with Suspense boundary
export default function CreateMessage() {
  return (
    <Suspense fallback={<CreateMessageLoading />}>
      <CreateMessageContent />
    </Suspense>
  )
}