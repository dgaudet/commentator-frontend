# Tech Note: Auth0 Callback Handler for GitHub Pages

**Feature**: auth0-callback-handler-github-pages
**Complexity**: L0 (Atomic)
**Status**: Ready for Implementation
**Created**: 2026-01-18
**Target Completion**: 2-3 days

---

## Executive Summary

This is an atomic implementation task to create a dedicated Auth0 callback handler for the Commentator Frontend application deployed on GitHub Pages. The handler validates OAuth2 parameters, manages errors gracefully, and cleans URLs before redirecting to the main app—all based on approved architecture (ADR-0001).

**Key Objective**: Enable secure, user-friendly OAuth2 callback handling while maintaining URL cleanliness and separation of concerns.

---

## User Stories

### US-1: Create Auth0 Callback Handler Page

**WHEN** Auth0 redirects to `/callback?code=...&state=...` after user authentication
**THE SYSTEM SHALL** display a minimal landing page that validates the callback parameters

**Acceptance Criteria:**
- [ ] `public/callback/index.html` exists and is served by GitHub Pages
- [ ] Page displays a loading spinner during callback processing
- [ ] Page validates that `state` parameter is present in URL
- [ ] Page logs callback receipt to console (for debugging)
- [ ] Page renders clean, valid HTML with no linting errors
- [ ] Page uses inline styles (no external CSS files to minimize HTTP requests)
- [ ] Page is < 5KB in size (minimal download footprint)

**Technical Details:**
- Minimal HTML/JS implementation
- No external dependencies (vanilla JavaScript only)
- Inline styles and scripts for GitHub Pages static hosting
- Loading spinner for user feedback during redirect

---

### US-2: Implement Callback Parameter Validation

**WHEN** the callback handler receives URL parameters
**THE SYSTEM SHALL** validate the presence of required OAuth2 parameters before processing

**Acceptance Criteria:**
- [ ] Validates `state` parameter exists (CSRF prevention)
- [ ] Extracts `code` parameter if present (success flow)
- [ ] Detects error scenarios: `error` and `error_description` parameters
- [ ] Stores `state` in sessionStorage for future reference (if needed)
- [ ] Does NOT store or expose the authorization `code` (security best practice)
- [ ] Handles malformed URLs gracefully (missing parameters, invalid encoding)
- [ ] Logs validation results to console for debugging

**Technical Details:**
- Use `URLSearchParams` API for parameter extraction
- Validate state parameter against CSRF tokens (if applicable)
- Detect error codes: `access_denied`, `server_error`, `unauthorized_client`
- Never log sensitive parameters (code, state values)

---

### US-3: Implement Error Handling and User-Friendly Error Messages

**WHEN** Auth0 returns an error response (e.g., user denies permission)
**THE SYSTEM SHALL** display a clear, user-friendly error message without exposing sensitive information

**Acceptance Criteria:**
- [ ] Detects `error` parameter in URL (error flow)
- [ ] Displays human-friendly error message to user
- [ ] Sanitizes error messages to prevent XSS attacks
- [ ] Provides a "Return to Login" button that redirects to main app
- [ ] Does NOT expose technical error details (like state values or request IDs)
- [ ] Logs error details to console (for developer debugging)
- [ ] Handles these specific errors:
  - `access_denied` → "Login cancelled. Please try again."
  - `server_error` → "Authentication service error. Please try again later."
  - Other errors → Generic message with error code logged
- [ ] All error messages HTML-encoded to prevent injection

**Technical Details:**
- Implement `escapeHtml()` utility function for HTML encoding
- Error message display via `textContent` (not `innerHTML`)
- "Return to Login" button redirects to main app root: `/commentator-frontend/`
- Clear console logs with timestamp and error context

---

### US-4: Implement URL Cleaning and Redirect Logic

**WHEN** callback validation succeeds or user acknowledges an error
**THE SYSTEM SHALL** clean the URL using `history.replaceState()` and redirect to the main application

**Acceptance Criteria:**
- [ ] After successful parameter validation, replaces URL using `history.replaceState()`
- [ ] Cleaned URL shows `/` (or `/commentator-frontend/` on GitHub Pages base path)
- [ ] Query parameters (`?code=...&state=...`) are removed from URL
- [ ] Redirect to main app occurs after 500ms (allows browser history to update)
- [ ] "Return to Login" button on error page redirects to main app
- [ ] Redirect target is hardcoded (prevents open redirect attacks)
- [ ] Browser back button works correctly (back button navigates to Auth0, not callback)
- [ ] Handles GitHub Pages base path correctly: `/commentator-frontend/`

**Technical Details:**
- Use `history.replaceState(null, '', newUrl)` for clean URLs
- Redirect implementation: `window.location.replace(targetUrl)`
- Target URL is hardcoded based on `window.location.origin` + base path
- No user-supplied input used in redirect destination

---

### US-5: Integrate Callback Handler with AuthContext

**WHEN** the main React app (AuthContext) initializes after callback redirect
**THE SYSTEM SHALL** detect the callback flow and complete authentication using Auth0 SDK

**Acceptance Criteria:**
- [ ] AuthContext `handleRedirectCallback()` is called at initialization
- [ ] Auth0 SDK processes the `code` parameter (still in URL during this call)
- [ ] Auth0 SDK exchanges code for tokens server-side (PKCE validation)
- [ ] URL is already cleaned by callback handler before user sees main app
- [ ] User sees authenticated state immediately after redirect
- [ ] No modifications needed to existing `handleRedirectCallback()` flow
- [ ] AuthContext handles both callback and non-callback initialization gracefully

**Technical Details:**
- AuthContext already calls `handleRedirectCallback()` in useEffect
- No code changes required for AuthContext (current implementation is correct)
- Callback handler passes control to React app with clean URL
- Auth0 SDK handles PKCE validation server-side

---

### US-6: Environment Configuration and Documentation

**WHEN** the application is configured for deployment
**THE SYSTEM SHALL** have correct environment variables and deployment instructions

**Acceptance Criteria:**
- [ ] `VITE_AUTH0_REDIRECT_URI` is set to `https://dgaudet.github.io/commentator-frontend/callback/`
- [ ] `.env.example` documents this environment variable
- [ ] Documentation explains the callback handler purpose and flow
- [ ] Deployment guide mentions the callback handler setup
- [ ] Auth0 dashboard is configured with matching redirect URI
- [ ] Multiple environment support (dev, staging, production) documented

**Technical Details:**
- Environment variable: `VITE_AUTH0_REDIRECT_URI`
- Redirect URI format: `{origin}/commentator-frontend/callback/`
- For GitHub Pages: `https://dgaudet.github.io/commentator-frontend/callback/`
- For local dev: `http://localhost:5173/callback/`

---

## Implementation Checklist

### Phase 1: Create Callback Handler (Frontend Engineer)

- [ ] **TASK-1.1**: Create `public/callback/index.html` with HTML structure
  - [ ] Valid HTML5 document structure
  - [ ] Inline CSS with loading spinner styles
  - [ ] Inline JavaScript for validation logic
  - [ ] Passes linting validation
  - [ ] < 5KB file size

- [ ] **TASK-1.2**: Implement parameter validation logic
  - [ ] Extract `code` and `state` from URL
  - [ ] Detect error parameters (`error`, `error_description`)
  - [ ] Validate state parameter exists
  - [ ] Store state in sessionStorage (if needed)
  - [ ] Log validation to console

- [ ] **TASK-1.3**: Implement error handling
  - [ ] Implement `escapeHtml()` utility function
  - [ ] Create error message handler
  - [ ] Display error UI when needed
  - [ ] Add "Return to Login" button for errors
  - [ ] Test XSS prevention with malicious error messages

- [ ] **TASK-1.4**: Implement URL cleaning and redirect
  - [ ] Use `history.replaceState()` to clean URL
  - [ ] Implement redirect logic with 500ms delay
  - [ ] Handle GitHub Pages base path correctly
  - [ ] Verify browser back button works

### Phase 2: Update Configuration (Frontend Engineer)

- [ ] **TASK-2.1**: Update `.env.example`
  - [ ] Document `VITE_AUTH0_REDIRECT_URI`
  - [ ] Set value: `https://dgaudet.github.io/commentator-frontend/callback/`
  - [ ] Add comments explaining callback handler purpose

- [ ] **TASK-2.2**: Verify Auth0 configuration
  - [ ] Confirm Auth0 dashboard has callback URI configured
  - [ ] Verify redirect URI matches environment variable
  - [ ] Test in development environment first

### Phase 3: Test Callback Flow (QA Engineer)

- [ ] **TASK-3.1**: Unit tests for callback handler
  - [ ] Test parameter extraction (code, state, error)
  - [ ] Test error message sanitization (XSS prevention)
  - [ ] Test URL cleaning logic
  - [ ] Test edge cases (missing params, malformed URLs)
  - [ ] All tests pass; no errors or warnings

- [ ] **TASK-3.2**: Integration tests
  - [ ] Test full callback flow with mocked Auth0 response
  - [ ] Test successful authentication path
  - [ ] Test error scenarios (access_denied, server_error)
  - [ ] Test URL is clean after redirect to main app
  - [ ] Test browser back button behavior

- [ ] **TASK-3.3**: Manual testing
  - [ ] Test with real Auth0 in development environment
  - [ ] Verify user sees clean URL post-authentication
  - [ ] Verify error messages are user-friendly
  - [ ] Verify redirect to main app works correctly
  - [ ] Test on multiple browsers (Chrome, Firefox, Safari)

### Phase 4: Documentation and Deployment

- [ ] **TASK-4.1**: Create deployment documentation
  - [ ] Document callback handler architecture
  - [ ] Create troubleshooting guide for common issues
  - [ ] Document environment variable setup
  - [ ] Add diagrams showing callback flow

- [ ] **TASK-4.2**: Deploy to GitHub Pages
  - [ ] Build and test locally
  - [ ] Verify lint passes
  - [ ] Merge to main branch
  - [ ] Verify deployment to GitHub Pages
  - [ ] Test in production environment

---

## Risk Assessment

### Risk: Low
- **Why**: Isolated implementation, no impact on existing auth flow
- **Mitigation**: Thorough testing of callback scenarios before deployment

### Edge Cases to Handle
1. **Network failure during redirect** → Timeout and display error
2. **User closes tab during callback** → No issue (callback happens server-side)
3. **Auth0 API changes** → Minimal coupling, easy to update
4. **GitHub Pages down** → User sees GitHub Pages error page (acceptable)
5. **Malicious error parameters** → HTML encoding prevents XSS

### Security Considerations (from ADR-0001)
- [ ] XSS Prevention: All error messages HTML-encoded
- [ ] Open Redirect Prevention: Hardcoded redirect destination
- [ ] CSRF Prevention: State parameter validated by Auth0 SDK
- [ ] Credential Exposure Prevention: Code/state cleaned from URL immediately
- [ ] PKCE Validation: Handled entirely by Auth0 SDK (server-side)

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Callback Success Rate** | 100% | Auth0 logs show all callbacks processed |
| **URL Cleanliness** | Users never see `?code=` in final URL | QA manual testing confirms clean URLs |
| **Error Handling** | All error scenarios display user-friendly messages | Test each Auth0 error code |
| **Security** | Zero XSS vulnerabilities in error handling | Security scan + manual testing |
| **Performance** | Callback completes in < 2 seconds | Performance monitoring in logs |
| **Test Coverage** | ≥ 80% code coverage for callback handler | Jest coverage reports |

---

## Development Approach (TDD)

Follow the Red-Green-Refactor cycle:

1. **Red Phase**: Write test that verifies callback handler validates parameters
   ```javascript
   test('should validate state parameter exists', () => {
     // Test implementation
   })
   ```

2. **Green Phase**: Implement minimal code to pass the test
   ```javascript
   const validateCallbackParams = (url) => {
     // Implementation
   }
   ```

3. **Refactor Phase**: Improve code quality while keeping tests green
   ```javascript
   // Refactor for clarity and maintainability
   ```

4. **Repeat** for each user story acceptance criterion

---

## Dependencies & Constraints

### No External Dependencies
- Vanilla JavaScript only (no libraries)
- Auth0 SDK integration at React app level (AuthContext)
- GitHub Pages static hosting (no backend)

### Environmental Constraints
- Must work with GitHub Pages static file serving
- Must work with Auth0 OAuth2 + PKCE flow
- Base path: `/commentator-frontend/` (GitHub Pages project name)

### Deployment Constraints
- Must pass linting before merge
- Must have ≥ 80% test coverage
- All 1855 existing tests must still pass
- Build must complete successfully

---

## Acceptance Criteria Summary

The feature is complete and ready for production when:

1. ✓ `public/callback/index.html` exists and is < 5KB
2. ✓ All callback parameters are validated correctly
3. ✓ Error scenarios display user-friendly messages (no XSS)
4. ✓ URLs are cleaned using `history.replaceState()`
5. ✓ Redirects work correctly with GitHub Pages base path
6. ✓ AuthContext integrates seamlessly (no changes needed)
7. ✓ All unit and integration tests pass
8. ✓ Manual QA confirms full callback flow works end-to-end
9. ✓ No lint errors or warnings
10. ✓ Existing test suite (1855 tests) still passes
11. ✓ Documentation is updated and clear
12. ✓ Code review approved by team lead

---

## Notes for Frontend Engineer

### Architecture Context
- This feature is based on approved ADR-0001
- System Architect has validated the design
- Security properties are well-defined and documented
- GitHub Pages constraints are well-understood

### Key Files
- **Main Implementation**: `public/callback/index.html`
- **Configuration**: `.env.example`, `src/config/authConfig.ts`
- **Testing**: Unit tests in `src/utils/__tests__/callbackHandler.test.ts`
- **Documentation**: `docs/adr/0001-auth0-callback-handler-github-pages.md`

### Important Context
- Auth0 SDK is already integrated (version ^2.9.1)
- AuthContext already calls `handleRedirectCallback()` (no changes needed)
- GitHub Pages base path is `/commentator-frontend/`
- All 1855 tests must pass before deployment

### Questions?
Refer to ADR-0001 for architecture rationale and design decisions. Contact Product Owner if requirements need clarification.

---

## Sign-Off

**Prepared By**: Principal Product Owner
**Date**: 2026-01-18
**Complexity Assessment**: L0 (Atomic)
**Ready for Implementation**: ✅ YES
**Handoff Target**: Principal Frontend Engineer

**Next Action**: Hand off to Frontend Engineer for test-driven implementation.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-18
