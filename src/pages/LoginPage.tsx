import { useEffect, useMemo } from 'react'
import Auth0Lock from 'auth0-lock'
import { useThemeColors } from '../hooks/useThemeColors'
import { getDefaultAuthConfig } from '../config/authConfig'
import styles from './LoginPage.module.css'

/**
 * LoginPage Component
 * Renders Auth0 Lock Widget for authentication
 *
 * Features:
 * - Lock Widget for secure login
 * - Design token theming (primary colors)
 * - Responsive layout
 * - Graceful error handling
 */
export const LoginPage: React.FC = () => {
  const { primary } = useThemeColors()

  // Get Auth0 configuration from centralized config
  let authConfig
  try {
    authConfig = getDefaultAuthConfig()
  } catch (error) {
    console.error('Failed to load Auth0 configuration:', error)
    authConfig = null
  }

  // Memoize Lock configuration to avoid unnecessary recalculation and effect re-runs
  const lockConfig = useMemo(() => {
    if (!authConfig) {
      return null
    }

    return {
      auth: {
        redirectUrl: authConfig.redirectUri,
        responseType: 'code' as const,
        scope: 'openid profile email',
      },
      theme: {
        primaryColor: primary.main,
      },
      container: 'auth0-lock-container',
      allowedConnections: ['Username-Password-Authentication'],
      allowSignUp: false,
      allowForgotPassword: true,
    }
  }, [authConfig, primary.main])

  useEffect(() => {
    if (!authConfig || !lockConfig) {
      return
    }

    const lock = new Auth0Lock(authConfig.clientId, authConfig.domain, lockConfig)

    lock.show()

    return () => {
      lock.destroy()
    }
  }, [authConfig, lockConfig])

  return (
    <main className={styles.container} role="main">
      <div className={styles.lockContainer} id="auth0-lock-container" />
    </main>
  )
}
