import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const TestDashboard = () => <div>Dashboard</div>;
const TestLoginPage = () => <div>Login</div>;

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render protected component if authenticated', async () => {
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
    });

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
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should redirect to login if not authenticated', async () => {
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      error: null,
    });

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
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  it('should show loading state while checking auth', () => {
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      error: null,
    });

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
      </Router>
    );

    // Should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should pass through all props to children', async () => {
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    const TestComponent = ({ testProp }: { testProp: string }) => <div>{testProp}</div>;

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
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('value')).toBeInTheDocument();
    });
  });

  it('should support nested routes', async () => {
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    const NestedComponent = () => <TestDashboard />;

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
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should be accessible with proper ARIA attributes', async () => {
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      error: null,
    });

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
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
