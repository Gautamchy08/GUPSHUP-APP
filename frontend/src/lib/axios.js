import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000' 
    : '', // Empty string for production, or your production API URL
  withCredentials: true
})
