import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

let authContextGetToken: (() => Promise<string | null>) | null = null

export const setGetAccessToken = (fn: () => Promise<string | null>) => {
  authContextGetToken = fn
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (authContextGetToken) {
      const token = await authContextGetToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh the token and retry
      if (authContextGetToken) {
        try {
          const newToken = await authContextGetToken()
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          }
        } catch (err) {
          // Token refresh failed, redirect to login
          window.location.href = '/login'
          return Promise.reject(err)
        }
      }

      // No token getter available, redirect to login
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Handle other error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || error.message
      console.error('API Error:', {
        status: error.response.status,
        message: errorMessage,
      })
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
