/**
 * Jest Setup File
 * Runs before each test suite
 *
 * Configures:
 * - @testing-library/jest-dom matchers
 * - Mock Service Worker (MSW) setup (will be fully configured in TASK-1.4)
 */
import '@testing-library/jest-dom'

// MSW setup will be added in TASK-1.4 with proper polyfills
// For now, tests run without API mocking
