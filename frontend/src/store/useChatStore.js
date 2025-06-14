import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUser: async () => {
    try {
      set({ isUserLoading: true })
      const response = await axiosInstance.get('/messages/users')
      if (!response.data) {
        throw new Error('No user data found')
      }
      set({ users: response.data })
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch user data')
    } finally {
      set({ isUserLoading: false })
    }
  },

  getMessages: async userId => {
    try {
      set({ isMessagesLoading: true })
      console.log('id recieved in getMessages:', userId)

      const response = await axiosInstance.get(`/messages/${userId}`)
      if (response.status !== 200) {
        toast.error('Failed to fetch messages')
      }
      set({ messages: response.data })
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch messages')
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async messageData => {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      )
      set({ messages: [...messages, res.data] })
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  setSelectedUser: selectedUser => {
    set({ selectedUser })
  }
}))
