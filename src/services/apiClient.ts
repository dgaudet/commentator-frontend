/**
 * Base API Client for Backend Communication - Story 3.7: API Integration
 * Consolidated from duplicate implementations into single class-based design
 *
 * Features:
 * - Axios-based HTTP client with class wrapper
 * - Automatic JWT token attachment to all requests
 * - Comprehensive error handling and retry logic
 * - Type-safe request/response handling
 * - 401 unauthorized retry with token refresh
 *
 * Authentication Flow:
 * 1. AuthContext calls setGetAccessToken() with Auth0's token getter
 * 2. Request interceptor automatically calls token getter for each request
 * 3. If token is available, adds "Authorization: Bearer <token>" header
 * 4. Response interceptor handles 401 errors with retry logic
 * 5. All API requests automatically include JWT without component code changes
 *
 * Usage:
 * import { apiClient, setGetAccessToken } from './services/apiClient'
 *
 * // In AuthContext:
 * setGetAccessToken(() => auth0Client.getTokenSilently())
 *
 * // In components:
 * const response = await apiClient.get('/classes')
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// Callback to get access token from Auth context
let authContextGetToken: (() => Promise<string | null>) | null = null

/**
 * Register the function to retrieve access tokens from Auth context
 * Called by AuthContext after Auth0 is initialized
 *
 * @param fn - Async function that returns JWT token or null
 */
export const setGetAccessToken = (fn: (() => Promise<string | null>) | null) => {
  authContextGetToken = fn
}

/**
 * Get the base API URL from environment or use default
 */
function getBaseUrl(): string {
  // Try Vite environment variable first (during runtime in browser/Vite)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = (globalThis as any).import?.meta
    if (meta?.env?.VITE_API_BASE_URL) {
      return meta.env.VITE_API_BASE_URL
    }
  } catch {
    // Ignore errors in Jest/Node environment
  }

  // Check process.env as fallback (Jest/Node)
  // if (process?.env?.VITE_API_BASE_URL) {
  //   return process.env.VITE_API_BASE_URL
  // }

  // Default to localhost for development
  return 'http://localhost:3000'
}

/**
 * Base API client class for backend communication
 * Provides methods for GET, POST, PUT, DELETE with automatic JWT attachment
 */
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: getBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    })

    // Request interceptor: Attach JWT token to all requests
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (authContextGetToken) {
          try {
            const token = await authContextGetToken()
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch (err) {
            console.error('Failed to get access token:', err)
            // Continue without token - backend will return 401
          }
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor: Handle errors and retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 errors (unauthorized) with retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          // Try to refresh the token and retry
          if (authContextGetToken) {
            try {
              const newToken = await authContextGetToken()
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return this.client(originalRequest)
              }
            } catch (err) {
              // Token refresh failed, redirect to login
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
              return Promise.reject(err)
            }
          }

          // No token getter available, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }

        // Handle other error responses
        const errorData = error.response?.data as Record<string, unknown> | undefined
        const apiError = new Error(
          (errorData?.message as string) || (errorData?.error as string) || error.message || 'An error occurred',
        )

        // Attach additional error properties for detailed error handling
        Object.assign(apiError, {
          status: error.response?.status,
          message: (errorData?.message as string) || (errorData?.error as string) || error.message,
          details: errorData?.details || null,
          originalError: error,
        })

        return Promise.reject(apiError)
      },
    )
  }

  /**
   * Perform GET request
   * @template T - Response data type
   */
  get<T = unknown>(...args: Parameters<AxiosInstance['get']>) {
    return this.client.get<T>(...args)
  }

  /**
   * Perform POST request
   * @template T - Response data type
   */
  post<T = unknown>(...args: Parameters<AxiosInstance['post']>) {
    return this.client.post<T>(...args)
  }

  /**
   * Perform PUT request
   * @template T - Response data type
   */
  put<T = unknown>(...args: Parameters<AxiosInstance['put']>) {
    return this.client.put<T>(...args)
  }

  /**
   * Perform DELETE request
   * @template T - Response data type
   */
  delete<T = unknown>(...args: Parameters<AxiosInstance['delete']>) {
    return this.client.delete<T>(...args)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Also export default for backwards compatibility
export default apiClient
