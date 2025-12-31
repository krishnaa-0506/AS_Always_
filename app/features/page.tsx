'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import CinematicBackground from '@/components/CinematicBackground'

export default function FeaturesPage() {
  const senderFeatures = [
    {
      icon: "📱",
      title: "Multi-Media Upload",
      description: "Upload photos, videos, voice recordings, and text messages",
      details: "Support for all major formats: JPG, PNG, MP4, MOV, MP3, WAV"
    },
    {
      icon: "🎨",
      title: "AI Screen Generation",
      description: "20 personalized emotional screens created by advanced AI",
      details: "Each screen is uniquely crafted based on your memories and relationship"
    },
    {
      icon: "🎵",
      title: "Curated Music Library",
      description: "Choose from 100+ ambient soundtracks and emotional music",
      details: "Professionally composed tracks to enhance your memory experience"
    },
    {
      icon: "🔐",
      title: "Secure Code Generation",
      description: "Unique 6-character codes for private sharing",
      details: "Military-grade encryption ensures your memories stay private"
    },
    {
      icon: "📊",
      title: "Message History",
      description: "Track all your created messages and their status",
      details: "See when messages are sent, viewed, and completed"
    },
    {
      icon: "🎙️",
      title: "Voice Recording",
      description: "Add personal voice messages to enhance emotions",
      details: "High-quality audio recording with noise reduction"
    }
  ]

  const receiverFeatures = [
    {
      icon: "🎬",
      title: "Cinematic Experience",
      description: "20 AI-generated emotional screens in sequence",
      details: "Smooth transitions and personalized pacing for maximum impact"
    },
    {
      icon: "⏯️",
      title: "Interactive Controls",
      description: "Play, pause, and navigate through memory screens",
      details: "Full control over viewing experience with progress tracking"
    },
    {
      icon: "📱",
      title: "Cross-Platform",
      description: "Beautiful experience on desktop, tablet, and mobile",
      details: "Responsive design adapts to any screen size perfectly"
    },
    {
      icon: "💝",
      title: "Reaction System",
      description: "Send hearts, love, and reactions back to sender",
      details: "Express your emotions with beautiful animated reactions"
    },
    {
      icon: "🔄",
      title: "Replay Anytime",
      description: "Access your memories unlimited times with your code",
      details: "Memories are preserved forever and can be revisited anytime"
    },
    {
      icon: "🌟",
      title: "Emotional Journey",
      description: "Carefully sequenced screens for maximum emotional impact",
      details: "AI determines optimal order and timing for your unique story"
    }
  ]

  const adminFeatures = [
    {
      icon: "📈",
      title: "Analytics Dashboard",
      description: "Comprehensive insights into platform usage and metrics",
      details: "User stats, message analytics, revenue tracking, and growth metrics"
    },
    {
      icon: "👥",
      title: "User Management",
      description: "Manage all platform users and their activities",
      details: "View user profiles, message history, and account details"
    },
    {
      icon: "🛡️",
      title: "Content Moderation",
      description: "Oversight tools for platform safety and quality",
      details: "AI-powered content filtering with manual review capabilities"
    },
    {
      icon: "⚙️",
      title: "System Health",
      description: "Monitor platform performance and uptime",
      details: "Real-time alerts, performance metrics, and error tracking"
    },
    {
      icon: "💾",
      title: "Data Management",
      description: "Export data, backup systems, and data analytics",
      details: "Comprehensive data tools for business intelligence"
    },
    {
      icon: "🚀",
      title: "Quick Actions",
      description: "Fast access to common administrative tasks",
      details: "One-click actions for user support and system management"
    }
  ]

  const coreFeatures = [
    {
      icon: "🤖",
      title: "Advanced AI Technology",
      description: "State-of-the-art machine learning creates personalized experiences",
      stats: "99.9% accuracy in emotional content generation"
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level encryption and security for all your memories",
      stats: "256-bit AES encryption with zero-knowledge architecture"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Optimized performance for instant loading and smooth playback",
      stats: "<2 second load times globally with CDN optimization"
    },
    {
      icon: "🌍",
      title: "Global Accessibility",
      description: "Available worldwide with multi-language support",
      stats: "99.99% uptime across 6 continents"
    }
  ]

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <CinematicBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 pt-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Powerful <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Features</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8">
              Everything you need to create, share, and experience unforgettable digital memories
            </p>
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
              From AI-powered personalization to enterprise-grade security, AsAlways provides 
              comprehensive tools for preserving life's most precious moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Core Technology</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built on cutting-edge technology for unmatched performance and reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="memory-card p-8 text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{feature.description}</p>
                <p className="text-xs text-pink-500 font-semibold">{feature.stats}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sender Features Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-pink-500/20 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">💌</span>
              <span className="text-pink-500 font-semibold">For Senders</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Creation Tools</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful and intuitive tools to craft beautiful memory experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {senderFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="memory-card p-8 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{feature.description}</p>
                    <p className="text-xs text-white/50">{feature.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Receiver Features Section */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-violet-500/20 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">💝</span>
              <span className="text-violet-500 font-semibold">For Receivers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Experience Features</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Immersive and emotional journey through personalized memory experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {receiverFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="memory-card p-8 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{feature.description}</p>
                    <p className="text-xs text-white/50">{feature.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Features Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-blue-500/20 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">⚙️</span>
              <span className="text-blue-500 font-semibold">Admin Panel</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Management Tools</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive administrative dashboard for platform oversight and control
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="memory-card p-8 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{feature.description}</p>
                    <p className="text-xs text-white/50">{feature.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Technical Specs</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built with modern technology stack for optimal performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="memory-card p-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Frontend Technologies</h3>
              <div className="space-y-4">
                {[
                  { tech: "Next.js 14", desc: "React framework with App Router" },
                  { tech: "TypeScript", desc: "Type-safe development" },
                  { tech: "Tailwind CSS", desc: "Utility-first styling" },
                  { tech: "Framer Motion", desc: "Smooth animations" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white font-semibold">{item.tech}</span>
                    <span className="text-white/60 text-sm">{item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="memory-card p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Backend & Infrastructure</h3>
              <div className="space-y-4">
                {[
                  { tech: "Next.js API Routes", desc: "Serverless functions" },
                  { tech: "Prisma ORM", desc: "Database management" },
                  { tech: "SQLite/PostgreSQL", desc: "Flexible database options" },
                  { tech: "Vercel/Railway", desc: "Cloud deployment" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white font-semibold">{item.tech}</span>
                    <span className="text-white/60 text-sm">{item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="memory-card p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Experience All These Features
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Start creating beautiful memory experiences today with all features included for free
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/role-selection"
                className="btn-primary text-lg px-8 py-4 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Start Creating Free
              </motion.a>
              <motion.a
                href="/help"
                className="btn-secondary text-lg px-8 py-4 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ❓ Get Help
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}