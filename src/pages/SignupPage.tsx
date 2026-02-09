/**
 * SignupPage Component
 * Signup page with responsive layout: teacher image on left, form on right
 * Reference: US-UR-001
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { SignupForm } from '../components/auth/SignupForm'
import styles from './SignupPage.module.css'

export const SignupPage: React.FC = () => {
  return (
    <main className={styles.container} role="main">
      <div className={styles.signupContainer}>
        {/* Hero section with teacher image and background */}
        <div className={styles.signupHero}>
          <div className={styles.heroBackground} />
          {/* Teacher image would be added here via CSS background image */}
        </div>

        {/* Form section */}
        <div className={styles.signupFormSection}>
          <div className={styles.formWrapper}>
            <h2 className={styles.title}>Create Account</h2>

            {/* Signup form component */}
            <SignupForm />

            {/* Link to login page */}
            <div className={styles.loginLink}>
              <p>
                Already have an account?
                {' '}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
