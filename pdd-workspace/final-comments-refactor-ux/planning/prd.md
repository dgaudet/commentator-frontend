# Product Requirements Document: Final Comments Refactor & UX Enhancements

**Feature ID**: FC-REFACTOR-001
**Version**: 1.0
**Status**: Planning Complete
**Complexity**: L1-MICRO
**Created**: 2025-11-13
**Owner**: Product Owner

---

## Executive Summary

This feature addresses technical debt by reducing code duplication between Add and Edit final comment forms (~60% reduction) while simultaneously enhancing teacher workflow efficiency through persistent personal comment selection and a one-click "Populate with Above Comments" button that combines outcome and personal comments.

**Business Impact**: 20-30% faster final comment composition + improved code maintainability

---

## Problem Statement

### Current Pain Points

1. **Code Duplication** (Technical Debt)
   - Add and Edit forms contain nearly identical logic (~200+ lines duplicated)
   - Changes must be made in two places, increasing maintenance burden and bug risk
   - Violates DRY (Don't Repeat Yourself) principle

2. **Poor Visual Feedback** (UX Issue)
   - When a teacher selects a personal comment from the typeahead, it disappears immediately
   - No visual indication of which comment was selected
   - Teachers lose context during form editing

3. **Manual Comment Composition** (Workflow Inefficiency)
   - Teachers must manually copy outcome comments and personal comments
   - Time-consuming copy-paste workflow
   - Error-prone (easy to miss one of the comments or copy incorrectly)

### User Impact

- **Teachers**: Frustrated by redundant manual work when composing final comments
- **Developers**: Slower feature development due to duplicated code maintenance
- **QA**: Higher testing burden due to maintaining two parallel test suites

---

## Goals & Objectives

### Primary Goals

1. **Reduce Technical Debt**: Eliminate ≥60% of duplicated code between Add/Edit forms
2. **Improve Workflow Efficiency**: Enable 20-30% faster final comment composition
3. **Enhance UX**: Provide clear visual feedback for selected personal comments

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Code Duplication Reduction | ≥60% | SonarQube / manual LOC count |
| Test Coverage | ≥90% | Jest coverage report |
| Workflow Time Savings | 20-30% | Time study (before/after) |
| Accessibility Compliance | 0 violations | Axe DevTools audit |
| Defect Rate | <2% | Bug reports after 2 weeks |
| User Satisfaction | ≥4.5/5 | Post-release survey |

---

## User Personas

### Primary: Sarah - Middle School Teacher

- **Demographics**: 35 years old, 10 years teaching experience
- **Tech Comfort**: Moderate (uses basic software daily)
- **Pain Points**:
  - Spends 5-10 hours per semester creating final report comments for 100+ students
  - Often makes copy-paste errors when combining outcome and personal comments
  - Frustrated when selected comments disappear from view
- **Goals**:
  - Complete report cards faster
  - Maintain high-quality, personalized comments
  - Reduce repetitive manual work

---

## Feature Requirements

### FR-1: Shared Form Logic Extraction (US-FC-REFACTOR-001)

**Priority**: MUST HAVE

Extract duplicated logic between Add and Edit forms into reusable component/hook:
- Form state management (firstName, grade, comment, etc.)
- Validation logic
- Submission handlers
- TypeaheadSearch integration
- Outcome comment dropdown handling

**Acceptance**: ≥60% code duplication reduction, all tests pass, 0 regressions

---

### FR-2: Persistent Personal Comment Selection (US-FC-REFACTOR-002)

**Priority**: SHOULD HAVE

Display selected personal comment persistently in the typeahead input:
- Show selected comment text after selection
- Provide clear button to change selection
- Maintain independent state for Add/Edit forms
- Clear selection on form submission

**Acceptance**: Selected comment visible until cleared/submitted, keyboard accessible

---

### FR-3: "Populate with Above Comments" Button (US-FC-REFACTOR-003)

**Priority**: MUST HAVE

Add button to automatically populate final comment with outcome + personal comments:
- Button positioned between typeahead and final comment textarea
- Enabled only when at least one comment is selected
- Populates outcome comment (if selected)
- Populates personal comment (if selected)
- Populates both in correct order: outcome → personal (if both selected)
- Confirmation dialog if final comment textarea already has text
- Sets focus to textarea after population

**Acceptance**: One-click population works in Add/Edit forms, no data loss, confirmation on overwrite

---

### FR-4: Edge Case Handling (US-FC-REFACTOR-004)

**Priority**: SHOULD HAVE

Handle edge cases gracefully:
- Empty/whitespace-only comments (skip)
- Character limit validation (warn/prevent)
- Whitespace normalization
- Special characters preservation (no XSS)

**Acceptance**: No errors for edge cases, clear error messages

---

### FR-5: Comprehensive Testing (US-FC-REFACTOR-005)

**Priority**: MUST HAVE

Ensure quality through comprehensive testing:
- Unit tests for shared logic
- Integration tests for populate feature
- Regression tests for existing functionality
- Accessibility testing (WCAG 2.1 AA)
- Documentation updates

**Acceptance**: ≥90% coverage, 0 accessibility violations, all tests pass

---

## User Flows

### Flow 1: Teacher Composes Final Comment with Populate Button

```
1. Teacher opens Final Comments modal for a student
2. Teacher selects outcome comment from dropdown (e.g., "Achieved B grade...")
3. Teacher types in personal comment search: "excellent"
4. Teacher selects "Excellent work this semester" from typeahead
   → Personal comment stays visible in typeahead input
5. Teacher clicks "Populate with Above Comments" button
   → Confirmation dialog appears (if final comment has text)
6. Teacher clicks "Replace"
   → Final comment textarea populates with:
      "Achieved B grade on all assignments. Excellent work this semester."
7. Teacher edits combined text if needed
8. Teacher clicks "Add Final Comment"
   → Comment saved, form resets, typeahead clears
```

### Flow 2: Teacher Changes Personal Comment Selection

```
1. Teacher selects "Excellent work" from typeahead
   → "Excellent work" stays visible
2. Teacher realizes they want a different comment
3. Teacher clicks [X] clear button next to selected comment
   → Typeahead resets to search mode
4. Teacher searches for and selects "Good effort on assignments"
   → New selection replaces old one
```

---

## Technical Requirements

### Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Form interactions | <100ms response time |
| Scalability | Handle large comments | Up to 500 characters per comment |
| Accessibility | WCAG 2.1 AA | 0 violations |
| Browser Support | Modern browsers | Chrome 90+, Firefox 88+, Safari 14+ |
| Mobile Support | Responsive design | Works on 375px+ viewports |
| Security | XSS Prevention | Sanitize all user input |

### Technology Stack

- **Frontend**: React 18.3.1 + TypeScript (strict mode)
- **Testing**: Jest + React Testing Library + Playwright
- **Styling**: Design Tokens (inline styles)
- **Build**: Vite
- **State Management**: React Hooks (useState, useEffect, useCallback)

### Dependencies

- Existing TypeaheadSearch component
- usePersonalizedComments hook
- useOutcomeComments hook
- Design token system
- Modal component patterns

---

## Design Requirements

### UI Components

1. **"Populate with Above Comments" Button**
   - **Label**: "Populate with Above Comments"
   - **Style**: Primary or secondary button (design tokens)
   - **Position**: Between personal comment typeahead and final comment textarea
   - **States**: Enabled (when ≥1 comment selected), Disabled (when 0 comments), Loading (during population)
   - **Tooltip**: "Copy outcome and personal comments to the final comment box"

2. **Confirmation Dialog**
   - **Title**: "Replace Comment?"
   - **Message**: "This will replace your current comment. Continue?"
   - **Actions**: "Cancel" (secondary), "Replace" (primary danger)

3. **Personal Comment Selection Display**
   - **Format**: Text input with selected value
   - **Clear Button**: [X] icon button, right-aligned
   - **Styling**: Use design tokens, subtle background to indicate selection

### Accessibility Requirements

- All interactive elements keyboard accessible (Tab, Enter, Escape)
- ARIA labels for screen readers
- Focus management (focus moves to textarea after population)
- Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- Error messages announced to screen readers

---

## Out of Scope

The following are explicitly OUT OF SCOPE for this release:

- ❌ Edit functionality for personal comments (separate feature)
- ❌ Reordering outcome/personal comments (always outcome → personal)
- ❌ Custom separator configuration (fixed to space or newline)
- ❌ Auto-save functionality
- ❌ Undo/redo for populate action
- ❌ Comment templates management
- ❌ AI-generated comment suggestions

---

## Risks & Mitigation

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| Refactoring breaks existing functionality | HIGH | MEDIUM | TDD approach, comprehensive regression tests, incremental refactoring |
| Complex state management across Add/Edit | MEDIUM | MEDIUM | Use React best practices, thorough testing, code review |
| Character limit edge cases | LOW | HIGH | Clear validation, user-friendly error messages |
| Accessibility issues | MEDIUM | LOW | Early accessibility audit, follow existing patterns |
| Performance degradation | LOW | LOW | Performance testing, code profiling |

---

## Timeline & Milestones

| Milestone | Duration | Deliverables |
|-----------|----------|--------------|
| **Sprint 1** | Week 1 | US-001 (Shared logic), US-002 (Persistent selection), US-003 (Populate button) |
| **Sprint 2** | Week 2 | US-004 (Edge cases), US-005 (Testing & docs) |
| **Total** | 1-2 weeks | All 5 user stories complete, 875+ tests passing, 0 lint errors |

---

## Release Plan

### Phase 1: Development (1-2 weeks)
- Implement all 5 user stories
- TDD approach (Red-Green-Refactor)
- Code review and refinement

### Phase 2: Testing & Validation (2-3 days)
- Manual testing in staging environment
- Accessibility audit
- User acceptance testing (if available)

### Phase 3: Deployment (1 day)
- Merge to main branch
- Deploy to production
- Monitor for errors/issues

### Phase 4: Post-Release Monitoring (1 week)
- Monitor error rates
- Collect user feedback
- Address critical issues if any

---

## Acceptance Criteria Summary

**Feature will be considered COMPLETE when**:

✅ All 5 user stories meet their acceptance criteria
✅ Code duplication reduced by ≥60%
✅ Test coverage ≥90% (all tests pass)
✅ 0 ESLint/TypeScript errors
✅ 0 WCAG 2.1 AA accessibility violations
✅ "Populate with Above Comments" works correctly in Add/Edit forms
✅ Persistent selection displays and clears correctly
✅ Confirmation dialog prevents accidental overwrites
✅ Edge cases handled gracefully
✅ Documentation updated
✅ Code review approved

---

## Stakeholder Sign-Off

| Stakeholder | Role | Approval Status | Date |
|-------------|------|-----------------|------|
| Product Owner | Requirements | ✅ APPROVED | 2025-11-13 |
| Tech Lead | Feasibility | PENDING | - |
| Developer | Implementation | PENDING | - |
| QA Engineer | Testing Strategy | PENDING | - |

---

## Appendix

### Related Documents
- User Stories: `user-stories.md`
- Metadata: `metadata.json`
- Existing TypeaheadSearch Implementation: `src/components/common/TypeaheadSearch.tsx`
- FinalCommentsModal: `src/components/finalComments/FinalCommentsModal.tsx`

### Reference Features
- Personal Comments Typeahead (PC-TYPEAHEAD-001) - Similar refactoring patterns
- Outcome Comments Integration - Similar populate patterns

### Questions for Tech Lead
1. Preferred approach: Custom hook (`useFinalCommentForm`) vs. shared component?
2. Comment concatenation format: Space separator or newline separator?
3. Character limit for final comments (if any)?
4. Should we support markdown or rich text in comments?

---

**Status**: ✅ PLANNING COMPLETE - Ready for implementation

**Next Step**: Hand off to developers for TDD implementation (architecture review SKIPPED for L1-MICRO)
