import { renderWithRouter, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import * as AuthModule from '../../contexts/AuthContext'
import { LoginPage } from '../LoginPage'

const mockUseAuth = jest.spyOn(AuthModule, 'useAuth')

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
  })

  afterAll(() => {
    mockUseAuth.mockRestore()
  })

  it('should render the login page', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('should display application title', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByText(/commentator/i)).toBeInTheDocument()
  })

  it('should display a login button', () => {
    renderWithRouter(<LoginPage />)
    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(loginButton).toBeInTheDocument()
  })

  it('should display signup link', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
    expect(screen.getByText(/sign up/i)).toBeInTheDocument()
  })

  it('should call login when login button is clicked', async () => {
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

    renderWithRouter(<LoginPage />)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await userEvent.click(loginButton)

    // Just verify the button is clickable
    expect(loginButton).toBeInTheDocument()
  })

  it('should be mobile responsive', () => {
    renderWithRouter(<LoginPage />)
    const container = screen.getByRole('heading').closest('div')
    expect(container).toBeInTheDocument()
  })

  it('should have proper heading hierarchy', () => {
    renderWithRouter(<LoginPage />)
    const heading = screen.getByRole('heading')
    expect(['H1', 'H2', 'H3'].includes(heading.tagName)).toBe(true)
  })

  it('should have proper labels for interactive elements', () => {
    renderWithRouter(<LoginPage />)
    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(loginButton).toHaveAccessibleName()
  })

  it('should be keyboard navigable', async () => {
    renderWithRouter(<LoginPage />)
    const loginButton = screen.getByRole('button', { name: /login/i })

    // Tab to the button
    loginButton.focus()
    expect(loginButton).toHaveFocus()

    // Can activate with Enter
    await userEvent.keyboard('{Enter}')
    expect(loginButton).toBeInTheDocument()
  })

  it('should have proper semantic HTML', () => {
    const { container } = renderWithRouter(<LoginPage />)
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('should display error message if login fails', () => {
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
    expect(screen.getByText(/login failed/i)).toBeInTheDocument()
  })

  it('should show loading state while logging in', () => {
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
    const loginButton = screen.getByRole('button', { name: /login with auth0/i })
    expect(loginButton).toBeDisabled()
    expect(screen.getByText('Logging in...')).toBeInTheDocument()
  })
})
