/**
 * Auth0 Configuration - Dependency Injection Pattern
 * Allows environment-specific configuration to be injected at runtime
 *
 * Usage:
 * - Production: Uses getDefaultAuthConfig() which reads from import.meta.env
 * - Tests: Inject custom config via AuthProvider props
 * - Development: Can override config at runtime
 */

/**
 * Auth0 configuration interface
 */
export interface AuthConfig {
  domain: string
  clientId: string
  redirectUri: string
  audience: string
}

/**
 * Get Auth0 configuration from environment variables
 * Vite replaces import.meta.env.VITE_* with actual values at build time for production.
 * For tests, this function should be mocked using jest.mock() or wrapped with createTestAuthConfig.
 *
 * @returns Auth0 configuration from environment
 * @throws Error if required environment variables are missing
 */
export function getDefaultAuthConfig(): AuthConfig {
  // Vite config strips VITE_ prefix and maps to process.env.* via define
  const domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_CLIENT_ID
  const redirectUri = process.env.AUTH0_REDIRECT_URI
  const audience = process.env.AUTH0_AUDIENCE

  if (!domain || !clientId || !redirectUri || !audience) {
    throw new Error(
      'Missing required Auth0 configuration. Please set: VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_REDIRECT_URI, VITE_AUTH0_AUDIENCE',
    )
  }

  return {
    domain,
    clientId,
    redirectUri,
    audience,
  }
}

/**
 * Create a test configuration for use in tests
 *
 * @param overrides - Partial config to override defaults
 * @returns Test Auth0 configuration
 */
export function createTestAuthConfig(overrides?: Partial<AuthConfig>): AuthConfig {
  return {
    domain: 'test.auth0.com',
    clientId: 'test-client-id-12345',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://test-api',
    ...overrides,
  }
}
