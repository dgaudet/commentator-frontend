# Requirements: Auth0 Universal Login - Level 1

**Feature**: Migrate to Auth0 Universal Login with Dashboard Branding
**Version**: 1.0
**Format**: EARS (Event, Action, Result) notation

## User Stories

### Story 1: Remove Legacy Lock Widget
**Title**: LoginPage should use Universal Login instead of embedded Lock widget

**EARS Format**:
- WHEN user navigates to /login
- THE SYSTEM SHALL redirect to Auth0's Universal Login page
- AND SYSTEM SHALL NOT render Auth0 Lock widget locally

**Acceptance Criteria**:
- [ ] LoginPage.tsx does not import Auth0Lock
- [ ] No Lock instance created on LoginPage
- [ ] /login route renders a redirect to Universal Login (or simple loading state)
- [ ] Lock styles are removed from LoginPage.module.css
- [ ] No Lock-related dependencies in LoginPage

**Implementation Notes**:
- Remove: `import Auth0Lock from 'auth0-lock'`
- Remove: Lock initialization logic (useEffect, ref, etc.)
- Remove: `requestAnimationFrame` for Lock.show()
- Keep: Route exists at /login

---

### Story 2: Implement Universal Login Flow
**Title**: AuthContext should handle Universal Login OAuth2 flow

**EARS Format**:
- WHEN user clicks login
- THE SYSTEM SHALL call auth0Client.loginWithRedirect()
- AND SYSTEM SHALL redirect user to Auth0's Universal Login page
- AND user authenticates with Auth0
- AND Auth0 redirects back to /callback with authorization code
- AND SYSTEM SHALL exchange code for tokens
- AND SYSTEM SHALL redirect user to home page

**Acceptance Criteria**:
- [ ] login() function calls auth0Client.loginWithRedirect()
- [ ] Redirect flow completes successfully
- [ ] Authorization code received at /callback
- [ ] handleRedirectCallback() processes code correctly
- [ ] Access token obtained and stored
- [ ] isAuthenticated flag set to true
- [ ] User redirected to home page (returnTo param respected)

**Implementation Notes**:
- Update login function in AuthContext
- Ensure authorizationParams includes scope, audience
- Callback page already has redirect logic

---

### Story 3: Handle Authentication Callback
**Title**: CallbackPage should reliably handle Auth0 redirect

**EARS Format**:
- WHEN user is redirected from Auth0 with authorization code
- THE SYSTEM SHALL extract code and state from URL
- AND SYSTEM SHALL validate state parameter
- AND SYSTEM SHALL exchange code for tokens via handleRedirectCallback()
- AND SYSTEM SHALL wait for AuthContext to complete auth
- AND SYSTEM SHALL redirect user to home page
- WHEN authentication fails
- THE SYSTEM SHALL display error message and link to retry

**Acceptance Criteria**:
- [ ] Code parameter extracted from URL
- [ ] State parameter extracted from URL
- [ ] handleRedirectCallback() called with parameters
- [ ] Timeout prevents infinite waiting (8 seconds)
- [ ] isAuthenticated state monitored
- [ ] Redirect to home page (or returnTo) on success
- [ ] Error display on failure
- [ ] Error timeout display if auth exceeds 8 seconds

**Implementation Notes**:
- CallbackPage.tsx mostly already implemented
- May simplify error handling since no Lock complexity

---

### Story 4: Configure Dashboard Branding
**Title**: Admin should configure Universal Login branding via Auth0 Dashboard

**EARS Format**:
- WHEN admin accesses Auth0 Dashboard
- AND navigates to Branding > Universal Login > Customization Options
- AND sets primary color to #667eea
- AND uploads logo image
- AND saves settings
- THE SYSTEM SHALL display branded login page with colors and logo
- AND SYSTEM SHALL maintain branding across all login flows (login, signup, MFA)

**Acceptance Criteria**:
- [ ] Primary accent color set to #667eea (from design tokens)
- [ ] Logo uploaded (min 2000px wide, JPEG format)
- [ ] Font selection matches app theme
- [ ] Branding visible on Universal Login page
- [ ] Settings persisted after save
- [ ] Branding consistent across all auth prompts

**Implementation Notes**:
- Manual configuration in Auth0 Dashboard
- Not code-based, but should be documented
- Logo URL must be publicly accessible
- Color must match design system tokens

---

### Story 5: Maintain Existing Auth Features
**Title**: All existing authentication features continue working

**EARS Format**:
- WHEN user logs in successfully
- THE SYSTEM SHALL provide access token and user info
- AND user can call protected APIs
- WHEN user logs out
- THE SYSTEM SHALL clear tokens and redirect to /login
- WHEN user's session expires
- THE SYSTEM SHALL silently refresh token via getTokenSilently()
- AND SYSTEM SHALL retrieve new token without user interaction
- WHEN API call requires fresh token
- THE SYSTEM SHALL automatically obtain new token

**Acceptance Criteria**:
- [ ] getAccessToken() function works
- [ ] getTokenSilently() refresh works
- [ ] logout() function clears state
- [ ] Access token sent in API requests
- [ ] Token refresh handled automatically
- [ ] No manual token management required

**Implementation Notes**:
- AuthContext already has these features
- No changes needed to token management
- Verify with existing test suite

---

### Story 6: Update Tests for Universal Login
**Title**: Test suite should verify Universal Login flow

**EARS Format**:
- WHEN running test suite
- THE SYSTEM SHALL verify loginWithRedirect() is called
- AND SYSTEM SHALL mock Auth0 redirect response
- AND SYSTEM SHALL verify handleRedirectCallback() processes code
- AND SYSTEM SHALL verify tokens are obtained
- WHEN running CallbackPage tests
- THE SYSTEM SHALL verify isAuthenticated state monitoring
- AND SYSTEM SHALL verify redirect on success
- AND SYSTEM SHALL verify error handling

**Acceptance Criteria**:
- [ ] LoginPage tests updated (no Lock references)
- [ ] AuthContext tests verify loginWithRedirect() call
- [ ] CallbackPage tests verify redirect flow
- [ ] Mock responses match OAuth2 standard
- [ ] All existing tests pass
- [ ] No Skip() tests
- [ ] Code coverage maintained above 80%

**Implementation Notes**:
- Update existing test mocks
- Remove Lock widget tests
- Add Universal Login flow tests
- Verify with npm run test

---

## Non-Functional Requirements

### Security
- **REQ-SEC-001**: State parameter must be validated (OAuth2 CSRF protection)
- **REQ-SEC-002**: Tokens must be stored securely (Auth0 SDK handles)
- **REQ-SEC-003**: No tokens exposed in URL (PKCE authorization code flow)
- **REQ-SEC-004**: HTTPS required for redirect URIs

### Performance
- **REQ-PERF-001**: Login redirect completes in < 2 seconds
- **REQ-PERF-002**: Token exchange completes in < 3 seconds
- **REQ-PERF-003**: CallbackPage responds within 8 seconds
- **REQ-PERF-004**: No unnecessary network requests

### Reliability
- **REQ-REL-001**: Callback page handles slow networks (8 second timeout)
- **REQ-REL-002**: Error handling covers Auth0 API failures
- **REQ-REL-003**: State validation prevents CSRF attacks
- **REQ-REL-004**: Graceful degradation if Auth0 unavailable

### Maintainability
- **REQ-MAINT-001**: Single OAuth2 SDK instance (not two)
- **REQ-MAINT-002**: Official Auth0 pattern (well-documented)
- **REQ-MAINT-003**: No custom state management (Auth0 SDK handles)
- **REQ-MAINT-004**: ESLint and Stylelint pass

### Compatibility
- **REQ-COMPAT-001**: Works across all modern browsers
- **REQ-COMPAT-002**: Works on mobile devices
- **REQ-COMPAT-003**: No breaking changes to existing API

---

## Edge Cases & Validation

### Invalid State
- **CASE-001**: State parameter missing
  - WHEN state missing from callback URL
  - THEN handleRedirectCallback() should throw error
  - AND CallbackPage should display error message
  - AND error should not crash application

### Code Exchange Failures
- **CASE-002**: Code expired during exchange
  - WHEN code older than 10 minutes
  - THEN Auth0 returns error
  - AND CallbackPage should catch error
  - AND display "Authentication failed, try again" message
  - AND provide retry link

### Network Issues
- **CASE-003**: Slow network during callback
  - WHEN network latency > 5 seconds
  - THEN CallbackPage should show loading state
  - AND wait up to 8 seconds for auth completion
  - AND display timeout error if not completed

### Rate Limiting
- **CASE-004**: Too many login attempts
  - WHEN user attempts login 10+ times per minute
  - THEN Auth0 may rate limit
  - AND CallbackPage should display auth service error
  - AND provide feedback to try again later

### Browser Back Button
- **CASE-005**: User clicks back from Auth0 login page
  - WHEN user navigates away from Auth0 login
  - THEN callback is not triggered
  - AND user returns to app
  - AND no errors occur
  - AND can retry login

---

## Traceability

| ID | Requirement | Test | Status |
|----|-------------|------|--------|
| REQ-1 | Remove Lock widget | Story 1 | Pending |
| REQ-2 | Implement Universal Login | Story 2 | Pending |
| REQ-3 | Handle callback | Story 3 | Pending |
| REQ-4 | Dashboard branding | Story 4 | Pending |
| REQ-5 | Maintain auth features | Story 5 | Pending |
| REQ-6 | Update tests | Story 6 | Pending |

---

## Approval & Sign-Off

**Product Owner**: [Pending review]
**Technical Lead**: [Pending review]
**Security Review**: [Pending review]

**Status**: READY FOR DESIGN PHASE
