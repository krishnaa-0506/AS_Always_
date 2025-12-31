'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

interface MemoryUploadProps {
  onComplete: (data: { memories: MemoryUploadData[], textMemories: string[] }) => void
  initialMemories?: MemoryUploadData[]
}

interface MemoryUploadData {
  id: string
  secure_url: string
  original_filename: string
  resource_type: 'PHOTO' | 'VIDEO' | 'VOICE'
  bytes?: number
  width?: number
  height?: number
  duration?: number
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  result?: MemoryUploadData
}

export default function MemoryUpload({ onComplete, initialMemories = [] }: MemoryUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MemoryUploadData[]>(initialMemories)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])

  const uploadToBackend = async (file: File): Promise<MemoryUploadData | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'photo') // Always photo for this specific requirement
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMsg = 'Upload failed'
        try {
          const errorData = await response.json()
          errorMsg = errorData.error || errorMsg
        } catch (e) {
          // fallback
        }
        throw new Error(errorMsg)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      return {
        id: result.data.id,
        secure_url: result.data.secure_url,
        original_filename: result.data.original_filename,
        resource_type: result.data.type,
        bytes: file.size,
      }
    } catch (error) {
      console.error('Backend upload error:', error)
      throw error
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter to only take up to 5 total images
    const currentCount = uploadedFiles.length + uploadingFiles.filter(f => f.status === 'uploading').length
    const availableSlots = 5 - currentCount

    if (availableSlots <= 0) {
      alert('You can only upload up to 5 images.')
      return
    }

    const filesToUpload = acceptedFiles.slice(0, availableSlots)
    if (acceptedFiles.length > availableSlots) {
      alert(`Only the first ${availableSlots} files will be uploaded (Max 5 total).`)
    }

    filesToUpload.forEach((file) => {
      const uploadId = Date.now().toString() + Math.random()
      
      setUploadingFiles(prev => [...prev, {
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading'
      }])

      uploadToBackend(file)
        .then((result) => {
          if (result) {
            setUploadedFiles(prev => [...prev, result])
            setUploadingFiles(prev => prev.map(uf => 
              uf.id === uploadId 
                ? { ...uf, status: 'success', progress: 100, result }
                : uf
            ))
            setTimeout(() => {
              setUploadingFiles(prev => prev.filter(uf => uf.id !== uploadId))
            }, 2000)
          }
        })
        .catch((error) => {
          setUploadingFiles(prev => prev.map(uf => 
            uf.id === uploadId 
              ? { ...uf, status: 'error', error: error.message }
              : uf
          ))
        })
    })
  }, [uploadedFiles, uploadingFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 5,
    maxSize: 20 * 1024 * 1024, // 20MB for ImageKit
    disabled: (uploadedFiles.length >= 5) || uploadingFiles.some(f => f.status === 'uploading')
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const removeUploadingFile = (uploadId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== uploadId))
  }

  const handleContinue = () => {
    onComplete({ 
      memories: uploadedFiles, 
      textMemories: []
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0.0'
    return (bytes / 1024 / 1024).toFixed(1)
  }

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
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🥇
        </motion.div>
        <h2 className="text-2xl font-cinematic text-white mb-2">Upload Your Memories</h2>
        <p className="text-white/70">Share up to 5 special photos to include in your message</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="files"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
            {uploadedFiles.length < 5 ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-pink-400 bg-pink-500/10' 
                    : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
                }`}
              >
                <input {...getInputProps()} />
                <motion.div 
                  className="text-4xl mb-4"
                  animate={isDragActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {isDragActive ? '🎯' : '📤'}
                </motion.div>
                <p className="text-white text-lg mb-2">
                  {isDragActive 
                    ? 'Drop your photos here!' 
                    : 'Drag & drop photos here'
                  }
                </p>
                <p className="text-white/60">or click to select files (Max 5)</p>
                <p className="text-white/40 text-sm mt-2">
                  Supports only: JPG, JPEG, PNG (max 20MB each)
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5">
                <p className="text-pink-400 text-lg">Maximum of 5 photos reached.</p>
                <p className="text-white/40 text-sm">Remove a photo to upload a new one.</p>
              </div>
            )}

            {(uploadedFiles.length > 0 || uploadingFiles.length > 0) && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-white font-semibold mb-4">
                  Photos ({uploadedFiles.length}/5)
                  {uploadingFiles.filter(f => f.status === 'uploading').length > 0 && 
                    ` • Uploading: ${uploadingFiles.filter(f => f.status === 'uploading').length}`
                  }
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <AnimatePresence>
                    {uploadingFiles.map((uploadingFile) => (
                      <motion.div
                        key={uploadingFile.id}
                        className="bg-white/10 rounded-xl p-4 relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                      >
                        <div className="text-2xl mb-2 text-center">
                          {uploadingFile.status === 'uploading' && '⏳'}
                          {uploadingFile.status === 'success' && '✅'}
                          {uploadingFile.status === 'error' && '❌'}
                        </div>
                        <p className="text-white text-xs text-center truncate">
                          {uploadingFile.file.name}
                        </p>
                        
                        {uploadingFile.status === 'uploading' && (
                          <div className="mt-2 bg-white/20 rounded-full h-1">
                            <motion.div 
                              className="bg-pink-500 h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadingFile.progress}%` }}
                            />
                          </div>
                        )}
                        
                        {uploadingFile.status === 'error' && (
                          <p className="text-red-400 text-[10px] text-center mt-1 leading-tight">
                            {uploadingFile.error}
                          </p>
                        )}
                        
                        <button
                          onClick={() => removeUploadingFile(uploadingFile.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                    
                    {uploadedFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        className="bg-white/10 rounded-xl p-2 relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                      >
                        <div className="aspect-square bg-white/20 rounded-lg overflow-hidden">
                          <img 
                            src={file.secure_url} 
                            alt={file.original_filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-white/60 text-[10px] mt-1 text-center truncate px-1">
                          {file.original_filename}
                        </p>
                        
                        <motion.button
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ×
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
        </motion.div>
      </AnimatePresence>

      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handleContinue}
          className="btn-primary text-lg px-8 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to Music →
        </motion.button>
        <p className="text-white/60 text-sm mt-2">
          {uploadedFiles.length} photos added
        </p>
      </motion.div>
    </motion.div>
  )
}
