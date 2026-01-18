# Product Requirements Document: Replace Pronouns with Placeholders Utility

**Feature**: Pronouns-to-Placeholders Transformation
**Version**: 1.0
**Status**: Planning Complete
**Complexity**: L1 (Micro)
**Last Updated**: 2026-01-15

---

## 1. Business Context

### Problem Statement
Teachers write personalized and final comments that often include actual pronoun references (he, she, they, his, her, their, etc.). Standardizing these comments across different students requires manually replacing pronouns with placeholder text (`<pronoun>` and `<possessive pronoun>`), which is error-prone and time-consuming.

### Opportunity
Provide a one-click button that automatically converts actual pronouns in comment text to standardized placeholders, enabling teachers to quickly standardize comments for reuse across multiple students with different pronouns.

### Business Value
- **Efficiency**: Reduces manual work to standardize comments for reuse
- **Accuracy**: Eliminates pronoun replacement errors
- **Reusability**: Makes comment templates more universally applicable
- **User Experience**: Single-click transformation with visual feedback

---

## 2. Feature Overview

### High-Level Description
Add a "Replace Pronouns with Placeholders" button to personalized and final comment input areas. When clicked, the button will:

1. Fetch the user's pronouns from the existing pronoun endpoint
2. Search the comment text for all pronoun variations loaded for the user
3. Replace found pronouns with standardized placeholders (`<pronoun>` for subject pronouns, `<possessive pronoun>` for possessive pronouns)
4. Display the updated text to the user for review

### Key Capabilities
- ✅ Loads pronouns from existing API endpoint (`/api/pronoun`)
- ✅ Case-insensitive pronoun matching
- ✅ Handles multiple pronoun sets per user
- ✅ Reusable utility function for use across the application
- ✅ Visual confirmation of replacements made
- ✅ Graceful handling when no pronouns are found in text

### Scope & Boundaries

**Included**:
- Reusable pronoun-to-placeholder utility function
- Button in personalized comments bulk upload modal
- Button in personalized comments add/edit component
- Loading and error states
- Unit tests for utility function

**NOT Included**:
- Final comments form (no modifications to final comments components)
- Undo/history functionality
- Batch processing across multiple comments
- Custom placeholder text (uses standard `<pronoun>` and `<possessive pronoun>`)

---

## 3. User Stories

### US-1: Reusable Pronoun-to-Placeholder Utility (TECH STORY)
**As a** developer
**When** building features that need pronoun-to-placeholder conversion
**Then** I can import a reusable utility function instead of reimplementing the logic

**Acceptance Criteria**:
- [ ] Utility function `replacePronounsWithPlaceholders` is exported from `src/utils/pronouns.ts`
- [ ] Function accepts comment text and array of Pronoun objects
- [ ] Function returns text with pronouns replaced by placeholders
- [ ] Case-insensitive matching for pronoun and possessivePronoun values
- [ ] Multiple occurrences of same pronoun are all replaced
- [ ] Function handles missing/empty pronouns array gracefully
- [ ] Function preserves text formatting and line breaks
- [ ] 100% test coverage with TDD-first approach

### US-2: Replace Pronouns Button in Bulk Upload Modal
**As a** teacher
**When** pasting multiple personalized comments in bulk upload modal
**Then** I can replace pronouns with placeholders to make them reusable

**Acceptance Criteria**:
- [ ] "Replace Pronouns with Placeholders" button appears in bulk upload modal
- [ ] Button is disabled while pronouns are loading or if no pronouns exist
- [ ] Clicking button fetches pronouns from API
- [ ] Button shows loading state while pronouncing are being fetched
- [ ] On success, replaces pronouns in textarea with placeholders
- [ ] Shows success message indicating replacements made (e.g., "Replaced 3 pronouns")
- [ ] On error, shows error message and leaves text unchanged
- [ ] Multiple clicks work correctly (can reprocess text)

### US-3: Replace Pronouns Button in Personalized Comments Components
**As a** teacher
**When** creating or editing a personalized comment
**Then** I can replace pronouns with placeholders for reusability

**Acceptance Criteria**:
- [ ] "Replace Pronouns with Placeholders" button appears in personalized comment components
- [ ] Button position: near bottom right, consistent with other action buttons
- [ ] Button is disabled while pronouns are loading or if no pronouns exist
- [ ] Clicking button fetches pronouns and replaces them in textarea
- [ ] Shows loading state during API call
- [ ] Shows success message with count of replacements made
- [ ] On error, shows error message and preserves original text
- [ ] Works correctly with empty comment text

### US-4: Error Handling & Edge Cases
**As a** teacher
**When** using the replace pronouns feature in various scenarios
**Then** the app handles errors gracefully

**Acceptance Criteria**:
- [ ] If pronoun endpoint fails, shows user-friendly error message
- [ ] If no pronouns configured for user, shows helpful message
- [ ] If no pronouns found in text, shows message "No pronouns found in text"
- [ ] If text is empty, button shows appropriate message
- [ ] Multiple rapid clicks don't cause duplicate API calls (debounced)
- [ ] Function handles special characters in pronoun values
- [ ] Case variations (HE, He, he) all match and replace

### US-5: Integration & Accessibility
**As a** teacher
**When** using the replace pronouns feature
**Then** it is accessible and integrates seamlessly with the app

**Acceptance Criteria**:
- [ ] Button has proper ARIA labels and is keyboard accessible
- [ ] Focus management is correct after replacement
- [ ] Button tooltip explains the feature clearly
- [ ] Success/error messages are announced to screen readers
- [ ] No visual or layout shifts when button is added
- [ ] Consistent styling with rest of application (design tokens)

---

## 4. Technical Requirements

### Utility Function Signature
```typescript
/**
 * Replaces actual pronoun values with standardized placeholders.
 * @param text - The comment text containing pronouns to replace
 * @param pronouns - Array of Pronoun objects from API
 * @returns Text with pronouns replaced by placeholders
 */
function replacePronounsWithPlaceholders(
  text: string,
  pronouns: Pronoun[]
): {
  replacedText: string
  replacementCount: Record<string, number>
}
```

### Data Structures
Uses existing `Pronoun` interface:
```typescript
interface Pronoun {
  id: string
  pronoun: string              // e.g., "he", "she", "they"
  possessivePronoun: string   // e.g., "his", "her", "their"
  userId: string
  createdAt: string
  updatedAt: string
}
```

### Implementation Details
- **File Location**: `src/utils/pronouns.ts` (new file)
- **Hook Usage**: Components use existing `usePronounsQuery()` hook
- **Placeholder Constants**: Use existing `PLACEHOLDER_PATTERNS` from `src/utils/placeholders.ts`
- **Button Styling**: Use existing design tokens and Button component
- **State Management**: Local component state for loading/error states

### Non-Functional Requirements
- **Performance**: Utility function completes in <100ms for typical comments
- **Accessibility**: WCAG 2.1 AA compliance
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Testing**: Minimum 100% unit test coverage for utility

---

## 5. Success Metrics

### User-Facing Metrics
- ✅ Button is visible and functional in all target components
- ✅ Teachers can replace pronouns in <2 clicks
- ✅ Success/error messages are clear and actionable
- ✅ No text loss or data corruption during replacement

### Technical Metrics
- ✅ Utility function has 100% test coverage
- ✅ Zero TypeScript compilation errors
- ✅ All components pass linting
- ✅ No performance regression in component render times

---

## 6. Dependencies & Integration Points

### Existing Dependencies (No New Installs)
- `usePronounsQuery` hook: Fetches user's pronouns
- `placeholders.ts`: Existing placeholder utilities
- `src/types/Pronoun`: Pronoun type definitions
- Design system components (Button, etc.)

### Components to Modify
- `BulkPersonalizedCommentsModal` (bulk upload)
- Personalized comments components (add/edit)

### Files to Create
- `src/utils/pronouns.ts` (new utility)
- `src/utils/__tests__/pronouns.test.ts` (tests)

---

## 7. Assumptions

1. User has at least one pronoun configured (if not, button is disabled)
2. Pronouns are loaded successfully from API (uses existing error handling)
3. Teachers understand placeholder syntax already (from existing placeholders feature)
4. Case-insensitive matching is acceptable (he, He, HE all match)
5. All pronouns in database are user-specific (scoped to current user)

---

## 8. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| Pronoun endpoint unavailable | Button is disabled, no functionality | Low | Graceful error handling, offline message |
| Over-replacement (too eager) | Replaces words that aren't pronouns | Low | Exact string matching, test coverage |
| Performance on large comments | UI lag during replacement | Very Low | <100ms performance target, async handling |
| User confusion about feature | Feature goes unused | Medium | Clear tooltip, help text, success messages |

---

## 9. Future Enhancements

- Preview of replacements before applying
- Undo functionality for replacements
- Custom placeholder text configuration
- Batch processing across multiple comments
- Integration with pronoun management UI
- Suggested pronouns based on frequency analysis

---

## 10. Rollback Plan

If issues arise:
1. Disable button via feature flag (not implemented initially)
2. Revert commits affecting `src/utils/pronouns.ts` and component modifications
3. No data migration needed (feature is non-destructive)
4. No database changes required

---

**Approval Status**: Ready for Implementation
