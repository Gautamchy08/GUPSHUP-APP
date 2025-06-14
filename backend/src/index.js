import http from 'http'

import app from './app.js'
import { Server } from 'socket.io'
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})
const userSocketMap = {}
export function recieverSocketId (userId) {
  return userSocketMap[userId]
}

io.on('connection', socket => {
  console.log('a user connected:', socket.id)

  const userId = socket.handshake.query.UserId

  if (userId) {
    userSocketMap[userId] = socket.id
    console.log(`User ${userId} connected with socket ID: ${socket.id}`)
    console.log(userId ? userSocketMap : 'user id not found')
  }
  io.emit('getOnelineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    delete userSocketMap[userId]
    io.emit('getOnelineUsers', Object.keys(userSocketMap))
    console.log('user disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export { io, userSocketMap }
