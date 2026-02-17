import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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
  const { primary, text } = useThemeColors()
  const lockRef = useRef<Auth0Lock | null>(null)

  useEffect(() => {
    // Get Auth0 configuration from centralized config
    let authConfig
    try {
      authConfig = getDefaultAuthConfig()
    } catch (error) {
      console.error('Failed to load Auth0 configuration:', error)
      return
    }

    const lock = new Auth0Lock(authConfig.clientId, authConfig.domain, {
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
    })

    lockRef.current = lock

    // Defer show() to the next frame so React finishes committing the
    // container div to the DOM before Lock starts manipulating it
    const frameId = requestAnimationFrame(() => {
      lock.show()
    })

    return () => {
      cancelAnimationFrame(frameId)
      lock.destroy()
      lockRef.current = null
    }
  // Only run on mount/unmount - Lock manages its own DOM
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={styles.container} role="main">
      <div className={styles.contentWrapper}>
        <div className={styles.lockContainer} id="auth0-lock-container" />
        <div className={styles.signupPrompt} style={{ color: text.primary }}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: primary.main }}>Sign Up</Link>
        </div>
      </div>
    </main>
  )
}
