/**
 * Environment Variable Access
 * Abstracts away the complexity of accessing environment variables in different environments:
 * - Browser: import.meta.env (statically replaced by Vite at build time)
 * - Tests: global.import.meta.env (polyfilled in setupTests.ts)
 */

/**
 * Get a specific Vite environment variable with proper typing
 */
export const env = {
  baseUrl: process.env.VITE_API_BASE_URL,
}
