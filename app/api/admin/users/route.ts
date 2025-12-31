import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

// Simple admin authentication
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || '306206'

function authenticateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminCode = request.headers.get('x-admin-code')
  const adminCookie = request.cookies.get('asalways-admin')?.value
  
  return adminCookie === 'authenticated' || adminCode === ADMIN_SECRET_CODE || authHeader === `Bearer ${ADMIN_SECRET_CODE}`
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const { users, total } = await dbService.getUsers(limit, offset)
    
    // Get activity stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const { messages: userMessages } = await dbService.getMessages(user._id!.toString(), 100, 0)
        const sentMessages = userMessages.filter(m => m.senderId === user._id!.toString())
        const receivedMessages = userMessages.filter(m => m.receiverId === user._id!.toString())
        
        return {
          id: user._id,
          ...user,
          stats: {
            messagesSent: sentMessages.length,
            messagesReceived: receivedMessages.length,
            totalMessages: userMessages.length,
            lastActive: userMessages.length > 0 ? 
              new Date(Math.max(...userMessages.map(m => new Date(m.createdAt).getTime()))) : 
              user.createdAt
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { userId, action, data } = await request.json()
    
    if (!userId || !action) {
      return NextResponse.json({
        success: false,
        error: 'User ID and action are required'
      }, { status: 400 })
    }

    const user = await dbService.getUserById(userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    switch (action) {
      case 'block':
        await dbService.updateUser(userId, { status: 'blocked', blockedAt: new Date() })
        return NextResponse.json({
          success: true,
          message: `User ${user.name} has been blocked`
        })

      case 'unblock':
        await dbService.updateUser(userId, { status: 'active', blockedAt: null })
        return NextResponse.json({
          success: true,
          message: `User ${user.name} has been unblocked`
        })

      case 'update':
        if (!data) {
          return NextResponse.json({
            success: false,
            error: 'Update data is required'
          }, { status: 400 })
        }
        
        await dbService.updateUser(userId, data)
        return NextResponse.json({
          success: true,
          message: `User ${user.name} has been updated`
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const user = await dbService.getUserById(userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Get all messages related to this user
    const { messages } = await dbService.getMessages(userId, 1000, 0)
    
    // Delete all related data
    await Promise.all([
      // Delete messages where user is sender or receiver
      ...messages.map(msg => dbService.deleteMessage(msg._id!.toString())),
      // Delete the user
      dbService.deleteUser(userId)
    ])

    return NextResponse.json({
      success: true,
      message: `User ${user.name} and all related data have been deleted`,
      deletedMessages: messages.length
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 })
  }
}