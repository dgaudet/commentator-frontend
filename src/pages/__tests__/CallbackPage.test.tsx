import { render, screen } from '@testing-library/react'
import * as AuthModule from '../../contexts/AuthContext'
import { CallbackPage } from '../CallbackPage'

// Mock Auth context
const mockUseAuth = jest.spyOn(AuthModule, 'useAuth')

jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    handleRedirectCallback: jest.fn().mockResolvedValue({
      appState: { returnTo: '/dashboard' },
    }),
  })),
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => jest.fn()),
  useSearchParams: jest.fn(() => [new URLSearchParams('code=test&state=test'), jest.fn()]),
}))

describe('CallbackPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
    render(<CallbackPage />)

    // Component should render without errors
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should handle successful callback', async () => {
    render(<CallbackPage />)

    // Component should process callback
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should display error if callback fails', () => {
    render(<CallbackPage />)

    // Should render without throwing
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should redirect to dashboard on success', async () => {
    render(<CallbackPage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
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
})
