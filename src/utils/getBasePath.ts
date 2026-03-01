/**
 * Determine the base path for React Router based on the current environment
 *
 * - Local development: returns "/" (no subdirectory)
 * - GitHub Pages: returns "/commentator-frontend/" (subdirectory deployment)
 * - Production: returns "/" or "/commentator-frontend/" based on deployment URL
 *
 * @returns The appropriate base path for React Router basename
 */
export function getBasePath(): string {
  // Check if we're running on GitHub Pages
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return '/commentator-frontend/'
  }

  // Default to root for local development and other deployments
  return '/'
}
