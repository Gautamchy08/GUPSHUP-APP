import User from '../models/user.model.js'
import { settingCookie } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'
import { profile } from 'console'

export const signup = async (req, res) => {
  const { fullName, password, email, profilePic } = req.body

  // Basic validation

  try {
    console.log(fullName, password, email, profilePic)
    if (!fullName || !password || !email) {
      return res
        .status(400)
        .json({ message: 'fullName , email and  password are required' })
    }

    if (!password) res.status(400).json({ message: 'Password is required' })
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    const hashedPassword = await User.hashPassword(password)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic: profilePic ? profilePic : ''
    })
    if (newUser) {
      await newUser.save()
      const token = newUser.generateAuthToken()
      settingCookie(res, token)
      res.status(201).json({
        message: 'User registered successfully',
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token: token
      })
    } else {
      res.status(500).json({ message: 'Failed to create user' })
    }
  } catch (error) {
    console.error('Error during signup:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    // Generate JWT token
    const token = user.generateAuthToken()
    if (!token) {
      return res.status(500).json({ message: 'Failed to generate token' })
    }
    // Set the token in a cookie
    // Use the utility function to set the cookie
    settingCookie(res, token)

    res.status(200).json({
      message: 'Login successful',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token: token
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = (req, res) => {
  try {
    // Clear the cookie by setting it with an expired date
    res.cookie('jwt', '', {
      maxAge: 0
    })
    res.status(200).json({ message: 'LoggedOut successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body
  console.log('profile picture', profilePic)

  const userId = req.user._id // Assuming user ID setting is done in the auth middleware
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }
  if (!profilePic) {
    return res.status(400).json({ message: 'Profile picture URL is required' })
  }
  try {
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    )

    res
      .status(200)
      .json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const checkAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  res.status(200).json({
    message: 'User is authenticated',
    user: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      profilePic: req.user.profilePic
    }
  })
}
