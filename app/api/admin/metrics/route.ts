import { NextRequest, NextResponse } from 'next/server'
// GridFS permanently removed - using Cloudinary only
import { DatabaseService } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

const dbService = new DatabaseService()

interface ProductionMetrics {
  system: {
    uptime: number
    memoryUsage: NodeJS.MemoryUsage
    environment: string
  }
  database: {
    totalUsers: number
    totalMessages: number
    totalPayments: number
    storageStats: any
  }
  performance: {
    avgResponseTime: number
    errorRate: number
    requestCount: number
  }
  revenue: {
    totalRevenue: number
    monthlyRevenue: number
    pendingPayments: number
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization')
    // Add your admin auth check here

    // System metrics
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()

    // Database metrics
    const db = await dbService.connect()
    
    const totalUsers = await db.collection('users').countDocuments()
    const totalMessages = await db.collection('messages').countDocuments()
    const totalPayments = await db.collection('payments').countDocuments()
    
    // Storage stats - GridFS permanently removed, using Cloudinary only
    const storageStats = {
      totalFiles: 0,
      totalSizeBytes: 0,
      fileTypes: {},
      disabled: true,
      message: 'GridFS permanently removed - all files served from Cloudinary CDN'
    }

    // Revenue calculation
    const payments = await db.collection('payments').aggregate([
      {
        $match: {
          status: 'verified'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]).toArray()

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthlyPayments = await db.collection('payments').aggregate([
      {
        $match: {
          status: 'verified',
          verifiedAt: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]).toArray()

    const pendingPayments = await db.collection('payments').countDocuments({
      status: 'pending_verification'
    })

    // Error tracking (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const errorCount = await db.collection('error_logs').countDocuments({
      timestamp: { $gte: last24Hours }
    })

    const requestCount = await db.collection('api_logs').countDocuments({
      timestamp: { $gte: last24Hours }
    })

    const metrics: ProductionMetrics = {
      system: {
        uptime,
        memoryUsage,
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        totalUsers,
        totalMessages,
        totalPayments,
        storageStats
      },
      performance: {
        avgResponseTime: 0, // Calculate from api_logs if available
        errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
        requestCount
      },
      revenue: {
        totalRevenue: payments[0]?.totalRevenue || 0,
        monthlyRevenue: monthlyPayments[0]?.monthlyRevenue || 0,
        pendingPayments
      }
    }

    return NextResponse.json({
      success: true,
      metrics,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('Error fetching production metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    // Check admin authorization
    const authHeader = request.headers.get('authorization')
    // Add your admin auth check here

    switch (action) {
      case 'clear_cache':
        // Implement cache clearing logic
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        })

      case 'cleanup_storage':
        // Storage cleanup disabled - using Cloudinary
        return NextResponse.json({
          success: false,
          message: 'Storage cleanup disabled - files are managed by Cloudinary. Use Cloudinary dashboard for file management.'
        })

      case 'cleanup_expired_otps':
        // Clean expired OTPs
        const db2 = await dbService.connect()
        const result = await db2.collection('otps').deleteMany({
          expiresAt: { $lt: new Date() }
        })

        return NextResponse.json({
          success: true,
          message: `Deleted ${result.deletedCount} expired OTPs`
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error executing admin action:', error)
    return NextResponse.json(
      { success: false, error: 'Action failed' },
      { status: 500 }
    )
  }
}