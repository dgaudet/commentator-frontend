import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Auth0Client } from '@auth0/auth0-spa-js'
import { setGetAccessToken } from '../services/apiClient'
import { parseAuthError } from '../utils/authErrorHandler'

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
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null)

  useEffect(() => {
    const initializeAuth0 = async () => {
      try {
        const domain = import.meta.env.VITE_AUTH0_DOMAIN
        const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
        const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI
        const audience = import.meta.env.VITE_AUTH0_AUDIENCE

        if (!domain || !clientId || !redirectUri || !audience) {
          throw new Error('Missing required Auth0 configuration')
        }

        const client = new Auth0Client({
          domain,
          clientId,
          authorizationParams: {
            redirect_uri: redirectUri,
            audience,
            scope: 'openid profile email',
          },
        })

        setAuth0Client(client)

        // Register the getAccessToken function with the API client
        setGetAccessToken(() => client.getTokenSilently())

        const isAuth = await client.isAuthenticated()
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
  }, [])

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
