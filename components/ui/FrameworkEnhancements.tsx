'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState } from 'react'

// Enhanced Card Component with Multiple Variants
export const EnhancedCard = ({ 
  children, 
  variant = 'default',
  glowColor = 'purple',
  className = '',
  ...props 
}: {
  children: ReactNode
  variant?: 'default' | 'glass' | 'neon' | 'gradient'
  glowColor?: 'purple' | 'pink' | 'blue' | 'cyan' | 'green'
  className?: string
  [key: string]: any
}) => {
  const baseStyles = "relative overflow-hidden rounded-xl transition-all duration-300"
  
  const variants = {
    default: "bg-white/5 backdrop-blur-sm border border-white/10",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg",
    neon: `bg-black/50 border-2 border-${glowColor}-400 shadow-lg shadow-${glowColor}-500/50`,
    gradient: `bg-gradient-to-br from-${glowColor}-500/20 to-transparent border border-${glowColor}-300/30`
  }

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: variant === 'neon' ? `0 0 30px rgba(168, 85, 247, 0.4)` : undefined
      }}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Animated Button Component
export const AnimatedButton = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  className = '',
  onClick,
  ...props 
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'small' | 'medium' | 'large'
  icon?: ReactNode
  loading?: boolean
  className?: string
  onClick?: () => void
  [key: string]: any
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25",
    secondary: "border border-purple-400 text-purple-300 hover:bg-purple-400/10",
    ghost: "text-white/70 hover:text-white hover:bg-white/10",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
  }

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      className={`
        relative font-semibold rounded-full transition-all duration-300 
        ${variants[variant]} ${sizes[size]} ${className}
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 group
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {icon && !loading && (
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>
      )}
      
      <span>{children}</span>
    </motion.button>
  )
}

// Progressive Reveal Container
export const ProgressiveReveal = ({ 
  children, 
  delay = 0,
  direction = 'up',
  className = ''
}: {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}) => {
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 }
  }

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{ 
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}

// Floating Action Menu
export const FloatingActionMenu = ({ 
  items,
  className = ''
}: {
  items: Array<{
    icon: ReactNode
    label: string
    onClick: () => void
    color?: string
  }>
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  bg-white/10 backdrop-blur-sm border border-white/20
                  text-white hover:bg-white/20 transition-all
                  ${item.color || 'bg-purple-500/20'}
                `}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={item.onClick}
                title={item.label}
              >
                {item.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ✚
        </motion.div>
      </motion.button>
    </div>
  )
}

// Enhanced Loading States
export const EnhancedLoader = ({ 
  type = 'spinner',
  size = 'medium',
  color = 'purple',
  text
}: {
  type?: 'spinner' | 'dots' | 'pulse' | 'wave'
  size?: 'small' | 'medium' | 'large'
  color?: 'purple' | 'pink' | 'blue' | 'white'
  text?: string
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const colors = {
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    blue: 'border-blue-500',
    white: 'border-white'
  }

  const loaderTypes = {
    spinner: (
      <motion.div
        className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className={`w-2 h-2 bg-${color}-500 rounded-full`}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    ),
    pulse: (
      <motion.div
        className={`${sizes[size]} bg-${color}-500 rounded-full`}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity
        }}
      />
    ),
    wave: (
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            className={`w-1 bg-${color}-500 rounded-full`}
            style={{ height: size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px' }}
            animate={{ 
              scaleY: [1, 2, 1]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {loaderTypes[type]}
      {text && (
        <motion.p
          className="text-white/70 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Interactive Background Patterns
export const InteractiveBackground = ({ 
  pattern = 'particles',
  intensity = 'medium',
  color = 'purple'
}: {
  pattern?: 'particles' | 'grid' | 'waves' | 'constellation'
  intensity?: 'low' | 'medium' | 'high'
  color?: 'purple' | 'pink' | 'blue' | 'cyan'
}) => {
  const particleCount = {
    low: 15,
    medium: 25,
    high: 40
  }[intensity]

  if (pattern === 'particles') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-${color}-400 rounded-full opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    )
  }

  if (pattern === 'constellation') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <motion.div
              className={`w-2 h-2 bg-${color}-400 rounded-full`}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
            {Math.random() > 0.7 && (
              <motion.div
                className={`absolute top-1 left-1 w-8 h-px bg-gradient-to-r from-${color}-400 to-transparent opacity-30`}
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  return null
}

export default {
  EnhancedCard,
  AnimatedButton,
  ProgressiveReveal,
  FloatingActionMenu,
  EnhancedLoader,
  InteractiveBackground
}