# Feature Specification: Multiple Outcome Comments Selection

**Feature**: Allow users to select from multiple Outcome Comments that match a grade

**Status**: Design Specification (Ready for Implementation)

**Date**: 2026-01-09

---

## 1. Overview

When a user enters a grade in the Final Comments form, the system automatically fetches the matching Outcome Comment. However, multiple Outcome Comments may match the same grade. This specification defines how users can view and select from these alternatives.

### Key Context
- **Frequency**: ~20% of entries will have multiple matches
- **Typical matches**: 2-3 comments (rarely 5+)
- **Comment length**: Up to two sentences
- **Device support**: Desktop and tablet (mobile not required)
- **Design approach**: Expandable stack with simple text alternatives

---

## 2. User Stories

### US-FINAL-001: Single Outcome Comment Display (Baseline)
```
WHEN a user enters a grade with only one matching Outcome Comment
THEN the system shall display that comment in the read-only "Outcome Comment by Grade" section
AND no toggle button shall be shown
AND the user shall see the comment cannot be modified from this interface
```

**Acceptance Criteria:**
- Single matching comment displays automatically
- Section title reads "Outcome Comment by Grade"
- Comment text appears in read-only display area
- No interaction affordances (buttons, toggles) shown

---

### US-FINAL-002: Multiple Outcomes - Collapsed State
```
WHEN a user enters a grade with 2+ matching Outcome Comments
THEN the system shall display the first matching comment
AND show a "[+ Show X more options]" toggle button
AND the comment shall remain read-only
```

**Acceptance Criteria:**
- First matching comment displays automatically
- Toggle button text shows count: "[+ Show 2 more options]" or "[+ Show 1 more option]"
- Button is clearly clickable with hover state
- All alternatives remain hidden until button clicked

---

### US-FINAL-003: Multiple Outcomes - Expanded State
```
WHEN a user clicks the "[+ Show X more options]" button
THEN the list of alternative comments shall expand below
AND the toggle button text shall change to "[- Hide alternatives]"
AND all alternatives shall be displayed as clickable items
AND each alternative shall show the full comment text
```

**Acceptance Criteria:**
- Smooth expansion animation (optional but recommended)
- Alternatives appear as separate items with visual separation
- Each alternative shows complete comment text
- Hover state indicates clickability
- Section expands without pushing form content below out of view

---

### US-FINAL-004: Select Alternative Comment
```
WHEN a user clicks on an alternative Outcome Comment
THEN that comment shall become the selected comment
AND it shall replace the currently displayed comment
AND the alternatives list shall automatically collapse
AND the toggle button shall return to "[+ Show X more options]"
```

**Acceptance Criteria:**
- Alternative text becomes the displayed comment
- Previously selected comment is no longer highlighted
- List collapses smoothly
- Toggle button updates text correctly
- Selected comment is properly stored in form state

---

### US-FINAL-005: Dynamic Grade Changes
```
WHEN a user changes the grade after selecting alternatives
THEN the system shall fetch new matching comments for the new grade
AND the display shall reset to show the first match (collapsed)
AND any previous alternative selections shall be cleared
```

**Acceptance Criteria:**
- Grade change triggers comment refresh
- Expanded list collapses
- First matching comment displays
- No carry-over of previous selections

---

## 3. Component Architecture

### FinalCommentsModal Component Structure

```
<FinalCommentsModal>
  ├── Form Fields
  │   ├── First Name input
  │   ├── Last Name input
  │   ├── Grade input
  │   ├── Pronoun select
  │   └── OutcomeCommentSelector (NEW)
  │       ├── SelectedCommentDisplay
  │       └── AlternativeCommentsList
  ├── Personalized Comments section
  └── Action buttons
```

### New Component: OutcomeCommentSelector

**Location**: `src/components/finalComments/OutcomeCommentSelector.tsx`

**Props**:
```typescript
interface OutcomeCommentSelectorProps {
  grade: number | null
  selectedOutcomeCommentId: string | null
  outcomeComments: OutcomeComment[]
  onSelectComment: (commentId: string) => void
  loading?: boolean
  error?: string | null
}
```

**Responsibilities**:
- Filter comments by grade
- Manage expanded/collapsed state
- Render selected comment in read-only display
- Render alternatives list when expanded
- Handle comment selection
- Display loading and error states

---

## 4. State Management

### New State Variables in FinalCommentsModal

```typescript
// Outcome comment management
const [selectedOutcomeCommentId, setSelectedOutcomeCommentId] = useState<string | null>(null)
const [expandedAlternatives, setExpandedAlternatives] = useState(false)

// Matching comments derived state
const [matchingOutcomeComments, setMatchingOutcomeComments] = useState<OutcomeComment[]>([])
```

### Effect: Fetch Matching Comments on Grade Change

```typescript
useEffect(() => {
  if (grade !== null && grade >= 0 && outcomeComments) {
    // Filter comments matching this grade
    const matching = outcomeComments.filter(comment => {
      // Matching logic - depends on how grade mapping works
      return comment.matchesGrade(grade)
    })

    setMatchingOutcomeComments(matching)

    // Reset state when grade changes
    setExpandedAlternatives(false)

    // Auto-select first match
    if (matching.length > 0) {
      setSelectedOutcomeCommentId(matching[0].id)
    } else {
      setSelectedOutcomeCommentId(null)
    }
  }
}, [grade, outcomeComments])
```

---

## 5. UI/UX Specifications

### 5.1 Single Comment State

```
Outcome Comment by Grade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<first name> has done a great job
this year. They worked very hard
coming to tutorials as needed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Styling Notes:**
- Use existing read-only text box styling
- Font: Typography system (match other form fields)
- Color: Text secondary color (gray)
- Padding: Standard form field padding
- No borders, just background
- Height: Auto-expand based on content
- No toggle button shown

---

### 5.2 Multiple Comments - Collapsed State

```
Outcome Comment by Grade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<first name> has done a great job
this year. They worked very hard
coming to tutorials as needed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[+ Show 2 more options]
```

**Toggle Button Styling:**
- Style: Link/text button (not prominent)
- Text: "+ Show {count} more option(s)" or "- Hide alternatives"
- Font size: Smaller than body text (sm or xs)
- Color: Primary accent color or text color with underline
- Hover: Text decoration underline
- Cursor: Pointer
- Padding: Small margin top
- Icon: Optional chevron/arrow

---

### 5.3 Multiple Comments - Expanded State

```
Outcome Comment by Grade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<first name> has done a great job
this year. They worked very hard
coming to tutorials as needed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[- Hide alternatives]

Other available options:

┌─────────────────────────────────────┐
│ <first name> shows strong academic   │
│ progress with consistent effort.     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ <first name> demonstrates excellent  │
│ engagement in class discussions.     │
└─────────────────────────────────────┘
```

**Alternative Items Styling:**
- Container: Light background (secondary background color)
- Border: Subtle border or just background color
- Border-radius: Match form field border radius
- Padding: Consistent with form fields (md spacing)
- Margin: md spacing between items
- Font: Match selected comment
- Color: Text primary
- Hover state: Slightly darker background, cursor pointer
- Transition: Smooth color change on hover
- Label: Optional "Other available options:" text above list

---

### 5.4 Loading State

When fetching outcome comments:
```
Outcome Comment by Grade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Loading comment...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Loading Indicator:**
- Show spinner or "Loading..." text
- Disable alternatives toggle if shown
- Replace comment content with loading state

---

### 5.5 Error State

If comment fetch fails:
```
Outcome Comment by Grade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Error loading outcome comment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Error Styling:**
- Text color: Error color (red)
- Message: User-friendly "Unable to load outcome comment"
- No toggle button shown
- Form remains submittable (user can proceed without comment)

---

## 6. Data Model & Grade Matching

### Critical Clarification Needed

**How is grade → outcome comment matching determined?**

Options:
1. **Exact match**: Grade must equal outcome comment's grade field
2. **Range match**: Grade falls within min/max range
3. **Letter grade**: Grade converted to letter (A, B, C) and matched
4. **Custom mapping**: Grade matched against lookup table

**Example (assuming exact numeric match):**
```typescript
function getOutcomeCommentsByGrade(grade: number, outcomeComments: OutcomeComment[]): OutcomeComment[] {
  return outcomeComments
    .filter(comment => comment.grade === grade)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt)) // Oldest first
}
```

---

## 7. Edge Cases & Handling

### Edge Case 1: Grade Changed to Non-Matching Value
```
User selects grade 91 → 3 matches available
User clicks "Show alternatives"
User changes grade to 85 → 0 matches for 85

Expected behavior:
- Clear all selected comments
- Show empty state or message
- Reset expanded state
- Show error: "No outcome comments available for grade 85"
```

### Edge Case 2: Outcome Comments List Updated
```
User has alternatives expanded showing 2 comments
System updates outcomeComments prop (e.g., new comment added)
Grade now has 3 matches

Expected behavior:
- Refresh matching comments list
- Keep currently selected comment if still available
- Update alternatives list
- Show new count in toggle button
```

### Edge Case 3: Selected Comment Deleted
```
User selected second alternative comment
Later, that comment is deleted from the system
New fetch returns only 1 comment

Expected behavior:
- Fall back to first matching comment
- Clear selection of now-missing comment
- Collapse alternatives list
```

### Edge Case 4: No Comments Available
```
Grade is entered but no outcome comments exist for that grade

Expected behavior:
- Show message: "No outcome comments available for grade 91"
- Keep grade selection (user might have typed wrong grade)
- Don't show toggle button
- Allow user to continue form
```

---

## 8. Interaction Details

### 8.1 Comment Selection Flow

```
User enters grade (91)
  ↓
System filters: 3 comments match grade 91
  ↓
Display 1st comment automatically + "Show 2 more options" button
  ↓
User clicks button → Expand alternatives
  ↓
Show comments 2 and 3 below
  ↓
User clicks comment 3
  ↓
Comment 3 becomes selected (moves to top)
Comments 1 and 2 become alternatives
List collapses automatically
  ↓
selectedOutcomeCommentId = comment3.id
```

### 8.2 Toggle Button Behavior

**Collapsed → Expanded:**
- Click "[+ Show X more option(s)]"
- Set `expandedAlternatives = true`
- Alternatives slide/fade in below
- Button text changes to "[- Hide alternatives]"

**Expanded → Collapsed:**
- Click "[- Hide alternatives]" OR
- Click any alternative comment
- Set `expandedAlternatives = false`
- Alternatives slide/fade out
- Button text changes back to "[+ Show X more option(s)]"

---

## 9. Acceptance Criteria

### Implementation Complete When:

- [ ] `OutcomeCommentSelector` component created and integrated
- [ ] Single matching comment displays without toggle
- [ ] Multiple matching comments show toggle button
- [ ] Toggle expands/collapses alternatives list
- [ ] Clicking alternative selects it and collapses list
- [ ] Grade change resets selection and collapses list
- [ ] No more than one comment can be selected at a time
- [ ] All alternatives show full comment text (no truncation)
- [ ] Hover states indicate clickability
- [ ] Loading state displays while fetching comments
- [ ] Error state displays gracefully
- [ ] Form remains functional with 0 matching comments
- [ ] Comments display placeholders (e.g., `<first name>`) as-is

---

## 10. Testing Checklist

### Unit Tests
- [ ] getOutcomeCommentsByGrade filters correctly
- [ ] Toggle state changes on button click
- [ ] Alternative selection updates selectedOutcomeCommentId
- [ ] Grade change resets selection
- [ ] Expanded state toggles correctly

### Integration Tests
- [ ] Grade input triggers comment fetch and display
- [ ] Multiple comments show toggle button
- [ ] Single comment hides toggle button
- [ ] Form submits with selected comment ID

### Manual Tests (Desktop/Tablet)
- [ ] Enter grade with single match → no toggle visible
- [ ] Enter grade with 2 matches → toggle shows correct count
- [ ] Click toggle → list expands smoothly
- [ ] Click alternative → smooth selection and collapse
- [ ] Change grade → reset to first match, collapsed
- [ ] Verify all comment text visible (no truncation)
- [ ] Test with very long comments (2 sentences)
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Test on tablet viewport (responsive behavior)

---

## 11. Future Enhancements

These are out of scope for v1 but worth noting:

- **Placeholder Preview**: Show `<first name>` replaced with actual name in preview
- **Comment Ratings**: Display emoji rating alongside each comment
- **Search/Filter**: Allow searching alternatives by keyword
- **Sorting Options**: Sort by date created, rating, or alphabetically
- **Favorite Comments**: Mark/star frequently used comments
- **Comment Metadata**: Show when comment was created, by whom
- **Drag to Reorder**: Let users reorder how alternatives appear

---

## 12. Dependencies & Assumptions

### Assumptions Made
1. Grade → comment matching is exact numeric match (needs confirmation)
2. Outcome comments are loaded into parent component
3. Multiple comments with same grade is intentional/valid
4. Comments don't need live updates while expanded
5. User can manually edit comment after selection (if needed)
6. No duplicate comments exist for same grade

### Dependencies
- `OutcomeComment` type definition
- Comment filtering/matching logic
- Form state management in FinalCommentsModal
- Existing design system tokens (colors, spacing, typography)
- Theme colors (background, text, border)

---

## 13. Implementation Notes

### Recommended Approach

1. **Create new component**: `OutcomeCommentSelector.tsx`
   - Keep it focused on selection UI
   - Don't handle grade input/validation
   - Accept matching comments as prop

2. **Update FinalCommentsModal**:
   - Add state for selected comment ID
   - Add effect to fetch matching comments on grade change
   - Replace static comment display with `<OutcomeCommentSelector />`

3. **Extract matching logic**:
   - Create utility function: `getOutcomeCommentsByGrade(grade, comments)`
   - Keep logic reusable
   - Add unit tests for this function

4. **Styling**:
   - Reuse existing form field styling (backgrounds, borders, spacing)
   - Use design tokens for consistency
   - Test on both light and dark theme

---

## 14. File Structure

```
src/
├── components/
│   └── finalComments/
│       ├── FinalCommentsModal.tsx (MODIFIED)
│       ├── OutcomeCommentSelector.tsx (NEW)
│       └── __tests__/
│           ├── FinalCommentsModal.test.tsx (UPDATED)
│           └── OutcomeCommentSelector.test.tsx (NEW)
│
├── utils/
│   ├── outcomeCommentMatching.ts (NEW)
│   └── __tests__/
│       └── outcomeCommentMatching.test.ts (NEW)
│
└── types/
    └── OutcomeComment.ts (EXISTING - confirm matches this spec)
```

---

## 15. Questions for Implementation Team

Before coding starts, please confirm:

1. **Grade Matching Logic**: How exactly are grades matched to outcome comments?
2. **Outcome Comments Data**: Where do they come from? API endpoint? Already loaded in parent?
3. **Form Submission**: Does the form include the selected `outcomeCommentId` when submitting?
4. **Edit Scenario**: Can users edit final comments? If so, should alternatives persist across edits?
5. **Sorting**: Should matching comments appear in any specific order (date, custom)?

---

**Document Status**: ✅ Ready for Development

**Next Step**: Developer confirms assumptions and begins implementation

---

*Generated: 2026-01-09*
*Feature: Multiple Outcome Comments Selection for Final Comments*
