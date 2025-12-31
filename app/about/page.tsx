'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import CinematicBackground from '@/components/CinematicBackground'

export default function AboutPage() {
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
              About <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">AsAlways</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8">
              Creating lasting digital memories through the power of AI and human emotion
            </p>
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
              Born from the belief that every moment deserves to be remembered forever, AsAlways combines 
              cutting-edge technology with human emotion to create unforgettable digital experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Our Story</h2>
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  AsAlways was born from a simple yet profound realization: in our digital age, we capture more 
                  moments than ever before, but we often struggle to share them in truly meaningful ways.
                </p>
                <p>
                  We envisioned a platform that could transform ordinary photos, videos, and messages into 
                  extraordinary emotional journeys. Using advanced AI technology, we create personalized 
                  cinematic experiences that preserve not just the moment, but the feeling behind it.
                </p>
                <p>
                  Every memory shared on AsAlways is more than just content – it's a bridge between hearts, 
                  a way to say "I love you" that transcends time and distance.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="memory-card p-8 text-center">
                <div className="text-6xl mb-6">💝</div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-white/70 leading-relaxed">
                  To help people create and share emotional connections through beautifully crafted 
                  digital memories that last forever.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hynex Technologies Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Powered by <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">Hynex Technologies</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              The innovative technology company behind AsAlways, dedicated to creating meaningful digital experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">About Hynex Technologies</h3>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Hynex Technologies is a forward-thinking technology company founded on the principle 
                    that technology should enhance human connections, not replace them. We specialize in 
                    creating AI-powered platforms that bring people closer together.
                  </p>
                  <p>
                    Our team of passionate developers, designers, and AI specialists work tirelessly to 
                    build products that matter – products that create real value in people's lives and 
                    help preserve the moments that make us human.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="memory-card p-6 text-center">
                  <div className="text-3xl mb-3">🚀</div>
                  <h4 className="font-bold text-white mb-2">Innovation</h4>
                  <p className="text-white/60 text-sm">Cutting-edge AI and machine learning</p>
                </div>
                <div className="memory-card p-6 text-center">
                  <div className="text-3xl mb-3">💝</div>
                  <h4 className="font-bold text-white mb-2">Human-Centered</h4>
                  <p className="text-white/60 text-sm">Technology that enhances relationships</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="memory-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Our Core Values</h3>
                <div className="space-y-4">
                  {[
                    { icon: "🛡️", title: "Privacy First", desc: "Your memories are sacred and secure" },
                    { icon: "✨", title: "Quality Excellence", desc: "Every detail matters in preserving emotions" },
                    { icon: "🤝", title: "Human Connection", desc: "Technology should bring people closer" },
                    { icon: "🌍", title: "Global Impact", desc: "Connecting hearts across the world" }
                  ].map((value, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-2xl">{value.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white">{value.title}</h4>
                        <p className="text-white/60 text-sm">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Our Team</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              A passionate group of creators, innovators, and dreamers working to preserve human connections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Hari Krishna",
                role: "Founder & CEO",
                description: "Visionary leader passionate about human connections",
                icon: "👨‍💼"
              },
              {
                name: "Hari Raj",
                role: "Co-Founder & CTO", 
                description: "AI specialist bringing emotions to technology",
                icon: "👩‍💻"
              },
              {
                name: "Sarvesh",
                role: "Project Managing Director",
                description: "Creating beautiful experiences that matter",
                icon: "👨📊"
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="memory-card p-8 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="text-6xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-pink-500 font-semibold mb-4">{member.role}</p>
                <p className="text-white/70 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
              Ready to Create Lasting Memories?
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Join thousands of people who are already preserving their most precious moments with AsAlways
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/role-selection"
                className="btn-primary text-lg px-8 py-4 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Get Started Free
              </motion.a>

            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}