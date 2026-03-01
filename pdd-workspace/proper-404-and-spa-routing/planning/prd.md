# Product Requirements Document
## GitHub Pages SPA Routing & 404 Page

**Feature**: Proper 404 Page & SPA Routing for GitHub Pages
**Status**: Planning Complete
**Complexity**: L1 (Micro)
**Duration**: 1-2 weeks
**Owner**: Single Developer

---

## Problem Statement

The React SPA application is deployed to GitHub Pages at `https://dgaudet.github.io/commentator-frontend/` but SPA routing doesn't work correctly:

- Direct navigation to `/signup`, `/callback`, or undefined routes fails with GitHub Pages 404
- GitHub Pages returns the default 404 page instead of routing to index.html
- Users cannot access the signup page via URL or bookmarks
- Callback flow may break during OAuth redirect

---

## Goals

✅ **Primary**: Enable SPA routing on GitHub Pages so all routes render index.html
✅ **Secondary**: Create a proper branded 404 page for undefined routes
✅ **Tertiary**: Verify all 4 routes work correctly in production deployment

---

## Routes to Support

| Route | Type | Status |
|-------|------|--------|
| `/` | Public | Main page (dashboard/app home) |
| `/signup` | Public | User registration |
| `/callback` | Public | OAuth callback handler |
| `/login` | Protected | Login page |
| (others) | Any | Show 404 page |

---

## Success Metrics

- ✅ All 4 routes accessible via direct URL in GitHub Pages
- ✅ Refresh on any route does not show GitHub Pages 404
- ✅ OAuth callback flow completes successfully
- ✅ Branded 404 page displays for undefined routes
- ✅ React Router navigation works client-side

---

## Technical Context

**Deployment**: GitHub Pages (subdirectory: `/commentator-frontend/`)
**Build Tool**: Vite
**Router**: React Router
**Current State**:
- 404.html exists in `/public` but not configured
- Vite base path may not be set correctly
- React Router may not have basename configured

---

## Solution Approach

1. **Configure Vite** with correct base path for subdirectory deployment
2. **Configure React Router** with matching basename
3. **Setup GitHub Pages 404 redirect** using 404.html to route to index.html
4. **Create NotFound component** for 404 page experience
5. **Test all routes** on deployed GitHub Pages

---

## User Stories

See `user-stories.md` for detailed acceptance criteria.

---

## Acceptance Criteria (Feature Level)

- [ ] User can navigate to `/signup` via browser URL and see signup page
- [ ] User can navigate to `/callback` via direct URL and see callback handler
- [ ] User receives branded 404 page when visiting undefined routes
- [ ] Refreshing page on any route maintains the correct view
- [ ] OAuth callback flow completes successfully
- [ ] All routes work in GitHub Pages production deployment

---

## Dependencies & Risks

**Dependencies**: None (self-contained feature)

**Risks**:
- GitHub Pages caching of 404.html (mitigation: force browser cache clear in testing)
- React Router basename mismatch with Vite base (mitigation: explicit configuration)

**Out of Scope**:
- Protected route authentication/authorization
- Login route behavior (assumed to work currently)

