# SignupPage Card Styling Alignment - User Stories

**Feature**: Align SignupPage Card Styling with LoginPage
**Complexity**: L0 (Atomic)
**Estimated Effort**: 0.5-1 hour
**Priority**: Medium

---

## Story 1: Update SignupPage Card Background to Use Theme Primary

**Story ID**: SIGNUP-CARD-001

**As a** user
**I want** the SignupPage card to use the same background color as LoginPage
**So that** both pages have a consistent visual appearance

### Acceptance Criteria

- [ ] SignupPage `.formWrapper` background changed from `background.secondary` to `background.primary`
- [ ] Card appears with white/light background (matching LoginPage visual design)
- [ ] Styling works correctly in both light theme and dark theme modes
- [ ] Visual consistency verified and matches LoginPage card appearance
- [ ] All existing component tests continue to pass
- [ ] No console errors or warnings

### Technical Implementation Notes

**File**: `src/pages/SignupPage.tsx`

Change the `formWrapperStyle` in SignupPage.tsx:

```typescript
// Current (BEFORE):
const formWrapperStyle = useMemo(() => ({
  backgroundColor: themeColors.background.secondary,
  boxShadow: shadows.lg,
  padding: spacing.xl,
}), [themeColors])

// Updated (AFTER):
const formWrapperStyle = useMemo(() => ({
  backgroundColor: themeColors.background.primary,
  boxShadow: shadows.lg,
  padding: spacing.xl,
}), [themeColors])
```

### Testing

- Verify card background color in light theme (should be white #FFFFFF)
- Verify card background color in dark theme (should be dark)
- Compare side-by-side with LoginPage card styling
- Ensure no regressions in form visibility or readability

---

## Story 2: Add Border to SignupPage Card to Match LoginPage

**Story ID**: SIGNUP-CARD-002

**As a** user
**I want** the SignupPage card to have a border like LoginPage
**So that** both pages have consistent card styling and visual hierarchy

### Acceptance Criteria

- [ ] SignupPage `.formWrapper` now includes 1px border using theme tokens
- [ ] Border color is `border.default` (matching LoginPage design)
- [ ] Border styling matches LoginPage: `1px solid themeColors.border.default`
- [ ] Border displays correctly on light theme and dark theme
- [ ] Cards visually align across both pages (LoginPage and SignupPage)
- [ ] All component tests pass
- [ ] Visual regression testing shows no unintended side effects

### Technical Implementation Notes

**File**: `src/pages/SignupPage.tsx`

Add border to the `formWrapperStyle` in SignupPage.tsx (requires importing `borders` token):

```typescript
// Import statement - add 'borders' to imports:
import { spacing, typography, shadows, borders } from '../theme/tokens'

// Update formWrapperStyle:
const formWrapperStyle = useMemo(() => ({
  backgroundColor: themeColors.background.primary,
  boxShadow: shadows.lg,
  border: `${borders.width.thin} solid ${themeColors.border.default}`,
  padding: spacing.xl,
}), [themeColors])
```

### Testing

- Verify border appears on card in light theme (should be #E5E7EB per design tokens)
- Verify border appears on card in dark theme
- Compare border styling with LoginPage card border
- Ensure border doesn't affect form input focus states or functionality
- Check that border is visible at all breakpoints (mobile, tablet, desktop)

---

## Story 3: Verify All SignupPage Styling Uses Design Tokens

**Story ID**: SIGNUP-CARD-003

**As a** developer
**I want** to ensure SignupPage uses only theme tokens (no hardcoded color values)
**So that** the page properly supports light/dark themes and respects design system

### Acceptance Criteria

- [ ] All color values use `themeColors.*` tokens (no hex #XXXXXX or rgb() hardcoding)
- [ ] All spacing uses `spacing.*` tokens where possible
- [ ] All typography uses `typography.*` tokens for fonts
- [ ] All shadows use `shadows.*` tokens
- [ ] Review all inline styles in SignupPage.tsx (especially lines 78-116 for info boxes)
- [ ] Replace any hardcoded colors with appropriate theme tokens
- [ ] Component maintains visual appearance across light and dark themes
- [ ] All tests pass with no regressions

### Technical Implementation Notes

**File**: `src/pages/SignupPage.tsx`

**Areas to Review** (hardcoded values that should use tokens):

1. **Info boxes on hero section** (lines 78-116):
   - `backgroundColor: 'rgba(255, 255, 255, 0.95)'` → Review for token
   - `color: themeColors.primary.main` ✓ Already using token (correct)
   - `boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'` → Consider using `shadows.*` token
   - `borderRadius: '8px'` → Verify against design token values
   - `fontWeight: '600'` → Check `typography.fontWeight.semibold`

2. **Hardcoded values to replace**:
   - Background colors should use `themeColors.background.*` or `themeColors.semantic.*`
   - Text colors should use `themeColors.text.*` or `themeColors.primary.*`
   - Shadows should use `shadows.sm`, `shadows.md`, `shadows.lg`

### Testing

- Run full test suite to verify no regressions
- Manually verify light theme styling is correct
- Manually verify dark theme styling is correct
- Ensure info box text is readable on hero image in both themes
- Check color contrast meets WCAG standards

---

## Story Summary

| Story | Description | Effort | Risk |
|-------|-------------|--------|------|
| SIGNUP-CARD-001 | Change card background to primary | 5 min | Very Low |
| SIGNUP-CARD-002 | Add border to card | 10 min | Very Low |
| SIGNUP-CARD-003 | Audit and fix hardcoded colors | 30 min | Very Low |

**Total Estimated Effort**: 45 minutes - 1 hour

---

## Success Metrics

✅ SignupPage and LoginPage cards are visually identical
✅ Both pages support light/dark themes correctly
✅ 100% of color/spacing values use design tokens
✅ All 2,735+ tests pass
✅ No visual regressions
✅ Code follows design system patterns

---

## Dependencies

- Design tokens system (src/theme/tokens)
- Theme colors hook (src/hooks/useThemeColors)
- LoginPage styling reference (src/pages/LoginPage.tsx)

---

## Notes

- This is an L0 (atomic) task - can be completed in a single short sprint
- No architecture or complex design decisions required
- Straightforward styling updates with low risk of side effects
- Can be implemented with TDD approach for regression testing
