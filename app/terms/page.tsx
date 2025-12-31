'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function TermsPage() {
  const lastUpdated = "January 2026"

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using AsAlways ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

These Terms of Service ("Terms") are a binding contract between you and Hynex Technologies ("Company", "we", "us", or "our") regarding your use of the AsAlways platform and services.`
    },
    {
      title: "2. Service Description",
      content: `AsAlways is a digital memory platform that allows users to create, share, and experience personalized emotional content through AI-generated screens, multimedia uploads, and cinematic presentations.

Our service includes:
• Memory creation and sharing tools
• AI-powered content generation
• Secure storage and sharing
• Multi-media support (photos, videos, audio, text)
• Cross-platform accessibility`
    },
    {
      title: "3. User Accounts and Registration",
      content: `To use certain features of AsAlways, you must register for an account. You agree to:
• Provide accurate, current, and complete information during registration
• Maintain the security of your password and identification
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized access

We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, especially if we suspect fraudulent, abusive, or illegal activity.`
    },
    {
      title: "4. User Content and Conduct",
      content: `You retain ownership of content you upload to AsAlways ("User Content"). By uploading content, you grant us:
• A worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content solely for providing the Service
• The right to process your content through our AI systems for screen generation

You agree NOT to upload content that:
• Violates any law or regulation
• Infringes on intellectual property rights
• Contains malicious code or spam
• Is defamatory, threatening, or harassing
• Contains explicit or inappropriate material (as determined by us)

We reserve the right to remove any content that violates these terms.`
    },
    {
      title: "5. Privacy and Data Protection",
      content: `Your privacy is important to us. Our Privacy Policy, which describes how we collect, use, and protect your information, applies to your use of the Service and is incorporated into these Terms by reference.

Key privacy commitments:
• We use industry-standard encryption to protect your data
• We never sell your personal information to third parties
• You can delete your account and data at any time
• We comply with applicable data protection laws including GDPR and CCPA`
    },
    {
      title: "6. Free Service Terms",
      content: `AsAlways is a completely free service with no subscription fees:

Free Service:
• All features are available at no cost
• No payment information required
• No subscription management needed
• Service funded through other means

Service Access:
• Available to all users without payment
• No usage restrictions based on payment tiers
• Features available immediately upon account creation
• Your data remains accessible as long as you use the service`
    },
    {
      title: "7. Intellectual Property Rights",
      content: `AsAlways and its original content, features, and functionality are owned by Hynex Technologies and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

Our AI Technology:
• Our AI algorithms and screen generation technology are proprietary
• You may not reverse engineer, decompile, or attempt to extract our AI models
• Generated screens are created specifically for you but use our proprietary AI technology

Trademarks:
• "AsAlways" and related marks are trademarks of Hynex Technologies
• You may not use our trademarks without express written permission`
    },
    {
      title: "8. Service Availability and Modifications",
      content: `We strive to maintain high service availability but cannot guarantee uninterrupted access:

Service Levels:
• We target 99.9% uptime for paid subscribers
• Maintenance windows will be announced in advance when possible
• We are not liable for service interruptions beyond our reasonable control

Modifications:
• We may modify or discontinue features with reasonable notice
• Major changes to core functionality will include 30 days notice
• We reserve the right to modify these Terms with notice`
    },
    {
      title: "9. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

• THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND
• WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED
• OUR LIABILITY IS LIMITED TO THE AMOUNT YOU PAID FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM
• WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
• WE ARE NOT RESPONSIBLE FOR LOSS OF DATA, THOUGH WE IMPLEMENT REASONABLE BACKUP PROCEDURES

Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so these limitations may not apply to you.`
    },
    {
      title: "10. Dispute Resolution",
      content: `For any disputes arising from these Terms or the Service:

Informal Resolution:
• Please contact us first at support@asalways.com to resolve issues informally
• We commit to responding within 48 hours and working toward resolution

Binding Arbitration:
• If informal resolution fails, disputes will be resolved through binding arbitration
• Arbitration will be conducted under the rules of the American Arbitration Association
• Arbitration will take place in [Your Jurisdiction]
• Class action lawsuits are waived

Small Claims Court:
• You may pursue claims in small claims court if they qualify`
    },
    {
      title: "11. Termination",
      content: `Either party may terminate this agreement:

You may terminate by:
• Deleting your account
• Ceasing to use the Service

We may terminate or suspend your account for:
• Violation of these Terms
• Suspected fraudulent or illegal activity
• Extended periods of inactivity

Upon termination:
• Your access to the Service will cease
• Your data will be available for download for 30 days
• We may delete your data after the retention period`
    },
    {
      title: "12. General Provisions",
      content: `Governing Law: These Terms are governed by the laws of [Your State/Country] without regard to conflict of law principles.

Severability: If any provision is found unenforceable, the remainder of these Terms will remain in effect.

Entire Agreement: These Terms constitute the entire agreement between you and Hynex Technologies regarding the Service.

Assignment: We may assign these Terms to any affiliate or successor. You may not assign your rights without our consent.

Force Majeure: We are not liable for delays or failures due to circumstances beyond our reasonable control.

Contact Information:
Hynex Technologies
Email: legal@hynextech.com
Address: [Your Business Address]`
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-950/20 to-black">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-xl text-white/70 mb-4">
              Last updated: {lastUpdated}
            </p>
            <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using AsAlways. By using our service, 
              you agree to be bound by these terms and conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="memory-card p-8 md:p-12 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Welcome to AsAlways, a digital memory platform operated by Hynex Technologies. 
                These Terms of Service govern your use of our website, services, and applications. 
                By accessing or using AsAlways, you agree to comply with and be bound by these terms.
              </p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl mt-1">⚠️</span>
                  <div>
                    <h3 className="text-yellow-400 font-semibold mb-2">Important Notice</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      These terms include important information about your rights and obligations, 
                      including limitation of liability and dispute resolution procedures. 
                      Please read them carefully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className="memory-card p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-4">
                  {section.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            className="memory-card p-8 mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Questions About These Terms?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                <div className="space-y-3 text-white/70">
                  <div className="flex items-center gap-3">
                    <span className="text-pink-500">📧</span>
                    <span>legal@hynextech.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-violet-500">💬</span>
                    <span>support@asalways.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500">🌐</span>
                    <a href="/contact" className="hover:text-white transition-colors">
                      Contact Form
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <div>
                    <a 
                      href="/privacy" 
                      className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="text-green-500">🔒</span>
                      Privacy Policy
                    </a>
                  </div>
                  <div>
                    <a 
                      href="/about" 
                      className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="text-purple-500">ℹ️</span>
                      About Us
                    </a>
                  </div>
                  <div>
                    <a 
                      href="/features" 
                      className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="text-orange-500">✨</span>
                      Features
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Last Updated Notice */}
          <motion.div
            className="text-center mt-12 p-6 bg-white/5 rounded-lg border border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-white/60 text-sm">
              These Terms of Service were last updated on {lastUpdated}. 
              We may update these terms from time to time, and will notify users of significant changes.
            </p>
            <p className="text-white/50 text-xs mt-2">
              &copy; 2025 Hynex Technologies. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}