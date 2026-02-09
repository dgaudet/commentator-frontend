/**
 * SignupPage Component
 * Signup page with responsive layout: teacher image on left, form on right
 * Reference: US-UR-001
 * Uses design tokens for theme-aware styling (US-TOKEN-011)
 */

import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { spacing, typography, shadows } from '../theme/tokens'
import { useThemeColors } from '../hooks/useThemeColors'
import { useThemeGradients } from '../hooks/useThemeGradients'
import { SignupForm } from '../components/auth/SignupForm'
import styles from './SignupPage.module.css'

export const SignupPage: React.FC = () => {
  const themeColors = useThemeColors()
  const themeGradients = useThemeGradients()

  const containerStyle = useMemo(() => ({
    background: themeGradients.primary,
  }), [themeGradients])

  const signupContainerStyle = useMemo(() => ({
    gap: spacing.xl,
  }), [])

  const signupHeroStyle = useMemo(() => ({
    background: themeGradients.primary,
  }), [themeGradients])

  const formWrapperStyle = useMemo(() => ({
    backgroundColor: themeColors.background.secondary,
    boxShadow: shadows.lg,
    padding: spacing.xl,
  }), [themeColors])

  const titleStyle = useMemo(() => ({
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: themeColors.text.primary,
    lineHeight: typography.lineHeight.tight,
  }), [themeColors])

  const loginLinkStyle = useMemo(() => ({
    fontSize: typography.fontSize.sm,
    color: themeColors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  }), [themeColors])

  const linkStyle = useMemo(() => ({
    color: themeColors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  }), [themeColors])

  return (
    <main className={styles.container} style={containerStyle} role="main">
      <div className={styles.signupContainer} style={signupContainerStyle}>
        {/* Hero section with teacher image and background */}
        <div className={styles.signupHero} style={signupHeroStyle}>
          <div className={styles.heroBackground} />
        </div>

        {/* Form section */}
        <div className={styles.signupFormSection}>
          <div className={styles.formWrapper} style={formWrapperStyle}>
            <h2 className={styles.title} style={titleStyle}>
              Create Account
            </h2>

            {/* Signup form component */}
            <SignupForm />

            {/* Link to login page */}
            <div className={styles.loginLink} style={loginLinkStyle}>
              <p>
                Already have an account?
                {' '}
                <Link
                  to="/login"
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
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
