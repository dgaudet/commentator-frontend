# Auth0 Lock Integration - Requirements

**Status**: READY FOR DESIGN
**Format**: EARS Notation (Event, Action, Response)

## User Stories (9 Total)

**Note**: Callback flow (US-008) removed - existing CallbackPage already handles auth code exchange and token management. This PDD focuses on Lock Widget integration only.

### US-001: User Sees Styled Login Form
```
GIVEN a user navigates to /login
WHEN the page loads
THEN the user shall see the Auth0 Lock Widget styled with application design tokens
AND the Lock Widget shall display with the primary color from themeColors.primary.main
AND the user shall see application header/navigation (if applicable)
```

**Acceptance Criteria**:
- Lock Widget renders without errors
- Primary color matches design token
- Layout is responsive (mobile: 100%, tablet: 50%, desktop: 50%)
- Lock Widget is visible and interactive

**Edge Cases**:
- Auth0 credentials missing → Show error message
- Network error loading Lock → Show fallback message
- JavaScript disabled → Show appropriate fallback

---

### US-002: User Logs In with Email and Password
```
GIVEN a user sees the Lock Widget login form
WHEN the user enters valid email and password
AND clicks the login button
THEN Lock Widget shall authenticate with Auth0
AND the existing CallbackPage shall handle token exchange (no changes needed)
AND the user shall be logged in and redirected to dashboard
```

**Acceptance Criteria**:
- Valid credentials authenticate successfully
- Lock redirects to /callback with auth code
- Existing CallbackPage processes code (already working)
- User session established
- No error messages shown

**Edge Cases**:
- Invalid password → Show error message from Lock
- Non-existent email → Show error message from Lock
- Network error during auth → Show error message and allow retry

**Note**: Callback flow already implemented and tested in existing CallbackPage. This story validates Lock integration only.

---

### US-003: User Creates Account via Sign Up Link
```
GIVEN a user sees the Lock Widget login form
WHEN the user clicks the "Create Account" link
THEN the user shall be redirected to the existing /signup route
AND the user shall be able to use the existing signup form
AND the signup flow shall work as currently designed
```

**Acceptance Criteria**:
- "Create Account" link visible below/within Lock Widget
- Link directs to `/signup` route
- Existing signup form loads correctly
- Signup validation and API calls work unchanged
- User automatically logged in after signup (existing behavior)
- Redirect to dashboard works (existing behavior)

**Edge Cases**:
- User tries to signup, then returns to login (existing /signup handles this)
- All existing /signup errors and validations apply

---

### US-004: User Sees Error Messages
```
GIVEN a user enters invalid credentials or attempts to signup with invalid data
WHEN the user submits the form
THEN the user shall see a clear error message
AND the error message shall explain what went wrong
AND the form shall remain visible for retry
```

**Acceptance Criteria**:
- Invalid email shows "Invalid email format"
- Wrong password shows "Invalid password"
- Missing required field shows "Field is required"
- Email exists shows "Email already registered"
- Error messages appear near the relevant field
- Form state preserved for correction

---

### US-005: Login Form is Responsive
```
GIVEN a user accesses /login on any device
WHEN the page renders on mobile (360px), tablet (768px), or desktop (1200px)
THEN the Lock Widget shall be properly sized and usable
AND form inputs shall have 44px minimum touch targets
AND font sizes shall be readable
AND layout shall not require horizontal scrolling
```

**Acceptance Criteria**:
- Mobile: Lock Widget full width with padding
- Tablet: Lock Widget optimal width (500px)
- Desktop: Lock Widget in right column (50% width)
- Touch targets ≥ 44px on all inputs
- No horizontal scroll on any device
- Hero section hidden on mobile (if present)

---

### US-006: Login Form Supports Theme (Dark Mode)
```
GIVEN a user has dark mode enabled in their system preferences
WHEN the LoginPage loads
THEN the Lock Widget styling shall adapt to dark mode
AND the primary color shall come from the theme provider
AND text shall be readable with proper contrast (WCAG AA)
```

**Acceptance Criteria**:
- useThemeColors hook provides colors to Lock
- Primary color extracted dynamically
- Light theme: primary.main
- Dark theme: primary.main (adjusted)
- Text contrast ≥ 4.5:1 (WCAG AA)
- Smooth theme switching

---

### US-007: Loading State During Authentication
```
GIVEN a user submits login/signup credentials
WHEN the authentication is in progress
THEN the user shall see a visual indication that authentication is happening
AND the login button shall be disabled
AND the user shall not be able to submit the form twice
```

**Acceptance Criteria**:
- Lock Widget shows loading state (built-in)
- Button disabled during request
- Form remains visible
- User can see progress
- Loading state clears on success/error

---


### US-009: Accessibility - Keyboard Navigation
```
GIVEN a user navigates the login form with keyboard only
WHEN the user presses Tab to move between fields
AND presses Enter to submit the form
THEN all interactive elements shall be reachable
AND focus shall be visible
AND form shall be completable without mouse
```

**Acceptance Criteria**:
- Tab order logical (email → password → submit)
- Focus indicators visible (2px outline)
- Enter key submits form
- Escape key has defined behavior
- ARIA labels present for accessibility

---

### US-010: Embed Lock Widget Instead of External Auth0 Link
```
GIVEN a user navigates to /login
WHEN the page loads
THEN the user shall NOT see an external link to Auth0 hosted login
AND the LoginPage shall embed Lock Widget for login
AND the Lock Widget shall show login form only (no signup tab)
AND the user shall see a link to the existing /signup route
```

**Acceptance Criteria**:
- Old external Auth0 link removed
- No "Log in with Auth0" button
- Lock Widget is the primary login mechanism
- Sign up available via link to existing `/signup` route
- Existing /signup form and flow unchanged

---

## Non-Functional Requirements

### Performance
- **REQ-PERF-001**: Lock Widget loads in < 2 seconds
- **REQ-PERF-002**: Form interactions respond in < 100ms
- **REQ-PERF-003**: Authentication request completes in < 5 seconds

### Reliability
- **REQ-REL-001**: LoginPage works with 99.9% uptime
- **REQ-REL-002**: Graceful degradation if Lock fails to load
- **REQ-REL-003**: Network errors shown with retry capability

### Security
- **REQ-SEC-001**: PKCE flow used (configured in CallbackPage)
- **REQ-SEC-002**: No credentials logged or exposed
- **REQ-SEC-003**: HTTPS required for Auth0 communication
- **REQ-SEC-004**: Password never stored in frontend code

### Accessibility
- **REQ-ACC-001**: WCAG 2.1 AA compliant
- **REQ-ACC-002**: Screen reader compatible
- **REQ-ACC-003**: Keyboard navigable
- **REQ-ACC-004**: Color contrast 4.5:1 minimum

### Usability
- **REQ-USE-001**: Error messages clear and actionable
- **REQ-USE-002**: Form completion time < 2 minutes for returning users
- **REQ-USE-003**: Mobile-first responsive design
- **REQ-USE-004**: Consistent with app design system

---

## Validation Criteria

### Definition of Done
- ✅ All 9 user stories implemented (callback flow already exists)
- ✅ 15+ component tests passing
- ✅ Responsive design verified on 3+ devices
- ✅ Accessibility audit passed (WCAG AA)
- ✅ Error cases tested
- ✅ Lock Widget integration verified
- ✅ TypeScript strict mode passing
- ✅ Lint and format checks passing
- ✅ Code review approved
- ✅ Ready for production merge

### Testing Strategy
- **Unit Tests**: Lock component setup and configuration
- **Integration Tests**: Full login/signup flows
- **E2E Tests**: Callback redirect and token handling
- **Accessibility Tests**: WCAG AA compliance
- **Responsive Tests**: Mobile, tablet, desktop layouts
- **Error Tests**: Invalid credentials, network errors

---

## Success Metrics

1. **User Experience**: Users can log in without leaving app, sign up via existing /signup route
2. **Design Consistency**: Auth form matches application styling with design tokens
3. **Zero Breaking Changes**: Existing CallbackPage flow unchanged, existing /signup route preserved
4. **Code Quality**: 15+ test cases for Lock Widget integration
5. **Accessibility**: WCAG 2.1 AA compliant
6. **Integration**: Lock redirects correctly to existing CallbackPage (already verified to work)
