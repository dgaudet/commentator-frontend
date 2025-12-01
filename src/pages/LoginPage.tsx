import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './LoginPage.module.css'

export const LoginPage: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuth()

  const handleLoginClick = async () => {
    await login()
  }

  if (isAuthenticated) {
    return (
      <main className={styles.container}>
        <div>Already authenticated</div>
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Commentator</h1>
        <p className={styles.subtitle}>Student Report Comments Management</p>

        {error && (
          <div role="alert" className={styles.error}>
            {error}
          </div>
        )}

        <button
          onClick={handleLoginClick}
          disabled={loading}
          className={styles.loginButton}
          aria-label="Login with Auth0"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className={styles.signupPrompt}>
          <p>
            Don't have an account?
            {' '}
            <a href="https://auth0.com" target="_blank" rel="noopener noreferrer">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
