/**
 * SignupForm Component
 * Form for user registration with validation
 * Reference: US-UR-002 through US-UR-007
 */

import React, { useState } from 'react'
import styles from './SignupForm.module.css'

interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validation will be added in Task 2
  }

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit} role="form">
      {/* First Name Field */}
      <div className={styles.formGroup}>
        <label htmlFor="firstName" className={styles.label}>
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
          placeholder="John"
          required
        />
        {errors.firstName && (
          <span className={styles.errorMessage}>{errors.firstName}</span>
        )}
      </div>

      {/* Last Name Field */}
      <div className={styles.formGroup}>
        <label htmlFor="lastName" className={styles.label}>
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
          placeholder="Doe"
          required
        />
        {errors.lastName && (
          <span className={styles.errorMessage}>{errors.lastName}</span>
        )}
      </div>

      {/* Email Field */}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="john.doe@example.com"
          required
        />
        {errors.email && (
          <span className={styles.errorMessage}>{errors.email}</span>
        )}
      </div>

      {/* Password Field */}
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          placeholder="••••••••"
          required
        />
        {errors.password && (
          <span className={styles.errorMessage}>{errors.password}</span>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
          placeholder="••••••••"
          required
        />
        {errors.confirmPassword && (
          <span className={styles.errorMessage}>{errors.confirmPassword}</span>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.submitButton}>
        Create Account
      </button>
    </form>
  )
}
