# User Stories - Multiple Outcome Comments Selection

**Feature**: Multiple Outcome Comments Selection
**Total Stories**: 5
**Total Story Points**: 8
**Sprint Target**: 1 sprint (1-2 weeks)
**Created**: 2026-01-09

---

## Story: US-FINAL-001 - Single Outcome Comment Display (Baseline)

**Status**: READY FOR DEVELOPMENT
**Story Points**: 2
**Priority**: CRITICAL (Must Have)
**Epic**: Multiple Outcome Comments Selection

### EARS Format
```
WHEN a user enters a grade with only one matching Outcome Comment
THEN the system SHALL display that comment in the read-only "Outcome Comment by Grade" section
AND no toggle button SHALL be shown
AND the user SHALL see the comment cannot be modified from this interface
```

### Business Value
Establishes baseline behavior. Users entering grades that match a single comment see that comment displayed automatically without any UI clutter. This is the happy path for ~80% of entries.

### Acceptance Criteria

#### AC-1.1: Single Comment Display
- [ ] When grade input has exactly ONE matching OutcomeComment
- [ ] That comment displays automatically in the "Outcome Comment by Grade" read-only section
- [ ] Comment text is fully visible with no truncation

#### AC-1.2: No Toggle Button Shown
- [ ] When single comment is displayed, NO "[+ Show X more options]" button appears
- [ ] No UI elements suggest additional options exist
- [ ] Form layout remains clean and uncluttered

#### AC-1.3: Read-Only Display
- [ ] Comment is clearly in read-only state (gray text, no edit affordances)
- [ ] Section title reads exactly "Outcome Comment by Grade"
- [ ] User understands comment is auto-selected, not manually editable from this interface

#### AC-1.4: Styling Consistency
- [ ] Uses existing read-only text box styling
- [ ] Font matches other form fields (via design tokens)
- [ ] Color matches text secondary (via design tokens)
- [ ] Padding matches standard form field spacing

### Test Cases
- TC-1.1: Grade 85 matches 1 comment → Display comment, no button
- TC-1.2: Comment displays correctly when existing comment replaced
- TC-1.3: Grade change from 1-match to 1-match updates comment
- TC-1.4: Very long comment (2 sentences max) displays without truncation

### Dependencies
- OutcomeComments must be filtered by grade correctly
- Design system tokens must be available
- Grade input component working correctly

### Implementation Notes
- This story establishes the baseline component behavior
- Skeleton for OutcomeCommentSelector component
- React hooks: useState, useEffect for grade changes

### Estimation Rationale
**2 Points**: Baseline implementation, simple state management, existing styling patterns

---

## Story: US-FINAL-002 - Multiple Outcomes - Collapsed State

**Status**: READY FOR DEVELOPMENT
**Story Points**: 2
**Priority**: CRITICAL (Must Have)
**Epic**: Multiple Outcome Comments Selection

### EARS Format
```
WHEN a user enters a grade with 2+ matching Outcome Comments
THEN the system SHALL display the first matching comment
AND show a "[+ Show X more options]" toggle button with correct count
AND the comment SHALL remain read-only
```

### Business Value
When multiple comments match a grade, users see the first one with a clear button indicating alternatives exist. The count in the button helps users understand the scope of choices available.

### Acceptance Criteria

#### AC-2.1: First Comment Displays
- [ ] When grade matches 2+ OutcomeComments
- [ ] The first matching comment displays automatically (sorted by createdAt, oldest first)
- [ ] Comment is read-only (same styling as US-FINAL-001)

#### AC-2.2: Toggle Button Appears
- [ ] Toggle button displays below the first comment
- [ ] Button text reads: "[+ Show X more option(s)]" where X is the count
- [ ] Correct pluralization: "1 more option" vs "2 more options"
- [ ] Example: "2 comments available" → "[+ Show 2 more options]"

#### AC-2.3: Button Styling
- [ ] Button styled as text link (not prominent CTA)
- [ ] Color: primary accent or underlined text
- [ ] Font size: smaller than body text (sm or xs)
- [ ] Hover state: underline or color change
- [ ] Cursor changes to pointer on hover
- [ ] Keyboard accessible (Tab stops, Enter/Space activates)

#### AC-2.4: Comment Count Display
- [ ] Count reflects actual number of alternatives (not including current)
- [ ] Count updates dynamically if comments list changes
- [ ] Example: 3 total comments → "[+ Show 2 more options]"

#### AC-2.5: Alternatives Hidden
- [ ] All alternatives remain hidden until button clicked
- [ ] No preview or hint of other comments shown
- [ ] Read-only display area contains ONLY the first comment

### Test Cases
- TC-2.1: Grade 91 matches 3 comments → Show 1st, "[+ Show 2 more options]" button
- TC-2.2: Grade 85 matches 2 comments → "[+ Show 1 more option]" (singular)
- TC-2.3: Button visible and clickable with mouse and keyboard
- TC-2.4: Button count updates when comments list changes
- TC-2.5: Comment updates correctly when grade changes to different 1-match grade

### Dependencies
- OutcomeComment data with createdAt field for sorting
- Button component from design system
- AC-2.1 from US-FINAL-001

### Implementation Notes
- Filtering/sorting logic: existing comments by grade, sorted oldest first
- State: `expandedAlternatives` boolean, `matchingOutcomeComments` array
- useEffect hook to reset state when grade changes

### Estimation Rationale
**2 Points**: Simple filtering, toggle button styling, state management

---

## Story: US-FINAL-003 - Multiple Outcomes - Expanded State

**Status**: READY FOR DEVELOPMENT
**Story Points**: 2
**Priority**: CRITICAL (Must Have)
**Epic**: Multiple Outcome Comments Selection

### EARS Format
```
WHEN a user clicks the "[+ Show X more options]" button
THEN the list of alternative comments SHALL expand below
AND the toggle button text SHALL change to "[- Hide alternatives]"
AND all alternatives SHALL be displayed as clickable items
AND each alternative SHALL show the full comment text
```

### Business Value
Expanding the list reveals all alternatives in a clean, readable format. Users can browse options and understand what feedback variants are available for the current grade.

### Acceptance Criteria

#### AC-3.1: Expansion Animation
- [ ] Click "[+ Show X more options]" button → list expands smoothly
- [ ] Optional animation (fade-in or slide-down acceptable)
- [ ] Expansion completes in <300ms
- [ ] "Expand" state persists until user interacts

#### AC-3.2: Button Text Changes
- [ ] After expansion, button text changes to "[- Hide alternatives]"
- [ ] Button styling remains consistent (still text link, not CTA)
- [ ] Click button again → collapses and returns to "[+ Show X more options]"

#### AC-3.3: Alternatives List Display
- [ ] Alternatives appear as separate items below the button
- [ ] Each item displays full comment text (no truncation)
- [ ] Items have clear visual separation (padding, borders, or background)
- [ ] Layout: vertical stack, one comment per item

#### AC-3.4: Alternative Item Styling
- [ ] Container: light background (secondary background color, via tokens)
- [ ] Border: subtle border or just background color
- [ ] Border-radius: matches form field border radius
- [ ] Padding: consistent with form fields (md spacing)
- [ ] Margin: md spacing between items
- [ ] Font: matches selected comment (color, size, weight)
- [ ] Color: text primary

#### AC-3.5: Hover & Click Affordances
- [ ] Hover state: slightly darker background + cursor pointer
- [ ] Clear visual feedback that item is clickable
- [ ] Focus state visible for keyboard navigation
- [ ] Transition: smooth color change on hover

#### AC-3.6: Form Layout
- [ ] Section expands without pushing content below out of view
- [ ] Page remains scrollable if needed
- [ ] No overlapping or layout shifts
- [ ] Mobile/tablet responsive (if 1 comment visible, alternatives stack cleanly)

#### AC-3.7: Scrollable Content
- [ ] If alternatives exceed reasonable height, section becomes scrollable
- [ ] Scroll stays within the alternatives container (not page scroll)
- [ ] Maximum height TBD based on viewport analysis

### Test Cases
- TC-3.1: Click "[+ Show 2 more options]" → list expands with animation
- TC-3.2: Two alternatives display, each fully visible
- TC-3.3: Button text changes to "[- Hide alternatives]"
- TC-3.4: Hover alternative → background changes, cursor changes
- TC-3.5: Page layout stable, no content shifts
- TC-3.6: Click "[- Hide alternatives]" → list collapses smoothly
- TC-3.7: Keyboard navigation (Tab, Enter) works

### Dependencies
- AC-2.2 from US-FINAL-002 (toggle button exists)
- Design tokens for colors, spacing, borders
- Smooth animation library or CSS transitions

### Implementation Notes
- State: `expandedAlternatives` boolean
- Conditional rendering of alternatives based on state
- Event handler: toggle state on button click
- CSS animations or transitions for smooth expand/collapse

### Estimation Rationale
**2 Points**: UI component rendering, state toggle, styling, animations

---

## Story: US-FINAL-004 - Select Alternative Comment

**Status**: READY FOR DEVELOPMENT
**Story Points**: 1
**Priority**: CRITICAL (Must Have)
**Epic**: Multiple Outcome Comments Selection

### EARS Format
```
WHEN a user clicks on an alternative Outcome Comment
THEN that comment SHALL become the selected comment
AND it SHALL replace the currently displayed comment
AND the alternatives list SHALL automatically collapse
AND the toggle button SHALL return to "[+ Show X more options]"
```

### Business Value
Selecting an alternative is the key interaction. Users click a comment to make it their choice, and the UI provides immediate feedback by collapsing the list and showing their selection as the new displayed comment.

### Acceptance Criteria

#### AC-4.1: Click Handler
- [ ] Each alternative item is clickable (mouse + keyboard)
- [ ] Click triggers selection of that comment
- [ ] No action if already-selected comment is clicked (idempotent)

#### AC-4.2: Comment Replacement
- [ ] Clicked alternative becomes the displayed comment
- [ ] Old comment is no longer shown in primary display area
- [ ] New comment shows in same read-only display area
- [ ] Styling matches original (read-only, via tokens)

#### AC-4.3: Previously Displayed Comment
- [ ] Previously displayed comment moves to alternatives list
- [ ] Now appears as a selectable option (not highlighted)
- [ ] Same styling as other alternatives

#### AC-4.4: Auto-Collapse
- [ ] After selection, alternatives list auto-collapses smoothly
- [ ] Same animation speed as manual collapse (<300ms)
- [ ] Button text returns to "[+ Show X more options]"

#### AC-4.5: Selection Persistence
- [ ] Selected comment ID stored in form state
- [ ] selectedOutcomeCommentId = {clicked comment's id}
- [ ] Selection persists when user navigates away
- [ ] Selection persists when scrolling or other form changes

#### AC-4.6: Visual Feedback
- [ ] Clear indication during selection (button press feedback)
- [ ] No ambiguity about which comment is currently selected
- [ ] Accessibility: announced to screen readers

### Test Cases
- TC-4.1: 3 alternatives visible → click 2nd → becomes displayed
- TC-4.2: List collapses after selection
- TC-4.3: Button text updates to "[+ Show 2 more options]"
- TC-4.4: Original displayed comment now in alternatives
- TC-4.5: Form state updated with selected comment ID
- TC-4.6: Click same alternative twice → no double-selection bug
- TC-4.7: Keyboard: Tab to alternative, Enter to select

### Dependencies
- AC-3.1 from US-FINAL-003 (expanded list exists)
- Form state management working
- Comment ID/data structure correct

### Implementation Notes
- Event handler: onClick for each alternative item
- Handler updates: `selectedOutcomeCommentId` and collapses list
- Trigger re-render of displayed comment and alternatives list
- ARIA attributes for accessibility

### Estimation Rationale
**1 Point**: Simple click handler, state update, already have UI components

---

## Story: US-FINAL-005 - Dynamic Grade Changes

**Status**: READY FOR DEVELOPMENT
**Story Points**: 1
**Priority**: CRITICAL (Must Have)
**Epic**: Multiple Outcome Comments Selection

### EARS Format
```
WHEN a user changes the grade after selecting alternatives
THEN the system SHALL fetch new matching comments for the new grade
AND the display SHALL reset to show the first match (collapsed)
AND any previous alternative selections SHALL be cleared
```

### Business Value
When teachers change a grade, they get a fresh set of comments for the new grade. This prevents confusion where old comments carry over to a different grade. The reset is automatic and invisible to the user.

### Acceptance Criteria

#### AC-5.1: Grade Change Detection
- [ ] System detects when grade value changes (grade input blur or change event)
- [ ] Works for any grade update (e.g., 85 → 91, 92 → 92)
- [ ] Change triggers new matching comments fetch

#### AC-5.2: Fetch New Matching Comments
- [ ] On grade change, filter OutcomeComments for new grade
- [ ] Sort by createdAt (oldest first)
- [ ] Store in `matchingOutcomeComments` state
- [ ] Happens synchronously (no loading state needed - data already loaded)

#### AC-5.3: Reset to First Match
- [ ] After new comments fetched, display first match
- [ ] No alternatives shown initially (collapsed state)
- [ ] Toggle button displays correct count for new grade

#### AC-5.4: Clear Previous Selection
- [ ] `selectedOutcomeCommentId` cleared/reset
- [ ] `expandedAlternatives` set to false
- [ ] All previous UI state cleared
- [ ] User sees fresh alternatives for new grade (not old ones)

#### AC-5.5: No Carry-Over
- [ ] If user manually selected 2nd alternative for grade 91
- [ ] Then changes grade to 85
- [ ] The 2nd alternative from 91 is NOT shown for grade 85
- [ ] User always gets grade-appropriate comments

#### AC-5.6: Edge Case - No Matches
- [ ] If new grade has 0 matching comments
- [ ] Display message: "No outcome comments available for grade {grade}"
- [ ] No toggle button shown
- [ ] Form remains functional (user can continue)
- [ ] User can change grade again to get comments

#### AC-5.7: Edge Case - Only 1 Match
- [ ] If new grade matches exactly 1 comment
- [ ] Display that comment
- [ ] No toggle button (same as US-FINAL-001)
- [ ] Works seamlessly

### Test Cases
- TC-5.1: Grade 91 (3 matches) → Select 2nd → Change to 85 (2 matches) → Show 1st of 85's matches
- TC-5.2: Grade 95 (0 matches) → Show error message
- TC-5.3: Grade 82 (1 match) → No toggle button
- TC-5.4: Grade 92 (same grade, same matches) → No change in display
- TC-5.5: Expanded list showing alternatives → Change grade → list collapses
- TC-5.6: Change grade multiple times → always shows correct matches

### Dependencies
- Grade input component working correctly
- OutcomeComments data loaded in parent
- AC-5.1 from US-FINAL-001, AC-5.2 from US-FINAL-002, AC-5.3 from US-FINAL-003

### Implementation Notes
- useEffect hook: dependency array includes `[grade, outcomeComments]`
- useEffect logic:
  1. Filter outcomeComments for current grade
  2. Sort by createdAt
  3. Update matchingOutcomeComments state
  4. Reset selectedOutcomeCommentId to null
  5. Reset expandedAlternatives to false
  6. Auto-select first match if exists
- Handle case where matchingOutcomeComments is empty

### Estimation Rationale
**1 Point**: useEffect hook, state resets, simple logic (filtering/sorting already exist)

---

## User Story Summary Table

| Story | Title | Points | Priority | Status |
|-------|-------|--------|----------|--------|
| US-FINAL-001 | Single Outcome Comment Display (Baseline) | 2 | CRITICAL | READY |
| US-FINAL-002 | Multiple Outcomes - Collapsed State | 2 | CRITICAL | READY |
| US-FINAL-003 | Multiple Outcomes - Expanded State | 2 | CRITICAL | READY |
| US-FINAL-004 | Select Alternative Comment | 1 | CRITICAL | READY |
| US-FINAL-005 | Dynamic Grade Changes | 1 | CRITICAL | READY |
| **TOTAL** | | **8** | | |

---

## Definition of Done (Per Story)

Each story is considered complete when:

1. **Acceptance Criteria Met**
   - [ ] All ACs from the story pass
   - [ ] No AC modifications without approval

2. **Test Coverage**
   - [ ] Unit tests written first (TDD Red-Green-Refactor)
   - [ ] All test cases from AC executed
   - [ ] Edge cases identified and tested
   - [ ] >80% code coverage on component

3. **Code Quality**
   - [ ] ESLint passes without errors/warnings
   - [ ] Code follows project conventions (CLAUDE.md)
   - [ ] Design system tokens used (no hardcoded values)
   - [ ] Accessibility verified (keyboard nav, screen reader)

4. **Integration**
   - [ ] Component integrated into FinalCommentsModal
   - [ ] Props correctly passed through hierarchy
   - [ ] Form state integration working
   - [ ] No regressions in existing functionality

5. **Documentation**
   - [ ] Component props documented
   - [ ] Edge cases documented
   - [ ] README updated if needed

6. **Performance & Accessibility**
   - [ ] No performance regressions
   - [ ] WCAG 2.1 AA compliance verified
   - [ ] Keyboard navigation tested
   - [ ] Screen reader tested

---

## Sprint Planning Notes

### Recommended Order
1. **US-FINAL-001** (2 pt) - Baseline component
2. **US-FINAL-002** (2 pt) - Add toggle button + filtering
3. **US-FINAL-003** (2 pt) - Add expand/collapse UI
4. **US-FINAL-004** (1 pt) - Add selection handler
5. **US-FINAL-005** (1 pt) - Add grade change reset

### Dependencies
- Sequential implementation recommended (each story builds on previous)
- No parallel development needed (too small)
- Single Frontend Engineer can complete entire feature

### Risk Mitigation
- US-FINAL-001 written first reduces risk of everything else
- TDD approach catches edge cases early
- Grade change logic (US-FINAL-005) has good test coverage

---

**Document Owner**: Principal Product Owner
**Status**: ✅ Ready for Development
**Last Updated**: 2026-01-09

---
