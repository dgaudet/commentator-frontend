/**
 * API Client Configuration - Dependency Injection Pattern
 * Allows environment-specific configuration to be injected at runtime
 *
 * Implementation Details:
 * - vite.config.ts strips the VITE_ prefix and defines variables via the 'define' option
 * - VITE_API_BASE_URL from .env becomes process.env.API_BASE_URL in code
 * - This approach works consistently across dev (Vite dev server) and build (Vite bundling)
 * - Tests: setupTests.ts sets process.env.API_BASE_URL from VITE_API_BASE_URL
 *
 * Usage:
 * - Production: getDefaultApiConfig() reads process.env.API_BASE_URL (defined by Vite)
 * - Development: getDefaultApiConfig() reads process.env.API_BASE_URL (defined by Vite)
 * - Tests: getDefaultApiConfig() reads process.env.API_BASE_URL (set by setupTests.ts)
 * - Custom: Use createTestApiConfig() to inject test-specific configuration
 */

/**
 * API configuration interface
 */
export interface ApiConfig {
  baseUrl: string
}

/**
 * Get API configuration from environment variables
 *
 * Reads the API base URL from process.env.API_BASE_URL, which is populated by:
 * - Vite's 'define' option (dev/build): transforms VITE_API_BASE_URL from .env
 * - setupTests.ts (tests): sets from VITE_API_BASE_URL
 *
 * Falls back to 'http://localhost:3000' if not configured
 *
 * @returns API configuration with the configured base URL
 *
 * @example
 * // In production (.env.production):
 * // VITE_API_BASE_URL=https://api.example.com
 * getDefaultApiConfig() // Returns { baseUrl: 'https://api.example.com' }
 *
 * @example
 * // In development (.env):
 * // VITE_API_BASE_URL=http://localhost:3001
 * getDefaultApiConfig() // Returns { baseUrl: 'http://localhost:3001' }
 */
export function getDefaultApiConfig(): ApiConfig {
  const baseUrl = process.env.API_BASE_URL

  return {
    baseUrl: baseUrl || 'http://localhost:3000',
  }
}

/**
 * Create a test configuration for use in tests
 *
 * @param overrides - Partial config to override defaults
 * @returns Test API configuration
 */
export function createTestApiConfig(overrides?: Partial<ApiConfig>): ApiConfig {
  return {
    baseUrl: 'http://localhost:3000',
    ...overrides,
  }
}
