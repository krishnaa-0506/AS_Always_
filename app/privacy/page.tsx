'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  const lastUpdated = "January 2026"

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, information we obtain automatically when you use our services, and information from third parties.

Information You Provide:
• Account information (name, email, password)
• Profile information and preferences
• User content (photos, videos, audio recordings, text messages)
• No payment information (all services are free)
• Communications with our support team

Automatically Collected Information:
• Device information (IP address, browser type, operating system)
• Usage data (pages visited, features used, time spent)
• Technical data (error logs, performance metrics)
• Location information (general location based on IP address)

Third-Party Information:
• Social media profile information (when you connect accounts)
• Analytics and advertising partners (anonymized usage statistics)`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information to provide, maintain, and improve our services:

Service Delivery:
• Create and manage your account
• Process your memory creations and AI screen generation
• Enable sharing and viewing of memories
• Provide customer support and respond to inquiries

Service Improvement:
• Analyze usage patterns to improve our platform
• Develop new features and functionality
• Conduct research and analytics
• Ensure security and prevent fraud

Communication:
• Send service-related notifications
• Provide updates about new features
• Send promotional materials (with your consent)
• Respond to your questions and feedback

Legal and Safety:
• Comply with legal obligations
• Protect against harmful or illegal activity
• Enforce our Terms of Service
• Resolve disputes and investigate issues`
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

With Your Consent:
• When you explicitly authorize us to share information
• When you choose to share memories with others using our platform

Service Providers:
• Cloud storage providers (AWS, Google Cloud) with encryption
• Service providers for file storage and AI processing
• Email service providers for notifications
• Analytics providers (anonymized data only)

Legal Requirements:
• To comply with applicable laws and regulations
• To protect our rights, property, and safety
• To investigate potential violations of our terms

Business Transfers:
• In connection with mergers, acquisitions, or asset sales
• Your information may be transferred as part of business assets
• You will be notified of any such transfer

Never Shared:
• We never sell your personal data to advertisers
• We never share your private memories without permission
• We don't provide your information to data brokers`
    },
    {
      title: "4. Data Security and Protection",
      content: `We implement comprehensive security measures to protect your information:

Encryption:
• All data is encrypted in transit using TLS 1.3
• Data at rest is encrypted using AES-256 encryption
• Database encryption with rotating keys
• End-to-end encryption for sensitive content

Access Controls:
• Multi-factor authentication for employee access
• Role-based access permissions
• Regular access audits and reviews
• Secure development practices

Infrastructure Security:
• SOC 2 Type II compliant data centers
• Regular security audits and penetration testing
• 24/7 security monitoring and incident response
• Automated backup and disaster recovery systems

Data Minimization:
• We collect only necessary information
• Data is retained only as long as needed
• Regular data purging and cleanup
• Privacy-by-design architecture

However, no method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`
    },
    {
      title: "5. Your Privacy Rights and Choices",
      content: `You have several rights regarding your personal information:

Access and Portability:
• Request a copy of your personal data
• Download your memories and content
• Receive data in a machine-readable format
• Transfer data to another service (where technically feasible)

Correction and Updates:
• Update your account information anytime
• Correct inaccurate personal data
• Request updates to outdated information

Deletion Rights:
• Delete your account and all associated data
• Request removal of specific information
• Right to be forgotten (subject to legal requirements)
• Data is permanently deleted within 30 days

Control and Preferences:
• Opt out of promotional communications
• Control cookie preferences
• Manage notification settings
• Limit data processing (where applicable)

California Residents (CCPA):
• Right to know what personal information is collected
• Right to delete personal information
• Right to opt-out of sale of personal information
• Right to non-discrimination for exercising privacy rights

European Residents (GDPR):
• All CCPA rights plus additional protections
• Right to data portability
• Right to object to processing
• Right to restrict processing`
    },
    {
      title: "6. Cookies and Tracking Technologies",
      content: `We use cookies and similar technologies to enhance your experience:

Essential Cookies:
• Authentication and login management
• Security and fraud prevention
• Basic functionality and navigation
• Session management

Analytics Cookies:
• Usage statistics and performance metrics
• Error tracking and debugging
• Feature usage analysis
• A/B testing and optimization

Preference Cookies:
• Language and region settings
• Theme and display preferences
• Accessibility settings
• Personalization features

Third-Party Cookies:
• Google Analytics (anonymized data)
• Service providers for technology infrastructure
• Social media integration (when used)

Cookie Management:
• You can control cookies through browser settings
• Our cookie banner allows preference selection
• Some features may not work without essential cookies
• We respect Do Not Track signals where technically feasible`
    },
    {
      title: "7. Children's Privacy",
      content: `AsAlways is not intended for children under 13 years of age:

Age Requirements:
• Users must be at least 13 years old
• We do not knowingly collect information from children under 13
• Parental consent required for users 13-17 in some jurisdictions

If We Learn a Child Under 13 Has Provided Information:
• We will delete the information immediately
• We will terminate the account
• We will not use the information for any purpose
• We will notify parents if contact information is available

Parents and Guardians:
• May contact us to review their child's information
• Can request deletion of their child's data
• May restrict their child's use of our service
• Should monitor their child's online activities`
    },
    {
      title: "8. International Data Transfers",
      content: `AsAlways is operated from United States, but we serve users globally:

Data Processing Locations:
• Primary servers located in United States
• Backup and disaster recovery systems may be international
• Cloud providers may process data in multiple regions
• Support team may access data from various locations

Safeguards for International Transfers:
• Standard Contractual Clauses (SCCs) with processors
• Adequacy decisions where available
• Additional safeguards for sensitive personal data
• Regular compliance reviews and audits

EU-US Data Privacy Framework:
• We comply with applicable international frameworks
• Appropriate safeguards for cross-border transfers
• Your rights remain protected regardless of processing location

Your Rights:
• You can request information about data transfer locations
• You can object to transfers to certain countries
• We will inform you of any significant changes to transfer practices`
    },
    {
      title: "9. Data Retention",
      content: `We retain your information only as long as necessary:

Account Information:
• Retained while your account is active
• Deleted within 30 days after account deletion
• Some information may be retained for legal compliance
• Anonymized data may be retained for analytics

User Content:
• Your memories are stored as long as you choose to keep them
• Deleted content is permanently removed within 30 days
• Backup copies are securely deleted within 90 days
• You can download your content before deletion

User Account Information:
• Account details and preferences are retained while active
• Profile settings and configurations maintained
• Activity history preserved for service improvement
• You can delete your account and data at any time

Legal Requirements:
• Some data may be retained longer for legal compliance
• Law enforcement requests may require extended retention
• Tax and accounting records retained per regulations
• Dispute resolution may require temporary retention extensions`
    },
    {
      title: "10. Updates to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time:

Notification of Changes:
• Material changes will be communicated via email
• Non-material changes will be posted on our website
• We will update the "last modified" date
• Significant changes may require renewed consent

Types of Updates:
• Legal and regulatory compliance updates
• New feature additions requiring data processing
• Security enhancement notifications
• Business practice changes

Your Options:
• Review changes and decide whether to continue using our service
• Contact us with questions about changes
• Exercise your rights to modify or delete your data
• Opt-out of new data processing activities

Continued Use:
• Continued use after changes means acceptance of updated terms
• You can delete your account if you disagree with changes
• We will honor privacy preferences made under previous versions`
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
              Privacy <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-white/70 mb-4">
              Last updated: {lastUpdated}
            </p>
            <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
              Your privacy is fundamental to us. This policy explains how we collect, use, 
              and protect your information when you use AsAlways.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="memory-card p-8 md:p-12 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure by Design</h3>
                <p className="text-white/70 text-sm">End-to-end encryption and zero-knowledge architecture</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚫</div>
                <h3 className="text-lg font-semibold text-white mb-2">No Data Selling</h3>
                <p className="text-white/70 text-sm">We never sell your personal information to third parties</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-white mb-2">Full Control</h3>
                <p className="text-white/70 text-sm">Download, modify, or delete your data anytime</p>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl mt-1">🛡️</span>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2">Our Privacy Promise</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Your memories are sacred. We use military-grade encryption, never share your personal 
                    data without consent, and give you complete control over your information. 
                    We're GDPR and CCPA compliant, SOC 2 Type II certified, and committed to transparency.
                  </p>
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

          {/* Compliance Badges */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { label: "GDPR Compliant", icon: "🇪🇺", color: "blue" },
              { label: "CCPA Compliant", icon: "🇺🇸", color: "red" },
              { label: "SOC 2 Type II", icon: "🛡️", color: "green" },
              { label: "ISO 27001", icon: "🔒", color: "purple" }
            ].map((badge, index) => (
              <div key={badge.label} className="memory-card p-4 text-center">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="text-white font-semibold text-sm">{badge.label}</div>
              </div>
            ))}
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
              This Privacy Policy was last updated on {lastUpdated}. 
              We will notify you of any significant changes via email.
            </p>
            <p className="text-white/50 text-xs mt-2">
              © 2025 Hynex Technologies. Your privacy is our priority.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
