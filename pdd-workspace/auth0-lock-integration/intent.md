# Auth0 Lock Widget Integration - Canonical Specification

**Feature**: Replace external Auth0 login with embedded Auth0 Lock Widget
**Status**: INTENT_REFINEMENT
**Complexity**: L2 (Low)
**Created**: 2026-02-15

## Problem Statement

Currently, the LoginPage redirects users to Auth0's hosted login page via an external link. This creates a poor user experience:
- ❌ Users leave the application context
- ❌ Cannot apply custom branding and design tokens
- ❌ Missing built-in sign up, passwordless, and social login options
- ❌ Inconsistent with the rest of the application styling

## Vision

Embed Auth0's Lock Widget directly in the LoginPage to provide:
- ✅ Seamless in-app authentication experience
- ✅ Application design system styling (design tokens)
- ✅ Professional, accessible authentication UI
- ✅ Zero changes to CallbackPage (existing flow works)
- ✅ Zero changes to existing `/signup` route (preserved)

## Success Criteria

1. **User Experience**
   - Users see styled login form matching application design
   - Sign up option available without leaving app
   - Form validates and provides clear error messages
   - Loading states indicate authentication in progress

2. **Integration**
   - Lock Widget embedded in LoginPage component
   - Redirects to `/callback` after successful auth
   - Existing CallbackPage handles token exchange (no changes)
   - Responsive design on mobile, tablet, desktop

3. **Design System**
   - Primary color from design tokens
   - Application fonts and spacing
   - Dark mode support via theme hook
   - WCAG 2.1 AA accessibility compliance

4. **Code Quality**
   - Component tested with 15+ test cases
   - TypeScript strict mode
   - TDD-first implementation (Red-Green-Refactor)
   - All tests passing before merge

## Feature Scope

### Included ✅
- Auth0 Lock Widget integration (for login only)
- LoginPage redesign with Lock
- Theme/design token application
- Email/password authentication
- Responsive design
- Component tests
- Error handling
- "Create Account" link redirects to existing `/signup` route

### Out of Scope ❌
- Sign up in Lock Widget (using existing `/signup` route instead)
- Social login integration (future enhancement)
- Passwordless authentication (future enhancement)
- MFA/2FA (future enhancement)
- Changes to CallbackPage
- Changes to existing auth flow
- Changes to existing /signup route

## Key Design Decisions

1. **Embed Lock in LoginPage**: Full control over styling and layout
2. **Lock Modal vs. Embedded**: Embedded in page for better UX
3. **Design Tokens**: Apply `themeColors.primary.main` to Lock widget
4. **Sign Up**: Lock shows login only (no signup tab) - preserves existing `/signup` route
5. **Hero Section**: Keep existing design (left side) and add Lock on right
6. **Create Account Link**: Below Lock Widget directs to existing `/signup` route

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Lock widget styling limited | Medium | Use CSS class overrides for custom styling |
| Lock theme not theme-aware | Medium | Extract primary color from useThemeColors hook |
| Lock conflicts with existing form | Medium | Replace LoginPage form with Lock entirely |
| Callback flow breaks | High | Thoroughly test callback redirect flow |

## Dependencies

- `auth0-lock` npm package (already in project)
- Auth0 configuration (already set up)
- Existing CallbackPage implementation
- Design tokens (useThemeColors hook)

## Effort Estimate

- Design & Architecture: Complete (this document)
- Implementation: 4-6 hours
- Testing: 2-3 hours
- Code Review & Polish: 1-2 hours
- **Total**: 1-2 days for frontend engineer

## Next Steps

1. ✅ Specification (this document)
2. → Frontend Engineer reviews requirements.md
3. → Frontend Engineer reviews design.md
4. → Frontend Engineer executes tasks.md (TDD-first)
5. → All tests passing
6. → Code review and merge
