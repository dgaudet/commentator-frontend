# Implementation Tasks: Filter Personalized Comments by Rating and Search Text

**Feature**: personalized-comments-filtering
**Complexity**: L1 (Micro)
**Branch**: `feature/personalized-comments-filtering`
**Base Branch**: `main`
**Status**: IN_PROGRESS
**Last Updated**: 2026-01-07

---

## 📊 Task Summary

| Task | User Story | Points | Risk | TDD Cycle | Status |
|------|-----------|--------|------|-----------|--------|
| TASK-1 | US-FILTER-001 | 1 | LOW | RED-GREEN-REFACTOR | PENDING |
| TASK-2 | US-FILTER-001 | 1 | LOW | RED-GREEN-REFACTOR | PENDING |
| TASK-3 | US-FILTER-002 | 1 | LOW | RED-GREEN-REFACTOR | PENDING |
| TASK-4 | US-FILTER-002 | 1 | LOW | RED-GREEN-REFACTOR | PENDING |
| TASK-5 | US-FILTER-003 | 1 | LOW | RED-GREEN-REFACTOR | PENDING |
| TASK-6 | Regression Testing | 1 | LOW | Testing | PENDING |

**Total Effort**: 6 story points
**Total Risk**: All LOW (isolated component changes)

---

## TASK-1: Add Rating Selector State (US-FILTER-001, AC-1.1)

**Effort**: 1 point
**Risk Tier**: LOW
**Linked AC**: AC-1.1, AC-1.2, AC-1.3, AC-1.4

### Objective
Add state management for rating selection in FinalCommentsModal.

### RED Phase - Failing Tests

**Test File**: `src/components/finalComments/__tests__/FinalCommentsComponent.filtering.test.tsx`

**Test Cases**:
```typescript
// AC-1.1: Rating selector renders with no selection by default
it('should render rating selector above comment picker', () => {
  const { getByLabelText, getByText } = render(<FinalCommentsModal {...props} />)
  // Rating selector should exist with label
  expect(getByText(/rating filter/i)).toBeInTheDocument()
  // No rating selected initially (all buttons in neutral state)
})

// AC-1.2: Styling and layout compliance
it('should position rating selector above typeahead search', () => {
  const { container } = render(<FinalCommentsModal {...props} />)
  const ratingSelector = container.querySelector('[role="radiogroup"]')
  const typeaheadSearch = container.querySelector('[role="combobox"]')
  // Rating selector should appear before typeahead in DOM
  expect(ratingSelector.compareDocumentPosition(typeaheadSearch)).toBe(4) // DOCUMENT_POSITION_FOLLOWING
})

// AC-1.3: Props handling
it('should handle rating selector props correctly', () => {
  const { container } = render(<FinalCommentsModal {...props} />)
  const ratingButtons = container.querySelectorAll('[role="radio"]')
  expect(ratingButtons).toHaveLength(5) // 5 rating levels
  ratingButtons.forEach((btn, idx) => {
    expect(btn).toHaveAttribute('aria-label')
    expect(btn).toHaveAttribute('aria-checked')
  })
})

// AC-1.4: Keyboard navigation and accessibility
it('should support keyboard navigation for rating selector', () => {
  const { getByLabelText, container } = render(<FinalCommentsModal {...props} />)
  const ratingButtons = container.querySelectorAll('[role="radio"]')

  // Tab into first button
  ratingButtons[0].focus()
  expect(document.activeElement).toBe(ratingButtons[0])

  // Arrow right to move to second button
  fireEvent.keyDown(ratingButtons[0], { key: 'ArrowRight' })
  // ... validate movement
})
```

### GREEN Phase - Minimal Implementation

**Changes to FinalCommentsModal.tsx**:

1. Add import for EmojiRatingSelector:
```typescript
import { EmojiRatingSelector } from '../common/EmojiRatingSelector'
```

2. Add state for rating filter (after other state declarations, around line 167):
```typescript
// US-FILTER-001: Track selected rating for filtering personalized comments
const [filterRating, setFilterRating] = useState<number>(0) // 0 = no selection
```

3. Import filtering utility (add to existing imports):
```typescript
// Will implement: filterCommentsByRating helper
```

4. Render EmojiRatingSelector above TypeaheadSearch (before line 730, around line 728):
```typescript
{/* US-FILTER-001: Rating selector for filtering */}
<EmojiRatingSelector
  id="comment-filter-rating"
  label="Filter by Rating"
  value={filterRating}
  onChange={setFilterRating}
  disabled={submitting}
/>
```

5. Clear rating on modal close (in existing useEffect around line 201):
```typescript
// US-FILTER-001: Also clear rating filter
setFilterRating(0)
```

### REFACTOR Phase

- Review styling consistency with PersonalizedCommentsModal
- Ensure accessibility attributes are properly set
- Verify focus management after rating selection

---

## TASK-2: Filter Comments by Rating (US-FILTER-002, AC-2.1 to AC-2.5)

**Effort**: 1 point
**Risk Tier**: LOW
**Linked AC**: AC-2.1, AC-2.2, AC-2.3, AC-2.4, AC-2.5

### Objective
Implement filtering logic to show only comments matching selected rating.

### RED Phase - Failing Tests

**Test Cases**:
```typescript
// AC-2.1: Rating filter applied to list
it('should filter personalized comments by selected rating', () => {
  const mockComments = [
    { id: '1', rating: 5, comment: 'Excellent' },
    { id: '2', rating: 4, comment: 'Very good' },
    { id: '3', rating: 5, comment: 'Outstanding' },
    { id: '4', rating: 3, comment: 'Good' },
  ]

  const { getByRole, getByText, queryByText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  // Select rating 5
  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  fireEvent.click(ratingButtons[4]) // 5th button = rating 5

  // TypeaheadSearch should show only 2 items (with rating 5)
  // Items 1 and 3 should be visible
  expect(getByText('Excellent')).toBeInTheDocument()
  expect(getByText('Outstanding')).toBeInTheDocument()
  expect(queryByText('Very good')).not.toBeInTheDocument()
})

// AC-2.2: Clearing rating shows all comments
it('should show all comments when rating filter is cleared', () => {
  const mockComments = [
    { id: '1', rating: 5, comment: 'Excellent' },
    { id: '2', rating: 4, comment: 'Very good' },
  ]

  const { getByRole, getByText, getByLabelText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  // Select rating 5
  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  fireEvent.click(ratingButtons[4])

  // Clear selection (click again or use different mechanism)
  fireEvent.click(ratingButtons[4]) // Clicking again clears

  // Both items visible
  expect(getByText('Excellent')).toBeInTheDocument()
  expect(getByText('Very good')).toBeInTheDocument()
})

// AC-2.3: Empty state when no results
it('should show helpful empty state when no comments match rating', () => {
  const mockComments = [
    { id: '1', rating: 1, comment: 'Poor' },
    { id: '2', rating: 2, comment: 'Fair' },
  ]

  const { getByRole, getByText, queryByText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  // Select rating 5 (no comments have this)
  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  fireEvent.click(ratingButtons[4])

  // Should show empty state message
  expect(getByText(/no.*comments.*rating 5/i)).toBeInTheDocument()
  expect(queryByText('Poor')).not.toBeInTheDocument()
})

// AC-2.4: Works for all rating levels
it('should correctly filter for each rating level 1-5', () => {
  const mockComments = [
    { id: '1', rating: 1, comment: 'One' },
    { id: '2', rating: 2, comment: 'Two' },
    { id: '3', rating: 3, comment: 'Three' },
    { id: '4', rating: 4, comment: 'Four' },
    { id: '5', rating: 5, comment: 'Five' },
  ]

  const { getByRole, getByText, queryByText, rerender } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')

  // Test each rating 1-5
  for (let rating = 1; rating <= 5; rating++) {
    fireEvent.click(ratingButtons[rating - 1])
    expect(getByText(String(rating))).toBeInTheDocument()
    for (let i = 1; i <= 5; i++) {
      if (i !== rating) {
        expect(queryByText(String(i))).not.toBeInTheDocument()
      }
    }
  }
})

// AC-2.5: State persists through re-renders
it('should maintain rating filter through component re-renders', () => {
  const mockComments = [
    { id: '1', rating: 4, comment: 'Excellent' },
    { id: '2', rating: 3, comment: 'Good' },
  ]

  const { getByRole, getByText, queryByText, rerender } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  // Select rating 4
  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  fireEvent.click(ratingButtons[3])
  expect(getByText('Excellent')).toBeInTheDocument()

  // Re-render component (simulating parent update)
  rerender(<FinalCommentsModal {...props} personalizedComments={mockComments} />)

  // Rating filter should still be active
  expect(getByText('Excellent')).toBeInTheDocument()
  expect(queryByText('Good')).not.toBeInTheDocument()
})
```

### GREEN Phase - Minimal Implementation

**Changes to FinalCommentsModal.tsx**:

1. Create filtering utility function (add before component):
```typescript
const filterCommentsByRating = (
  comments: PersonalizedComment[],
  selectedRating: number
): PersonalizedComment[] => {
  if (selectedRating === 0) return comments // No filter selected
  return comments.filter(comment => comment.rating === selectedRating)
}
```

2. Apply filter to TypeaheadSearch items (around line 731):
```typescript
const filteredComments = useMemo(() => {
  return filterCommentsByRating(
    sortPersonalizedCommentsByRating(personalizedComments),
    filterRating
  )
}, [personalizedComments, filterRating])

// Update TypeaheadSearch to use filteredComments
<TypeaheadSearch
  items={filteredComments}
  // ... rest of props
/>
```

3. Update empty message to indicate active filter (around line 745):
```typescript
emptyMessage={filterRating > 0
  ? `No comments with rating ${filterRating}`
  : 'No personalized comments available for this subject'}
```

### REFACTOR Phase

- Optimize useMemo dependencies
- Improve empty state messaging with search context
- Consider performance with large comment lists

---

## TASK-3: Combined Filter Logic (US-FILTER-003, AC-3.1 to AC-3.4)

**Effort**: 1 point
**Risk Tier**: LOW
**Linked AC**: AC-3.1, AC-3.2, AC-3.3, AC-3.4

### Objective
Ensure rating and search filters work together correctly.

### RED Phase - Failing Tests

**Test Cases**:
```typescript
// AC-3.1: Combined filtering logic
it('should apply both rating and search filters simultaneously', () => {
  const mockComments = [
    { id: '1', rating: 4, comment: 'Excellent performance' },
    { id: '2', rating: 4, comment: 'Good work' },
    { id: '3', rating: 5, comment: 'Excellent work' },
  ]

  const { getByRole, getByText, queryByText, getByPlaceholderText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  // Select rating 4
  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  fireEvent.click(ratingButtons[3])

  // Type search "excellent"
  const searchInput = getByPlaceholderText(/search/i)
  fireEvent.change(searchInput, { target: { value: 'excellent' } })

  // Only item 1 should match (rating 4 AND contains "excellent")
  expect(getByText('Excellent performance')).toBeInTheDocument()
  expect(queryByText('Good work')).not.toBeInTheDocument()
  expect(queryByText('Excellent work')).not.toBeInTheDocument() // rating 5, not 4
})

// AC-3.2: Filter independence
it('should allow independent clearing of filters', () => {
  const mockComments = [
    { id: '1', rating: 4, comment: 'Excellent' },
    { id: '2', rating: 3, comment: 'Good' },
  ]

  const { getByRole, getByText, queryByText, getByPlaceholderText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  const searchInput = getByPlaceholderText(/search/i)

  // Set both filters
  fireEvent.click(ratingButtons[3]) // rating 4
  fireEvent.change(searchInput, { target: { value: 'excellent' } })

  // Clear rating only (select it again to toggle)
  fireEvent.click(ratingButtons[3])

  // Search filter still applies, shows all matching "excellent"
  expect(getByText('Excellent')).toBeInTheDocument()
})

// AC-3.3: Backwards compatibility
it('should preserve existing search behavior when no rating selected', () => {
  const mockComments = [
    { id: '1', rating: 1, comment: 'Excellent performance' },
    { id: '2', rating: 3, comment: 'Good work' },
    { id: '3', rating: 5, comment: 'Excellent work' },
  ]

  const { getByText, queryByText, getByPlaceholderText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  const searchInput = getByPlaceholderText(/search/i)
  fireEvent.change(searchInput, { target: { value: 'excellent' } })

  // No rating selected, so search works across all ratings
  expect(getByText('Excellent performance')).toBeInTheDocument()
  expect(getByText('Excellent work')).toBeInTheDocument()
  expect(queryByText('Good work')).not.toBeInTheDocument()
})

// AC-3.4: Clear UX messaging
it('should show helpful empty state explaining active filters', () => {
  const mockComments = [
    { id: '1', rating: 4, comment: 'Excellent' },
  ]

  const { getByRole, getByText, getByPlaceholderText } = render(
    <FinalCommentsModal {...props} personalizedComments={mockComments} />
  )

  const ratingButtons = getByRole('radiogroup').querySelectorAll('[role="radio"]')
  const searchInput = getByPlaceholderText(/search/i)

  // Select rating 5 (no comments) and search for "xyz" (also no match)
  fireEvent.click(ratingButtons[4]) // rating 5
  fireEvent.change(searchInput, { target: { value: 'xyz' } })

  // Empty state message should explain both filters
  const emptyMessage = getByText(/no.*comments.*rating.*search/i)
  expect(emptyMessage).toBeInTheDocument()
})
```

### GREEN Phase - Minimal Implementation

The implementation is already complete from TASK-2 because:
1. TypeaheadSearch handles search filtering internally
2. We filter personalizedComments before passing to TypeaheadSearch
3. Both filters naturally combine in sequence: rating filter → search filter

**Verification**: Ensure TypeaheadSearch is receiving already-filtered comments and applies search on top.

### REFACTOR Phase

- Improve empty state message to mention both active filters
- Consider UX messaging for edge cases

---

## TASK-4: Regression Testing (Testing)

**Effort**: 1 point
**Risk Tier**: LOW
**Type**: QA/Validation

### Objective
Verify no regressions in existing functionality.

### Test Checklist

- [ ] Existing TypeaheadSearch tests still pass
- [ ] Search functionality works unchanged when no rating selected
- [ ] FinalCommentsModal create/edit/delete still work
- [ ] Outcome comment display unaffected
- [ ] Pronoun selection still works
- [ ] Populate button functionality preserved
- [ ] Keyboard navigation for all form elements
- [ ] Mobile responsive layout maintained
- [ ] Accessibility (WCAG 2.1 AA) intact
- [ ] No console errors or warnings
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] All tests pass: `npm run test` (1400+ tests)

---

## Implementation Notes

### Files to Modify
- `src/components/finalComments/FinalCommentsModal.tsx` - Main implementation

### Files to Create
- `src/components/finalComments/__tests__/FinalCommentsComponent.filtering.test.tsx` - New test file

### No Breaking Changes
- EmojiRatingSelector component unchanged
- PersonalizedComment type unchanged
- TypeaheadSearch component unchanged
- API contracts unchanged (all filtering client-side)

### State Management

**New State**:
```typescript
const [filterRating, setFilterRating] = useState<number>(0) // 0 = no selection
```

**Computed Derived State**:
```typescript
const filteredComments = useMemo(() => {
  if (filterRating === 0) return sortPersonalizedCommentsByRating(personalizedComments)
  return filterCommentsByRating(
    sortPersonalizedCommentsByRating(personalizedComments),
    filterRating
  )
}, [personalizedComments, filterRating])
```

### Performance Considerations
- useMemo prevents unnecessary re-filtering on every render
- Filter operation is O(n) - linear, acceptable for comment lists
- No API calls triggered by filter changes

---

## Definition of Done

- [ ] All 11 acceptance criteria verified with passing tests
- [ ] Rating selector renders and works correctly
- [ ] Combined filtering logic implemented and tested
- [ ] Existing search functionality unaffected (zero regressions)
- [ ] Empty state messaging is helpful and clear
- [ ] Keyboard navigation fully functional
- [ ] Screen reader accessibility verified (WCAG 2.1 AA)
- [ ] Mobile responsive design maintained
- [ ] Code follows project TDD standards (Red-Green-Refactor)
- [ ] All linting passes: `npm run lint`
- [ ] All tests pass: `npm run test`
- [ ] No console errors or warnings
- [ ] Git commits reference acceptance criteria
- [ ] PR includes reference to user stories
- [ ] Product Owner acceptance: All AC met

---

**Status**: Ready for RED Phase Testing
**Next**: Write failing tests for AC-1.1 through AC-3.4

