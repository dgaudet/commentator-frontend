/**
 * LoadingSpinner Component
 * Loading indicator with accessibility features
 */
import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-8"
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
      />
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  )
}
