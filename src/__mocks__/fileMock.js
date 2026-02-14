/**
 * Jest mock for static assets (images, etc.)
 * Returns a mock module path that Vite/bundler would normally process
 * This allows tests to import images without bundler processing
 */
module.exports = '/mocked-image-path'
