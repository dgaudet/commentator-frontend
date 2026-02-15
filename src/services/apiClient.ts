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
import { getDefaultApiConfig } from '../config/apiConfig'

// Callback to get access token from Auth context
let authContextGetToken: (() => Promise<string | null>) | null = null

// Token cache to avoid unnecessary getTokenSilently() calls
interface CachedToken {
  token: string
  expiresAt: number
}
let cachedToken: CachedToken | null = null

// Public endpoints that don't require authentication
let publicEndpoints: string[] = []

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
 * Configure endpoints that do not require authentication
 * Prevents unnecessary token retrieval for public endpoints like user signup
 *
 * Optimization: Skips getTokenSilently() calls for endpoints that don't need authorization,
 * reducing latency and avoiding token-fetch errors for unauthenticated flows
 *
 * @param endpoints - Array of endpoint paths (e.g., ['/api/users/create']) or null to clear
 *
 * @example
 * // Configure public endpoints
 * setPublicEndpoints(['/api/users/create', '/api/auth/refresh'])
 *
 * // Clear public endpoints configuration
 * setPublicEndpoints(null)
 */
export const setPublicEndpoints = (endpoints: string[] | null) => {
  if (endpoints === null) {
    publicEndpoints = []
  } else {
    publicEndpoints = endpoints
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
 * Check if a request path is marked as a public endpoint
 * @param path - Request path (e.g., '/api/users/create')
 * @returns True if the endpoint is public and doesn't need authentication
 */
function isPublicEndpoint(path: string): boolean {
  return publicEndpoints.some((endpoint) => {
    // Support wildcard patterns like '/api/public/*'
    if (endpoint.endsWith('*')) {
      const prefix = endpoint.slice(0, -1) // Remove the '*'
      return path.startsWith(prefix)
    }
    // Exact match
    return path === endpoint
  })
}

/**
 * Get the base API URL from configuration
 */
function getBaseUrl(): string {
  return getDefaultApiConfig().baseUrl
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
      timeout: 60000, // 10 seconds
    })

    // Request interceptor: Attach JWT token to all requests
    // Optimization: Uses cached token from AuthContext when available, falls back to getTokenSilently()
    // Also skips token retrieval for explicitly public endpoints to avoid unnecessary async calls
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // 0. Check if this is a public endpoint that doesn't require authentication
        const path = config.url || ''
        if (isPublicEndpoint(path)) {
          // Skip token retrieval for public endpoints
          return config
        }

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

        // Handle other error responses - preserve structured error format from backend
        const errorData = error.response?.data

        // If backend returns an object with error/details, preserve it as-is
        if (errorData && typeof errorData === 'object' && ('error' in errorData || 'message' in errorData)) {
          return Promise.reject(errorData)
        }

        // Fallback: Create structured error if backend doesn't provide one
        const errorMessage = (errorData && typeof errorData === 'object' && 'message' in errorData)
          ? (errorData.message as string)
          : error.message || 'An error occurred'

        const errorDetails = (errorData && typeof errorData === 'object' && 'details' in errorData)
          ? errorData.details
          : null

        const apiError = new Error(errorMessage)

        // Attach additional error properties for detailed error handling
        Object.assign(apiError, {
          status: error.response?.status,
          message: errorMessage,
          details: errorDetails,
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
