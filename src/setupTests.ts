/**
 * Jest Setup File
 * Runs before each test suite
 *
 * Configures:
 * - @testing-library/jest-dom matchers
 * - MSW (Mock Service Worker) with polyfills
 * - Auth0Client mock for all tests
 * - import.meta.env polyfill for tests
 * - Cleanup hooks to prevent memory leaks (Story 2 optimization)
 *
 * Note: MSW setup is currently disabled due to Jest ESM compatibility issues
 * Tests that need API mocking should use jest.mock() for now
 */
import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextDecoder, TextEncoder } from 'util'
import { ReadableStream, TransformStream } from 'stream/web'

// Polyfill import.meta.env for Jest/Node environment
// Vite uses static replacement in browser, but Jest needs runtime access
if (typeof (globalThis as Record<string, unknown>).import === 'undefined') {
  ;(globalThis as Record<string, unknown>).import = {
    meta: {
      env: {
        VITE_AUTH0_DOMAIN: process.env.VITE_AUTH0_DOMAIN || 'test.auth0.com',
        VITE_AUTH0_CLIENT_ID: process.env.VITE_AUTH0_CLIENT_ID || 'test-client-id-12345',
        VITE_AUTH0_REDIRECT_URI: process.env.VITE_AUTH0_REDIRECT_URI || 'http://localhost:3000/callback',
        VITE_AUTH0_AUDIENCE: process.env.VITE_AUTH0_AUDIENCE || 'https://test-api',
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        MODE: 'test',
        DEV: false,
        PROD: false,
        SSR: false,
      },
    },
  }
}

// Mock Auth0Client to avoid HTTPS requirement in tests
jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    buildAuthorizeUrl: jest.fn().mockResolvedValue('https://test.auth0.com/authorize?code=test'),
    handleRedirectCallback: jest.fn().mockResolvedValue({ appState: { returnTo: '/dashboard' } }),
    isAuthenticated: jest.fn().mockResolvedValue(true),
    getUser: jest.fn().mockResolvedValue({
      sub: 'auth0|test-user',
      email: 'test@example.com',
      name: 'Test User',
    }),
    getTokenSilently: jest.fn().mockResolvedValue('test-token-123'),
    logout: jest.fn().mockResolvedValue(undefined),
    loginWithRedirect: jest.fn().mockResolvedValue(undefined),
  })),
}))

// Polyfill for MSW v2 in Jest/jsdom environment
// IMPORTANT: Must be set BEFORE importing MSW
// @ts-expect-error - TextEncoder type mismatch between util and lib.dom
global.TextEncoder = TextEncoder
// @ts-expect-error - TextDecoder type mismatch between util and lib.dom
global.TextDecoder = TextDecoder

// Polyfill ReadableStream for MSW v2
if (typeof global.ReadableStream === 'undefined') {
  // @ts-expect-error - ReadableStream type mismatch between stream/web and lib.dom
  global.ReadableStream = ReadableStream
}

// Polyfill TransformStream for MSW v2
if (typeof global.TransformStream === 'undefined') {
  // @ts-expect-error - TransformStream type mismatch between stream/web and lib.dom
  global.TransformStream = TransformStream
}

// TODO: Re-enable MSW when Jest ESM issues are resolved
// For now, tests will use jest.mock() for API mocking

/**
 * Memory optimization: Cleanup hooks (Story 2)
 *
 * Clear all mocks and timers after each test to prevent memory leaks.
 * This is particularly important for component tests that may leave
 * listeners, timers, or subscriptions attached.
 */
beforeEach(() => {
  // Clear all mock implementations and call histories
  jest.clearAllMocks()
})

afterEach(() => {
  // Clear all timers (setInterval, setTimeout, etc.)
  jest.clearAllTimers()

  // Clear all mock implementations and call histories
  jest.clearAllMocks()

  // Note: React Testing Library's cleanup() is called automatically
  // after each test due to setupFilesAfterEnv configuration
})
