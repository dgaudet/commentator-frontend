# ADR-0001: Auth0 Callback Handler Pattern for GitHub Pages

**Status**: Accepted
**Date**: 2026-01-18
**Authors**: Principal System Architect
**Category**: Authentication & Routing

---

## Context

### Problem Statement

The Commentator Frontend application is deployed on GitHub Pages, which serves static files and does not natively support Single Page Application (SPA) client-side routing without special configuration. This creates challenges with Auth0 OAuth callback handling:

1. **Current Implementation**: A catch-all `public/404.html` handles all 404s for SPA routing
2. **Callback Issue**: Auth0 redirects to `/callback?code=...&state=...`
3. **User Experience**: After authentication, users see an unfriendly URL containing sensitive query parameters
4. **Architectural Problem**: Auth0 callback logic is mixed with general 404 routing, violating separation of concerns

### Example Current URL
```
https://dgaudet.github.io/commentator-frontend/callback?code=iJkpApEgFy4w1Es5__sZkPU3uzm7_ZRnJ8B7cOkDeyulf&state=ZzIuYzY5WWR0FlVZRVYzX1Vha1R2WGJJS2YxUnZ5VVFNLlc1N2l1NDJXMA%3D%3D
```

This is problematic because:
- Sensitive authorization code is visible in the address bar
- URL is semantically unclear (why is there a "callback" in user-facing URL?)
- Mixing 404 routing with callback handling is architecturally unclear

### Architectural Constraints

- GitHub Pages serves only static files (no backend)
- Cannot use server-side redirects or URL rewriting
- Must work with Auth0 OAuth2 + PKCE flow
- Must maintain security properties of Auth0 callback handling
- Must support browser history and bookmarking

---

## Decision

**We will implement a dedicated `public/callback/` directory with its own `index.html` handler that specifically manages Auth0 callbacks and cleans URLs before redirecting to the main application.**

### Architecture Design

```
┌─────────────────────────────────────────────────────────────┐
│ Auth0 Authorization Server                                  │
│ (user authenticates and approves)                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Redirect with code + state
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ GitHub Pages Static Server                                  │
│ (receives /callback request)                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ public/callback/index.html (NEW)                            │
│ - Parse callback parameters (code, state)                   │
│ - Validate state parameter exists                           │
│ - Detect and handle errors (access_denied, server_error)    │
│ - Store callback metadata in sessionStorage                 │
│ - Replace URL to clean form: / (removes ?code=...&state=...) │
│ - Redirect to main app                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ React Application (Main App)                                │
│ - AuthContext detects callback flow (code in URL)           │
│ - Calls Auth0 SDK: handleRedirectCallback()                 │
│ - Auth0 SDK exchanges code for tokens (server-side)         │
│ - URL already cleaned by callback handler                   │
│ - Sets authenticated state                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ User sees clean URL + authenticated state                   │
│ Example: https://dgaudet.github.io/commentator-frontend/   │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Details

**1. Dedicated Callback Handler** (`public/callback/index.html`)
- Minimal HTML/JS that validates and processes Auth0 callbacks
- Handles both success and error scenarios
- Cleans URL using `history.replaceState()` before redirect
- Security: XSS prevention, open redirect prevention, state validation

**2. Auth0 Configuration Update**
```bash
VITE_AUTH0_REDIRECT_URI=https://dgaudet.github.io/commentator-frontend/callback/
```

**3. AuthContext Enhancement**
- Already calls `handleRedirectCallback()` at startup
- Adds URL cleanup after successful authentication
- Ensures state is properly set before user sees the app

**4. GitHub Pages Compatibility**
- GitHub Pages serves `/callback/index.html` when accessing `/callback/` path
- No special configuration needed (works by default)
- `404.html` remains for general SPA routing

---

## Consequences

### ✅ Positive Consequences

1. **Improved User Experience**
   - Clean URL after authentication: `/` instead of `/callback?code=...&state=...`
   - Professional appearance, less confusing
   - Users never see sensitive authorization parameters

2. **Security Benefits**
   - Sensitive `code` and `state` parameters not in browser history/address bar long-term
   - Explicit error handling prevents information leakage
   - XSS-safe error message display
   - Open redirect protection built-in

3. **Architectural Clarity**
   - Auth0 callback handling is explicit, not mixed with 404s
   - Separation of concerns: callback logic isolated from routing logic
   - Easier to understand and maintain
   - Clear responsibility boundaries

4. **Extensibility**
   - Callback handler can be enhanced independently (logging, analytics, etc.)
   - Error handling can be improved without affecting main app
   - Can add redirect strategy without routing complexity

5. **Developer Experience**
   - Clear file structure: `/callback/` is obviously for OAuth callbacks
   - Easier to debug callback issues
   - Pattern is reusable for other OAuth providers in future

### ⚠️ Negative Consequences

1. **File Structure Complexity**
   - Two HTML entry points instead of one (`404.html` + `callback/index.html`)
   - Slightly larger public directory footprint
   - *Mitigation*: Minimal code, negligible performance impact

2. **Maintenance Burden**
   - Callback handler must be kept in sync with Auth0 SDK changes
   - Error scenarios must be tested separately
   - *Mitigation*: Handler is simple and stable; errors are infrequent

3. **URL Cleanup Timing**
   - URL is cleaned after first redirect, not during callback
   - Brief moment where callback URL appears in history
   - *Mitigation*: Acceptable tradeoff; URL cleaned before user interaction

### 📊 Trade-off Analysis

| Factor | Benefit | Cost |
|--------|---------|------|
| **User Experience** | Clean URLs, professional | Minimal |
| **Security** | Better parameter protection | Negligible |
| **Architecture** | Clear separation | Slight complexity increase |
| **Performance** | No performance impact | No benefit |
| **Maintainability** | Easier to modify | Two files to maintain |

---

## Alternatives Considered

### Alternative 1: Enhanced 404.html with URL Cleaning
```html
<!-- In public/404.html -->
<script>
  if (window.location.pathname.endsWith('/callback')) {
    // Clean URL and redirect
    window.location.replace('/commentator-frontend/');
  }
</script>
```

**Pros**: Single file, minimal changes
**Cons**:
- Mixes Auth0 callback logic with general routing logic (poor separation)
- Semantically unclear (404 ≠ callback)
- Harder to extend for callback-specific needs
- Difficult to test callback errors separately

**Decision**: Rejected - violates architectural principles

### Alternative 2: Use Hash-Based Routing
```
https://dgaudet.github.io/commentator-frontend/#/callback?code=...&state=...
```

**Pros**: Works with GitHub Pages, URL parameter handling native
**Cons**:
- Hash-based routing is deprecated for SPAs
- Worse SEO (though not applicable here)
- Query parameters in hash are non-standard and fragile
- Auth0 expects path-based redirects

**Decision**: Rejected - poor architectural practice

### Alternative 3: Server-Side Redirect (AWS Lambda@Edge, Netlify, etc.)
```
Auth0 → CloudFront/Netlify → Clean URL → App
```

**Pros**: Enterprise-grade URL cleaning, more control
**Cons**:
- Requires paid infrastructure (not free)
- Adds deployment complexity
- Out of scope for current GitHub Pages deployment
- Over-engineered for this use case

**Decision**: Rejected - excessive infrastructure for GitHub Pages

### Alternative 4: Custom Domain with Subdomain for Callback
```
https://api.commentator.example.com/callback → clean URL handling
```

**Pros**: Separates callback domain from main app
**Cons**:
- Requires custom domain (cost, complexity)
- Auth0 configuration more complex
- Out of scope for GitHub Pages user

**Decision**: Rejected - unnecessary complexity, GitHub Pages focused

### Selected Alternative Rationale
**Option 1 (Dedicated Callback Handler)** was selected because it:
- Balances complexity and benefit appropriately
- Works within GitHub Pages constraints
- Provides clean architecture (separation of concerns)
- Improves security and UX
- Is maintainable and extensible
- Requires no additional infrastructure or costs

---

## Security Considerations

### OWASP Top 10 - OAuth Specific

| Threat | Mitigation | Implementation |
|--------|-----------|-----------------|
| **Credential Exposure** | Code/state not visible long-term | URL cleaned before user interaction |
| **CSRF Attacks** | State parameter validation | Auth0 SDK validates in `handleRedirectCallback()` |
| **Code Injection** | Parameter validation and sanitization | State/code presence verified before processing |
| **XSS via Error Messages** | HTML-encode error messages | `escapeHtml()` function applied to all error output |
| **Open Redirect** | Hardcoded redirect URL | No user-supplied redirect destinations |
| **Token Leakage** | Tokens never in URL | Only authorization code in URL (short-lived) |

### PKCE Flow Integrity

- OAuth2 PKCE (Proof Key for Code Exchange) handled entirely by Auth0 SDK
- Callback handler does NOT interfere with PKCE validation
- Server-side token exchange remains secure

### State Parameter Security

- State parameter validates that callback is genuine
- Callback handler validates state is present
- Auth0 SDK performs full PKCE validation
- Chain of trust: GitHub Pages → Callback Handler → Auth0 SDK → Tokens

---

## Implementation Plan

### Phase 1: Create Callback Handler (Development)
- [ ] Create `public/callback/index.html` with full implementation
- [ ] Implement parameter validation logic
- [ ] Add error handling and XSS prevention
- [ ] Add loading spinner UI
- [ ] Document security properties

### Phase 2: Update Configuration (Development)
- [ ] Update environment variables: `VITE_AUTH0_REDIRECT_URI`
- [ ] Verify Auth0 application configuration matches
- [ ] Test in development environment

### Phase 3: Test Callback Flow (Testing)
- [ ] Test successful authentication flow
- [ ] Test error scenarios (access_denied, server_error)
- [ ] Test URL is cleaned after auth completes
- [ ] Test browser back button behavior
- [ ] Test callback handler in isolation (unit tests)
- [ ] Test integration with AuthContext

### Phase 4: Deploy & Monitor (Deployment)
- [ ] Deploy to GitHub Pages
- [ ] Monitor Auth0 logs for callback issues
- [ ] Verify users see clean URLs post-authentication
- [ ] Monitor error rates

### Phase 5: Documentation (Documentation)
- [ ] Document callback handler in developer guide
- [ ] Document Auth0 configuration requirements
- [ ] Document troubleshooting common issues
- [ ] Update architecture documentation

---

## Rollback Strategy

If issues arise with callback handler implementation:

### Easy Rollback (Low Risk)
If callback handler has bugs:
1. Revert `public/callback/index.html` to previous version
2. No code changes needed
3. GitHub Pages automatically serves updated file
4. Minimal user impact

### Full Rollback (Emergency)
If callback pattern itself is problematic:
1. Redirect callback URL back to main app root
2. Process callback in React component instead of HTML
3. Update `VITE_AUTH0_REDIRECT_URI` to main app URL
4. AuthContext handles validation and URL cleaning

**Estimated rollback time**: < 15 minutes

---

## References

### OAuth2 & Security Standards
- [RFC 6749 - OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [RFC 7636 - Proof Key for Code Exchange (PKCE)](https://tools.ietf.org/html/rfc7636)
- [Auth0 Security Best Practices](https://auth0.com/docs/get-started/security-best-practices)

### Auth0 Documentation
- [Auth0 SPA SDK](https://auth0.com/docs/libraries/auth0-spa-js)
- [Auth0 Redirect After Login](https://auth0.com/docs/get-started/spa/vanillajs/add-login#create-a-callback-route)
- [Auth0 Error Handling](https://auth0.com/docs/get-started/spa/vanillajs/handle-errors)

### GitHub Pages Documentation
- [GitHub Pages - Custom 404 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-site)
- [GitHub Pages - Single Page Apps](https://github.blog/2013-04-09-github-pages-now-faster-and-simpler/)

### Web Security Standards
- [OWASP - Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [MDN - Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

### Related Architecture Decisions
- (None yet - this is the first ADR in this project)

---

## Decision Log

| Date | Stakeholder | Decision | Rationale |
|------|-------------|----------|-----------|
| 2026-01-18 | System Architect | **ACCEPTED** | Provides best balance of security, UX, and maintainability for GitHub Pages deployment |

---

## Questions & Answers

### Q: Why not use the Auth0 Universal Login page instead?
**A:** Universal Login adds an extra redirect and redirects back to your app URL anyway. We'd still need to handle the callback path. This design is simpler and more direct.

### Q: Is the authorization code exposed if stored in sessionStorage?
**A:** No - the code is never stored. It remains in the URL query parameters where the Auth0 SDK processes it. SessionStorage is only used for metadata. The code is never persisted.

### Q: What if the user has cookies disabled?
**A:** SessionStorage works independently of cookies. If JavaScript is disabled, the callback handler won't run, but the auth code is still in the URL for the next page load. The auth flow will still complete.

### Q: Can this be extended to other OAuth providers?
**A:** Yes - the pattern is generic enough to support multiple OAuth providers. You could create `public/callback/[provider]/index.html` subdirectories for different providers if needed.

### Q: What about the state parameter - is it secure?
**A:** The state parameter is validated entirely by the Auth0 SDK in `handleRedirectCallback()`. It prevents CSRF attacks by ensuring the callback matches the original authorization request. The callback handler just verifies it exists; the SDK validates its contents.

---

## Approval & Sign-Off

**Reviewed By**: Principal System Architect
**Status**: ✅ ACCEPTED
**Effective Date**: 2026-01-18

This ADR documents the approved architecture for Auth0 callback handling in the Commentator Frontend application deployed on GitHub Pages. Implementation should proceed according to the Implementation Plan.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-18
