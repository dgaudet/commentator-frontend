# Outcome Comments Management - Technical Design

**Feature**: Outcome Comments Management (L1-MICRO)
**Architect**: System Architect
**Date**: 2025-10-21
**Version**: 1.0
**Status**: Design Complete - Ready for Implementation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Type Definitions & API Service](#2-type-definitions--api-service)
3. [Component Architecture](#3-component-architecture)
4. [State Management & Data Flow](#4-state-management--data-flow)
5. [Validation Strategy](#5-validation-strategy)
6. [Routing & Navigation](#6-routing--navigation)
7. [Accessibility Implementation](#7-accessibility-implementation)
8. [Performance Optimization](#8-performance-optimization)
9. [Architectural Decision Records](#9-architectural-decision-records)

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 System Context

This feature extends the existing Class Management system by adding CRUD operations for OutcomeComments. It follows the established layered architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  OutcomeComments Components (View, Form, List, Item)   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Application Layer                      │
│     useOutcomeComments Hook (State Management)          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Service Layer                         │
│    outcomeCommentService (API Abstraction)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                Infrastructure Layer                      │
│          apiClient (Axios HTTP Client)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                 REST API
            (Backend Service)
```

### 1.2 Design Principles

- **Separation of Concerns**: Clear layer boundaries (UI → Hook → Service → API)
- **Single Responsibility**: Each component has one clear purpose
- **Dependency Inversion**: Components depend on abstractions (hooks), not services
- **Open/Closed**: Architecture supports extension (edit feature) without modification
- **DRY**: Reuse existing Button, Input, ErrorMessage, LoadingSpinner components

### 1.3 File Structure

```
src/
├── components/
│   ├── outcomeComments/           (NEW directory)
│   │   ├── OutcomeCommentsView.tsx
│   │   ├── OutcomeCommentForm.tsx
│   │   ├── OutcomeCommentList.tsx
│   │   ├── OutcomeCommentItem.tsx
│   │   ├── DeleteConfirmationModal.tsx
│   │   ├── EmptyState.tsx
│   │   └── CharacterCounter.tsx
│   └── common/                     (EXISTING - reuse)
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── hooks/
│   └── useOutcomeComments.ts       (NEW)
├── services/
│   ├── api/
│   │   └── outcomeCommentService.ts (NEW)
│   └── validation/
│       └── outcomeCommentValidation.ts (NEW)
├── types/
│   └── OutcomeComment.ts           (NEW)
└── utils/
    └── dateFormatter.ts            (EXISTING - reuse)
```

---

## 2. TYPE DEFINITIONS & API SERVICE

### 2.1 OutcomeComment Type Definition

**File**: `src/types/OutcomeComment.ts`

```typescript
/**
 * OutcomeComment Type Definitions
 * Maps to backend API OutcomeComment entity
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * IMPORTANT NOTES:
 * - id is number (integer), not string UUID
 * - Field names are camelCase (createdAt), not snake_case (created_at)
 * - Timestamps are ISO 8601 strings
 * - Associated with a single Class via classId foreign key
 */

/**
 * OutcomeComment entity representing a reusable learning outcome comment
 * Returned by: GET /outcome-comment, POST /outcome-comment
 */
export interface OutcomeComment {
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Foreign key to Class entity - Required */
  classId: number
  /** Comment text for learning outcomes - Required, 10-500 characters */
  commentText: string
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new outcome comment
 * Used by: POST /outcome-comment
 *
 * Business Rules:
 * - commentText: 10-500 characters, required, trim whitespace
 * - Duplicate detection: case-insensitive within same class
 * - classId: Must reference valid existing class
 */
export interface CreateOutcomeCommentRequest {
  /** Class ID - Required */
  classId: number
  /** Comment text - Required, 10-500 chars */
  commentText: string
}
```

**File**: `src/types/index.ts` (update)

```typescript
// ... existing exports ...

// OutcomeComment entity types
export type {
  OutcomeComment,
  CreateOutcomeCommentRequest
} from './OutcomeComment'
```

### 2.2 API Service Layer

**File**: `src/services/api/outcomeCommentService.ts`

```typescript
/**
 * OutcomeComment Service - CRUD Operations
 * Consumes existing backend API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 *
 * Reference: US-OUTCOME-002, US-OUTCOME-003, US-OUTCOME-004
 *
 * All endpoints return direct responses (not wrapped in ApiResponse<T>)
 * Follows same pattern as classService.ts
 */
import { OutcomeComment, CreateOutcomeCommentRequest } from '../../types/OutcomeComment'
import { apiClient } from './apiClient'

/**
 * Service for outcome comment-related API operations
 */
export const outcomeCommentService = {
  /**
   * Fetch all outcome comments for a specific class
   * Maps to: GET /outcome-comment?classId=:id
   *
   * @param classId - Class ID (integer)
   * @returns Promise<OutcomeComment[]> List of comments (direct array response)
   * @throws ApiError on failure
   */
  async getByClassId(classId: number): Promise<OutcomeComment[]> {
    const response = await apiClient.get<OutcomeComment[]>('/outcome-comment', {
      params: { classId },
    })
    return response.data
  },

  /**
   * Create new outcome comment
   * Maps to: POST /outcome-comment
   *
   * @param data - Comment creation data {classId, commentText}
   * @returns Promise<OutcomeComment> Created comment with auto-generated ID
   * @throws ApiError on failure (400 validation errors, 409 duplicate)
   */
  async create(data: CreateOutcomeCommentRequest): Promise<OutcomeComment> {
    const response = await apiClient.post<OutcomeComment>('/outcome-comment', data)
    return response.data
  },

  /**
   * Delete outcome comment
   * Maps to: DELETE /outcome-comment/:id
   *
   * @param id - Comment ID (integer)
   * @returns Promise<{message: string, deletedComment: OutcomeComment}>
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async delete(id: number): Promise<{ message: string; deletedComment: OutcomeComment }> {
    const response = await apiClient.delete<{
      message: string
      deletedComment: OutcomeComment
    }>(`/outcome-comment/${id}`)
    return response.data
  },
}
```

---

## 3. COMPONENT ARCHITECTURE

### 3.1 Component Hierarchy

```
App
└── OutcomeCommentsView (NEW - Container/Page)
    ├── Header (with Back button + Class info)
    ├── OutcomeCommentForm (NEW - Create form)
    │   ├── Textarea (common/Input variant)
    │   ├── CharacterCounter (NEW - inline component)
    │   ├── Button (common - Save)
    │   └── Button (common - Cancel)
    ├── OutcomeCommentList (NEW - List container)
    │   ├── LoadingSpinner (common)
    │   ├── ErrorMessage (common)
    │   ├── EmptyState (NEW - similar to classes/EmptyState)
    │   └── OutcomeCommentItem[] (NEW - List items)
    │       ├── CommentText display
    │       ├── Timestamp display
    │       └── Button (common - Delete)
    └── DeleteConfirmationModal (NEW - Confirmation dialog)
        ├── ModalOverlay
        ├── ModalContent
        ├── Button (common - Confirm)
        └── Button (common - Cancel)
```

### 3.2 Component Contracts

```typescript
// OutcomeCommentsView (Page Component)
interface OutcomeCommentsViewProps {
  classId: number        // Passed from navigation/routing
  className: string      // Class name for header display
  classYear: number      // Class year for header display
  onBack: () => void     // Navigate back to class list
}

// OutcomeCommentForm
interface OutcomeCommentFormProps {
  classId: number
  onSubmit: (commentText: string) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  error: string | null
}

// OutcomeCommentList
interface OutcomeCommentListProps {
  comments: OutcomeComment[]
  isLoading: boolean
  error: string | null
  onDelete: (id: number) => void
  onRetry: () => void
}

// OutcomeCommentItem
interface OutcomeCommentItemProps {
  comment: OutcomeComment
  onDelete: (id: number) => void
}

// DeleteConfirmationModal
interface DeleteConfirmationModalProps {
  isOpen: boolean
  commentText: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

// CharacterCounter
interface CharacterCounterProps {
  current: number
  max: number
  min: number
}
```

### 3.3 Component Responsibilities

| Component | Responsibility | State | Props |
|-----------|---------------|-------|-------|
| **OutcomeCommentsView** | Page container, orchestrates all child components | None (hooks) | classId, className, classYear, onBack |
| **OutcomeCommentForm** | Form input, validation, submission | Local form state | classId, onSubmit, onCancel, isSubmitting, error |
| **OutcomeCommentList** | Display list, loading/error states | None | comments, isLoading, error, onDelete, onRetry |
| **OutcomeCommentItem** | Display single comment, delete action | None | comment, onDelete |
| **DeleteConfirmationModal** | Confirmation dialog, focus trap | None | isOpen, commentText, onConfirm, onCancel, isDeleting |
| **EmptyState** | Display when no comments | None | None (static) |
| **CharacterCounter** | Real-time character count display | None | current, max, min |

---

## 4. STATE MANAGEMENT & DATA FLOW

### 4.1 useOutcomeComments Hook

**File**: `src/hooks/useOutcomeComments.ts`

```typescript
/**
 * useOutcomeComments Custom Hook
 * Manages outcome comment data and CRUD operations with centralized state
 *
 * Reference: US-OUTCOME-002, US-OUTCOME-003, US-OUTCOME-004
 *
 * Features:
 * - Fetches comments for specific class on mount
 * - Manages loading and error states
 * - Automatic sorting by creation date (newest first)
 * - CRUD operations with optimistic updates
 * - Error handling with rollback on failure
 * - Client-side duplicate detection
 */
import { useState, useEffect, useCallback } from 'react'
import { OutcomeComment, CreateOutcomeCommentRequest } from '../types/OutcomeComment'
import { outcomeCommentService } from '../services/api/outcomeCommentService'

interface UseOutcomeCommentsReturn {
  comments: OutcomeComment[]
  isLoading: boolean
  error: string | null
  fetchComments: (classId: number) => Promise<void>
  createComment: (data: CreateOutcomeCommentRequest) => Promise<OutcomeComment>
  deleteComment: (id: number) => Promise<void>
  clearError: () => void
  isDuplicate: (commentText: string) => boolean
}

/**
 * Sort comments by creation date (descending - newest first)
 */
function sortComments(comments: OutcomeComment[]): OutcomeComment[] {
  return [...comments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function useOutcomeComments(classId: number): UseOutcomeCommentsReturn {
  const [comments, setComments] = useState<OutcomeComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await outcomeCommentService.getByClassId(id)
      const sorted = sortComments(data)
      setComments(sorted)
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to fetch outcome comments'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments(classId)
  }, [classId, fetchComments])

  const isDuplicate = useCallback(
    (commentText: string): boolean => {
      const normalizedText = commentText.trim().toLowerCase()
      return comments.some(
        (comment) => comment.commentText.trim().toLowerCase() === normalizedText
      )
    },
    [comments]
  )

  const createComment = useCallback(
    async (data: CreateOutcomeCommentRequest): Promise<OutcomeComment> => {
      setError(null)

      if (isDuplicate(data.commentText)) {
        const duplicateError = new Error('This comment already exists for this class')
        setError(duplicateError.message)
        throw duplicateError
      }

      // Optimistic update
      let tempId = -Date.now()
      const optimisticComment: OutcomeComment = {
        id: tempId,
        classId: data.classId,
        commentText: data.commentText.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setComments((prev) => sortComments([optimisticComment, ...prev]))

      try {
        const newComment = await outcomeCommentService.create(data)
        setComments((prev) =>
          sortComments(prev.map((c) => (c.id === tempId ? newComment : c)))
        )
        return newComment
      } catch (err: unknown) {
        setComments((prev) => prev.filter((c) => c.id !== tempId))
        const errorMessage = (err as Error).message || 'Failed to create outcome comment'
        setError(errorMessage)
        throw err
      }
    },
    [isDuplicate]
  )

  const deleteComment = useCallback(async (id: number): Promise<void> => {
    setError(null)

    const commentToDelete = comments.find((c) => c.id === id)
    if (!commentToDelete) return

    setComments((prev) => prev.filter((c) => c.id !== id))

    try {
      await outcomeCommentService.delete(id)
    } catch (err: unknown) {
      setComments((prev) => sortComments([...prev, commentToDelete]))
      const errorMessage = (err as Error).message || 'Failed to delete outcome comment'
      setError(errorMessage)
      throw err
    }
  }, [comments])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    createComment,
    deleteComment,
    clearError,
    isDuplicate,
  }
}
```

### 4.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  User Interaction                        │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              OutcomeCommentsView                         │
│  (Orchestrates UI + passes classId context)             │
└───────┬─────────────────────────┬───────────────────────┘
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│ OutcomeComment   │    │ OutcomeCommentList   │
│     Form         │    │   (Display)          │
└────────┬─────────┘    └──────────┬───────────┘
         │                         │
         │                         │
         ▼                         ▼
┌─────────────────────────────────────────────────────────┐
│            useOutcomeComments Hook                       │
│  - State: [comments, isLoading, error]                  │
│  - Operations: [create, delete, fetch]                  │
│  - Validation: isDuplicate()                            │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│          outcomeCommentService                           │
│  - getByClassId(classId)                                │
│  - create(data)                                         │
│  - delete(id)                                           │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                apiClient (Axios)                         │
│  HTTP requests with error interceptors                  │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
               Backend API
```

### 4.3 State Management Strategy

**Local State (Component-Level)**:
- Form input values (textarea content, character count)
- Modal visibility (delete confirmation)
- Form validation errors (inline display)
- UI-specific states (form submission in progress)

**Shared State (Hook-Level)**:
- Comments list (fetched from API)
- Loading state (global for list operations)
- Error state (API errors)
- CRUD operation handlers

**No Global State Needed**: This feature operates within a single class context.

---

## 5. VALIDATION STRATEGY

### 5.1 Validation Service

**File**: `src/services/validation/outcomeCommentValidation.ts`

```typescript
/**
 * OutcomeComment Validation Service
 * Client-side validation rules per US-OUTCOME-003
 */

export interface ValidationResult {
  isValid: boolean
  errors: {
    commentText?: string
  }
}

const MIN_LENGTH = 10
const MAX_LENGTH = 500

export function validateOutcomeComment(commentText: string): ValidationResult {
  const errors: { commentText?: string } = {}
  const trimmed = commentText.trim()

  if (!trimmed) {
    errors.commentText = 'Comment text is required'
  } else if (trimmed.length < MIN_LENGTH) {
    errors.commentText = `Comment must be at least ${MIN_LENGTH} characters`
  } else if (trimmed.length > MAX_LENGTH) {
    errors.commentText = `Comment cannot exceed ${MAX_LENGTH} characters`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function getCharacterCount(text: string): number {
  return text.trim().length
}

export const VALIDATION_CONSTANTS = {
  MIN_LENGTH,
  MAX_LENGTH,
} as const
```

### 5.2 Validation Flow

**Sequential Validation Checks** (on submit):
1. Client-side format validation (required, min/max length)
2. Client-side duplicate check (case-insensitive)
3. Server-side validation (final authority)

**Error Handling**:
- Validation errors: Inline form error
- Duplicate errors: Preserve input, show warning
- Network errors: Display at top with Retry button
- API errors: User-friendly message

---

## 6. ROUTING & NAVIGATION

### 6.1 Navigation Approach (MVP)

**Conditional Rendering** (matches existing architecture):

```typescript
// In App.tsx
const [currentView, setCurrentView] = useState<'classList' | 'outcomeComments'>('classList')
const [selectedClass, setSelectedClass] = useState<Class | null>(null)

const handleManageOutcomeComments = (classItem: Class) => {
  setSelectedClass(classItem)
  setCurrentView('outcomeComments')
}

const handleBack = () => {
  setCurrentView('classList')
  setSelectedClass(null)
}

// Render
{currentView === 'classList' && (
  <ClassList onManageOutcomeComments={handleManageOutcomeComments} />
)}
{currentView === 'outcomeComments' && selectedClass && (
  <OutcomeCommentsView
    classId={selectedClass.id}
    className={selectedClass.name}
    classYear={selectedClass.year}
    onBack={handleBack}
  />
)}
```

**Future Enhancement**: React Router with URL structure:
- `/classes` - Class list
- `/classes/:classId/outcome-comments` - Outcome comments

---

## 7. ACCESSIBILITY IMPLEMENTATION

### 7.1 WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons
- Escape: Close modals
- Logical tab order maintained

**ARIA Labels & Live Regions**:
```typescript
// Form
<form aria-label="Create outcome comment">
  <textarea
    aria-label="Comment text"
    aria-describedby="char-count error-message"
    aria-invalid={hasError}
    aria-required="true"
  />
  <div id="char-count" aria-live="polite">
    {current}/{max} characters
  </div>
</form>

// Loading state
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? "Loading comments..." : `${comments.length} comments loaded`}
</div>

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Delete Outcome Comment</h2>
</div>
```

**Focus Management**:
- Modal open: Trap focus, focus Cancel button
- Modal close: Return focus to Delete button
- Form submit success: Focus newly created comment
- On error: Focus error message

---

## 8. PERFORMANCE OPTIMIZATION

### 8.1 Component Memoization

```typescript
// Memoize list items
export const OutcomeCommentItem = React.memo<OutcomeCommentItemProps>(
  ({ comment, onDelete }) => {
    // ... render
  }
)

// Memoize callbacks
const handleDelete = useCallback((id: number) => {
  setCommentToDelete(id)
  setShowModal(true)
}, [])
```

### 8.2 Bundle Size Impact

**Estimated**:
- Types: ~1 KB
- Service: ~1.5 KB
- Hook: ~3 KB
- Components: ~12 KB
- Validation: ~1 KB
- **Total**: ~18.5 KB → **~6 KB gzipped** ✅ (70% under target)

---

## 9. ARCHITECTURAL DECISION RECORDS

### ADR-001: No React Router for MVP
**Status**: Accepted
**Decision**: Use conditional rendering for view switching
**Rationale**: Minimal architectural change, faster delivery
**Consequences**: URL state not preserved (acceptable for MVP)

### ADR-002: Optimistic Updates
**Status**: Accepted
**Decision**: Implement optimistic UI updates with rollback
**Rationale**: Better UX, instant feedback
**Consequences**: Must handle rollback correctly

### ADR-003: Client-Side Duplicate Detection
**Status**: Accepted
**Decision**: Check duplicates before API call
**Rationale**: Immediate feedback, better UX
**Consequences**: Server validation still required

### ADR-004: No Virtualization for MVP
**Status**: Accepted
**Decision**: Render all comments, use React.memo
**Rationale**: Expected 20-30 comments per class
**Consequences**: May need virtualization if 100+ comments

---

## Appendix: Component Specifications

See [tasks.md](./tasks.md) for detailed implementation tasks.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-21
**Status**: Approved for Implementation
