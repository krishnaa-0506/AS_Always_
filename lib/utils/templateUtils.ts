// Template utility functions for the receiver experience

import { templates } from '../data/random-templates'

// Get a random template from available templates
export function getRandomTemplate() {
  const randomIndex = Math.floor(Math.random() * templates.length)
  return templates[randomIndex]
}

// Generate CSS variables from template
export function generateCSSVars(template: any) {
  // Default CSS variables if template doesn't have them
  const defaultVars = {
    '--template-primary': '#8B5CF6',
    '--template-secondary': '#EC4899',
    '--template-accent': '#F59E0B',
    '--template-text': '#FFFFFF',
    '--template-background': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    '--template-border-radius': '1rem',
    '--template-shadow': '0 10px 25px rgba(0,0,0,0.3)',
  }

  // If template has colorPalette, use it
  if (template?.colorPalette) {
    return {
      '--template-primary': template.colorPalette.primary || defaultVars['--template-primary'],
      '--template-secondary': template.colorPalette.secondary || defaultVars['--template-secondary'],
      '--template-accent': template.colorPalette.accent || defaultVars['--template-accent'],
      '--template-text': template.colorPalette.text || defaultVars['--template-text'],
      '--template-background': template.colorPalette.background || defaultVars['--template-background'],
      '--template-border-radius': template.layout?.borderRadius || defaultVars['--template-border-radius'],
      '--template-shadow': template.layout?.shadow || defaultVars['--template-shadow'],
    }
  }

  return defaultVars
}

// Get icon style for buttons
export function getIconStyle() {
  return 'mr-2 text-lg'
}