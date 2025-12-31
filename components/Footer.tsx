'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Features',
      links: [
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Features', href: '/features' },
        { name: 'Get Started', href: '/role-selection' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Our Team', href: '#team' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#help' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Contact', href: 'mailto:hynextechnologies@gmail.com', external: true },
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Website', href: 'https://www.hynex.tech', external: true },
        { name: 'WhatsApp', href: 'https://wa.me/6379726858', external: true },
        { name: 'Email', href: 'mailto:hynextechnologies@gmail.com', external: true },
      ]
    }
  ]

  return (
    <footer className="relative bg-black/50 backdrop-blur-md border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/10 to-violet-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  AsAlways
                </div>
              </Link>
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                Creating lasting digital memories and emotional experiences for your loved ones. 
                Built with ❤️ by Hynex Technologies to preserve moments that matter most.
              </p>
            </motion.div>

            {/* Hynex Technologies Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse"></div>
              <span className="text-xs text-white/60">Powered by</span>
              <span className="text-sm font-semibold text-white/80">Hynex Technologies</span>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-white font-semibold text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link: any) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                      >
                        {link.name}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4 text-sm text-white/50">
            <span> {currentYear} AsAlways</span>
            <span>•</span>
            <span>A Hynex Technologies Product</span>
            <span>•</span>
            <span>Made with ❤️ for lasting memories</span>
            <span>•</span>
            <a href="https://www.hynex.tech" className="hover:text-white/70 transition-colors">www.hynex.tech</a>
            <span>•</span>
            <a href="tel:+6379726858" className="hover:text-white/70 transition-colors">+6379726858</a>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="text-white/50 hover:text-white/70 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white/70 text-sm transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-white/50 hover:text-white/70 text-sm transition-colors">
              Cookies
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-white/50">All systems operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}