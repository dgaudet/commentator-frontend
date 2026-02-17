/**
 * LoginPage Signup Link Tests
 * Tests for signup link on login page
 * Reference: US-UR-009
 */

/* eslint-disable import/first */

// Setup mocks FIRST before any imports
jest.mock('../../hooks/useThemeColors', () => ({
  useThemeColors: () => ({
    primary: { main: '#667eea' },
    background: { primary: '#ffffff' },
    text: { primary: '#1f2937' },
  }),
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

const mockShowFn = jest.fn()
const mockDestroyFn = jest.fn()

jest.mock('auth0-lock', () => {
  return jest.fn((_clientId, _domain, _options) => {
    return {
      show: mockShowFn,
      destroy: mockDestroyFn,
      hide: jest.fn(),
      on: jest.fn(),
    }
  })
})

// Now import after mocks are set up
import { renderWithRouter, screen } from '../../test-utils'
import { LoginPage } from '../LoginPage'

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    login: jest.fn(),
    loading: false,
    error: null,
    isAuthenticated: false,
  })),
}))

describe('LoginPage - Signup Link', () => {
  it('should display signup prompt on login page', () => {
    renderWithRouter(<LoginPage />)

    const signupPrompt = screen.getByText(/don't have an account/i)
    expect(signupPrompt).toBeInTheDocument()
  })

  it('should have a signup link', () => {
    renderWithRouter(<LoginPage />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    expect(signupLink).toBeInTheDocument()
  })

  it('should navigate to signup page when signup link is clicked', () => {
    renderWithRouter(<LoginPage />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should have correct link destination', () => {
    renderWithRouter(<LoginPage />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    expect(signupLink.getAttribute('href')).toBe('/signup')
  })

  it('should use React Router Link for navigation', () => {
    renderWithRouter(<LoginPage />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    // Link should not have target="_blank" or rel="noopener noreferrer"
    expect(signupLink).not.toHaveAttribute('target', '_blank')
    expect(signupLink).not.toHaveAttribute('rel', 'noopener noreferrer')
  })
})
