# Intent: Migrate to Auth0 Universal Login with Dashboard Branding

**Feature**: Auth0 Universal Login Integration - Level 1 (Dashboard Branding)
**Version**: 1.0
**Date**: 2026-02-22
**Status**: INTENT_REFINEMENT

## Executive Summary

Replace Auth0 Lock widget (embedded login) with Auth0 Universal Login (hosted login page) and customize branding through the Auth0 Dashboard. This eliminates architectural complexity, adopts Auth0's recommended pattern, and provides a cleaner authentication system.

## Problem Statement

**Current State**: The app uses two incompatible OAuth2 paradigms:
- LoginPage: Auth0 Lock widget (embedded login) - legacy, no new features
- AuthContext: auth0-spa-js (SPA SDK) - modern, recommended pattern

**Issues**:
- Mixing Lock and SPA SDK creates state management confusion
- Lock is in maintenance-only mode (no new features from Auth0)
- Two separate SDK instances complicate testing and configuration
- Non-standard OAuth2 implementation not documented by Auth0
- Callback page complexity due to mixed paradigms

## Solution Overview

**Adopt Universal Login** (official Auth0 recommended pattern):
1. Remove Auth0 Lock from LoginPage
2. Update AuthContext to use `auth0-spa-js` with `loginWithRedirect()` → Universal Login
3. Customize branding via Auth0 Dashboard (colors, logo, fonts)
4. Simplify CallbackPage (now just a loading state)

## Business Value

| Value | Impact |
|-------|--------|
| **Simplified Architecture** | One SDK, one paradigm, fewer bugs |
| **Future-Proof** | Adopt Auth0's officially recommended approach |
| **Reduced Maintenance** | No Lock updates needed; SPA SDK actively supported |
| **Better UX** | Consistent branding across all auth flows |
| **Time Savings** | Level 1 dashboard customization = 10 minutes |

## Scope

### In Scope ✅
- Remove Auth0 Lock widget from LoginPage
- Update AuthContext to use Universal Login flow
- Configure dashboard branding (colors, logo, fonts)
- Simplify CallbackPage UX
- Update tests to reflect new flow

### Out of Scope ❌
- Level 2 CLI customization (future phase)
- Level 3 full page templates (future phase)
- Auth0 organization/tenant configuration
- Social login configuration

## Technical Approach

### Architecture Change

```
BEFORE (Mixed paradigms):
LoginPage (Lock) → Auth0 → CallbackPage → AuthContext (SPA SDK)
                 ↓ State confusion, complex handoff

AFTER (Single paradigm):
LoginPage (button) → AuthContext (loginWithRedirect) → Universal Login
                    ↓ Clean handoff, official pattern
```

### Key Changes

1. **LoginPage**:
   - Remove: Auth0Lock widget initialization
   - Add: Simple "Log In" button that calls `auth0Client.loginWithRedirect()`
   - Result: ~10 lines instead of ~80

2. **AuthContext**:
   - Already has auth0-spa-js client
   - Add: `loginWithRedirect()` call (not `loginWithRedirect()` with Lock)
   - Remove: Lock-specific configuration

3. **CallbackPage**:
   - Keep: handleRedirectCallback() flow
   - Simplify: No longer needs to coordinate between Lock and SPA SDK
   - Result: More reliable callback handling

4. **Branding**:
   - Auth0 Dashboard: Set primary color (#667eea), logo, fonts
   - No code changes needed

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Callback flow breaks | Low | High | Test redirect flow thoroughly |
| State validation fails | Low | High | Test with real Auth0 tenant |
| Logo/colors don't show | Very Low | Low | Verify Asset URLs are public |
| Token exchange fails | Very Low | High | Auth0 compatibility test |

## Success Criteria

✅ LoginPage uses Universal Login (no Lock widget)
✅ Auth0 redirects to hosted login page
✅ CallbackPage handles redirect correctly
✅ Tokens exchanged and stored properly
✅ User redirected to home page on success
✅ Error handling works (invalid credentials, timeouts)
✅ All existing tests pass
✅ Branding visible on Auth0 login page (colors, logo)

## Dependencies

- ✅ Existing: auth0-spa-js SDK already installed
- ✅ Existing: AuthContext already implemented
- ✅ Existing: CallbackPage already exists
- ⚠️ Required: Auth0 Dashboard access to configure branding
- ⚠️ Required: Public URLs for logo image

## Effort Estimate

| Phase | Task | Effort |
|-------|------|--------|
| Implementation | Remove Lock + Update AuthContext | 1-2 hours |
| Testing | Unit + Integration tests | 1 hour |
| Deployment | Configure Auth0 Dashboard branding | 15 minutes |
| Total | | **2.5 hours** |

## Assumptions

1. Auth0 Dashboard has branding settings available
2. Logo image URL is public and accessible
3. Existing CallbackPage can be reused with minimal changes
4. All tests can be updated to work with Universal Login
5. No custom Auth0 organizations/tenants in use

## Next Steps

1. **Phase 1 (Planning)**: Review this spec and confirm approach
2. **Phase 2 (Design)**: Create detailed design document with code structure
3. **Phase 3 (Implementation)**: Execute tasks in order
4. **Phase 4 (Validation)**: Test with real Auth0 tenant

---

**Confidence Level**: 95% (well-established pattern, official Auth0 recommendation)
**Ready to Proceed**: Yes - recommend moving to design phase
