'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Footer from '@/components/Footer'
import CinematicBackground from '@/components/CinematicBackground'

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'creating', name: 'Creating Memories', icon: '✨' },
    { id: 'sharing', name: 'Sharing & Receiving', icon: '💝' },
    { id: 'account', name: 'Account & Billing', icon: '👤' },
    { id: 'technical', name: 'Technical Issues', icon: '🔧' },
    { id: 'privacy', name: 'Privacy & Security', icon: '🛡️' }
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'How to Create Your First Memory',
      category: 'getting-started',
      description: 'Step-by-step guide to creating your first emotional memory experience',
      readTime: '5 min read',
      popular: true
    },
    {
      id: 2,
      title: 'Understanding AI Screen Generation',
      category: 'creating',
      description: 'Learn how our AI creates 20 personalized screens from your memories',
      readTime: '3 min read',
      popular: true
    },
    {
      id: 3,
      title: 'Sharing Codes and Privacy',
      category: 'sharing',
      description: 'How sharing codes work and keeping your memories secure',
      readTime: '4 min read',
      popular: false
    },
    {
      id: 4,
      title: 'Uploading Photos and Videos',
      category: 'creating',
      description: 'Best practices for uploading media files and supported formats',
      readTime: '3 min read',
      popular: true
    },
    {
      id: 5,
      title: 'Managing Your Account',
      category: 'account',
      description: 'Update profile, change password, and manage account settings',
      readTime: '2 min read',
      popular: false
    },
    {
      id: 6,
      title: 'Troubleshooting Upload Issues',
      category: 'technical',
      description: 'Common solutions for file upload and processing problems',
      readTime: '4 min read',
      popular: false
    },
    {
      id: 7,
      title: 'Voice Recording Tips',
      category: 'creating',
      description: 'How to record high-quality voice messages for your memories',
      readTime: '3 min read',
      popular: false
    },
    {
      id: 8,
      title: 'Receiving Memory Experiences',
      category: 'sharing',
      description: 'Guide for receivers on how to view and interact with memories',
      readTime: '4 min read',
      popular: true
    },
    {
      id: 9,
      title: 'Data Protection and GDPR',
      category: 'privacy',
      description: 'How we protect your data and comply with privacy regulations',
      readTime: '6 min read',
      popular: false
    },
    {
      id: 10,
      title: 'Account and Service FAQ',
      category: 'account',
      description: 'Common questions about account management and free service',
      readTime: '5 min read',
      popular: true
    }
  ]

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: '💬',
      link: '/contact',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Report a Bug',
      description: 'Found an issue? Let us know',
      icon: '🐛',
      link: '/contact',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Feature Request',
      description: 'Suggest new features',
      icon: '💡',
      link: '/contact',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: '👥',
      link: '#',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularArticles = helpArticles.filter(article => article.popular)

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <CinematicBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 pt-32">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Help <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8">
              Everything you need to create amazing memory experiences
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-pink-500">📚</span>
                <span>{helpArticles.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-violet-500">⭐</span>
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">💬</span>
                <span>Live chat coming soon</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.link}
                className="memory-card p-6 text-center group block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                <p className="text-white/70 text-sm">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Popular Articles</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Most helpful articles to get you started quickly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                className="memory-card p-6 group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-pink-500/20 text-pink-500 px-3 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                  <div className="text-white/40 text-xs">{article.readTime}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{article.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Browse All Articles</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Find detailed guides and answers to all your questions
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                className="memory-card p-6 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/10 text-white/60 px-3 py-1 rounded-full text-xs">
                    {categories.find(cat => cat.id === article.category)?.name}
                  </div>
                  <div className="text-white/40 text-xs">{article.readTime}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{article.description}</p>
                <div className="mt-4 text-pink-500 text-sm font-semibold group-hover:text-pink-400 transition-colors">
                  Read more →
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-white/60">Try adjusting your search or category filter</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="memory-card p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Contact Support
              </motion.a>
              <motion.a
                href="/about"
                className="btn-secondary text-lg px-8 py-4 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📖 Learn More
              </motion.a>
            </div>
            <p className="text-white/50 text-sm mt-6">
              Average response time: 24 hours • Available 24/7
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}