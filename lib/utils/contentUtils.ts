/**
 * Utility functions for handling HTML entities and content display
 */

/**
 * Decode HTML entities for display in React components
 * Use this for any content that will be displayed to users
 */
export function decode(text: string): string {
  if (!text) return ''
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&') // This should be last
}

/**
 * Safely render text content with proper HTML entity decoding
 * Use this as a wrapper for any user-generated content
 */
export function safeRender(content: string): string {
  return decode(content)
}

/**
 * Check if a string contains HTML entities that need decoding
 */
export function needsDecoding(text: string): boolean {
  return /&#x27;|&quot;|&#x2F;|&lt;|&gt;|&amp;/.test(text)
}

/**
 * Format quotes for display (handle both single and double quotes)
 */
export function formatQuote(quote: string): string {
  const decoded = decode(quote)
  // Ensure proper quote formatting
  if (!decoded.startsWith('"') && !decoded.startsWith("'")) {
    return `"${decoded}"`
  }
  return decoded
}

// Legacy class export for backward compatibility
export class ContentUtils {
  static decode = decode
  static safeRender = safeRender
  static needsDecoding = needsDecoding
  static formatQuote = formatQuote
}