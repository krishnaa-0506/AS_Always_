import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { context, type = 'enhancement' } = body

    // Simple AI suggestions based on context
    const suggestions = {
      enhancement: [
        "Add more emotional depth to express your feelings",
        "Include specific memories that are meaningful to both of you", 
        "Consider adding a personal touch about their unique qualities",
        "Try to be more specific about what they mean to you",
        "Add details about shared experiences or inside jokes"
      ],
      emotional: [
        "Express how they make you feel in everyday moments",
        "Share what you've learned from them",
        "Mention how they've changed your life for the better",
        "Tell them about their impact on others around them"
      ],
      memory: [
        "Describe the setting and atmosphere of the memory",
        "Include sensory details - what you saw, heard, felt",
        "Explain why this moment was significant",
        "Connect the memory to your current relationship"
      ]
    }

    const selectedSuggestions = suggestions[type as keyof typeof suggestions] || suggestions.enhancement
    
    // Return 3 random suggestions
    const randomSuggestions = selectedSuggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    return NextResponse.json({ 
      success: true, 
      suggestions: randomSuggestions 
    })
  } catch (error) {
    console.error('AI Suggestions API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate suggestions' 
    }, { status: 500 })
  }
}