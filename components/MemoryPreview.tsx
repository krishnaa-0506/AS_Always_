'use client'

import { useState, useEffect } from 'react'
import CompactMemoryPreview from './CompactMemoryPreview'

interface MemoryPreviewProps {
  messageData: {
    textContent: string | undefined
    receiverGender: string
    senderName: string
    receiverName: string
    relationship: string
    message?: string
    memories?: any[]
    selectedTemplate?: string
    selectedSong?: string
  }
  isGenerating?: boolean
  generatedContent?: string[]
  onComplete?: (data: any) => void
  onAccept?: () => void
  onBack?: () => void
}

export default function MemoryPreview({ 
  messageData, 
  isGenerating = false,
  generatedContent = [],
  onComplete,
  onAccept,
  onBack
}: MemoryPreviewProps) {
  const [previewContent, setPreviewContent] = useState<string[]>(generatedContent)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  // Generate preview content if not provided
  useEffect(() => {
    if (generatedContent && generatedContent.length > 0) {
      setPreviewContent(generatedContent)
    } else {
      generatePreviewContent()
    }
  }, [generatedContent, messageData])

  const generatePreviewContent = async () => {
    setIsLoadingPreview(true)
    try {
      const response = await fetch('/api/generate-complete-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName: messageData.senderName,
          receiverName: messageData.receiverName,
          relationship: messageData.relationship,
          receiverGender: messageData.receiverGender || 'female',
          emotionTag: 'warm',
          textContent: messageData.message || messageData.textContent,
        }),
      })

      const result = await response.json()
      if (result.success && result.data && result.data.screens && Array.isArray(result.data.screens)) {
        // Extract content from screen objects
        const screens = result.data.screens.map((screen: any) => 
          typeof screen === 'string' ? screen : (screen.content || screen.lines?.join(' ') || String(screen))
        )
        setPreviewContent(screens)
      } else {
        console.error('Failed to generate preview content:', result.error)
        setPreviewContent(['Preview generation failed. Please try again.'])
      }
    } catch (error) {
      console.error('Error generating preview:', error)
      setPreviewContent(['Error generating preview. Please check your connection.'])
    } finally {
      setIsLoadingPreview(false)
    }
  }
  // Show generating state
  if (isGenerating || isLoadingPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-8"></div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isLoadingPreview ? 'Creating Preview...' : 'Creating Your Memory...'}
          </h2>
          <p className="text-white/70">
            {isLoadingPreview ? 'Please wait while we prepare your preview' : 'Please wait while we craft something beautiful'}
          </p>
        </div>
      </div>
    )
  }

  // Process media from memories
  const processMedia = () => {
    if (!messageData.memories || messageData.memories.length === 0) {
      return {}
    }

    const images: string[] = []
    let video: string | undefined
    let voice: string | undefined

    // Process uploaded memories (max 5 images, 1 video)
    messageData.memories.forEach(memory => {
      if ((memory.resource_type === 'PHOTO' || memory.resource_type === 'image') && images.length < 5) {
        images.push(memory.secure_url)
      } else if ((memory.resource_type === 'VIDEO' || memory.resource_type === 'video') && !video) {
        video = memory.secure_url
      } else if ((memory.resource_type === 'VOICE' || memory.resource_type === 'voice') && !voice) {
        voice = memory.secure_url
      }
    })

    return {
      images: images.length > 0 ? images : undefined,
      video,
      voice
    }
  }

  // Use the compact preview with generated content
  return (
    <CompactMemoryPreview
      content={previewContent}
      relationship={messageData.relationship}
      media={processMedia()}
      selectedSong={messageData.selectedSong}
      onAccept={onAccept || (() => onComplete?.(messageData))}
      onBack={onBack}
    />
  )
}