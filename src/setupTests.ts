/**
 * Jest Setup File
 * Runs before each test suite
 *
 * Configures:
 * - @testing-library/jest-dom matchers
 * - MSW (Mock Service Worker) with polyfills
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
