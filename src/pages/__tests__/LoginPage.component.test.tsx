/* eslint-disable import/first */

// Setup mocks FIRST before any imports
jest.mock('../../hooks/useThemeColors', () => ({
  useThemeColors: () => ({
    primary: { main: '#667eea' },
    background: { primary: '#ffffff' },
    text: { primary: '#1f2937' },
  }),
}))

// Create persistent mock functions
const mockShowFn = jest.fn()
const mockDestroyFn = jest.fn()

jest.mock('auth0-lock', () => {
  return jest.fn((_clientId, _domain, _options) => {
    return {
      show: mockShowFn,
      destroy: mockDestroyFn,
      on: jest.fn(),
    }
  })
})

// Now import after mocks are set up
import Auth0Lock from 'auth0-lock'
import { render, screen } from '../../test-utils'
import { LoginPage } from '../LoginPage'

describe('LoginPage Component - TASK 1', () => {
  beforeEach(() => {
    // Set Auth0 environment variables for testing
    process.env.REACT_APP_AUTH0_CLIENT_ID = 'test-client-id'
    process.env.REACT_APP_AUTH0_DOMAIN = 'test-domain.auth0.com'

    // Reset call history but keep the mock functions
    mockShowFn.mockClear()
    mockDestroyFn.mockClear()
    ;(Auth0Lock as jest.Mock).mockClear()
  })

  // TEST 1: Component renders without crashing
  it('should render LoginPage without errors', () => {
    render(<LoginPage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  // TEST 2: Lock container element exists
  it('should render auth0-lock-container element', () => {
    render(<LoginPage />)

    const lockContainer = document.getElementById('auth0-lock-container')
    expect(lockContainer).toBeInTheDocument()
  })

  // TEST 3: Lock Widget initializes on mount
  it('should initialize Auth0 Lock on component mount', () => {
    render(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      process.env.REACT_APP_AUTH0_CLIENT_ID,
      process.env.REACT_APP_AUTH0_DOMAIN,
      expect.objectContaining({
        auth: expect.objectContaining({
          redirectUrl: expect.stringContaining('/callback'),
          responseType: 'code',
          scope: 'openid profile email',
        }),
        theme: expect.objectContaining({
          primaryColor: '#667eea',
        }),
        container: 'auth0-lock-container',
        allowedConnections: ['Username-Password-Authentication'],
        allowSignUp: false,
        allowForgotPassword: true,
      }),
    )
  })

  // TEST 4: Lock Widget destroyed on unmount
  it('should call lock.destroy() on component unmount', () => {
    const { unmount } = render(<LoginPage />)

    expect(mockDestroyFn).not.toHaveBeenCalled()

    unmount()

    expect(mockDestroyFn).toHaveBeenCalled()
  })

  // TEST 5: Primary color from design tokens applied
  it('should apply primary color from design tokens to Lock Widget', () => {
    render(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        theme: expect.objectContaining({
          primaryColor: '#667eea',
        }),
      }),
    )
  })

  // TEST 6: Lock.show() called
  it('should call lock.show() to display widget', () => {
    render(<LoginPage />)

    expect(mockShowFn).toHaveBeenCalled()
  })
})
