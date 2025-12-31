import { SecuritySanitizer } from '@/lib/security/sanitizer'

// Fallback authentication when MongoDB is unavailable
const fallbackUsers = new Map()

// Add some default users for testing - using environment variables only
if (process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD) {
  fallbackUsers.set(process.env.TEST_USER_EMAIL, {
    id: '1',
    _id: '1',
    email: process.env.TEST_USER_EMAIL,
    name: 'Test User',
    role: 'SENDER',
    password: process.env.TEST_USER_PASSWORD,
    createdAt: new Date()
  })
}

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  fallbackUsers.set(process.env.ADMIN_EMAIL, {
    id: '2',
    _id: '2',
    email: process.env.ADMIN_EMAIL,
    name: 'Admin User',
    role: 'ADMIN',
    password: process.env.ADMIN_PASSWORD,
    createdAt: new Date()
  })
}

export const fallbackAuth = {
  async register(email: string, password: string, name: string) {
    const sanitizedEmail = SecuritySanitizer.sanitizeForLogs(email)
    console.log('Fallback auth: Registering user', sanitizedEmail)
    
    if (fallbackUsers.has(email)) {
      throw new Error('User already exists')
    }
    
    const user = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      email,
      name,
      role: 'SENDER',
      createdAt: new Date()
    }
    
    fallbackUsers.set(email, { ...user, password })
    console.log('Fallback auth: User registered successfully')
    return user
  },

  async login(email: string, password: string) {
    const sanitizedEmail = SecuritySanitizer.sanitizeForLogs(email)
    console.log('Fallback auth: Login attempt for', sanitizedEmail)
    
    const user = fallbackUsers.get(email)
    if (!user || user.password !== password) {
      console.log('Fallback auth: Invalid credentials')
      throw new Error('Invalid credentials')
    }
    
    console.log('Fallback auth: Login successful')
    return {
      id: user.id,
      _id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  },

  async findByEmail(email: string) {
    return fallbackUsers.get(email) || null
  }
}