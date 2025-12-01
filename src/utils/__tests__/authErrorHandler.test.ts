import { parseAuthError, isRecoverableError, isFatalError } from '../authErrorHandler'

describe('authErrorHandler', () => {
  describe('parseAuthError', () => {
    it('should parse generic Error instances', () => {
      const error = new Error('Test error')
      const result = parseAuthError(error)

      expect(result.code).toBe('AUTH_ERROR')
      expect(result.message).toBe('Test error')
      expect(result.details).toBe(error)
    })

    it('should handle invalid state errors', () => {
      const error = new Error('Invalid state parameter')
      const result = parseAuthError(error)

      expect(result.code).toBe('INVALID_STATE')
      expect(result.message).toContain('state mismatch')
    })

    it('should handle unauthorized errors', () => {
      const error = new Error('Unauthorized: Invalid credentials')
      const result = parseAuthError(error)

      expect(result.code).toBe('UNAUTHORIZED')
      expect(result.message).toContain('Invalid credentials')
    })

    it('should handle account locked errors', () => {
      const error = new Error('Account locked')
      const result = parseAuthError(error)

      expect(result.code).toBe('ACCOUNT_LOCKED')
      expect(result.message).toContain('locked')
    })

    it('should handle network errors', () => {
      const error = new Error('Network request failed')
      const result = parseAuthError(error)

      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.message).toContain('Network error')
    })

    it('should handle timeout errors', () => {
      const error = new Error('Request timeout')
      const result = parseAuthError(error)

      expect(result.code).toBe('TIMEOUT')
      expect(result.message).toContain('timed out')
    })

    it('should parse object errors with error property', () => {
      const error = {
        error: 'invalid_grant',
        error_description: 'Invalid grant',
      }
      const result = parseAuthError(error)

      expect(result.code).toBe('invalid_grant')
      // Story 3.9: Maps to user-friendly message for invalid_grant
      expect(result.message).toContain('Invalid credentials')
    })

    it('should handle unknown object errors', () => {
      const error = { unknown: 'error' }
      const result = parseAuthError(error)

      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toContain('unexpected error')
    })

    it('should handle null errors', () => {
      const result = parseAuthError(null)

      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toContain('unexpected error')
    })

    it('should handle undefined errors', () => {
      const result = parseAuthError(undefined)

      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toContain('unexpected error')
    })

    it('should preserve error details', () => {
      const originalError = new Error('Original error')
      const result = parseAuthError(originalError)

      expect(result.details).toBe(originalError)
    })
  })

  describe('isRecoverableError', () => {
    it('should identify network errors as recoverable', () => {
      expect(isRecoverableError('NETWORK_ERROR')).toBe(true)
    })

    it('should identify timeout errors as recoverable', () => {
      expect(isRecoverableError('TIMEOUT')).toBe(true)
    })

    it('should identify invalid state errors as recoverable', () => {
      expect(isRecoverableError('INVALID_STATE')).toBe(true)
    })

    it('should not identify account locked as recoverable', () => {
      expect(isRecoverableError('ACCOUNT_LOCKED')).toBe(false)
    })

    it('should not identify unknown errors as recoverable', () => {
      expect(isRecoverableError('UNKNOWN_ERROR')).toBe(false)
    })
  })

  describe('isFatalError', () => {
    it('should identify account locked as fatal', () => {
      expect(isFatalError('ACCOUNT_LOCKED')).toBe(true)
    })

    it('should not identify network errors as fatal', () => {
      expect(isFatalError('NETWORK_ERROR')).toBe(false)
    })

    it('should not identify timeout errors as fatal', () => {
      expect(isFatalError('TIMEOUT')).toBe(false)
    })

    it('should not identify unauthorized as fatal', () => {
      expect(isFatalError('UNAUTHORIZED')).toBe(false)
    })

    it('should identify unauthorized_client as fatal (Story 3.9)', () => {
      expect(isFatalError('unauthorized_client')).toBe(true)
    })

    it('should identify unsupported_response_type as fatal (Story 3.9)', () => {
      expect(isFatalError('unsupported_response_type')).toBe(true)
    })
  })

  describe('Story 3.9: Additional Error Scenarios', () => {
    it('should handle token expired errors', () => {
      const error = new Error('Token expired')
      const result = parseAuthError(error)
      expect(result.code).toBe('TOKEN_EXPIRED')
      expect(result.message).toContain('session has expired')
    })

    it('should handle CORS errors', () => {
      const error = new Error('CORS policy violation')
      const result = parseAuthError(error)
      expect(result.code).toBe('CORS_ERROR')
      expect(result.message).toContain('unavailable')
    })

    it('should handle cancelled login', () => {
      const error = new Error('Login cancelled by user')
      const result = parseAuthError(error)
      expect(result.code).toBe('LOGIN_CANCELLED')
      expect(result.message).toContain('cancelled')
    })

    it('should handle access_denied Auth0 error', () => {
      const error = {
        error: 'access_denied',
        error_description: 'Access denied by policy',
      }
      const result = parseAuthError(error)
      expect(result.code).toBe('access_denied')
      expect(result.message).toContain('access denied')
    })

    it('should handle invalid_grant Auth0 error', () => {
      const error = {
        error: 'invalid_grant',
        error_description: 'Invalid grant',
      }
      const result = parseAuthError(error)
      expect(result.code).toBe('invalid_grant')
      expect(result.message).toContain('Invalid credentials')
    })

    it('should identify TOKEN_EXPIRED as recoverable', () => {
      expect(isRecoverableError('TOKEN_EXPIRED')).toBe(true)
    })

    it('should identify CORS_ERROR as recoverable', () => {
      expect(isRecoverableError('CORS_ERROR')).toBe(true)
    })

    it('should identify LOGIN_CANCELLED as recoverable', () => {
      expect(isRecoverableError('LOGIN_CANCELLED')).toBe(true)
    })
  })
})
