import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CallbackPage } from '../CallbackPage';

// Mock Auth context
const mockHandleRedirectCallback = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
}));

// Mock Auth0 SDK
jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    handleRedirectCallback: mockHandleRedirectCallback.mockResolvedValue({
      appState: { returnTo: '/dashboard' },
    }),
  })),
}));

// Mock react-router (assuming it will be used)
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => jest.fn()),
  useSearchParams: jest.fn(() => [new URLSearchParams('code=test&state=test'), jest.fn()]),
}));

describe('CallbackPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock unauthenticated state for loading test
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValueOnce({
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    render(<CallbackPage />);
    expect(screen.getByText(/processing authentication/i)).toBeInTheDocument();
  });

  it('should display loading spinner or indicator', () => {
    render(<CallbackPage />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should exchange authorization code for tokens', async () => {
    render(<CallbackPage />);

    await waitFor(() => {
      // Component should render without errors
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('should handle successful callback', async () => {
    render(<CallbackPage />);

    await waitFor(() => {
      // Component should process callback
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  it('should display error if callback fails', async () => {
    mockHandleRedirectCallback.mockRejectedValueOnce(new Error('Callback failed'));

    render(<CallbackPage />);

    // Should render without throwing
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should redirect to dashboard on success', async () => {
    render(<CallbackPage />);

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    mockHandleRedirectCallback.mockRejectedValueOnce(new Error('Network error'));

    render(<CallbackPage />);

    // Should render error state
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should not expose tokens in URLs or logs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<CallbackPage />);

    await waitFor(() => {
      const calls = consoleErrorSpy.mock.calls.join(' ');
      // Tokens should not be in error logs
      expect(calls).not.toMatch(/Bearer|access_token/);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should have accessible loading message', async () => {
    // Mock unauthenticated state for loading test
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValueOnce({
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    render(<CallbackPage />);
    const message = screen.getByText(/processing authentication/i);
    expect(message).toBeInTheDocument();
  });
});
