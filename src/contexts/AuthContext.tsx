import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Auth0Client } from '@auth0/auth0-spa-js'
import { setGetAccessToken, setCachedToken, setPublicEndpoints } from '../services/apiClient'
import { parseAuthError } from '../utils/authErrorHandler'
import { getDefaultAuthConfig, type AuthConfig } from '../config/authConfig'
import { getStoredCallbackParams, clearStoredCallbackParams } from '../utils/callbackHandler'

interface User {
  sub: string
  email: string
  name: string
  [key: string]: unknown
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
  accessToken: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  /**
   * Optional Auth0 configuration for dependency injection
   * If not provided, uses getDefaultAuthConfig() which reads from environment variables
   *
   * Useful for:
   * - Tests: Inject test configuration
   * - Development: Override configuration at runtime
   * - Multi-environment: Switch configs based on context
   */
  authConfig?: AuthConfig
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authConfig }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null)

  useEffect(() => {
    const initializeAuth0 = async () => {
      try {
        // Use injected config or get default from environment variables
        const config = authConfig || getDefaultAuthConfig()

        const client = new Auth0Client({
          domain: config.domain,
          clientId: config.clientId,
          authorizationParams: {
            redirect_uri: config.redirectUri,
            audience: config.audience,
            scope: 'openid profile email',
          },
        })

        setAuth0Client(client)

        // Register the getAccessToken function with the API client
        setGetAccessToken(() => client.getTokenSilently())

        // Configure public endpoints that don't require authentication
        // Prevents unnecessary token retrieval and reduces latency for unauthenticated flows
        setPublicEndpoints([
          '/api/users/create', // User signup endpoint
        ])

        // Check if we have callback parameters stored by the callback handler
        // The callback handler (public/callback/index.html) stores these when returning from Auth0
        // this is used when run in github pages as it doesn't properly work with SPA's
        const storedParams = getStoredCallbackParams()

        // Process the redirect if returning from Auth0 callback
        try {
          if (storedParams) {
            // We have stored callback parameters from the dedicated callback handler
            // Reconstruct the callback URL so Auth0 SDK can process it
            const callbackUrl = `${window.location.origin}${config.redirectUri}?code=${storedParams.code}&state=${storedParams.state}`

            // Use handleRedirectCallback with the stored parameters
            // The Auth0 SDK will parse the code and state and exchange them for tokens
            await client.handleRedirectCallback(callbackUrl)

            // Clear the stored parameters after successful processing
            clearStoredCallbackParams()
          } else {
            // No stored parameters - try normal callback flow (direct redirect from Auth0)
            await client.handleRedirectCallback()
          }
        } catch (err) {
          // handleRedirectCallback throws if not in callback flow - this is expected
          console.debug('Not in callback flow or already processed', err)
        }

        let isAuth = await client.isAuthenticated()

        // If not authenticated, try silent auth to discover sessions
        // established by external flows (e.g., Lock Widget in non-redirect mode)
        if (!isAuth) {
          try {
            await client.getTokenSilently()
            isAuth = await client.isAuthenticated()
          } catch {
            // No active session - user needs to log in
          }
        }

        setIsAuthenticated(isAuth)

        if (isAuth) {
          const userData = await client.getUser()
          if (userData) {
            setUser(userData as User)
          }

          const token = await client.getTokenSilently()
          if (token) {
            setAccessToken(token)
          }
        }
      } catch (err) {
        const authError = parseAuthError(err)
        setError(authError.message)
        console.error('Auth0 initialization error:', authError)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth0()
  }, [authConfig])

  // Sync access token changes with apiClient cache for optimization
  // This allows apiClient to use cached token instead of calling getTokenSilently() on every request
  useEffect(() => {
    if (accessToken) {
      // Token was updated - cache it for direct use in apiClient
      setCachedToken(accessToken)
    } else {
      // Token was cleared (logout)
      setCachedToken(null)
    }
  }, [accessToken])

  const login = useCallback(async () => {
    if (!auth0Client) return
    try {
      await auth0Client.loginWithRedirect()
    } catch (err) {
      const authError = parseAuthError(err)
      setError(authError.message)
      console.error('Login error:', authError)
    }
  }, [auth0Client])

  const logout = useCallback(async () => {
    if (!auth0Client) return
    try {
      setIsAuthenticated(false)
      setUser(null)
      setAccessToken(null)
      await auth0Client.logout({
        logoutParams: {
          returnTo: `${window.location.origin}/login`,
        },
      })
    } catch (err) {
      const authError = parseAuthError(err)
      setError(authError.message)
      console.error('Logout error:', authError)
    }
  }, [auth0Client])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!auth0Client) return null
    try {
      const token = await auth0Client.getTokenSilently()
      return token
    } catch (err) {
      const authError = parseAuthError(err)
      setError(authError.message)
      console.error('Get token error:', authError)
      return null
    }
  }, [auth0Client])

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    accessToken,
    login,
    logout,
    getAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
