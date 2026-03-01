import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { typography, shadows, borders, spacing } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import styles from './NotFound.module.css'

export default function NotFound() {
  const themeColors = useThemeColors()

  const containerStyle = useMemo(() => ({
    minHeight: '100vh',
    display: 'flex' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  }), [])

  const contentStyle = useMemo(() => ({
    textAlign: 'center' as const,
    padding: spacing.xl,
    backgroundColor: themeColors.background.primary,
    borderRadius: borders.radius.lg,
    boxShadow: shadows.lg,
    maxWidth: '500px',
    border: `${borders.width.thin} solid ${themeColors.border.default}`,
  }), [themeColors])

  const headingStyle = useMemo(() => ({
    color: themeColors.text.primary,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    margin: 0,
    marginBottom: spacing.md,
  }), [themeColors])

  const messageStyle = useMemo(() => ({
    color: themeColors.text.secondary,
    fontSize: typography.fontSize.base,
    margin: 0,
    marginBottom: spacing.lg,
    lineHeight: '1.6',
  }), [themeColors])

  const linkStyle = useMemo(() => ({
    display: 'inline-block',
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: themeColors.primary.main,
    color: themeColors.text.inverse,
    textDecoration: 'none',
    borderRadius: borders.radius.md,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    border: `${borders.width.thin} solid transparent`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  }), [themeColors])

  return (
    <main className={styles.container} style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headingStyle}>404</h1>
        <h2 style={headingStyle}>Page Not Found</h2>
        <p style={messageStyle}>
          Sorry, the page you are looking for doesn't exist.
        </p>
        <Link to="/" style={linkStyle}>
          Back to Home
        </Link>
      </div>
    </main>
  )
}
