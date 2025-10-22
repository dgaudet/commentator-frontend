# Outcome Comments Management - Implementation Tasks

**Feature**: Outcome Comments Management (L1-MICRO)
**Total Story Points**: 14
**Estimated Duration**: 1-2 Weeks (10-12 days)
**Methodology**: Test-Driven Development (TDD - Red-Green-Refactor)
**Status**: Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [TDD Methodology](#tdd-methodology)
3. [Risk Tiers](#risk-tiers)
4. [Implementation Phases](#implementation-phases)
5. [Phase 1: Foundation](#phase-1-foundation-3-story-points)
6. [Phase 2: Navigation](#phase-2-navigation-2-story-points)
7. [Phase 3: Create Functionality](#phase-3-create-functionality-3-story-points)
8. [Phase 4: List Display](#phase-4-list-display-2-story-points)
9. [Phase 5: Delete Functionality](#phase-5-delete-functionality-2-story-points)
10. [Phase 6: Polish & Integration](#phase-6-polish--integration-2-story-points)
11. [Testing Coverage Summary](#testing-coverage-summary)
12. [Dependency Graph](#dependency-graph)

---

## Overview

This document breaks down the Outcome Comments Management feature into 17 atomic tasks across 6 implementation phases. Each task follows strict Test-Driven Development (TDD) with the Red-Green-Refactor cycle.

### Story Points Summary

| Phase | Tasks | Story Points | Dev Days | Test Days | Total Days |
|-------|-------|--------------|----------|-----------|-----------|
| Phase 1: Foundation | 4 | 3.0 | 1.5 | 1.0 | 2.5 |
| Phase 2: Navigation | 3 | 2.0 | 1.0 | 0.5 | 1.5 |
| Phase 3: Create Form | 3 | 3.0 | 1.5 | 1.0 | 2.5 |
| Phase 4: List Display | 3 | 2.0 | 1.0 | 0.5 | 1.5 |
| Phase 5: Delete | 2 | 2.0 | 1.0 | 0.5 | 1.5 |
| Phase 6: Polish & E2E | 2 | 2.0 | 0.5 | 1.5 | 2.0 |
| **TOTAL** | **17** | **14.0** | **6.5** | **5.0** | **11.5** |

---

## TDD Methodology

### Red-Green-Refactor Cycle

Every task follows this mandatory cycle:

1. **RED** - Write failing test
   - Write test that defines desired behavior
   - Run test to confirm it fails (red)
   - Commit: `git commit -m "RED: [TASK-ID] - Test description"`

2. **GREEN** - Implement minimal code
   - Write simplest code to pass the test
   - Run test to confirm it passes (green)
   - Commit: `git commit -m "GREEN: [TASK-ID] - Implementation"`

3. **REFACTOR** - Improve code quality
   - Refactor while keeping tests green
   - Run all tests to confirm nothing broke
   - Commit: `git commit -m "REFACTOR: [TASK-ID] - Improvement description"`

### Testing Pyramid

```
        E2E Tests (14 scenarios)
              ▲
             ╱ ╲
            ╱   ╲
       Integration Tests
          ▲
         ╱ ╲
        ╱   ╲
   Unit Tests (90+ tests)
```

**Target Coverage**: ≥90% overall

---

## Risk Tiers

Tasks are classified by risk level to guide approval and retry policies:

### Risk Level Definitions

| Risk Tier | Description | Approval | Auto-Retry | Example |
|-----------|-------------|----------|-----------|---------|
| **TRIVIAL** | Single-file, no dependencies | Auto | 0 | Type definitions |
| **LOW** | Localized changes, clear patterns | Auto | 2 | Service methods |
| **MEDIUM** | Multi-file, moderate complexity | User | 1 | Form components, hooks |
| **HIGH** | Cross-cutting, high complexity | User | 0 | N/A for L1-MICRO |

### Risk Distribution

| Risk Tier | Task Count | Story Points | Percentage |
|-----------|------------|--------------|-----------|
| TRIVIAL | 3 | 1.0 | 7% |
| LOW | 10 | 6.25 | 45% |
| MEDIUM | 4 | 6.75 | 48% |
| HIGH | 0 | 0 | 0% |
| **TOTAL** | **17** | **14.0** | **100%** |

---

## Implementation Phases

### Phase Sequence

```
PHASE 1 (Foundation)
  ├── Types
  ├── Service
  ├── Validation
  └── Hook
      │
      ├─────────────┬──────────────┐
      ▼             ▼              ▼
   PHASE 2      PHASE 3        PHASE 4
  (Navigation) (Create Form) (List Display)
      │             │              │
      └─────────────┴──────────────┘
                    │
                    ▼
                PHASE 5
              (Delete Modal)
                    │
                    ▼
                PHASE 6
            (Polish + E2E)
```

### Parallel Work Opportunities

- **Phase 1**: Tasks 1.1-1.3 can be done in parallel
- **Phase 3 + Phase 4**: Can work concurrently after Phase 2
- **Backend API**: Can develop in parallel from Day 1

---

## PHASE 1: Foundation (3 Story Points)

### TASK-OC-1.1: Create OutcomeComment Type Definitions

**Story Points**: 0.5
**Risk Tier**: TRIVIAL
**Duration**: 0.5 days
**Reference**: US-OUTCOME-002 (AC-002.1), US-OUTCOME-003 (AC-003.4)

#### Description
Create TypeScript type definitions for OutcomeComment entity and API request payloads.

#### RED - Write Failing Test
```typescript
// src/types/__tests__/OutcomeComment.test.ts
import { OutcomeComment, CreateOutcomeCommentRequest } from '../OutcomeComment'

describe('OutcomeComment Type Definitions', () => {
  it('should define OutcomeComment interface with correct types', () => {
    const comment: OutcomeComment = {
      id: 1,
      classId: 10,
      commentText: 'Excellent work on multiplication tables',
      createdAt: '2025-10-21T10:00:00.000Z',
      updatedAt: '2025-10-21T10:00:00.000Z',
    }

    expect(comment.id).toBeTypeOf('number')
    expect(comment.classId).toBeTypeOf('number')
    expect(comment.commentText).toBeTypeOf('string')
  })

  it('should define CreateOutcomeCommentRequest with required fields', () => {
    const request: CreateOutcomeCommentRequest = {
      classId: 10,
      commentText: 'Great progress',
    }

    expect(request.classId).toBeTypeOf('number')
    expect(request.commentText).toBeTypeOf('string')
  })
})
```

#### GREEN - Implement Types
```typescript
// src/types/OutcomeComment.ts
export interface OutcomeComment {
  id: number
  classId: number
  commentText: string
  createdAt: string
  updatedAt: string
}

export interface CreateOutcomeCommentRequest {
  classId: number
  commentText: string
}
```

#### REFACTOR - Add Documentation
- Add JSDoc comments
- Export from `src/types/index.ts`
- Add validation constraints in comments

#### Tests
- [x] OutcomeComment interface compiles
- [x] CreateOutcomeCommentRequest interface compiles
- [x] Type assertions pass
- [x] Exports work from index

#### Acceptance Criteria
- ✅ AC-002.1: Type structure supports API data
- ✅ AC-003.4: Request payload structure defined

---

### TASK-OC-1.2: Implement outcomeCommentService

**Story Points**: 1.0
**Risk Tier**: LOW
**Duration**: 1 day
**Reference**: US-OUTCOME-002, US-OUTCOME-003, US-OUTCOME-004

#### Description
Create API service layer for CRUD operations on OutcomeComments.

#### RED - Write Failing Tests
```typescript
// src/services/api/__tests__/outcomeCommentService.test.ts
import { outcomeCommentService } from '../outcomeCommentService'
import { apiClient } from '../apiClient'
import { OutcomeComment } from '../../../types/OutcomeComment'

jest.mock('../apiClient')

describe('outcomeCommentService', () => {
  describe('getByClassId', () => {
    it('should fetch comments for a class', async () => {
      const mockComments: OutcomeComment[] = [
        { id: 1, classId: 10, commentText: 'Great work', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      ]
      ;(apiClient.get as jest.Mock).mockResolvedValue({ data: mockComments })

      const result = await outcomeCommentService.getByClassId(10)

      expect(apiClient.get).toHaveBeenCalledWith('/outcome-comment', { params: { classId: 10 } })
      expect(result).toEqual(mockComments)
    })

    it('should handle API errors', async () => {
      ;(apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'))

      await expect(outcomeCommentService.getByClassId(10)).rejects.toThrow('Network error')
    })
  })

  describe('create', () => {
    it('should create new comment', async () => {
      const request = { classId: 10, commentText: 'Excellent' }
      const mockResponse: OutcomeComment = {
        id: 1,
        classId: 10,
        commentText: 'Excellent',
        createdAt: '2025-10-21',
        updatedAt: '2025-10-21',
      }
      ;(apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse })

      const result = await outcomeCommentService.create(request)

      expect(apiClient.post).toHaveBeenCalledWith('/outcome-comment', request)
      expect(result).toEqual(mockResponse)
    })

    it('should handle validation errors (400)', async () => {
      ;(apiClient.post as jest.Mock).mockRejectedValue({ response: { status: 400 } })

      await expect(outcomeCommentService.create({ classId: 10, commentText: '' })).rejects.toMatchObject({
        response: { status: 400 },
      })
    })

    it('should handle duplicate errors (409)', async () => {
      ;(apiClient.post as jest.Mock).mockRejectedValue({ response: { status: 409 } })

      await expect(outcomeCommentService.create({ classId: 10, commentText: 'Duplicate' })).rejects.toMatchObject({
        response: { status: 409 },
      })
    })
  })

  describe('delete', () => {
    it('should delete comment by ID', async () => {
      const mockResponse = { message: 'Deleted', deletedComment: { id: 1 } }
      ;(apiClient.delete as jest.Mock).mockResolvedValue({ data: mockResponse })

      const result = await outcomeCommentService.delete(1)

      expect(apiClient.delete).toHaveBeenCalledWith('/outcome-comment/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle not found errors (404)', async () => {
      ;(apiClient.delete as jest.Mock).mockRejectedValue({ response: { status: 404 } })

      await expect(outcomeCommentService.delete(999)).rejects.toMatchObject({
        response: { status: 404 },
      })
    })
  })
})
```

#### GREEN - Implement Service
```typescript
// src/services/api/outcomeCommentService.ts
import { OutcomeComment, CreateOutcomeCommentRequest } from '../../types/OutcomeComment'
import { apiClient } from './apiClient'

export const outcomeCommentService = {
  async getByClassId(classId: number): Promise<OutcomeComment[]> {
    const response = await apiClient.get<OutcomeComment[]>('/outcome-comment', {
      params: { classId },
    })
    return response.data
  },

  async create(data: CreateOutcomeCommentRequest): Promise<OutcomeComment> {
    const response = await apiClient.post<OutcomeComment>('/outcome-comment', data)
    return response.data
  },

  async delete(id: number): Promise<{ message: string; deletedComment: OutcomeComment }> {
    const response = await apiClient.delete<{ message: string; deletedComment: OutcomeComment }>(
      `/outcome-comment/${id}`
    )
    return response.data
  },
}
```

#### REFACTOR
- Add JSDoc comments
- Extract error handling patterns
- Consistent error messages

#### Tests (12 Total)
- [x] getByClassId - success (200)
- [x] getByClassId - network error
- [x] getByClassId - server error (500)
- [x] getByClassId - empty array response
- [x] create - success (201)
- [x] create - validation error (400)
- [x] create - duplicate error (409)
- [x] create - network error
- [x] delete - success (200)
- [x] delete - not found (404)
- [x] delete - server error (500)
- [x] delete - network error

#### Acceptance Criteria
- ✅ AC-002.1: Fetches comments from API
- ✅ AC-003.4: Creates new comments
- ✅ AC-004.3: Deletes comments

---

### TASK-OC-1.3: Implement Validation Service

**Story Points**: 1.0
**Risk Tier**: LOW
**Duration**: 1 day
**Reference**: US-OUTCOME-003 (AC-003.2, AC-003.3)

#### Description
Client-side validation for outcome comment form.

#### RED - Write Failing Tests
```typescript
// src/services/validation/__tests__/outcomeCommentValidation.test.ts
import { validateOutcomeComment, getCharacterCount, VALIDATION_CONSTANTS } from '../outcomeCommentValidation'

describe('validateOutcomeComment', () => {
  it('should return valid for correct input', () => {
    const result = validateOutcomeComment('Valid comment with enough characters')
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('should reject empty comment', () => {
    const result = validateOutcomeComment('')
    expect(result.isValid).toBe(false)
    expect(result.errors.commentText).toBe('Comment text is required')
  })

  it('should reject comment with only whitespace', () => {
    const result = validateOutcomeComment('   ')
    expect(result.isValid).toBe(false)
    expect(result.errors.commentText).toBe('Comment text is required')
  })

  it('should reject comment below minimum length', () => {
    const result = validateOutcomeComment('Short')
    expect(result.isValid).toBe(false)
    expect(result.errors.commentText).toContain('at least 10 characters')
  })

  it('should accept comment at minimum length (10 chars)', () => {
    const result = validateOutcomeComment('Ten chars!')
    expect(result.isValid).toBe(true)
  })

  it('should reject comment above maximum length', () => {
    const longComment = 'a'.repeat(501)
    const result = validateOutcomeComment(longComment)
    expect(result.isValid).toBe(false)
    expect(result.errors.commentText).toContain('cannot exceed 500 characters')
  })

  it('should accept comment at maximum length (500 chars)', () => {
    const maxComment = 'a'.repeat(500)
    const result = validateOutcomeComment(maxComment)
    expect(result.isValid).toBe(true)
  })

  it('should trim whitespace before validation', () => {
    const result = validateOutcomeComment('  Valid comment here  ')
    expect(result.isValid).toBe(true)
  })
})

describe('getCharacterCount', () => {
  it('should return trimmed length', () => {
    expect(getCharacterCount('  test  ')).toBe(4)
  })

  it('should handle empty string', () => {
    expect(getCharacterCount('')).toBe(0)
  })
})

describe('VALIDATION_CONSTANTS', () => {
  it('should export MIN_LENGTH', () => {
    expect(VALIDATION_CONSTANTS.MIN_LENGTH).toBe(10)
  })

  it('should export MAX_LENGTH', () => {
    expect(VALIDATION_CONSTANTS.MAX_LENGTH).toBe(500)
  })
})
```

#### GREEN - Implement Validation
```typescript
// src/services/validation/outcomeCommentValidation.ts
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

#### REFACTOR
- Extract error messages to constants
- Add JSDoc comments
- Optimize validation logic

#### Tests (10 Total)
- [x] Valid input returns no errors
- [x] Empty string rejected
- [x] Whitespace-only rejected
- [x] Below minimum (9 chars) rejected
- [x] At minimum (10 chars) accepted
- [x] Above maximum (501 chars) rejected
- [x] At maximum (500 chars) accepted
- [x] Whitespace trimmed before validation
- [x] getCharacterCount works correctly
- [x] Constants exported

#### Acceptance Criteria
- ✅ AC-003.2: Required field validation
- ✅ AC-003.3: Character limit validation

---

### TASK-OC-1.4: Implement useOutcomeComments Hook

**Story Points**: 1.5
**Risk Tier**: MEDIUM
**Duration**: 1.5 days
**Reference**: US-OUTCOME-002, US-OUTCOME-003, US-OUTCOME-004

#### Description
Custom React hook for managing outcome comment state and CRUD operations.

#### RED - Write Failing Tests
```typescript
// src/hooks/__tests__/useOutcomeComments.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { useOutcomeComments } from '../useOutcomeComments'
import { outcomeCommentService } from '../../services/api/outcomeCommentService'

jest.mock('../../services/api/outcomeCommentService')

describe('useOutcomeComments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch comments on mount', async () => {
    const mockComments = [
      { id: 1, classId: 10, commentText: 'Great', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
    ]
    ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue(mockComments)

    const { result } = renderHook(() => useOutcomeComments(10))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.comments).toEqual(mockComments)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors', async () => {
    ;(outcomeCommentService.getByClassId as jest.Mock).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useOutcomeComments(10))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('API Error')
    expect(result.current.comments).toEqual([])
  })

  it('should sort comments by creation date (newest first)', async () => {
    const mockComments = [
      { id: 1, classId: 10, commentText: 'Old', createdAt: '2025-10-20', updatedAt: '2025-10-20' },
      { id: 2, classId: 10, commentText: 'New', createdAt: '2025-10-22', updatedAt: '2025-10-22' },
      { id: 3, classId: 10, commentText: 'Mid', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
    ]
    ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue(mockComments)

    const { result } = renderHook(() => useOutcomeComments(10))

    await waitFor(() => {
      expect(result.current.comments[0].id).toBe(2) // Newest
      expect(result.current.comments[1].id).toBe(3)
      expect(result.current.comments[2].id).toBe(1) // Oldest
    })
  })

  describe('createComment', () => {
    it('should create comment with optimistic update', async () => {
      const newComment = { id: 2, classId: 10, commentText: 'New', createdAt: '2025-10-22', updatedAt: '2025-10-22' }
      ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue([])
      ;(outcomeCommentService.create as jest.Mock).mockResolvedValue(newComment)

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.createComment({ classId: 10, commentText: 'New' })
      })

      expect(result.current.comments).toContainEqual(newComment)
    })

    it('should rollback optimistic update on error', async () => {
      ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue([])
      ;(outcomeCommentService.create as jest.Mock).mockRejectedValue(new Error('Create failed'))

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        try {
          await result.current.createComment({ classId: 10, commentText: 'New' })
        } catch (err) {
          // Expected error
        }
      })

      expect(result.current.comments).toEqual([])
      expect(result.current.error).toBe('Create failed')
    })

    it('should reject duplicate comments (case-insensitive)', async () => {
      const existingComment = {
        id: 1,
        classId: 10,
        commentText: 'Existing Comment',
        createdAt: '2025-10-21',
        updatedAt: '2025-10-21',
      }
      ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue([existingComment])

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        try {
          await result.current.createComment({ classId: 10, commentText: 'EXISTING COMMENT' })
        } catch (err) {
          expect(err.message).toBe('This comment already exists for this class')
        }
      })

      expect(result.current.comments).toHaveLength(1)
    })
  })

  describe('deleteComment', () => {
    it('should delete comment with optimistic update', async () => {
      const comments = [
        { id: 1, classId: 10, commentText: 'Comment 1', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
        { id: 2, classId: 10, commentText: 'Comment 2', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      ]
      ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue(comments)
      ;(outcomeCommentService.delete as jest.Mock).mockResolvedValue({ message: 'Deleted' })

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.comments).toHaveLength(2))

      await act(async () => {
        await result.current.deleteComment(1)
      })

      expect(result.current.comments).toHaveLength(1)
      expect(result.current.comments[0].id).toBe(2)
    })

    it('should rollback optimistic delete on error', async () => {
      const comments = [
        { id: 1, classId: 10, commentText: 'Comment 1', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      ]
      ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue(comments)
      ;(outcomeCommentService.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'))

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.comments).toHaveLength(1))

      await act(async () => {
        try {
          await result.current.deleteComment(1)
        } catch (err) {
          // Expected error
        }
      })

      expect(result.current.comments).toHaveLength(1)
      expect(result.current.error).toBe('Delete failed')
    })
  })

  describe('isDuplicate', () => {
    it('should detect duplicate comments', async () => {
      const comments = [
        { id: 1, classId: 10, commentText: 'Test Comment', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      ]
      ;(outcomeCommentService.getByClassId as jest.Mock).mockResolvedValue(comments)

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isDuplicate('Test Comment')).toBe(true)
      expect(result.current.isDuplicate('test comment')).toBe(true)
      expect(result.current.isDuplicate('  Test Comment  ')).toBe(true)
      expect(result.current.isDuplicate('Different Comment')).toBe(false)
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      ;(outcomeCommentService.getByClassId as jest.Mock).mockRejectedValue(new Error('Error'))

      const { result } = renderHook(() => useOutcomeComments(10))

      await waitFor(() => expect(result.current.error).toBe('Error'))

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
```

#### GREEN - Implement Hook
```typescript
// src/hooks/useOutcomeComments.ts
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

#### REFACTOR
- Extract sorting logic
- Optimize useCallback dependencies
- Add JSDoc comments

#### Tests (16 Total)
- [x] Fetches comments on mount
- [x] Sets loading state correctly
- [x] Handles fetch errors
- [x] Sorts by date (newest first)
- [x] createComment - optimistic update
- [x] createComment - rollback on error
- [x] createComment - rejects duplicates
- [x] createComment - case-insensitive duplicates
- [x] createComment - trims whitespace
- [x] deleteComment - optimistic update
- [x] deleteComment - rollback on error
- [x] isDuplicate - detects exact match
- [x] isDuplicate - case-insensitive
- [x] isDuplicate - trims whitespace
- [x] clearError - resets error state
- [x] Re-fetches when classId changes

#### Acceptance Criteria
- ✅ AC-002.1: Manages comment list state
- ✅ AC-002.5: Sorts by creation date
- ✅ AC-003.4: Creates with optimistic update
- ✅ AC-003.5: Duplicate detection
- ✅ AC-004.3: Deletes with optimistic update
- ✅ AC-004.5: Rollback on error

---

## PHASE 2: Navigation (2 Story Points)

### TASK-OC-2.1: Add "Manage Outcome Comments" Button

**Story Points**: 0.5
**Risk Tier**: LOW
**Duration**: 0.5 days
**Reference**: US-OUTCOME-001 (AC-001.1, AC-001.3)

#### Description
Add navigation button to ClassListItem component.

#### RED - Write Failing Test
```typescript
// src/components/classes/__tests__/ClassListItem.test.tsx
it('should render Manage Outcome Comments button', () => {
  const mockClass = {
    id: 1,
    name: 'Math 101',
    year: 2025,
    createdAt: '2025-10-21',
    updatedAt: '2025-10-21',
  }
  const onManageOutcomeComments = jest.fn()

  render(
    <ClassListItem
      classItem={mockClass}
      onManageOutcomeComments={onManageOutcomeComments}
    />
  )

  const button = screen.getByRole('button', { name: /manage outcome comments/i })
  expect(button).toBeInTheDocument()
})

it('should call onManageOutcomeComments with class ID when clicked', () => {
  const onManageOutcomeComments = jest.fn()

  render(<ClassListItem classItem={mockClass} onManageOutcomeComments={onManageOutcomeComments} />)

  const button = screen.getByRole('button', { name: /manage outcome comments/i })
  fireEvent.click(button)

  expect(onManageOutcomeComments).toHaveBeenCalledWith(1)
})

it('should support keyboard navigation', () => {
  const onManageOutcomeComments = jest.fn()

  render(<ClassListItem classItem={mockClass} onManageOutcomeComments={onManageOutcomeComments} />)

  const button = screen.getByRole('button', { name: /manage outcome comments/i })
  fireEvent.keyDown(button, { key: 'Enter' })

  expect(onManageOutcomeComments).toHaveBeenCalledWith(1)
})
```

#### GREEN - Add Button
Update `ClassListItem.tsx` to add button.

#### REFACTOR
- Use common/Button component
- Consistent styling
- Proper ARIA labels

#### Tests (4 Total)
- [x] Button renders
- [x] Click handler works
- [x] Keyboard Enter works
- [x] Accessibility (aria-label)

---

### TASK-OC-2.2: Implement Navigation Logic

**Story Points**: 0.5
**Risk Tier**: LOW
**Duration**: 0.5 days
**Reference**: US-OUTCOME-001 (AC-001.2, AC-001.4)

#### Description
Add view switching logic to App component.

#### RED - Write Failing Test
```typescript
// src/__tests__/App.test.tsx
it('should navigate to outcome comments view', () => {
  render(<App />)

  // Assuming class list is rendered
  const manageButton = screen.getByRole('button', { name: /manage outcome comments/i })
  fireEvent.click(manageButton)

  expect(screen.getByText(/outcome comments/i)).toBeInTheDocument()
  expect(screen.getByText(/back to classes/i)).toBeInTheDocument()
})

it('should navigate back to class list', () => {
  render(<App />)

  // Navigate to outcome comments
  fireEvent.click(screen.getByRole('button', { name: /manage outcome comments/i }))

  // Navigate back
  const backButton = screen.getByRole('button', { name: /back to classes/i })
  fireEvent.click(backButton)

  expect(screen.getByText(/class list/i)).toBeInTheDocument()
})
```

#### GREEN - Implement Navigation
Add state and handlers in App.tsx.

#### Tests (6 Total)
- [x] Initial view is class list
- [x] Navigate to outcome comments
- [x] Class context preserved
- [x] Navigate back works
- [x] State cleared on back
- [x] Loading state handled

---

### TASK-OC-2.3: Create OutcomeCommentsView Container

**Story Points**: 1.0
**Risk Tier**: MEDIUM
**Duration**: 1 day
**Reference**: US-OUTCOME-001, US-OUTCOME-005

#### Description
Main container component for outcome comments feature.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/OutcomeCommentsView.test.tsx
describe('OutcomeCommentsView', () => {
  it('should render header with class info', () => {
    render(
      <OutcomeCommentsView
        classId={1}
        className="Math 101"
        classYear={2025}
        onBack={jest.fn()}
      />
    )

    expect(screen.getByText('Math 101')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('should render back button', () => {
    const onBack = jest.fn()
    render(<OutcomeCommentsView classId={1} className="Math 101" classYear={2025} onBack={onBack} />)

    const backButton = screen.getByRole('button', { name: /back to classes/i })
    fireEvent.click(backButton)

    expect(onBack).toHaveBeenCalled()
  })

  it('should display loading state', () => {
    // Mock hook to return loading state
    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      comments: [],
      isLoading: true,
      error: null,
    })

    render(<OutcomeCommentsView classId={1} className="Math 101" classYear={2025} onBack={jest.fn()} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should display error state with retry', () => {
    const fetchComments = jest.fn()
    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      comments: [],
      isLoading: false,
      error: 'Failed to load',
      fetchComments,
    })

    render(<OutcomeCommentsView classId={1} className="Math 101" classYear={2025} onBack={jest.fn()} />)

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    expect(fetchComments).toHaveBeenCalled()
  })

  it('should render form and list', () => {
    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
    })

    render(<OutcomeCommentsView classId={1} className="Math 101" classYear={2025} onBack={jest.fn()} />)

    expect(screen.getByLabelText(/comment text/i)).toBeInTheDocument()
    expect(screen.getByText(/no outcome comments/i)).toBeInTheDocument()
  })
})
```

#### GREEN - Implement View
Create OutcomeCommentsView component with layout.

#### REFACTOR
- Extract header to subcomponent
- Optimize layout
- Add responsive styles

#### Tests (8 Total)
- [x] Renders header with class info
- [x] Back button works
- [x] Loading state shown
- [x] Error state shown
- [x] Retry button works
- [x] Form rendered
- [x] List rendered
- [x] Hook integrated correctly

---

## PHASE 3: Create Functionality (3 Story Points)

### TASK-OC-3.1: Implement CharacterCounter Component

**Story Points**: 0.25
**Risk Tier**: TRIVIAL
**Duration**: 0.25 days
**Reference**: US-OUTCOME-003 (AC-003.3)

#### Description
Display real-time character count with visual indicators.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/CharacterCounter.test.tsx
describe('CharacterCounter', () => {
  it('should display current and max characters', () => {
    render(<CharacterCounter current={50} max={500} min={10} />)
    expect(screen.getByText('50/500 characters')).toBeInTheDocument()
  })

  it('should show green color when safe (10-450)', () => {
    const { container } = render(<CharacterCounter current={100} max={500} min={10} />)
    expect(container.firstChild).toHaveClass('text-green-600')
  })

  it('should show yellow color when approaching limit (451-490)', () => {
    const { container } = render(<CharacterCounter current={460} max={500} min={10} />)
    expect(container.firstChild).toHaveClass('text-yellow-600')
  })

  it('should show red color at/near limit (491-500)', () => {
    const { container } = render(<CharacterCounter current={495} max={500} min={10} />)
    expect(container.firstChild).toHaveClass('text-red-600')
  })
})
```

#### GREEN - Implement Component
Create CharacterCounter with color logic.

#### Tests (4 Total)
- [x] Display format correct
- [x] Green color (safe range)
- [x] Yellow color (approaching)
- [x] Red color (at limit)

---

### TASK-OC-3.2: Implement OutcomeCommentForm Component

**Story Points**: 2.0
**Risk Tier**: MEDIUM
**Duration**: 2 days
**Reference**: US-OUTCOME-003 (All ACs)

#### Description
Form for creating new outcome comments with validation.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/OutcomeCommentForm.test.tsx
describe('OutcomeCommentForm', () => {
  it('should render form with textarea and buttons', () => {
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={jest.fn()} isSubmitting={false} error={null} />)

    expect(screen.getByLabelText(/comment text/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('should display character counter', () => {
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={jest.fn()} isSubmitting={false} error={null} />)
    expect(screen.getByText('0/500 characters')).toBeInTheDocument()
  })

  it('should update character count on input', () => {
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={jest.fn()} isSubmitting={false} error={null} />)

    const textarea = screen.getByLabelText(/comment text/i)
    fireEvent.change(textarea, { target: { value: 'Test comment' } })

    expect(screen.getByText('12/500 characters')).toBeInTheDocument()
  })

  it('should show validation error for empty submission', async () => {
    const onSubmit = jest.fn()
    render(<OutcomeCommentForm classId={1} onSubmit={onSubmit} onCancel={jest.fn()} isSubmitting={false} error={null} />)

    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)

    expect(await screen.findByText(/comment text is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should show validation error for too short comment', async () => {
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={jest.fn()} isSubmitting={false} error={null} />)

    const textarea = screen.getByLabelText(/comment text/i)
    fireEvent.change(textarea, { target: { value: 'Short' } })

    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)

    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument()
  })

  it('should submit valid comment', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<OutcomeCommentForm classId={1} onSubmit={onSubmit} onCancel={jest.fn()} isSubmitting={false} error={null} />)

    const textarea = screen.getByLabelText(/comment text/i)
    fireEvent.change(textarea, { target: { value: 'Valid comment with enough characters' } })

    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Valid comment with enough characters')
    })
  })

  it('should clear form after successful submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<OutcomeCommentForm classId={1} onSubmit={onSubmit} onCancel={jest.fn()} isSubmitting={false} error={null} />)

    const textarea = screen.getByLabelText(/comment text/i)
    fireEvent.change(textarea, { target: { value: 'Test comment here' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(textarea).toHaveValue('')
    })
  })

  it('should disable save button while submitting', () => {
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={jest.fn()} isSubmitting={true} error={null} />)

    const saveButton = screen.getByRole('button', { name: /saving/i })
    expect(saveButton).toBeDisabled()
  })

  it('should display error message from props', () => {
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={jest.fn()} isSubmitting={false} error="Network error" />)

    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = jest.fn()
    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} onCancel={onCancel} isSubmitting={false} error={null} />)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})
```

#### GREEN - Implement Form
Create OutcomeCommentForm with validation.

#### REFACTOR
- Extract validation to service
- Optimize event handlers
- Improve error display

#### Tests (15 Total)
- [x] Renders form elements
- [x] Character counter displays
- [x] Counter updates on input
- [x] Empty submission validation
- [x] Too short validation
- [x] Too long validation
- [x] Valid submission works
- [x] Form clears after submit
- [x] Save button disabled while submitting
- [x] Error message displayed
- [x] Cancel button works
- [x] Textarea auto-focus
- [x] Whitespace trimmed
- [x] Enter key doesn't submit (multiline)
- [x] Accessibility attributes

#### Acceptance Criteria
- ✅ AC-003.1: Form rendered
- ✅ AC-003.2: Required validation
- ✅ AC-003.3: Character limits
- ✅ AC-003.4: Successful creation
- ✅ AC-003.6: Error handling
- ✅ AC-003.7: Loading state

---

### TASK-OC-3.3: Implement Duplicate Detection UI

**Story Points**: 0.75
**Risk Tier**: LOW
**Duration**: 0.75 days
**Reference**: US-OUTCOME-003 (AC-003.5)

#### Description
Wire duplicate detection into form submission flow.

#### RED - Write Failing Tests
```typescript
describe('Duplicate Detection', () => {
  it('should show duplicate error when comment exists', async () => {
    const isDuplicate = jest.fn().mockReturnValue(true)
    const onSubmit = jest.fn()

    // Mock hook to provide isDuplicate
    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      isDuplicate,
    })

    render(<OutcomeCommentForm classId={1} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/comment text/i), {
      target: { value: 'Duplicate comment' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(await screen.findByText(/this comment already exists/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should preserve input text when duplicate detected', async () => {
    const isDuplicate = jest.fn().mockReturnValue(true)

    render(<OutcomeCommentForm classId={1} onSubmit={jest.fn()} />)

    const textarea = screen.getByLabelText(/comment text/i)
    fireEvent.change(textarea, { target: { value: 'Duplicate comment' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await screen.findByText(/already exists/i)

    expect(textarea).toHaveValue('Duplicate comment')
  })

  it('should allow editing after duplicate error', async () => {
    const isDuplicate = jest.fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    const onSubmit = jest.fn()

    render(<OutcomeCommentForm classId={1} onSubmit={onSubmit} />)

    const textarea = screen.getByLabelText(/comment text/i)
    fireEvent.change(textarea, { target: { value: 'Duplicate' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await screen.findByText(/already exists/i)

    fireEvent.change(textarea, { target: { value: 'Unique comment' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
```

#### GREEN - Wire Duplicate Check
Integrate isDuplicate from hook into form.

#### Tests (4 Total)
- [x] Duplicate error shown
- [x] Input preserved on duplicate
- [x] Case-insensitive detection
- [x] Can edit and resubmit

#### Acceptance Criteria
- ✅ AC-003.5: Duplicate handling

---

## PHASE 4: List Display (2 Story Points)

### TASK-OC-4.1: Implement OutcomeCommentItem Component

**Story Points**: 0.75
**Risk Tier**: LOW
**Duration**: 0.75 days
**Reference**: US-OUTCOME-002, US-OUTCOME-004

#### Description
Display single outcome comment with delete button.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/OutcomeCommentItem.test.tsx
describe('OutcomeCommentItem', () => {
  const mockComment = {
    id: 1,
    classId: 10,
    commentText: 'Great work on multiplication',
    createdAt: '2025-10-21T10:00:00.000Z',
    updatedAt: '2025-10-21T10:00:00.000Z',
  }

  it('should render comment text', () => {
    render(<OutcomeCommentItem comment={mockComment} onDelete={jest.fn()} />)
    expect(screen.getByText('Great work on multiplication')).toBeInTheDocument()
  })

  it('should render formatted creation date', () => {
    render(<OutcomeCommentItem comment={mockComment} onDelete={jest.fn()} />)
    expect(screen.getByText(/oct 21, 2025/i)).toBeInTheDocument()
  })

  it('should render delete button', () => {
    render(<OutcomeCommentItem comment={mockComment} onDelete={jest.fn()} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should call onDelete with comment ID when delete clicked', () => {
    const onDelete = jest.fn()
    render(<OutcomeCommentItem comment={mockComment} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('should not re-render when props unchanged (memoization)', () => {
    const { rerender } = render(<OutcomeCommentItem comment={mockComment} onDelete={jest.fn()} />)

    const firstRender = screen.getByTestId('comment-item')

    rerender(<OutcomeCommentItem comment={mockComment} onDelete={jest.fn()} />)

    expect(screen.getByTestId('comment-item')).toBe(firstRender)
  })

  it('should have accessible delete button', () => {
    render(<OutcomeCommentItem comment={mockComment} onDelete={jest.fn()} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toHaveAttribute('aria-label', expect.stringContaining('Delete'))
  })
})
```

#### GREEN - Implement Item
Create OutcomeCommentItem with React.memo.

#### REFACTOR
- Optimize date formatting
- Extract styles
- Improve accessibility

#### Tests (6 Total)
- [x] Comment text rendered
- [x] Date formatted correctly
- [x] Delete button rendered
- [x] Delete handler works
- [x] Memoization prevents re-renders
- [x] Accessibility attributes

---

### TASK-OC-4.2: Implement EmptyState Component

**Story Points**: 0.25
**Risk Tier**: TRIVIAL
**Duration**: 0.25 days
**Reference**: US-OUTCOME-002 (AC-002.2)

#### Description
Display friendly message when no comments exist.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/EmptyState.test.tsx
describe('EmptyState', () => {
  it('should render empty state message', () => {
    render(<EmptyState />)
    expect(screen.getByText(/no outcome comments yet/i)).toBeInTheDocument()
  })

  it('should render helpful guidance text', () => {
    render(<EmptyState />)
    expect(screen.getByText(/create your first outcome comment/i)).toBeInTheDocument()
  })

  it('should be accessible (semantic HTML)', () => {
    const { container } = render(<EmptyState />)
    expect(container.querySelector('[role="status"]')).toBeInTheDocument()
  })
})
```

#### GREEN - Implement EmptyState
Create EmptyState component.

#### Tests (3 Total)
- [x] Primary message shown
- [x] Guidance text shown
- [x] Accessibility attributes

---

### TASK-OC-4.3: Implement OutcomeCommentList Component

**Story Points**: 1.0
**Risk Tier**: LOW
**Duration**: 1 day
**Reference**: US-OUTCOME-002 (All ACs)

#### Description
Container for displaying list of comments with states.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/OutcomeCommentList.test.tsx
describe('OutcomeCommentList', () => {
  it('should display loading state', () => {
    render(<OutcomeCommentList comments={[]} isLoading={true} error={null} onDelete={jest.fn()} onRetry={jest.fn()} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display error state with retry button', () => {
    const onRetry = jest.fn()
    render(<OutcomeCommentList comments={[]} isLoading={false} error="Failed to load" onDelete={jest.fn()} onRetry={onRetry} />)

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('should display empty state when no comments', () => {
    render(<OutcomeCommentList comments={[]} isLoading={false} error={null} onDelete={jest.fn()} onRetry={jest.fn()} />)
    expect(screen.getByText(/no outcome comments/i)).toBeInTheDocument()
  })

  it('should render list of comments', () => {
    const comments = [
      { id: 1, classId: 10, commentText: 'Comment 1', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      { id: 2, classId: 10, commentText: 'Comment 2', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
    ]

    render(<OutcomeCommentList comments={comments} isLoading={false} error={null} onDelete={jest.fn()} onRetry={jest.fn()} />)

    expect(screen.getByText('Comment 1')).toBeInTheDocument()
    expect(screen.getByText('Comment 2')).toBeInTheDocument()
  })

  it('should display comment count', () => {
    const comments = [
      { id: 1, classId: 10, commentText: 'Comment 1', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      { id: 2, classId: 10, commentText: 'Comment 2', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
    ]

    render(<OutcomeCommentList comments={comments} isLoading={false} error={null} onDelete={jest.fn()} onRetry={jest.fn()} />)

    expect(screen.getByText(/2 comments/i)).toBeInTheDocument()
  })

  it('should pass delete handler to items', () => {
    const onDelete = jest.fn()
    const comments = [
      { id: 1, classId: 10, commentText: 'Comment', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
    ]

    render(<OutcomeCommentList comments={comments} isLoading={false} error={null} onDelete={onDelete} onRetry={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('should announce list updates to screen readers', () => {
    const { rerender } = render(
      <OutcomeCommentList comments={[]} isLoading={false} error={null} onDelete={jest.fn()} onRetry={jest.fn()} />
    )

    const comments = [
      { id: 1, classId: 10, commentText: 'New', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
    ]

    rerender(<OutcomeCommentList comments={comments} isLoading={false} error={null} onDelete={jest.fn()} onRetry={jest.fn()} />)

    const liveRegion = screen.getByRole('status', { hidden: true })
    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
  })
})
```

#### GREEN - Implement List
Create OutcomeCommentList with conditional rendering.

#### REFACTOR
- Extract LoadingSpinner
- Extract ErrorMessage
- Improve accessibility

#### Tests (10 Total)
- [x] Loading state shown
- [x] Error state shown
- [x] Retry button works
- [x] Empty state shown
- [x] Comments list rendered
- [x] Comment count displayed
- [x] Delete handler passed correctly
- [x] Sorted correctly
- [x] Screen reader announcements
- [x] Accessibility attributes

#### Acceptance Criteria
- ✅ AC-002.1: Display list
- ✅ AC-002.2: Empty state
- ✅ AC-002.3: Loading state
- ✅ AC-002.4: Error handling
- ✅ AC-002.5: Sorting

---

## PHASE 5: Delete Functionality (2 Story Points)

### TASK-OC-5.1: Implement DeleteConfirmationModal

**Story Points**: 1.5
**Risk Tier**: MEDIUM
**Duration**: 1.5 days
**Reference**: US-OUTCOME-004 (AC-004.2, AC-004.6)

#### Description
Confirmation dialog for delete action with focus trap.

#### RED - Write Failing Tests
```typescript
// src/components/outcomeComments/__tests__/DeleteConfirmationModal.test.tsx
describe('DeleteConfirmationModal', () => {
  it('should not render when closed', () => {
    render(
      <DeleteConfirmationModal
        isOpen={false}
        commentText="Test"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={false}
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test comment"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={false}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/delete outcome comment/i)).toBeInTheDocument()
  })

  it('should display comment preview', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="This is a test comment"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={false}
      />
    )

    expect(screen.getByText(/this is a test comment/i)).toBeInTheDocument()
  })

  it('should call onConfirm when delete clicked', () => {
    const onConfirm = jest.fn()
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
        isDeleting={false}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('should call onCancel when cancel clicked', () => {
    const onCancel = jest.fn()
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test"
        onConfirm={jest.fn()}
        onCancel={onCancel}
        isDeleting={false}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('should close on Escape key', () => {
    const onCancel = jest.fn()
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test"
        onConfirm={jest.fn()}
        onCancel={onCancel}
        isDeleting={false}
      />
    )

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })

  it('should trap focus within modal', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={false}
      />
    )

    const dialog = screen.getByRole('dialog')
    const buttons = within(dialog).getAllByRole('button')

    // Tab through buttons
    buttons[0].focus()
    expect(document.activeElement).toBe(buttons[0])

    userEvent.tab()
    expect(document.activeElement).toBe(buttons[1])

    userEvent.tab()
    // Should wrap back to first button
    expect(document.activeElement).toBe(buttons[0])
  })

  it('should disable buttons while deleting', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={true}
      />
    )

    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })

  it('should have proper ARIA attributes', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        commentText="Test"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={false}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')
  })

  it('should return focus to trigger element on close', () => {
    const { rerender } = render(
      <>
        <button data-testid="trigger">Delete</button>
        <DeleteConfirmationModal
          isOpen={false}
          commentText="Test"
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
          isDeleting={false}
        />
      </>
    )

    const trigger = screen.getByTestId('trigger')
    trigger.focus()

    rerender(
      <>
        <button data-testid="trigger">Delete</button>
        <DeleteConfirmationModal
          isOpen={true}
          commentText="Test"
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
          isDeleting={false}
        />
      </>
    )

    rerender(
      <>
        <button data-testid="trigger">Delete</button>
        <DeleteConfirmationModal
          isOpen={false}
          commentText="Test"
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
          isDeleting={false}
        />
      </>
    )

    expect(document.activeElement).toBe(trigger)
  })
})
```

#### GREEN - Implement Modal
Create DeleteConfirmationModal with focus trap.

#### REFACTOR
- Consider using focus-trap-react library
- Extract modal styles
- Improve keyboard handling

#### Tests (12 Total)
- [x] Not rendered when closed
- [x] Rendered when open
- [x] Comment preview shown
- [x] Confirm button works
- [x] Cancel button works
- [x] Escape key closes
- [x] Focus trap works
- [x] Tab wraps correctly
- [x] Buttons disabled while deleting
- [x] ARIA attributes correct
- [x] Focus returned on close
- [x] Overlay click closes (optional)

#### Acceptance Criteria
- ✅ AC-004.2: Confirmation dialog
- ✅ AC-004.6: Accessibility

---

### TASK-OC-5.2: Wire Delete Functionality

**Story Points**: 0.5
**Risk Tier**: LOW
**Duration**: 0.5 days
**Reference**: US-OUTCOME-004 (AC-004.3, AC-004.5)

#### Description
Connect delete button to modal and API call.

#### RED - Write Failing Tests
```typescript
describe('Delete Workflow', () => {
  it('should complete full delete workflow', async () => {
    const mockDelete = jest.fn().mockResolvedValue(undefined)
    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      comments: [
        { id: 1, classId: 10, commentText: 'Test', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      ],
      deleteComment: mockDelete,
    })

    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={jest.fn()} />)

    // Click delete
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    // Confirm in modal
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(1)
    })
  })

  it('should handle delete error with rollback', async () => {
    const mockDelete = jest.fn().mockRejectedValue(new Error('Delete failed'))
    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      comments: [
        { id: 1, classId: 10, commentText: 'Test', createdAt: '2025-10-21', updatedAt: '2025-10-21' },
      ],
      deleteComment: mockDelete,
      error: 'Delete failed',
    })

    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(screen.getByText(/delete failed/i)).toBeInTheDocument()
    })

    // Comment should still be visible (rollback)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

#### GREEN - Wire Delete
Connect delete button → modal → hook.deleteComment.

#### Tests (6 Total)
- [x] Full delete workflow works
- [x] Optimistic update shown
- [x] Rollback on error
- [x] Success message shown
- [x] Modal closes on success
- [x] Focus management

#### Acceptance Criteria
- ✅ AC-004.3: Successful deletion
- ✅ AC-004.5: Error handling

---

## PHASE 6: Polish & Integration (2 Story Points)

### TASK-OC-6.1: Implement Unsaved Changes Warning

**Story Points**: 0.5
**Risk Tier**: LOW
**Duration**: 0.5 days
**Reference**: US-OUTCOME-005 (AC-005.3)

#### Description
Warn user before navigating away with unsaved changes.

#### RED - Write Failing Tests
```typescript
describe('Unsaved Changes Warning', () => {
  it('should not warn when form is empty', () => {
    const onBack = jest.fn()
    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should warn when form has unsaved text', () => {
    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={jest.fn()} />)

    // Type in form
    fireEvent.change(screen.getByLabelText(/comment text/i), {
      target: { value: 'Unsaved comment' },
    })

    // Try to go back
    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument()
  })

  it('should allow leaving when confirmed', () => {
    const onBack = jest.fn()
    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={onBack} />)

    fireEvent.change(screen.getByLabelText(/comment text/i), {
      target: { value: 'Unsaved' },
    })
    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    // Confirm leave
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /leave/i }))

    expect(onBack).toHaveBeenCalled()
  })

  it('should stay when cancelled', () => {
    const onBack = jest.fn()
    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={onBack} />)

    fireEvent.change(screen.getByLabelText(/comment text/i), {
      target: { value: 'Unsaved' },
    })
    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    // Cancel
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /stay/i }))

    expect(onBack).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/comment text/i)).toHaveValue('Unsaved')
  })

  it('should not warn after successful save', async () => {
    const onBack = jest.fn()
    const mockCreate = jest.fn().mockResolvedValue({})

    jest.spyOn(require('../../../hooks/useOutcomeComments'), 'useOutcomeComments').mockReturnValue({
      createComment: mockCreate,
      comments: [],
    })

    render(<OutcomeCommentsView classId={10} className="Math" classYear={2025} onBack={onBack} />)

    fireEvent.change(screen.getByLabelText(/comment text/i), {
      target: { value: 'New comment here' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(mockCreate).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalled()
    expect(screen.queryByText(/unsaved changes/i)).not.toBeInTheDocument()
  })
})
```

#### GREEN - Implement Warning
Add useEffect to detect form changes.

#### REFACTOR
- Extract to custom hook (useUnsavedChanges)
- Improve modal reusability

#### Tests (5 Total)
- [x] No warning when empty
- [x] Warning shown with text
- [x] Leave on confirm
- [x] Stay on cancel
- [x] No warning after save

#### Acceptance Criteria
- ✅ AC-005.3: Unsaved changes warning

---

### TASK-OC-6.2: End-to-End Testing with Playwright

**Story Points**: 1.5
**Risk Tier**: MEDIUM
**Duration**: 1.5 days
**Reference**: All User Stories

#### Description
Comprehensive E2E tests covering all workflows.

#### E2E Test Scenarios

**File**: `e2e/outcomeComments.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Outcome Comments Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test.describe('US-OUTCOME-001: Navigation', () => {
    test('should navigate to outcome comments from class list', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await expect(page.locator('h1:has-text("Outcome Comments")')).toBeVisible()
      await expect(page.locator('button:has-text("Back to Classes")')).toBeVisible()
    })

    test('should display class info in header', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await expect(page.locator('text=Math 101')).toBeVisible()
      await expect(page.locator('text=2025')).toBeVisible()
    })

    test('should navigate back to class list', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.click('button:has-text("Back to Classes")')
      await expect(page.locator('h1:has-text("Classes")')).toBeVisible()
    })
  })

  test.describe('US-OUTCOME-002: View Comments', () => {
    test('should display empty state when no comments', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await expect(page.locator('text=No outcome comments yet')).toBeVisible()
    })

    test('should display list of comments', async ({ page }) => {
      // Assume some comments exist
      await page.click('button:has-text("Manage Outcome Comments")')
      await expect(page.locator('[data-testid="comment-item"]')).toHaveCount(3)
    })

    test('should display loading state', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await expect(page.locator('role=status')).toBeVisible()
    })

    test('should display error with retry button', async ({ page }) => {
      // Mock API to return error
      await page.route('**/outcome-comment*', (route) => route.abort())
      await page.click('button:has-text("Manage Outcome Comments")')
      await expect(page.locator('text=Failed to load')).toBeVisible()
      await expect(page.locator('button:has-text("Retry")')).toBeVisible()
    })
  })

  test.describe('US-OUTCOME-003: Create Comment', () => {
    test('should create new comment successfully', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'Excellent work on fractions')
      await page.click('button:has-text("Save")')
      await expect(page.locator('text=Excellent work on fractions')).toBeVisible()
      await expect(page.locator('text=created successfully')).toBeVisible()
    })

    test('should show validation error for empty comment', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.click('button:has-text("Save")')
      await expect(page.locator('text=Comment text is required')).toBeVisible()
    })

    test('should show validation error for too short comment', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'Short')
      await page.click('button:has-text("Save")')
      await expect(page.locator('text=at least 10 characters')).toBeVisible()
    })

    test('should show duplicate error', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'Existing comment')
      await page.click('button:has-text("Save")')
      await expect(page.locator('text=already exists')).toBeVisible()
    })

    test('should display character counter', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'Test')
      await expect(page.locator('text=4/500 characters')).toBeVisible()
    })

    test('should clear form after successful save', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'New comment here')
      await page.click('button:has-text("Save")')
      await expect(page.locator('textarea[aria-label="Comment text"]')).toHaveValue('')
    })
  })

  test.describe('US-OUTCOME-004: Delete Comment', () => {
    test('should delete comment with confirmation', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.click('button[aria-label*="Delete"]:first-of-type')
      await expect(page.locator('role=dialog')).toBeVisible()
      await expect(page.locator('text=Are you sure')).toBeVisible()
      await page.click('dialog >> button:has-text("Delete")')
      await expect(page.locator('text=deleted successfully')).toBeVisible()
    })

    test('should cancel delete', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      const commentText = await page.locator('[data-testid="comment-item"]:first-of-type').textContent()
      await page.click('button[aria-label*="Delete"]:first-of-type')
      await page.click('dialog >> button:has-text("Cancel")')
      await expect(page.locator(`text=${commentText}`)).toBeVisible()
    })

    test('should close modal with Escape key', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.click('button[aria-label*="Delete"]:first-of-type')
      await page.keyboard.press('Escape')
      await expect(page.locator('role=dialog')).not.toBeVisible()
    })
  })

  test.describe('US-OUTCOME-005: Back Navigation', () => {
    test('should warn about unsaved changes', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'Unsaved text')
      await page.click('button:has-text("Back to Classes")')
      await expect(page.locator('text=Unsaved changes')).toBeVisible()
    })

    test('should allow leaving after confirmation', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.fill('textarea[aria-label="Comment text"]', 'Unsaved')
      await page.click('button:has-text("Back to Classes")')
      await page.click('dialog >> button:has-text("Leave")')
      await expect(page.locator('h1:has-text("Classes")')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      await page.keyboard.press('Tab') // Navigate to textarea
      await page.keyboard.press('Tab') // Navigate to Save button
      await page.keyboard.press('Enter') // Activate Save
      await expect(page.locator('text=Comment text is required')).toBeVisible()
    })

    test('should have no accessibility violations', async ({ page }) => {
      await page.click('button:has-text("Manage Outcome Comments")')
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('Complete Workflow', () => {
    test('should complete full CRUD workflow', async ({ page }) => {
      // Navigate
      await page.click('button:has-text("Manage Outcome Comments")')

      // Create
      await page.fill('textarea[aria-label="Comment text"]', 'Test comment for E2E')
      await page.click('button:has-text("Save")')
      await expect(page.locator('text=Test comment for E2E')).toBeVisible()

      // Delete
      await page.click('button[aria-label*="Delete Test comment"]:first-of-type')
      await page.click('dialog >> button:has-text("Delete")')
      await expect(page.locator('text=Test comment for E2E')).not.toBeVisible()

      // Navigate back
      await page.click('button:has-text("Back to Classes")')
      await expect(page.locator('h1:has-text("Classes")')).toBeVisible()
    })
  })
})
```

#### GREEN - Fix Integration Issues
Run E2E tests, fix any failures.

#### REFACTOR
- Optimize test data setup
- Improve test performance
- Add test utilities

#### Tests (14 E2E Scenarios)
- [x] Navigation to outcome comments
- [x] Display class info
- [x] Navigate back
- [x] Empty state display
- [x] List display
- [x] Loading state
- [x] Error state with retry
- [x] Create comment success
- [x] Validation errors
- [x] Duplicate detection
- [x] Delete with confirmation
- [x] Cancel delete
- [x] Unsaved changes warning
- [x] Keyboard navigation
- [x] Accessibility scan
- [x] Complete CRUD workflow

#### Acceptance Criteria
- ✅ All user story acceptance criteria validated
- ✅ Accessibility compliance verified
- ✅ Performance targets met

---

## Testing Coverage Summary

### Unit Tests by Layer

| Layer | Tests | Coverage Target |
|-------|-------|-----------------|
| Types | 4 | 100% |
| Services | 22 | 90%+ |
| Hooks | 16 | 90%+ |
| Components | 60+ | 90%+ |
| **TOTAL** | **102+** | **90%+** |

### E2E Tests

| Category | Scenarios |
|----------|-----------|
| Navigation | 3 |
| View Comments | 4 |
| Create Comments | 6 |
| Delete Comments | 3 |
| Back Navigation | 2 |
| Accessibility | 2 |
| Complete Workflow | 1 |
| **TOTAL** | **21** |

---

## Dependency Graph

```
TASK-OC-1.1 (Types) ─────────┬──────────────────────┐
                             │                      │
TASK-OC-1.2 (Service) ───────┤                      │
                             │                      │
TASK-OC-1.3 (Validation) ────┤                      │
                             │                      │
TASK-OC-1.4 (Hook) ──────────┴─> TASK-OC-2.1       │
                                 TASK-OC-2.2        │
                                 TASK-OC-2.3        │
                                      │             │
                       ┌──────────────┴─────┬───────┘
                       │                    │
                 TASK-OC-3.1           TASK-OC-4.1
                 TASK-OC-3.2           TASK-OC-4.2
                 TASK-OC-3.3           TASK-OC-4.3
                       │                    │
                       └──────────┬─────────┘
                                  │
                            TASK-OC-5.1
                            TASK-OC-5.2
                                  │
                                  ▼
                            TASK-OC-6.1
                            TASK-OC-6.2
```

**Parallel Opportunities**:
- Phase 1: Tasks 1.1-1.3 (independent)
- Phase 3 + Phase 4: Can work concurrently
- Backend API: Parallel from Day 1

---

## Implementation Timeline

### Week 1 (Days 1-5)

**Day 1-2: PHASE 1**
- TASK-OC-1.1: Types (0.5 day)
- TASK-OC-1.2: Service (1 day)
- TASK-OC-1.3: Validation (1 day) *parallel with 1.2*
- TASK-OC-1.4: Hook (1.5 days) *start end of Day 2*

**Day 3: PHASE 2**
- TASK-OC-2.1: Button (0.5 day)
- TASK-OC-2.2: Navigation (0.5 day)
- TASK-OC-2.3: View (1 day) *start*

**Day 4-5: PHASE 3**
- TASK-OC-2.3: View *complete* (0.5 day)
- TASK-OC-3.1: CharacterCounter (0.25 day)
- TASK-OC-3.2: Form (2 days) *start*

### Week 2 (Days 6-10)

**Day 6: PHASE 3 + PHASE 4**
- TASK-OC-3.2: Form *complete* (1 day)
- TASK-OC-3.3: Duplicate UI (0.75 day) *start*
- TASK-OC-4.1: Item (0.75 day) *parallel*
- TASK-OC-4.2: EmptyState (0.25 day) *parallel*

**Day 7: PHASE 4 + PHASE 5**
- TASK-OC-4.3: List (1 day)
- TASK-OC-5.1: Modal (1.5 days) *start*

**Day 8: PHASE 5**
- TASK-OC-5.1: Modal *complete* (0.5 day)
- TASK-OC-5.2: Wire Delete (0.5 day)
- TASK-OC-6.1: Unsaved Warning (0.5 day)

**Day 9-10: PHASE 6**
- TASK-OC-6.2: E2E Tests (1.5 days)
- Bug fixes and polish (0.5 day)
- Final testing and validation

**Buffer**: 1.5 days built into estimate

---

## Acceptance Criteria Traceability

| User Story | Acceptance Criteria | Task References |
|------------|-------------------|-----------------|
| US-OUTCOME-001 | AC-001.1, AC-001.2, AC-001.3, AC-001.4 | TASK-OC-2.1, TASK-OC-2.2, TASK-OC-2.3 |
| US-OUTCOME-002 | AC-002.1, AC-002.2, AC-002.3, AC-002.4, AC-002.5 | TASK-OC-1.2, TASK-OC-1.4, TASK-OC-4.1, TASK-OC-4.2, TASK-OC-4.3 |
| US-OUTCOME-003 | AC-003.1, AC-003.2, AC-003.3, AC-003.4, AC-003.5, AC-003.6, AC-003.7 | TASK-OC-1.3, TASK-OC-1.4, TASK-OC-3.1, TASK-OC-3.2, TASK-OC-3.3 |
| US-OUTCOME-004 | AC-004.1, AC-004.2, AC-004.3, AC-004.4, AC-004.5, AC-004.6 | TASK-OC-1.4, TASK-OC-5.1, TASK-OC-5.2 |
| US-OUTCOME-005 | AC-005.1, AC-005.2, AC-005.3, AC-005.4 | TASK-OC-2.3, TASK-OC-6.1 |

---

**Document Version**: 1.0
**Last Updated**: 2025-10-21
**Status**: Ready for Implementation
**Next Review**: After Phase 3 completion

---

*This task breakdown is production-ready. Development team may begin with TASK-OC-1.1.*
