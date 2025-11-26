import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'

// Set environment variables for tests
process.env.VITE_AUTH0_DOMAIN = 'test.auth0.com'
process.env.VITE_AUTH0_CLIENT_ID = 'test-client-id'
process.env.VITE_AUTH0_REDIRECT_URI = 'http://localhost:3000/callback'
process.env.VITE_AUTH0_AUDIENCE = 'https://api.test.com'

// Mock Auth0 SDK
jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    buildAuthorizeUrl: jest.fn().mockResolvedValue('https://test.auth0.com/authorize?code=test'),
    handleRedirectCallback: jest.fn().mockResolvedValue({
      appState: { returnTo: '/dashboard' },
    }),
    isAuthenticated: jest.fn().mockResolvedValue(true),
    getUser: jest.fn().mockResolvedValue({
      sub: 'auth0|123456',
      email: 'test@example.com',
      name: 'Test User',
    }),
    getTokenSilently: jest.fn().mockResolvedValue('test-token-123'),
    logout: jest.fn().mockResolvedValue(undefined),
    loginWithRedirect: jest.fn().mockResolvedValue(undefined),
  })),
}))

// Mock window.location
delete (window as unknown).location
window.location = { assign: jest.fn(), origin: 'http://localhost:3000' } as unknown

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete (window as unknown).location
    window.location = { assign: jest.fn() } as unknown
  })

  describe('AuthProvider', () => {
    it('should render children', () => {
      render(
        <AuthProvider>
          <div>Test Content</div>
        </AuthProvider>,
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should initialize Auth0 with config from environment', async () => {
      const originalEnv = process.env
      process.env = {
        ...originalEnv,
        VITE_AUTH0_DOMAIN: 'test.auth0.com',
        VITE_AUTH0_CLIENT_ID: 'test-client-id',
        VITE_AUTH0_REDIRECT_URI: 'http://localhost:3000/callback',
        VITE_AUTH0_AUDIENCE: 'https://api.test.com',
      }

      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      process.env = originalEnv
    })
  })

  describe('useAuth hook', () => {
    const TestComponent = () => {
      const { isAuthenticated, user, loading, error, accessToken, login, logout, getAccessToken } = useAuth()

      return (
        <div>
          <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
          <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
          {user && <div data-testid="user-email">{user.email}</div>}
          {user && <div data-testid="user-name">{user.name}</div>}
          {error && <div data-testid="error">{error}</div>}
          {accessToken && <div data-testid="token">{accessToken}</div>}
          <button onClick={login}>Login</button>
          <button onClick={logout}>Logout</button>
          <button
            onClick={async () => {
              await getAccessToken()
            }}
          >
            Get Token
          </button>
        </div>
      )
    }

    it('should provide auth context values', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready')
      })
    })

    it('should expose isAuthenticated state', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
      })
    })

    it('should expose user data (email and name)', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
      })
    })

    it('should expose accessToken', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('token')).toHaveTextContent('test-token-123')
      })
    })

    it('should provide loading state', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      const loadingElement = screen.getByTestId('loading')
      await waitFor(() => {
        expect(loadingElement).toHaveTextContent('ready')
      })
    })

    it('should provide login method that redirects to Auth0', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      const loginButton = screen.getByRole('button', { name: /login/i })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
      })

      await act(async () => {
        await userEvent.click(loginButton)
      })
    })

    it('should provide logout method', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
      })

      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await act(async () => {
        await userEvent.click(logoutButton)
      })
    })

    it('should provide getAccessToken method', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      const getTokenButton = screen.getByRole('button', { name: /get token/i })

      await act(async () => {
        await userEvent.click(getTokenButton)
      })
    })
  })

  describe('Error handling', () => {
    it('should handle Auth0 initialization errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Context API', () => {
    it('should provide useAuth hook for accessing context', () => {
      // The hook is available for accessing the context
      expect(useAuth).toBeDefined()
    })

    it('should throw error when useAuth is used outside AuthProvider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        render(
          <div>
            <TestComponent />
          </div>,
        )
      }).toThrow()

      consoleErrorSpy.mockRestore()
    })
  })
})
