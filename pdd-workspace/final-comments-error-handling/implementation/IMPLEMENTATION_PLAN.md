# Implementation Plan: Final Comments Error Handling

**Feature**: Improve Final Comments Error Handling & UX
**Component**: FinalCommentsModal
**Approach**: Test-Driven Development (Red-Green-Refactor)
**Date**: 2026-01-23

---

## Current State Analysis

### Current Error Handling (Lines 366-379, 729-741)
```typescript
try {
  await onCreateComment(request)
  addForm.reset()
} catch (err) {
  addForm.setValidationError('Failed to add final comment. Please try again.')
}
```

**Issues**:
1. ❌ Generic error message (doesn't surface backend details)
2. ❌ Backend's `{ error, details }` structure not extracted
3. ❌ Error stored in validation error state (unclear if shown near button)
4. ❌ No clear preservation of form content logic
5. ❌ Error clearing not managed properly

### Current Error Display
- Error likely shown via validation error state
- Unclear if it's shown near the save button or elsewhere
- No mechanism for error details extraction

---

## TDD Implementation Approach

### Phase 1: RED - Write Failing Tests

#### Test Suite 1: Error Message Extraction
```typescript
describe('FinalCommentsModal - Save Error Handling', () => {
  describe('Error Message Extraction', () => {
    it('should extract error and details from backend response', () => {
      // Test that when API throws: { error: "...", details: "..." }
      // The component extracts both fields
    })

    it('should format error message as "{error}: {details}"', () => {
      // Test: "Duplicate entry: This student already has..."
    })

    it('should handle multiple errors', () => {
      // Test array of errors
    })

    it('should display error within 1 second', () => {
      // Test timing
    })
  })

  describe('Form Content Preservation', () => {
    it('should preserve textarea content after save error', () => {
      // Type comment → Save fails → Comment still in textarea
    })

    it('should preserve all form field values on error', () => {
      // All inputs/selects retain their values
    })

    it('should not reset modal or form on error', () => {
      // Modal stays open, form not cleared
    })

    it('should allow immediate retry without data loss', () => {
      // User can try save again without re-entering
    })
  })

  describe('Error UI Positioning', () => {
    it('should display error near save button', () => {
      // Error appears close to button action
    })

    it('should not obscure comment textarea', () => {
      // Error positioned above button, below textarea
    })

    it('should use error styling (colors, icons)', () => {
      // Alert component with error styling
    })
  })

  describe('Error Clearing', () => {
    it('should clear error when user starts editing', () => {
      // Typing in textarea clears error
    })

    it('should clear error on successful retry', () => {
      // Successful save clears error display
    })

    it('should update error on new save attempt', () => {
      // New error message replaces old one
    })
  })
})
```

#### Test Suite 2: Create/Update/Delete Operations
```typescript
describe('FinalCommentsModal - Create/Update/Delete with Errors', () => {
  describe('Create Comment Error Handling', () => {
    it('should handle create error and preserve form', () => {
      // Duplicate entry error test
    })

    it('should show formatted error message', () => {
      // Test full error display
    })
  })

  describe('Update Comment Error Handling', () => {
    it('should handle update error and preserve form', () => {
      // Edit existing comment, fail, data preserved
    })
  })

  describe('Delete Comment Error Handling', () => {
    it('should handle delete error without destroying modal', () => {
      // Delete fails, modal stays open with data intact
    })
  })
})
```

### Phase 2: GREEN - Implement Minimal Code

#### Step 1: Create Error State Management
```typescript
// Add to component state
const [saveError, setSaveError] = useState<{
  error: string
  details: string
} | null>(null)

// Helper function to extract error
function extractErrorMessage(err: unknown): { error: string; details: string } {
  if (err && typeof err === 'object' && 'error' in err && 'details' in err) {
    return {
      error: (err as any).error,
      details: (err as any).details,
    }
  }
  return {
    error: 'Save failed',
    details: 'An unexpected error occurred. Please try again.',
  }
}
```

#### Step 2: Update Error Handling in Save Operations
```typescript
// Update create error handling (Line 374-375)
catch (err) {
  const errorInfo = extractErrorMessage(err)
  setSaveError(errorInfo)
  // DON'T reset form - preserve content
}

// Update update error handling (Line 739)
catch (err) {
  const errorInfo = extractErrorMessage(err)
  setSaveError(errorInfo)
  // DON'T reset form - preserve content
}

// Update delete error handling (Line 409)
catch (err) {
  const errorInfo = extractErrorMessage(err)
  setSaveError(errorInfo)
}
```

#### Step 3: Create Error Alert Component
```typescript
// Inside modal render, near save buttons
{saveError && (
  <div
    role="alert"
    className="error-alert"
    style={{
      padding: spacing.md,
      marginBottom: spacing.md,
      backgroundColor: '#fee',
      border: `1px solid #fcc`,
      borderRadius: borders.radius.sm,
      color: '#c00',
    }}
  >
    <strong>{saveError.error}:</strong> {saveError.details}
    <button
      onClick={() => setSaveError(null)}
      aria-label="Close error message"
      style={{ marginLeft: spacing.sm }}
    >
      ✕
    </button>
  </div>
)}
```

#### Step 4: Implement Error Clearing Logic
```typescript
// Clear error when user starts editing
const handleCommentChange = (text: string) => {
  setSaveError(null) // Clear error on edit
  addForm.setValue('finalComment', text)
}

// Clear error on successful operations
// In create success handler:
addForm.reset()
setSaveError(null)

// In update success handler:
editForm.reset()
setSaveError(null)
```

---

## Phase 3: REFACTOR - Improve & Optimize

### Refactoring Tasks

1. **Extract Error Handling into Utility**
   - Move `extractErrorMessage` to `src/utils/errorHandling.ts`
   - Create reusable error extraction logic

2. **Create Reusable Error Alert Component**
   - `src/components/common/SaveErrorAlert.tsx`
   - Props: `error`, `onDismiss`
   - Accessible, themed, positioned correctly

3. **Extract Error State to Custom Hook**
   - `src/hooks/useSaveError.ts`
   - Manages error state and clearing logic
   - Reduces component complexity

4. **Improve Accessibility**
   - Ensure screen reader announces error
   - Proper ARIA labels and roles
   - Keyboard dismissible (Escape key)

5. **Add Loading State Handling**
   - Disable retry while save in progress
   - Clear error on new save attempt start

6. **Add Success Feedback**
   - Optional: brief success message
   - Auto-clear error after successful save

---

## Implementation Steps (TDD Cycle)

### Cycle 1: Error Message Extraction
1. ✅ Write tests for error extraction
2. ✅ Implement error extraction logic
3. ✅ Refactor for clarity

### Cycle 2: Form Content Preservation
1. ✅ Write tests for form preservation
2. ✅ Remove form.reset() on errors
3. ✅ Test data persistence

### Cycle 3: Error Display UI
1. ✅ Write tests for error alert rendering
2. ✅ Create SaveErrorAlert component
3. ✅ Refactor styling

### Cycle 4: Error Clearing
1. ✅ Write tests for error clearing
2. ✅ Implement clear on edit logic
3. ✅ Implement clear on success logic

### Cycle 5: Integration Testing
1. ✅ Test full create error workflow
2. ✅ Test full update error workflow
3. ✅ Test full delete error workflow

---

## Files to Modify

1. **`src/components/finalComments/FinalCommentsModal.tsx`**
   - Add save error state
   - Update error handling in try-catch blocks (3 locations)
   - Add error alert rendering
   - Implement error clearing logic
   - Update form change handlers to clear error

2. **`src/utils/errorHandling.ts`** (NEW)
   - `extractErrorMessage()` utility
   - Error format normalization

3. **`src/components/common/SaveErrorAlert.tsx`** (NEW)
   - Reusable error alert component
   - Accessible design

4. **`src/hooks/useSaveError.ts`** (NEW)
   - Error state management hook
   - Error clearing logic

5. **Test files**:
   - `src/components/finalComments/__tests__/FinalCommentsModal.save-error-handling.test.tsx` (NEW)
   - Update existing integration tests

---

## Success Criteria

✅ Error messages extracted from backend response
✅ Both `error` and `details` fields displayed
✅ Error shown near save button (not center of modal)
✅ Form content preserved completely on error
✅ Modal never destroyed/replaced on error
✅ User can retry immediately
✅ Error clears on edit or success
✅ Test coverage >90%
✅ Zero regressions
✅ Accessible (WCAG 2.1 AA)
✅ Works in create, update, and delete modes

---

## Testing Strategy

### Unit Tests
- Error extraction logic
- Error clearing logic
- Error state management

### Component Tests
- Error alert rendering
- Form content preservation
- Error interactions (dismiss, retry)

### Integration Tests
- Full save workflow with error
- Multiple error scenarios
- Error recovery workflow

---

## Timeline Estimate

- **RED Phase (tests)**: ~2 hours
- **GREEN Phase (implementation)**: ~3 hours
- **REFACTOR Phase (optimization)**: ~2 hours
- **Testing & QA**: ~1 hour

**Total**: ~8 hours

---

## Risk Assessment

**Low Risk**:
- Changes isolated to error handling
- No API changes
- No database changes
- Form preservation is additive (not destructive)

**Mitigations**:
- Comprehensive test coverage
- Regression tests for existing save flow
- Thorough manual testing before QA

---

## Next Steps

1. ✅ Read requirements and plan (THIS DOCUMENT)
2. → Write failing tests (RED phase)
3. → Implement error handling (GREEN phase)
4. → Refactor and optimize (REFACTOR phase)
5. → Run full test suite
6. → Handoff to QA Engineer

Ready to proceed with RED phase?
