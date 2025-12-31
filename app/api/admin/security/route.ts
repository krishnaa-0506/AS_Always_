import { NextRequest, NextResponse } from 'next/server'
import { EnvironmentValidator } from '../../../../lib/utils/environment'
import { authService } from '../../../../lib/auth/jwt'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const user = await authService.authenticateRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const configStatus = EnvironmentValidator.getConfigurationStatus()
    const validationErrors = EnvironmentValidator.validateAll()

    // Security summary
    const totalVars = Object.keys(configStatus).length
    const configuredVars = Object.values(configStatus).filter(v => v.configured).length
    const secureVars = Object.values(configStatus).filter(v => v.secure).length

    const security = {
      totalVariables: totalVars,
      configured: configuredVars,
      secure: secureVars,
      configurationRate: Math.round((configuredVars / totalVars) * 100),
      securityRate: Math.round((secureVars / totalVars) * 100),
      isProductionReady: validationErrors.length === 0 && secureVars === totalVars
    }

    return NextResponse.json({
      success: true,
      data: {
        security,
        configuration: configStatus,
        validationErrors,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        recommendations: generateSecurityRecommendations(configStatus, validationErrors)
      }
    })

  } catch (error) {
    console.error('Security audit error:', error)
    return NextResponse.json(
      { success: false, error: 'Security audit failed' },
      { status: 500 }
    )
  }
}

function generateSecurityRecommendations(
  configStatus: Record<string, { configured: boolean; secure: boolean; description: string }>,
  errors: { variable: string; issue: string }[]
): string[] {
  const recommendations: string[] = []

  // Check for missing required variables
  const missing = Object.entries(configStatus)
    .filter(([_, status]) => !status.configured)
    .map(([name]) => name)

  if (missing.length > 0) {
    recommendations.push(`Configure missing environment variables: ${missing.join(', ')}`)
  }

  // Check for insecure configurations
  const insecure = Object.entries(configStatus)
    .filter(([_, status]) => status.configured && !status.secure)
    .map(([name]) => name)

  if (insecure.length > 0) {
    recommendations.push(`Strengthen insecure variables: ${insecure.join(', ')}`)
  }

  // Check for production readiness
  if (process.env.NODE_ENV === 'production' && errors.length > 0) {
    recommendations.push('Fix all validation errors before production deployment')
  }

  // Database security
  if (configStatus.MONGODB_URI?.configured && process.env.MONGODB_URI?.includes('localhost')) {
    recommendations.push('Use MongoDB Atlas or secured MongoDB instance for production')
  }

  // File storage security
  if (configStatus.CLOUDINARY_API_SECRET?.configured) {
    recommendations.push('Rotate Cloudinary API secrets regularly')
  }

  // General security
  recommendations.push('Use environment-specific .env files')
  recommendations.push('Never commit .env files to version control')
  recommendations.push('Use secrets management service in production')

  return recommendations
}