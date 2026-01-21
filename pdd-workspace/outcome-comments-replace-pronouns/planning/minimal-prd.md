# Minimal PRD: Replace Pronouns with Placeholders in Outcome Comments

**Feature:** Add "Replace Pronouns with Placeholders" button to Outcome Comments Modal
**Complexity:** L1 (Micro)
**Effort:** 1-2 weeks
**Status:** Planning

## Problem Statement

Teachers creating outcome comments manually enter student pronouns (he, she, they, etc.) in their comments. This creates inconsistency because:
- Comments with hard-coded pronouns aren't personalizable
- Different teachers use different pronoun formats
- When pronouns should be replaced with placeholders for flexibility, teachers must manually edit each comment

The personalized comments bulk upload already has a "Replace Pronouns with Placeholders" feature that teachers find valuable. This same capability should be available when creating or editing individual outcome comments.

## Business Objective

Provide consistency and flexibility in outcome comments by allowing teachers to easily convert hard-coded pronouns to placeholders that can be dynamically replaced per student.

## User Stories

### Story 1: Replace Pronouns Button in Outcome Comments Modal
**As a** teacher creating/editing outcome comments
**I want to** click a "Replace Pronouns with Placeholders" button
**So that** I can quickly convert hard-coded pronouns to placeholders without manual editing

**Acceptance Criteria:**
- Button appears in outcome comments modal (when creating or editing)
- Button is disabled if no pronouns are configured
- Button shows loading state while processing
- Button uses secondary style (consistent with bulk upload)
- Works on both add and edit forms

### Story 2: Reusable Replace Pronouns Component/Hook
**As a** developer maintaining multiple pronoun replacement features
**I want to** extract the button and messaging logic into a reusable component
**So that** code is DRY and consistent across personalized and outcome comments

**Acceptance Criteria:**
- Study PersonalizedCommentsModal as architectural reference (similar structure to OutcomeCommentsModal)
- Extract replace pronouns button UI logic into reusable component or hook
- Reusable implementation can be used in BulkUploadModal, PersonalizedCommentsModal, and OutcomeCommentsModal
- Styling and messaging behavior identical across all uses
- Reduce code duplication by 50%+

### Story 3: Functional Replace Pronouns for Outcome Comments
**As a** teacher editing outcome comments
**I want to** have my text automatically updated with pronoun placeholders
**So that** I don't have to manually replace pronouns

**Acceptance Criteria:**
- Click button to replace pronouns in outcome comment textarea
- Success message shows number of replacements (e.g., "Replaced 2 pronouns")
- Info message if no pronouns found
- Error message if replacement fails
- Button text updates to "Replacing..." during processing
- Textarea content updates immediately on success

### Story 4: Comprehensive Test Coverage
**As a** QA engineer validating feature quality
**I want to** have full test coverage for the new pronoun replacement in outcome comments
**So that** we can ensure feature works correctly and prevent regressions

**Acceptance Criteria:**
- Unit tests for replace pronouns functionality in outcome comments
- Integration tests validating button interaction and text updates
- Tests for both add and edit modes
- Edge case handling (empty text, no pronouns, multiple pronouns)
- No regressions in existing outcome comments tests

## Scope

### In Scope
- Add "Replace Pronouns with Placeholders" button to OutcomeCommentsModal
- Reuse existing `replacePronounsWithPlaceholders` utility function
- Extract button UI logic into reusable component/hook for code reuse
- Test coverage for new functionality
- Styling using design tokens (match existing implementation)

### Out of Scope
- Changes to Pronoun API or backend
- Changes to other modals or components
- UI redesign of outcome comments modal
- Additional pronoun replacement strategies (fuzzy matching, etc.)

## Success Metrics

- Button appears and is functional in outcome comments
- 100% test coverage for new code
- Zero regressions in existing outcome comments functionality
- Code reuse: ≥50% reduction in replace-pronouns related duplication
- Users can replace pronouns with same experience as bulk upload

## Technical Notes

**Code Reuse Opportunity:**
- `replacePronounsWithPlaceholders()` utility already exists (src/utils/pronouns.ts)
- Study PersonalizedCommentsModal architecture (similar modal structure to OutcomeCommentsModal) as implementation guide
- Replace pronouns UI logic in BulkUploadModal and PersonalizedCommentsModal can be extracted
- Recommend creating:
  1. Reusable `ReplacePronounsButton` component, OR
  2. Custom hook like `useReplacePronounsFunctionality()`
  3. Shared message styling component or style utility

**Integration Points:**
- OutcomeCommentsModal needs access to pronouns list (may need prop pass-through)
- Follow PersonalizedCommentsModal pattern for modal state and text area management
- Uses existing `replacePronounsWithPlaceholders()` utility
- Styling consistent with Button component and design tokens
- Error/success messaging pattern consistent across all modals

## Dependencies

- Existing `replacePronounsWithPlaceholders()` utility (src/utils/pronouns.ts)
- Existing pronoun fetching/loading mechanism (if needed)
- Design tokens (already in use)
- Button component (already in use)

## Release Notes

> **Feature:** Outcome Comments now support quick pronoun replacement. Teachers can click "Replace Pronouns with Placeholders" when creating or editing outcome comments to automatically convert hard-coded pronouns (he, she, they) to placeholders. This provides the same flexibility and consistency available in bulk comment uploads.

## Future Enhancements

- Extract replace pronouns UI into reusable package/library for use in other components
- Preview mode showing which pronouns would be replaced
- Configurable replacement rules
