/**
 * Shared Modal Component Styles
 * US-MODAL-STYLE-002, US-MODAL-STYLE-003, US-MODAL-STYLE-004
 *
 * Centralized styling constants for modal components to ensure consistency
 * and reduce duplication across OutcomeComments, PersonalizedComments, and ClassManagement
 */

import React from 'react'

export const modalStyles = {
  // Container styles
  container: {
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
  } as React.CSSProperties,

  // Section spacing
  section: {
    marginBottom: '2rem',
  } as React.CSSProperties,

  // Typography
  heading: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '1rem',
  } as React.CSSProperties,

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
  } as React.CSSProperties,

  requiredIndicator: {
    color: '#DC2626',
  } as React.CSSProperties,

  // Input fields
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    resize: 'vertical' as const,
  } as React.CSSProperties,

  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  } as React.CSSProperties,

  // Form layout
  formGroup: {
    marginBottom: '1rem',
  } as React.CSSProperties,

  flexRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  } as React.CSSProperties,

  flexItem: {
    flex: 1,
  } as React.CSSProperties,

  // Validation and feedback
  validationError: {
    padding: '0.75rem',
    marginBottom: '1rem',
    backgroundColor: '#FEE2E2',
    border: '1px solid #DC2626',
    borderRadius: '8px',
    color: '#DC2626',
    fontSize: '0.875rem',
  } as React.CSSProperties,

  characterCounter: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    textAlign: 'right' as const,
  } as React.CSSProperties,

  characterCountValid: {
    color: '#10B981',
  } as React.CSSProperties,

  characterCountInvalid: {
    color: '#DC2626',
  } as React.CSSProperties,

  characterCountHint: {
    color: '#6B7280',
  } as React.CSSProperties,

  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px dashed #E5E7EB',
  } as React.CSSProperties,

  emptyStateText: {
    margin: 0,
    fontSize: '1rem',
    color: '#6B7280',
  } as React.CSSProperties,

  emptyStateSubtext: {
    margin: '0.5rem 0 0',
    fontSize: '0.875rem',
    color: '#9CA3AF',
  } as React.CSSProperties,

  // Comment/Item cards
  itemCard: {
    padding: '1.5rem',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
  } as React.CSSProperties,

  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  } as React.CSSProperties,

  itemContent: {
    fontSize: '1rem',
    color: '#111827',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
  } as React.CSSProperties,

  itemMeta: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginBottom: '1rem',
  } as React.CSSProperties,

  itemMetaMedium: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  // Button layouts
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  } as React.CSSProperties,

  buttonGroupWrap: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
}
