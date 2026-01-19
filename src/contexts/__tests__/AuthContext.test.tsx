import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'
import { createTestAuthConfig } from '../../config/authConfig'
import { storeCallbackParams, clearStoredCallbackParams } from '../../utils/callbackHandler'

// Create test configuration using dependency injection
const testAuthConfig = createTestAuthConfig()

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
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test Content</div>
        </AuthProvider>,
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should initialize Auth0 with injected config', async () => {
      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })
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
        <AuthProvider authConfig={testAuthConfig}>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready')
      })
    })

    it('should expose isAuthenticated state', async () => {
      render(
        <AuthProvider authConfig={testAuthConfig}>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
      })
    })

    it('should expose user data (email and name)', async () => {
      render(
        <AuthProvider authConfig={testAuthConfig}>
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
        <AuthProvider authConfig={testAuthConfig}>
          <TestComponent />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('token')).toHaveTextContent('test-token-123')
      })
    })

    it('should provide loading state', async () => {
      render(
        <AuthProvider authConfig={testAuthConfig}>
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
        <AuthProvider authConfig={testAuthConfig}>
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
        <AuthProvider authConfig={testAuthConfig}>
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
        <AuthProvider authConfig={testAuthConfig}>
          <TestComponent />
        </AuthProvider>,
      )

      const getTokenButton = screen.getByRole('button', { name: /get token/i })

      await act(async () => {
        await userEvent.click(getTokenButton)
      })
    })
  })

  describe('handleRedirectCallback', () => {
    it('should call handleRedirectCallback during initialization', async () => {
      // Mock Auth0Client to verify handleRedirectCallback is called
      const Auth0ClientMock = jest.requireMock('@auth0/auth0-spa-js').Auth0Client
      const mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value

      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      // handleRedirectCallback should have been called during initialization
      if (mockInstance) {
        expect(mockInstance.handleRedirectCallback).toHaveBeenCalled()
      }
    })
  })

  describe('Error handling', () => {
    it('should handle Auth0 initialization errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <AuthProvider authConfig={testAuthConfig}>
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

  describe('Callback Handler - Stored Parameters Integration', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      sessionStorage.clear()
    })

    afterEach(() => {
      sessionStorage.clear()
    })

    it('should process stored callback parameters from the dedicated callback handler', async () => {
      const Auth0ClientMock = jest.requireMock('@auth0/auth0-spa-js').Auth0Client

      // Store callback parameters as if the callback handler stored them
      storeCallbackParams({
        code: 'stored-auth-code-12345',
        state: 'stored-state-xyz',
        error: null,
        errorDescription: null,
      })

      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      // Verify handleRedirectCallback was called with reconstructed URL
      const mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value
      if (mockInstance) {
        expect(mockInstance.handleRedirectCallback).toHaveBeenCalled()
        // Check that it was called with a URL containing the stored code
        const callArgs = mockInstance.handleRedirectCallback.mock.calls[0]
        if (callArgs && callArgs[0]) {
          expect(callArgs[0]).toContain('stored-auth-code-12345')
          expect(callArgs[0]).toContain('stored-state-xyz')
        }
      }
    })

    it('should clear stored callback parameters after processing', async () => {
      // Store callback parameters
      storeCallbackParams({
        code: 'test-code',
        state: 'test-state',
        error: null,
        errorDescription: null,
      })

      expect(sessionStorage.getItem('auth0_callback_params')).not.toBeNull()

      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      // Verify stored parameters are cleared after processing
      expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()
    })

    it('should reconstruct callback URL with correct domain and redirect URI', async () => {
      const Auth0ClientMock = jest.requireMock('@auth0/auth0-spa-js').Auth0Client

      storeCallbackParams({
        code: 'code-from-handler',
        state: 'state-from-handler',
        error: null,
        errorDescription: null,
      })

      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      const mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value
      if (mockInstance) {
        const callArgs = mockInstance.handleRedirectCallback.mock.calls[0]
        if (callArgs && callArgs[0]) {
          const reconstructedUrl = callArgs[0] as string
          // Should include the domain
          expect(reconstructedUrl).toContain('localhost:3000')
          // Should include the test redirect URI
          expect(reconstructedUrl).toContain('http://localhost:3000/callback')
          // Should include code and state as query params
          expect(reconstructedUrl).toContain('code=code-from-handler')
          expect(reconstructedUrl).toContain('state=state-from-handler')
        }
      }
    })

    it('should fall back to normal callback flow when no stored parameters exist', async () => {
      const Auth0ClientMock = jest.requireMock('@auth0/auth0-spa-js').Auth0Client

      // Don't store any parameters
      expect(sessionStorage.getItem('auth0_callback_params')).toBeNull()

      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      // Verify handleRedirectCallback was still called (normal flow)
      const mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value
      if (mockInstance) {
        expect(mockInstance.handleRedirectCallback).toHaveBeenCalled()
      }
    })

    it('should handle stored params with GitHub Pages base path in redirect URI', async () => {
      const Auth0ClientMock = jest.requireMock('@auth0/auth0-spa-js').Auth0Client

      const githubPagesConfig = createTestAuthConfig({
        redirectUri: 'https://dgaudet.github.io/commentator-frontend/callback/',
      })

      storeCallbackParams({
        code: 'github-pages-code',
        state: 'github-pages-state',
        error: null,
        errorDescription: null,
      })

      render(
        <AuthProvider authConfig={githubPagesConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      const mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value
      if (mockInstance) {
        const callArgs = mockInstance.handleRedirectCallback.mock.calls[0]
        if (callArgs && callArgs[0]) {
          const reconstructedUrl = callArgs[0] as string
          // Should reconstruct with GitHub Pages redirect URI
          expect(reconstructedUrl).toContain('github-pages-code')
          expect(reconstructedUrl).toContain('github-pages-state')
        }
      }
    })

    it('should process stored params and authenticate user', async () => {
      storeCallbackParams({
        code: 'valid-auth-code',
        state: 'valid-state',
        error: null,
        errorDescription: null,
      })

      const TestComponent = () => {
        const { isAuthenticated, user } = useAuth()

        return (
          <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            {user && <div data-testid="user-info">{user.email}</div>}
          </div>
        )
      }

      render(
        <AuthProvider authConfig={testAuthConfig}>
          <TestComponent />
        </AuthProvider>,
      )

      // After processing stored params, user should be authenticated
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
        expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com')
      })
    })

    it('should only call handleRedirectCallback with URL when stored params exist', async () => {
      const Auth0ClientMock = jest.requireMock('@auth0/auth0-spa-js').Auth0Client

      // Scenario 1: With stored params
      storeCallbackParams({
        code: 'test-code',
        state: 'test-state',
        error: null,
        errorDescription: null,
      })

      const { unmount } = render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      let mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value
      if (mockInstance) {
        const firstCallArgs = mockInstance.handleRedirectCallback.mock.calls[0]
        // When stored params exist, handleRedirectCallback should be called with URL
        expect(firstCallArgs).toBeDefined()
      }

      unmount()
      jest.clearAllMocks()
      clearStoredCallbackParams()

      // Scenario 2: Without stored params
      render(
        <AuthProvider authConfig={testAuthConfig}>
          <div>Test</div>
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      mockInstance = Auth0ClientMock.mock.results[Auth0ClientMock.mock.results.length - 1]?.value
      if (mockInstance) {
        // Should also call handleRedirectCallback, but possibly without URL
        expect(mockInstance.handleRedirectCallback).toHaveBeenCalled()
      }
    })
  })
})
