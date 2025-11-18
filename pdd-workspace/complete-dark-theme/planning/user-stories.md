# Complete Dark Theme & Design Token Migration - User Stories

**Feature**: Complete Dark Theme & Design Token Migration
**Complexity**: L1-MICRO
**Epic**: User Interface Modernization - Phase 2
**Business Value**: HIGH - Completes dark theme experience across entire application
**Parent Feature**: Extends dark-theme (L1-MICRO)

---

## Executive Summary

Complete the dark theme implementation by migrating all remaining components to use design tokens and support dynamic theme switching. This ensures a consistent user experience across the entire application with no visual inconsistencies between light and dark modes.

### Current State
- ✅ **25 components** already migrated with dark theme support
- ✅ Theme infrastructure complete (ThemeProvider, useThemeColors, dark/light tokens)
- ❌ **8 components** still using hardcoded Tailwind classes or CSS modules

### Target State
- All components use design tokens exclusively
- Seamless dark/light theme switching across entire application
- Zero hardcoded colors or spacing values
- 100% WCAG 2.1 AA contrast compliance in both themes

---

## Story Prioritization

| ID | Component | Priority | Effort | Risk | Dependencies |
|----|-----------|----------|--------|------|--------------|
| US-TOKEN-001 | ErrorMessage | HIGH | 2 | LOW | None |
| US-TOKEN-002 | LoadingSpinner | HIGH | 2 | LOW | None |
| US-TOKEN-003 | ConfirmationModal | HIGH | 2 | LOW | None |
| US-TOKEN-004 | Tabs | MEDIUM | 3 | LOW | None |
| US-TOKEN-005 | TabPanel | MEDIUM | 2 | LOW | US-TOKEN-004 |
| US-TOKEN-006 | SubjectListItem | MEDIUM | 2 | LOW | None |
| US-TOKEN-007 | SubjectEmptyState | LOW | 1 | LOW | None |
| US-TOKEN-008 | CopyButton | LOW | 2 | LOW | None |

**Total Story Points**: 16
**Estimated Duration**: 1-2 weeks (small team)

**Priority Rationale**:
- **HIGH**: User-facing error/loading states (visible in all workflows)
- **MEDIUM**: Navigation and list components (frequently used)
- **LOW**: Empty states and utility buttons (less critical paths)

---

## US-TOKEN-001: Migrate ErrorMessage to Design Tokens

**As a** user viewing the application in dark mode
**I want** error messages to use appropriate dark theme colors
**So that** error messages are readable and properly styled in both light and dark themes

### Current State
- Uses hardcoded Tailwind classes: `bg-red-50`, `border-red-200`, `text-red-800`
- No dark theme support
- Inconsistent with design system

### Acceptance Criteria (EARS Notation)

**WHEN** an error message is displayed in light theme
**THE SYSTEM SHALL** use `colors.semantic.errorLight` for background, `colors.semantic.error` for border and text

**WHEN** an error message is displayed in dark theme
**THE SYSTEM SHALL** adjust colors to maintain WCAG 2.1 AA contrast ratios

**WHEN** the theme changes dynamically
**THE SYSTEM SHALL** update error message colors without page reload

**WHEN** the dismiss button is hovered
**THE SYSTEM SHALL** use `colors.semantic.errorDark` for hover state

**WHEN** rendered
**THE SYSTEM SHALL** use design tokens for padding (`spacing.md`), border radius (`borders.radius.md`)

### Technical Implementation
```typescript
// Replace Tailwind classes with design tokens
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders } from '../../theme/tokens'

const themeColors = useThemeColors()

// Apply theme-aware colors
style={{
  backgroundColor: themeColors.semantic.errorLight,
  border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
  color: themeColors.semantic.error,
  padding: spacing.md,
  borderRadius: borders.radius.md,
}}
```

### Testing Requirements
- ✅ Component renders correctly in light theme
- ✅ Component renders correctly in dark theme
- ✅ Colors update when theme changes dynamically
- ✅ Contrast ratios meet WCAG 2.1 AA standards
- ✅ Existing functionality preserved (dismiss button)
- ✅ All existing tests continue to pass

**Priority**: HIGH
**Effort**: 2 story points
**Risk**: LOW

---

## US-TOKEN-002: Migrate LoadingSpinner to Design Tokens

**As a** user viewing the application in dark mode
**I want** loading spinners to use appropriate dark theme colors
**So that** loading indicators are visible and properly styled in both light and dark themes

### Current State
- Uses hardcoded Tailwind classes: `border-gray-200`, `border-t-blue-600`, `text-gray-600`
- No dark theme support
- Inconsistent with design system

### Acceptance Criteria (EARS Notation)

**WHEN** a loading spinner is displayed in light theme
**THE SYSTEM SHALL** use `colors.neutral[200]` for spinner base and `colors.primary.main` for spinner foreground

**WHEN** a loading spinner is displayed in dark theme
**THE SYSTEM SHALL** adjust colors to maintain visibility on dark backgrounds

**WHEN** the theme changes dynamically
**THE SYSTEM SHALL** update spinner colors without interrupting animation

**WHEN** the loading message is displayed
**THE SYSTEM SHALL** use `colors.text.secondary` for text color

**WHEN** rendered
**THE SYSTEM SHALL** use design tokens for spacing (`spacing.xs`, `spacing.sm`)

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography } from '../../theme/tokens'

const themeColors = useThemeColors()

// Spinner style
style={{
  borderColor: themeColors.neutral[200],
  borderTopColor: themeColors.primary.main,
}}

// Message style
style={{
  marginTop: spacing.sm,
  fontSize: typography.fontSize.sm,
  color: themeColors.text.secondary,
}}
```

### Testing Requirements
- ✅ Spinner renders correctly in light theme
- ✅ Spinner renders correctly in dark theme
- ✅ Animation continues smoothly during theme changes
- ✅ Size variants (small, medium, large) work correctly
- ✅ Loading message text is readable in both themes
- ✅ All existing tests continue to pass

**Priority**: HIGH
**Effort**: 2 story points
**Risk**: LOW

---

## US-TOKEN-003: Migrate ConfirmationModal to Design Tokens

**As a** user viewing the application in dark mode
**I want** confirmation modals to use appropriate dark theme colors
**So that** confirmation dialogs are readable and accessible in both light and dark themes

### Current State
- Likely uses hardcoded colors or Tailwind classes
- May not have dark theme support
- Critical user interaction component

### Acceptance Criteria (EARS Notation)

**WHEN** a confirmation modal is displayed in light theme
**THE SYSTEM SHALL** use `colors.background.primary` for modal background

**WHEN** a confirmation modal is displayed in dark theme
**THE SYSTEM SHALL** use dark theme background colors with proper contrast

**WHEN** the modal backdrop is rendered
**THE SYSTEM SHALL** use appropriate opacity overlay for both themes

**WHEN** action buttons are displayed
**THE SYSTEM SHALL** use Button component (already has design tokens)

**WHEN** modal text is displayed
**THE SYSTEM SHALL** use `colors.text.primary` for headings and `colors.text.secondary` for descriptions

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders, shadows, typography } from '../../theme/tokens'
import { Button } from './Button' // Already has design tokens

const themeColors = useThemeColors()

// Modal container
style={{
  backgroundColor: themeColors.background.primary,
  border: `${borders.width.thin} solid ${themeColors.border.default}`,
  borderRadius: borders.radius.lg,
  padding: spacing.xl,
  boxShadow: shadows.lg,
}}

// Modal heading
style={{
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  color: themeColors.text.primary,
}}
```

### Testing Requirements
- ✅ Modal renders correctly in light theme
- ✅ Modal renders correctly in dark theme
- ✅ Backdrop overlay works in both themes
- ✅ Keyboard navigation (Escape, Enter) works correctly
- ✅ Focus management maintained
- ✅ All existing tests continue to pass

**Priority**: HIGH
**Effort**: 2 story points
**Risk**: LOW

---

## US-TOKEN-004: Migrate Tabs to Design Tokens

**As a** user viewing the application in dark mode
**I want** tab navigation to use appropriate dark theme colors
**So that** tab interfaces are accessible and properly styled in both light and dark themes

### Current State
- Uses CSS modules (`Tabs.module.css`)
- No dark theme support in stylesheets
- Complex component with keyboard navigation

### Acceptance Criteria (EARS Notation)

**WHEN** tabs are displayed in light theme
**THE SYSTEM SHALL** use `colors.neutral[100]` for inactive tabs and `colors.primary.main` for active tab indicator

**WHEN** tabs are displayed in dark theme
**THE SYSTEM SHALL** adjust tab colors to maintain visibility and contrast

**WHEN** a tab is hovered (not disabled)
**THE SYSTEM SHALL** use `colors.neutral[50]` for hover background in light theme

**WHEN** a tab is focused via keyboard
**THE SYSTEM SHALL** use `colors.border.focus` for focus ring

**WHEN** a tab is disabled
**THE SYSTEM SHALL** use `colors.text.disabled` for text color

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders, typography } from '../../theme/tokens'

const themeColors = useThemeColors()

// Replace CSS modules with inline styles using design tokens
const tabStyle: React.CSSProperties = {
  padding: `${spacing.sm} ${spacing.lg}`,
  border: 'none',
  backgroundColor: 'transparent',
  color: themeColors.text.secondary,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.medium,
  cursor: 'pointer',
  borderBottom: `${borders.width.thick} solid transparent`,
  transition: 'all 0.2s ease',
}

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  color: themeColors.text.primary,
  borderBottomColor: themeColors.primary.main,
}
```

### Migration Strategy
1. Remove `Tabs.module.css` file
2. Convert all styles to inline styles using design tokens
3. Use `useThemeColors()` hook for dynamic colors
4. Preserve all keyboard navigation and accessibility features
5. Update tests to check for design token values

### Testing Requirements
- ✅ Tabs render correctly in light theme
- ✅ Tabs render correctly in dark theme
- ✅ Keyboard navigation (Arrow keys, Home, End) works correctly
- ✅ Active tab indicator visible in both themes
- ✅ Hover states work correctly
- ✅ Disabled tabs styled correctly
- ✅ All existing accessibility tests pass
- ✅ WCAG 2.1 AA contrast ratios maintained

**Priority**: MEDIUM
**Effort**: 3 story points (CSS modules → inline styles conversion)
**Risk**: LOW

---

## US-TOKEN-005: Migrate TabPanel to Design Tokens

**As a** user viewing the application in dark mode
**I want** tab panel content to use appropriate dark theme colors
**So that** tab content is readable and properly styled in both light and dark themes

### Current State
- Likely uses CSS modules (follows Tabs pattern)
- No dark theme support
- Companion component to Tabs

### Acceptance Criteria (EARS Notation)

**WHEN** tab panel content is displayed in light theme
**THE SYSTEM SHALL** use `colors.background.primary` for panel background

**WHEN** tab panel content is displayed in dark theme
**THE SYSTEM SHALL** use dark theme background colors

**WHEN** panel border is rendered
**THE SYSTEM SHALL** use `colors.border.default` for border color

**WHEN** content is rendered
**THE SYSTEM SHALL** use design tokens for padding and spacing

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders } from '../../theme/tokens'

const themeColors = useThemeColors()

const panelStyle: React.CSSProperties = {
  padding: spacing.xl,
  backgroundColor: themeColors.background.primary,
  border: `${borders.width.thin} solid ${themeColors.border.default}`,
  borderRadius: borders.radius.md,
}
```

### Testing Requirements
- ✅ Panel renders correctly in light theme
- ✅ Panel renders correctly in dark theme
- ✅ Panel shows/hides based on selected tab
- ✅ ARIA attributes maintained
- ✅ All existing tests continue to pass

**Priority**: MEDIUM
**Effort**: 2 story points
**Risk**: LOW
**Dependencies**: US-TOKEN-004 (Tabs migration)

---

## US-TOKEN-006: Migrate SubjectListItem to Design Tokens

**As a** user viewing the application in dark mode
**I want** subject list items to use appropriate dark theme colors
**So that** the subject list is readable and properly styled in both light and dark themes

### Current State
- May use inline styles or Tailwind classes
- SubjectList already uses design tokens, but ListItem may not

### Acceptance Criteria (EARS Notation)

**WHEN** a subject list item is displayed in light theme
**THE SYSTEM SHALL** use `colors.background.primary` for item background

**WHEN** a subject list item is hovered
**THE SYSTEM SHALL** use `colors.neutral[50]` for hover background in light theme

**WHEN** a subject list item is displayed in dark theme
**THE SYSTEM SHALL** adjust colors to maintain visibility and contrast

**WHEN** item borders are rendered
**THE SYSTEM SHALL** use `colors.border.default` for dividers

**WHEN** item text is rendered
**THE SYSTEM SHALL** use `colors.text.primary` for subject names and `colors.text.secondary` for metadata

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders, typography } from '../../theme/tokens'

const themeColors = useThemeColors()

const itemStyle: React.CSSProperties = {
  padding: spacing.lg,
  backgroundColor: themeColors.background.primary,
  borderBottom: `${borders.width.thin} solid ${themeColors.border.default}`,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
}

// Hover state (via onMouseEnter/onMouseLeave)
const hoverBackgroundColor = themeColors.neutral[50]
```

### Testing Requirements
- ✅ List items render correctly in light theme
- ✅ List items render correctly in dark theme
- ✅ Hover states work correctly
- ✅ Click actions preserved
- ✅ All existing tests continue to pass

**Priority**: MEDIUM
**Effort**: 2 story points
**Risk**: LOW

---

## US-TOKEN-007: Migrate SubjectEmptyState to Design Tokens

**As a** user viewing the application in dark mode
**I want** empty state messages to use appropriate dark theme colors
**So that** empty state screens are readable and properly styled in both light and dark themes

### Current State
- Likely uses Tailwind classes or inline styles
- Empty state shown when no subjects exist

### Acceptance Criteria (EARS Notation)

**WHEN** the empty state is displayed in light theme
**THE SYSTEM SHALL** use `colors.background.secondary` for container background

**WHEN** the empty state is displayed in dark theme
**THE SYSTEM SHALL** use dark theme background colors

**WHEN** empty state text is displayed
**THE SYSTEM SHALL** use `colors.text.tertiary` for hint text

**WHEN** empty state border is rendered
**THE SYSTEM SHALL** use dashed border with `colors.border.default`

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders, typography } from '../../theme/tokens'

const themeColors = useThemeColors()

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: spacing['2xl'],
  backgroundColor: themeColors.background.secondary,
  borderRadius: borders.radius.md,
  border: `${borders.width.thin} dashed ${themeColors.border.default}`,
}

const emptyTextStyle: React.CSSProperties = {
  fontSize: typography.fontSize.base,
  color: themeColors.text.tertiary,
}
```

### Testing Requirements
- ✅ Empty state renders correctly in light theme
- ✅ Empty state renders correctly in dark theme
- ✅ Text is readable in both themes
- ✅ All existing tests continue to pass

**Priority**: LOW
**Effort**: 1 story point
**Risk**: LOW

---

## US-TOKEN-008: Migrate CopyButton to Design Tokens

**As a** user viewing the application in dark mode
**I want** copy buttons to use appropriate dark theme colors
**So that** copy functionality is accessible and properly styled in both light and dark themes

### Current State
- Likely uses Tailwind classes or inline styles
- Utility button for copying text to clipboard

### Acceptance Criteria (EARS Notation)

**WHEN** the copy button is displayed in light theme
**THE SYSTEM SHALL** use Button component design tokens (already implemented)

**WHEN** the copy button shows "Copied!" feedback
**THE SYSTEM SHALL** use `colors.semantic.success` for success state text

**WHEN** the copy button is hovered
**THE SYSTEM SHALL** use appropriate hover colors from Button component

**WHEN** the copy icon is rendered
**THE SYSTEM SHALL** use `colors.text.secondary` for icon color

### Technical Implementation
```typescript
import { useThemeColors } from '../../hooks/useThemeColors'
import { Button } from './Button' // Already has design tokens

const themeColors = useThemeColors()

// Use Button component for main styling
<Button variant="secondary" onClick={handleCopy}>
  {copied ? (
    <span style={{ color: themeColors.semantic.success }}>
      ✓ Copied!
    </span>
  ) : (
    <span style={{ color: themeColors.text.secondary }}>
      📋 Copy
    </span>
  )}
</Button>
```

### Testing Requirements
- ✅ Button renders correctly in light theme
- ✅ Button renders correctly in dark theme
- ✅ Copy functionality works correctly
- ✅ Success feedback visible in both themes
- ✅ All existing tests continue to pass

**Priority**: LOW
**Effort**: 2 story points
**Risk**: LOW

---

## Success Metrics

### Technical Metrics
- **Design Token Coverage**: 100% of components use design tokens
- **Zero Hardcoded Colors**: No hex values or Tailwind classes in components
- **Test Coverage**: ≥90% code coverage maintained
- **Zero Visual Regressions**: All components look identical in light theme after migration

### User Experience Metrics
- **Theme Consistency**: All components update when theme changes
- **Accessibility**: 100% WCAG 2.1 AA contrast compliance in both themes
- **Performance**: Theme switching < 200ms latency
- **Zero Flickering**: Smooth theme transitions without visual artifacts

### Quality Metrics
- **Test Pass Rate**: 100% of existing tests continue to pass
- **Lint Compliance**: Zero linting errors or warnings
- **Type Safety**: Full TypeScript type coverage

---

## Implementation Strategy

### Phase 1: Critical Path (HIGH Priority)
**Duration**: 3-4 days
1. US-TOKEN-001: ErrorMessage ✅
2. US-TOKEN-002: LoadingSpinner ✅
3. US-TOKEN-003: ConfirmationModal ✅

**Deliverable**: All user-facing error and loading states support dark theme

### Phase 2: Navigation & Lists (MEDIUM Priority)
**Duration**: 3-4 days
4. US-TOKEN-004: Tabs ✅
5. US-TOKEN-005: TabPanel ✅
6. US-TOKEN-006: SubjectListItem ✅

**Deliverable**: All navigation and list components support dark theme

### Phase 3: Polish & Edge Cases (LOW Priority)
**Duration**: 2-3 days
7. US-TOKEN-007: SubjectEmptyState ✅
8. US-TOKEN-008: CopyButton ✅

**Deliverable**: 100% dark theme coverage across application

---

## Risk Assessment

### Low Risks
- **Pattern Established**: 25 components already migrated successfully
- **Clear Migration Path**: Migration guide exists and is proven
- **Infrastructure Complete**: Theme system fully operational
- **Test Coverage**: Comprehensive test suite catches regressions

### Potential Challenges
- **CSS Modules**: Tabs/TabPanel use CSS modules (requires more refactoring)
- **Regression Testing**: Need to verify no visual changes in light theme
- **Test Updates**: Some tests may check specific style values

### Mitigation Strategies
1. **Follow Established Pattern**: Use existing migrations as reference
2. **Incremental Approach**: Migrate one component at a time with full testing
3. **Visual Testing**: Screenshot comparison before/after in light theme
4. **Comprehensive Testing**: Run full test suite after each migration

---

## Dependencies

### Technical Dependencies
- ✅ Design token system (src/theme/tokens.ts) - COMPLETE
- ✅ useThemeColors hook - COMPLETE
- ✅ ThemeProvider context - COMPLETE
- ✅ Dark theme color definitions - COMPLETE

### Process Dependencies
- Migration guide (docs/design-system.md) - COMPLETE
- Test utilities with ThemeProvider wrapper - COMPLETE
- Linting configured for React Fast Refresh - COMPLETE

---

## Out of Scope (Future Enhancements)

- Custom theme builder (user-defined colors)
- Multiple dark theme variants (OLED, gray, blue)
- Per-component theme overrides
- Theme transition animations
- High contrast mode support

---

**Document Version**: 1.0
**Created**: 2025-11-18
**Author**: Principal Product Owner
**Status**: Ready for Review
**Next Steps**: Review with Frontend Engineer → Begin Implementation (Phase 1)
