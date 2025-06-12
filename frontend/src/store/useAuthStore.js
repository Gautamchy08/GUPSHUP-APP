import axios from 'axios'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'

export const useAuthStore = create(set => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/users/check')
      console.log(res.data)
      if (res.status === 200 && res.data && res.data.email) {
        set({ authUser: res.data })
      } else {
        set({ authUser: null })
      }
    } catch (error) {
      console.error(
        'Error checking authentication:',
        error.response.data?.message || error.message
      )
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  }
}))
