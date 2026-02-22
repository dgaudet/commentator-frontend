# Design: Auth0 Universal Login - Level 1

**Feature**: Migrate to Auth0 Universal Login with Dashboard Branding
**Version**: 1.0
**Status**: DESIGN_PHASE

## Architecture Overview

### Current Architecture (Lock + SPA SDK)
```
┌─────────────────────────────────────────────┐
│ Client Browser                              │
├─────────────────────────────────────────────┤
│                                             │
│  LoginPage (Auth0 Lock Widget)              │
│  ├─ Lock initialized (embedded)             │
│  ├─ Lock handles login form UI              │
│  └─ Lock redirects to /callback with code   │
│                                             │
│  CallbackPage                               │
│  ├─ Monitors AuthContext.isAuthenticated    │
│  └─ Redirect to / when auth completes       │
│                                             │
│  AuthContext (auth0-spa-js)                 │
│  ├─ Creates Auth0Client                     │
│  ├─ Calls handleRedirectCallback()          │
│  ├─ Exchanges code for tokens               │
│  └─ Manages user state                      │
│                                             │
└─────────────────────────────────────────────┘
              ↓
        Auth0 Services
              ↓
    Lock Widget + SPA SDK (TWO INSTANCES)

PROBLEMS:
- Two SDK instances (configuration drift risk)
- Mixed OAuth2 paradigms (unclear handoff)
- Lock state management not visible
- SPA SDK state validation assumes its own state
```

### Proposed Architecture (Universal Login Only)
```
┌─────────────────────────────────────────────┐
│ Client Browser                              │
├─────────────────────────────────────────────┤
│                                             │
│  App Routes                                 │
│  ├─ /login → LoginPage (simple button)      │
│  ├─ /callback → CallbackPage (redirect)     │
│  └─ / → Home (protected)                    │
│                                             │
│  AuthContext (auth0-spa-js - ONLY SDK)      │
│  ├─ Creates Auth0Client                     │
│  ├─ login() calls client.loginWithRedirect()│
│  ├─ Callback processes handleRedirectCallback()
│  ├─ Manages tokens & user state             │
│  └─ Provides useAuth hook                   │
│                                             │
└─────────────────────────────────────────────┘
              ↓
        Auth0 Services
              ↓
    Universal Login (SPA SDK handles all)
              ↓
        Auth0 Dashboard
        (Branding configured here)

BENEFITS:
- One SDK instance (single source of truth)
- Standard OAuth2 flow (well-documented)
- Clear state management (SPA SDK handles all)
- Official Auth0 pattern (recommended)
- Simpler maintenance
```

## Component Design

### 1. LoginPage.tsx

**Current Implementation** (83 lines, uses Lock):
```typescript
// BEFORE
import Auth0Lock from 'auth0-lock'
export const LoginPage: React.FC = () => {
  const lockRef = useRef<Auth0Lock | null>(null)
  const lockConfig = useMemo(() => { /* Lock config */ }, [])
  useEffect(() => {
    const lock = new Auth0Lock(clientId, domain, options)
    lock.show()
  }, [lockConfig])
  return <main className={styles.container} role="main"></main>
}
```

**Proposed Implementation** (~20 lines, uses Universal Login):
```typescript
// AFTER - Simplified
import { useAuth } from '../contexts/AuthContext'
import { useThemeColors } from '../hooks/useThemeColors'
import styles from './LoginPage.module.css'

export const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth()
  const { primary } = useThemeColors()

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Log In</h1>
        {error && <div className={styles.error}>{error}</div>}
        <button
          onClick={login}
          disabled={loading}
          style={{ backgroundColor: primary.main }}
          className={styles.button}
        >
          {loading ? 'Logging in...' : 'Log In with Auth0'}
        </button>
      </div>
    </main>
  )
}
```

**Design Changes**:
- Remove Lock widget
- Add simple "Log In" button
- Button calls `login()` from AuthContext
- Show loading state during redirect
- Display errors if auth fails

**Files Modified**:
- `src/pages/LoginPage.tsx` (83 lines → ~30 lines)
- `src/pages/LoginPage.module.css` (remove Lock-specific styles)
- `src/pages/__tests__/LoginPage.*.test.tsx` (update tests)

---

### 2. AuthContext.tsx

**Current Implementation** (227 lines - mostly handles Lock + SPA SDK integration):
```typescript
// Key part - currently uses both Lock and SPA SDK
const login = useCallback(async () => {
  if (!auth0Client) return
  try {
    await auth0Client.loginWithRedirect()  // ← Redirects to Universal Login
    // But Lock widget also initialized in LoginPage
    // This creates state confusion
  } catch (err) {
    // error handling
  }
}, [auth0Client])
```

**Proposed Implementation** (Same structure, cleaner):
```typescript
// AFTER - Same but now it's the only auth mechanism
const login = useCallback(async () => {
  if (!auth0Client) return
  try {
    // This is now the ONLY login method (no Lock widget)
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: config.redirectUri,
        scope: 'openid profile email',
        audience: config.audience,
      },
    })
  } catch (err) {
    const authError = parseAuthError(err)
    setError(authError.message)
    console.error('Login error:', authError)
  }
}, [auth0Client])
```

**Design Changes**:
- No changes to AuthContext logic (already correct!)
- Clarify comments (remove Lock references)
- Simplify initialization (only SPA SDK)

**Files Modified**:
- `src/contexts/AuthContext.tsx` (comment cleanup, documentation)
- Tests to reflect simpler flow

---

### 3. CallbackPage.tsx

**Current Implementation** (160 lines, complex due to Lock + SPA SDK):
```typescript
// Current: Complex polling to wait for AuthContext auth
const handleCallback = async () => {
  try {
    const code = searchParams.get('code')
    if (!code) {
      setError('No authorization code received...')
      return
    }

    // Wait for AuthContext to complete auth
    const maxWaitTime = 8000
    for (let elapsed = 0; elapsed < maxWaitTime; elapsed += 100) {
      if (isAuthenticated) break
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    // ... redirect logic
  } catch (err) { /* error handling */ }
}
```

**Proposed Implementation** (Slightly simpler):
```typescript
// AFTER - Same structure, cleaner logic
const handleCallback = async () => {
  try {
    // Code already extracted by AuthContext.handleRedirectCallback()
    // We just need to wait for auth completion

    // Check for Auth0 errors
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(searchParams.get('error_description') || 'Auth failed')
      return
    }

    // Wait for auth completion (polling)
    const maxWaitTime = 8000
    for (let elapsed = 0; elapsed < maxWaitTime; elapsed += 100) {
      if (isAuthenticated) {
        const returnTo = searchParams.get('returnTo') || '/'
        navigate(returnTo, { replace: true })
        return
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setError('Authentication timeout')
  } catch (err) { /* error handling */ }
}
```

**Design Changes**:
- No major logic changes (already handles OAuth2 properly)
- Clarify comments
- Ensure error messages are clear

**Files Modified**:
- `src/pages/CallbackPage.tsx` (comment updates, no major logic changes)

---

## OAuth2 Flow Diagram

```
┌──────────┐                    ┌──────────────┐                   ┌──────────┐
│  User    │                    │  App         │                   │  Auth0   │
│ Browser  │                    │  (Frontend)  │                   │ Services │
└────┬─────┘                    └──────┬───────┘                   └────┬─────┘
     │                                │                                │
     │ 1. Click "Log In" button        │                                │
     │────────────────────────────────>│                                │
     │                                │                                │
     │                    2. login()   │                                │
     │                    (calls       │                                │
     │                 loginWithRedirect)                              │
     │<────────────────────────────────│                                │
     │                                │                                │
     │ 3. Redirect to Auth0 login page │                                │
     │─────────────────────────────────────────────────────────────────>│
     │                                │                                │
     │ 4. User enters credentials      │                                │
     │ 5. Auth0 validates              │                                │
     │                                │                                │
     │ 6. Redirect to /callback        │    (with code + state)        │
     │<─────────────────────────────────────────────────────────────────│
     │                                │                                │
     │ 7. /callback loads              │                                │
     │────────────────────────────────>│                                │
     │                                │                                │
     │                    8. handleRedirectCallback()                  │
     │                    exchanges code for tokens                    │
     │                                │    ← → (Backchannel)           │
     │                                │<───────────────────────────────>│
     │                                │       (returns tokens)          │
     │                                │                                │
     │ 9. AuthContext.isAuthenticated=true                            │
     │<────────────────────────────────│                                │
     │                                │                                │
     │ 10. CallbackPage redirects to / │                                │
     │────────────────────────────────>│                                │
     │                                │                                │
     │ 11. Home page loads             │                                │
     │────────────────────────────────>│                                │
     │                                │                                │
```

**Flow Description** (Authorization Code + PKCE):
1. User clicks "Log In" button on LoginPage
2. LoginPage calls `login()` from AuthContext
3. AuthContext calls `auth0Client.loginWithRedirect()`
4. User redirected to Auth0's Universal Login page
5. User enters credentials (email/password)
6. Auth0 validates and generates authorization code
7. Auth0 redirects to /callback with code + state
8. CallbackPage loads, AuthContext handles redirect callback
9. AuthContext exchanges code for access token (secure backchannel)
10. AuthContext stores token and sets isAuthenticated = true
11. CallbackPage detects authentication complete
12. CallbackPage redirects to home page

**Security Features**:
- ✅ Authorization code (not tokens in URL)
- ✅ PKCE verification (code exchange secure)
- ✅ State parameter (CSRF protection)
- ✅ Secure backchannel (code → token exchange)

---

## Configuration & Branding

### Auth0 Dashboard Configuration

**Location**: Auth0 Dashboard → Branding → Universal Login → Customization Options

**Settings**:
```json
{
  "primary_color": "#667eea",
  "page_background": "#f9fafb",
  "logo_url": "https://your-domain.com/logo.png",
  "font_url": "https://fonts.googleapis.com/css2?family=Inter",
  "font_family": "Inter, sans-serif"
}
```

**Configuration Steps** (Manual - not code):
1. Navigate to Auth0 Dashboard
2. Go to Branding > Universal Login
3. Click "Customization Options" tab
4. Set Primary Color: #667eea (matches design tokens)
5. Upload Logo: min 2000px wide JPEG
6. Save changes
7. Test login page appearance

**Result**:
- Auth0 login page shows branded colors
- Logo displayed
- Fonts applied
- Consistent across all auth prompts (login, signup, MFA)

---

## Error Handling Strategy

### Auth0 Error Response
```typescript
// When Auth0 returns error in callback
// URL: /callback?error=access_denied&error_description=User+cancelled+login

handleCallback = async () => {
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (errorParam) {
    // Show user-friendly message
    setError(errorDescription || `Authentication failed: ${errorParam}`)
    // Provide retry link
    return
  }
  // ... normal flow
}
```

### Common Errors Handled
| Error | Cause | User Message | Action |
|-------|-------|-------------|--------|
| `access_denied` | User cancelled | "Login cancelled. Please try again." | Show retry link |
| `invalid_grant` | Code expired | "Login session expired. Please try again." | Show retry link |
| `server_error` | Auth0 issue | "Auth service unavailable. Try again later." | Show retry link |
| (timeout) | Slow network | "Login took too long. Please try again." | Show retry link |

---

## File Structure

```
src/
├── contexts/
│   ├── AuthContext.tsx (UPDATED - comments, simplification)
│   └── __tests__/
│       └── AuthContext.test.ts
│
├── pages/
│   ├── LoginPage.tsx (UPDATED - remove Lock, add button)
│   ├── LoginPage.module.css (UPDATED - remove Lock styles)
│   ├── CallbackPage.tsx (MINIMAL CHANGES - comment updates)
│   ├── CallbackPage.module.css (NO CHANGES)
│   └── __tests__/
│       ├── LoginPage.test.tsx (UPDATED - new flow)
│       ├── LoginPage.component.test.tsx (UPDATED)
│       └── CallbackPage.test.tsx (UPDATED - cleaner mocks)
│
├── config/
│   └── authConfig.ts (NO CHANGES - reusable)
│
└── utils/
    └── authErrorHandler.ts (NO CHANGES - reusable)

pdd-workspace/
└── auth0-universal-login-l1/
    ├── intent.md (THIS FILE)
    ├── requirements.md (USER STORIES)
    ├── design.md (ARCHITECTURE - YOU ARE HERE)
    ├── tasks.md (IMPLEMENTATION)
    └── state.json (STATUS)

node_modules/
├── auth0-spa-js (ALREADY INSTALLED)
├── auth0-lock (DELETE - NO LONGER NEEDED)
```

---

## Technology Stack

| Component | Technology | Version | Status |
|-----------|-----------|---------|--------|
| Frontend | React | 18+ | ✅ Existing |
| Auth | auth0-spa-js | 2.x | ✅ Existing |
| Auth | auth0-lock | v11 | ❌ Remove |
| Styling | CSS Modules | - | ✅ Existing |
| Testing | Jest | - | ✅ Existing |

---

## Testing Strategy

### Unit Tests
```typescript
// LoginPage.test.tsx
describe('LoginPage', () => {
  it('should render log in button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('should call login() when button clicked', () => {
    const mockLogin = jest.fn()
    render(<LoginPage />, { authValue: { login: mockLogin } })
    fireEvent.click(screen.getByRole('button'))
    expect(mockLogin).toHaveBeenCalled()
  })

  it('should not reference Auth0Lock', () => {
    const code = require('fs').readFileSync('src/pages/LoginPage.tsx', 'utf8')
    expect(code).not.toContain('Auth0Lock')
  })
})
```

### Integration Tests
```typescript
// AuthContext.integration.test.ts
describe('Universal Login Flow', () => {
  it('should redirect to Auth0 when login called', async () => {
    const { login } = renderWithAuth()
    await login()
    expect(window.location.href).toContain('auth0.com')
  })

  it('should handle callback correctly', async () => {
    // Mock Auth0 redirect to /callback?code=xxx&state=yyy
    // Verify handleRedirectCallback() called
    // Verify tokens obtained
    // Verify isAuthenticated = true
  })
})
```

### Acceptance Criteria Tests
```typescript
// CallbackPage.acceptance.test.ts
describe('User Login Flow (Acceptance)', () => {
  it('should complete full login flow', async () => {
    // 1. Start at login page
    // 2. Click login button
    // 3. Mock Auth0 redirect
    // 4. Verify callback page loads
    // 5. Verify redirect to home
    // 6. Verify user authenticated
  })
})
```

---

## Deployment Checklist

- [ ] Code reviewed and approved
- [ ] All tests passing (npm run test)
- [ ] Linting passes (npm run lint)
- [ ] No TypeScript errors
- [ ] Lock npm package removed
- [ ] Build succeeds (npm run build)
- [ ] Auth0 Dashboard branding configured
- [ ] Logo URL verified (publicly accessible)
- [ ] Dev environment testing complete
- [ ] Staging environment testing complete
- [ ] Production deployment ready

---

## Rollback Plan

If issues occur in production:

1. **Immediate**: Revert to previous commit
   ```bash
   git revert <commit-hash>
   npm install
   npm run build
   ```

2. **Root Cause Analysis**:
   - Check Auth0 logs
   - Review callback errors
   - Verify token exchange

3. **Alternative**: If major issue
   - Restore Login with Lock temporarily
   - Root cause fix in development
   - Re-deploy when stable

---

## References

- [Auth0 SPA SDK Documentation](https://auth0.com/docs/libraries/auth0-single-page-app-sdk)
- [OAuth2 Authorization Code Flow](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1)
- [PKCE (RFC 7636)](https://datatracker.ietf.org/doc/html/rfc7636)
- [Current AuthContext Implementation](../../src/contexts/AuthContext.tsx)
- [Current CallbackPage Implementation](../../src/pages/CallbackPage.tsx)

---

**Status**: READY FOR IMPLEMENTATION TASKS
