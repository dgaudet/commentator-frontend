/* eslint-disable import/first */

/**
 * LoginPage Auth Flow & Error Handling Tests - TASK 3
 * Tests authentication flow integration and error handling
 */

// Setup mocks FIRST before any imports
const mockOnFn = jest.fn()
const mockShowFn = jest.fn()
const mockDestroyFn = jest.fn()

jest.mock('../../hooks/useThemeColors', () => ({
  useThemeColors: jest.fn(() => ({
    primary: { main: '#667eea', dark: '#764ba2' },
    background: { primary: '#ffffff' },
    text: { primary: '#1f2937' },
  })),
}))

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

const mockHideFn = jest.fn()

jest.mock('auth0-lock', () => {
  return jest.fn(() => ({
    show: mockShowFn,
    destroy: mockDestroyFn,
    hide: mockHideFn,
    on: mockOnFn,
  }))
})

import Auth0Lock from 'auth0-lock'
import { renderWithRouter, screen } from '../../test-utils'
import { getDefaultAuthConfig } from '../../config/authConfig'
import { LoginPage } from '../LoginPage'

describe('LoginPage - Auth Flow & Error Handling (TASK 3)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnFn.mockClear()
    mockShowFn.mockClear()
    mockDestroyFn.mockClear()
    ;(Auth0Lock as jest.Mock).mockClear()
  })

  // TEST 1: Lock uses non-redirect mode to avoid PKCE state mismatch with SPA SDK
  it('should configure Lock in non-redirect mode', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        auth: expect.objectContaining({
          redirect: false,
          responseType: 'token id_token',
        }),
      }),
    )
  })

  // TEST 2: Lock uses correct auth scope and audience
  it('should request openid profile email scopes with audience', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        auth: expect.objectContaining({
          scope: 'openid profile email',
          params: expect.objectContaining({
            audience: 'https://test-api',
          }),
        }),
      }),
    )
  })

  // TEST 3: Lock disables signup (uses our /signup route instead)
  it('should disable Lock built-in signup', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        allowSignUp: false,
      }),
    )
  })

  // TEST 4: Lock allows forgot password
  it('should enable forgot password functionality', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        allowForgotPassword: true,
      }),
    )
  })

  // TEST 5: Lock uses Username-Password-Authentication connection only
  it('should only allow Username-Password-Authentication connection', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        allowedConnections: ['Username-Password-Authentication'],
      }),
    )
  })

  // TEST 6: Lock uses auth0-lock-container for rendering
  it('should configure Lock to render in auth0-lock-container', () => {
    renderWithRouter(<LoginPage />)

    expect(Auth0Lock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        container: 'auth0-lock-container',
      }),
    )
  })

  // TEST 7: Error when authConfig fails - graceful handling
  it('should handle auth config failure gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(getDefaultAuthConfig as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Missing required Auth0 configuration')
    })

    renderWithRouter(<LoginPage />)

    // Component should still render without crashing
    expect(screen.getByRole('main')).toBeInTheDocument()
    // Lock should not be initialized
    expect(Auth0Lock).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load Auth0 configuration:',
      expect.any(Error),
    )
    consoleSpy.mockRestore()
  })

  // TEST 8: Lock container element exists for Lock to render into
  it('should render the auth0-lock-container div for Lock', () => {
    renderWithRouter(<LoginPage />)

    const container = document.getElementById('auth0-lock-container')
    expect(container).toBeInTheDocument()
  })

  // TEST 9: Lock cleanup on unmount prevents memory leaks
  it('should destroy Lock instance on unmount', () => {
    const { unmount } = renderWithRouter(<LoginPage />)

    unmount()

    expect(mockDestroyFn).toHaveBeenCalledTimes(1)
  })

  // TEST 10: Signup link navigates to internal /signup route
  it('should have signup link pointing to /signup route', () => {
    renderWithRouter(<LoginPage />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  // TEST 11: Lock registers 'authenticated' event handler
  it('should register an authenticated event handler on Lock', () => {
    renderWithRouter(<LoginPage />)

    expect(mockOnFn).toHaveBeenCalledWith('authenticated', expect.any(Function))
  })
})
