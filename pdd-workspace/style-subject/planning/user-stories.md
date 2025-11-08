# User Stories: Subject Component Restyling

**Feature**: Style Subject Component with New Design System
**Complexity**: L0-ATOMIC (1-3 days, 3 stories)
**Branch**: `feat/style-subject`
**Components Affected**: `SubjectListItem.tsx`, `SubjectList.tsx`

---

## Design References

- **Color Scheme**: `images/test.webp` - Modern blue/cyan gradient with professional styling
- **Layout Structure**: `images/SubjecLayout.png` - Clean, simplified layout
- **Key Design Elements**:
  - Light blue/cyan gradient background (#E0F7FF to #FFFFFF)
  - Primary blue buttons (#0066FF)
  - Navy text for labels (#1E3A5F)
  - White/light gray input backgrounds (#F5F8FA)
  - Rounded corners and modern shadows

---

## User Story 1: Apply Color Scheme to Subject Component

**ID**: US-STYLE-001
**Priority**: HIGH
**Effort**: 1 Story Point (2-4 hours)

### User Story
AS A teacher
WHEN I view the Subject management interface
THE SYSTEM SHALL apply the modern blue/cyan color scheme from the design reference to all Subject components

### Acceptance Criteria (EARS Format)

**AC1: Background Gradient**
- WHEN the user views the Subject list container
- THE SYSTEM SHALL apply a light blue/cyan gradient background
- AND use colors ranging from #E0F7FF (light cyan) to #FFFFFF (white)

**AC2: Button Styling**
- WHEN the user views the "Add Subject" button
- THE SYSTEM SHALL style it with primary blue background (#0066FF)
- AND white text color (#FFFFFF)
- AND rounded corners (8px border-radius)
- AND subtle shadow on hover

**AC3: Delete Button Styling**
- WHEN the user views the Delete button beside the subject name
- THE SYSTEM SHALL maintain the red color scheme (current: red-600 border)
- AND update to use rounded corners consistent with the design (8px)
- AND apply modern hover state with light red background (#FEF2F2)

**AC4: Text and Label Colors**
- WHEN the user views labels and headings
- THE SYSTEM SHALL use navy blue text color (#1E3A5F) for labels
- AND darker gray (#374151) for body text
- AND maintain accessible contrast ratios (WCAG AA: 4.5:1 minimum)

**AC5: Input Field Styling**
- WHEN the user views the subject dropdown selector
- THE SYSTEM SHALL apply light gray background (#F5F8FA)
- AND navy border color (#1E3A5F)
- AND blue focus ring (#0066FF)

### Technical Notes
- Implement as CSS utility classes or styled-components
- Ensure colors are defined as CSS variables for maintainability
- Test color contrast with accessibility tools
- Reference: `SubjectList.tsx:306-344`, `SubjectListItem.tsx:190-245`

### Test Scenarios
1. Visual regression test: Compare rendered component against design mockup
2. Accessibility test: Verify WCAG AA contrast ratios for all text
3. Hover states: Verify button hover effects apply correctly
4. Focus states: Verify keyboard navigation highlights with blue ring

---

## User Story 2: Restructure Layout to Match Design Reference

**ID**: US-STYLE-002
**Priority**: HIGH
**Effort**: 1 Story Point (2-4 hours)

### User Story
AS A teacher
WHEN I view the Subject management interface
THE SYSTEM SHALL display the layout structure matching the design reference with proper spacing and alignment

### Acceptance Criteria (EARS Format)

**AC1: Header Layout**
- WHEN the user views the Subject list header
- THE SYSTEM SHALL display "Your Subjects" heading on the left
- AND "Add Subject" button aligned to the right
- AND maintain current flex layout structure (`SubjectList.tsx:307-314`)

**AC2: Dropdown Label Styling**
- WHEN the user views the subject selector
- THE SYSTEM SHALL display "Select a Subject" label above the dropdown
- AND use medium font weight (500)
- AND use navy text color (#1E3A5F)
- AND maintain proper spacing (8px margin-bottom)

**AC3: Subject Card Layout**
- WHEN a subject is selected and displayed
- THE SYSTEM SHALL show the subject name as a large heading (text-xl or text-2xl)
- AND display the Delete button beside the subject name (current implementation)
- AND show only the "Created" date below the name
- AND maintain tab navigation buttons on the right side

**AC4: Date Display Format**
- WHEN the user views a selected subject
- THE SYSTEM SHALL display "Created: [date]" in small gray text
- AND format date consistently using existing `formatDate` utility
- AND align date text to the left below the subject name

**AC5: Spacing and Padding**
- WHEN the user views the Subject component
- THE SYSTEM SHALL apply consistent spacing:
  - 24px padding for the subject card
  - 16px gap between subject name and delete button
  - 12px margin below header section
  - 8px between label and dropdown

### Technical Notes
- Layout changes in `SubjectListItem.tsx:190-232`
- Maintain existing responsive behavior
- Preserve accessibility attributes (aria-labels, roles)
- Keep current functionality intact (click handlers, keyboard nav)

### Test Scenarios
1. Layout test: Verify spacing matches design specification
2. Responsive test: Verify layout adapts correctly on mobile viewports
3. Alignment test: Verify all elements align correctly at various screen sizes
4. Print test: Verify layout renders correctly for print styles (future consideration)

---

## User Story 3: Remove "Updated At" Display from Subject Card

**ID**: US-STYLE-003
**Priority**: MEDIUM
**Effort**: 0.5 Story Points (1-2 hours)

### User Story
AS A teacher
WHEN I view a selected subject in the list
THE SYSTEM SHALL display only the "Created" date and hide the "Updated" date to simplify the interface

### Acceptance Criteria (EARS Format)

**AC1: Remove Updated Date from Display**
- WHEN the user views a subject card
- THE SYSTEM SHALL display only "Created: [date]"
- AND NOT display "Updated: [date]"
- AND maintain the existing date formatting

**AC2: Preserve Data Model**
- WHEN the component receives a Subject object
- THE SYSTEM SHALL still accept the `updatedAt` field in the data model
- AND NOT break existing API contracts
- BUT NOT render it in the UI

**AC3: Update Tests**
- WHEN running component tests for SubjectListItem
- THE SYSTEM SHALL pass all existing tests
- AND remove assertions that check for "Updated:" text
- AND verify "Created:" text is still rendered

**AC4: Accessibility**
- WHEN a screen reader user navigates to a subject card
- THE SYSTEM SHALL announce only the created date
- AND NOT announce the updated date
- AND maintain semantic HTML structure

### Technical Notes
- Remove or comment out lines in `SubjectListItem.tsx:228-230`
  ```tsx
  // REMOVE THIS:
  <p>Updated: {formatDate(subjectItem.updatedAt)}</p>
  ```
- Update test files:
  - `src/components/subjects/__tests__/SubjectListItem.test.tsx`
  - Update E2E tests if they assert on "Updated:" text
- **Important**: Do NOT modify the `Subject` type definition - keep `updatedAt` field for future use

### Test Scenarios
1. Rendering test: Verify "Updated:" text is not present in DOM
2. Snapshot test: Update snapshot to reflect new rendering
3. Accessibility test: Verify screen reader only announces "Created" date
4. Data integrity test: Verify `updatedAt` field is still accepted in props

---

## Success Metrics

### User Experience
- **Visual Consistency**: Subject component matches design reference 95%+
- **User Feedback**: Positive feedback on modern, clean appearance
- **Accessibility**: Maintains WCAG 2.1 AA compliance (0 violations)

### Technical Quality
- **Test Coverage**: Maintain ≥90% test coverage for modified components
- **Bundle Size**: No significant increase (< 2 KB increase acceptable)
- **Performance**: No regression in render time (< 16ms)

### Validation Checklist
- [ ] Visual comparison against `images/test.webp` and `images/SubjecLayout.png`
- [ ] Color contrast meets WCAG AA (use Chrome DevTools Color Picker)
- [ ] All existing tests pass with updated assertions
- [ ] Responsive design works on mobile (320px+) and desktop (1920px+)
- [ ] Keyboard navigation and focus styles work correctly
- [ ] "Updated at" text removed from UI but data model unchanged

---

## Implementation Notes

### File Changes Required
1. **SubjectList.tsx** (lines 306-344)
   - Update header styling
   - Apply background gradient
   - Update button styling
   - Update dropdown styling

2. **SubjectListItem.tsx** (lines 190-232)
   - Apply card background and borders
   - Update text colors
   - Remove "Updated:" date display
   - Update Delete button styling

3. **CSS/Styles**
   - Consider creating CSS variables for color palette
   - Ensure mobile-responsive styles

### Testing Strategy (TDD)
1. **Unit Tests**: Update `SubjectListItem.test.tsx` and `SubjectList.test.tsx`
2. **Snapshot Tests**: Update snapshots to reflect new styling
3. **E2E Tests**: Verify visual rendering in `e2e/subjectManagement.spec.ts`
4. **Accessibility Tests**: Run axe or similar tool to verify compliance

### Risk Assessment
- **Risk Level**: LOW (cosmetic changes only)
- **Potential Issues**:
  - Color contrast may need adjustment for accessibility
  - Gradient backgrounds may affect text readability
  - Mobile responsive layout may need fine-tuning
- **Mitigation**: Thorough testing across devices and screen sizes

---

## Dependencies
- **Design Assets**: `images/test.webp`, `images/SubjecLayout.png`
- **Existing Components**: `SubjectList`, `SubjectListItem`, `Button`
- **Utilities**: `formatDate` (no changes)
- **Types**: `Subject` type (no changes to data model)

---

## Definition of Done
- [ ] All 3 user stories implemented and tested
- [ ] Color scheme applied consistently across Subject components
- [ ] Layout matches design reference images
- [ ] "Updated at" removed from UI display
- [ ] All unit tests pass (90%+ coverage maintained)
- [ ] E2E tests pass
- [ ] Accessibility audit passes (0 WCAG violations)
- [ ] Code reviewed and approved
- [ ] Merged to main branch

---

**Created**: 2025-11-08
**Product Owner**: Principal Product Owner
**Next Step**: Hand off to Frontend Engineer for implementation
