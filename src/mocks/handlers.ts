/**
 * Mock Service Worker (MSW) Request Handlers
 * Defines mock API responses for testing
 *
 * These handlers will be fully implemented in TASK-1.4
 * Current version provides minimal setup for TASK-1.3 completion
 */
import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:3000'

/**
 * API request handlers
 * Full implementation will be added in TASK-1.4
 */
export const handlers = [
  // Placeholder handler - will be expanded in TASK-1.4
  http.get(`${BASE_URL}/health`, () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
