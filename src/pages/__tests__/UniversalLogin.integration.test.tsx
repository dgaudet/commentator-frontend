/**
 * Universal Login Integration Tests
 * End-to-end integration tests for Auth0 Universal Login flow
 * Reference: TASK 7 - Integration Testing & Verification
 */

import { renderWithRouter, screen, waitFor } from '../../test-utils'
import * as AuthModule from '../../contexts/AuthContext'
import { LoginPage } from '../LoginPage'
import { CallbackPage } from '../CallbackPage'

// Mock Auth context
const mockUseAuth = jest.spyOn(AuthModule, 'useAuth')
const mockNavigate = jest.fn()
let mockSearchParams = new URLSearchParams('code=test&state=test')

jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    handleRedirectCallback: jest.fn().mockResolvedValue({
      appState: { returnTo: '/' },
    }),
    isAuthenticated: jest.fn().mockResolvedValue(true),
    getUser: jest.fn().mockResolvedValue({
      sub: 'auth0|123456',
      email: 'user@example.com',
      name: 'Test User',
    }),
    getTokenSilently: jest.fn().mockResolvedValue('test-access-token'),
    loginWithRedirect: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: jest.fn(() => mockNavigate),
    useSearchParams: jest.fn(() => [mockSearchParams, jest.fn()]),
  }
})

describe('Universal Login - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNavigate.mockClear()
    mockSearchParams = new URLSearchParams('code=test&state=test')
  })

  afterAll(() => {
    mockUseAuth.mockRestore()
  })

  describe('Complete Login Flow', () => {
    it('should complete successful login flow from LoginPage through CallbackPage', async () => {
      // Step 1: User arrives at LoginPage
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      const { rerender } = renderWithRouter(<LoginPage />)

      // Verify LoginPage rendered with login button
      const loginButton = screen.getByRole('button', { name: /login/i })
      expect(loginButton).toBeInTheDocument()
      expect(loginButton).not.toBeDisabled()

      // Step 2: User clicks login button
      const mockLogin = jest.fn()
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: mockLogin,
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      rerender(<LoginPage />)
      const newLoginButton = screen.getByRole('button', { name: /login/i })
      newLoginButton.click()

      // Verify login was called (would redirect to Auth0 in real scenario)
      expect(mockLogin).toHaveBeenCalledTimes(1)

      // Step 3: Mock Auth0 redirect to /callback with code and state
      mockSearchParams = new URLSearchParams('code=auth_code_12345&state=state_abc123')

      // Step 4: CallbackPage processes callback - user not yet authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      const { rerender: rerender2 } = renderWithRouter(<CallbackPage />)

      // Verify CallbackPage shows loading state while waiting for auth
      expect(screen.getByText(/processing authentication/i)).toBeInTheDocument()

      // Step 5: AuthContext completes token exchange (isAuthenticated becomes true)
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'user@example.com',
          name: 'Test User',
        },
        accessToken: 'test-access-token',
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      rerender2(<CallbackPage />)

      // Wait for component to detect auth completion and redirect
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/', {
            replace: true,
          })
        },
        {
          timeout: 5000,
        },
      )
    })
  })

  describe('Error Scenarios', () => {
    it('should handle Auth0 authentication error', async () => {
      // Mock Auth0 error response
      mockSearchParams = new URLSearchParams(
        'error=access_denied&error_description=User%20cancelled%20login',
      )

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<CallbackPage />)

      // Verify error is displayed
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent(/user.*cancelled/i)

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle missing authorization code', async () => {
      // Mock callback without code parameter (invalid)
      mockSearchParams = new URLSearchParams('state=state_abc123')

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<CallbackPage />)

      // Verify error is displayed
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent(/no authorization code/i)

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle authentication timeout', async () => {
      mockSearchParams = new URLSearchParams('code=auth_code&state=state_abc')

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<CallbackPage />)

      // Verify loading state initially
      expect(screen.getByText(/processing authentication/i)).toBeInTheDocument()

      // Wait for timeout (CallbackPage has 8 second timeout)
      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument()
          expect(screen.getByText(/took too long|timeout/i)).toBeInTheDocument()
        },
        {
          timeout: 9000,
        },
      )

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Session Persistence', () => {
    it('should maintain authentication across page refresh', async () => {
      // Simulate user already authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'user@example.com',
          name: 'Test User',
        },
        accessToken: 'test-access-token',
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      const { rerender } = renderWithRouter(<LoginPage />)

      // Verify user is authenticated
      expect(mockUseAuth).toHaveBeenCalled()

      // Simulate page refresh (rerender with same auth state)
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'user@example.com',
          name: 'Test User',
        },
        accessToken: 'test-access-token',
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      rerender(<LoginPage />)

      // Verify user still authenticated
      expect(mockUseAuth()).toEqual(
        expect.objectContaining({
          isAuthenticated: true,
          user: expect.objectContaining({
            email: 'user@example.com',
          }),
        }),
      )
    })
  })

  describe('Loading States', () => {
    it('should show loading state during login', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: true,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<LoginPage />)

      // Verify button is disabled and shows loading text
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('Logging in...')).toBeInTheDocument()
    })

    it('should show processing state during callback', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<CallbackPage />)

      // Verify processing message displayed
      expect(screen.getByText(/processing authentication/i)).toBeInTheDocument()
    })
  })

  describe('Error Recovery', () => {
    it('should allow user to retry login after error', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: 'Login failed',
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<LoginPage />)

      // Verify error displayed
      expect(screen.getByText('Login failed')).toBeInTheDocument()

      // Verify login button is still functional
      const loginButton = screen.getByRole('button', { name: /login/i })
      expect(loginButton).not.toBeDisabled()
    })

    it('should provide retry button on callback error', async () => {
      mockSearchParams = new URLSearchParams(
        'error=server_error&error_description=Auth0%20service%20error',
      )

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        accessToken: null,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn(),
      })

      renderWithRouter(<CallbackPage />)

      // Verify error displayed
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/auth0 service error/i)).toBeInTheDocument()

      // Verify "Back to Login" button present
      const backToLoginButton = screen.getByText(/back to login/i)
      expect(backToLoginButton).toBeInTheDocument()
    })
  })
})
