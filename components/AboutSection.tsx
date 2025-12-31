'use client'

import { motion } from 'framer-motion'

export default function AboutSection() {
  const teamMembers = [
    {
      name: 'Hari Krishna',
      role: 'Founder & CEO',
      icon: '👨💼',
      description: 'Visionary leader passionate about human connections'
    },
    {
      name: 'Hari Raj',
      role: 'Co-Founder & CTO',
      icon: '👨💻',
      description: 'AI specialist bringing emotions to technology'
    },
    {
      name: 'Sarvesh',
      role: 'Project Managing Director',
      icon: '👨📊',
      description: 'Creating beautiful experiences that matter'
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* About Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About AsAlways
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We believe every moment matters. AsAlways transforms your precious memories 
            into cinematic experiences that last forever.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-4">Our Team</h3>
          <p className="text-white/60 text-center mb-12">
            A passionate group of creators, innovators, and dreamers working to preserve human connections
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="glass-panel p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-6xl mb-4">{member.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                <p className="text-pink-400 font-medium mb-3">{member.role}</p>
                <p className="text-white/70 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="glass-panel p-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mx-auto">
            In a world where digital connections often feel shallow, we're building something deeper. 
            AsAlways uses cutting-edge AI to transform your memories into personalized, emotional experiences 
            that strengthen the bonds between people who matter most.
          </p>
        </motion.div>
      </div>
    </section>
  )
}