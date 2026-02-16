import { useEffect, useMemo } from 'react'
import Auth0Lock from 'auth0-lock'
import { useThemeColors } from '../hooks/useThemeColors'
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

  // Memoize Lock configuration to avoid unnecessary recalculation
  const lockConfig = useMemo(() => ({
    auth: {
      redirectUrl: `${window.location.origin}/callback`,
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
  }), [primary.main])

  useEffect(() => {
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
    const domain = process.env.REACT_APP_AUTH0_DOMAIN

    if (!clientId || !domain) {
      console.error('Auth0 configuration missing')
      return
    }

    const lock = new Auth0Lock(clientId, domain, lockConfig)

    lock.show()

    return () => {
      lock.destroy()
    }
  }, [lockConfig])

  return (
    <main className={styles.container} role="main">
      <div className={styles.lockContainer} id="auth0-lock-container" />
    </main>
  )
}
