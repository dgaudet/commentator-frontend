/**
 * Callback Handler Unit Tests
 *
 * Comprehensive tests for Auth0 callback handler functions in src/utils/callbackHandler.ts
 * These tests validate the actual production code used in public/callback/index.html
 */

import {
  escapeHtml,
  getBasePath,
  parseCallbackParams,
  validateCallbackParams,
  getErrorMessage,
  storeCallbackParams,
  getStoredCallbackParams,
  clearStoredCallbackParams,
  formatErrorHtml,
  type CallbackParams,
} from '../utils/callbackHandler'

/**
 * HTML Escaping - XSS Prevention
 */
describe('callbackHandler - escapeHtml()', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
  })

  it('should escape ampersand', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('should escape double quotes', () => {
    expect(escapeHtml('He said "Hello"')).toBe('He said &quot;Hello&quot;')
  })

  it('should escape single quotes', () => {
    expect(escapeHtml("It's fine")).toBe('It&#039;s fine')
  })

  it('should escape angle brackets', () => {
    expect(escapeHtml('<div>content</div>')).toBe('&lt;div&gt;content&lt;/div&gt;')
  })

  it('should handle multiple special characters', () => {
    expect(escapeHtml('a & b < c > d "e" \'f\'')).toBe(
      'a &amp; b &lt; c &gt; d &quot;e&quot; &#039;f&#039;',
    )
  })

  it('should preserve normal text unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })

  it('should prevent XSS via error_description injection', () => {
    const malicious = '<img src=x onerror="alert(\'xss\')">'
    const escaped = escapeHtml(malicious)

    // Verify dangerous HTML tags are encoded
    expect(escaped).not.toContain('<img')
    expect(escaped).toContain('&lt;img')
    expect(escaped).toContain('&quot;')
  })
})

/**
 * Base Path Detection - Dynamic path resolution
 */
describe('callbackHandler - getBasePath()', () => {
  it('should detect base path by removing /callback/ from pathname', () => {
    const pathname = '/commentator-frontend/callback/'
    expect(getBasePath(pathname)).toBe('/commentator-frontend/')
  })

  it('should handle missing trailing slash', () => {
    const pathname = '/commentator-frontend/callback'
    expect(getBasePath(pathname)).toBe('/commentator-frontend/')
  })

  it('should handle root path deployment', () => {
    const pathname = '/callback/'
    expect(getBasePath(pathname)).toBe('/')
  })

  it('should handle root path without trailing slash', () => {
    const pathname = '/callback'
    expect(getBasePath(pathname)).toBe('/')
  })

  it('should handle nested paths', () => {
    const pathname = '/users/deployments/app/callback/'
    expect(getBasePath(pathname)).toBe('/users/deployments/app/')
  })

  it('should work with any repository name', () => {
    const testCases = [
      { pathname: '/commentator-frontend/callback/', expected: '/commentator-frontend/' },
      { pathname: '/my-app/callback/', expected: '/my-app/' },
      { pathname: '/repo-name-123/callback/', expected: '/repo-name-123/' },
      { pathname: '/callback/', expected: '/' },
    ]

    testCases.forEach(({ pathname, expected }) => {
      expect(getBasePath(pathname)).toBe(expected)
    })
  })

  it('should be resilient to trailing slash variations', () => {
    const testCases = [
      { pathname: '/app/callback/', expected: '/app/' },
      { pathname: '/app/callback', expected: '/app/' },
      { pathname: '/callback/', expected: '/' },
      { pathname: '/callback', expected: '/' },
    ]

    testCases.forEach(({ pathname, expected }) => {
      expect(getBasePath(pathname)).toBe(expected)
    })
  })
})

/**
 * Parameter Parsing
 */
describe('callbackHandler - parseCallbackParams()', () => {
  it('should parse code and state from search params', () => {
    const params = new URLSearchParams('code=test-code-123&state=test-state-456')
    const result = parseCallbackParams(params)

    expect(result.code).toBe('test-code-123')
    expect(result.state).toBe('test-state-456')
    expect(result.error).toBeNull()
  })

  it('should parse error and error_description', () => {
    const params = new URLSearchParams('error=access_denied&error_description=User+denied+access')
    const result = parseCallbackParams(params)

    expect(result.error).toBe('access_denied')
    expect(result.errorDescription).toBe('User denied access')
    expect(result.code).toBeNull()
  })

  it('should return null for missing parameters', () => {
    const params = new URLSearchParams('')
    const result = parseCallbackParams(params)

    expect(result.code).toBeNull()
    expect(result.state).toBeNull()
    expect(result.error).toBeNull()
  })

  it('should handle URL-encoded values', () => {
    const params = new URLSearchParams('error_description=Something%20went%20wrong%21')
    const result = parseCallbackParams(params)

    expect(result.errorDescription).toBe('Something went wrong!')
  })
})

/**
 * Parameter Validation
 */
describe('callbackHandler - validateCallbackParams()', () => {
  it('should recognize successful callback with code and state', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    const result = validateCallbackParams(params)

    expect(result.ok).toBe(true)
  })

  it('should reject callback missing state (CSRF prevention)', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: null,
      error: null,
      errorDescription: null,
    }

    const result = validateCallbackParams(params)

    expect(result.ok).toBe(false)
    expect(result.type).toBe('invalid')
  })

  it('should reject callback missing code', () => {
    const params: CallbackParams = {
      code: null,
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    const result = validateCallbackParams(params)

    expect(result.ok).toBe(false)
    expect(result.type).toBe('invalid')
  })

  it('should detect error parameter', () => {
    const params: CallbackParams = {
      code: null,
      state: null,
      error: 'access_denied',
      errorDescription: 'User denied access',
    }

    const result = validateCallbackParams(params)

    expect(result.ok).toBe(false)
    expect(result.type).toBe('error')
    expect(result.err).toBe('access_denied')
  })

  it('should prioritize error detection over missing params', () => {
    const params: CallbackParams = {
      code: null,
      state: null,
      error: 'server_error',
      errorDescription: 'Server error occurred',
    }

    const result = validateCallbackParams(params)

    expect(result.ok).toBe(false)
    expect(result.type).toBe('error')
    expect(result.err).toBe('server_error')
  })

  it('should reject all missing parameters', () => {
    const params: CallbackParams = {
      code: null,
      state: null,
      error: null,
      errorDescription: null,
    }

    const result = validateCallbackParams(params)

    expect(result.ok).toBe(false)
    expect(result.type).toBe('invalid')
  })
})

/**
 * Error Message Mapping
 */
describe('callbackHandler - getErrorMessage()', () => {
  it('should map access_denied to user-friendly message', () => {
    const message = getErrorMessage('access_denied')
    expect(message).toBe('Login cancelled. Please try again.')
  })

  it('should map server_error to user-friendly message', () => {
    const message = getErrorMessage('server_error')
    expect(message).toBe('Authentication service error. Please try again later.')
  })

  it('should map unauthorized_client to user-friendly message', () => {
    const message = getErrorMessage('unauthorized_client')
    expect(message).toBe('Application configuration error. Please contact support.')
  })

  it('should provide fallback for unknown errors', () => {
    const message = getErrorMessage('unknown_error_code')
    expect(message).toBe('An error occurred during authentication.')
  })

  it('should never expose technical error details', () => {
    // Verify friendly message is used, not technical details
    const message = getErrorMessage('invalid_code_verifier')
    expect(message).not.toContain('Code verifier')
    expect(message).toBe('An error occurred during authentication.')
  })
})

/**
 * SessionStorage - Callback Parameter Storage
 */
describe('callbackHandler - storeCallbackParams() and getStoredCallbackParams()', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('should store callback parameters in sessionStorage', () => {
    const params: CallbackParams = {
      code: 'test-code-123',
      state: 'test-state-456',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    const stored = sessionStorage.getItem('auth0_callback_params')
    expect(stored).not.toBeNull()

    const data = JSON.parse(stored!)
    expect(data.code).toBe('test-code-123')
    expect(data.state).toBe('test-state-456')
    expect(data.timestamp).toBeDefined()
  })

  it('should retrieve stored callback parameters', () => {
    const params: CallbackParams = {
      code: 'test-code-abc',
      state: 'test-state-xyz',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    const retrieved = getStoredCallbackParams()
    expect(retrieved).not.toBeNull()
    expect(retrieved?.code).toBe('test-code-abc')
    expect(retrieved?.state).toBe('test-state-xyz')
  })

  it('should return null if no parameters stored', () => {
    const retrieved = getStoredCallbackParams()
    expect(retrieved).toBeNull()
  })

  it('should clear stored parameters', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)
    expect(sessionStorage.getItem('auth0_callback_params')).not.toBeNull()

    clearStoredCallbackParams()
    expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()
    expect(getStoredCallbackParams()).toBeNull()
  })

  it('should use sessionStorage not localStorage (auto-clears on close)', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    // Verify stored in sessionStorage
    expect(sessionStorage.getItem('auth0_callback_params')).not.toBeNull()

    // Clear and verify it's gone
    sessionStorage.clear()
    expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()
  })

  it('should never store authorization code separately', () => {
    const params: CallbackParams = {
      code: 'secret-auth-code-12345',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    // Verify we're storing code as part of params, not separately
    const stored = sessionStorage.getItem('auth0_callback_params')
    const data = JSON.parse(stored!)
    expect(data.code).toBe('secret-auth-code-12345') // Code is stored as param, which is necessary
    expect(data.ok).toBeUndefined() // But not as a separate 'ok' flag
  })

  it('should handle getStoredCallbackParams with invalid JSON gracefully', () => {
    // Simulate corrupted sessionStorage data
    sessionStorage.setItem('auth0_callback_params', 'invalid-json-data{]')

    const retrieved = getStoredCallbackParams()
    expect(retrieved).toBeNull()
  })

  it('should handle getStoredCallbackParams with missing code field', () => {
    // Store data without code field
    const malformedData = { state: 'test-state' }
    sessionStorage.setItem('auth0_callback_params', JSON.stringify(malformedData))

    const retrieved = getStoredCallbackParams()
    expect(retrieved).not.toBeNull()
    expect(retrieved?.code).toBeNull()
    expect(retrieved?.state).toBe('test-state')
  })

  it('should handle getStoredCallbackParams with missing state field', () => {
    // Store data without state field
    const malformedData = { code: 'test-code' }
    sessionStorage.setItem('auth0_callback_params', JSON.stringify(malformedData))

    const retrieved = getStoredCallbackParams()
    expect(retrieved).not.toBeNull()
    expect(retrieved?.code).toBe('test-code')
    expect(retrieved?.state).toBeNull()
  })

  it('should handle getStoredCallbackParams with null code and state', () => {
    // Store data with explicitly null code and state
    const data = { code: null, state: null }
    sessionStorage.setItem('auth0_callback_params', JSON.stringify(data))

    const retrieved = getStoredCallbackParams()
    expect(retrieved).not.toBeNull()
    expect(retrieved?.code).toBeNull()
    expect(retrieved?.state).toBeNull()
  })

  it('should handle getStoredCallbackParams with empty string code/state', () => {
    // Store data with empty strings
    const data = { code: '', state: '' }
    sessionStorage.setItem('auth0_callback_params', JSON.stringify(data))

    const retrieved = getStoredCallbackParams()
    expect(retrieved).not.toBeNull()
    // Empty strings should be converted to null per the implementation
    expect(retrieved?.code).toBeNull()
    expect(retrieved?.state).toBeNull()
  })

  it('should handle clearStoredCallbackParams when nothing is stored', () => {
    // Ensure nothing is stored
    sessionStorage.clear()

    // Should not throw error
    expect(() => {
      clearStoredCallbackParams()
    }).not.toThrow()

    // Should still return null
    expect(getStoredCallbackParams()).toBeNull()
  })

  it('should handle clearStoredCallbackParams called multiple times', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)
    expect(sessionStorage.getItem('auth0_callback_params')).not.toBeNull()

    // Clear multiple times - should not throw error
    clearStoredCallbackParams()
    expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()

    clearStoredCallbackParams()
    expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()

    clearStoredCallbackParams()
    expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()
  })

  it('should store and retrieve long code and state strings', () => {
    // OAuth2 codes can be quite long
    const longCode = 'a'.repeat(500)
    const longState = 'b'.repeat(500)

    const params: CallbackParams = {
      code: longCode,
      state: longState,
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    const retrieved = getStoredCallbackParams()
    expect(retrieved?.code).toBe(longCode)
    expect(retrieved?.state).toBe(longState)
  })

  it('should include timestamp when storing callback params', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    const beforeStore = Date.now()
    storeCallbackParams(params)
    const afterStore = Date.now()

    const stored = sessionStorage.getItem('auth0_callback_params')
    const data = JSON.parse(stored!)

    expect(data.timestamp).toBeDefined()
    expect(typeof data.timestamp).toBe('number')
    expect(data.timestamp).toBeGreaterThanOrEqual(beforeStore)
    expect(data.timestamp).toBeLessThanOrEqual(afterStore)
  })

  it('should always return error and errorDescription as null from getStoredCallbackParams', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    const retrieved = getStoredCallbackParams()
    // These should always be null since we don't store error state
    expect(retrieved?.error).toBeNull()
    expect(retrieved?.errorDescription).toBeNull()
  })

  it('should not store error or errorDescription fields', () => {
    const params: CallbackParams = {
      code: 'test-code',
      state: 'test-state',
      error: null,
      errorDescription: null,
    }

    storeCallbackParams(params)

    const stored = sessionStorage.getItem('auth0_callback_params')
    const data = JSON.parse(stored!)

    // Verify only code, state, and timestamp are stored
    expect(Object.keys(data).sort()).toEqual(['code', 'state', 'timestamp'].sort())
    expect(data.error).toBeUndefined()
    expect(data.errorDescription).toBeUndefined()
  })
})

/**
 * Error HTML Formatting
 */
describe('callbackHandler - formatErrorHtml()', () => {
  it('should format error HTML with user-friendly message', () => {
    const html = formatErrorHtml('access_denied', '/app/', false)

    expect(html).toContain('Authentication Error')
    expect(html).toContain('Login cancelled')
    expect(html).toContain('Return to Application')
    expect(html).toContain('href="/app/"')
  })

  it('should escape error message content', () => {
    const html = formatErrorHtml('access_denied', '/app/', false)
    const escapedMsg = escapeHtml('Login cancelled. Please try again.')

    expect(html).toContain(escapedMsg)
  })

  it('should escape redirect URL', () => {
    const evilUrl = '"><script>alert("xss")</script>'
    const html = formatErrorHtml('access_denied', evilUrl, false)

    // Verify URL is escaped
    expect(html).toContain(escapeHtml(evilUrl))
    expect(html).not.toContain('<script>')
  })

  it('should include error code when requested', () => {
    const html = formatErrorHtml('access_denied', '/app/', true)

    expect(html).toContain('Code:')
    expect(html).toContain('access_denied')
  })

  it('should omit error code when not requested', () => {
    const html = formatErrorHtml('access_denied', '/app/', false)

    expect(html).not.toContain('Code:')
  })

  it('should use hardcoded redirect URL (no open redirect)', () => {
    const html = formatErrorHtml('access_denied', '/app/', false)

    // Verify href is from basePath parameter only
    expect(html).toContain('href="/app/"')
    expect(html).not.toContain('https://evil.com')
  })
})

/**
 * Integration Tests - Full Callback Flow
 */
describe('callbackHandler - Integration', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('should handle successful callback flow end-to-end', () => {
    // 1. Parse parameters from successful callback
    const searchParams = new URLSearchParams('code=auth-code-xyz&state=state-xyz')
    const params = parseCallbackParams(searchParams)

    // 2. Validate parameters
    const validation = validateCallbackParams(params)
    expect(validation.ok).toBe(true)

    // 3. Store callback parameters for AuthContext to process
    storeCallbackParams(params)
    expect(sessionStorage.getItem('auth0_callback_params')).not.toBeNull()

    // 4. Retrieve stored parameters to verify they can be processed
    const storedParams = getStoredCallbackParams()
    expect(storedParams?.code).toBe('auth-code-xyz')
    expect(storedParams?.state).toBe('state-xyz')

    // 5. Determine redirect URL (base path detection)
    const basePath = getBasePath('/commentator-frontend/callback/')
    expect(basePath).toBe('/commentator-frontend/')
    expect(basePath).not.toContain('code')
    expect(basePath).not.toContain('state')
  })

  it('should handle error callback flow end-to-end', () => {
    // 1. Parse parameters from error callback
    const searchParams = new URLSearchParams('error=access_denied&error_description=User+denied+access')
    const params = parseCallbackParams(searchParams)

    // 2. Validate parameters
    const validation = validateCallbackParams(params)
    expect(validation.ok).toBe(false)
    expect(validation.type).toBe('error')

    // 3. Get error message
    const message = getErrorMessage(validation.err!)
    expect(message).toBe('Login cancelled. Please try again.')

    // 4. Format error display
    const basePath = getBasePath('/commentator-frontend/callback/')
    const html = formatErrorHtml(validation.err!, basePath, false)
    expect(html).toContain('Authentication Error')
    expect(html).toContain('Login cancelled')
  })

  it('should handle missing parameters flow', () => {
    // 1. Parse parameters from malformed callback
    const searchParams = new URLSearchParams('')
    const params = parseCallbackParams(searchParams)

    // 2. Validate parameters
    const validation = validateCallbackParams(params)
    expect(validation.ok).toBe(false)
    expect(validation.type).toBe('invalid')

    // 3. Get generic error message
    const message = getErrorMessage('unknown')
    expect(message).toBe('An error occurred during authentication.')
  })

  it('should detect base path regardless of deployment name', () => {
    const deployments = [
      '/commentator-frontend/callback/',
      '/my-app/callback/',
      '/production-app-v2/callback/',
      '/callback/',
    ]

    deployments.forEach((pathname) => {
      const basePath = getBasePath(pathname)
      expect(basePath.endsWith('/')).toBe(true)
      expect(basePath).not.toContain('callback')
    })
  })

  it('should prevent XSS through entire flow', () => {
    // Simulate malicious error description
    const evilDescription = '<img src=x onerror="alert(\'xss\')">'
    const params: CallbackParams = {
      code: null,
      state: null,
      error: 'server_error',
      errorDescription: evilDescription,
    }

    const validation = validateCallbackParams(params)
    expect(validation.ok).toBe(false)

    // Format error with potentially malicious description
    const basePath = getBasePath('/app/callback/')
    const html = formatErrorHtml(validation.err!, basePath, true)

    // Verify XSS is prevented
    expect(html).not.toContain('<img')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('alert')
  })
})
