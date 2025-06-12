import cloudinary from 'cloudinary'

import User from '../models/user.model.js'
import Message from '../models/message.model.js'

export const getUsersForSidebar = async (req, res) => {
  // Fetch all users except the currently logged-in user
  try {
    const loggedInUserId = req.user._id
    if (!loggedInUserId) {
      return res.status(400).json({ message: 'User not authenticated' })
    }
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }
    }).select('-password') // Select only necessary fields

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error('Error fetching users for sidebar:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params
  const myId = req.user._id

  if (!myId) {
    return res.status(400).json({ message: 'User not authenticated' })
  }

  try {
    // Fetch messages between the logged-in user and the specified user
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId }
      ]
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Error fetching messages from controller:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { id: recieverId } = req.params
    // Validate sender and receiver IDs
    {
      const senderId = req.user._id
      if (!senderId) {
        return res.status(400).json({ message: 'User not authenticated' })
      }
      if (!recieverId) {
        return res.status(400).json({ message: 'Receiver ID is required' })
      }
      if (senderId === recieverId) {
        return res
          .status(400)
          .json({ message: 'Cannot send message to yourself' })
      }
    }
    const { text, image } = req.body
    if (!text && !image) {
      return res.status(400).json({ message: 'Text or image is required' })
    }
    // Validate text and image
    let imageUrl
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }
    // socket io code to emit the message can be added here if needed

    // Create a new message
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl
    })

    await newMessage.save()
    res.status(201).json(newMessage)
  } catch (err) {
    console.error('Error sending message:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
