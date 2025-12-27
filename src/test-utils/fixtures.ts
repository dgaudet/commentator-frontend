/**
 * Test Fixtures Factory
 *
 * Story 5 Optimization: Lightweight mocking
 *
 * Provides factory functions to create minimal test data instead of
 * loading large fixtures or datasets. Each factory creates only the
 * fields needed for that specific test.
 *
 * Usage:
 * import { createMockSubject, createMockClass } from '@test-utils/fixtures'
 * const subject = createMockSubject({ name: 'Math 101' })
 */

import {
  Subject,
  Class,
  OutcomeComment,
  FinalComment,
  PersonalizedComment,
} from '@/types'

/**
 * Create a minimal mock Subject
 * @param overrides - Partial fields to override defaults
 * @returns Subject with all required fields
 */
export function createMockSubject(overrides: Partial<Subject> = {}): Subject {
  const now = new Date().toISOString()
  return {
    id: '65a1b2c3d4e5f6g7h8i9j0k0',
    name: 'Test Subject',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * Create multiple mock Subjects efficiently
 * @param count - Number of subjects to create
 * @param baseOverrides - Overrides applied to all
 * @returns Array of Subjects
 */
export function createMockSubjects(
  count: number,
  baseOverrides: Partial<Subject> = {},
): Subject[] {
  return Array.from({ length: count }, (_, i) =>
    createMockSubject({
      id: `65a1b2c3d4e5f6g7h8i9j0k${i}`,
      name: `Subject ${i + 1}`,
      ...baseOverrides,
    }),
  )
}

/**
 * Create a minimal mock Class
 * @param overrides - Partial fields to override defaults
 * @returns Class with all required fields
 */
export function createMockClass(overrides: Partial<Class> = {}): Class {
  const now = new Date().toISOString()
  return {
    id: '75a1b2c3d4e5f6g7h8i9j0k0',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k0',
    name: 'Test Class',
    year: 2024,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * Create multiple mock Classes efficiently
 * @param count - Number of classes to create
 * @param baseOverrides - Overrides applied to all
 * @returns Array of Classes
 */
export function createMockClasses(
  count: number,
  baseOverrides: Partial<Class> = {},
): Class[] {
  return Array.from({ length: count }, (_, i) =>
    createMockClass({
      id: `75a1b2c3d4e5f6g7h8i9j0k${i}`,
      name: `Class ${i + 1}`,
      ...baseOverrides,
    }),
  )
}

/**
 * Create a minimal mock OutcomeComment
 * @param overrides - Partial fields to override defaults
 * @returns OutcomeComment with all required fields
 */
export function createMockOutcomeComment(
  overrides: Partial<OutcomeComment> = {},
): OutcomeComment {
  const now = new Date().toISOString()
  return {
    id: '95a1b2c3d4e5f6g7h8i9j0k0',
    upperRange: 100,
    lowerRange: 90,
    comment: 'Excellent performance',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k0',
    userId: 'auth0|mock-user-123',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * Create multiple mock OutcomeComments efficiently
 * @param count - Number of comments to create
 * @param baseOverrides - Overrides applied to all
 * @returns Array of OutcomeComments
 */
export function createMockOutcomeComments(
  count: number,
  baseOverrides: Partial<OutcomeComment> = {},
): OutcomeComment[] {
  return Array.from({ length: count }, (_, i) =>
    createMockOutcomeComment({
      id: `95a1b2c3d4e5f6g7h8i9j0k${i}`,
      upperRange: 100 - i * 10,
      lowerRange: 90 - i * 10,
      comment: `Comment ${i + 1}`,
      ...baseOverrides,
    }),
  )
}

/**
 * Create a minimal mock FinalComment
 * @param overrides - Partial fields to override defaults
 * @returns FinalComment with all required fields
 */
export function createMockFinalComment(
  overrides: Partial<FinalComment> = {},
): FinalComment {
  const now = new Date().toISOString()
  return {
    id: 'a5a1b2c3d4e5f6g7h8i9j0k0',
    classId: '75a1b2c3d4e5f6g7h8i9j0k0',
    firstName: 'John',
    lastName: 'Doe',
    grade: 85,
    comment: 'Good work',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * Create multiple mock FinalComments efficiently
 * @param count - Number of comments to create
 * @param baseOverrides - Overrides applied to all
 * @returns Array of FinalComments
 */
export function createMockFinalComments(
  count: number,
  baseOverrides: Partial<FinalComment> = {},
): FinalComment[] {
  return Array.from({ length: count }, (_, i) =>
    createMockFinalComment({
      id: `a5a1b2c3d4e5f6g7h8i9j0k${i}`,
      firstName: `Student${i + 1}`,
      lastName: `Last${i + 1}`,
      grade: Math.floor(Math.random() * 100),
      ...baseOverrides,
    }),
  )
}

/**
 * Create a minimal mock PersonalizedComment
 * @param overrides - Partial fields to override defaults
 * @returns PersonalizedComment with all required fields
 */
export function createMockPersonalizedComment(
  overrides: Partial<PersonalizedComment> = {},
): PersonalizedComment {
  const now = new Date().toISOString()
  return {
    id: '85a1b2c3d4e5f6g7h8i9j0k0',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k0',
    comment: 'Test comment',
    rating: 5,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * Create multiple mock PersonalizedComments efficiently
 * @param count - Number of comments to create
 * @param baseOverrides - Overrides applied to all
 * @returns Array of PersonalizedComments
 */
export function createMockPersonalizedComments(
  count: number,
  baseOverrides: Partial<PersonalizedComment> = {},
): PersonalizedComment[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPersonalizedComment({
      id: `85a1b2c3d4e5f6g7h8i9j0k${i}`,
      comment: `Comment ${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      ...baseOverrides,
    }),
  )
}

/**
 * Create a complete test scenario with all related entities
 * Useful for integration tests that need multiple entity types
 */
export function createMockScenario() {
  const subject = createMockSubject()
  const classes = createMockClasses(2, { subjectId: subject.id })
  const outcomeComments = createMockOutcomeComments(3, {
    subjectId: subject.id,
  })
  const finalComments = createMockFinalComments(5, {
    classId: classes[0].id,
  })
  const personalizedComments = createMockPersonalizedComments(5, {
    subjectId: subject.id,
  })

  return {
    subject,
    classes,
    outcomeComments,
    finalComments,
    personalizedComments,
  }
}
