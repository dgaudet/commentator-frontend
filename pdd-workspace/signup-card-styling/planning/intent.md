# Feature Intent: SignupPage Card Styling Alignment

**Feature Name**: Align SignupPage Card Styling with LoginPage
**Feature ID**: SIGNUP-CARD
**Date**: 2026-02-24
**Status**: PLANNING

---

## Problem Statement

The SignupPage and LoginPage components have inconsistent card styling:
- SignupPage uses `background.secondary` (light gray) while LoginPage uses `background.primary` (white)
- SignupPage card lacks the border present on LoginPage card
- Some SignupPage elements have hardcoded color values instead of theme tokens

This inconsistency creates visual confusion and doesn't fully leverage the design system.

---

## Business Value

✅ **Brand Consistency**: Ensures all authentication pages have unified visual design
✅ **User Confidence**: Consistent styling reinforces that pages are part of the same application
✅ **Maintainability**: Consolidates styling patterns for easier future updates
✅ **Design System Compliance**: Ensures full adoption of theme tokens across all pages

---

## Goals

1. **Visual Alignment**: Make SignupPage card styling identical to LoginPage
2. **Design System Compliance**: Replace all hardcoded color values with theme tokens
3. **Theme Support**: Ensure proper light/dark theme support across all styling
4. **Zero Regressions**: Maintain all existing functionality and tests

---

## Scope

### What's Included

✅ Update SignupPage card background color to `background.primary`
✅ Add 1px border using `border.default` theme token
✅ Audit and fix hardcoded colors in info boxes
✅ Ensure all styling uses design tokens
✅ Test in light and dark themes

### What's Not Included

❌ Redesigning the SignupPage layout or hero section
❌ Changes to form inputs or validation styling
❌ Mobile-specific refinements (keep current responsive behavior)
❌ Changes to other pages' styling

---

## User Stories

| ID | Title | Effort |
|----|-------|--------|
| SIGNUP-CARD-001 | Update card background to use theme primary | 5 min |
| SIGNUP-CARD-002 | Add border to card matching LoginPage | 10 min |
| SIGNUP-CARD-003 | Verify all styling uses design tokens | 30 min |

**Total**: 45 minutes - 1 hour

---

## Success Criteria

- ✅ SignupPage and LoginPage cards are visually identical
- ✅ All color values use theme tokens (no hardcoding)
- ✅ Light and dark themes both work correctly
- ✅ All 2,735+ tests pass
- ✅ Code review approval
- ✅ No visual regressions

---

## Complexity Assessment

**Level**: L0 (Atomic)
**Reasoning**: Single component styling refinement, < 1 day effort, no architecture needed, very low risk
**Planning Depth**: Minimal (just user stories, no PRD or epics)
**Architecture Required**: No

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Visual regression | Very Low | Low | Test in both themes, visual inspection |
| Theme token mismatch | Very Low | Low | Use exact tokens from design system |
| Browser compatibility | Very Low | Low | Standard CSS, widely supported |
| Form interaction issues | Very Low | Low | Run existing test suite |

---

## Timeline

- **Planning**: Complete (this document)
- **Implementation**: 1 hour (single developer, TDD approach)
- **Testing**: Included in implementation (< 30 min)
- **Review**: < 15 min

**Total**: ~1.5 hours from start to merge

---

## Related Features

- `auth0-universal-login-l1` - Base authentication system
- `user-registration` - SignupPage functional implementation
- `complete-dark-theme` - Dark theme infrastructure
- `ui-consistency-phase2` - Overall UI consistency initiative

---

## Notes

- This story builds on the design system already implemented in LoginPage
- No new components or patterns required - just styling alignment
- Can be picked up by any frontend engineer as a quick win
- Good opportunity to demonstrate design system adoption
