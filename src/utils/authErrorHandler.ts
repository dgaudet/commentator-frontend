export interface AuthError {
  code: string
  message: string
  details?: unknown
}

export const parseAuthError = (err: unknown): AuthError => {
  if (err instanceof Error) {
    // Handle specific Auth0 errors
    if (err.message.includes('Invalid state')) {
      return {
        code: 'INVALID_STATE',
        message: 'Authentication state mismatch. Please try again.',
        details: err,
      }
    }

    if (err.message.includes('Unauthorized')) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials. Please try again.',
        details: err,
      }
    }

    if (err.message.includes('Account locked')) {
      return {
        code: 'ACCOUNT_LOCKED',
        message: 'Your account has been locked. Please contact support.',
        details: err,
      }
    }

    if (err.message.includes('Network')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.',
        details: err,
      }
    }

    if (err.message.includes('timeout') || err.message.includes('timed out')) {
      return {
        code: 'TIMEOUT',
        message: 'Authentication request timed out. Please try again.',
        details: err,
      }
    }

    // Story 3.9: Handle token expiration
    if ((err.message.includes('token') && err.message.includes('expired')) || err.message.toLowerCase().includes('token expired')) {
      return {
        code: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please log in again.',
        details: err,
      }
    }

    // Story 3.9: Handle CORS errors
    if (err.message.includes('CORS') || err.message.includes('cors')) {
      return {
        code: 'CORS_ERROR',
        message: 'Authentication service unavailable. Please try again later.',
        details: err,
      }
    }

    // Story 3.9: Handle user cancelled login
    if (err.message.includes('cancelled') || err.message.includes('cancelled')) {
      return {
        code: 'LOGIN_CANCELLED',
        message: 'Login was cancelled. Please try again.',
        details: err,
      }
    }

    return {
      code: 'AUTH_ERROR',
      message: err.message || 'Authentication failed. Please try again.',
      details: err,
    }
  }

  if (typeof err === 'object' && err !== null) {
    const errorObj = err as Record<string, unknown>

    // Story 3.9: Handle Auth0 standard error format
    if (typeof errorObj.error === 'string') {
      const code = errorObj.error as string
      let message = (errorObj.error_description as string) || 'Authentication failed.'

      // Map common Auth0 error codes to user-friendly messages
      if (code === 'access_denied') {
        message = 'Authentication access denied. Please try again.'
      } else if (code === 'invalid_grant') {
        message = 'Invalid credentials. Please check your email and password.'
      } else if (code === 'unauthorized_client') {
        message = 'This application is not authorized. Please contact support.'
      } else if (code === 'unsupported_response_type') {
        message = 'Authentication configuration error. Please contact support.'
      }

      return {
        code,
        message,
        details: err,
      }
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    details: err,
  }
}

export const isRecoverableError = (code: string): boolean => {
  const recoverableErrors = [
    'NETWORK_ERROR',
    'TIMEOUT',
    'INVALID_STATE',
    'TOKEN_EXPIRED', // Story 3.9: Can recover by re-authenticating
    'CORS_ERROR', // Story 3.9: May recover if server becomes available
    'LOGIN_CANCELLED', // Story 3.9: User can retry login
    'access_denied', // Auth0: May resolve after policy changes
  ]
  return recoverableErrors.includes(code)
}

export const isFatalError = (code: string): boolean => {
  const fatalErrors = [
    'ACCOUNT_LOCKED', // Story 3.9: Must contact support
    'unauthorized_client', // Auth0: Configuration issue
    'unsupported_response_type', // Auth0: Configuration issue
  ]
  return fatalErrors.includes(code)
}
