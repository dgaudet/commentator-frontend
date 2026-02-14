import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { typography, shadows } from '../theme/tokens'
import { useThemeColors } from '../hooks/useThemeColors'
import { useAuth } from '../contexts/AuthContext'
import styles from './CallbackPage.module.css'

export const CallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const themeColors = useThemeColors()

  const containerStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
  }), [themeColors])

  const cardStyle = useMemo(() => ({
    backgroundColor: themeColors.background.primary,
    boxShadow: shadows.lg,
  }), [themeColors])

  const errorCardStyle = useMemo(() => ({
    backgroundColor: themeColors.background.primary,
    boxShadow: shadows.lg,
    borderLeftColor: themeColors.semantic.error,
  }), [themeColors])

  const errorTitleStyle = useMemo(() => ({
    color: themeColors.semantic.error,
    fontSize: typography.fontSize.lg,
  }), [themeColors])

  const errorTextStyle = useMemo(() => ({
    color: themeColors.text.secondary,
  }), [themeColors])

  const buttonStyle = useMemo(() => ({
    backgroundColor: themeColors.primary.main,
    cursor: 'pointer',
  }), [themeColors])

  const spinnerStyle = useMemo(() => ({
    borderColor: `${themeColors.background.tertiary}`,
    borderTopColor: themeColors.primary.main,
  }), [themeColors])

  const cardTextStyle = useMemo(() => ({
    color: themeColors.text.primary,
  }), [themeColors])

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's an error from Auth0
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (errorParam) {
          setError(errorDescription || 'Authentication failed. Please try again.')
          setLoading(false)
          return
        }

        // Check if we have the authorization code
        const code = searchParams.get('code')
        if (!code) {
          setError('No authorization code received. Please try logging in again.')
          setLoading(false)
          return
        }

        // Auth0 SDK handles the token exchange via handleRedirectCallback
        // which is called in AuthContext. Wait a moment for auth to complete
        const maxWaitTime = 3000 // 3 seconds

        for (let elapsed = 0; elapsed < maxWaitTime; elapsed += 100) {
          if (isAuthenticated) {
            break
          }
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        if (isAuthenticated) {
          // Redirect to home page or return to specified location
          const returnTo = searchParams.get('returnTo') || '/'
          navigate(returnTo, { replace: true })
        } else {
          setError('Authentication timeout. Please try again.')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during authentication'
        setError(errorMessage)
        console.error('Callback error:', err)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [isAuthenticated, navigate, searchParams])

  if (error) {
    return (
      <main className={styles.container} style={containerStyle}>
        <div className={styles.errorCard} style={errorCardStyle}>
          <h1 style={errorTitleStyle}>Authentication Error</h1>
          <p role="alert" style={errorTextStyle}>{error}</p>
          <button
            onClick={() => {
              window.location.href = '/login'
            }}
            className={styles.button}
            style={{
              ...buttonStyle,
              opacity: 1,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = themeColors.primary.dark
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = themeColors.primary.main
            }}
          >
            Back to Login
          </button>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className={styles.container} style={containerStyle}>
        <div className={styles.card} style={cardStyle}>
          <div className={styles.spinner} style={spinnerStyle} />
          <p style={cardTextStyle}>Processing authentication...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.container} style={containerStyle}>
      <div className={styles.card} style={cardStyle}>
        <p style={cardTextStyle}>Redirecting...</p>
      </div>
    </main>
  )
}
