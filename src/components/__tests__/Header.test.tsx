import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as AuthModule from '../../contexts/AuthContext'
import { Header } from '../Header'

const mockUseAuth = jest.spyOn(AuthModule, 'useAuth')

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
      user: {
        sub: 'auth0|123456',
        email: 'test@example.com',
        name: 'Test User',
      },
      accessToken: 'test-token',
      login: jest.fn(),
      logout: jest.fn(),
      getAccessToken: jest.fn(),
    })
  })

  afterAll(() => {
    mockUseAuth.mockRestore()
  })

  describe('Rendering', () => {
    it('should render header when authenticated', () => {
      render(<Header />)
      expect(screen.getByText('Commentator')).toBeInTheDocument()
    })

    it('should display user name', () => {
      render(<Header />)
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('should display user email', () => {
      render(<Header />)
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should not render when not authenticated', () => {
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

      const { container } = render(<Header />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Logout Button', () => {
    it('should render logout button', () => {
      render(<Header />)
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })

    it('should call logout when button is clicked', async () => {
      const mockLogout = jest.fn().mockResolvedValue(undefined)
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'test-token',
        login: jest.fn(),
        logout: mockLogout,
        getAccessToken: jest.fn(),
      })

      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await userEvent.click(logoutButton)

      expect(mockLogout).toHaveBeenCalled()
    })

    it('should show loading text while logging out', async () => {
      let resolveLogout: (() => void) | null = null
      const logoutPromise = new Promise<void>((resolve) => {
        resolveLogout = resolve
      })

      const mockLogout = jest.fn().mockReturnValue(logoutPromise)
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'test-token',
        login: jest.fn(),
        logout: mockLogout,
        getAccessToken: jest.fn(),
      })

      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await userEvent.click(logoutButton)

      // The button should show "Logging out..." text
      expect(screen.getByRole('button', { name: /logout/i })).toHaveTextContent('Logging out...')

      // Clean up
      if (resolveLogout) {
        resolveLogout()
      }
    })

    it('should disable logout button while logging out', async () => {
      let resolveLogout: (() => void) | null = null
      const logoutPromise = new Promise<void>((resolve) => {
        resolveLogout = resolve
      })

      const mockLogout = jest.fn().mockReturnValue(logoutPromise)
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'test-token',
        login: jest.fn(),
        logout: mockLogout,
        getAccessToken: jest.fn(),
      })

      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await userEvent.click(logoutButton)

      expect(logoutButton).toBeDisabled()

      // Clean up
      if (resolveLogout) {
        resolveLogout()
      }
    })
  })

  describe('Error Handling', () => {
    it('should display error message if logout fails', async () => {
      const mockLogout = jest.fn().mockRejectedValue(new Error('Logout failed'))
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'test-token',
        login: jest.fn(),
        logout: mockLogout,
        getAccessToken: jest.fn(),
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await userEvent.click(logoutButton)

      expect(screen.getByRole('alert')).toBeInTheDocument()

      consoleErrorSpy.mockRestore()
    })

    it('should re-enable button after error', async () => {
      const mockLogout = jest.fn().mockRejectedValue(new Error('Logout failed'))
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'test-token',
        login: jest.fn(),
        logout: mockLogout,
        getAccessToken: jest.fn(),
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await userEvent.click(logoutButton)

      // Button should be re-enabled after error
      expect(logoutButton).not.toBeDisabled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      expect(logoutButton).toHaveAttribute('aria-label', 'Logout')
    })

    it('should have semantic header element', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })

    it('should display error with proper alert role', async () => {
      const mockLogout = jest.fn().mockRejectedValue(new Error('Logout failed'))
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        error: null,
        user: {
          sub: 'auth0|123456',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'test-token',
        login: jest.fn(),
        logout: mockLogout,
        getAccessToken: jest.fn(),
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(<Header />)
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      await userEvent.click(logoutButton)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Styling', () => {
    it('should have correct CSS classes', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('.header')
      expect(header).toBeInTheDocument()

      const containerEl = container.querySelector('.container')
      expect(containerEl).toBeInTheDocument()
    })
  })
})
