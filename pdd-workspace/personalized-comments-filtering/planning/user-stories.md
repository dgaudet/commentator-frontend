# User Stories: Filter Personalized Comments by Rating and Search Text

**Feature**: personalized-comments-filtering
**Complexity**: L1 (Micro)
**Branch**: `feature/personalized-comments-filtering`
**Base Branch**: `main`
**Status**: Planning Phase
**Last Updated**: 2026-01-07

---

## Story Overview

| Story ID | Title | Points | Status | Linked Tasks |
|----------|-------|--------|--------|--------------|
| US-FILTER-001 | Add rating selector to FinalCommentsComponent | 2 | PENDING | TASK-1, TASK-2 |
| US-FILTER-002 | Filter personalized comments by selected rating | 2 | PENDING | TASK-3, TASK-4 |
| US-FILTER-003 | Combine rating and search filters for precise selection | 1 | PENDING | TASK-5 |

**Total Effort**: 5 story points
**Total Acceptance Criteria**: 11
**Estimated Implementation Time**: Single sprint

---

## US-FILTER-001: Add Rating Selector to FinalCommentsComponent

**Complexity**: L1 (Micro)
**Effort Estimate**: 2 points
**Status**: PENDING
**Priority**: MEDIUM
**Linked Epic**: N/A (standalone feature)

### User Story

```
AS A teacher using FinalCommentsComponent
I WANT to see a rating selector above the personalized comment picker
SO THAT I can visually select my preferred rating before searching for comments
```

### Acceptance Criteria

**AC-1.1: Rating Selector Renders**
```
GIVEN FinalCommentsComponent is mounted
WHEN the component renders
THEN the EmojiRatingSelector component appears above the comment picker
AND the selector displays ratings 1-5 in emoji format
AND no rating is selected by default (empty state)
```
**Priority**: Critical
**Test Coverage**: UI snapshot, component render verification

**AC-1.2: Styling and Layout**
```
GIVEN FinalCommentsComponent renders rating selector
WHEN the component displays
THEN the rating selector uses the same visual style as PersonalizedCommentsModal version
AND the selector is positioned directly above the comment picker
AND the selector uses design tokens for spacing and typography
AND responsive layout is maintained on mobile devices
```
**Priority**: High
**Test Coverage**: Responsive design testing, design token validation

**AC-1.3: Rating Selector Props**
```
GIVEN EmojiRatingSelector is integrated into FinalCommentsComponent
WHEN the component initializes
THEN the selector receives required props:
  - value: current selected rating (initially null/empty)
  - onChange: callback to update component state
  - label: "Rating" or similar helpful text
  - id: unique identifier for accessibility
AND optional props are handled correctly (disabled, required, ariaLabel)
```
**Priority**: Medium
**Test Coverage**: Props testing, callback verification

**AC-1.4: Label and Accessibility**
```
GIVEN rating selector is displayed
WHEN a teacher interacts with it
THEN the selector has a clear label identifying it as a rating filter
AND keyboard navigation is fully functional (Tab, Arrow keys, Enter)
AND screen reader announces the label and selected value
AND focus management follows accessibility best practices
```
**Priority**: High
**Test Coverage**: a11y testing, keyboard navigation, screen reader verification

---

## US-FILTER-002: Filter Personalized Comments by Selected Rating

**Complexity**: L1 (Micro)
**Effort Estimate**: 2 points
**Status**: PENDING
**Priority**: MEDIUM
**Linked Epic**: N/A (standalone feature)

### User Story

```
AS A teacher selecting a personalized comment
I WANT the comment list to filter based on my selected rating
SO THAT I can quickly find comments that match my preferred rating level
```

### Acceptance Criteria

**AC-2.1: Rating Filter Applied to List**
```
GIVEN FinalCommentsComponent displays available personalized comments
WHEN teacher selects a rating (e.g., rating 4) in the rating selector
THEN the comment list updates immediately to show only comments with rating 4
AND no API call is made (client-side filtering)
AND the list updates with no perceptible delay
```
**Priority**: Critical
**Test Coverage**: Filter logic verification, list snapshot testing, performance

**AC-2.2: Null Rating Clears Filter**
```
GIVEN teacher has selected a rating (e.g., rating 3)
WHEN teacher clears the rating selection (returns to default/empty state)
THEN the comment list resets to show all available personalized comments
AND all previous selections/states remain intact (search text, scroll position, etc.)
```
**Priority**: High
**Test Coverage**: Reset behavior, state management

**AC-2.3: Empty State When No Results**
```
GIVEN teacher selects a rating (e.g., rating 5)
WHEN no personalized comments have that rating
THEN the comment list displays a helpful empty state message
AND the message explains why no results are shown (e.g., "No comments with rating 5")
AND a call-to-action suggests modifying the filter
```
**Priority**: Medium
**Test Coverage**: Empty state rendering, message clarity

**AC-2.4: Filter Works for All Rating Levels**
```
GIVEN the rating selector shows ratings 1-5
WHEN teacher selects each rating level (1, 2, 3, 4, 5)
THEN the list correctly filters for each rating independently
AND filtering works consistently across all rating levels
```
**Priority**: High
**Test Coverage**: Parameterized testing for all ratings

**AC-2.5: State Isolation**
```
GIVEN teacher applies a rating filter
WHEN FinalCommentsComponent re-renders (due to parent updates, etc.)
THEN the selected rating persists throughout the component session
AND the filter state is not lost on re-render
```
**Priority**: Medium
**Test Coverage**: Re-render stability, state persistence

---

## US-FILTER-003: Combine Rating and Search Filters for Precise Selection

**Complexity**: L1 (Micro)
**Effort Estimate**: 1 point
**Status**: PENDING
**Priority**: MEDIUM
**Linked Epic**: N/A (standalone feature)

### User Story

```
AS A teacher with many personalized comments
I WANT to use both rating and search filters together
SO THAT I can quickly narrow down to comments matching both criteria
```

### Acceptance Criteria

**AC-3.1: Combined Filtering Logic**
```
GIVEN FinalCommentsComponent has both rating selector and search field
WHEN teacher selects rating 4 AND types "excellent" in search
THEN the comment list shows only comments with:
  - rating = 4 AND
  - comment text contains "excellent" (case-insensitive)
AND filtering is client-side and immediate (no API calls)
AND the logic applies all active filters simultaneously
```
**Priority**: Critical
**Test Coverage**: Combined filter scenarios, multiple filter conditions

**AC-3.2: Filter Independence**
```
GIVEN both filters are active (rating selected, search text entered)
WHEN teacher clears the rating selection
THEN the list shows all comments matching the search text (rating filter removed)
AND the search text field remains populated with the entered text
WHEN teacher then clears search text
THEN the list shows all available comments again
```
**Priority**: High
**Test Coverage**: Filter clearing, independent operation

**AC-3.3: Backwards Compatibility**
```
GIVEN existing FinalCommentsComponent uses typeahead search
WHEN teacher uses the component without selecting a rating
THEN the search filter works exactly as before
AND the new rating filter does not interfere with existing search behavior
AND users who don't use rating filter see no change in functionality
```
**Priority**: Critical
**Test Coverage**: Regression testing, existing search behavior, no breaking changes

**AC-3.4: Help Text and UX Clarity**
```
GIVEN both filters are available
WHEN teacher uses the component
THEN the UI clearly indicates which filters are active
AND if no results match combined criteria, the empty state explains why
AND the message suggests narrowing or expanding filters (e.g., "No comments match rating 4 and 'typo'")
```
**Priority**: Medium
**Test Coverage**: UX messaging, empty state clarity

---

## Implementation Notes

### Component Integration Map
```
FinalCommentsComponent
├── EmojiRatingSelector (NEW)
│   ├── value: selectedRating
│   └── onChange: setSelectedRating
│
├── Input field (search) - EXISTING
│   ├── value: searchText
│   └── onChange: setSearchText
│
└── Comment List Picker
    └── items: filteredComments (NEW COMPUTED)
        ├── filter by selectedRating
        └── filter by searchText
```

### State Management Pattern
```typescript
// Existing state - unchanged
const [searchText, setSearchText] = useState('')

// New state for this feature
const [selectedRating, setSelectedRating] = useState<number | null>(null)

// Computed derived state
const filteredComments = useMemo(() => {
  return personalizedComments.filter(comment => {
    // Apply rating filter if selected
    if (selectedRating !== null && comment.rating !== selectedRating) return false
    // Apply search filter if entered
    if (searchText && !comment.comment.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })
}, [personalizedComments, selectedRating, searchText])
```

### Test Coverage Requirements
- Unit tests for rating filter logic
- Unit tests for combined filter logic
- Integration tests for component interactions
- Regression tests for existing search functionality
- Accessibility tests for rating selector
- Responsive design tests
- Empty state tests for all combinations

### No Breaking Changes
- EmojiRatingSelector component imported but not modified
- PersonalizedComment type not modified
- API contracts unchanged (all filtering client-side)
- Existing search behavior fully preserved
- Component prop types unchanged

---

## Acceptance Criteria Summary

**Total AC**: 11 criteria
**Critical (must-have)**: 4 criteria
- AC-1.1: Rating selector renders
- AC-2.1: Rating filter applied
- AC-3.1: Combined filtering logic
- AC-3.3: Backwards compatibility

**High (should-have)**: 4 criteria
- AC-1.2: Styling and layout
- AC-1.4: Accessibility
- AC-2.2: Null rating clears
- AC-2.4: All rating levels work
- AC-3.2: Filter independence

**Medium (nice-to-have)**: 3 criteria
- AC-1.3: Props handling
- AC-2.3: Empty state
- AC-2.5: State isolation
- AC-3.4: Help text and UX

---

## Definition of Done

For this feature to be considered complete:

- [ ] All 11 acceptance criteria verified with passing tests
- [ ] EmojiRatingSelector imported and rendered correctly
- [ ] Combined filtering logic implemented and tested
- [ ] Existing search functionality works unchanged (zero regressions)
- [ ] Empty state messaging is helpful and clear
- [ ] Keyboard navigation fully functional
- [ ] Screen reader accessibility verified (WCAG 2.1 AA)
- [ ] Mobile responsive design maintained
- [ ] Code follows project TDD standards (Red-Green-Refactor)
- [ ] All linting passes: `npm run lint`
- [ ] All tests pass: `npm run test` (1400+ tests)
- [ ] No console errors or warnings
- [ ] Git commits reference acceptance criteria
- [ ] PR includes reference to these user stories
- [ ] Product Owner acceptance: All AC met

---

## Story Relationships

**Dependency Chain**:
```
US-FILTER-001 (Add selector)
    ↓
US-FILTER-002 (Filter by rating)
    ↓
US-FILTER-003 (Combined filtering)
```

**Related Features**:
- `personalized-comments-rating` (upstream) - Provides EmojiRatingSelector component
- `rating-persist-last-selected` (completed) - Similar rating selection UX pattern

---

## Appendix: Example Scenarios

### Scenario A: Browse by Rating Level
```
Scenario: Teacher finds all "Good" (4-star) comments
Given: 20 personalized comments in FinalCommentsComponent
When: Teacher selects rating 4
Then: 6 comments with rating 4 are displayed
And: Other comments are hidden
And: Teacher can select from 6 results
```

### Scenario B: Refine with Search
```
Scenario: Teacher refines rating-4 comments with search
Given: 6 comments with rating 4 are displayed
When: Teacher types "excellent" in search
Then: 2 comments with rating 4 AND "excellent" in text are shown
And: Teacher can select from 2 results
```

### Scenario C: Reset and Re-filter
```
Scenario: Teacher tries different filter approach
Given: 2 results matching rating 4 and "excellent"
When: Teacher clears rating selector
Then: All comments matching "excellent" are shown (maybe 5 total)
When: Teacher clears search text
Then: All 20 original comments are shown
When: Teacher selects rating 3
Then: 4 comments with rating 3 are shown
```

### Scenario D: No Results Handling
```
Scenario: Teacher explores rare rating
Given: Few comments with rating 1 exist
When: Teacher selects rating 1
Then: Only 1 comment with rating 1 is shown
When: Teacher types "advanced" (no rating-1 comments have this word)
Then: Empty state message appears: "No comments with rating 1 and 'advanced'"
```

---

**Created**: 2026-01-07
**Status**: Ready for Frontend Engineer Implementation
**Next Step**: Design phase documentation (minimal for L1)

