/**
 * SignupForm Component
 * Form for user registration with validation
 * Reference: US-UR-002 through US-UR-007
 */

import React, { useState } from 'react'
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../../utils/userValidators'
import { userService } from '../../services/api/userService'
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
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | undefined>()

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
    // Clear form-level error when user starts editing
    if (formError) {
      setFormError(undefined)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof FormErrors

    let error: string | undefined

    switch (name) {
      case 'firstName':
        error = validateFirstName(value)
        break
      case 'lastName':
        error = validateLastName(value)
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        break
      case 'confirmPassword':
        error = validatePasswordMatch(formData.password, value)
        break
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.firstName = validateFirstName(formData.firstName)
    newErrors.lastName = validateLastName(formData.lastName)
    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)
    newErrors.confirmPassword = validatePasswordMatch(
      formData.password,
      formData.confirmPassword,
    )

    setErrors(newErrors)

    // Form is valid if there are no errors
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setFormError(undefined)

    try {
      await userService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      // Success - will handle navigation in Task 4
      console.log('Account created successfully')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Account creation failed. Please try again.'
      setFormError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit} role="form">
      {/* Form-level error message */}
      {formError && <div className={styles.errorMessage}>{formError}</div>}

      {/* Loading indicator */}
      {isLoading && <div className={styles.loadingIndicator}>Creating account...</div>}

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
          onBlur={handleBlur}
          className={styles.input}
          placeholder="John"
          required
        />
        {errors.firstName && (
          <span className={styles.fieldError}>{errors.firstName}</span>
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
          onBlur={handleBlur}
          className={styles.input}
          placeholder="Doe"
          required
        />
        {errors.lastName && (
          <span className={styles.fieldError}>{errors.lastName}</span>
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
          onBlur={handleBlur}
          className={styles.input}
          placeholder="john.doe@example.com"
          required
        />
        {errors.email && (
          <span className={styles.fieldError}>{errors.email}</span>
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
          onBlur={handleBlur}
          className={styles.input}
          placeholder="••••••••"
          required
        />
        {errors.password && (
          <span className={styles.fieldError}>{errors.password}</span>
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
          onBlur={handleBlur}
          className={styles.input}
          placeholder="••••••••"
          required
        />
        {errors.confirmPassword && (
          <span className={styles.fieldError}>{errors.confirmPassword}</span>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
