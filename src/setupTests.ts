/**
 * Jest Setup File
 * Runs before each test suite
 *
 * Configures:
 * - @testing-library/jest-dom matchers
 * - MSW (Mock Service Worker) with polyfills
 * - Cleanup hooks to prevent memory leaks (Story 2 optimization)
 *
 * Note: MSW setup is currently disabled due to Jest ESM compatibility issues
 * Tests that need API mocking should use jest.mock() for now
 */
import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextDecoder, TextEncoder } from 'util'
import { ReadableStream, TransformStream } from 'stream/web'

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
