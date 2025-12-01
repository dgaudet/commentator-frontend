# Frontend Authentication Documentation

## Overview

This document describes the Auth0 integration for the Commentator frontend application. The authentication system handles user login, token management, and protected routes.

## Architecture

### Authentication Flow

```
User lands on app
    ↓
AuthProvider initializes Auth0 client
    ↓
If authenticated: Show protected content
If not authenticated: Redirect to LoginPage
    ↓
User clicks Login → Auth0 redirect
    ↓
Auth0 redirects to CallbackPage with authorization code
    ↓
CallbackPage exchanges code for tokens
    ↓
AuthContext updates state
    ↓
User redirected to dashboard
```

### Component Hierarchy

```
App (Router + AuthProvider)
├── LoginPage (public route)
├── CallbackPage (public route)
├── ProtectedRoute
│   └── Header (displays user info + logout)
│       └── AppContent (main application)
└── AuthProvider (global context)
    └── useAuth hook (for component integration)
```

## Setup

### 1. Environment Variables

Create a `.env` file with:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback
VITE_AUTH0_AUDIENCE=https://api.commentator.com
VITE_API_BASE_URL=http://localhost:3001/api
```

### 2. Install Dependencies

```bash
npm install @auth0/auth0-spa-js @auth0/auth0-react react-router-dom axios
```

### 3. Configure Auth0

1. Go to [auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure callback URLs: `http://localhost:3000/callback`
4. Configure logout URLs: `http://localhost:3000/login`
5. Copy Domain, Client ID, and Client Secret

## API Reference

### AuthContext

Global context providing authentication state and methods.

#### useAuth Hook

```typescript
const {
  isAuthenticated,  // boolean - whether user is logged in
  user,             // User object or null
  loading,          // boolean - auth state is loading
  error,            // string or null - error message
  accessToken,      // JWT token or null
  login,            // () => Promise<void> - initiate login
  logout,           // () => Promise<void> - logout user
  getAccessToken,   // () => Promise<string | null> - get current token
} = useAuth()
```

#### Example Usage

```typescript
import { useAuth } from '../contexts/AuthContext'

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### ProtectedRoute Component

Wraps routes that require authentication.

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Header Component

Displays user information and logout button. Only renders when authenticated.

```typescript
<Header />
```

### API Client

Axios instance with automatic token injection and refresh logic.

#### Features

- Automatically adds Authorization header to all requests
- Handles 401 errors with token refresh
- Implements retry mechanism
- Graceful error handling

#### Usage

```typescript
import apiClient from '../services/apiClient'

// Token is automatically added
const response = await apiClient.get('/api/subjects')
```

## Error Handling

### Error Types

The `authErrorHandler` utility provides structured error handling:

```typescript
import { parseAuthError, isRecoverableError } from '../utils/authErrorHandler'

try {
  await someAuthOperation()
} catch (err) {
  const error = parseAuthError(err)
  console.error(error.code, error.message)

  if (isRecoverableError(error.code)) {
    // Retry logic
  }
}
```

#### Error Codes

- `INVALID_STATE`: State mismatch (recoverable)
- `UNAUTHORIZED`: Invalid credentials (user error)
- `ACCOUNT_LOCKED`: Account locked (fatal)
- `NETWORK_ERROR`: Network issue (recoverable)
- `TIMEOUT`: Request timeout (recoverable)
- `AUTH_ERROR`: Generic auth error
- `UNKNOWN_ERROR`: Unknown error

### Token Refresh

Tokens are automatically refreshed when:
- API returns 401 status
- Token has expired
- Silent token refresh is triggered

## Security

### Best Practices

1. **Never expose tokens in logs**
   - The system logs errors without including tokens
   - Tokens are stored securely in browser memory

2. **HTTPS in production**
   - Auth0 callback URLs must use HTTPS
   - All API calls should use HTTPS

3. **Environment variables**
   - Never commit `.env` files
   - Use `.env.example` as template

4. **Token storage**
   - Tokens are stored in browser memory (not localStorage)
   - Automatically cleared on logout

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/contexts/__tests__/AuthContext.test.tsx

# Run with coverage
npm test -- --coverage
```

### Test Coverage

Current test coverage:
- AuthContext: 13 tests
- LoginPage: 12 tests
- CallbackPage: 9 tests
- ProtectedRoute: 6 tests
- Header: 14 tests
- Error Handler: 20 tests

Total: 74 authentication tests passing

## Troubleshooting

### Common Issues

#### "Missing required Auth0 configuration"
- Check all `VITE_AUTH0_*` environment variables are set
- Verify `.env` file exists and is not in `.gitignore` (locally only)

#### "Unauthorized: Invalid credentials"
- Verify Auth0 credentials in environment variables
- Check Auth0 application settings
- Ensure callback URL matches Auth0 configuration

#### "Authentication timeout"
- Check network connectivity
- Verify Auth0 service is accessible
- Increase timeout if needed (currently 3 seconds)

#### Token refresh fails
- Check API is responding correctly
- Verify token expiration settings
- Check network connectivity

### Debugging

Enable debug logging by adding to AuthContext:

```typescript
console.log('Auth state:', {
  isAuthenticated,
  user,
  error,
  accessToken: accessToken ? 'set' : 'null',
})
```

## Migration Guide

### From No Auth to Auth0

1. Wrap App with `AuthProvider`
2. Wrap protected routes with `ProtectedRoute`
3. Use `useAuth()` hook in components that need auth
4. Update API calls to use authenticated `apiClient`
5. Test authentication flow

## Performance Considerations

### Optimization

- AuthContext uses `useCallback` to prevent unnecessary re-renders
- Token refresh happens silently without affecting UI
- Header component only renders when authenticated
- ProtectedRoute shows loading state during auth check

## Future Enhancements

Potential improvements:

- [ ] Implement session persistence across page refreshes
- [ ] Add refresh token rotation
- [ ] Implement concurrent request handling for token refresh
- [ ] Add rate limiting for failed login attempts
- [ ] Implement biometric authentication
- [ ] Add device fingerprinting
- [ ] Implement step-up authentication for sensitive operations

## References

- [Auth0 SPA SDK Documentation](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-native-apps)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Project Architecture](./ARCHITECTURE.md)

## Support

For issues or questions:
1. Check this documentation
2. Review error messages and logs
3. Check Auth0 dashboard for application settings
4. Review test files for usage examples
