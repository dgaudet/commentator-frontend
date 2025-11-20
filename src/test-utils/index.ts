/**
 * Test Utilities Index
 * Central export point for test utilities and fixtures
 *
 * Usage:
 * import { render, renderMinimal, screen } from '@test-utils'
 * import { createMockSubject, createMockClass } from '@test-utils'
 */

// Re-export render functions from test-utils.tsx
export { render, renderMinimal } from '../test-utils'

// Re-export RTL utilities
export { screen, waitFor, fireEvent, within, cleanup, act } from '@testing-library/react'

// Export all fixture factories
export * from './fixtures'
