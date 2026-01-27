# Minimal PRD: Improve Final Comments Error Handling & UX

**Feature**: Better Error Messages and Non-Destructive Error UI in FinalCommentsModal
**Complexity**: L1 (Micro)
**Status**: Planning
**Created**: 2026-01-23

---

## Problem Statement

Current error handling in the FinalCommentsModal component has two critical UX issues:

### Issue 1: Unfriendly Error Messages
- Backend returns structured error responses: `{ error: "...", details: "..." }`
- Frontend doesn't surface these messages to the user
- Users see generic errors with no context about what went wrong
- Example: Backend returns "Duplicate entry - This student already has a final comment in this class" but user sees nothing helpful

### Issue 2: Data Loss on Error
- When a save error occurs, the entire modal is replaced/destroyed
- All user edits are lost
- User must:
  1. Switch tabs or dismiss modal
  2. Navigate back to the class
  3. Re-enter all their comments from scratch
- This is extremely frustrating for users editing large comment blocks

**Current Behavior**:
```
User saves final comment
    ↓
Backend returns error
    ↓
ENTIRE MODAL REPLACED ❌
    ↓
User data lost ❌
    ↓
User must restart ❌
```

**Desired Behavior**:
```
User saves final comment
    ↓
Backend returns error
    ↓
ERROR MESSAGE DISPLAYED NEAR SAVE BUTTON ✅
    ↓
MODAL CONTENT PRESERVED ✅
    ↓
User can fix and retry ✅
```

---

## Business Objective

Improve teacher experience by:
1. **Clarity**: Show what went wrong and why (with backend error details)
2. **Data Safety**: Prevent data loss when errors occur
3. **Efficiency**: Let users fix errors without restarting
4. **Professionalism**: Friendly, helpful error messages

**Impact**: Reduces support tickets, improves user satisfaction, enables users to recover from errors independently.

---

## User Stories

### US-1: Display Backend Error Messages to User

**As a** teacher saving a final comment
**I want** to see the error message and details from the backend
**So that** I understand what went wrong and how to fix it

**Acceptance Criteria**:
- When backend returns `{ error: "...", details: "..." }`, display both fields to user
- Error message appears in a clear, prominent location
- Error message includes both the error type and detailed explanation
- Example: Show "Duplicate entry: This student already has a final comment in this class"
- Multiple error messages can be displayed if backend returns multiple errors
- Error appears within 1 second of failed save attempt
- Error messages are easy to read (good color contrast, clear typography)

**Examples**:
1. Duplicate entry scenario:
   - Backend: `{ error: "Duplicate entry", details: "This student already has a final comment in this class" }`
   - User sees: "Duplicate entry: This student already has a final comment in this class"

2. Validation error scenario:
   - Backend: `{ error: "Validation failed", details: "Comment must be between 10 and 5000 characters" }`
   - User sees: "Validation failed: Comment must be between 10 and 5000 characters"

3. Permission error scenario:
   - Backend: `{ error: "Unauthorized", details: "You don't have permission to edit comments for this class" }`
   - User sees: "Unauthorized: You don't have permission to edit comments for this class"

---

### US-2: Preserve Modal Content When Error Occurs

**As a** teacher whose comment save failed
**I want** my edited content to remain in the modal
**So that** I don't lose my work and can fix the error without restarting

**Acceptance Criteria**:
- All textarea/input content is preserved after save error
- Form state is preserved (all fields retain their values)
- User can immediately attempt to fix the issue and retry
- Modal does not close or reset on save error
- User does not need to switch tabs or navigate away
- Error state is temporary and clears when user attempts another save
- All previously saved data in other fields is intact

**Examples**:
1. Duplicate entry with recoverable scenario:
   - User edits a final comment that already exists
   - Save fails with "Duplicate entry" message
   - User sees error near save button
   - User can click "Edit" to go back and modify the existing comment
   - All their new edits are still visible in the form

2. Validation error scenario:
   - User pastes a very long comment (exceeds limit)
   - Save fails with character count message
   - User sees error and their comment text is still there
   - User can trim the text and retry without re-typing

---

### US-3: Display Error Near Save Action

**As a** teacher saving a comment
**I want** to see error messages close to the save button
**So that** I understand which action failed and can retry immediately

**Acceptance Criteria**:
- Error message displays near the "Save" button (above or below)
- Error message doesn't obscure the main comment content
- Error message is positioned consistently
- User can easily see both the error and the save button
- Error message has appropriate visual styling (alert/error colors)
- Error message can be dismissed/cleared by user
- Error message clears automatically when user starts typing again
- Multiple save attempts show updated error information

**Visual Requirements**:
- Error appears in alert/error container near action buttons
- Uses error color from design system (typically red/warning)
- Clear icon (warning/error icon) to draw attention
- Close button or auto-dismissal after user action
- Accessible color contrast and screen reader support

---

## Implementation Context

**Scope**: FinalCommentsModal component
**Location**: Error handling in save/update flow
**Applies to**: Both create (first-time save) and edit (update existing) modes
**Affects**: Final comment save functionality only

**No API Changes Required**: Backend already returns proper error format
**No Database Changes Required**: Error handling is UI-only
**Frontend Only**: No backend work needed

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Error messages displayed | 100% when backend error occurs |
| Data preservation | 100% of form state preserved on error |
| User satisfaction | Reduce support tickets related to save errors |
| Clarity | Error message + details always surfaced |
| Modal stability | Modal never replaced/destroyed on error |

---

## Technical Notes

### Current Implementation Issues
- Error handling likely dismisses/replaces modal on any error
- Backend error details are not extracted from response
- Error state is not properly managed
- No persistent error UI near save button

### Required Changes
1. **Error Response Handling**:
   - Parse `{ error, details }` from backend response
   - Don't dismiss/replace modal on error

2. **Error State Management**:
   - Store error message in component state
   - Preserve all other form state

3. **Error UI Component**:
   - Create error alert/message container
   - Display near save button
   - Include error + details
   - Add dismiss/clear functionality

4. **Error Clearing Logic**:
   - Clear error when user retries save
   - Clear error when user starts editing again
   - Auto-clear after successful save

---

## Acceptance Criteria Checklist

✅ Backend error messages surfaced to user
✅ Details field included in display
✅ Error appears near save button
✅ Modal content preserved on error
✅ Form state not reset on error
✅ User can retry without losing work
✅ Multiple errors handled (if applicable)
✅ Error clears appropriately
✅ Accessible error messaging
✅ Works in both create and edit modes

---

## Next Steps

1. Frontend Engineer reviews requirements and clarifies questions
2. Frontend Engineer implements error handling improvements with TDD
3. QA Engineer validates error scenarios and UX
4. Product Owner accepts when all criteria met

---

## Related Issues

This fix addresses:
- Data loss on save errors (critical UX issue)
- Opaque error messages (support burden)
- User frustration with modal replacement
- Requirement to restart work after error

---

*Minimal PRD - L1 Complexity (Micro)*
*High Priority: User-facing UX issue affecting work efficiency*
