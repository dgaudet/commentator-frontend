/**
 * Base API Client for Backend Communication
 * Connects to existing API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 *
 * Features:
 * - Axios-based HTTP client
 * - Global error handling
 * - Configurable base URL from environment
 * - Type-safe request/response handling
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

  delete(...args: Parameters<AxiosInstance['delete']>) {
    return this.client.delete(...args)
  }
}

export const apiClient = new ApiClient()
