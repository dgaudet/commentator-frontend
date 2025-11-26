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

    if (err.message.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: 'Authentication request timed out. Please try again.',
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
    if (typeof errorObj.error === 'string') {
      return {
        code: errorObj.error as string,
        message: (errorObj.error_description as string) || 'Authentication failed.',
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
  ]
  return recoverableErrors.includes(code)
}

export const isFatalError = (code: string): boolean => {
  const fatalErrors = [
    'ACCOUNT_LOCKED',
  ]
  return fatalErrors.includes(code)
}
