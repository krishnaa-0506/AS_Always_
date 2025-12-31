import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { SecuritySanitizer } from '../security/sanitizer'

class WebSocketServer {
  private io: SocketIOServer | null = null
  private connectedUsers = new Map<string, string>() // userId -> socketId

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.io.on('connection', (socket) => {
      const sanitizedSocketId = SecuritySanitizer.sanitizeForLogs(socket.id)
      console.log('User connected:', sanitizedSocketId)

      socket.on('user:join', (userId: string) => {
        const sanitizedUserId = SecuritySanitizer.sanitizeForLogs(userId)
        this.connectedUsers.set(userId, socket.id)
        socket.join(`user:${userId}`)
      })

      socket.on('admin:join', () => {
        socket.join('admins')
      })

      socket.on('disconnect', () => {
        // Remove user from connected users
        for (const [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            this.connectedUsers.delete(userId)
            break
          }
        }
        const sanitizedSocketId = SecuritySanitizer.sanitizeForLogs(socket.id)
        console.log('User disconnected:', sanitizedSocketId)
      })
    })
  }

  notifyUser(userId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, data)
    }
  }

  notifyAdmins(event: string, data: any) {
    if (this.io) {
      this.io.to('admins').emit(event, data)
    }
  }

  broadcastProgress(messageId: string, progress: number, status: string) {
    if (this.io) {
      this.io.emit('generation:progress', { messageId, progress, status })
    }
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys())
  }
}

export const wsServer = new WebSocketServer()