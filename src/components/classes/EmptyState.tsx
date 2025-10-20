/**
 * EmptyState Component
 * Displayed when no classes exist
 * Reference: TASK-4.2, US-CLASS-001, DES-4
 */
import React from 'react'
import { Button } from '../common/Button'

interface EmptyStateProps {
  onCreateFirst?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateFirst }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
      <p className="text-gray-500 mb-6">
        Get started by creating your first class to manage student comments.
      </p>
      {onCreateFirst && (
        <Button onClick={onCreateFirst} variant="primary">
          Create First Class
        </Button>
      )}
    </div>
  )
}
