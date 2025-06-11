import express from 'express'
import { body } from 'express-validator'
import { protectRoute } from '../middlewares/auth.middleware.js'
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
} from '../controllers/auth.controller.js'
const router = express.Router()
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('fullName')
      .isString()
      .isLength({ min: 3 })
      .withMessage('first should be atleast 3 length require'),
    body('email').isEmail().withMessage('must be a valid email'),
    body('profilePic').optional().isURL().withMessage('must be a valid URL'),
    body('password').isLength({ min: 6 }).withMessage('must contain 6 length')
  ],
  signup
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('must contain 6 length')
  ],
  login
)

router.get('/logout', logout)

router.post('/update-profile', protectRoute, updateProfile)

router.get('/check', protectRoute, checkAuth)
export default router
