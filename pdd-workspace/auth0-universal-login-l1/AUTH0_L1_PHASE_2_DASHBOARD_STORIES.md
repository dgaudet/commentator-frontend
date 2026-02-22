# User Stories: Auth0 Universal Login Phase 1.2 - Dashboard Customization

**Scope**: Configure Auth0 Dashboard branding to match app design tokens
**Effort**: 45 minutes total (dashboard configuration only, no code)
**Format**: EARS (Event, Action, Result) with dashboard steps
**Status**: Ready to execute immediately

---

## Story 1: Configure Button Colors with Design Tokens

**Title**: Set Auth0 login button to primary brand color (#0066FF)

**User Story**:
```
AS A product owner
I WANT the Auth0 Universal Login button to display in our primary brand color
SO THAT users recognize it as part of our branded experience
```

**EARS Format**:
- WHEN user navigates to Auth0 Universal Login page
- THE SYSTEM SHALL display login button in primary color (#0066FF)
- AND button hover state shall display in primary-dark (#0052CC)
- AND button remains readable against page background
- AND branding persists across all auth flows (login, signup, password reset)

**Acceptance Criteria**:
- [ ] Auth0 Dashboard: Branding → Universal Login → Customization tab opened
- [ ] Primary Button Color field set to: `#0066FF`
- [ ] Color saved successfully
- [ ] Login page refreshed and verified in test tenant
- [ ] Button color matches design token `primary.main`
- [ ] Changes apply to:
  - [ ] Login page button
  - [ ] Sign up page button
  - [ ] Password reset button
  - [ ] MFA page button
- [ ] Settings persisted after save
- [ ] No console errors on login page

**Design Token Reference**:
```
App Design Token: colors.primary.main = #0066FF
Auth0 Config: Primary Button Color = #0066FF
```

**Dashboard Steps**:
1. Log in to Auth0 Dashboard (https://manage.auth0.com)
2. Navigate to: **Branding** → **Universal Login**
3. Click: **Customization Options** tab
4. Find: "Primary Button Color" field
5. Enter: `#0066FF`
6. Click: **Save** button
7. Test: Visit Universal Login test page to verify

**Verification**:
- [ ] Button displays in blue (#0066FF) on login page
- [ ] Button is clearly clickable and readable
- [ ] Color matches design system primary token
- [ ] Works in light and dark browser modes

**Testing Steps**:
1. Open Auth0 Dashboard
2. Go to Applications → Test Application
3. Click "Try" → "Initiate Login Flow"
4. Verify button color is #0066FF
5. Screenshot for documentation

**Related Links**:
- [Auth0 Customization Options](https://auth0.com/docs/customize/login-pages/universal-login/customize-themes)
- App Design Tokens: `/src/hooks/useThemeColors.ts`

**Success Criteria**:
✅ Button renders in correct color
✅ Color persists after page refresh
✅ Works across all auth flows
✅ Improves brand recognition on login page

---

## Story 2: Configure Form Background to Match App Theme

**Title**: Set Auth0 login form background to light gray (#F9FAFB)

**User Story**:
```
AS A user
I WANT the Auth0 login page background to match the rest of the app
SO THAT the login experience feels cohesive and intentional
```

**EARS Format**:
- WHEN user navigates to Auth0 Universal Login page
- THE SYSTEM SHALL display page background in light gray (#F9FAFB)
- AND form container background shall be white (#FFFFFF)
- AND colors create clear visual hierarchy
- AND text remains readable (contrast ≥ 4.5:1)

**Acceptance Criteria**:
- [ ] Auth0 Dashboard: Branding → Universal Login → Customization tab opened
- [ ] Page Background Color field set to: `#F9FAFB`
- [ ] Form/Widget Background Color field set to: `#FFFFFF`
- [ ] Colors saved successfully
- [ ] Login page refreshed and colors verified
- [ ] Background colors match design tokens:
  - [ ] Page background: `background.secondary` = `#F9FAFB`
  - [ ] Form background: `background.primary` = `#FFFFFF`
- [ ] Text contrast meets WCAG 2.1 AA (≥4.5:1)
- [ ] No visual conflicts or rendering issues

**Design Token Reference**:
```
Page Background Token: colors.background.secondary = #F9FAFB
Form Background Token: colors.background.primary = #FFFFFF
```

**Dashboard Steps**:
1. Log in to Auth0 Dashboard
2. Navigate to: **Branding** → **Universal Login**
3. Click: **Customization Options** tab
4. Find: "Page Background Color" field
5. Enter: `#F9FAFB`
6. Find: "Widget Background Color" field
7. Enter: `#FFFFFF`
8. Click: **Save** button
9. Test: Verify on Universal Login test page

**Verification**:
- [ ] Page background displays as light gray (#F9FAFB)
- [ ] Form box displays as white (#FFFFFF)
- [ ] Clear visual hierarchy visible
- [ ] Form stands out from page background
- [ ] Text readable on all backgrounds

**Testing Steps**:
1. Open Auth0 Dashboard
2. Go to Applications → Test Application
3. Click "Try" → "Initiate Login Flow"
4. Take screenshot showing page and form backgrounds
5. Verify no white-on-white or gray-on-gray text

**Contrast Verification**:
- Page Background: #F9FAFB
- Text Color: #111827 (primary text)
- Contrast Ratio: 16.7:1 ✅ (exceeds 4.5:1 requirement)

**Related Links**:
- [Auth0 Customization Options](https://auth0.com/docs/customize/login-pages/universal-login/customize-themes)
- App Design Tokens: `/src/theme/__tests__/tokens.test.ts`

**Success Criteria**:
✅ Backgrounds match design tokens
✅ Form clearly defined against page
✅ Professional appearance maintained
✅ Contrast meets accessibility standards

---

## Story 3: Configure Font Family and Text Styling

**Title**: Set Auth0 login form font to match app typography

**User Story**:
```
AS A designer
I WANT the Auth0 login form fonts to match the app's typography system
SO THAT the entire user experience feels designed as one cohesive product
```

**EARS Format**:
- WHEN user views Auth0 Universal Login page
- THE SYSTEM SHALL display text using app font family (Inter)
- AND font sizes appropriate to content hierarchy
- AND font weights match app design system
- AND text is readable and professional

**Acceptance Criteria**:
- [ ] Auth0 Dashboard: Branding → Universal Login → Customization tab opened
- [ ] Font URL field set to: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`
- [ ] Font Family field set to: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- [ ] Settings saved successfully
- [ ] Login page fonts verified as Inter
- [ ] Typography hierarchy preserved:
  - [ ] Headings: Semibold (600)
  - [ ] Body text: Normal (400)
  - [ ] Labels: Medium (500)
- [ ] Fonts load without blocking page render
- [ ] Fallback fonts work if Google Fonts unavailable

**Design Token Reference**:
```
Font Family: Inter (matches app)
Font Weights Available:
  - Normal: 400 (typography.fontWeight.normal)
  - Medium: 500 (typography.fontWeight.medium)
  - Semibold: 600 (typography.fontWeight.semibold)
  - Bold: 700 (typography.fontWeight.bold)
```

**Dashboard Steps**:
1. Log in to Auth0 Dashboard
2. Navigate to: **Branding** → **Universal Login**
3. Click: **Customization Options** tab
4. Find: "Font URL" field
5. Enter: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`
6. Find: "Font Family" field
7. Enter: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
8. Click: **Save** button
9. Test: Verify fonts on Universal Login page

**Verification**:
- [ ] Page displays in Inter font
- [ ] Font loads within 2 seconds (no layout shift)
- [ ] All font weights render correctly
- [ ] Text remains readable if Google Fonts unavailable (fallback fonts)
- [ ] Mobile and desktop rendering consistent

**Testing Steps**:
1. Open Auth0 Dashboard
2. Go to Applications → Test Application
3. Click "Try" → "Initiate Login Flow"
4. Inspect page with DevTools: Check applied font-family
5. Verify Google Fonts loaded in Network tab
6. Test without internet connection (fallback fonts)

**Browser DevTools Verification**:
```
Right-click text → Inspect
Look for: font-family: Inter, ...
Or: font-family: -apple-system, ... (fallback)
```

**Related Links**:
- [Google Fonts Inter](https://fonts.google.com/specimen/Inter)
- [Auth0 Customization Options](https://auth0.com/docs/customize/login-pages/universal-login/customize-themes)
- App Typography Tokens: `/src/theme/__tests__/tokens.test.ts` (line 94-114)

**Success Criteria**:
✅ Font displays as Inter
✅ All font weights load
✅ Fallback fonts available
✅ Typography matches app design system

---

## Implementation Checklist

**Before Starting**:
- [ ] Have Auth0 Dashboard login credentials ready
- [ ] Access to Auth0 tenant with test application
- [ ] Screenshot tool or browser dev tools open

**Story 1: Button Colors** (10 min)
- [ ] Log in to Auth0 Dashboard
- [ ] Navigate to Customization Options
- [ ] Set Primary Button Color to `#0066FF`
- [ ] Save and verify
- [ ] Document with screenshot

**Story 2: Background Colors** (15 min)
- [ ] Navigate to Customization Options
- [ ] Set Page Background to `#F9FAFB`
- [ ] Set Widget Background to `#FFFFFF`
- [ ] Save and verify
- [ ] Document with screenshot

**Story 3: Typography** (10 min)
- [ ] Navigate to Customization Options
- [ ] Set Font URL to Google Fonts Inter
- [ ] Set Font Family to `Inter, ...`
- [ ] Save and verify
- [ ] Document with screenshot

**After Completion**:
- [ ] Screenshots saved for documentation
- [ ] Test login flow end-to-end
- [ ] Share updated login experience with team
- [ ] Update README with new branding details

---

## Quick Reference: Design Token Values

| Element | Token | Value | Hex |
|---------|-------|-------|-----|
| Button Color | `primary.main` | Primary Blue | #0066FF |
| Button Hover | `primary.dark` | Dark Blue | #0052CC |
| Page Background | `background.secondary` | Light Gray | #F9FAFB |
| Form Background | `background.primary` | White | #FFFFFF |
| Font Family | - | Inter | Google Fonts |
| Text Color | `text.primary` | Dark Gray | #111827 |

---

## Expected Results After Completion

**Before** (Default Auth0):
- Generic gray button
- White page background
- Default system font
- No brand recognition

**After** (Customized):
- ✅ Blue branded button (#0066FF)
- ✅ Light gray page, white form (#F9FAFB / #FFFFFF)
- ✅ Inter typography matching app
- ✅ Professional, cohesive experience
- ✅ Improved brand recognition
- ✅ 0 lines of code modified

---

## Effort & ROI

| Story | Effort | ROI | Impact |
|-------|--------|-----|--------|
| 1: Button Colors | 10 min | ⭐⭐⭐⭐⭐ | High brand visibility |
| 2: Backgrounds | 15 min | ⭐⭐⭐⭐ | Professional appearance |
| 3: Typography | 10 min | ⭐⭐⭐⭐ | Design consistency |
| **Total** | **35 min** | **⭐⭐⭐⭐⭐** | **Immediate impact** |

---

## Next Steps After Phase 1.2

Once these dashboard stories are complete:

**Option A**: Stop here
- You have branded Auth0 login
- Sufficient for most users
- No ongoing maintenance

**Option B**: Track for future enhancement
- When Auth0 Pro upgrade becomes priority
- Implement Stories 2-7 from full customization doc
- Dark theme support, focus states, error styling

**Option C**: Alternative authentication
- Evaluate other providers (Supabase, Clerk, etc.)
- Consider custom login page
- Reassess based on business needs

---

## Troubleshooting

**Q: Changes don't appear?**
- A: Clear browser cache (Ctrl+Shift+Delete) and refresh
- Hard refresh test page (Ctrl+F5)

**Q: Color looks different in test?**
- A: Monitor settings may affect color display
- Check color picker shows correct hex value
- Use DevTools Color Picker to verify

**Q: Font not loading?**
- A: Test Google Fonts URL in separate tab
- Verify font URL is correct: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`
- Allow 1-2 seconds for font to load

**Q: Can I customize further?**
- A: Requires Auth0 Pro plan for custom HTML/CSS
- Current plan limited to dashboard options
- Document requirements for future upgrade

---

## Sign-Off

**Status**: Ready for immediate execution
**Created**: 2026-02-22
**Estimated Time**: 35-45 minutes
**Cost**: $0 (included with current Auth0 plan)

---

**Next**: Execute these three stories in Auth0 Dashboard, then report results!
