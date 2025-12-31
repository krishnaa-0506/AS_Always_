'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import CinematicBackground from '@/components/CinematicBackground'

interface RoleOption {
  id: string
  title: string
  description: string
  emoji: string
  color: string
  path: string
}

const roles: RoleOption[] = [
  {
    id: 'sender',
    title: 'Sender',
    description: 'Create beautiful memories and messages for your loved ones',
    emoji: '💌',
    color: 'from-pink-500 to-rose-500',
    path: '/sender'
  },
  {
    id: 'receiver',
    title: 'Receiver',
    description: 'Experience magical memories someone created for you',
    emoji: '💝',
    color: 'from-purple-500 to-indigo-500',
    path: '/receiver'
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Manage the platform and oversee user experiences',
    emoji: '⚙️',
    color: 'from-gray-600 to-gray-700',
    path: '/admin/login'
  }
]

export default function RoleSelection() {
  const router = useRouter()

  const handleRoleSelect = (role: RoleOption) => {
    if (role.id === 'sender') {
      // For sender, check if authenticated first
      router.push('/sender')
    } else {
      router.push(role.path)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-6xl mx-auto w-full">

          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-cinematic text-white mb-4">
              Choose Your Journey
            </h1>
            <p className="text-xl text-white/70 font-soft">
              How would you like to experience AsAlways today?
            </p>
          </motion.div>

          {/* Role Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="glass-panel p-8 text-center h-full relative overflow-hidden group-hover:bg-white/20 transition-all duration-500">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Emoji */}
                    <motion.div 
                      className="text-6xl mb-6"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {role.emoji}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-cinematic text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-200 transition-all duration-300">
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 font-soft leading-relaxed mb-6">
                      {role.description}
                    </p>

                    {/* Action Button */}
                    <motion.div
                      className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${role.color} text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Select {role.title}
                      <motion.span 
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                    >
                      ✨
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Back Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => router.push('/')}
              className="btn-secondary text-lg px-8 py-3"
            >
              ← Back to Home
            </button>
          </motion.div>

          {/* Floating Hearts Animation */}
          <div className="absolute top-1/4 left-10 pointer-events-none">
            <motion.div
              className="text-pink-300 text-2xl"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💕
            </motion.div>
          </div>

          <div className="absolute bottom-1/4 right-10 pointer-events-none">
            <motion.div
              className="text-blue-300 text-2xl"
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, -15, 15, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              ✨
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/4 pointer-events-none">
            <motion.div
              className="text-yellow-300 text-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              🌟
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}