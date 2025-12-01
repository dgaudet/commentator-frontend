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
 * - Token caching optimization to avoid unnecessary getTokenSilently() calls
 *
 * Token Caching Optimization:
 * 1. AuthContext stores accessToken in state
 * 2. AuthContext syncs token state to apiClient cache via setCachedToken()
 * 3. Request interceptor uses cached token first (synchronous, fastest)
 * 4. Falls back to getTokenSilently() only if cache is invalid/expired
 * 5. Reduces async calls on every request, improving performance
 *
 * Authentication Flow:
 * 1. User logs in via Auth0
 * 2. AuthContext calls setGetAccessToken() with Auth0's token getter
 * 3. AuthContext syncs token to apiClient cache via setCachedToken()
 * 4. Request interceptor uses cached token for fastest performance
 * 5. Response interceptor handles 401 errors with refresh + retry
 * 6. All API requests automatically include JWT without component changes
 *
 * Usage:
 * import { apiClient, setGetAccessToken, setCachedToken } from './services/apiClient'
 *
 * // In AuthContext:
 * setGetAccessToken(() => auth0Client.getTokenSilently())
 * setCachedToken(token) // Called whenever accessToken state changes
 *
 * // In components:
 * const response = await apiClient.get('/classes') // Token attached automatically
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { env } from '../config/env'

// Callback to get access token from Auth context
let authContextGetToken: (() => Promise<string | null>) | null = null

// Token cache to avoid unnecessary getTokenSilently() calls
interface CachedToken {
  token: string
  expiresAt: number
}
let cachedToken: CachedToken | null = null

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
 * Update the cached token directly from AuthContext
 * Called when AuthContext's accessToken state changes to use cached token instead of calling getTokenSilently()
 *
 * Optimization: Allows apiClient to use the token directly on each request instead of making async calls
 *
 * @param token - The JWT token string
 * @param expiresIn - Token expiration time in seconds (default: 3600 = 1 hour)
 */
export const setCachedToken = (token: string | null, expiresIn: number = 3600) => {
  if (token) {
    cachedToken = {
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    }
  } else {
    cachedToken = null
  }
}

/**
 * Get the cached token if it's still valid, otherwise return null
 * Returns null if cache is expired or not set
 *
 * @returns Valid cached token or null
 */
function getCachedTokenIfValid(): string | null {
  if (!cachedToken) return null
  // Check if token is still valid (with 30 second buffer before actual expiration)
  if (Date.now() > cachedToken.expiresAt - 30000) {
    cachedToken = null
    return null
  }
  return cachedToken.token
}

/**
 * Get the base API URL from environment or use default
 */
function getBaseUrl(): string {
  if (env.baseUrl) {
    return env.baseUrl
  }

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
    // Optimization: Uses cached token from AuthContext when available, falls back to getTokenSilently()
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Strategy: Try cached token first (fastest), then fall back to getTokenSilently()
        let token: string | null = null

        // 1. Check if we have a valid cached token (from AuthContext state update)
        token = getCachedTokenIfValid()

        // 2. If no valid cached token, call getTokenSilently() to refresh
        if (!token && authContextGetToken) {
          try {
            token = await authContextGetToken()
            // Cache the refreshed token for subsequent requests to use
            if (token) {
              setCachedToken(token)
            }
          } catch (err) {
            console.error('Failed to get access token:', err)
            // Continue without token - backend will return 401
          }
        }

        // 3. Attach token if available
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
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
                // Cache the refreshed token for subsequent requests
                setCachedToken(newToken)
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
