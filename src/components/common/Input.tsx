/**
 * Input Component
 * Form input with label, error handling, and accessibility features
 * Uses CSS :focus-visible for proper keyboard navigation and assistive technology support
 */
import React from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  required,
  className = '',
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#1E3A5F',
          marginBottom: '0.75rem',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#DC2626', marginLeft: '0.25rem' }}>*</span>
        )}
      </label>
      <input
        id={id}
        className={`input-field ${error ? 'input-error' : ''} ${className}`.trim()}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          border: error ? '2px solid #DC2626' : '2px solid #1E3A5F',
          borderRadius: '8px',
          backgroundColor: '#F5F8FA',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          outline: 'none',
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#DC2626',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
