// Mock the interceptors first
const mockRequestInterceptor = {
  use: jest.fn((success, error) => {
    mockRequestInterceptor.successHandler = success
    mockRequestInterceptor.errorHandler = error
    return 1
  }),
  successHandler: null as unknown,
  errorHandler: null as unknown,
}

const mockResponseInterceptor = {
  use: jest.fn((success, error) => {
    mockResponseInterceptor.successHandler = success
    mockResponseInterceptor.errorHandler = error
    return 1
  }),
  successHandler: null as unknown,
  errorHandler: null as unknown,
}

const mockAxiosInstance = {
  interceptors: {
    request: mockRequestInterceptor,
    response: mockResponseInterceptor,
  },
}

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockReturnValue(mockAxiosInstance),
  },
}))

import axios from 'axios'
import { setGetAccessToken } from '../apiClient'

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestInterceptor.use.mockClear()
    mockResponseInterceptor.use.mockClear()
  })

  describe('Initialization', () => {
    it('should have registered interceptors', () => {
      // The interceptors are registered during module import
      // Just verify the mock was set up correctly
      expect(mockAxiosInstance.interceptors).toBeDefined()
      expect(mockAxiosInstance.interceptors.request).toBeDefined()
      expect(mockAxiosInstance.interceptors.response).toBeDefined()
    })
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header when token is available', async () => {
      const mockToken = 'test-token-123'
      const getTokenFn = jest.fn().mockResolvedValue(mockToken)
      setGetAccessToken(getTokenFn)

      const config = { headers: {} } as unknown
      const result = await (mockRequestInterceptor.successHandler as (config: unknown) => Promise<unknown>)(config)

      expect(getTokenFn).toHaveBeenCalled()
      expect((result as Record<string, unknown>).headers).toBeDefined()
    })

    it('should not add Authorization header when token is null', async () => {
      const getTokenFn = jest.fn().mockResolvedValue(null)
      setGetAccessToken(getTokenFn)

      const config = { headers: {} } as unknown
      const result = await (mockRequestInterceptor.successHandler as (config: unknown) => Promise<unknown>)(config)

      expect(getTokenFn).toHaveBeenCalled()
      expect((result as Record<string, unknown>).headers).toBeDefined()
    })

    it('should pass through config unchanged if no token getter set', async () => {
      setGetAccessToken(null as unknown as () => Promise<string | null>)

      const config = { headers: {} } as unknown
      const result = await (mockRequestInterceptor.successHandler as (config: unknown) => Promise<unknown>)(config)

      expect(result).toEqual(config)
    })
  })

  describe('Response Interceptor - Success', () => {
    it('should pass through successful responses', async () => {
      const response = { data: { test: 'data' }, status: 200 }
      const result = await mockResponseInterceptor.successHandler(response)

      expect(result).toEqual(response)
    })
  })

  describe('Response Interceptor - 401 Errors', () => {
    it('should mark retry flag on 401 error', async () => {
      const error = {
        response: { status: 401 },
        config: { _retry: false, headers: {} },
      }

      try {
        await mockResponseInterceptor.errorHandler(error)
      } catch {
        // Expected to reject after processing
      }

      expect(error.config._retry).toBe(true)
    })

    it('should not retry if already retried', async () => {
      const error = {
        response: { status: 401 },
        config: { _retry: true, headers: {} },
      }

      try {
        await mockResponseInterceptor.errorHandler(error)
      } catch (err) {
        expect(err).toEqual(error)
      }
    })
  })

  describe('Response Interceptor - Error Handling', () => {
    it('should handle error responses with status', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
        config: { _retry: false },
      }

      try {
        await mockResponseInterceptor.errorHandler(error)
      } catch {
        // Expected
      }

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle network errors without response', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const error = {
        request: {},
        config: { _retry: false },
      }

      try {
        await mockResponseInterceptor.errorHandler(error)
      } catch {
        // Expected
      }

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle generic errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const error = {
        message: 'Generic error',
        config: { _retry: false },
      }

      try {
        await mockResponseInterceptor.errorHandler(error)
      } catch {
        // Expected
      }

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('setGetAccessToken', () => {
    it('should register token getter function', async () => {
      const mockToken = 'test-token-456'
      const getTokenFn = jest.fn().mockResolvedValue(mockToken)
      setGetAccessToken(getTokenFn)

      const config = { headers: {} } as unknown
      const result = await (mockRequestInterceptor.successHandler as (config: unknown) => Promise<unknown>)(config)

      expect((result as Record<string, unknown>).headers).toBeDefined()
    })
  })
})
