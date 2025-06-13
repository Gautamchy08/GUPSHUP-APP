import axios from 'axios'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create(set => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/users/check')
      // console.log(res.data)
      if (res.status === 200 && res.data && res.data.email) {
        set({ authUser: res.data })
      } else {
        set({ authUser: null })
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async data => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/users/signup', data)
      set({ authUser: res.data })
      toast.success('Account created successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  }
}))
