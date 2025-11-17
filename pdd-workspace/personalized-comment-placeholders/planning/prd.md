# Product Requirements Document (PRD)
# Personalized Comments - Placeholder Support

**Feature Name**: Personalized Comments Placeholder Support
**Complexity Level**: L1-MICRO
**Estimated Duration**: 1-2 weeks
**Story Points**: 10
**PRD Version**: 1.1
**Date**: 2025-01-16
**Product Owner**: Principal Product Owner

---

## Executive Summary

Extend the PersonalizedComments feature with the same dynamic placeholder functionality currently available in OutcomeComments. This enables teachers to create reusable personalized comments with student-specific placeholders (`<first name>`, `<last name>`, `<grade>`) that get dynamically replaced when applied to final comments. Additionally, improve the UI by repositioning the rating selector below the comment textarea for better visual hierarchy.

**Business Value**: Increases teacher efficiency by enabling reusable personalized comment templates, reduces repetitive typing, and ensures consistency in comment personalization across students.

---

## Problem Statement

### Current Pain Points
1. **No Dynamic Placeholders**: Teachers must manually edit personalized comments for each student, even when the comment structure is identical
2. **Inconsistent Feature Parity**: OutcomeComments support placeholders, but PersonalizedComments do not, creating confusion
3. **Suboptimal UI Layout**: Rating selector appears before comment textarea, making the comment input less prominent
4. **Missing Validation**: No validation warnings for malformed placeholders in personalized comments

### User Impact
- Teachers waste time manually customizing each personalized comment
- Risk of typos when manually inserting student names/grades
- Feature discoverability issue - teachers may not know placeholders exist
- Visual flow disruption with rating selector positioned above comment input

---

## Goals and Objectives

### Primary Goals
1. Enable dynamic placeholder support (`<first name>`, `<last name>`, `<grade>`) in PersonalizedComments
2. Display placeholder tips and examples matching OutcomeComments UI pattern
3. Implement real-time validation for malformed placeholders
4. Reposition rating selector below comment textarea for improved visual hierarchy

### Success Metrics
- **Adoption Rate**: 50%+ of personalized comments use placeholders within 1 month
- **Time Savings**: 30% reduction in time spent creating personalized comments
- **Error Reduction**: 80% decrease in typos in student names/grades in personalized comments
- **User Satisfaction**: 85%+ positive feedback on placeholder usability

### Non-Goals (Out of Scope)
- Additional placeholder types beyond existing three (first name, last name, grade)
- Placeholder support for OutcomeComments (already implemented)
- Custom placeholder creation by teachers
- Placeholder preview during comment creation (may be future enhancement)

---

## User Stories

### Epic: Placeholder Support in PersonalizedComments
**Epic Goal**: Enable teachers to use dynamic placeholders in personalized comments, matching the functionality available in OutcomeComments

---

#### US-PLACEHOLDER-PC-001: Display Placeholder Tips in Add Form
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: Simple UI enhancement

**User Story**:
As a **teacher**, I want to **see available placeholders and usage examples when creating a personalized comment** so that **I know what dynamic content I can use**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** viewing the "Add New Comment" section in PersonalizedCommentsModal, **THE SYSTEM SHALL** display a placeholder tips box above the comment textarea
2. **WHEN** the tips box is rendered, **THE SYSTEM SHALL** show the heading "💡 Tip: Use Dynamic Placeholders"
3. **WHEN** the tips box is rendered, **THE SYSTEM SHALL** display all three placeholders as inline code elements:
   - `<first name>`
   - `<last name>`
   - `<grade>`
4. **WHEN** the tips box is rendered, **THE SYSTEM SHALL** show an example transformation: `"<first name> earned <grade> points" → "Alice earned 95 points"`
5. **WHEN** the tips box is styled, **THE SYSTEM SHALL** match the OutcomeComments tips box styling exactly (same colors, spacing, typography)
6. **WHEN** the tips box is rendered, **THE SYSTEM SHALL** use semantic HTML with appropriate ARIA attributes for accessibility

**UI Mockup**:
```
┌─────────────────────────────────────────────────┐
│ Add New Personalized Comment                    │
├─────────────────────────────────────────────────┤
│ 💡 Tip: Use Dynamic Placeholders                │
│ Add placeholders to personalize comments:       │
│ <first name> <last name> <grade>                │
│ Example: "<first name> earned <grade> points"   │
│          → "Alice earned 95 points"             │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ Enter personalized comment...               │ │
│ │                                             │ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│ Characters: 0 / 500                             │
└─────────────────────────────────────────────────┘
```

**Design Specification**:
- Tips box background: `colors.primary[50]`
- Tips box border: `1px solid colors.primary[200]`
- Tips box padding: `spacing.md`
- Tips box border-radius: `borders.radius.md`
- Tips box margin-bottom: `spacing.md`
- Heading color: `colors.primary[700]`
- Heading font-weight: `typography.fontWeight.semibold`
- Code elements background: `colors.background.secondary`
- Code elements padding: `2px 4px`

**Risk**: LOW - Straightforward UI component replication

---

#### US-PLACEHOLDER-PC-002: Display Placeholder Tips in Edit Form
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 1
**Complexity**: Simple UI consistency

**User Story**:
As a **teacher**, I want to **see placeholder tips when editing an existing personalized comment** so that **I can add or modify placeholders in existing comments**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** editing an existing personalized comment, **THE SYSTEM SHALL** display the same placeholder tips box as the add form
2. **WHEN** the tips box is rendered in edit mode, **THE SYSTEM SHALL** use identical styling and content to the add form tips box
3. **WHEN** the tips box is displayed, **THE SYSTEM SHALL** position it above the comment textarea (consistent with add form)
4. **WHEN** the user switches from add mode to edit mode, **THE SYSTEM SHALL** maintain placeholder tips visibility

**Risk**: LOW - Reuses component from US-PLACEHOLDER-PC-001

---

#### US-PLACEHOLDER-PC-003: Validate Placeholders on Input
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: Integration with existing validation utility

**User Story**:
As a **teacher**, I want to **receive real-time validation warnings for malformed placeholders** so that **I catch typos before saving the comment**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** typing in the comment textarea (add or edit form), **THE SYSTEM SHALL** validate placeholders on every keystroke using `validatePlaceholders()` utility
2. **WHEN** an unclosed placeholder is detected (e.g., `<first name`), **THE SYSTEM SHALL** display warning: "⚠️ Placeholder not closed. Example: <first name>"
3. **WHEN** an empty placeholder is detected (e.g., `<>`), **THE SYSTEM SHALL** display warning: "⚠️ Empty placeholder detected. Use: <first name>, <last name>, <grade>"
4. **WHEN** multiple validation errors exist, **THE SYSTEM SHALL** display all warnings in a stacked list
5. **WHEN** validation warnings are present, **THE SYSTEM SHALL** display them in a yellow warning box below the textarea with ARIA `role="alert"` and `aria-live="polite"`
6. **WHEN** the user corrects all placeholder errors, **THE SYSTEM SHALL** automatically hide the warning box
7. **WHEN** validation warnings are displayed, **THE SYSTEM SHALL** NOT prevent form submission (warnings only, not errors)

**UI Mockup (with validation warnings)**:
```
┌─────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ │
│ │ <first name earned <grade points            │ │ ← Unclosed placeholder
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│ Characters: 35 / 500                            │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ ⚠️ Warnings:                                 │ │ ← Yellow background
│ │ • Placeholder not closed. Example:          │ │
│ │   <first name>                              │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Design Specification**:
- Warning box background: `colors.semantic.warningLight`
- Warning box border: `1px solid colors.semantic.warning`
- Warning box padding: `spacing.sm`
- Warning box margin-top: `spacing.sm`
- Warning text color: `colors.semantic.warningDark`
- Warning font-size: `typography.fontSize.sm`

**Technical Implementation**:
```typescript
// Add state for warnings
const [newCommentWarnings, setNewCommentWarnings] = useState<string[]>([])
const [editCommentWarnings, setEditCommentWarnings] = useState<string[]>([])

// Validate on change (add form)
const handleNewCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value
  setNewCommentContent(value)
  setNewCommentWarnings(validatePlaceholders(value))
}

// Validate on change (edit form)
const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value
  setEditContent(value)
  setEditCommentWarnings(validatePlaceholders(value))
}
```

**Risk**: LOW - Reuses existing `validatePlaceholders()` utility from OutcomeComments

---

#### US-PLACEHOLDER-PC-004: Move Rating Selector Below Comment Textarea
**Priority**: MEDIUM (Post-MVP - Should Have)
**Story Points**: 2
**Complexity**: UI reorganization + styling adjustments

**User Story**:
As a **teacher**, I want the **rating selector positioned below the comment textarea** so that **the comment input is more prominent and the workflow feels more natural**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** viewing the "Add New Comment" form, **THE SYSTEM SHALL** display the comment textarea first, followed by the rating selector
2. **WHEN** viewing the "Edit Comment" form, **THE SYSTEM SHALL** display the comment textarea first, followed by the rating selector
3. **WHEN** the rating selector is repositioned, **THE SYSTEM SHALL** maintain all existing functionality (emoji selection, tooltip, ARIA attributes)
4. **WHEN** the rating selector is displayed, **THE SYSTEM SHALL** show the label "Rating" above the emoji buttons
5. **WHEN** the form is rendered, **THE SYSTEM SHALL** maintain proper spacing between comment textarea and rating selector (`spacing.md`)
6. **WHEN** the form is submitted, **THE SYSTEM SHALL** include both comment text and rating value (no behavior change)

**UI Mockup (Before → After)**:
```
BEFORE:
┌─────────────────────────────────────────┐
│ Rating: 😢 😟 😐 🙂 😊                  │ ← Rating first
│ ┌─────────────────────────────────────┐ │
│ │ Comment textarea...                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

AFTER:
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ Comment textarea...                 │ │ ← Comment first
│ └─────────────────────────────────────┘ │
│ Rating: 😢 😟 😐 🙂 😊                  │
└─────────────────────────────────────────┘
```

**Rationale**:
- **Visual Hierarchy**: Comment content is primary, rating is secondary metadata
- **Workflow Alignment**: Teachers typically write comment first, then assign rating
- **Consistency**: Matches common form patterns (main content → metadata)

**Technical Implementation**:
- Reorder JSX elements in PersonalizedCommentsModal:
  1. Placeholder tips box
  2. Comment textarea + character counter + validation warnings
  3. Rating selector

**Risk**: LOW - Simple DOM reordering, no logic changes

---

#### US-PLACEHOLDER-PC-006: Replace Placeholders When Populating Final Comments
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: Integration with existing populate flow

**User Story**:
As a **teacher**, I want **placeholders in personalized comments to be automatically replaced with student data when I click "Populate with Above Comments"** so that **the final comment contains personalized, student-specific text**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** clicking "Populate with Above Comments" in FinalCommentsModal, **THE SYSTEM SHALL** collect student data from the form (firstName, lastName, grade)
2. **WHEN** building the final comment text, **THE SYSTEM SHALL** call `replacePlaceholders(comment, studentData)` for each selected personalized comment
3. **WHEN** a personalized comment contains `<first name>`, **THE SYSTEM SHALL** replace it with the student's firstName from the form
4. **WHEN** a personalized comment contains `<last name>`, **THE SYSTEM SHALL** replace it with the student's lastName from the form
5. **WHEN** a personalized comment contains `<grade>`, **THE SYSTEM SHALL** replace it with the student's grade from the form
6. **WHEN** multiple personalized comments are selected, **THE SYSTEM SHALL** replace placeholders in each comment individually before concatenation
7. **WHEN** student data is missing (e.g., no lastName entered), **THE SYSTEM SHALL** leave the placeholder text unchanged (e.g., `<last name>` remains as-is)
8. **WHEN** both outcome comments and personalized comments contain placeholders, **THE SYSTEM SHALL** replace placeholders in both types of comments
9. **WHEN** the final comment text exceeds 1000 characters after replacement, **THE SYSTEM SHALL** truncate to 1000 characters

**Workflow Example**:
```
1. Teacher enters student data:
   - First Name: "Alice"
   - Last Name: "Smith"
   - Grade: 95

2. Teacher selects personalized comment: "<first name> earned <grade> points this semester"

3. Teacher clicks "Populate with Above Comments"

4. System replaces placeholders:
   - "<first name>" → "Alice"
   - "<grade>" → "95"
   - Result: "Alice earned 95 points this semester"

5. Final comment textarea populated with: "Alice earned 95 points this semester"
```

**Technical Implementation**:
```typescript
// In handlePopulateConfirm function (FinalCommentsModal.tsx)

// Prepare student data for placeholder replacement
const studentData: StudentData = {
  firstName: form.firstName || undefined,
  lastName: form.lastName || undefined,
  grade: form.grade !== '' ? Number(form.grade) : undefined,
}

// Replace placeholders in personalized comments (lines 426-432)
orderedComments.forEach((comment) => {
  const trimmedPersonal = comment.comment.trim()
  if (trimmedPersonal) {
    const withPlaceholdersReplaced = replacePlaceholders(trimmedPersonal, studentData)
    parts.push(withPlaceholdersReplaced)
  }
})
```

**Current Status**:
- ✅ Code structure already exists in FinalCommentsModal.tsx (lines 426-432)
- ✅ `replacePlaceholders()` utility already implemented and tested
- 🔄 Need to verify placeholder replacement works when PersonalizedComments now contain placeholders
- 🔄 Need integration tests for combined OutcomeComment + PersonalizedComment placeholder replacement

**Risk**: LOW - Code structure already exists, needs verification and testing

---

#### US-PLACEHOLDER-PC-005: Test Placeholder Functionality End-to-End
**Priority**: HIGH (MVP - Quality Gate)
**Story Points**: 1
**Complexity**: Testing coverage

**User Story**:
As a **developer**, I want **comprehensive test coverage for placeholder functionality** so that **the feature is reliable and maintainable**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** running unit tests, **THE SYSTEM SHALL** verify placeholder tips render correctly in add and edit forms
2. **WHEN** running unit tests, **THE SYSTEM SHALL** verify validation warnings appear for malformed placeholders
3. **WHEN** running unit tests, **THE SYSTEM SHALL** verify validation warnings disappear when placeholders are corrected
4. **WHEN** running unit tests, **THE SYSTEM SHALL** verify rating selector appears below textarea
5. **WHEN** running integration tests, **THE SYSTEM SHALL** verify full workflow: create personalized comment with placeholders → apply to final comment → verify replacement occurs (US-PLACEHOLDER-PC-006)
6. **WHEN** running integration tests, **THE SYSTEM SHALL** verify both OutcomeComment and PersonalizedComment placeholders are replaced when populating final comments
7. **WHEN** running accessibility tests, **THE SYSTEM SHALL** verify ARIA attributes, keyboard navigation, and screen reader support
8. **WHEN** running tests, **THE SYSTEM SHALL** achieve ≥90% code coverage for new components and logic

**Test Scenarios**:
1. **Unit Tests**:
   - Placeholder tips render with correct content and styling
   - Validation detects unclosed placeholders (`<first name`)
   - Validation detects empty placeholders (`<>`)
   - Validation warnings update on input change
   - Rating selector renders below textarea
   - All ARIA attributes present and correct

2. **Integration Tests**:
   - Create personalized comment: `"<first name> shows great effort"`
   - Apply to final comment with student data: `{ firstName: "Alice" }`
   - Verify final comment: `"Alice shows great effort"`
   - Verify rating persists correctly

3. **Accessibility Tests**:
   - Placeholder tips readable by screen readers
   - Validation warnings announced via ARIA live regions
   - Keyboard navigation works for all form elements
   - Focus management correct when switching add/edit modes

**Risk**: LOW - Extends existing test patterns

---

## User Experience (UX) Design

### Information Architecture

**PersonalizedCommentsModal - Add Form (Updated)**:
```
[Header: Manage Personalized Comments for {Subject}]
├── Add New Comment Form
│   ├── Placeholder Tips Box (NEW)
│   │   ├── Heading: "💡 Tip: Use Dynamic Placeholders"
│   │   ├── Available Placeholders: <first name> <last name> <grade>
│   │   └── Example: "<first name> earned <grade> points" → "Alice earned 95 points"
│   ├── Comment Textarea
│   ├── Character Counter (0 / 500)
│   ├── Validation Warnings Box (NEW - conditional)
│   ├── Rating Selector (MOVED - previously above textarea)
│   │   └── Emoji buttons: 😢 😟 😐 🙂 😊
│   ├── Score Range Inputs (upperRange, lowerRange)
│   └── [Add Comment] Button
└── Existing Comments List (sorted by rating)
```

**PersonalizedCommentsModal - Edit Form (Updated)**:
```
[Edit Mode]
├── Placeholder Tips Box (NEW)
├── Comment Textarea (pre-populated)
├── Character Counter
├── Validation Warnings Box (NEW - conditional)
├── Rating Selector (MOVED)
├── Score Range Inputs (pre-populated)
└── [Save] [Cancel] Buttons
```

### Visual Design Specifications

**Placeholder Tips Box**:
| Property | Value |
|----------|-------|
| Background | `colors.primary[50]` (#EFF6FF) |
| Border | `1px solid colors.primary[200]` |
| Padding | `spacing.md` (12px) |
| Border Radius | `borders.radius.md` (8px) |
| Margin Bottom | `spacing.md` (12px) |
| Heading Color | `colors.primary[700]` |
| Heading Font Weight | `typography.fontWeight.semibold` |

**Validation Warning Box**:
| Property | Value |
|----------|-------|
| Background | `colors.semantic.warningLight` (#FEF3C7) |
| Border | `1px solid colors.semantic.warning` (#F59E0B) |
| Padding | `spacing.sm` (8px) |
| Border Radius | `borders.radius.md` (8px) |
| Margin Top | `spacing.sm` (8px) |
| Text Color | `colors.semantic.warningDark` (#92400E) |
| Font Size | `typography.fontSize.sm` (14px) |

**Component Spacing**:
- Placeholder tips → Textarea: `spacing.md` (12px)
- Textarea → Character counter: `spacing.xs` (4px)
- Character counter → Validation warnings: `spacing.sm` (8px)
- Validation warnings → Rating selector: `spacing.md` (12px)
- Rating selector → Score inputs: `spacing.md` (12px)

---

## Technical Specifications

### Dependencies

**Existing Utilities (Reuse)**:
- `src/utils/placeholders.ts`:
  - `validatePlaceholders(text: string): string[]`
  - `replacePlaceholders(text: string, studentData: StudentData): string`
  - `StudentData` interface

**Existing Components (Reference)**:
- `src/components/outcomeComments/OutcomeCommentsModal.tsx` - Placeholder tips UI pattern
- `src/components/common/EmojiRatingSelector.tsx` - Rating selector (no changes needed)

### Component Architecture

**Modified Component**:
1. **PersonalizedCommentsModal** (`src/components/personalizedComments/PersonalizedCommentsModal.tsx`)
   - Add placeholder tips box (add + edit forms)
   - Add validation warnings display
   - Reorder JSX: tips → textarea → warnings → rating → score inputs
   - Add state: `newCommentWarnings`, `editCommentWarnings`
   - Update textarea `onChange` handlers to validate placeholders

**New Component** (optional, for reusability):
2. **PlaceholderTipsBox** (`src/components/common/PlaceholderTipsBox.tsx`)
   - Reusable placeholder tips component
   - Props: none (static content)
   - Returns: styled tips box JSX
   - Benefits: DRY principle, reusable across add/edit forms

### State Management

**PersonalizedCommentsModal State Updates**:
```typescript
// Add validation warnings state
const [newCommentWarnings, setNewCommentWarnings] = useState<string[]>([])
const [editCommentWarnings, setEditCommentWarnings] = useState<string[]>([])

// Update onChange handlers
const handleNewCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value
  setNewCommentContent(value)
  setNewCommentWarnings(validatePlaceholders(value)) // NEW
}

const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value
  setEditContent(value)
  setEditCommentWarnings(validatePlaceholders(value)) // NEW
}
```

### Data Flow

**Placeholder Workflow**:
```
1. Teacher types in PersonalizedComments textarea: "<first name> earned <grade> points"
2. Real-time validation: validatePlaceholders(text) → warnings array
3. Display warnings if any malformed placeholders detected
4. Teacher saves personalized comment (with placeholders) to backend
5. Teacher applies personalized comment to FinalComment
6. replacePlaceholders(comment, studentData) → "Alice earned 95 points"
7. Populated text inserted into final comment textarea
```

**No Backend Changes Required**:
- Placeholder replacement happens client-side only
- PersonalizedComments already stored as text (placeholders preserved)
- Replacement occurs when comment is applied to FinalComment

---

## Testing Strategy

### Unit Tests

**PersonalizedCommentsModal Component Tests**:
- Renders placeholder tips box in add form
- Renders placeholder tips box in edit form
- Placeholder tips box has correct content (heading, placeholders, example)
- Placeholder tips box has correct styling
- Validation warnings appear for unclosed placeholder
- Validation warnings appear for empty placeholder
- Validation warnings disappear when corrected
- Rating selector appears below textarea (DOM order)
- Character counter updates correctly
- All ARIA attributes present

**PlaceholderTipsBox Component Tests** (if created):
- Renders with correct content
- Renders with correct styling
- Accessible via screen reader

### Integration Tests

**End-to-End Workflow**:
1. Navigate to PersonalizedCommentsModal
2. Verify placeholder tips visible
3. Enter comment with placeholders: `"<first name> earned <grade> points"`
4. Select rating: 5 (😊)
5. Enter score range: 90-100
6. Click "Add Comment"
7. Navigate to FinalCommentsModal
8. Apply personalized comment to student: `{ firstName: "Alice", grade: 95 }`
9. Verify final comment contains: `"Alice earned 95 points"`

**Validation Workflow**:
1. Enter malformed placeholder: `"<first name earned <grade> points"`
2. Verify warning appears: "⚠️ Placeholder not closed..."
3. Correct placeholder: `"<first name> earned <grade> points"`
4. Verify warning disappears
5. Save comment successfully

### Accessibility Tests

**WCAG 2.1 AA Compliance**:
- Placeholder tips box readable by screen readers
- Validation warnings have `role="alert"` and `aria-live="polite"`
- All interactive elements keyboard navigable (Tab, Enter, Space)
- Focus order logical: tips → textarea → rating → score inputs → button
- Color contrast ratios meet AA standards (warning yellow, placeholder blue)

---

## Risks and Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **UI layout disruption** | LOW | MEDIUM | Follow existing OutcomeComments pattern exactly; visual QA before release |
| **Validation performance** | LOW | LOW | `validatePlaceholders()` is lightweight regex; runs on debounced input |
| **Placeholder confusion** | MEDIUM | MEDIUM | Clear tips box with examples; match OutcomeComments behavior exactly |
| **Rating selector repositioning breaks tests** | LOW | LOW | Update test selectors; verify DOM order in unit tests |
| **Backend assumes no placeholders** | VERY LOW | HIGH | Placeholders stored as-is in DB; replacement client-side only |

---

## Dependencies

### External Dependencies
- **None** - Feature uses existing placeholder utilities and design system

### Internal Dependencies
- `src/utils/placeholders.ts` (existing)
- `src/components/common/EmojiRatingSelector.tsx` (existing)
- Design token system (colors, spacing, typography, borders)
- React 18.3.1, TypeScript (strict mode)

---

## Rollout Plan

### Phase 1: Core Placeholder Support (Week 1)
- **US-PLACEHOLDER-PC-001**: Display placeholder tips in add form
- **US-PLACEHOLDER-PC-002**: Display placeholder tips in edit form
- **US-PLACEHOLDER-PC-003**: Validate placeholders on input
- **US-PLACEHOLDER-PC-005**: Test coverage

**Deliverable**: Teachers can use placeholders in personalized comments with validation

---

### Phase 2: UI Refinement (Week 1-2)
- **US-PLACEHOLDER-PC-004**: Move rating selector below textarea
- Visual QA and polish
- Accessibility audit

**Deliverable**: Complete feature with improved UI layout

---

## Success Criteria

### Functional Success
- ✅ Teachers can use `<first name>`, `<last name>`, `<grade>` in personalized comments
- ✅ Placeholder tips visible in add and edit forms
- ✅ Validation warnings display for malformed placeholders
- ✅ Rating selector positioned below comment textarea
- ✅ Placeholders dynamically replaced when applied to final comments

### Quality Success
- ✅ All acceptance criteria met for each user story
- ✅ ≥90% test coverage for new code
- ✅ Zero accessibility violations (WCAG 2.1 AA)
- ✅ Linting passes with no warnings
- ✅ Visual consistency with OutcomeComments placeholder UI

### Business Success
- ✅ 50%+ adoption of placeholders within 1 month
- ✅ 30% time savings in creating personalized comments
- ✅ 80% reduction in name/grade typos
- ✅ 85%+ positive user feedback

---

## Open Questions

1. **Should we add a "placeholder preview" feature?**
   - Show real-time preview of placeholder replacement with sample data
   - **Recommendation**: Post-MVP enhancement (not L1 scope)

2. **Should we add placeholder autocomplete in textarea?**
   - Type `<` to trigger dropdown with placeholder options
   - **Recommendation**: Future enhancement (L2 scope)

3. **Should we support custom placeholder formats?**
   - e.g., `<First Name>` vs `<first name>` (case variations)
   - **Recommendation**: No - keep case-insensitive matching, but document standard format

4. **Should we add placeholder usage analytics?**
   - Track which placeholders are most commonly used
   - **Recommendation**: Post-MVP - useful for future enhancements

---

## Appendix

### User Story Summary

| ID | Title | Priority | Points | Risk |
|----|-------|----------|--------|------|
| US-PLACEHOLDER-PC-001 | Display placeholder tips (add) | HIGH | 2 | LOW |
| US-PLACEHOLDER-PC-002 | Display placeholder tips (edit) | HIGH | 1 | LOW |
| US-PLACEHOLDER-PC-003 | Validate placeholders on input | HIGH | 2 | LOW |
| US-PLACEHOLDER-PC-004 | Move rating below textarea | MEDIUM | 2 | LOW |
| US-PLACEHOLDER-PC-006 | Replace placeholders in final comments | HIGH | 2 | LOW |
| US-PLACEHOLDER-PC-005 | Test coverage | HIGH | 1 | LOW |
| **TOTAL** | | | **10** | |

---

## Approval & Sign-Off

**Product Owner**: _____________________ Date: _____
**Tech Lead**: _____________________ Date: _____
**UX Designer**: _____________________ Date: _____

---

**Document Status**: FINAL - Ready for Development
**Next Steps**: Review PRD → Frontend Engineer Implementation → QA Testing → Release
