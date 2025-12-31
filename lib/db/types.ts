import { Document, ObjectId } from 'mongodb'

// Base types with Document inheritance for MongoDB
export interface BaseDocument extends Document {
  _id: ObjectId;
}

export interface User extends BaseDocument {
  email?: string
  name?: string
  role: 'SENDER' | 'RECEIVER' | 'ADMIN'
  password?: string
  createdAt: Date
  updatedAt: Date
}

export interface Message extends BaseDocument {
  code: string
  senderName: string
  receiverName: string
  relationship: string
  receiverGender: string
  emotionTag?: string
  selectedSong?: string
  selectedTemplate?: string
  voiceNote?: string
  textContent?: string
  status: 'CREATED' | 'GENERATED' | 'SENT' | 'VIEWED' | 'COMPLETED' | 'DELETED'
  isViewed: boolean
  viewedAt?: Date
  createdAt: Date
  updatedAt: Date
  senderId?: string
  receiverId?: string
  memories: Memory[]
  screens: AIScreen[]
  reactions: Reaction[]
}

export interface Memory extends BaseDocument {
  messageId: string
  type: 'PHOTO' | 'VIDEO' | 'TEXT' | 'VOICE'
  content: string
  filename?: string
  caption?: string
  order: number
  createdAt: Date
}

export interface AIScreen extends BaseDocument {
  messageId: string
  screenIndex: number
  type: 'intro' | 'photo' | 'video' | 'audio' | 'text' | 'voice' | 'memory' | 'final'
  content: string
  background?: string
  animation?: string
  duration: number
  emotion?: string
  hasImage?: boolean  // Indicates if this screen has an image
  imageUrl?: string   // ImageKit URL if this screen has an image
  imageIndex?: number // Index of the image (0-4, max 5 images)
  createdAt: Date
}

export interface Reaction extends BaseDocument {
  messageId: string
  type: string
  content?: string
  createdAt: Date
}

export interface Template extends BaseDocument {
  name: string
  description: string
  category: string
  suitableFor: string[]
  ageRange: string
  previewImages: string[]
  layouts: TemplateLayout[]
  animations: string[]
  colorSchemes: string[]
  isActive: boolean
  createdAt: Date
}

export interface TemplateLayout {
  id: string
  name: string
  structure: string
  positions: {
    title: { x: number; y: number; width: number; height: number }
    content: { x: number; y: number; width: number; height: number }
    media?: { x: number; y: number; width: number; height: number }
  }
}

export interface Theme extends BaseDocument {
  name: string
  description: string
  category: string
  backgrounds: string[]
  gradients: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  emotions: string[]
  mood: string
  previewImage: string
  isActive: boolean
  createdAt: Date
}

// Helper type for API responses
export type WithStringId<T> = Omit<T, '_id'> & { _id: string }
