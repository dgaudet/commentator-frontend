/**
 * API Client Configuration - Dependency Injection Pattern
 * Allows environment-specific configuration to be injected at runtime
 *
 * Usage:
 * - Production: Uses getDefaultApiConfig() which reads from import.meta.env
 * - Tests: Inject custom config via createTestApiConfig()
 * - Development: Uses environment-specific .env file
 */

/**
 * API configuration interface
 */
export interface ApiConfig {
  baseUrl: string
}

/**
 * Get API configuration from environment variables
 * Reads VITE_API_BASE_URL from environment with fallback to localhost
 * Vite automatically injects VITE_* variables into process.env during build
 *
 * @returns API configuration with the configured base URL
 */
export function getDefaultApiConfig(): ApiConfig {
  const baseUrl = process.env.VITE_API_BASE_URL

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
