# Auth0 Lock Widget Integration - Technical Design

**Status**: READY FOR IMPLEMENTATION
**Date**: 2026-02-15

## System Architecture

### Current State
```
User Browser
    ↓
LoginPage (custom form)
    ├─ Email input
    ├─ Password input
    └─ External link to Auth0 login page
         ↓
    User leaves application context
         ↓
    Auth0 hosted login page
         ↓
    Redirect to /callback?code=...&state=...
         ↓
    CallbackPage (exchanges code for tokens)
         ↓
    Authenticated user
```

### Target State
```
User Browser
    ↓
LoginPage (Lock Widget embedded)
    ├─ Hero section (left) - optional
    └─ Lock Widget (right)
         ├─ Login tab
         ├─ Sign Up tab
         └─ Password reset
              ↓
    Lock handles Auth0 communication
         ↓
    Lock redirects to /callback?code=...&state=...
         ↓
    CallbackPage (existing flow - no changes)
         ↓
    Authenticated user
```

**Key Benefit**: Users stay in application context, professional styling applied.

---

## Component Architecture

### Component Structure
```
src/pages/
├── LoginPage.tsx (redesigned)
│   ├── Hero section (optional left side)
│   └── Lock Widget container
│
└── __tests__/
    └── LoginPage.test.tsx (15+ tests)
```

### LoginPage Component Design

```typescript
/**
 * LoginPage Component
 * Renders Auth0 Lock Widget for authentication
 *
 * Key Features:
 * - Lock Widget embedded and styled
 * - Design tokens applied for theming
 * - Responsive layout (hero + auth form)
 * - Dark mode support
 */
interface LoginPageProps {
  // No props - uses Auth0 config from environment
}

export function LoginPage(): JSX.Element {
  // 1. Initialize Lock Widget on mount
  // 2. Extract primary color from useThemeColors
  // 3. Configure Lock with Auth0 settings
  // 4. Handle cleanup on unmount
  // 5. Render responsive layout
}
```

---

## Technical Specifications

### 1. Auth0 Lock Widget Configuration

```typescript
// Lock Widget options
const lockConfig = {
  // Auth/redirect settings
  auth: {
    redirectUrl: `${window.location.origin}/callback`,  // Existing callback
    responseType: 'code',                                // Authorization Code flow
    scope: 'openid profile email'                        // Request user info
  },

  // UI customization
  theme: {
    primaryColor: themeColors.primary.main,              // From design tokens
    logo: '/logo.png',                                   // Application logo (optional)
  },

  // Form options
  allowedConnections: [
    'Username-Password-Authentication'                   // Email/password only
  ],
  allowSignUp: true,                                     // Show sign up tab
  allowForgotPassword: true,                             // Forgot password link

  // Text customization
  languageDictionary: {
    title: 'Your App Name',
    signUpWithTitle: 'Sign up',
    loginWithTitle: 'Log in'
  },

  // Container
  container: 'auth0-lock-container'
};

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN,
  lockConfig
);
```

### 2. Environment Variables Required

```bash
# .env or .env.local
REACT_APP_AUTH0_CLIENT_ID=your_client_id
REACT_APP_AUTH0_DOMAIN=your_domain.auth0.com
# Already configured in project
```

### 3. Design Token Integration

```typescript
// Extract from useThemeColors hook
const { primary, background, text } = useThemeColors();

const lockConfig = {
  theme: {
    primaryColor: primary.main,  // #667eea (light) or dynamic (dark)
    logo: '/logo.png'
  }
  // Lock Widget background and text colors are CSS-overrideable
};
```

### 4. Responsive Layout Design

**Desktop (1200px+)**
```
┌─────────────────────────────────────────┐
│  Application Header                     │
├────────────────────┬────────────────────┤
│                    │                    │
│  Hero Section      │  Lock Widget       │
│  (optional)        │  (500px wide)      │
│                    │                    │
│  - Teacher image   │  - Login form      │
│  - Title text      │  - Sign up tab     │
│  - Info boxes      │  - Error messages  │
│                    │                    │
└────────────────────┴────────────────────┘
```

**Tablet (768px - 1199px)**
```
┌──────────────────────────────────────┐
│  Application Header                  │
├──────────────────────────────────────┤
│  Lock Widget (centered, 90% width)   │
│                                      │
│  - Login form                        │
│  - Sign up tab                       │
│  - Error messages                    │
│                                      │
└──────────────────────────────────────┘
```

**Mobile (< 768px)**
```
┌──────────────────┐
│ App Header       │
├──────────────────┤
│ Lock Widget      │
│ (full width)     │
│                  │
│ - Login form     │
│ - Sign up tab    │
│ - Errors         │
│                  │
└──────────────────┘
```

### 5. CSS Customization Strategy

**Approach**: CSS class overrides for styling
```css
/* src/pages/LoginPage.module.css */

.lockContainer {
  /* Container styling */
  display: flex;
  align-items: center;
  padding: 20px;
}

/* Override Lock Widget default styles */
.lockContainer :global(.auth0-lock) {
  font-family: inherit;
}

.lockContainer :global(.auth0-lock .auth0-form) {
  background: transparent;
}

.lockContainer :global(.auth0-lock input) {
  border-radius: 8px;
  border: 2px solid var(--primary-color);
  padding: 12px;
  font-size: 16px;
}

.lockContainer :global(.auth0-lock button) {
  border-radius: 8px;
  font-weight: 600;
}
```

### 6. Error Handling

```typescript
// Lock Widget error handling
lock.on('unrecoverable_error', (error) => {
  // Handle critical errors
  console.error('Auth0 Lock error:', error);
  // Show user-friendly error message
});

lock.on('authorization_error', (error) => {
  // Handle auth-specific errors
  // Lock Widget shows these in UI automatically
});
```

### 7. Lifecycle Management

```typescript
useEffect(() => {
  // 1. Initialize Lock on mount
  const lock = new Auth0Lock(clientId, domain, lockConfig);

  // 2. Show Lock Widget
  lock.show();

  // 3. Handle logout or unmount
  return () => {
    // Clean up Lock resources
    lock.destroy();
  };
}, [themeColors]); // Re-initialize if theme changes
```

---

## Integration Points

### 1. CallbackPage Integration
**No changes required** - Existing callback flow works as-is

```typescript
// CallbackPage.tsx (existing code)
useEffect(() => {
  // Lock redirects with: /callback?code=AUTH_CODE&state=STATE
  // This code already handles the exchange
  handleCallback(); // Uses existing logic
}, []);
```

### 2. Router Configuration
**No changes required** - Routes already set up
```typescript
// App.tsx routes (existing)
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/callback" element={<CallbackPage />} />
  {/* ... other routes */}
</Routes>
```

### 3. Auth Context Integration
**No changes required** - Existing auth context works
```typescript
// Existing useAuth hook continues to work
// Tokens stored same way as before
// CallbackPage handles storage
```

---

## Responsive Design Details

### Breakpoints
```typescript
const breakpoints = {
  mobile: 480,      // max-width for mobile
  tablet: 768,      // min-width for tablet
  desktop: 1200     // min-width for desktop
};
```

### Lock Widget Sizing
- **Mobile**: 100% width with 20px padding (340px - 440px effective)
- **Tablet**: 500px fixed width, centered
- **Desktop**: 500px fixed width, positioned in grid

### Touch Targets
- Minimum 44px height for all inputs (mobile accessibility)
- 16px minimum font size (prevents iOS auto-zoom)
- Adequate spacing between interactive elements

---

## Accessibility (WCAG 2.1 AA)

### Semantic HTML
- Lock Widget uses semantic form elements
- Proper label associations
- Error messages linked to inputs

### Keyboard Navigation
- Tab through form fields in logical order
- Enter submits form
- Escape key behavior (Lock handles)
- Focus visible with outline

### Color Contrast
- Text on form background: 4.5:1 minimum
- Placeholder text: readable (Lock handles)
- Error states: 4.5:1 contrast required

### Focus Management
- Focus visible on all interactive elements
- Lock Widget manages focus automatically
- Consider focus management after auth error

---

## Dark Mode Support

### Implementation
```typescript
// LoginPage.tsx
const { primary, background, text } = useThemeColors();

const lockConfig = {
  theme: {
    primaryColor: primary.main  // Automatically adapts to theme
  }
};

// CSS also adapts via design tokens
```

### Behavior
- Light Mode: Primary color #667eea
- Dark Mode: Primary color adjusts (see theme tokens)
- Background colors handled by CSS
- Text colors have proper contrast in both themes

---

## Security Considerations

### OAuth 2.0 Authorization Code Flow
- ✅ PKCE enabled (configured in CallbackPage)
- ✅ Code exchange server-side (CallbackPage handles)
- ✅ No credentials exposed in frontend
- ✅ HTTPS required
- ✅ State parameter validated (CallbackPage)

### Lock Widget Security
- ✅ Managed by Auth0 (industry standard)
- ✅ No password storage in frontend
- ✅ XSS protection via Lock's sanitization
- ✅ CSRF protection via state parameter

---

## Performance Optimization

### Load Time
- Lock Widget bundle: ~150KB (gzipped)
- Load time: typically < 2 seconds
- Lazy load Lock only on LoginPage
- Cache Lock Widget script in service worker (optional)

### Runtime Performance
- Form interactions: < 100ms response
- Auth request: < 5 seconds typical
- No layout shifts after Lock loads

---

## Testing Strategy

### Unit Tests (LoginPage component)
1. Lock initializes on mount
2. Lock shows correctly
3. Lock destroyed on unmount
4. Primary color applied from theme
5. Lock container rendered

### Integration Tests
1. User enters email/password and logs in
2. User switches to sign up tab
3. User creates account successfully
4. Invalid credentials show error
5. Redirect to /callback works
6. Error recovery and retry

### E2E Tests
1. Complete login flow from /login to authenticated state
2. Complete signup flow from /login to authenticated state
3. Callback integration verified
4. Dark mode theme applied

### Accessibility Tests
1. Keyboard navigation works
2. Focus indicators visible
3. Screen reader compatible
4. Color contrast adequate

### Responsive Tests
1. Mobile layout (360px)
2. Tablet layout (768px)
3. Desktop layout (1200px)
4. No horizontal scroll

---

## Deployment Considerations

### Before Merging
- ✅ All tests passing (15+)
- ✅ Lint/format checks passing
- ✅ TypeScript strict mode passing
- ✅ Accessibility audit passed
- ✅ Code review approved
- ✅ Manual testing on real device

### After Merging
- Deploy to staging for QA
- Test on real Auth0 credentials
- Verify callback flow end-to-end
- Monitor for errors in Sentry/logging
- Verify performance in production

---

## Files Created/Modified

### New Files
```
src/pages/LoginPage.tsx (redesigned)
src/pages/LoginPage.module.css (updated)
src/pages/__tests__/LoginPage.test.tsx (15+ tests)
```

### Modified Files
```
src/App.tsx (route already exists - no changes)
src/pages/__tests__/LoginPage.component.test.tsx (new comprehensive tests)
```

### Deleted Files
```
None - no breaking changes
```

---

## Next Steps for Frontend Engineer

1. ✅ Read requirements.md (user stories)
2. → Review this design.md (technical approach)
3. → Execute tasks.md (TDD implementation)
4. → Run tests (should all pass)
5. → Code review
6. → Merge to main

---

## Architecture Decision Records (ADRs)

### ADR-001: Embedded Lock vs. Redirect to Hosted Login
**Decision**: Embed Lock Widget in LoginPage

**Rationale**:
- ✅ Better UX (stay in app context)
- ✅ Design system styling possible
- ✅ Built-in sign up functionality
- ✅ Professional appearance

**Alternative Considered**: Redirect to Auth0 hosted login
- ❌ Users leave app context
- ❌ Limited customization
- ❌ Simpler but worse UX

### ADR-002: Use Auth0 Lock vs. Custom Auth Form
**Decision**: Use Auth0 Lock Widget

**Rationale**:
- ✅ Secure credential handling (Auth0 managed)
- ✅ Built-in sign up and password reset
- ✅ Rapid implementation
- ✅ Maintained by Auth0

**Alternative Considered**: Build custom form
- ❌ More complex (credential handling)
- ❌ Longer implementation
- ❌ More security responsibility

### ADR-003: Lock Widget Styling Approach
**Decision**: CSS class overrides + design token extraction

**Rationale**:
- ✅ Lock Widget structure preserved
- ✅ Design tokens applied to primary color
- ✅ CSS customization for fine-tuning
- ✅ Maintainable approach

**Alternative Considered**: Full custom form (100% control)
- ❌ Much longer implementation
- ❌ More maintenance burden
