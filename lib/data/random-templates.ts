// Universal Template System for AsAlways - ONE Template, Many Appearances
// Clean and simple interface for the new system

export interface Template {
  id: string
  name: string
  category: string
  description: string
  emoji: string
  bgColor: string
  screenCount: number
  component: string
}

// Single universal template with 50 fake entries for system compatibility
export const templates: Template[] = Array.from({ length: 50 }, (_, index) => ({
  id: `universal-${index + 1}`,
  name: `Universal Magic ${index + 1}`,
  category: index < 15 ? 'romantic' : index < 30 ? 'family' : index < 40 ? 'friendship' : 'elegant',
  description: 'Universal template with 20 beautiful screens and adaptive colors',
  emoji: '✨',
  bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600',
  screenCount: 20,
  component: 'UniversalTemplate'
}))

// Export for API compatibility
export const ALL_TEMPLATES = templates

// Default export
export default templates