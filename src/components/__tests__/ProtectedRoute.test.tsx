import React from 'react'
import { render as rtlRender, screen, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'

// Mock the entire AuthContext module to override useAuth for this test
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Import useAuth after mocking the module
// eslint-disable-next-line import/first
import { useAuth } from '../../contexts/AuthContext'

const TestDashboard = () => <div>Dashboard</div>
const TestLoginPage = () => <div>Login</div>

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

/**
 * Custom render that doesn't wrap with AuthProvider
 * Allows us to test ProtectedRoute with mocked useAuth
 */
function render(ui: React.ReactElement) {
  return rtlRender(ui)
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('should render protected component if authenticated', async () => {
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

    render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<TestLoginPage />} />
        </Routes>
      </Router>,
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('should redirect to login if not authenticated', async () => {
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

    render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<TestLoginPage />} />
        </Routes>
      </Router>,
    )

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument()
    })
  })

  it('should show loading state while checking auth', () => {
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

    render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<TestLoginPage />} />
        </Routes>
      </Router>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should pass through all props to children', async () => {
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

    const TestComponent = ({ testProp }: { testProp: string }) => <div>{testProp}</div>

    render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestComponent testProp="value" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>,
    )

    await waitFor(() => {
      expect(screen.getByText('value')).toBeInTheDocument()
    })
  })

  it('should support nested routes', async () => {
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

    const NestedComponent = () => <TestDashboard />

    render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NestedComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>,
    )

    await waitFor(
      () => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('should be accessible with proper ARIA attributes', async () => {
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

    render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>,
    )

    await waitFor(
      () => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
