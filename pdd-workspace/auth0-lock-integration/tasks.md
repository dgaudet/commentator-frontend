# Auth0 Lock Widget Integration - Implementation Tasks

**Status**: READY FOR EXECUTION
**Complexity**: L2 (Low)
**Risk Tiers**: Trivial (1), Low (2), Medium (1)
**Estimated Time**: 8-12 hours total

---

## Pre-Implementation Checklist

Before starting tasks, verify:
- [ ] `auth0-lock` package already installed (`npm list auth0-lock`)
- [ ] Auth0 environment variables set (`.env.local`)
- [ ] CallbackPage working and tested
- [ ] Git on clean `main` or feature branch
- [ ] All tests passing (`npm run test`)

---

## TASK 1: Set Up Lock Widget Component Base (LOW RISK)

**Duration**: 1-2 hours
**Effort**: Medium
**Risk**: Low - localized changes to LoginPage only

### Description
Create the basic LoginPage component structure with Lock Widget initialization. This task focuses on getting Lock to render and styling it with design tokens.

### Acceptance Criteria
- ✅ LoginPage renders without errors
- ✅ Lock Widget initializes on component mount
- ✅ Lock Widget shows in the UI
- ✅ Primary color from design tokens applied
- ✅ Lock Widget cleans up on unmount
- ✅ TypeScript strict mode passing

### Test-Driven Development (TDD)

**Phase 1: RED - Write Failing Tests**

Create `src/pages/__tests__/LoginPage.component.test.tsx` with tests:
```typescript
describe('LoginPage Component', () => {
  // TEST 1: Component renders without crashing
  it('should render LoginPage without errors', () => {
    // Arrange
    // Act
    // Assert
  });

  // TEST 2: Lock container element exists
  it('should render auth0-lock-container element', () => {
    // Arrange
    // Act
    // Assert
  });

  // TEST 3: Lock Widget initializes on mount
  it('should initialize Auth0 Lock on component mount', () => {
    // Mock Auth0Lock
    // Arrange
    // Act
    // Assert: Auth0Lock constructor called with correct config
  });

  // TEST 4: Lock Widget destroyed on unmount
  it('should call lock.destroy() on component unmount', () => {
    // Mock lock.destroy()
    // Arrange
    // Act: unmount component
    // Assert: destroy() was called
  });

  // TEST 5: Primary color from design tokens applied
  it('should apply primary color from design tokens to Lock Widget', () => {
    // Mock useThemeColors hook
    // Arrange: mock theme with primary.main = '#667eea'
    // Act
    // Assert: Lock initialized with primaryColor: '#667eea'
  });

  // TEST 6: Lock.show() called
  it('should call lock.show() to display widget', () => {
    // Mock lock.show()
    // Arrange
    // Act
    // Assert: show() was called
  });
});
```

**Phase 2: GREEN - Implement Component**

Create `src/pages/LoginPage.tsx`:
```typescript
import { useEffect } from 'react';
import Auth0Lock from 'auth0-lock';
import { useThemeColors } from '../hooks/useThemeColors';

export function LoginPage(): JSX.Element {
  const { primary } = useThemeColors();

  useEffect(() => {
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;

    if (!clientId || !domain) {
      console.error('Auth0 configuration missing');
      return;
    }

    const lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: `${window.location.origin}/callback`,
        responseType: 'code',
        scope: 'openid profile email'
      },
      theme: {
        primaryColor: primary.main
      },
      container: 'auth0-lock-container',
      allowedConnections: ['Username-Password-Authentication'],
      allowSignUp: false,  // Login only (use existing /signup route)
      allowForgotPassword: true
    });

    lock.show();

    return () => {
      lock.destroy();
    };
  }, [primary]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div id="auth0-lock-container" />
    </div>
  );
}
```

**Phase 3: REFACTOR - Optimize**

- Extract Lock configuration to constants
- Add proper error handling
- Add responsive styling
- Add accessibility attributes

### Key Implementation Details

1. **Lock Initialization**
   - Use `useEffect` hook for initialization
   - Call `lock.show()` to display widget
   - Clean up with `lock.destroy()` on unmount

2. **Design Token Integration**
   - Import `useThemeColors` hook
   - Extract `primary.main` color
   - Pass to Lock's `theme.primaryColor`

3. **Environment Variables**
   ```bash
   REACT_APP_AUTH0_CLIENT_ID=<your_client_id>
   REACT_APP_AUTH0_DOMAIN=<your_domain>.auth0.com
   ```

4. **Error Handling**
   - Check for missing env vars
   - Log errors to console
   - Show fallback message if needed

### Files to Create
```
src/pages/LoginPage.tsx (new)
src/pages/__tests__/LoginPage.component.test.tsx (new)
src/pages/LoginPage.module.css (new)
```

### Verification Checklist
- [ ] All 6 tests passing
- [ ] LoginPage renders without errors
- [ ] Lock Widget visible in browser
- [ ] Primary color applied
- [ ] Console shows no errors
- [ ] TypeScript strict mode passing
- [ ] npm run lint passes

---

## TASK 2: Add Responsive Layout & Styling (LOW RISK)

**Duration**: 2-3 hours
**Effort**: Medium
**Risk**: Low - styling only, no logic changes

### Description
Implement responsive design (mobile, tablet, desktop) with CSS styling that matches design tokens.

### Acceptance Criteria
- ✅ Mobile layout (< 768px): Lock full width
- ✅ Tablet layout (768-1199px): Lock centered
- ✅ Desktop layout (≥ 1200px): Lock in right column (optional hero left)
- ✅ Touch targets ≥ 44px on all devices
- ✅ No horizontal scrolling on any device
- ✅ Dark mode support via design tokens

### TDD Phase 1: RED - Write Failing Tests

Add to `LoginPage.component.test.tsx`:
```typescript
describe('LoginPage - Responsive Design', () => {
  // TEST 7: Mobile layout
  it('should render full-width Lock on mobile (max-width: 480px)', () => {
    // Mock window.matchMedia
    // Arrange: viewport 480px
    // Act
    // Assert: Lock container width is 100% or mobile-optimized
  });

  // TEST 8: Tablet layout
  it('should render centered Lock on tablet (768px - 1199px)', () => {
    // Arrange: viewport 900px
    // Act
    // Assert: Lock container is centered with appropriate width
  });

  // TEST 9: Desktop layout
  it('should render Lock in right column on desktop (≥1200px)', () => {
    // Arrange: viewport 1400px
    // Act
    // Assert: Lock positioned in right column layout
  });

  // TEST 10: Touch targets minimum size
  it('should have inputs with minimum 44px height for mobile accessibility', () => {
    // Arrange
    // Act: render component
    // Assert: inputs have min-height: 44px
  });

  // TEST 11: Dark mode colors
  it('should apply dark mode theme when useThemeColors returns dark colors', () => {
    // Mock dark theme
    // Arrange: mock dark mode colors
    // Act
    // Assert: appropriate colors applied
  });
});
```

### TDD Phase 2: GREEN - Implement Styling

Update `src/pages/LoginPage.tsx`:
```typescript
export function LoginPage(): JSX.Element {
  const { primary, background, text } = useThemeColors();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: background.primary,
        padding: '20px',
        '@media (min-width: 1200px)': {
          justifyContent: 'flex-end',
          paddingRight: '60px'
        }
      }}
    >
      <div
        id="auth0-lock-container"
        style={{
          width: '100%',
          maxWidth: '500px',
          '@media (max-width: 768px)': {
            maxWidth: '100%'
          }
        }}
      />
    </div>
  );
}
```

Create `src/pages/LoginPage.module.css`:
```css
.loginContainer {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lockContainer {
  width: 100%;
  max-width: 500px;
}

/* Tablet layout (768px - 1199px) */
@media (min-width: 768px) {
  .lockContainer {
    width: 500px;
  }
}

/* Desktop layout (1200px+) */
@media (min-width: 1200px) {
  .loginContainer {
    justify-content: flex-end;
    padding-right: 60px;
  }

  .lockContainer {
    width: 500px;
  }
}

/* Mobile (< 480px) - extra small devices */
@media (max-width: 480px) {
  .lockContainer {
    max-width: 100%;
  }

  .loginContainer {
    padding: 10px;
  }
}

/* Lock Widget CSS overrides */
.lockContainer :global(.auth0-lock input) {
  min-height: 44px; /* Touch target */
  font-size: 16px;  /* Prevent iOS zoom */
  padding: 12px;
}

.lockContainer :global(.auth0-lock button) {
  min-height: 44px; /* Touch target */
  font-size: 16px;
}
```

### TDD Phase 3: REFACTOR

- Extract responsive breakpoints to constants
- Improve CSS organization
- Add focus states and transitions
- Optimize media queries

### Key Implementation Details

1. **Responsive Breakpoints**
   - Mobile: < 768px (full width)
   - Tablet: 768px - 1199px (centered)
   - Desktop: ≥ 1200px (right column)

2. **Touch Target Sizing**
   - Minimum 44px for all interactive elements
   - 16px minimum font size (iOS)
   - 12px vertical padding for comfort

3. **CSS Overrides**
   - Use `:global()` for Lock Widget classes
   - Override input/button styles
   - Maintain Lock's structure

### Files to Update
```
src/pages/LoginPage.tsx (add responsive styling)
src/pages/LoginPage.module.css (add responsive rules)
src/pages/__tests__/LoginPage.component.test.tsx (add 5 tests)
```

### Verification Checklist
- [ ] All 11 tests passing (6 + 5 new)
- [ ] Mobile: 360px viewport works
- [ ] Tablet: 768px viewport works
- [ ] Desktop: 1200px viewport works
- [ ] No horizontal scroll on any device
- [ ] Dark mode colors apply
- [ ] Touch targets ≥ 44px

---

## TASK 3: Integration with Auth Flow & Error Handling (MEDIUM RISK)

**Duration**: 2-3 hours
**Effort**: Medium-High
**Risk**: Medium - involves CallbackPage integration

### Description
Verify Lock Widget redirects correctly to CallbackPage and handle errors appropriately.

### Acceptance Criteria
- ✅ Lock redirects to `/callback` with auth code after successful login
- ✅ CallbackPage processes auth code without changes
- ✅ Error messages display when credentials invalid
- ✅ Network errors show graceful fallback
- ✅ User can retry after error
- ✅ Sign up flow works and logs user in

### TDD Phase 1: RED - Write Failing Tests

Add to `LoginPage.component.test.tsx`:
```typescript
describe('LoginPage - Authentication Flow', () => {
  // TEST 12: Successful login redirects to callback
  it('should redirect to /callback after successful authentication', () => {
    // Mock Lock's successful auth
    // Arrange: setup Lock with mock auth response
    // Act: trigger successful auth in Lock
    // Assert: window.location.href includes /callback?code=...
  });

  // TEST 13: Sign up works
  it('should handle user signup through Lock Widget', () => {
    // Mock Lock's signup auth
    // Arrange
    // Act: trigger signup in Lock
    // Assert: redirects to /callback like login
  });

  // TEST 14: Error handling
  it('should handle authentication errors gracefully', () => {
    // Mock Lock's error callback
    // Arrange
    // Act: trigger error in Lock
    // Assert: error message displayed or retry available
  });

  // TEST 15: Network error fallback
  it('should show fallback message if Lock fails to load', () => {
    // Mock Auth0Lock constructor throwing error
    // Arrange
    // Act
    // Assert: error message or fallback UI shown
  });
});
```

### TDD Phase 2: GREEN - Implement Error Handling

Update `src/pages/LoginPage.tsx`:
```typescript
export function LoginPage(): JSX.Element {
  const { primary } = useThemeColors();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
      const domain = process.env.REACT_APP_AUTH0_DOMAIN;

      if (!clientId || !domain) {
        setError('Authentication service not configured');
        return;
      }

      const lock = new Auth0Lock(clientId, domain, {
        // ... config
      });

      // Handle errors
      lock.on('authorization_error', (error) => {
        setError(`Authentication failed: ${error.error_description}`);
      });

      lock.on('unrecoverable_error', (error) => {
        setError('Authentication service error. Please try again.');
      });

      lock.show();

      return () => lock.destroy();
    } catch (err) {
      setError('Failed to initialize authentication');
      console.error('LoginPage error:', err);
    }
  }, [primary]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div id="auth0-lock-container" />
  );
}
```

### TDD Phase 3: REFACTOR

- Extract error messages to constants
- Improve error UI styling
- Add retry logic
- Add logging for debugging

### Key Implementation Details

1. **Redirect Flow**
   - Lock automatically redirects to `redirectUrl` + callback params
   - CallbackPage handles the exchange (no changes needed)
   - Existing auth flow works unchanged

2. **Error Handling**
   - `authorization_error`: User canceled or invalid credentials
   - `unrecoverable_error`: Lock initialization failed
   - Fallback: Network or config errors

3. **Lock Event Listeners**
   - `lock.on('authorization_error', ...)`
   - `lock.on('unrecoverable_error', ...)`
   - `lock.on('authenticated', ...)` (optional)

### Files to Update
```
src/pages/LoginPage.tsx (add error state and handling)
src/pages/__tests__/LoginPage.component.test.tsx (add 4 tests)
```

### Verification Checklist
- [ ] All 15 tests passing (11 + 4 new)
- [ ] Callback integration verified
- [ ] Error messages display
- [ ] Retry functionality works
- [ ] No console errors
- [ ] SignUp flow tested

---

## TASK 4: Comprehensive Test Suite & Accessibility (LOW RISK)

**Duration**: 1.5-2 hours
**Effort**: Medium
**Risk**: Low - testing and accessibility only

### Description
Add comprehensive test coverage and verify WCAG 2.1 AA accessibility compliance.

### Acceptance Criteria
- ✅ 15+ component tests passing
- ✅ Responsive design tests passing
- ✅ Accessibility audit passed (WCAG AA)
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ Color contrast adequate

### TDD Phase 1: RED - Additional Tests

Add to `LoginPage.component.test.tsx`:
```typescript
describe('LoginPage - Accessibility', () => {
  // TEST 16: Keyboard navigation
  it('should support keyboard navigation (Tab, Enter)', () => {
    // Arrange
    // Act: simulate Tab key
    // Assert: focus moves through form fields
  });

  // TEST 17: Focus visible
  it('should have visible focus indicators', () => {
    // Arrange
    // Act: tab to input
    // Assert: focus outline visible
  });

  // TEST 18: Color contrast
  it('should meet WCAG AA color contrast requirements', () => {
    // Use testing-library to check color contrast
    // Assert: all text meets 4.5:1 contrast
  });

  // TEST 19: ARIA labels
  it('should have proper ARIA labels for screen readers', () => {
    // Arrange
    // Act
    // Assert: form inputs have associated labels
  });

  // TEST 20: Lock container attributes
  it('should have proper role and attributes for accessibility', () => {
    // Arrange
    // Act
    // Assert: container has role="main" or similar
  });
});
```

### TDD Phase 2: GREEN - Add Accessibility Features

Update `src/pages/LoginPage.tsx`:
```typescript
export function LoginPage(): JSX.Element {
  // ... existing code

  return (
    <main style={{ minHeight: '100vh' }}>
      {error ? (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      ) : (
        <div id="auth0-lock-container" role="main" />
      )}
    </main>
  );
}
```

Update `src/pages/LoginPage.module.css`:
```css
/* Focus indicators */
.lockContainer :global(.auth0-lock input:focus) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.lockContainer :global(.auth0-lock button:focus) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Ensure readable text */
.lockContainer :global(.auth0-lock label) {
  font-size: 16px;
  color: inherit;
}
```

### TDD Phase 3: REFACTOR

- Organize tests by category (unit, integration, a11y)
- Add test utilities for accessibility testing
- Document accessibility features

### Key Implementation Details

1. **Keyboard Navigation**
   - Lock Widget handles Tab/Enter automatically
   - Verify logical tab order

2. **Focus Management**
   - Focus visible with 2px outline
   - Outline color from design tokens
   - Outline offset for clarity

3. **ARIA Attributes**
   - `role="main"` for Lock container
   - `role="alert"` for error messages
   - Proper form labels (Lock handles)

4. **Color Contrast**
   - Text on background: 4.5:1 minimum
   - Lock Widget uses sufficient contrast
   - Verify with accessibility checker

### Files to Update
```
src/pages/__tests__/LoginPage.component.test.tsx (add 5 tests)
src/pages/LoginPage.tsx (add ARIA attributes)
src/pages/LoginPage.module.css (add focus styles)
```

### Verification Checklist
- [ ] All 20 tests passing
- [ ] WCAG AA color contrast verified
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] No accessibility violations
- [ ] npm run lint passes

---

## TASK 5: Final Integration & Cleanup (TRIVIAL RISK)

**Duration**: 30-60 minutes
**Effort**: Low
**Risk**: Trivial - cleanup and verification only

### Description
Final integration tests, cleanup, and prepare for code review.

### Acceptance Criteria
- ✅ All 20 tests passing
- ✅ Full test suite passing (no regressions)
- ✅ TypeScript strict mode passing
- ✅ Lint and format checks passing
- ✅ Build successful
- ✅ No console errors or warnings

### Implementation Steps

1. **Run Full Test Suite**
   ```bash
   npm run test
   # Should show: "2693+ tests passing"
   ```

2. **Check TypeScript**
   ```bash
   npm run type-check
   # Should show: "No errors"
   ```

3. **Lint and Format**
   ```bash
   npm run lint
   npm run format
   # Should show: "0 errors"
   ```

4. **Build**
   ```bash
   npm run build
   # Should complete without errors
   ```

5. **Manual Testing**
   - [ ] Visit http://localhost:3000/login in browser
   - [ ] Lock Widget appears
   - [ ] Try entering email/password
   - [ ] Try clicking Sign Up tab
   - [ ] Test on mobile (360px) and desktop (1200px)
   - [ ] Test dark mode if available

### Final Checklist
- [ ] All 20 LoginPage tests passing
- [ ] Full test suite passing (no regressions)
- [ ] Build passing
- [ ] Lint passing
- [ ] TypeScript strict mode passing
- [ ] Manual testing completed
- [ ] Git status clean (all changes committed)
- [ ] Ready for code review

### Files Modified Summary
```
src/pages/LoginPage.tsx (new)
src/pages/LoginPage.module.css (new)
src/pages/__tests__/LoginPage.component.test.tsx (new, 20 tests)
```

### Files Not Modified
- CallbackPage (no changes - existing flow works)
- App.tsx routes (already has /login and /callback)
- Any auth context or utilities (unchanged)

---

## Summary

### Implementation Roadmap
1. ✅ TASK 1: Lock Widget Component Base (2h)
2. ✅ TASK 2: Responsive Layout & Styling (2.5h)
3. ✅ TASK 3: Auth Flow & Error Handling (2.5h)
4. ✅ TASK 4: Comprehensive Tests & A11y (2h)
5. ✅ TASK 5: Final Integration & Cleanup (1h)

**Total Time**: 8-10 hours

### Test Coverage
- **Component Tests**: 20 tests
- **Responsive Design**: Covered in unit tests
- **Accessibility**: Covered in unit tests
- **Integration**: Callback flow verified

### Quality Gates
- ✅ All tests passing
- ✅ TypeScript strict mode
- ✅ Lint passing
- ✅ WCAG AA compliant
- ✅ Responsive design verified
- ✅ Error handling implemented
- ✅ Code review approved

---

## Next Actions

**For Frontend Engineer:**
1. Create feature branch: `git checkout -b feat/auth0-lock-integration`
2. Start TASK 1 with TDD approach (RED → GREEN → REFACTOR)
3. Follow all acceptance criteria
4. Run tests frequently (`npm run test -- --watch`)
5. Commit regularly with clear messages
6. Submit PR when all tasks complete

**For Code Reviewer:**
1. Verify all 20 tests passing
2. Check responsive design on multiple devices
3. Verify accessibility compliance
4. Ensure no breaking changes
5. Approve for merge to main

---

## References

- Auth0 Lock Documentation: https://auth0.com/docs/libraries/auth0-lock
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Design System: See useThemeColors hook documentation
