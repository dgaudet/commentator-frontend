# Tech Note: Final Comment Pronoun Confirmation Alert

**Feature**: Confirm before saving final comment without pronoun selection
**Complexity**: L0 (Atomic)
**Status**: Planning
**Created**: 2026-01-22

## Problem Statement

When creating or editing a final comment, if a user attempts to save without selecting a pronoun (pronounId is null, empty, or undefined), the system silently accepts the submission. This can lead to incomplete data and missed opportunities for teachers to properly configure pronouns for student comments.

**Current Behavior**:
- Users can save final comments without selecting a pronoun
- No validation feedback provided
- Incomplete pronoun data saved to system

**Desired Behavior**:
- Display confirmation alert when user tries to save without pronoun
- Alert message: "You are saving this comment without a pronoun. Do you want to continue?"
- Yes/No button options
- If No: alert closes, modal stays open for editing
- If Yes: proceed with save as normal

## Business Objective

Prevent data inconsistencies and remind teachers to explicitly select pronouns for student comments, ensuring complete and intentional data entry. This improves data quality while respecting user choice - teachers can still proceed without pronouns if intentional.

## User Story

**US-1: Confirm Pronoun-Less Comment Save**

**As a** teacher managing final comments
**I want** to be prompted when saving a comment without a pronoun selection
**So that** I can ensure complete data entry and avoid accidental pronoun omissions

**Acceptance Criteria:**
- ✅ Alert displays when pronoun is null, empty, or undefined during save attempt (both create and edit)
- ✅ Alert message reads: "You are saving this comment without a pronoun. Do you want to continue?"
- ✅ Alert has Yes and No buttons
- ✅ Selecting "No" dismisses alert and keeps modal open
- ✅ Selecting "Yes" proceeds with save as normal
- ✅ Alert only displays on save attempt, not on field focus/blur
- ✅ Works in both FinalCommentsModal create form and edit form
- ✅ Independent of replace pronouns functionality
- ✅ No "don't show again" checkbox or user preferences

## Technical Implementation Notes

- **File**: `src/components/finalComments/FinalCommentsModal.tsx`
- **Location**: Add validation check in onCreateComment and onUpdateComment handlers before API call
- **Approach**:
  - Create a confirmation dialog/alert component or use existing dialog
  - Check if pronounId is null/empty/undefined before save
  - If empty, show confirmation alert
  - If user confirms (Yes), proceed with save
  - If user cancels (No), dismiss alert and keep modal open
- **No API changes** - purely frontend validation
- **Dialog state** - managed locally in FinalCommentsModal component
- **Scope**: Single component change in FinalCommentsModal
- **Impact**: Frontend-only, better data validation, improved UX

## Definition of Done

- [x] Feature implemented
- [x] Unit/component tests added
- [x] No regressions in existing tests
- [x] Linting passes
- [x] Code review passed
- [x] PR merged to main

## Success Metrics

| Metric | Target |
|--------|--------|
| Test Coverage | >80% |
| Regressions | 0 |
| Code Changes | <100 lines |
| User Stories | 1/1 ✅ |

## Next Steps

1. Frontend Engineer implements confirmation alert validation
2. QA Engineer validates alert appears correctly in create/edit scenarios
3. Product Owner accepts completed work
