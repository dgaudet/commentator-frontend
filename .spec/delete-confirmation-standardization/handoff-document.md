# Delete Confirmation Standardization - Frontend Engineer Handoff

## Executive Summary

This feature standardizes delete confirmation UX across the application by implementing the reusable `ConfirmationModal` component for all delete operations. Currently, delete confirmations are handled inconsistently across different modal components.

### User Stories

- **US-DELETE-CONFIRM-001**: Outcome Comment Delete Confirmation (1 SP)
- **US-DELETE-CONFIRM-002**: Personalized Comment Delete Confirmation (1 SP)
- **US-DELETE-CONFIRM-003**: Class Delete with Cascading Warning (2 SP)
- **US-DELETE-CONFIRM-004**: Final Comment Delete Confirmation (1 SP)

**Total Effort**: 5 Story Points | **Timeline**: 1-1.5 weeks | **Complexity**: L1-MICRO

---

## Feature Overview

### Problem Statement
The application currently has inconsistent delete confirmation patterns across different entity types. Some use inline confirmations, others may use browser alerts, leading to poor UX and maintainability issues.

### Solution
Standardize all delete operations to use the existing `ConfirmationModal` component with:
- Consistent messaging patterns
- Context-specific preview of item being deleted
- Cascading delete warnings where applicable
- Accessible keyboard navigation
- Consistent visual design

### Architecture Review
**Status**: SKIPPED (L1-MICRO complexity - straightforward component integration)

---

## User Stories - Detailed Requirements

### US-DELETE-CONFIRM-001: Outcome Comment Delete Confirmation

**Priority**: HIGH
**Story Points**: 1
**Component**: `src/components/outcomeComments/OutcomeCommentsModal.tsx`

#### User Story
```
As a teacher
WHEN I click the delete button on an outcome comment
THE SYSTEM SHALL display a confirmation modal with a preview of the comment text
AND confirm or cancel the deletion
```

#### Acceptance Criteria
1. **AC1**: Delete button click opens `ConfirmationModal` with title "Delete Outcome Comment"
2. **AC2**: Modal displays message "Are you sure you want to delete this outcome comment?"
3. **AC3**: Modal shows preview of comment text (truncated to 100 chars if longer)
4. **AC4**: Confirm button labeled "Delete" with destructive styling (red)
5. **AC5**: Cancel button labeled "Cancel" with secondary styling
6. **AC6**: Clicking Confirm calls `onDeleteComment(id)` and closes modal
7. **AC7**: Clicking Cancel closes modal without deletion
8. **AC8**: Pressing Escape key closes modal without deletion
9. **AC9**: Modal supports keyboard navigation (Tab, Shift+Tab, Enter, Escape)
10. **AC10**: Focus management: focus returns to delete button after modal closes

#### Implementation Notes
- No cascading delete warnings needed
- Comment preview should trim whitespace and add ellipsis if > 100 chars
- Maintain optimistic UI updates from existing implementation

---

### US-DELETE-CONFIRM-002: Personalized Comment Delete Confirmation

**Priority**: HIGH
**Story Points**: 1
**Component**: `src/components/personalizedComments/PersonalizedCommentsModal.tsx`

#### User Story
```
As a teacher
WHEN I click the delete button on a personalized comment
THE SYSTEM SHALL display a confirmation modal with a preview of the comment text
AND confirm or cancel the deletion
```

#### Acceptance Criteria
1. **AC1**: Delete button click opens `ConfirmationModal` with title "Delete Personalized Comment"
2. **AC2**: Modal displays message "Are you sure you want to delete this personalized comment?"
3. **AC3**: Modal shows preview of comment text (truncated to 100 chars if longer)
4. **AC4**: Confirm button labeled "Delete" with destructive styling
5. **AC5**: Cancel button labeled "Cancel" with secondary styling
6. **AC6**: Clicking Confirm calls `onDeleteComment(id)` and closes modal
7. **AC7**: Clicking Cancel closes modal without deletion
8. **AC8**: Pressing Escape key closes modal without deletion
9. **AC9**: Modal supports keyboard navigation
10. **AC10**: Focus management: focus returns to delete button after modal closes

#### Implementation Notes
- Identical pattern to US-DELETE-CONFIRM-001
- Different message copy to reflect entity type
- Reuse same state management pattern

---

### US-DELETE-CONFIRM-003: Class Delete with Cascading Warning

**Priority**: HIGH
**Story Points**: 2 (more complex due to cascading check)
**Component**: `src/components/classes/ClassManagementModal.tsx`

#### User Story
```
As a teacher
WHEN I click the delete button on a class
THE SYSTEM SHALL check if the class has associated final comments
AND display a confirmation modal with cascading delete warning if applicable
AND confirm or cancel the deletion
```

#### Acceptance Criteria
1. **AC1**: Delete button click triggers async check for associated final comments
2. **AC2**: Modal opens with title "Delete Class"
3. **AC3**: Modal displays message "Are you sure you want to delete this class?"
4. **AC4**: Modal shows class name and year (e.g., "Mathematics 101 2024")
5. **AC5**: If class has final comments, display yellow warning banner:
   - Icon: ⚠️
   - Text: "This class has X final comment(s) that will also be deleted."
   - Background: `bg-yellow-50` with `border-yellow-200`
6. **AC6**: Confirm button labeled "Delete" with destructive styling
7. **AC7**: Cancel button labeled "Cancel" with secondary styling
8. **AC8**: Clicking Confirm calls `onDeleteClass(id)` and closes modal
9. **AC9**: Clicking Cancel closes modal without deletion
10. **AC10**: Modal supports keyboard navigation and focus management
11. **AC11**: Loading state while checking for final comments
12. **AC12**: Error handling if final comments check fails

#### Implementation Notes
- **API Call Required**: Check final comments count before opening modal
- **Cascading Warning**: Only show if `finalCommentsCount > 0`
- **State Management**: Track both class info and final comments count
- **Error Handling**: Gracefully handle API failures during check

#### Code Pattern for Cascading Check
```typescript
const handleDeleteClick = async (classItem: Class) => {
  try {
    // Check for associated final comments
    const finalCommentsCount = await checkFinalCommentsCount(classItem.id)

    setDeleteConfirmation({
      isOpen: true,
      classId: classItem.id,
      className: `${classItem.name} ${classItem.year}`,
      hasFinalComments: finalCommentsCount > 0,
      finalCommentsCount
    })
  } catch (error) {
    // Handle error - show error message to user
    showError('Failed to check for associated comments')
  }
}
```

---

### US-DELETE-CONFIRM-004: Final Comment Delete Confirmation

**Priority**: HIGH
**Story Points**: 1
**Component**: `src/components/finalComments/FinalCommentsModal.tsx`

#### User Story
```
As a teacher
WHEN I click the delete button on a final comment
THE SYSTEM SHALL display a confirmation modal with student and class context
AND confirm or cancel the deletion
```

#### Acceptance Criteria
1. **AC1**: Delete button click opens `ConfirmationModal` with title "Delete Final Comment"
2. **AC2**: Modal displays message "Are you sure you want to delete this final comment?"
3. **AC3**: Modal shows student name and class context (e.g., "John Doe - Mathematics 101 2024")
4. **AC4**: Modal shows preview of comment text (truncated to 100 chars if longer)
5. **AC5**: Confirm button labeled "Delete" with destructive styling
6. **AC6**: Cancel button labeled "Cancel" with secondary styling
7. **AC7**: Clicking Confirm calls `onDeleteComment(id)` and closes modal
8. **AC8**: Clicking Cancel closes modal without deletion
9. **AC9**: Modal supports keyboard navigation and focus management

#### Implementation Notes
- Include student context in preview (student name, class info)
- No cascading delete warnings needed
- Pattern similar to US-DELETE-CONFIRM-001/002 with enhanced context

---

## Technical Implementation Guide

### Phase 1: Understand Existing ConfirmationModal Component

**File**: `src/components/common/ConfirmationModal.tsx`

#### Expected Interface
```typescript
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  children?: React.ReactNode  // For custom content (warnings, previews)
}
```

#### TDD Step 1: Verify Component Capabilities (RED)
**Test File**: `src/components/common/__tests__/ConfirmationModal.test.tsx`

```typescript
describe('ConfirmationModal - children support', () => {
  it('should render custom children content', () => {
    const { getByText } = render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockClose}
        onConfirm={mockConfirm}
        title="Test Title"
        message="Test Message"
      >
        <div>Custom Preview Content</div>
      </ConfirmationModal>
    )

    expect(getByText('Custom Preview Content')).toBeInTheDocument()
  })
})
```

**Action**: Run test. If it fails, update `ConfirmationModal` to support `children` prop.

---

### Phase 2: Update OutcomeCommentsModal (US-DELETE-CONFIRM-001)

#### TDD Cycle 1: RED - Write Failing Tests

**Test File**: `src/components/outcomeComments/__tests__/OutcomeCommentsModal.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'

describe('OutcomeCommentsModal - Delete Confirmation', () => {
  const mockOutcomeComments = [
    { id: 1, commentText: 'Test comment for deletion', subjectId: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
  ]

  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show ConfirmationModal when delete button is clicked', async () => {
    render(
      <OutcomeCommentsModal
        outcomeComments={mockOutcomeComments}
        onDeleteComment={mockOnDelete}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Delete Outcome Comment')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete this outcome comment/i)).toBeInTheDocument()
    })
  })

  it('should show comment preview in confirmation modal', async () => {
    render(
      <OutcomeCommentsModal
        outcomeComments={mockOutcomeComments}
        onDeleteComment={mockOnDelete}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText(/"Test comment for deletion"/i)).toBeInTheDocument()
    })
  })

  it('should call onDeleteComment when confirm is clicked', async () => {
    render(
      <OutcomeCommentsModal
        outcomeComments={mockOutcomeComments}
        onDeleteComment={mockOnDelete}
        // ... other props
      />
    )

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Click confirm in modal
    const confirmButton = await screen.findByRole('button', { name: /delete/i }) // In modal
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(1)
    })
  })

  it('should close modal when cancel is clicked without deleting', async () => {
    render(
      <OutcomeCommentsModal
        outcomeComments={mockOutcomeComments}
        onDeleteComment={mockOnDelete}
        // ... other props
      />
    )

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Click cancel in modal
    const cancelButton = await screen.findByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Delete Outcome Comment')).not.toBeInTheDocument()
      expect(mockOnDelete).not.toHaveBeenCalled()
    })
  })

  it('should truncate comment preview to 100 characters', async () => {
    const longComment = {
      id: 2,
      commentText: 'A'.repeat(150),
      subjectId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    render(
      <OutcomeCommentsModal
        outcomeComments={[longComment]}
        onDeleteComment={mockOnDelete}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      const preview = screen.getByText(/A{100}\.\.\./)
      expect(preview).toBeInTheDocument()
    })
  })
})
```

**Expected Result**: All tests FAIL (component doesn't use ConfirmationModal yet)

#### TDD Cycle 2: GREEN - Implement to Pass Tests

**File**: `src/components/outcomeComments/OutcomeCommentsModal.tsx`

```typescript
import React, { useState, useCallback } from 'react'
import { ConfirmationModal } from '../common/ConfirmationModal'
import type { OutcomeComment } from '../../types'

interface DeleteConfirmationState {
  isOpen: boolean
  commentId: number | null
  commentText: string
}

export const OutcomeCommentsModal: React.FC<Props> = ({
  outcomeComments,
  onDeleteComment,
  // ... other props
}) => {
  // State for delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    isOpen: false,
    commentId: null,
    commentText: ''
  })

  // Handle delete button click - open confirmation modal
  const handleDeleteClick = useCallback((comment: OutcomeComment) => {
    setDeleteConfirmation({
      isOpen: true,
      commentId: comment.id,
      commentText: comment.commentText
    })
  }, [])

  // Handle confirmation - actually delete the comment
  const handleDeleteConfirm = useCallback(async () => {
    if (deleteConfirmation.commentId !== null) {
      await onDeleteComment(deleteConfirmation.commentId)
      setDeleteConfirmation({ isOpen: false, commentId: null, commentText: '' })
    }
  }, [deleteConfirmation.commentId, onDeleteComment])

  // Handle cancellation - close modal without deleting
  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, commentId: null, commentText: '' })
  }, [])

  // Truncate comment text for preview
  const getCommentPreview = (text: string): string => {
    return text.length > 100 ? `${text.substring(0, 100)}...` : text
  }

  return (
    <>
      {/* Existing modal content */}
      {outcomeComments.map((comment) => (
        <div key={comment.id}>
          {/* ... comment display ... */}
          <button onClick={() => handleDeleteClick(comment)}>
            Delete
          </button>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Outcome Comment"
        message="Are you sure you want to delete this outcome comment?"
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      >
        <p className="text-sm text-gray-600 mt-2">
          "{getCommentPreview(deleteConfirmation.commentText)}"
        </p>
      </ConfirmationModal>
    </>
  )
}
```

**Expected Result**: All tests PASS

#### TDD Cycle 3: REFACTOR - Improve Code Quality

- Extract `getCommentPreview` to a utility function if reused
- Ensure `useCallback` dependencies are correct
- Add TypeScript type guards if needed
- Review accessibility (ARIA labels, focus management)

---

### Phase 3: Update PersonalizedCommentsModal (US-DELETE-CONFIRM-002)

**Pattern**: Identical to OutcomeCommentsModal with different message copy

**Test File**: `src/components/personalizedComments/__tests__/PersonalizedCommentsModal.test.tsx`

**Changes**:
1. Copy test suite from OutcomeCommentsModal tests
2. Update assertions for "Personalized Comment" terminology
3. Implement same pattern in PersonalizedCommentsModal component

**Expected Timeline**: 0.5 day (pattern established)

---

### Phase 4: Update ClassManagementModal (US-DELETE-CONFIRM-003)

#### TDD Cycle 1: RED - Write Failing Tests

**Test File**: `src/components/classes/__tests__/ClassManagementModal.test.tsx`

```typescript
describe('ClassManagementModal - Delete Confirmation with Cascading Warning', () => {
  const mockClass = {
    id: 1,
    name: 'Mathematics 101',
    year: 2024,
    subjectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }

  const mockOnDelete = jest.fn()
  const mockCheckFinalComments = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should check for final comments when delete button is clicked', async () => {
    mockCheckFinalComments.mockResolvedValue(0)

    render(
      <ClassManagementModal
        classes={[mockClass]}
        onDeleteClass={mockOnDelete}
        checkFinalCommentsCount={mockCheckFinalComments}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockCheckFinalComments).toHaveBeenCalledWith(1)
    })
  })

  it('should show cascading delete warning when class has final comments', async () => {
    mockCheckFinalComments.mockResolvedValue(3)

    render(
      <ClassManagementModal
        classes={[mockClass]}
        onDeleteClass={mockOnDelete}
        checkFinalCommentsCount={mockCheckFinalComments}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText(/This class has 3 final comment\(s\) that will also be deleted/i)).toBeInTheDocument()
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })
  })

  it('should NOT show cascading warning when class has no final comments', async () => {
    mockCheckFinalComments.mockResolvedValue(0)

    render(
      <ClassManagementModal
        classes={[mockClass]}
        onDeleteClass={mockOnDelete}
        checkFinalCommentsCount={mockCheckFinalComments}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Delete Class')).toBeInTheDocument()
      expect(screen.queryByText(/will also be deleted/i)).not.toBeInTheDocument()
    })
  })

  it('should show error message if final comments check fails', async () => {
    mockCheckFinalComments.mockRejectedValue(new Error('API Error'))

    render(
      <ClassManagementModal
        classes={[mockClass]}
        onDeleteClass={mockOnDelete}
        checkFinalCommentsCount={mockCheckFinalComments}
        // ... other props
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText(/Failed to check for associated comments/i)).toBeInTheDocument()
    })
  })
})
```

#### TDD Cycle 2: GREEN - Implement to Pass Tests

**File**: `src/components/classes/ClassManagementModal.tsx`

```typescript
import React, { useState, useCallback } from 'react'
import { ConfirmationModal } from '../common/ConfirmationModal'
import type { Class } from '../../types'

interface DeleteConfirmationState {
  isOpen: boolean
  classId: number | null
  className: string
  hasFinalComments: boolean
  finalCommentsCount: number
}

export const ClassManagementModal: React.FC<Props> = ({
  classes,
  onDeleteClass,
  checkFinalCommentsCount,  // New prop - API function
  // ... other props
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    isOpen: false,
    classId: null,
    className: '',
    hasFinalComments: false,
    finalCommentsCount: 0
  })

  const [checkError, setCheckError] = useState<string | null>(null)

  // Handle delete button click - check for final comments first
  const handleDeleteClick = useCallback(async (classItem: Class) => {
    try {
      setCheckError(null)
      const finalCommentsCount = await checkFinalCommentsCount(classItem.id)

      setDeleteConfirmation({
        isOpen: true,
        classId: classItem.id,
        className: `${classItem.name} ${classItem.year}`,
        hasFinalComments: finalCommentsCount > 0,
        finalCommentsCount
      })
    } catch (error) {
      setCheckError('Failed to check for associated comments')
    }
  }, [checkFinalCommentsCount])

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteConfirmation.classId !== null) {
      await onDeleteClass(deleteConfirmation.classId)
      setDeleteConfirmation({
        isOpen: false,
        classId: null,
        className: '',
        hasFinalComments: false,
        finalCommentsCount: 0
      })
    }
  }, [deleteConfirmation.classId, onDeleteClass])

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmation({
      isOpen: false,
      classId: null,
      className: '',
      hasFinalComments: false,
      finalCommentsCount: 0
    })
  }, [])

  return (
    <>
      {checkError && <ErrorMessage message={checkError} />}

      {/* Existing modal content */}
      {classes.map((classItem) => (
        <div key={classItem.id}>
          {/* ... class display ... */}
          <button onClick={() => handleDeleteClick(classItem)}>
            Delete
          </button>
        </div>
      ))}

      {/* Delete Confirmation Modal with Cascading Warning */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Class"
        message={`Are you sure you want to delete this class?`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      >
        <p className="text-sm text-gray-700 mt-2 font-medium">
          {deleteConfirmation.className}
        </p>

        {/* Cascading Delete Warning */}
        {deleteConfirmation.hasFinalComments && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
            <p className="text-sm text-yellow-800">
              ⚠️ This class has {deleteConfirmation.finalCommentsCount} final comment(s) that will also be deleted.
            </p>
          </div>
        )}
      </ConfirmationModal>
    </>
  )
}
```

**Expected Result**: All tests PASS

#### TDD Cycle 3: REFACTOR
- Extract cascading warning to separate component if reused
- Add loading state during final comments check
- Improve error handling UX

---

### Phase 5: Update FinalCommentsModal (US-DELETE-CONFIRM-004)

**Pattern**: Similar to OutcomeCommentsModal with enhanced context (student name, class info)

**Test File**: `src/components/finalComments/__tests__/FinalCommentsModal.test.tsx`

**Key Differences**:
1. Include student name in preview
2. Include class context in preview
3. Message: "Delete Final Comment"

**Expected Timeline**: 0.5 day

---

## Test Coverage Requirements

### Unit Tests (Jest + React Testing Library)

Each component must have tests covering:
1. ✅ Modal opens when delete button clicked
2. ✅ Modal shows correct title and message
3. ✅ Modal shows entity-specific preview/context
4. ✅ Confirm button triggers delete API call
5. ✅ Cancel button closes modal without deletion
6. ✅ Escape key closes modal
7. ✅ Loading state during deletion
8. ✅ Error handling if deletion fails
9. ✅ Accessibility (ARIA labels, keyboard navigation)
10. ✅ Focus management (focus returns to trigger button)

**Additional for ClassManagementModal**:
11. ✅ Final comments check is triggered on delete click
12. ✅ Cascading warning appears if final comments exist
13. ✅ No cascading warning if no final comments
14. ✅ Error handling if final comments check fails

### Integration Tests (Playwright)

**Test File**: `e2e/delete-confirmation.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Delete Confirmation Standardization', () => {
  test('should confirm outcome comment deletion with preview', async ({ page }) => {
    // Navigate to outcome comments
    // Click delete button
    // Assert modal appears with correct title and preview
    // Click Cancel - assert comment still exists
    // Click delete again
    // Click Confirm - assert comment deleted
  })

  test('should show cascading warning when deleting class with final comments', async ({ page }) => {
    // Navigate to classes
    // Create class with final comments
    // Click delete on class
    // Assert warning banner appears with count
    // Click Cancel - assert class still exists
  })

  test('should support keyboard navigation in confirmation modals', async ({ page }) => {
    // Open delete confirmation modal
    // Press Tab - assert focus moves to Cancel button
    // Press Tab again - assert focus moves to Confirm button
    // Press Escape - assert modal closes without deletion
  })
})
```

### Accessibility Tests

**Manual Checklist**:
- [ ] Screen reader announces modal title and message
- [ ] Tab order is logical (Confirm -> Cancel -> Close)
- [ ] Escape key closes modal
- [ ] Enter key on Confirm button triggers deletion
- [ ] Focus is trapped within modal when open
- [ ] Focus returns to delete button after modal closes
- [ ] ARIA attributes: `role="dialog"`, `aria-labelledby`, `aria-describedby`
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Destructive button has clear visual indication (red color alone is not sufficient)

---

## Implementation Order & Timeline

### Recommended Order

1. **Day 1-2**: US-DELETE-CONFIRM-001 (Outcome Comments)
   - Establish pattern with simplest case
   - Validate ConfirmationModal supports all requirements
   - Create reusable helpers (e.g., `getCommentPreview`)

2. **Day 2-3**: US-DELETE-CONFIRM-002 (Personalized Comments)
   - Replicate established pattern
   - Validate consistency across similar entities

3. **Day 4-5**: US-DELETE-CONFIRM-003 (Classes with Cascading)
   - Most complex due to cascading check
   - Requires new API integration
   - Additional error handling

4. **Day 5-6**: US-DELETE-CONFIRM-004 (Final Comments)
   - Similar to 001/002 with enhanced context
   - Final validation of pattern

5. **Day 6-7**: Integration Testing & Bug Fixes
   - E2E tests for all scenarios
   - Accessibility audit
   - Cross-browser testing
   - Bug fixes and polish

### Parallel Development Opportunities

- Stories 001 and 002 can be worked on in parallel if team has capacity
- Story 004 can be started after 001/002 pattern is established

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ConfirmationModal doesn't support children prop | Medium | Medium | Write tests first to validate; add support if needed (low effort) |
| Final comments count API is slow | Low | Medium | Add loading state; consider caching count in class object |
| Existing delete handlers have side effects | Low | High | Review existing implementations; maintain optimistic updates |
| Focus management breaks in modal-within-modal scenarios | Low | Medium | Test thoroughly; use React portal for modals |

### UX Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Users accidentally click Confirm too quickly | Medium | High | Ensure preview is clear and visible; consider 1-second confirm delay for destructive actions |
| Cascading warning is not prominent enough | Low | Medium | Use strong visual design (yellow banner, warning icon) |
| Modal fatigue (too many confirmations) | Low | Low | This is acceptable for delete operations; consistency is more important |

### Process Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tests written after implementation (not TDD) | Medium | Medium | Enforce TDD in code review; reject PRs without tests |
| Incomplete test coverage | Low | Medium | Require ≥90% coverage; include integration tests |
| Pattern divergence across components | Low | Medium | Code review checklist; extract shared helpers |

---

## Success Criteria & Definition of Done

### Functional Requirements
- ✅ All 4 delete operations use `ConfirmationModal`
- ✅ All acceptance criteria for each user story are met
- ✅ Cascading delete warning appears for classes with final comments
- ✅ Comment previews are truncated and formatted correctly
- ✅ All delete operations work as expected (no regressions)

### Technical Requirements
- ✅ All unit tests pass (≥90% code coverage)
- ✅ All integration tests pass
- ✅ Linting passes without errors (`npm run lint`)
- ✅ TypeScript compilation succeeds without errors
- ✅ No console errors or warnings in browser
- ✅ Code follows established patterns (useCallback, state management)

### Accessibility Requirements
- ✅ 0 WCAG 2.1 AA violations (automated audit)
- ✅ Manual keyboard navigation test passes
- ✅ Screen reader announcement test passes
- ✅ Focus management test passes

### Performance Requirements
- ✅ Modal open/close performance < 100ms
- ✅ Final comments count check < 500ms
- ✅ No layout shift when modal opens
- ✅ Bundle size increase < 5KB gzipped

### Documentation Requirements
- ✅ Code comments for complex logic
- ✅ Updated component prop types and interfaces
- ✅ README update if new patterns introduced
- ✅ Commit messages reference user story IDs

---

## Questions for Frontend Engineer

1. Does `ConfirmationModal` currently support the `children` prop for custom content?
   - If not, is it acceptable to add this prop?

2. How should we handle the final comments count check for classes?
   - Is there an existing API endpoint? (`GET /final-comment?classId=X` with count?)
   - Should we add a new endpoint (`GET /class/:id/final-comments-count`)?

3. Are there any existing patterns for modal-within-modal scenarios?
   - ClassManagementModal is already a modal - how do we handle ConfirmationModal within it?

4. What is the current focus management strategy for modals?
   - Does ConfirmationModal handle focus trap and restoration automatically?

5. Are there any performance concerns with the current modal implementation?
   - Should we lazy-load ConfirmationModal or is it already optimized?

---

## Additional Notes

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support required
- Mobile responsive design (modal should work on mobile)

### API Contracts
Ensure consistency with existing delete endpoints:
- `DELETE /outcome-comment/:id`
- `DELETE /personalized-comment/:id`
- `DELETE /class/:id` (with cascading delete of final comments)
- `DELETE /final-comment/:id`

### Accessibility Standards
- Follow WCAG 2.1 AA guidelines
- Color contrast ratio ≥ 4.5:1 for normal text
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators visible

### Code Review Checklist
- [ ] TDD approach followed (tests written first)
- [ ] All acceptance criteria met
- [ ] Test coverage ≥ 90%
- [ ] TypeScript types are correct
- [ ] useCallback used for event handlers
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented
- [ ] Accessibility requirements met
- [ ] Code follows established patterns
- [ ] Commit messages reference user story IDs
- [ ] No console errors or warnings

---

## References

- **User Stories Source**: toDos.md (line 19 - standardize delete confirmations)
- **Related Features**: US-SUBJECT-CREATE-001, US-SUBJECT-CREATE-002, US-SUBJ-DELETE-002
- **Component Location**: `src/components/common/ConfirmationModal.tsx`
- **Testing Framework**: Jest + React Testing Library + Playwright
- **Design System**: Tailwind CSS utility classes

---

**Handoff Date**: 2025-11-05
**Product Owner**: Claude (Product Owner Persona)
**Target Sprint**: Next available sprint
**Estimated Completion**: 1-1.5 weeks from sprint start

**Questions/Clarifications**: Please reach out to Product Owner with any questions before implementation begins.
