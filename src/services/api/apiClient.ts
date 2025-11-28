/**
 * Base API Client for Backend Communication - Story 3.7: API Integration
 * Connects to existing API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 *
 * Features:
 * - Axios-based HTTP client
 * - Global error handling
 * - Configurable base URL from environment
 * - Type-safe request/response handling
 * - Automatic JWT token attachment to requests (Story 3.7)
 *
 * Authentication Flow:
 * 1. AuthContext calls setGetAccessToken() with Auth0's token getter
 * 2. Request interceptor automatically calls token getter for each request
 * 3. If token is available, adds "Authorization: Bearer <token>" header
 * 4. If token fetch fails, request proceeds without token (backend returns 401)
 * 5. Error interceptor formats responses consistently
 *
 * All API requests automatically include the JWT token without component code changes.
 */
import axios, { AxiosInstance, AxiosError } from 'axios'

// Get base URL from environment or use default
// Note: In real Vite app, use import.meta.env.VITE_API_BASE_URL
// For Jest compatibility, we use a helper function
function getBaseUrl(): string {
  // In browser/Vite, this would be import.meta.env.VITE_API_BASE_URL
  // For now, hardcoded for development
  return 'http://localhost:3000'
}

const BASE_URL = getBaseUrl()

// Callback to get access token from Auth context
let getAccessTokenFn: (() => Promise<string | null>) | null = null

/**
 * Register the function to retrieve access tokens from Auth context
 * Called by AuthContext after Auth0 is initialized
 */
export const setGetAccessToken = (fn: () => Promise<string | null>) => {
  getAccessTokenFn = fn
}

/**
 * Base API client class for backend communication
 */
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    })

    // Request interceptor: Attach JWT token to all requests
    this.client.interceptors.request.use(
      async (config) => {
        if (getAccessTokenFn) {
          try {
            const token = await getAccessTokenFn()
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch (err) {
            console.error('Failed to get access token:', err)
          }
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor: Handle global errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle common error scenarios
        const errorData = error.response?.data as Record<string, unknown> | undefined

        // Format error as Error object for consistent handling
        const apiError = new Error((errorData?.error as string) || (errorData?.message as string) || 'An error occurred')
        // Add additional properties to the error
        Object.assign(apiError, {
          status: error.response?.status,
          message: (errorData?.error as string) || (errorData?.message as string) || 'An error occurred',
          details: errorData?.details || null,
        })

        return Promise.reject(apiError)
      },
    )
  }

  get<T>(...args: Parameters<AxiosInstance['get']>) {
    return this.client.get<T>(...args)
  }

  post<T>(...args: Parameters<AxiosInstance['post']>) {
    return this.client.post<T>(...args)
  }

  put<T>(...args: Parameters<AxiosInstance['put']>) {
    return this.client.put<T>(...args)
  }

  delete<T>(...args: Parameters<AxiosInstance['delete']>) {
    return this.client.delete<T>(...args)
  }
}

export const apiClient = new ApiClient()
