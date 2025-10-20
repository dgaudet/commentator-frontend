/**
 * Mock Service Worker (MSW) Server Setup
 * Used for mocking API calls in tests
 *
 * This server intercepts network requests during tests and returns mock responses
 * Reference: https://mswjs.io/docs/
 *
 * Note: Using MSW v2.x syntax
 */
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server instance
 * Configured with all API handlers for testing
 */
export const server = setupServer(...handlers)
