import React, { useCallback, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Header.module.css'

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    setError(null)
    try {
      await logout()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      console.error('Logout error:', err)
      setIsLoggingOut(false)
    }
  }, [logout])

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.title}>Commentator</h1>
        </div>

        <div className={styles.userSection}>
          {user && (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>

              {error && (
                <div className={styles.errorMessage} role="alert">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={styles.logoutButton}
                aria-label="Logout"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
