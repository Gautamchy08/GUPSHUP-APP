import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import messageRoutes from './routes/message.route.js'
import authRoutes from './routes/auth.route.js'
import path from 'path'
const app = express()

dotenv.config()
const __dirname = path.resolve()
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  })
)
app.use(express.json())
app.use(cookieParser()) // Middleware to parse cookies
connectDB()
// Serve static files from React frontend

app.get('/', (req, res) => {
  res.send(' gautam here')
})

app.use('/users', authRoutes)
app.use('/messages', messageRoutes)

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../fronted', 'dist', 'index.html'))
  })
}

export default app
