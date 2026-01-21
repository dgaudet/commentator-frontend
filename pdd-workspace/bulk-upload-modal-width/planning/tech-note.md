# Tech Note: Wider Bulk Upload Modal

**Feature:** Bulk Upload Modal Width Enhancement
**Complexity:** L0 (Atomic)
**Effort:** < 1 day
**Status:** Planning

## Problem Statement

The BulkUploadModal is currently constrained to `minWidth: 600px`, making it narrow compared to the main application content area which spans `maxWidth: 1200px`. This creates an inconsistent visual experience and wastes horizontal space on larger screens.

## User Story

**As a** user with a large monitor
**I want to** see the bulk upload modal use the full width available (matching the main content area)
**So that** I can comfortably see all instructions, examples, and have more space for the textarea

**Acceptance Criteria:**
- [ ] Modal width matches main application content width (1200px max-width on desktop)
- [ ] Modal remains responsive and centered on all screen sizes
- [ ] Modal maintains appropriate padding and stays readable
- [ ] No visual regression in modal appearance or functionality
- [ ] Modal textarea has more horizontal space for better usability

## Technical Approach

**File to Modify:**
- `src/components/personalizedComments/BulkUploadModal.tsx` (lines 214-221)

**Current Styling:**
```typescript
minWidth: '600px',
maxHeight: '90vh',
```

**Proposed Styling:**
```typescript
width: '90%',  // Responsive width with margin
maxWidth: '1200px',  // Match main app width
maxHeight: '90vh',
```

**Alternative (if fixed better):**
```typescript
minWidth: '600px',  // Mobile fallback
maxWidth: '1200px',  // Desktop max
width: '100%',  // Fill container
```

## Design Considerations

- Modal uses fixed positioning, so width is relative to viewport, not parent
- Padding remains consistent (`spacing['2xl']`) via design tokens
- Textarea benefits from additional horizontal space for multi-line comments
- No changes needed to modal content or layout structure

## Testing Approach

- Visual regression: Compare modal appearance at different viewport sizes
- Responsive: Test at mobile (320px), tablet (768px), desktop (1200px+)
- Functional: Verify all textarea functionality, scrolling, and buttons work with new width
- Edge cases: Long comment text, multiple-line examples display correctly

## Dependencies

None - pure styling enhancement to existing component

## Risk Assessment

**Risk Level:** Very Low
- Single file modification
- CSS/styling only (no logic changes)
- Existing functionality completely preserved
- Modal layout is self-contained

## Release Notes

> **UI Enhancement:** The bulk upload modal now spans the full application width (up to 1200px) on larger screens, providing improved readability and more comfortable space for viewing instructions and entering comments.

## Future Considerations

- Could make width configurable via design token if other modals need similar treatment
- Monitor user feedback on modal size on ultra-wide monitors (2560px+)
