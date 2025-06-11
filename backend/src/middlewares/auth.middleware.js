import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' })
  }
  //verify the token
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: 'Unauthorized, invalid token' })
    }
    const user = await User.findById(decoded._id).select('-password') // Exclude password from user object

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    req.user = user // Attach user info to request object

    next() // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error)
    res.status(403).json({ message: 'Forbidden, invalid token' })
  }
}
