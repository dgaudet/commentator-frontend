# User Stories: Auth0 Universal Login Level 2 - Advanced Theme Customization

**Scope**: Extended customization of Auth0 Universal Login using design tokens and dark theme support
**Target**: Match app branding across light and dark modes
**Format**: EARS (Event, Action, Result) with acceptance criteria
**Design Tokens Reference**: See `/src/hooks/useThemeColors.ts` and `/src/theme/__tests__/tokens.test.ts`

---

## Story 1: Customize Button Colors with Theme Tokens

**Title**: Login button should use primary theme color for better branding consistency

**User Story**:
```
AS A product owner
I WANT the Auth0 Universal Login button to match our primary brand color (#0066FF)
SO THAT the login experience feels cohesive with the rest of the app
```

**EARS Format**:
- WHEN user views the Auth0 Universal Login page in light mode
- THE SYSTEM SHALL display the login button with primary color (#0066FF)
- AND button hover state shall use primary-dark (#0052CC)
- AND THE SYSTEM SHALL maintain contrast ratio ≥ 4.5:1 for accessibility
- WHEN user switches to dark mode
- THE SYSTEM SHALL display button with primary-light (#3D8BFF)
- AND button hover state shall use primary color (#0066FF)

**Acceptance Criteria**:
- [ ] Auth0 Dashboard: Primary button color set to `#0066FF` (design token: `primary.main`)
- [ ] Auth0 Dashboard: Button hover color set to `#0052CC` (design token: `primary.dark`)
- [ ] Dark theme: Primary button color adjusted to `#3D8BFF` (design token: `primary.light`)
- [ ] WCAG 2.1 AA contrast ratio verified for all button states (light: 4.9:1, dark: 4.5:1)
- [ ] Button text remains readable on both light and dark backgrounds
- [ ] Configuration persists after Auth0 Dashboard save
- [ ] Changes apply to all auth flows (login, signup, MFA, password reset)

**Design Token Mapping**:
- Light mode button: `colors.primary.main` = `#0066FF`
- Light mode hover: `colors.primary.dark` = `#0052CC`
- Dark mode button: `darkColors.primary.light` = `#3D8BFF`
- Dark mode hover: `darkColors.primary.main` = `#0066FF`

**Implementation Notes**:
- Auth0 Dashboard allows custom button colors via Customization Options
- Consider creating Auth0 theme JSON for dark mode variant
- Test with auth0-spa-js to verify theme switching

**Test Scenarios**:
- [ ] Light mode: Button renders with `#0066FF` background
- [ ] Light mode: Button hover shows `#0052CC` background
- [ ] Dark mode: Button renders with `#3D8BFF` background
- [ ] Dark mode: Button hover shows `#0066FF` background
- [ ] Contrast ratios validated programmatically
- [ ] Color transitions smooth between modes

---

## Story 2: Customize Input Field Borders with Theme Tokens

**Title**: Login form inputs should use design token borders for consistency

**User Story**:
```
AS A designer
I WANT input fields on the Auth0 login page to match our design system
SO THAT the form feels integrated with the rest of the app
```

**EARS Format**:
- WHEN user focuses on an input field
- THE SYSTEM SHALL display a border using focus color (#0066FF)
- AND border width shall be 2px
- AND border radius shall be 8px
- WHEN input is not focused
- THE SYSTEM SHALL display a subtle border (#E5E7EB)
- AND border width shall be 1px
- WHEN input contains an error
- THE SYSTEM SHALL display error border (#DC2626)
- AND error background shall use errorLight (#FEE2E2)

**Acceptance Criteria**:
- [ ] Default input border: `1px solid #E5E7EB` (design token: `border.width.thin` + `border.default`)
- [ ] Focused input border: `2px solid #0066FF` (design token: `border.width.thick` + `border.focus`)
- [ ] Focused border padding adjustment: `-1px` to maintain layout
- [ ] Error input border: `2px solid #DC2626` (design token: `border.error`)
- [ ] Error background: `#FEE2E2` (design token: `semantic.errorLight`)
- [ ] Border radius: `8px` (design token: `radius.md`)
- [ ] Dark mode: Borders adjusted for contrast
  - Default border: `#374151` (neutral[700])
  - Focused border: `#3D8BFF` (primary.light)
  - Error border: `#F87171` (error adjusted for dark)
- [ ] Transition effect smooth (200-300ms)
- [ ] Works on email, password, and custom fields

**Design Token Mapping**:
```typescript
// Light mode
input: {
  border: `${borders.width.thin} solid ${colors.border.default}`,
  borderRadius: borders.radius.md,
}

input:focus {
  border: `${borders.width.thick} solid ${colors.border.focus}`,
  padding: '10px -1px', // Adjust for thicker border
}

input:error {
  border: `${borders.width.thick} solid ${colors.semantic.error}`,
  backgroundColor: colors.semantic.errorLight,
}

// Dark mode
input: {
  border: `${borders.width.thin} solid ${darkColors.border.default}`,
}

input:focus {
  border: `${borders.width.thick} solid ${darkColors.border.focus}`,
}
```

**Implementation Notes**:
- Auth0 CSS customization required (custom HTML/CSS approach)
- Create CSS override file for Auth0 themes
- Consider using CSS custom properties for easy switching
- Test with various input types (text, password, email)

**Test Scenarios**:
- [ ] Default state: 1px gray border visible
- [ ] Focus state: 2px blue border, no layout shift
- [ ] Error state: 2px red border with light red background
- [ ] Dark mode: All borders contrast verified
- [ ] Tab navigation: Focus border visible
- [ ] Auto-fill state: Borders remain visible

---

## Story 3: Customize Form Background with Dark Theme Support

**Title**: Login form background should adapt to user's dark mode preference

**User Story**:
```
AS A user in dark mode
I WANT the Auth0 login page to respect my theme preference
SO THAT I'm not blinded by a bright login page at night
```

**EARS Format**:
- WHEN user is in light mode
- THE SYSTEM SHALL display login form with white background (#FFFFFF)
- AND page background shall be light gray (#F9FAFB)
- WHEN user switches to dark mode
- THE SYSTEM SHALL display login form with dark background (#1F2937)
- AND page background shall be darker (#111827)
- AND text contrast adjusted for readability
- WHEN user's system preference changes
- THE SYSTEM SHALL automatically update theme (if not manually overridden)

**Acceptance Criteria**:
- [ ] Light mode form background: `#FFFFFF` (design token: `background.primary`)
- [ ] Light mode page background: `#F9FAFB` (design token: `background.secondary`)
- [ ] Dark mode form background: `#1F2937` (design token: neutral[800])
- [ ] Dark mode page background: `#111827` (design token: neutral[900])
- [ ] Card/form container shadow adjusted for dark mode:
  - Light: `0 1px 3px rgba(0, 0, 0, 0.1)` (design token: `shadows.md`)
  - Dark: `0 1px 3px rgba(255, 255, 255, 0.05)` (inverted shadow)
- [ ] All text remains readable (contrast ≥ 4.5:1)
- [ ] Dark mode persists with `prefers-color-scheme` media query
- [ ] Manual theme toggle respected
- [ ] Smooth transition between modes (300ms)

**Design Token Mapping**:
```typescript
// Light mode
background: {
  page: colors.background.secondary, // #F9FAFB
  form: colors.background.primary,   // #FFFFFF
  shadow: shadows.md,                // 0 1px 3px rgba(0,0,0,0.1)
  text: colors.text.primary,         // #111827
}

// Dark mode
background: {
  page: darkColors.neutral[900],     // #111827
  form: darkColors.neutral[800],     // #1F2937
  shadow: '0 1px 3px rgba(255,255,255,0.05)',
  text: darkColors.text.primary,     // #F9FAFB or similar
}
```

**Implementation Notes**:
- Requires custom Auth0 HTML template (not just CSS)
- Use CSS custom properties for theme variables
- Detect `prefers-color-scheme` with JavaScript fallback
- Store user preference in localStorage
- Create separate Auth0 theme JSON for dark variant

**Test Scenarios**:
- [ ] Light mode: Form renders with white background
- [ ] Dark mode: Form renders with dark background
- [ ] Theme switch: Background changes smoothly
- [ ] System preference: Auto-applies when set
- [ ] Manual override: User choice persists
- [ ] Contrast: All text readable in both modes
- [ ] Mobile: Works on responsive layout

---

## Story 4: Customize Text Colors with Theme Tokens

**Title**: Login form text colors should align with design tokens for consistency

**User Story**:
```
AS A developer
I WANT all Auth0 login text to use the same color tokens as the app
SO THAT the design system is consistently applied everywhere
```

**EARS Format**:
- WHEN user views login form labels
- THE SYSTEM SHALL display labels using primary text color (#111827)
- AND with font-weight: 600 (semibold)
- WHEN user views helper text or hints
- THE SYSTEM SHALL display in secondary text color (#374151)
- AND font-weight: 400 (normal)
- WHEN user views error messages
- THE SYSTEM SHALL display in error color (#DC2626)
- AND background in errorLight (#FEE2E2)
- WHEN form has disabled state
- THE SYSTEM SHALL display in disabled text color (#9CA3AF)

**Acceptance Criteria**:
- [ ] Form labels: Color `#111827` (design token: `text.primary`), weight `600` (design token: `fontWeight.semibold`)
- [ ] Helper text: Color `#374151` (design token: `text.secondary`), weight `400` (design token: `fontWeight.normal`)
- [ ] Error messages: Color `#DC2626` (design token: `semantic.error`)
- [ ] Error background: Color `#FEE2E2` (design token: `semantic.errorLight`)
- [ ] Placeholder text: Color `#9CA3AF` (design token: `text.tertiary`)
- [ ] Disabled text: Color `#9CA3AF` (design token: `text.disabled`)
- [ ] Dark mode text colors:
  - Primary: `#F9FAFB` or similar (high contrast on dark)
  - Secondary: `#D1D5DB` (design token: neutral[300])
  - Disabled: `#6B7280` (design token: neutral[500])
  - Error: `#F87171` (error-light for dark mode)
- [ ] All text sizes match design system (base: 1rem, sm: 0.875rem)
- [ ] Line-height consistent (normal: 1.5)

**Design Token Mapping**:
```typescript
// Light mode
typography: {
  label: { color: colors.text.primary, fontWeight: typography.fontWeight.semibold },
  helper: { color: colors.text.secondary, fontWeight: typography.fontWeight.normal },
  error: { color: colors.semantic.error, backgroundColor: colors.semantic.errorLight },
  placeholder: { color: colors.text.tertiary },
  disabled: { color: colors.text.disabled },
}

// Dark mode
typography: {
  label: { color: darkColors.text.primary, fontWeight: typography.fontWeight.semibold },
  helper: { color: darkColors.text.secondary, fontWeight: typography.fontWeight.normal },
  error: { color: '#F87171', backgroundColor: darkColors.semantic.errorLight },
}
```

**Implementation Notes**:
- Update Auth0 custom HTML template
- Use CSS classes with design token variables
- Test font rendering across browsers
- Verify accessibility with color-blind simulator

**Test Scenarios**:
- [ ] Labels display with correct color and weight
- [ ] Helper text subordinate but readable
- [ ] Error text stands out (4.5:1 contrast minimum)
- [ ] Placeholder text subtle
- [ ] Disabled state clearly differentiated
- [ ] Dark mode: All colors verify contrast

---

## Story 5: Customize Border Radius and Focus States

**Title**: Login form should use consistent border radius and focus indicators

**User Story**:
```
AS A user navigating with keyboard
I WANT clear, visible focus indicators on the login form
SO THAT I can easily navigate and know which field is focused
```

**EARS Format**:
- WHEN user focuses on any form element
- THE SYSTEM SHALL display a 2px focus ring around element
- AND focus ring color shall be primary color (#0066FF)
- AND ring shall have 2px offset from element border
- WHEN element has rounded corners
- THE SYSTEM SHALL use 8px border radius
- AND focus ring shall follow shape
- WHEN element is keyboard-focused (not mouse)
- THE SYSTEM SHALL use bold focus ring (2px)
- WHEN user clicks with mouse
- THE SYSTEM SHALL show subtle focus ring (1px)

**Acceptance Criteria**:
- [ ] Focus ring width: `2px` (design token: `border.width.thick`)
- [ ] Focus ring color: `#0066FF` (design token: `border.focus`)
- [ ] Focus ring offset: `2px` (design token: `spacing.sm`)
- [ ] Border radius buttons: `8px` (design token: `radius.md`)
- [ ] Border radius inputs: `8px` (design token: `radius.md`)
- [ ] Border radius links: `4px` (design token: `radius.sm`)
- [ ] Dark mode focus ring: `#3D8BFF` (design token: `primary.light`)
- [ ] Focus ring visible in all browsers (Chrome, Firefox, Safari)
- [ ] No focus outline conflicts (remove browser defaults)
- [ ] Keyboard navigation clearly visible
- [ ] Tab order logical (top-to-bottom, left-to-right)

**Design Token Mapping**:
```typescript
// Light mode focus ring
element:focus {
  outline: 'none',
  boxShadow: `0 0 0 2px ${colors.background.primary}, 0 0 0 4px ${colors.border.focus}`,
  borderRadius: borders.radius.md,
}

// Dark mode
element:focus {
  boxShadow: `0 0 0 2px ${darkColors.background.primary}, 0 0 0 4px ${darkColors.border.focus}`,
}
```

**Implementation Notes**:
- Create custom focus ring styles in Auth0 CSS override
- Remove browser default focus outlines
- Use `box-shadow` for visible focus ring
- Test keyboard navigation thoroughly
- Use `:focus-visible` for keyboard-only focus

**Test Scenarios**:
- [ ] Tab key navigates all focusable elements
- [ ] Focus ring visible on all fields
- [ ] Focus ring color matches design token
- [ ] Focus ring offset correct
- [ ] Keyboard tab order logical
- [ ] Mouse click shows subtle focus
- [ ] Dark mode focus ring visible
- [ ] Screen reader announces focus

---

## Story 6: Customize Error State Colors and Styling

**Title**: Error messages should use semantic error tokens for consistency

**User Story**:
```
AS A user making a login error
I WANT error messages to be clearly visible and consistent
SO THAT I understand what went wrong
```

**EARS Format**:
- WHEN login form has validation error
- THE SYSTEM SHALL display error message below field
- AND error text color shall be error red (#DC2626)
- AND background shall be light error (#FEE2E2)
- AND error icon shall display
- AND input border shall be error red (#DC2626)
- WHEN error is resolved
- THE SYSTEM SHALL remove error styling
- AND restore normal field styling

**Acceptance Criteria**:
- [ ] Error message text color: `#DC2626` (design token: `semantic.error`)
- [ ] Error background color: `#FEE2E2` (design token: `semantic.errorLight`)
- [ ] Error border color: `#DC2626` (design token: `semantic.error`)
- [ ] Error border width: `2px` (design token: `border.width.thick`)
- [ ] Error padding: `12px` (design token: `spacing.lg`)
- [ ] Error border radius: `8px` (design token: `radius.md`)
- [ ] Error icon included (Material Symbols: error_outline or similar)
- [ ] Icon color: `#DC2626` (design token: `semantic.error`)
- [ ] Dark mode error text: `#F87171` (adjusted for contrast)
- [ ] Dark mode error background: `#7F1D1D` or similar (darker red)
- [ ] Contrast ratio: ≥ 4.5:1 (light & dark)
- [ ] Assistive text: Error message included for screen readers
- [ ] Error clears on input change or form reset

**Design Token Mapping**:
```typescript
// Light mode error
errorState: {
  textColor: colors.semantic.error,        // #DC2626
  backgroundColor: colors.semantic.errorLight, // #FEE2E2
  borderColor: colors.semantic.error,      // #DC2626
  borderWidth: borders.width.thick,        // 2px
  borderRadius: borders.radius.md,         // 8px
  padding: spacing.lg,                     // 1rem
}

// Dark mode error
errorState: {
  textColor: '#F87171',
  backgroundColor: darkColors.semantic.errorLight,
  borderColor: '#F87171',
}
```

**Implementation Notes**:
- Update Auth0 error response styling
- Display field-level error messages
- Include icon for visual reinforcement
- Announce errors to screen readers
- Allow clearing errors on input change

**Test Scenarios**:
- [ ] Invalid email shows error
- [ ] Weak password shows error
- [ ] Missing field shows error
- [ ] Error message displays correctly
- [ ] Error colors match design tokens
- [ ] Error clears when field corrected
- [ ] Dark mode errors visible
- [ ] Screen reader announces error

---

## Story 7: Implement CSS Custom Properties for Dynamic Theme Switching

**Title**: Auth0 login should use CSS custom properties for real-time theme switching

**User Story**:
```
AS A developer
I WANT to use CSS custom properties for Auth0 theming
SO THAT theme changes can be applied dynamically without page reload
```

**EARS Format**:
- WHEN app loads
- THE SYSTEM SHALL create CSS custom properties for all design tokens
- AND apply them to Auth0 custom HTML element
- WHEN user switches theme
- THE SYSTEM SHALL update all CSS custom properties
- AND Auth0 form updates theme in real-time
- WHEN user's system preference changes
- THE SYSTEM SHALL detect change and update tokens
- AND persist user preference in localStorage

**Acceptance Criteria**:
- [ ] CSS custom properties defined for all colors:
  - `--color-primary-main: #0066FF`
  - `--color-primary-dark: #0052CC`
  - `--color-primary-light: #3D8BFF`
  - `--color-semantic-error: #DC2626`
  - `--color-background-primary: #FFFFFF`
  - etc.
- [ ] CSS custom properties defined for typography:
  - `--font-size-base: 1rem`
  - `--font-weight-semibold: 600`
  - etc.
- [ ] CSS custom properties defined for spacing:
  - `--spacing-sm: 0.5rem`
  - `--spacing-md: 0.75rem`
  - `--spacing-lg: 1rem`
  - etc.
- [ ] CSS custom properties defined for borders:
  - `--border-radius-md: 8px`
  - `--border-width-thick: 2px`
  - etc.
- [ ] Dark mode variants prefixed with `--dark-`:
  - `--dark-color-primary-main: #3D8BFF`
  - etc.
- [ ] Variables scoped to `:root` or `.auth0-login` element
- [ ] Real-time switching works in browser DevTools
- [ ] Persists across page reloads

**Implementation Notes**:
- Create `auth0-theme-vars.css` with all custom properties
- Update Auth0 custom HTML to reference variables
- Create JavaScript function to switch themes
- Detect `prefers-color-scheme` with matchMedia API
- Store preference in `localStorage`

**Test Scenarios**:
- [ ] CSS variables load with app
- [ ] Variables accessible in DevTools
- [ ] Theme switch updates all variables
- [ ] Dark mode variables applied correctly
- [ ] Changes immediate (no delay)
- [ ] Persists across refresh
- [ ] System preference detected

---

## Implementation Dependencies

These stories depend on:
1. ✅ **Story 1 (L1)**: Remove Legacy Lock Widget (COMPLETE)
2. ✅ **Story 2 (L1)**: Implement Universal Login Flow (COMPLETE)
3. ✅ **Story 3 (L1)**: Handle Authentication Callback (COMPLETE)
4. ✅ **Story 4 (L1)**: Configure Dashboard Branding (COMPLETE)

## Recommended Implementation Order

**Phase 1: Dashboard Configuration** (Highest ROI, Lowest effort)
- Story 1: Button colors
- Story 3: Form backgrounds
- Story 4: Text colors

**Phase 2: CSS Customization** (Medium effort, Medium ROI)
- Story 2: Input borders
- Story 5: Focus states
- Story 6: Error styling

**Phase 3: Advanced Theming** (Highest effort, High ROI)
- Story 7: CSS custom properties

## Complexity Assessment

- **L0 (Atomic)**: Story 1 - Button colors (30 min, dashboard config only)
- **L1 (Micro)**: Stories 1-4 combined (4-6 hours, mostly dashboard + basic CSS)
- **L2 (Small)**: Stories 1-6 (6-12 hours, includes custom Auth0 HTML template)
- **L3 (Medium)**: All 7 stories + CSS variable system (12-20 hours, full theme system)

## Success Metrics

- [ ] Auth0 login page matches app theme tokens in light mode
- [ ] Dark mode fully supported with proper contrast ratios
- [ ] Focus indicators visible and accessible for keyboard users
- [ ] Error states clear and actionable
- [ ] Theme switching responsive and persistent
- [ ] WCAG 2.1 AA compliance verified
- [ ] No custom CSS conflicts with Auth0 SDK
- [ ] Works across all supported browsers

---

**Created**: 2026-02-22
**Status**: READY FOR PRODUCT OWNER REVIEW
**Next Step**: Prioritize stories and create implementation tasks
