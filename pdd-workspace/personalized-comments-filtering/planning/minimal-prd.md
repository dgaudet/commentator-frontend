# Minimal PRD: Filter Personalized Comments by Rating and Search Text

**Feature**: personalized-comments-filtering
**Complexity**: L1 (Micro)
**Estimated Points**: 5
**Status**: Planning Phase
**Last Updated**: 2026-01-07

---

## Executive Summary

Add combined filtering capabilities to FinalCommentsComponent's personalized comment picker. Teachers can now filter available personalized comments using both a rating selector (same EmojiRatingSelector from PersonalizedCommentsModal) and the existing typeahead search, enabling precise comment selection through dual filtering criteria.

---

## User Problem Statement

**Current State (Before)**:
- Teachers use only typeahead search to find personalized comments in FinalCommentsComponent
- When many comments exist, finding comments matching both a rating preference AND search text is cumbersome
- Workflow requires scanning through all results or typing very specific search terms

**Desired State (After)**:
- Teachers can select a rating to instantly filter personalized comments to those matching that rating
- Teachers can combine rating filter with typeahead search to narrow results further
- Teachers can clear the rating filter to see all comments again
- Both filters work independently and together for flexible selection

---

## Feature Scope

### In Scope ✅
- Add EmojiRatingSelector to FinalCommentsComponent above the comment picker
- Implement combined filtering logic: rating + typeahead search
- Persist rating selection during FinalCommentsComponent session (optional)
- Handle empty states when no comments match both criteria
- Keyboard navigation and accessibility for rating selector

### Out of Scope ❌
- Changes to EmojiRatingSelector component itself (reuse existing)
- New API endpoints (filtering is client-side)
- Comments data model changes
- Persistence beyond component session

---

## Key Requirements

### Functional Requirements

1. **Rating Selector Display**
   - EmojiRatingSelector positioned above personalized comment picker in FinalCommentsComponent
   - Same visual style as PersonalizedCommentsModal
   - Shows rating options: 1-5 emoji scale
   - Default state: No rating selected (shows all comments)

2. **Combined Filtering Logic**
   - When user selects rating: Show only personalized comments with that rating
   - When user types search text: Show only comments matching search AND selected rating
   - When user selects both: Apply both filters simultaneously
   - When user clears rating: Reset to show all comments (search text still applies)
   - Search is case-insensitive substring match

3. **Empty State Handling**
   - Show appropriate message when no comments match combined criteria
   - Message should be helpful (e.g., "No comments match rating 5 and search 'excellent'")
   - Allow user to modify filters to find results

4. **State Management**
   - Track currently selected rating in component state
   - Track currently entered search text (existing behavior preserved)
   - Both state variables influence rendered comment list

### Non-Functional Requirements

1. **Performance**
   - Filtering must be instant (no API calls)
   - No unnecessary re-renders
   - Client-side filtering only

2. **Accessibility**
   - Rating selector keyboard navigable
   - ARIA labels for rating selector
   - Search field maintains focus management
   - Semantic HTML structure

3. **Usability**
   - Filters are optional (both can be empty)
   - Clear visual indication of active filter
   - Intuitive empty state messaging
   - Responsive design (mobile-friendly)

---

## User Workflows

### Workflow 1: Browse by Rating
```
Teacher opens FinalCommentsComponent
→ Selects rating 5 in rating selector
→ Sees only personalized comments rated 5
→ Selects comment from filtered list
→ Comment populated in form
```

### Workflow 2: Combined Filtering
```
Teacher opens FinalCommentsComponent
→ Selects rating 4 in rating selector
→ Types "excellent" in search field
→ Sees only rating-4 comments with "excellent" in text
→ Selects comment from filtered results
→ Comment populated in form
```

### Workflow 3: Clear and Reset
```
Teacher opens FinalCommentsComponent
→ Selects rating 3
→ Realizes needs different search
→ Clears rating selector (back to default)
→ Now sees all comments matching search text
→ Types new search term
→ Finds comment in results
```

---

## Technical Architecture

### Component Integration
- **Parent**: FinalCommentsComponent
- **New Addition**: EmojiRatingSelector (above comment picker)
- **Unchanged**: Typeahead search field (continues working as before)
- **Modified**: Comment list filtering logic

### State Structure
```typescript
// Existing state
const [searchText, setSearchText] = useState('') // unchanged

// New state
const [selectedRating, setSelectedRating] = useState<number | null>(null)

// Computed: filtered list
const filteredComments = useMemo(() => {
  return comments.filter(comment => {
    // Match rating (if selected)
    if (selectedRating && comment.rating !== selectedRating) return false
    // Match search text (if entered)
    if (searchText && !comment.comment.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })
}, [comments, selectedRating, searchText])
```

### Data Flow
```
personalized comments
      ↓
[apply rating filter]
      ↓
[apply search filter]
      ↓
filtered comments → display in picker
```

---

## Success Criteria

- [ ] Rating selector renders above comment picker in FinalCommentsComponent
- [ ] Selecting a rating filters comments by rating value
- [ ] Search filter continues to work as before
- [ ] Both filters work together (combined filtering)
- [ ] Clearing rating shows all comments (search filter still applies)
- [ ] Empty state shows helpful message when no results
- [ ] All tests pass (new + existing)
- [ ] Zero regressions in existing functionality
- [ ] Keyboard navigation works for rating selector
- [ ] Mobile responsive design maintained
- [ ] Accessibility (WCAG 2.1 AA) compliant

---

## Design Constraints

1. **Reuse Existing Component**: Use EmojiRatingSelector from PersonalizedCommentsModal (no new component)
2. **Client-Side Only**: No backend changes, all filtering in frontend
3. **No Data Model Changes**: PersonalizedComment type unchanged
4. **Session Scope**: Rating selection doesn't persist after component unmounts
5. **Preserve Existing Search**: Typeahead functionality fully preserved

---

## Out-of-Scope Decisions

- **Rating persistence**: User chose session-only for this feature
- **Favorite/pin comments**: Not part of this feature
- **Sort by rating**: Not part of this feature (filtering only)
- **Filter by other attributes**: Not part of this feature (rating and search only)
- **API-based filtering**: All filtering is client-side

---

## Dependencies & Integration Points

### Upstream Dependencies
- `personalized-comments-rating` feature (EmojiRatingSelector component)
- Existing PersonalizedComment data structure with rating field

### Integration Points
- FinalCommentsComponent will import and render EmojiRatingSelector
- Share filtering logic with PersonalizedCommentsModal patterns
- Maintain consistent styling using design tokens

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Performance with large comment lists | Low | Medium | Implement useMemo for filtered list, test with 100+ comments |
| Regressions in existing search | Low | High | Comprehensive tests for combined filtering scenarios |
| Accessibility issues | Low | Medium | Follow WCAG 2.1 AA patterns from PronounSelect, extensive keyboard testing |
| Empty state UX unclear | Low | Low | Helpful messaging that explains active filters |

---

## Definition of Done

- [ ] Code changes committed to feature branch
- [ ] All acceptance criteria from user stories verified with tests
- [ ] Existing search functionality unaffected
- [ ] No regressions in FinalCommentsComponent workflows
- [ ] Code adheres to project TDD standards (Red-Green-Refactor)
- [ ] PR includes reference to user stories and acceptance criteria
- [ ] Product Owner acceptance: All acceptance criteria met
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test` (1400+ tests)

