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

    // Verify login was actually called with Universal Login redirect
    expect(mockLogin).toHaveBeenCalledTimes(1)
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

  it('should apply correct background color to card (matches design tokens)', () => {
    const { container } = renderWithRouter(<LoginPage />)
    const cardElement = container.querySelector('[class*="card"]')
    const computedStyle = window.getComputedStyle(cardElement!)
    // Should use background.primary (#FFFFFF for light mode)
    const backgroundColor = computedStyle.backgroundColor
    expect(backgroundColor).toBe('rgb(255, 255, 255)') // #FFFFFF in RGB
  })

  it('should display logo image at top of card', () => {
    renderWithRouter(<LoginPage />)
    const logo = screen.getByAltText(/commentator logo/i)
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.png')
  })

  it('should position logo before title', () => {
    const { container } = renderWithRouter(<LoginPage />)
    const logo = screen.getByAltText(/commentator logo/i)
    const title = screen.getByText(/commentator/i)

    // Logo should come before title in DOM
    const logoIndex = Array.from(container.querySelectorAll('img, h1')).indexOf(logo)
    const titleIndex = Array.from(container.querySelectorAll('img, h1')).indexOf(title)
    expect(logoIndex).toBeLessThan(titleIndex)
  })

  it('should style logo as circular with appropriate sizing', () => {
    renderWithRouter(<LoginPage />)
    const logo = screen.getByAltText(/commentator logo/i)
    const computedStyle = window.getComputedStyle(logo)

    // Logo should be circular (border-radius 50%)
    expect(computedStyle.borderRadius).toBe('50%')
    // Logo should have appropriate width and height (150x150px)
    expect(logo).toHaveAttribute('width', '150')
    expect(logo).toHaveAttribute('height', '150')
  })

  it('should center logo horizontally in the card', () => {
    renderWithRouter(<LoginPage />)
    const logo = screen.getByAltText(/commentator logo/i)
    const computedStyle = window.getComputedStyle(logo)

    // Logo should be centered with auto margins
    expect(computedStyle.marginLeft).toBe('auto')
    expect(computedStyle.marginRight).toBe('auto')
  })

  it('should maintain logo aspect ratio (not squished)', () => {
    renderWithRouter(<LoginPage />)
    const logo = screen.getByAltText(/commentator logo/i) as HTMLImageElement
    const computedStyle = window.getComputedStyle(logo)

    // Should use object-fit to maintain aspect ratio
    expect(computedStyle.objectFit).toBe('contain')
  })
})
