# User Stories: Duplicate Comment Prevention

**Feature:** Duplicate Comment Prevention
**Format:** EARS (Event, Anticipated System Response)
**Status:** For Development

---

## Overview

This document contains detailed user stories for the duplicate comment prevention feature. Each story follows the EARS format with clear acceptance criteria testable by QA and developers.

---

## US-DCP-001: Prevent Duplicate Outcome Comments

### Story

**WHEN** a teacher attempts to save an outcome comment
**AND** that exact comment already exists for the selected subject
**THEN THE SYSTEM SHALL** display a modal notification showing the existing comment
**AND** prevent the save until the user chooses an action (Cancel, View Existing, or Save Anyway)

### Detailed Requirements

**Preconditions:**
- User is in OutcomeCommentsModal
- At least one outcome comment exists for the selected subject
- User has entered comment text in the input field

**Main Flow:**
1. User enters outcome comment text (e.g., "Demonstrates strong grasp of algebra concepts")
2. User clicks "Save Comment" button
3. System compares new comment text (trimmed) to existing comments for subject
4. Exact match found
5. Modal displays with:
   - Title: "Duplicate Comment Detected"
   - Message: "This outcome comment already exists for [Subject Name]"
   - Existing comment text displayed in read-only container
   - Three action buttons: "Cancel", "View Existing", "Save Anyway"
6. User chooses action:
   - If "Cancel": Modal closes, user returns to editing field with text preserved
   - If "View Existing": Navigate to existing comment (optional: allow edit/delete)
   - If "Save Anyway": Proceed with save, modal closes, new comment created

**Alternate Flows:**

**Alternative A: No Duplicate Found**
- When user clicks Save and no exact match exists
- Comment saves normally
- Success message displays

**Alternative B: Empty/Whitespace-Only Comment**
- When user clicks Save with blank or whitespace-only text
- Show error message: "Please enter a comment"
- Do not show duplicate modal
- Return focus to input field

**Alternative C: User Cancels During Save**
- User clicks "Cancel" on duplicate modal
- Modal closes
- Comment text remains in input field
- User can edit and retry

### Acceptance Criteria

**AC-1.1: Exact Match Detection**
- [ ] System performs case-sensitive, exact-match comparison
- [ ] "Demonstrates grasp" ≠ "demonstrates grasp" (different case = no match)
- [ ] "Demonstrates grasp of algebra" ≠ "Demonstrates grasp of geometry" (different text = no match)

**AC-1.2: Whitespace Handling**
- [ ] Leading/trailing whitespace is trimmed before comparison
- [ ] "  Demonstrates grasp  " matches "Demonstrates grasp"
- [ ] Internal whitespace is preserved ("Two  spaces" ≠ "Two spaces")

**AC-1.3: Subject-Specific Comparison**
- [ ] Comparison only checks comments for selected subject
- [ ] Same comment in different subjects does NOT trigger duplicate warning
- [ ] Duplicates in other subjects are not reported

**AC-1.4: Modal Display**
- [ ] Modal has accessible title and close button
- [ ] Existing comment text is clearly displayed
- [ ] Modal is keyboard navigable
- [ ] Modal meets WCAG 2.1 AA accessibility standards

**AC-1.5: User Actions**
- [ ] "Cancel" closes modal, preserves input text
- [ ] "View Existing" navigates to existing comment (implementation detail: optional)
- [ ] "Save Anyway" saves new comment despite duplicate
- [ ] All buttons are clearly labeled and actionable

**AC-1.6: Error Handling**
- [ ] If comparison fails, show generic error (log to console)
- [ ] Continue allowing save with "Save Anyway"
- [ ] No duplicate modal shown if error occurs

**AC-1.7: Load Existing Comments**
- [ ] Existing comments must be loaded/available before modal can work
- [ ] If no comments loaded, skip duplicate check
- [ ] Log warning if attempt to check duplicates without comments

### Testing Strategy (TDD)

**RED Phase - Failing Tests:**
```typescript
// Test 1: Exact match detected
test('should show duplicate modal when exact comment exists', () => {
  // ...
})

// Test 2: Case-sensitive comparison
test('should NOT match comments with different case', () => {
  // ...
})

// Test 3: Whitespace trimming
test('should match after trimming whitespace', () => {
  // ...
})

// Test 4: Modal buttons work
test('should close modal and save when "Save Anyway" clicked', () => {
  // ...
})
```

**GREEN Phase:**
- Implement duplicate detection logic
- Create DuplicateCommentModal component
- Wire up button handlers

**REFACTOR Phase:**
- Extract comparison logic to utility
- Improve modal accessibility
- Add comprehensive error handling

### Story Points: 8

### Priority: High

### Dependencies
- OutcomeCommentsModal must load existing comments
- DuplicateCommentModal component (can be shared)

---

## US-DCP-002: Prevent Duplicate Personalized Comments

### Story

**WHEN** a teacher attempts to save a personalized comment
**AND** that exact comment already exists for the same subject
**THEN THE SYSTEM SHALL** display a modal notification showing the existing comment
**AND** provide options to cancel, view existing, or save anyway

### Detailed Requirements

**Preconditions:**
- User is in PersonalizedCommentsModal
- At least one personalized comment exists for the same subject
- User has entered comment text

**Main Flow:**
1. User enters personalized comment (e.g., "Shows excellent participation in class discussions")
2. User clicks "Save Comment" button
3. System compares new comment (trimmed) to existing personalized comments for subject
4. Exact match found in existing comments
5. Modal displays with:
   - Title: "Duplicate Comment Detected"
   - Message: "This personalized comment already exists for [Subject Name]"
   - Existing comment text
   - Three buttons: "Cancel", "View Existing", "Save Anyway"
6. User chooses:
   - "Cancel": Return to editing, preserve text
   - "View Existing": Navigate to/view existing comment
   - "Save Anyway": Create duplicate, save new comment

**Alternate Flows:**
- Same as US-DCP-001 (No duplicate, Empty comment, User cancels)

### Acceptance Criteria

**AC-2.1: Exact Match Detection**
- [ ] Case-sensitive, exact-match comparison for personalized comments
- [ ] "Shows excellent participation" ≠ "shows excellent participation"
- [ ] Different text = no duplicate warning

**AC-2.2: Whitespace Handling**
- [ ] Trim leading/trailing whitespace before comparison
- [ ] Internal spacing preserved
- [ ] Works with multi-line comments (preserve newlines)

**AC-2.3: Subject-Specific Comparison**
- [ ] Only checks comments for same subject
- [ ] Same comment for different subjects is not flagged as duplicate
- [ ] Multiple comments per subject all checked

**AC-2.4: Modal Display**
- [ ] Shows existing comment text clearly
- [ ] Accessible title and controls
- [ ] Proper keyboard navigation
- [ ] WCAG 2.1 AA compliant

**AC-2.5: User Actions**
- [ ] "Cancel" closes, preserves input
- [ ] "View Existing" allows viewing/editing existing comment
- [ ] "Save Anyway" creates new comment

**AC-2.6: Error Handling**
- [ ] Graceful error if comparison fails
- [ ] Allow save with "Save Anyway" if error occurs
- [ ] Log errors appropriately

**AC-2.7: Comment List Availability**
- [ ] Existing comments must be loaded before checking
- [ ] Skip check if comments not available
- [ ] Handle case where comment list is empty

### Testing Strategy

**RED Phase:**
```typescript
test('should show duplicate modal for exact personalized comment match', () => {
  // ...
})

test('should only compare comments for same subject', () => {
  // ...
})

test('should handle multi-line comments correctly', () => {
  // ...
})
```

**GREEN Phase:**
- Implement comparison logic
- Reuse DuplicateCommentModal from US-DCP-001
- Wire up button handlers

**REFACTOR Phase:**
- Ensure consistency with outcome comment implementation
- Optimize comparison performance if needed

### Story Points: 5

### Priority: High

### Dependencies
- DuplicateCommentModal component (from US-DCP-001)
- PersonalizedCommentsModal existing comments must be available

---

## US-DCP-003: Whitespace & Empty Comment Validation

### Story

**WHEN** a user attempts to save a comment with only whitespace
**THEN THE SYSTEM SHALL** show an error message and prevent save
**AND WHEN** comparing for duplicates, the system shall trim leading/trailing whitespace

### Detailed Requirements

**Precondition:**
- User is attempting to save a comment (outcome or personalized)

**Main Flow - Empty Comment:**
1. User clicks Save with empty or whitespace-only input
2. System shows error: "Please enter a comment"
3. Save is blocked
4. User returns to editing with text preserved

**Main Flow - Whitespace Trimming:**
1. User enters comment with leading/trailing spaces: "  My comment  "
2. System trims to "My comment" for duplicate comparison
3. Comparison checks against existing comments
4. Save proceeds with trimmed text

### Acceptance Criteria

**AC-3.1: Empty Comment Validation**
- [ ] Reject comments that are completely empty (length === 0)
- [ ] Show error message: "Please enter a comment"
- [ ] Return focus to input field
- [ ] Do not attempt duplicate check for empty comments

**AC-3.2: Whitespace-Only Validation**
- [ ] Reject comments with only whitespace (spaces, tabs, newlines)
- [ ] "   " (three spaces) is rejected
- [ ] "\n\t\n" (newlines/tabs) is rejected
- [ ] Show error message consistently

**AC-3.3: Whitespace Trimming**
- [ ] Leading whitespace removed: "  text" → "text"
- [ ] Trailing whitespace removed: "text  " → "text"
- [ ] Both removed: "  text  " → "text"
- [ ] Trimming happens BEFORE duplicate comparison

**AC-3.4: Internal Whitespace Preserved**
- [ ] Multiple internal spaces preserved: "My  comment" → "My  comment"
- [ ] Tabs preserved: "My\tcomment" → "My\tcomment"
- [ ] Newlines preserved for multi-line: "Line1\nLine2" → "Line1\nLine2"

**AC-3.5: Error Message**
- [ ] Clear, user-friendly message
- [ ] Guides user to enter comment
- [ ] No technical jargon

### Testing Strategy

**RED Phase:**
```typescript
test('should reject empty comments', () => {
  // ...
})

test('should reject whitespace-only comments', () => {
  // ...
})

test('should trim whitespace before comparison', () => {
  // ...
})

test('should preserve internal whitespace', () => {
  // ...
})
```

**GREEN Phase:**
- Add validation before duplicate check
- Trim text during comparison

**REFACTOR Phase:**
- Extract to validation utility
- Reuse across modals

### Story Points: 3

### Priority: Medium

### Dependencies
- No external dependencies
- Should be done before US-DCP-001 and US-DCP-002 for clean foundation

---

## US-DCP-004: Reusable DuplicateCommentModal Component

### Story

**WHEN** duplicate comments are detected in either modal
**THEN THE SYSTEM SHALL** display a reusable modal component
**SO THAT** duplicate detection logic is consistent across outcome and personalized comments

### Detailed Requirements

**Component Props:**
```typescript
interface DuplicateCommentModalProps {
  isOpen: boolean
  existingComment: string
  newComment: string
  onCancel: () => void
  onViewExisting: () => void
  onSaveAnyway: () => void
  commentType: 'outcome' | 'personalized'
  subjectName: string
}
```

**Component Responsibilities:**
1. Display modal with duplicate warning
2. Show existing comment text
3. Handle three user actions (Cancel, View Existing, Save Anyway)
4. Manage accessibility (ARIA labels, keyboard nav)
5. Adapt message based on comment type

### Acceptance Criteria

**AC-4.1: Component Structure**
- [ ] Accepts props for existing and new comments
- [ ] Renders with proper semantic HTML
- [ ] Modal is accessible (role="dialog", aria-modal="true")

**AC-4.2: Display Content**
- [ ] Shows title: "Duplicate Comment Detected"
- [ ] Shows message with subject name
- [ ] Displays existing comment in read-only container
- [ ] Labels indicate this is the existing comment

**AC-4.3: Button Handlers**
- [ ] "Cancel" button calls onCancel prop
- [ ] "View Existing" button calls onViewExisting prop
- [ ] "Save Anyway" button calls onSaveAnyway prop
- [ ] All buttons properly labeled

**AC-4.4: Accessibility**
- [ ] Keyboard navigable (Tab through buttons, Enter to activate)
- [ ] Screen reader friendly (ARIA labels, descriptions)
- [ ] Proper focus management
- [ ] WCAG 2.1 AA compliant

**AC-4.5: Theming**
- [ ] Works with light and dark themes
- [ ] Uses design tokens for colors/spacing
- [ ] Responsive design (mobile, tablet, desktop)

**AC-4.6: Reusability**
- [ ] Works for both outcome and personalized comments
- [ ] Message adapts based on comment type
- [ ] No hardcoded modal text (all configurable)
- [ ] Can be used by future features

### Testing Strategy

**RED Phase:**
```typescript
test('should render modal with existing comment', () => {
  // ...
})

test('should call onCancel when Cancel clicked', () => {
  // ...
})

test('should be keyboard accessible', () => {
  // ...
})
```

**GREEN Phase:**
- Create DuplicateCommentModal component
- Implement button handlers
- Add accessibility features

**REFACTOR Phase:**
- Improve styling consistency
- Optimize re-renders
- Add animations if needed

### Story Points: 5

### Priority: High

### Dependencies
- Design system (tokens, Button component, Modal patterns)
- Should be done early to support US-DCP-001 and US-DCP-002

---

## Integration Tests

### Cross-Feature Scenarios

**Scenario 1: Create Duplicate Outcome, Then Personalized**
1. Create outcome comment "Strong math skills"
2. Try to create same outcome comment → blocked
3. Create personalized comment "Strong math skills" → allowed (different type)
4. Try to create same personalized comment → blocked

**Scenario 2: Same Comment, Different Subjects**
1. Create outcome comment "Good effort" for Math
2. Create outcome comment "Good effort" for English → allowed (different subject)
3. Try to create same "Good effort" for Math → blocked

**Scenario 3: Whitespace Edge Case**
1. Create outcome comment "Good work  " (with trailing spaces)
2. Try to create outcome comment "Good work" → blocked (match after trim)
3. Try to create outcome comment "  Good work  " → blocked

**Scenario 4: User Override**
1. Try to create duplicate → modal appears
2. Click "Save Anyway" → comment saves
3. Now two identical comments exist (allowed if intentional)

---

## Acceptance Criteria Mapping

| Story | AC | Related Test | Status |
|-------|----|--------------| -------|
| US-DCP-001 | 1.1-1.7 | OutcomeCommentsModal.duplicate-detection.test.tsx | Pending |
| US-DCP-002 | 2.1-2.7 | PersonalizedCommentsModal.duplicate-detection.test.tsx | Pending |
| US-DCP-003 | 3.1-3.5 | Validation utility tests | Pending |
| US-DCP-004 | 4.1-4.6 | DuplicateCommentModal.test.tsx | Pending |

---

## Definition of Done

All stories must meet these criteria before being marked complete:

- [ ] All acceptance criteria are met
- [ ] Test coverage >90% (measured by code coverage)
- [ ] Code review approved
- [ ] Manual QA sign-off
- [ ] Accessibility validation (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Performance impact < 5% (compared to baseline)

---

**Document Status:** Ready for Development
**Last Updated:** 2026-01-31
**Next Phase:** Development (TDD - write tests first)
