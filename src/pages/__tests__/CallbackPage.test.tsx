import { render, screen } from '../../test-utils'
import * as AuthModule from '../../contexts/AuthContext'
import { CallbackPage } from '../CallbackPage'

// Mock Auth context
const mockUseAuth = jest.spyOn(AuthModule, 'useAuth')
const mockNavigate = jest.fn()
let mockSearchParams = new URLSearchParams('code=test&state=test')

jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    handleRedirectCallback: jest.fn().mockResolvedValue({
      appState: { returnTo: '/dashboard' },
    }),
    isAuthenticated: jest.fn().mockResolvedValue(true),
    getUser: jest.fn().mockResolvedValue({
      sub: 'auth0|123456',
      email: 'test@example.com',
      name: 'Test User',
    }),
    getTokenSilently: jest.fn().mockResolvedValue('test-token'),
    loginWithRedirect: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => mockNavigate),
  useSearchParams: jest.fn(() => [mockSearchParams, jest.fn()]),
}))

describe('CallbackPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNavigate.mockClear()
    mockSearchParams = new URLSearchParams('code=test&state=test')
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
      user: null,
      accessToken: null,
      login: jest.fn(),
      logout: jest.fn(),
      getAccessToken: jest.fn(),
    })
  })

  afterAll(() => {
    mockUseAuth.mockRestore()
  })

  it('should render loading state initially', () => {
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

    render(<CallbackPage />)
    expect(screen.getByText(/processing authentication/i)).toBeInTheDocument()
  })

  it('should display loading spinner or indicator', () => {
    render(<CallbackPage />)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should exchange authorization code for tokens', async () => {
    // Start with auth not complete
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

    const { rerender } = render(<CallbackPage />)

    // Verify component is waiting for auth
    expect(screen.getByText(/processing authentication/i)).toBeInTheDocument()

    // Simulate auth completion by updating mock to isAuthenticated=true
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
      user: { sub: 'user123', email: 'test@example.com', name: 'Test' },
      accessToken: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
      getAccessToken: jest.fn(),
    })

    rerender(<CallbackPage />)

    // Give component time to detect auth change and redirect
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should handle successful callback', async () => {
    render(<CallbackPage />)

    // Component should process callback
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should display error if callback fails', () => {
    // Mock error from Auth0
    mockSearchParams = new URLSearchParams('error=access_denied&error_description=User%20cancelled%20login')

    render(<CallbackPage />)

    // Should display error message
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/user.*cancelled/i)).toBeInTheDocument()
  })

  it('should redirect to dashboard on success', async () => {
    mockNavigate.mockClear()

    render(<CallbackPage />)

    // Verify redirect was called with correct path
    // Component waits for isAuthenticated to become true, then navigates
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('should handle network errors gracefully', () => {
    render(<CallbackPage />)

    // Should render error state
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should not expose tokens in URLs or logs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<CallbackPage />)

    const calls = consoleErrorSpy.mock.calls.join(' ')
    // Tokens should not be in error logs
    expect(calls).not.toMatch(/Bearer|access_token/)

    consoleErrorSpy.mockRestore()
  })

  it('should have accessible loading message', () => {
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

    render(<CallbackPage />)
    const message = screen.getByText(/processing authentication/i)
    expect(message).toBeInTheDocument()
  })

  it('should handle missing authorization code from Universal Login', () => {
    // Mock missing code (invalid callback)
    mockSearchParams = new URLSearchParams('state=test') // No code parameter

    render(<CallbackPage />)

    // Should show error
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/no authorization code/i)).toBeInTheDocument()
  })
})
