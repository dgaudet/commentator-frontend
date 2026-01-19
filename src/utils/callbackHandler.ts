/**
 * Auth0 Callback Handler Utilities
 *
 * Core functions for handling OAuth2 callbacks on GitHub Pages.
 * These functions are used by public/callback/index.html and tested comprehensively.
 */

/**
 * Callback parameters parsed from URL search params
 */
export interface CallbackParams {
  code: string | null
  state: string | null
  error: string | null
  errorDescription: string | null
}

/**
 * Validation result
 */
export interface ValidationResult {
  ok: boolean
  type?: 'error' | 'invalid'
  err?: string | null
  desc?: string | null
}

/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (c) => map[c])
}

/**
 * Detect and return base path by removing /callback/ from current pathname
 * Works with any repository name or deployment path
 */
export function getBasePath(pathname: string): string {
  // Normalize to always have trailing slash
  const normalized = pathname.endsWith('/') ? pathname : pathname + '/'
  // Replace /callback/ with / at the end
  return normalized.replace(/\/callback\/$/, '/') || '/'
}

/**
 * Parse callback parameters from URL search params
 */
export function parseCallbackParams(searchParams: URLSearchParams): CallbackParams {
  return {
    code: searchParams.get('code'),
    state: searchParams.get('state'),
    error: searchParams.get('error'),
    errorDescription: searchParams.get('error_description'),
  }
}

/**
 * Validate callback parameters
 * Returns validation result indicating if callback is valid or contains an error
 */
export function validateCallbackParams(params: CallbackParams): ValidationResult {
  // Check for error parameter first
  if (params.error !== null) {
    return {
      ok: false,
      type: 'error',
      err: params.error,
      desc: params.errorDescription,
    }
  }

  // Check for required code and state (OAuth2 security requirement)
  if (params.code !== null && params.state !== null) {
    return { ok: true }
  }

  // Missing code or state
  return {
    ok: false,
    type: 'invalid',
    err: 'missing',
    desc: 'Missing code or state',
  }
}

/**
 * Error message mapping - user-friendly messages for OAuth2 error codes
 */
const ERROR_MESSAGES: { [key: string]: string } = {
  access_denied: 'Login cancelled. Please try again.',
  server_error: 'Authentication service error. Please try again later.',
  unauthorized_client: 'Application configuration error. Please contact support.',
}

/**
 * Get user-friendly error message for error code
 */
export function getErrorMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode] || 'An error occurred during authentication.'
}

/**
 * Store callback parameters in sessionStorage for AuthContext to process
 * The Auth0 SDK needs these to exchange the code for tokens
 */
export function storeCallbackParams(params: CallbackParams): void {
  const callbackData = {
    code: params.code,
    state: params.state,
    timestamp: Date.now(),
  }
  sessionStorage.setItem('auth0_callback_params', JSON.stringify(callbackData))
}

/**
 * Retrieve callback parameters from sessionStorage
 * Used by AuthContext to complete the OAuth2 flow
 */
export function getStoredCallbackParams(): CallbackParams | null {
  try {
    const stored = sessionStorage.getItem('auth0_callback_params')
    if (!stored) return null

    const data = JSON.parse(stored)
    return {
      code: data.code || null,
      state: data.state || null,
      error: null,
      errorDescription: null,
    }
  } catch {
    return null
  }
}

/**
 * Clear callback parameters from sessionStorage after processing
 * Call this after Auth0 SDK successfully processes the callback
 */
export function clearStoredCallbackParams(): void {
  sessionStorage.removeItem('auth0_callback_params')
}

/**
 * Format error HTML display
 */
export function formatErrorHtml(errorCode: string, basePath: string, includeCode: boolean = false): string {
  const message = getErrorMessage(errorCode)
  const codeDisplay = includeCode ? `<p style="font-size:0.85rem;color:#999;">Code: ${escapeHtml(errorCode)}</p>` : ''

  return `<div class="error">
    <h2>Authentication Error</h2>
    <p>${escapeHtml(message)}</p>
    ${codeDisplay}
    <a href="${escapeHtml(basePath)}">Return to Application</a>
  </div>`
}
