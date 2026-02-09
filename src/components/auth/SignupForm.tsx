/**
 * SignupForm Component
 * Form for user registration with validation
 * Reference: US-UR-002 through US-UR-007
 * Uses design tokens for theme-aware styling (US-TOKEN-011)
 */

import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useThemeFocusShadows } from '../../hooks/useThemeFocusShadows'
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../../utils/userValidators'
import { userService } from '../../services/api/userService'

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
  const navigate = useNavigate()
  const themeColors = useThemeColors()
  const focusShadows = useThemeFocusShadows()
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
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const lastNameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null)

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

  const createInputStyle = (hasError: boolean) => ({
    display: 'block',
    padding: `${spacing.md} ${spacing.md}`,
    fontSize: typography.fontSize.sm,
    border: `${borders.width.thin} solid ${hasError ? themeColors.semantic.error : themeColors.border.default}`,
    borderRadius: borders.radius.md,
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    backgroundColor: themeColors.background.secondary,
    lineHeight: typography.lineHeight.normal,
    minHeight: '44px',
    color: themeColors.text.primary,
  })

  const handleInputFocus = (hasError: boolean) => (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const focusColor = hasError ? themeColors.semantic.error : themeColors.primary.main
    const focusShadowColor = hasError ? focusShadows.error : focusShadows.primary

    e.currentTarget.style.outline = 'none'
    e.currentTarget.style.borderColor = focusColor
    e.currentTarget.style.boxShadow = `0 0 0 3px ${focusShadowColor}`
  }

  const handleInputBlur = (hasError: boolean) => (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const borderColor = hasError ? themeColors.semantic.error : themeColors.border.default

    e.currentTarget.style.borderColor = borderColor
    e.currentTarget.style.boxShadow = 'none'
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

      // Success - redirect to login page
      navigate('/login')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Account creation failed. Please try again.'
      setFormError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
      }}
      onSubmit={handleSubmit}
      role="form"
    >
      {/* Form-level error message */}
      {formError && (
        <div
          style={{
            padding: `${spacing.md} ${spacing.md}`,
            backgroundColor: themeColors.semantic.errorLight,
            border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
            borderRadius: borders.radius.md,
            color: themeColors.semantic.error,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {formError}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div
          style={{
            padding: `${spacing.md} ${spacing.md}`,
            backgroundColor: `${themeColors.primary.main}20`,
            border: `${borders.width.thin} solid ${themeColors.primary.main}`,
            borderRadius: borders.radius.md,
            color: themeColors.primary.main,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          Creating account...
        </div>
      )}

      {/* First Name Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <label
          htmlFor="firstName"
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            display: 'block',
            lineHeight: typography.lineHeight.tight,
          }}
        >
          First Name
        </label>
        <input
          ref={firstNameInputRef}
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={(e) => {
            handleBlur(e)
            handleInputBlur(Boolean(errors.firstName))(e)
          }}
          onFocus={handleInputFocus(Boolean(errors.firstName))}
          style={createInputStyle(Boolean(errors.firstName))}
          placeholder="John"
          required
        />
        {errors.firstName && (
          <span
            style={{
              fontSize: typography.fontSize.xs,
              color: themeColors.semantic.error,
              display: 'block',
              marginTop: `-${spacing.sm}`,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            {errors.firstName}
          </span>
        )}
      </div>

      {/* Last Name Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <label
          htmlFor="lastName"
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            display: 'block',
            lineHeight: typography.lineHeight.tight,
          }}
        >
          Last Name
        </label>
        <input
          ref={lastNameInputRef}
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={(e) => {
            handleBlur(e)
            handleInputBlur(Boolean(errors.lastName))(e)
          }}
          onFocus={handleInputFocus(Boolean(errors.lastName))}
          style={createInputStyle(Boolean(errors.lastName))}
          placeholder="Doe"
          required
        />
        {errors.lastName && (
          <span
            style={{
              fontSize: typography.fontSize.xs,
              color: themeColors.semantic.error,
              display: 'block',
              marginTop: `-${spacing.sm}`,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            {errors.lastName}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <label
          htmlFor="email"
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            display: 'block',
            lineHeight: typography.lineHeight.tight,
          }}
        >
          Email
        </label>
        <input
          ref={emailInputRef}
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={(e) => {
            handleBlur(e)
            handleInputBlur(Boolean(errors.email))(e)
          }}
          onFocus={handleInputFocus(Boolean(errors.email))}
          style={createInputStyle(Boolean(errors.email))}
          placeholder="john.doe@example.com"
          required
        />
        {errors.email && (
          <span
            style={{
              fontSize: typography.fontSize.xs,
              color: themeColors.semantic.error,
              display: 'block',
              marginTop: `-${spacing.sm}`,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            {errors.email}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <label
          htmlFor="password"
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            display: 'block',
            lineHeight: typography.lineHeight.tight,
          }}
        >
          Password
        </label>
        <input
          ref={passwordInputRef}
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={(e) => {
            handleBlur(e)
            handleInputBlur(Boolean(errors.password))(e)
          }}
          onFocus={handleInputFocus(Boolean(errors.password))}
          style={createInputStyle(Boolean(errors.password))}
          placeholder="••••••••"
          required
        />
        {errors.password && (
          <span
            style={{
              fontSize: typography.fontSize.xs,
              color: themeColors.semantic.error,
              display: 'block',
              marginTop: `-${spacing.sm}`,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            {errors.password}
          </span>
        )}
      </div>

      {/* Confirm Password Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <label
          htmlFor="confirmPassword"
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            display: 'block',
            lineHeight: typography.lineHeight.tight,
          }}
        >
          Confirm Password
        </label>
        <input
          ref={confirmPasswordInputRef}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={(e) => {
            handleBlur(e)
            handleInputBlur(Boolean(errors.confirmPassword))(e)
          }}
          onFocus={handleInputFocus(Boolean(errors.confirmPassword))}
          style={createInputStyle(Boolean(errors.confirmPassword))}
          placeholder="••••••••"
          required
        />
        {errors.confirmPassword && (
          <span
            style={{
              fontSize: typography.fontSize.xs,
              color: themeColors.semantic.error,
              display: 'block',
              marginTop: `-${spacing.sm}`,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: `${spacing.md} ${spacing.md}`,
          marginTop: spacing.sm,
          backgroundColor: themeColors.primary.main,
          color: themeColors.text.inverse,
          border: 'none',
          borderRadius: borders.radius.md,
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoading ? 0.6 : 1,
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '3px solid'
          e.currentTarget.style.outlineColor = themeColors.primary.main
          e.currentTarget.style.outlineOffset = '2px'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
