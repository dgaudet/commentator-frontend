# Product Requirements Document
# Shared Comment Field Component

**Feature ID:** shared-comment-field
**Complexity Level:** L1 (Micro)
**Document Version:** 1.0
**Last Updated:** 2025-11-17
**Status:** Planning

---

## Executive Summary

Create a reusable `CommentTextField` component to eliminate code duplication between `OutcomeCommentsModal` and `PersonalizedCommentsModal`. Both modals currently duplicate ~240 lines of comment field logic, including validation, character counting, and placeholder tips. This refactoring will improve maintainability, ensure consistency, and follow DRY principles.

**Key Outcomes:**
- Single source of truth for comment field logic
- Eliminate ~240 lines of duplicate code
- Consistent UX across both modals
- Easier maintenance and future enhancements

---

## Problem Statement

### Current State
- **OutcomeCommentsModal** and **PersonalizedCommentsModal** each contain duplicate comment field implementations
- Both modals have identical validation requirements (10-500 chars, placeholder validation)
- Both modals display identical placeholder tips and warnings
- Changes to comment field behavior require updates in 4 locations (add form + edit form × 2 modals)

### Pain Points
1. **Maintenance Burden:** Bug fixes or enhancements require changes in multiple locations
2. **Inconsistency Risk:** Easy to accidentally create behavioral differences between modals
3. **Code Duplication:** ~240 lines of duplicate code violates DRY principles
4. **Testing Overhead:** Same logic tested multiple times in different contexts

### Business Impact
- **Developer Velocity:** Slower feature development due to code duplication
- **Bug Risk:** Higher likelihood of inconsistencies and bugs
- **Technical Debt:** Accumulated duplication increases maintenance costs

---

## Goals & Success Criteria

### Primary Goals
1. ✅ **Code Consolidation:** Reduce comment field code from 4 implementations to 1 shared component
2. ✅ **Consistency Guarantee:** Ensure identical behavior across both modals
3. ✅ **Zero Regressions:** Maintain all existing functionality and test coverage
4. ✅ **Maintainability:** Single location for all future comment field enhancements

### Success Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Code Reduction | -240 lines | Git diff analysis |
| Test Coverage | ≥90% | Jest coverage report |
| Test Pass Rate | 100% (166+ tests) | CI test results |
| Linting Violations | 0 | ESLint report |
| Behavioral Consistency | 100% | Manual QA verification |

---

## User Stories

### **US-SHARED-001: Create Shared CommentTextField Component**
**Priority:** HIGH | **Story Points:** 3

**As a** developer
**I want** a reusable CommentTextField component
**So that** both modals can use consistent comment input with validation

**Acceptance Criteria:**

1. **WHEN** I create the new component
   **THE SYSTEM SHALL** extract all comment field logic into `src/components/common/CommentTextField.tsx`

2. **WHEN** the component is used
   **THE SYSTEM SHALL** accept props:
   - `value: string` - Current comment text
   - `onChange: (value: string) => void` - Change callback
   - `onValidationChange?: (warnings: string[]) => void` - Validation callback
   - `placeholder?: string` - Placeholder text (default: "Enter comment...")
   - `minLength?: number` - Min chars (default: 10)
   - `maxLength?: number` - Max chars (default: 500)
   - `rows?: number` - Textarea rows (default: 3)
   - `showCharCount?: boolean` - Show counter (default: true)
   - `showPlaceholderTips?: boolean` - Show tips (default: true)
   - `ariaLabel?: string` - Accessibility label
   - `disabled?: boolean` - Disable input

3. **WHEN** text is entered
   **THE SYSTEM SHALL** validate placeholders using `validatePlaceholders()` utility

4. **WHEN** validation warnings exist
   **THE SYSTEM SHALL** display them via `PlaceholderWarningsBox` component

5. **WHEN** placeholder tips are enabled
   **THE SYSTEM SHALL** display `PlaceholderTipsBox` component

6. **WHEN** character count is enabled
   **THE SYSTEM SHALL** show "X / {maxLength} characters" with color coding:
   - Green when valid (≥ minLength)
   - Red when invalid (< minLength)
   - Show "(minimum {minLength})" hint when 0 < count < minLength

7. **WHEN** the component is rendered
   **THE SYSTEM SHALL** use design tokens for all styling

**Definition of Done:**
- ✅ Component created with TypeScript types
- ✅ All props documented
- ✅ Design tokens used throughout
- ✅ WCAG 2.1 AA accessibility compliance

---

### **US-SHARED-002: Refactor OutcomeCommentsModal**
**Priority:** HIGH | **Story Points:** 2

**As a** developer
**I want** OutcomeCommentsModal to use the shared CommentTextField
**So that** code duplication is eliminated

**Acceptance Criteria:**

1. **WHEN** refactoring the add form
   **THE SYSTEM SHALL** replace textarea/validation with `<CommentTextField>`

2. **WHEN** refactoring the edit form
   **THE SYSTEM SHALL** replace textarea/validation with `<CommentTextField>`

3. **WHEN** tests are run
   **THE SYSTEM SHALL** maintain 100% passing coverage (25+ tests)

4. **WHEN** the modal is rendered
   **THE SYSTEM SHALL** maintain identical UX

5. **WHEN** placeholder validation occurs
   **THE SYSTEM SHALL** display warnings in same location/style

**Definition of Done:**
- ✅ Both forms refactored
- ✅ All tests passing
- ✅ No visual regressions
- ✅ Linting passes

---

### **US-SHARED-003: Refactor PersonalizedCommentsModal**
**Priority:** HIGH | **Story Points:** 2

**As a** developer
**I want** PersonalizedCommentsModal to use the shared CommentTextField
**So that** both modals have consistent comment fields

**Acceptance Criteria:**

1. **WHEN** refactoring the add form
   **THE SYSTEM SHALL** replace textarea/validation with `<CommentTextField>`

2. **WHEN** refactoring the edit form
   **THE SYSTEM SHALL** replace textarea/validation with `<CommentTextField>`

3. **WHEN** tests are run
   **THE SYSTEM SHALL** maintain 100% passing coverage (105+ tests)

4. **WHEN** the modal is rendered
   **THE SYSTEM SHALL** maintain identical UX

5. **WHEN** character count is displayed
   **THE SYSTEM SHALL** maintain color coding

**Definition of Done:**
- ✅ Both forms refactored
- ✅ All tests passing
- ✅ No visual regressions
- ✅ Linting passes

---

## Functional Requirements

### FR-1: Shared Component API
The `CommentTextField` component shall provide a flexible, reusable API supporting both modal use cases.

**Component Composition:**
The component **internally renders all child elements**, eliminating the need for parent components to render them:
- ✅ `PlaceholderTipsBox` - Rendered when `showPlaceholderTips={true}`
- ✅ `<textarea>` - Main input field with validation
- ✅ Character counter - Rendered when `showCharCount={true}`
- ✅ `PlaceholderWarningsBox` - Rendered automatically when validation warnings exist

**Parent components only need:**
```typescript
<CommentTextField
  value={commentText}
  onChange={setCommentText}
  showPlaceholderTips={true}
/>
```

**Required Props:**
- `value: string` - Controlled component value
- `onChange: (value: string) => void` - Value change handler

**Optional Props:**
- `onValidationChange?: (warnings: string[]) => void` - Validation state callback
- `placeholder?: string` - Input placeholder text
- `minLength?: number` - Minimum character validation (default: 10)
- `maxLength?: number` - Maximum character validation (default: 500)
- `rows?: number` - Textarea height (default: 3)
- `showCharCount?: boolean` - Display character counter (default: true)
- `showPlaceholderTips?: boolean` - Display usage tips (default: true)
- `ariaLabel?: string` - ARIA label for accessibility
- `disabled?: boolean` - Disable input field

### FR-2: Character Validation
**WHEN** text is entered
**THE SYSTEM SHALL** enforce character length constraints:
- Minimum: 10 characters (configurable)
- Maximum: 500 characters (configurable)
- Real-time validation as user types

**Character Counter Display:**
- Format: "X / {maxLength} characters"
- Color: Green when ≥ minLength, Red when < minLength
- Show hint: "(minimum {minLength})" when 0 < count < minLength

### FR-3: Placeholder Validation
**WHEN** text contains placeholders
**THE SYSTEM SHALL** validate using `validatePlaceholders()` utility:
- Supported: `<first name>`, `<last name>`, `<grade>`
- Detect malformed placeholders (e.g., `<first name`, `first name>`, `<firstname>`)
- Display warnings via `PlaceholderWarningsBox` component

### FR-4: User Guidance
**WHEN** `showPlaceholderTips` is enabled
**THE SYSTEM SHALL** display `PlaceholderTipsBox` component with:
- Supported placeholder examples
- Usage instructions
- Real-world example ("Alice earned 95 points")

### FR-5: Accessibility
**WHEN** the component is rendered
**THE SYSTEM SHALL** provide WCAG 2.1 AA compliance:
- `aria-label` on textarea
- Character counter color contrast
- Warning messages with `role="alert"`
- Keyboard navigation support

---

## Non-Functional Requirements

### NFR-1: Performance
- Component render time: < 100ms
- No noticeable performance degradation vs. current implementation
- Efficient re-renders (memoization if needed)

### NFR-2: Maintainability
- Clear TypeScript types and interfaces
- Comprehensive JSDoc comments
- Single source of truth for comment field logic
- Easy to extend with new validation rules

### NFR-3: Testability
- Unit testable in isolation
- Integration testable within modals
- Maintain ≥90% code coverage

### NFR-4: Compatibility
- Compatible with existing modal architecture
- Works with current state management patterns
- No breaking changes to modal APIs

---

## Technical Requirements

### Architecture

**Component Location:**
```
src/components/common/CommentTextField.tsx
```

**Dependencies:**
- `PlaceholderTipsBox` component (existing)
- `PlaceholderWarningsBox` component (existing)
- `validatePlaceholders()` utility (existing)
- Design tokens (colors, spacing, typography, borders)

**State Management:**
- Parent components manage comment text state
- Component manages internal validation warnings
- Optional callback for parent to receive validation state

### Design Tokens Compliance
All styling must use design tokens:
- `spacing.*` for padding/margins
- `typography.*` for font sizing/weights
- `colors.*` for text/background colors
- `borders.*` for border styles

### Integration Points

**OutcomeCommentsModal:**
- Add form: Replace textarea + validation (lines ~226-273)
- Edit form: Replace textarea + validation (lines ~466-512)

**PersonalizedCommentsModal:**
- Add form: Replace textarea + validation + char count (lines ~230-274)
- Edit form: Replace textarea + validation + char count (lines ~393-420)

---

## Validation Rules

### Character Length Validation
- **Rule:** Text length must be between minLength and maxLength
- **Default:** 10-500 characters
- **Timing:** Real-time as user types
- **Display:** Character counter with color coding
- **Error State:** Red text when below minimum

### Placeholder Validation
- **Rule:** Placeholders must be properly formatted
- **Valid:** `<first name>`, `<last name>`, `<grade>` (exact matches)
- **Invalid:** Partial tags, misspellings, extra spaces
- **Timing:** Real-time as user types
- **Display:** Warning messages via `PlaceholderWarningsBox`

### Examples

**Valid Input:**
```
<first name> has demonstrated excellent progress with a grade of <grade>.
```

**Invalid Input (triggers warnings):**
```
<firstname> has demonstrated progress (missing space)
<first name has demonstrated progress (missing closing bracket)
```

---

## User Experience

### Visual Design
- Identical appearance to current comment fields
- Textarea with rounded corners (design tokens)
- Character counter aligned right
- Placeholder tips box above textarea (light blue background)
- Warning messages below textarea (yellow/orange background)

### Interaction Flow

**1. Initial Render:**
- Empty textarea with placeholder text
- Placeholder tips box visible (if enabled)
- Character counter shows "0 / 500 characters" in red
- No warnings visible

**2. User Typing:**
- Character counter updates in real-time
- Counter turns green when ≥ minLength
- Placeholder validation runs on each keystroke
- Warnings appear/disappear dynamically

**3. Validation Warnings:**
- Appear below textarea
- Yellow/orange background for visibility
- List all detected issues
- Update as user corrects issues

---

## Implementation Plan

### Phase 1: Component Creation (US-SHARED-001)
**Duration:** 4-6 hours

1. Create `CommentTextField.tsx` with full TypeScript types
2. Implement character validation logic
3. Integrate existing validation utilities
4. Add design tokens styling
5. Write unit tests for component in isolation
6. Document props and usage examples

**Deliverables:**
- ✅ `src/components/common/CommentTextField.tsx`
- ✅ Component unit tests
- ✅ TypeScript types/interfaces
- ✅ JSDoc documentation

---

### Phase 2: OutcomeCommentsModal Refactor (US-SHARED-002)
**Duration:** 2-3 hours

1. Replace add form textarea with `CommentTextField`
2. Replace edit form textarea with `CommentTextField`
3. Remove duplicate validation logic
4. Update state management if needed
5. Run tests and fix any failures
6. Manual QA in browser

**Deliverables:**
- ✅ Refactored OutcomeCommentsModal
- ✅ All 25+ tests passing
- ✅ No visual regressions

---

### Phase 3: PersonalizedCommentsModal Refactor (US-SHARED-003)
**Duration:** 2-3 hours

1. Replace add form textarea with `CommentTextField`
2. Replace edit form textarea with `CommentTextField`
3. Remove duplicate character count logic
4. Remove duplicate validation logic
5. Run tests and fix any failures
6. Manual QA in browser

**Deliverables:**
- ✅ Refactored PersonalizedCommentsModal
- ✅ All 105+ tests passing
- ✅ No visual regressions

---

## Testing Strategy

### Unit Testing
**Component Tests (`CommentTextField.test.tsx`):**
- ✅ Renders with default props
- ✅ Renders with custom props
- ✅ Character validation works correctly
- ✅ Placeholder validation integration
- ✅ Character counter color coding
- ✅ Placeholder tips visibility toggle
- ✅ Validation warnings display
- ✅ onChange callback fires correctly
- ✅ onValidationChange callback fires correctly
- ✅ Accessibility attributes present
- ✅ Design tokens compliance

**Target Coverage:** ≥90%

### Integration Testing
**Modal Tests (existing test suites):**
- ✅ All OutcomeCommentsModal tests pass (25+ tests)
- ✅ All PersonalizedCommentsModal tests pass (105+ tests)
- ✅ Add form validation works
- ✅ Edit form validation works
- ✅ Character counting works
- ✅ Placeholder validation works
- ✅ Warning display works

**Target Coverage:** 100% passing (no regressions)

### Manual QA
**Browser Testing:**
- ✅ Visual appearance identical to current
- ✅ Character counter updates in real-time
- ✅ Validation warnings appear/disappear correctly
- ✅ Placeholder tips box displays properly
- ✅ Keyboard navigation works
- ✅ Screen reader compatibility
- ✅ No console errors/warnings

---

## Risks & Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Test breakage during refactor | Medium | High | Incremental refactoring, test after each change |
| State management complexity | Low | Medium | Keep parent state, child handles display only |
| Visual regression | Low | Medium | Manual QA, screenshot comparison |
| Props interface too complex | Low | Low | Start minimal, add props as needed |
| Performance degradation | Very Low | Medium | Measure render times, optimize if needed |

### Mitigation Strategies

**For Test Breakage:**
- Refactor one modal at a time
- Run full test suite after each change
- Don't proceed to next modal until tests pass

**For State Management:**
- Component is controlled (parent manages value)
- Keep existing state patterns in modals
- Only extract presentation logic

**For Visual Regression:**
- Manual testing in browser before/after
- Take screenshots for comparison
- Verify character counter styling
- Verify warning message styling

---

## Dependencies

### Code Dependencies
- ✅ `PlaceholderTipsBox` component (existing)
- ✅ `PlaceholderWarningsBox` component (existing)
- ✅ `validatePlaceholders()` utility (existing)
- ✅ Design tokens system (existing)
- ✅ React 18.3.1 (existing)
- ✅ TypeScript (existing)

### Team Dependencies
- Frontend Developer for implementation
- QA verification (manual testing)

### External Dependencies
- None (internal refactoring only)

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Planning** | Complete | This PRD document |
| **Implementation** | 1-2 days | All 3 user stories completed |
| **Testing** | Included | Automated tests + manual QA |
| **Review** | 1 hour | Code review |
| **Deployment** | Same PR | Deploy with related features |

**Total Estimated Effort:** 1-2 days (7 story points)

---

## Release Strategy

### Deployment Approach
**Bundled Release** - Deploy as part of existing feature branch

**Rationale:**
- Internal refactoring with no user-visible changes
- Zero feature flag complexity
- Lower deployment risk
- Can be included with placeholder feature work

### Rollback Plan
**If Issues Detected:**
1. Revert Git commit containing refactoring
2. Previous modal implementations still in Git history
3. All tests provide regression detection

**Rollback Trigger:**
- Test failures in CI/CD
- Visual regressions detected
- Performance degradation observed

---

## Success Validation

### Acceptance Checklist
- [ ] `CommentTextField` component created
- [ ] Component has comprehensive unit tests
- [ ] OutcomeCommentsModal refactored (both forms)
- [ ] PersonalizedCommentsModal refactored (both forms)
- [ ] All 166+ existing tests passing
- [ ] Linting passes with zero violations
- [ ] Manual QA confirms no visual regressions
- [ ] Code reduction target achieved (-240 lines)
- [ ] Test coverage maintained ≥90%

### Post-Launch Monitoring
**Week 1-2:**
- Monitor for bug reports related to comment fields
- Track test stability in CI/CD
- Verify no performance degradation

**Success Indicators:**
- Zero regression bugs reported
- All tests remain stable
- Developer feedback positive (easier to maintain)

---

## Appendix

### References
- **Related Work:** Placeholder support feature (recently completed)
- **Design Tokens:** `src/theme/tokens.ts`
- **Validation Utility:** `src/utils/placeholders.ts`
- **Existing Components:** `src/components/common/Placeholder*.tsx`

### Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-17 | Product Owner | Initial PRD creation |

### Glossary
- **DRY:** Don't Repeat Yourself principle
- **UX:** User Experience
- **PRD:** Product Requirements Document
- **WCAG:** Web Content Accessibility Guidelines
- **QA:** Quality Assurance

---

**Document Status:** ✅ COMPLETE - Ready for Implementation

**Next Steps:**
1. Review and approve PRD
2. Hand off to Frontend Engineer for implementation
3. Follow implementation order: US-SHARED-001 → US-SHARED-002 → US-SHARED-003
