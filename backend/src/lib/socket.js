import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Used to store online users
const userSocketMap = {} // {userId: socketId}

export function recieverSocketId (userId) {
  return userSocketMap[userId]
}

io.on('connection', socket => {
  console.log('🔗 A user connected:', socket.id)

  const userId = socket.handshake.query.userId

  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socket.id
    console.log('📝 User mapped:', userId, '->', socket.id)
    console.log('👥 Current online users:', Object.keys(userSocketMap))
  }

  // Emit online users to all clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id)
    if (userId) {
      delete userSocketMap[userId]
      console.log('🔄 Updated online users:', Object.keys(userSocketMap))
      io.emit('getOnlineUsers', Object.keys(userSocketMap))
    }
  })
})

export { io, app, server }
