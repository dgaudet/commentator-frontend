import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { typography, shadows } from '../theme/tokens'
import { useThemeColors } from '../hooks/useThemeColors'
import { useAuth } from '../contexts/AuthContext'
import styles from './LoginPage.module.css'

export const LoginPage: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuth()
  const themeColors = useThemeColors()

  const containerStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
  }), [themeColors])

  const cardStyle = useMemo(() => ({
    backgroundColor: themeColors.background.secondary,
    boxShadow: shadows.lg,
  }), [themeColors])

  const titleStyle = useMemo(() => ({
    color: themeColors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  }), [themeColors])

  const subtitleStyle = useMemo(() => ({
    color: themeColors.text.secondary,
    fontSize: typography.fontSize.sm,
  }), [themeColors])

  const errorStyle = useMemo(() => ({
    backgroundColor: themeColors.semantic.errorLight,
    borderColor: themeColors.semantic.error,
    color: themeColors.semantic.error,
    fontSize: typography.fontSize.sm,
  }), [themeColors])

  const buttonStyle = useMemo(() => ({
    backgroundColor: themeColors.primary.main,
    color: themeColors.text.inverse,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  }), [themeColors])

  const signupPromptStyle = useMemo(() => ({
    color: themeColors.text.secondary,
    fontSize: typography.fontSize.sm,
  }), [themeColors])

  const linkStyle = useMemo(() => ({
    color: themeColors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  }), [themeColors])

  const handleLoginClick = async () => {
    await login()
  }

  if (isAuthenticated) {
    return (
      <main className={styles.container} style={containerStyle}>
        <div>Already authenticated</div>
      </main>
    )
  }

  return (
    <main className={styles.container} style={containerStyle}>
      <div className={styles.card} style={cardStyle}>
        <h1 className={styles.title} style={titleStyle}>
          Commentator
        </h1>
        <p className={styles.subtitle} style={subtitleStyle}>
          Student Report Comments Management
        </p>

        {error && (
          <div role="alert" className={styles.error} style={errorStyle}>
            {error}
          </div>
        )}

        <button
          onClick={handleLoginClick}
          disabled={loading}
          className={styles.loginButton}
          style={{
            ...buttonStyle,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid'
            e.currentTarget.style.outlineColor = themeColors.primary.main
            e.currentTarget.style.outlineOffset = '2px'
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = themeColors.primary.dark
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = themeColors.primary.main
          }}
          aria-label="Login with Auth0"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className={styles.signupPrompt} style={signupPromptStyle}>
          <p>
            Don't have an account?
            {' '}
            <Link
              to="/signup"
              style={linkStyle}
              className={styles.link}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid'
                e.currentTarget.style.outlineColor = themeColors.primary.main
                e.currentTarget.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
