'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface EnhancedMessageFormProps {
  onComplete: (data: any) => void
  initialData?: any
}

const relationships = [
  { value: 'friend', label: 'Friend', emoji: '👫' },
  { value: 'lover', label: 'Lover', emoji: '💕' },
  { value: 'spouse', label: 'Spouse', emoji: '💑' },
  { value: 'mom', label: 'Mom', emoji: '👩' },
  { value: 'dad', label: 'Dad', emoji: '👨' },
  { value: 'sibling', label: 'Sibling', emoji: '👫' },
  { value: 'grandparent', label: 'Grandparent', emoji: '👴' }
]

const emotionTags = [
  { value: 'birthday', label: 'Birthday', emoji: '🎂', color: 'from-pink-500 to-red-500' },
  { value: 'anniversary', label: 'Anniversary', emoji: '💒', color: 'from-yellow-500 to-orange-500' },
  { value: 'graduation', label: 'Graduation', emoji: '🎓', color: 'from-blue-500 to-indigo-500' },
  { value: 'farewell', label: 'Farewell', emoji: '👋', color: 'from-purple-500 to-pink-500' },
  { value: 'apology', label: 'Apology', emoji: '🙏', color: 'from-gray-500 to-slate-500' },
  { value: 'gratitude', label: 'Gratitude', emoji: '🙏', color: 'from-green-500 to-emerald-500' },
  { value: 'encouragement', label: 'Encouragement', emoji: '💪', color: 'from-amber-500 to-orange-600' },
  { value: 'celebration', label: 'Celebration', emoji: '🎉', color: 'from-teal-500 to-cyan-500' }
]

export default function EnhancedMessageForm({ onComplete, initialData }: EnhancedMessageFormProps) {
  const [formData, setFormData] = useState({
    // Mandatory fields only
    senderName: initialData?.senderName || '',
    receiverName: initialData?.receiverName || '',
    relationship: initialData?.relationship || '',
    receiverGender: initialData?.receiverGender || '',
    occasion: initialData?.occasion || '',
    receiverMemory: initialData?.receiverMemory || ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { id: 1, title: 'Message Details', icon: '💌' }
  ]

  const handleNext = () => {
    if (validateForm()) {
      handleSubmit()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.senderName.trim()) newErrors.senderName = 'Please enter your name'
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Please enter receiver name'
    if (!formData.relationship) newErrors.relationship = 'Please select a relationship'
    if (!formData.receiverGender) newErrors.receiverGender = 'Please select gender'
    if (!formData.occasion) newErrors.occasion = 'Please select an occasion'
    if (!formData.receiverMemory.trim()) newErrors.receiverMemory = 'Please enter a special memory'
    
    // Validate gender-relationship compatibility
    if (formData.receiverGender && formData.relationship) {
      if (formData.receiverGender === 'male' && formData.relationship === 'mom') {
        newErrors.relationship = 'Male cannot be a Mom. Please select correctly.'
      }
      if (formData.receiverGender === 'female' && formData.relationship === 'dad') {
        newErrors.relationship = 'Female cannot be a Dad. Please select correctly.'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value }
      
      // Handle gender-relationship compatibility
      if (field === 'receiverGender') {
        if (value === 'male' && prev.relationship === 'mom') {
          newFormData.relationship = ''
        }
        if (value === 'female' && prev.relationship === 'dad') {
          newFormData.relationship = ''
        }
      }
      
      if (field === 'relationship') {
        if (value === 'mom' && prev.receiverGender === 'male') {
          // Don't allow this selection
          return prev
        }
        if (value === 'dad' && prev.receiverGender === 'female') {
          // Don't allow this selection
          return prev
        }
      }
      
      return newFormData
    })
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <motion.div 
      className="glass-panel p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div 
          className="text-5xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤖
        </motion.div>
        <h2 className="text-2xl font-cinematic text-white mb-2">AI-Powered Memory Creation</h2>
        <p className="text-white/70">Fill in the mandatory details to create your personalized memory</p>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl text-white font-semibold">
          Create Your Memory
        </h3>
        <p className="text-white/60">All fields are required</p>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Sender Info */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg">Sender Information</h4>
            
            <div>
              <label className="text-white font-medium">Your Name *</label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-pink-500 transition-all"
                placeholder="Enter your name..."
              />
              {errors.senderName && <p className="text-red-400 text-sm">{errors.senderName}</p>}
            </div>
          </div>

          {/* Receiver Info */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg">Receiver Information</h4>
            
            <div>
              <label className="text-white font-medium">Receiver's Name *</label>
              <input
                type="text"
                value={formData.receiverName}
                onChange={(e) => updateField('receiverName', e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-pink-500 transition-all"
                placeholder="Who is this for?"
              />
              {errors.receiverName && <p className="text-red-400 text-sm">{errors.receiverName}</p>}
            </div>

            <div>
              <label className="text-white font-medium">Gender *</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { value: 'male', label: 'Male', emoji: '👨' },
                  { value: 'female', label: 'Female', emoji: '👩' }
                ].map((gender) => (
                  <motion.button
                    key={gender.value}
                    type="button"
                    onClick={() => updateField('receiverGender', gender.value)}
                    className={`p-3 rounded-xl border transition-all ${  
                      formData.receiverGender === gender.value
                        ? 'bg-pink-500 border-pink-400 text-white'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-1">{gender.emoji}</div>
                    <div className="text-sm font-medium">{gender.label}</div>
                  </motion.button>
                ))}
              </div>
              {errors.receiverGender && <p className="text-red-400 text-sm">{errors.receiverGender}</p>}
            </div>
          </div>

          {/* Relationship */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg">Relationship *</h4>
            <div className="grid grid-cols-2 gap-3">
              {relationships.map((rel) => (
                <motion.button
                  key={rel.value}
                  type="button"
                  onClick={() => updateField('relationship', rel.value)}
                  className={`p-4 rounded-xl border transition-all ${
                    formData.relationship === rel.value
                      ? 'bg-purple-500 border-purple-400 text-white'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{rel.emoji}</div>
                  <div className="text-sm font-medium">{rel.label}</div>
                </motion.button>
              ))}
            </div>
            {errors.relationship && <p className="text-red-400 text-sm">{errors.relationship}</p>}
          </div>

          {/* Occasion */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg">Occasion *</h4>
            <div className="grid grid-cols-2 gap-3">
              {emotionTags.map((occasion) => (
                <motion.button
                  key={occasion.value}
                  type="button"
                  onClick={() => updateField('occasion', occasion.value)}
                  className={`p-4 rounded-xl border transition-all ${
                    formData.occasion === occasion.value
                      ? 'bg-gradient-to-r ' + occasion.color + ' border-transparent text-white'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{occasion.emoji}</div>
                  <div className="text-sm font-medium">{occasion.label}</div>
                </motion.button>
              ))}
            </div>
            {errors.occasion && <p className="text-red-400 text-sm">{errors.occasion}</p>}
          </div>

          {/* Special Memory */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white font-medium text-lg">Special Memory *</h4>
            <div>
              <textarea
                value={formData.receiverMemory}
                onChange={(e) => updateField('receiverMemory', e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-pink-500 transition-all"
                placeholder="Share a special memory or moment you want to include..."
                rows={4}
              />
              {errors.receiverMemory && <p className="text-red-400 text-sm">{errors.receiverMemory}</p>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mt-8">
        <motion.button
          onClick={handleNext}
          className="btn-primary px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 Generate AI Memory Experience
        </motion.button>
      </div>
    </motion.div>
  )
}