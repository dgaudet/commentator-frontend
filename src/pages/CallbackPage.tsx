import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './CallbackPage.module.css'

export const CallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
          // Redirect to dashboard or home page
          const returnTo = searchParams.get('returnTo') || '/dashboard'
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
      <main className={styles.container}>
        <div className={styles.errorCard}>
          <h1>Authentication Error</h1>
          <p role="alert">{error}</p>
          <button
            onClick={() => {
              window.location.href = '/login'
            }}
            className={styles.button}
          >
            Back to Login
          </button>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.spinner} />
          <p>Processing authentication...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <p>Redirecting...</p>
      </div>
    </main>
  )
}
