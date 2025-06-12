import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import messageRoutes from './routes/message.route.js'
import authRoutes from './routes/auth.route.js'
const app = express()

dotenv.config()
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

export default app
