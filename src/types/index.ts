/**
 * Type Definitions Index
 * Central export point for all type definitions
 *
 * Usage:
 * import { Class, CreateClassRequest, ApiError } from '@/types'
 */

// Subject entity types (new API structure)
export type { Subject, CreateSubjectRequest, UpdateSubjectRequest } from './Subject'

// Class entity types (legacy - being migrated to Subject)
export type { Class, CreateClassRequest, UpdateClassRequest } from './Class'

// Outcome Comment entity types
export type { OutcomeComment, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from './OutcomeComment'

// API response types
export type { ApiResponse, ApiError } from './ApiResponse'
