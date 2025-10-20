/**
 * Input Component
 * Form input with label, error handling, and accessibility features
 */
import React from 'react'

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
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        id={id}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
