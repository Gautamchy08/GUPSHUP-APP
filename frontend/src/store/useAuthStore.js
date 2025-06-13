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
      console.log('user check status:', res.status)
      console.log(res.data)

      if (res.status === 200 && res.data) {
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
      if (res.status !== 201) {
        throw new Error('Failed to create account')
      }

      set({ authUser: res.data })
      toast.success('Account created successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get('/users/logout')
      set({ authUser: null })
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out')
    }
  },

  login: async data => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post('/users/login', data)
      if (res.status !== 200) {
        throw new Error('Failed to log in')
      }

      set({ authUser: res.data })
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  updateProfile: async data => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.post('/users/update-profile', data)
      if (res.status !== 200) {
        throw new Error('Failed to update profile')
      }

      set({ authUser: res.data })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false })
    }
  }
}))
