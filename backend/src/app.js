import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
const app = express()

dotenv.config()

app.use(express.json())
app.use(cookieParser()) // Middleware to parse cookies
connectDB()
// Serve static files from React frontend

app.get('/', (req, res) => {
  res.send(' gautam here')
})

app.use('/users', authRoutes)

export default app
