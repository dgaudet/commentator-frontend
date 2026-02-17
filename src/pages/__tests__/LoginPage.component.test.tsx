/* eslint-disable import/first */

// Setup mocks FIRST before any imports
jest.mock('../../hooks/useThemeColors', () => ({
  useThemeColors: () => ({
    primary: { main: '#667eea' },
    background: { primary: '#ffffff' },
    text: { primary: '#1f2937' },
  }),
}))

// Mock authConfig to return test configuration
jest.mock('../../config/authConfig', () => ({
  getDefaultAuthConfig: jest.fn(() => ({
    clientId: 'test-client-id',
    domain: 'test-domain.auth0.com',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://test-api',
  })),
  createTestAuthConfig: jest.fn(() => ({
    clientId: 'test-client-id-12345',
    domain: 'test.auth0.com',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://test-api',
  })),
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
import { renderWithRouter, screen } from '../../test-utils'
import { LoginPage } from '../LoginPage'

describe('LoginPage Component - TASK 1', () => {
  beforeEach(() => {
    // Reset call history but keep the mock functions
    mockShowFn.mockClear()
    mockDestroyFn.mockClear()
    ;(Auth0Lock as jest.Mock).mockClear()
  })

  // TEST 1: Component renders without crashing
  it('should render LoginPage without errors', () => {
    renderWithRouter(<LoginPage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  // TEST 2: Lock container element exists
  it('should render auth0-lock-container element', () => {
    renderWithRouter(<LoginPage />)

    const lockContainer = document.getElementById('auth0-lock-container')
    expect(lockContainer).toBeInTheDocument()
  })

  // TEST 3: Lock Widget initializes on mount
  it('should initialize Auth0 Lock on component mount', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      'test-client-id',
      'test-domain.auth0.com',
      expect.objectContaining({
        auth: expect.objectContaining({
          redirectUrl: 'http://localhost:3000/callback',
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
    const { unmount } = renderWithRouter(<LoginPage />)

    expect(mockDestroyFn).not.toHaveBeenCalled()

    // Wrap unmount in act() to avoid React warnings about unmounting during render
    unmount()

    // Verify destroy was called after unmount completes
    expect(mockDestroyFn).toHaveBeenCalled()
  })

  // TEST 5: Primary color from design tokens applied
  it('should apply primary color from design tokens to Lock Widget', () => {
    renderWithRouter(<LoginPage />)

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

  // TEST 6: Lock.show() called (deferred via requestAnimationFrame)
  it('should call lock.show() to display widget', async () => {
    jest.useFakeTimers()
    renderWithRouter(<LoginPage />)

    // lock.show() is deferred to next animation frame to avoid React render conflicts
    jest.runAllTimers()

    expect(mockShowFn).toHaveBeenCalled()
    jest.useRealTimers()
  })
})
