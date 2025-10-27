# Implementation Guide: Personalized Comments Management

**Feature**: Personalized Comments CRUD
**Complexity**: L1-MICRO
**Estimated Duration**: 1-2 weeks (10 days)
**Architecture Review**: SKIPPED (follows established patterns)

---

## Overview

This guide provides a step-by-step implementation plan for adding Personalized Comments management to the Commentator frontend. The implementation **mirrors the existing OutcomeComments feature** to ensure consistency and maintainability.

---

## Implementation Strategy

### Key Principle: **Copy, Adapt, Test**

Since PersonalizedComment is structurally similar to OutcomeComment but simpler (no upperRange/lowerRange fields), we will:

1. **Copy** OutcomeComments implementation files
2. **Adapt** them for PersonalizedComment entity (remove range fields)
3. **Test** thoroughly with new test cases

### Differences Between OutcomeComment and PersonalizedComment

| Aspect | OutcomeComment | PersonalizedComment |
|---|---|---|
| **Fields** | id, subjectId, comment, upperRange, lowerRange, createdAt, updatedAt | id, subjectId, comment, createdAt, updatedAt |
| **Complexity** | Score-based (range validation) | Freeform text only |
| **Validation** | Range: 0-100, lower ≤ upper | Comment: 10-500 chars |
| **Use Case** | Score-based feedback | Student-specific feedback |

---

## Phase 1: Foundation (Days 1-2)

### Task 1.1: Create Type Definitions

**File**: `src/types/PersonalizedComment.ts`

**Implementation**:
```typescript
/**
 * Personalized Comment Type Definitions
 * Maps to backend API PersonalizedComment entity
 * Backend API Reference: http://localhost:3000/api-docs
 *
 * Simpler than OutcomeComment - no upperRange/lowerRange fields
 */

/**
 * Personalized Comment entity representing student-specific comments
 * Returned by: GET /personalized-comment, POST /personalized-comment, PUT /personalized-comment/:id
 */
export interface PersonalizedComment {
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Comment text */
  comment: string
  /** Associated subject ID */
  subjectId: number
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new personalized comment
 * Used by: POST /personalized-comment
 */
export interface CreatePersonalizedCommentRequest {
  /** Comment text - Required (10-500 characters) */
  comment: string
  /** Associated subject ID - Required */
  subjectId: number
}

/**
 * Request payload for updating an existing personalized comment
 * Used by: PUT /personalized-comment/:id
 */
export interface UpdatePersonalizedCommentRequest {
  /** Comment text - Required (10-500 characters) */
  comment: string
}
```

**Test File**: `src/types/__tests__/PersonalizedComment.test.ts`
```typescript
import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../PersonalizedComment'

describe('PersonalizedComment Types', () => {
  it('should have correct PersonalizedComment structure', () => {
    const comment: PersonalizedComment = {
      id: 1,
      comment: 'Shows great improvement',
      subjectId: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    }
    expect(comment).toBeDefined()
  })

  it('should have correct CreatePersonalizedCommentRequest structure', () => {
    const request: CreatePersonalizedCommentRequest = {
      comment: 'Shows great improvement',
      subjectId: 1,
    }
    expect(request).toBeDefined()
  })

  it('should have correct UpdatePersonalizedCommentRequest structure', () => {
    const request: UpdatePersonalizedCommentRequest = {
      comment: 'Updated comment text',
    }
    expect(request).toBeDefined()
  })
})
```

**Update**: `src/types/index.ts`
```typescript
// Add export
export type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from './PersonalizedComment'
```

**TDD Cycle**:
- ✅ RED: Write type tests → Fail (types don't exist)
- ✅ GREEN: Create types → Pass
- ✅ REFACTOR: Add JSDoc comments

---

### Task 1.2: Create API Service

**File**: `src/services/api/personalizedCommentService.ts`

**Implementation** (adapted from `outcomeCommentService.ts`):
```typescript
import apiClient from './apiClient'
import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../../types'

/**
 * API service for PersonalizedComment operations
 * Backend API: http://localhost:3000/personalized-comment
 */
export const personalizedCommentService = {
  /**
   * Get all personalized comments for a subject
   * GET /personalized-comment?subjectId={subjectId}
   */
  async getBySubjectId(subjectId: number): Promise<PersonalizedComment[]> {
    const response = await apiClient.get<PersonalizedComment[]>(
      `/personalized-comment?subjectId=${subjectId}`,
    )
    return response.data
  },

  /**
   * Create a new personalized comment
   * POST /personalized-comment
   */
  async create(request: CreatePersonalizedCommentRequest): Promise<PersonalizedComment> {
    const response = await apiClient.post<PersonalizedComment>(
      '/personalized-comment',
      {
        comment: request.comment,
        subjectId: request.subjectId,
      },
    )
    return response.data
  },

  /**
   * Update an existing personalized comment
   * PUT /personalized-comment/:id
   */
  async update(id: number, request: UpdatePersonalizedCommentRequest): Promise<PersonalizedComment> {
    const response = await apiClient.put<PersonalizedComment>(
      `/personalized-comment/${id}`,
      {
        comment: request.comment,
      },
    )
    return response.data
  },

  /**
   * Delete a personalized comment
   * DELETE /personalized-comment/:id
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/personalized-comment/${id}`)
  },
}
```

**Test File**: `src/services/api/__tests__/personalizedCommentService.test.ts`

**TDD Cycle**:
- ✅ RED: Write service tests → Fail (service doesn't exist)
- ✅ GREEN: Implement service → Pass
- ✅ REFACTOR: Add error handling

---

### Task 1.3: Add MSW Mock Handlers

**File**: `src/mocks/handlers.ts` (add new handlers)

**Implementation**:
```typescript
// Add to existing handlers array

// Personalized Comment handlers
http.get(`${BASE_URL}/personalized-comment`, ({ request }) => {
  const url = new URL(request.url)
  const subjectId = url.searchParams.get('subjectId')

  if (!subjectId) {
    return HttpResponse.json({
      error: 'Bad Request',
      message: 'Subject ID is required',
      statusCode: 400,
    }, { status: 400 })
  }

  // Filter comments for this subject
  const subjectComments = personalizedComments.filter(c => c.subjectId === Number(subjectId))
  return HttpResponse.json(subjectComments)
}),

http.post(`${BASE_URL}/personalized-comment`, async ({ request }) => {
  const body = await request.json() as { subjectId: number; comment: string }

  // Validation
  if (!body.comment || body.comment.trim().length < 10) {
    return HttpResponse.json({
      error: 'Bad Request',
      message: 'Comment must be at least 10 characters',
      statusCode: 400,
    }, { status: 400 })
  }

  if (body.comment.length > 500) {
    return HttpResponse.json({
      error: 'Bad Request',
      message: 'Comment cannot exceed 500 characters',
      statusCode: 400,
    }, { status: 400 })
  }

  // Create new comment
  const newComment: PersonalizedComment = {
    id: nextPersonalizedCommentId++,
    comment: body.comment,
    subjectId: body.subjectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  personalizedComments.push(newComment)
  return HttpResponse.json(newComment, { status: 201 })
}),

http.put(`${BASE_URL}/personalized-comment/:id`, async ({ params, request }) => {
  const { id } = params
  const body = await request.json() as { comment: string }

  const commentIndex = personalizedComments.findIndex(c => c.id === Number(id))
  if (commentIndex === -1) {
    return HttpResponse.json({
      error: 'Not Found',
      message: 'Personalized comment not found',
      statusCode: 404,
    }, { status: 404 })
  }

  // Update comment
  const updatedComment: PersonalizedComment = {
    ...personalizedComments[commentIndex],
    comment: body.comment,
    updatedAt: new Date().toISOString(),
  }

  personalizedComments[commentIndex] = updatedComment
  return HttpResponse.json(updatedComment)
}),

http.delete(`${BASE_URL}/personalized-comment/:id`, ({ params }) => {
  const { id } = params

  const commentIndex = personalizedComments.findIndex(c => c.id === Number(id))
  if (commentIndex === -1) {
    return HttpResponse.json({
      error: 'Not Found',
      message: 'Personalized comment not found',
      statusCode: 404,
    }, { status: 404 })
  }

  const deletedComment = personalizedComments[commentIndex]
  personalizedComments.splice(commentIndex, 1)

  return HttpResponse.json({
    message: 'Personalized comment deleted successfully',
    deletedComment,
  })
}),
```

**Mock Data**: `src/mocks/data/personalizedComments.ts`
```typescript
import type { PersonalizedComment } from '../../types'

export const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: 1,
    comment: 'Shows great improvement in problem-solving skills',
    subjectId: 1,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    comment: 'Excellent participation in class discussions',
    subjectId: 1,
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
  },
]
```

---

## Phase 2: State Management (Days 3-4)

### Task 2.1: Create usePersonalizedComments Hook

**File**: `src/hooks/usePersonalizedComments.ts`

**Implementation** (adapted from `useOutcomeComments.ts`):
```typescript
import { useState, useCallback } from 'react'
import { personalizedCommentService } from '../services/api/personalizedCommentService'
import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../types'

/**
 * Custom hook for managing personalized comments state and API operations
 * Provides optimistic updates and error handling
 */
export function usePersonalizedComments() {
  const [personalizedComments, setPersonalizedComments] = useState<PersonalizedComment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load all personalized comments for a subject
   */
  const loadPersonalizedComments = useCallback(async (subjectId: number) => {
    setLoading(true)
    setError(null)
    try {
      const comments = await personalizedCommentService.getBySubjectId(subjectId)
      setPersonalizedComments(comments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load personalized comments')
      setPersonalizedComments([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new personalized comment with optimistic update
   */
  const createComment = useCallback(async (request: CreatePersonalizedCommentRequest) => {
    // Optimistic update: Add temp comment immediately
    const tempComment: PersonalizedComment = {
      id: -1, // Temp ID
      comment: request.comment,
      subjectId: request.subjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPersonalizedComments(prev => [tempComment, ...prev])

    try {
      const newComment = await personalizedCommentService.create(request)
      // Replace temp comment with real comment
      setPersonalizedComments(prev => prev.map(c => c.id === -1 ? newComment : c))
    } catch (err) {
      // Rollback: Remove temp comment
      setPersonalizedComments(prev => prev.filter(c => c.id !== -1))
      setError(err instanceof Error ? err.message : 'Failed to create personalized comment')
      throw err
    }
  }, [])

  /**
   * Update an existing personalized comment with optimistic update
   */
  const updateComment = useCallback(async (id: number, request: UpdatePersonalizedCommentRequest) => {
    // Store original for rollback
    const original = personalizedComments.find(c => c.id === id)
    if (!original) return

    // Optimistic update
    setPersonalizedComments(prev => prev.map(c =>
      c.id === id ? { ...c, comment: request.comment, updatedAt: new Date().toISOString() } : c
    ))

    try {
      const updatedComment = await personalizedCommentService.update(id, request)
      setPersonalizedComments(prev => prev.map(c => c.id === id ? updatedComment : c))
    } catch (err) {
      // Rollback: Restore original
      setPersonalizedComments(prev => prev.map(c => c.id === id ? original : c))
      setError(err instanceof Error ? err.message : 'Failed to update personalized comment')
      throw err
    }
  }, [personalizedComments])

  /**
   * Delete a personalized comment with optimistic update
   */
  const deleteComment = useCallback(async (id: number) => {
    // Store original for rollback
    const original = personalizedComments.find(c => c.id === id)
    if (!original) return

    // Optimistic update: Remove immediately
    setPersonalizedComments(prev => prev.filter(c => c.id !== id))

    try {
      await personalizedCommentService.delete(id)
    } catch (err) {
      // Rollback: Restore deleted comment
      setPersonalizedComments(prev => [original, ...prev])
      setError(err instanceof Error ? err.message : 'Failed to delete personalized comment')
      throw err
    }
  }, [personalizedComments])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    personalizedComments,
    loading,
    error,
    loadPersonalizedComments,
    createComment,
    updateComment,
    deleteComment,
    clearError,
  }
}
```

**Test File**: `src/hooks/__tests__/usePersonalizedComments.test.ts`

**TDD Cycle**:
- ✅ RED: Write hook tests → Fail
- ✅ GREEN: Implement hook → Pass
- ✅ REFACTOR: Optimize optimistic updates

---

## Phase 3: UI Components (Days 5-7)

### Task 3.1: PersonalizedCommentsModal

**File**: `src/components/personalizedComments/PersonalizedCommentsModal.tsx`

**Props**:
```typescript
interface PersonalizedCommentsModalProps {
  isOpen: boolean
  entityData: { id: number; name: string }
  personalizedComments: PersonalizedComment[]
  loading: boolean
  error: string | null
  onCreateComment: (request: CreatePersonalizedCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdatePersonalizedCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  onClose: () => void
}
```

**Implementation**: Mirror `OutcomeCommentsModal.tsx` structure

---

### Task 3.2: PersonalizedCommentList

**File**: `src/components/personalizedComments/PersonalizedCommentList.tsx`

---

### Task 3.3: PersonalizedCommentForm

**File**: `src/components/personalizedComments/PersonalizedCommentForm.tsx`

**Key Features**:
- Text area for comment input (simpler than OutcomeComments - no range inputs)
- Character counter (10-500 chars)
- Validation feedback
- Submit button (disabled when invalid)

---

### Task 3.4: PersonalizedCommentItem

**File**: `src/components/personalizedComments/PersonalizedCommentItem.tsx`

---

## Phase 4: Integration (Days 8-9)

### Task 4.1: Update App.tsx

Add PersonalizedComments modal state and handlers (see user-stories.md for code snippet)

### Task 4.2: Update SubjectListItem

Add "Personalized Comments" button next to "Outcome Comments"

---

## Phase 5: E2E Testing (Day 10)

### E2E Test Scenarios

**File**: `e2e/personalizedCommentManagement.spec.ts`

1. View personalized comments list
2. Create new personalized comment
3. Edit personalized comment
4. Delete personalized comment (with confirmation)
5. Validation errors (too short, too long, duplicate)
6. Empty state handling
7. Error handling (API failures)

---

## Checklist: Definition of Done

- [ ] All TypeScript types defined and exported
- [ ] API service implemented with error handling
- [ ] MSW mock handlers added
- [ ] usePersonalizedComments hook implemented
- [ ] All UI components created
- [ ] App.tsx integration complete
- [ ] SubjectListItem button added
- [ ] Unit tests written (≥90% coverage)
- [ ] Integration tests written
- [ ] E2E tests written (Playwright)
- [ ] All tests passing
- [ ] Code review completed
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance validated (< 2s page load)
- [ ] No console errors or warnings
- [ ] Responsive design verified

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| API integration issues | Backend API already exists; use MSW for testing |
| State management bugs | Follow proven useOutcomeComments pattern |
| Duplicate detection edge cases | Server-side validation is source of truth |
| Performance issues | Optimize if > 50 comments (pagination/virtual scroll) |

---

**Ready to Start?** Use this command to begin implementation:

```bash
pdd handoff "frontend developer" "Implement Personalized Comments CRUD feature following this implementation guide and TDD approach"
```
