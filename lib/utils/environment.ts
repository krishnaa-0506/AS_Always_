/**
 * Environment validation utility
 * Ensures all required environment variables are properly set
 */

interface EnvVarConfig {
  required: boolean
  minLength?: number
  default?: string
  description: string
}

const REQUIRED_ENV_VARS: Record<string, EnvVarConfig> = {
  // Database
  MONGODB_URI: {
    required: true,
    description: 'MongoDB connection string'
  },
  
  // Authentication
  JWT_SECRET: {
    required: true,
    minLength: 32,
    description: 'JWT signing secret (minimum 32 characters)'
  },
  
  REFRESH_SECRET: {
    required: true,
    minLength: 32,
    description: 'JWT refresh token secret (minimum 32 characters)'
  },
  
  // File Storage
  CLOUDINARY_CLOUD_NAME: {
    required: true,
    description: 'Cloudinary cloud name'
  },
  
  CLOUDINARY_API_KEY: {
    required: true,
    description: 'Cloudinary API key'
  },
  
  CLOUDINARY_API_SECRET: {
    required: true,
    description: 'Cloudinary API secret'
  },
  
  // Admin Access
  ADMIN_SECRET_CODE: {
    required: true,
    minLength: 6,
    description: 'Admin secret code for elevated access'
  },
  
  // AI/LLM Services
  LLM_API_KEY: {
    required: true,
    description: 'LLM API key for content generation'
  },
  
  EMBEDDING_MODEL: {
    required: false,
    default: 'text-embedding-3-small',
    description: 'Embedding model for RAG'
  },
  
  LLM_MODEL: {
    required: false,
    default: 'mixtral-8x7b-32768',
    description: 'LLM model for content generation'
  }
} as const

interface ValidationError {
  variable: string
  issue: string
}

export class EnvironmentValidator {
  private static errors: ValidationError[] = []
  
  static validateAll(): ValidationError[] {
    this.errors = []
    
    Object.entries(REQUIRED_ENV_VARS).forEach(([varName, config]) => {
      const value = process.env[varName]
      
      if (config.required && !value) {
        this.errors.push({
          variable: varName,
          issue: `Missing required environment variable: ${config.description}`
        })
        return
      }
      
      if (value && 'minLength' in config && config.minLength && value.length < config.minLength) {
        this.errors.push({
          variable: varName,
          issue: `${varName} must be at least ${'minLength' in config ? config.minLength : 0} characters long`
        })
      }
    })
    
    return this.errors
  }
  
  static validateForProduction(): void {
    const errors = this.validateAll()
    
    if (errors.length > 0) {
      console.error('❌ Environment validation failed:')
      errors.forEach(error => {
        console.error(`  - ${error.variable}: ${error.issue}`)
      })
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Production environment validation failed. Check environment variables.')
      } else {
        console.warn('⚠️  Environment validation warnings in development mode')
      }
    } else {
      console.log('✅ Environment validation passed')
    }
  }
  
  static getConfigurationStatus(): Record<string, { 
    configured: boolean
    secure: boolean 
    description: string 
  }> {
    const status: Record<string, { configured: boolean; secure: boolean; description: string }> = {}
    
    Object.entries(REQUIRED_ENV_VARS).forEach(([varName, config]) => {
      const value = process.env[varName]
      const configured = !!value
      const secure = configured && (!('minLength' in config) || !config.minLength || value!.length >= config.minLength)
      
      status[varName] = {
        configured,
        secure,
        description: config.description
      }
    })
    
    return status
  }
}

// Validate environment on import (but allow build to proceed)
if (process.env.NODE_ENV !== 'test' && typeof window === 'undefined') {
  // Only validate at runtime, not during build
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    try {
      EnvironmentValidator.validateForProduction()
    } catch (error) {
      console.error('Environment validation failed:', error)
      process.exit(1)
    }
  } else if (process.env.NODE_ENV === 'development') {
    // In development, show warnings but don't exit
    const errors = EnvironmentValidator.validateAll()
    if (errors.length > 0) {
      console.warn('⚠️  Development environment warnings:')
      errors.forEach(error => {
        console.warn(`  - ${error.variable}: ${error.issue}`)
      })
    }
  }
}