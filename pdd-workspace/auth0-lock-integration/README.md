# Auth0 Lock Widget Integration - PDD Specification

**Status**: Ready for Frontend Engineer Implementation
**Complexity**: L2 (Low)
**Estimated Duration**: 8-12 hours
**Test Coverage**: 20 test cases
**Risk Level**: Low-Medium

---

## 📋 How to Use This Specification

This folder contains a complete Persona-Driven Development (PDD) specification for integrating Auth0 Lock Widget into the LoginPage. It's designed for the **Frontend Engineer** to execute following **Test-Driven Development (TDD)** practices.

### Document Structure

1. **intent.md** - Problem statement, vision, and high-level approach
2. **requirements.md** - 10 user stories in EARS notation format
3. **design.md** - Technical architecture, component design, and integration patterns
4. **tasks.md** - 5 implementation tasks with TDD phases (RED → GREEN → REFACTOR)
5. **state.json** - Machine-readable state and progress tracking
6. **README.md** - This file

---

## 🎯 Quick Start for Frontend Engineer

### Before You Begin
1. Read **intent.md** (5 minutes) - Understand the problem and vision
2. Skim **requirements.md** (5 minutes) - See the user stories
3. Study **design.md** (15 minutes) - Understand the technical approach
4. Review **tasks.md** carefully (15 minutes) - See implementation approach

### Implementation Approach
Follow **tasks.md** exactly as written:

1. **Create feature branch**: `git checkout -b feat/auth0-lock-integration`

2. **TASK 1**: Set Up Lock Widget Component Base
   - Write 6 failing tests (RED phase)
   - Implement LoginPage component (GREEN phase)
   - Refactor for quality (REFACTOR phase)
   - Run `npm run test` - all 6 tests should pass

3. **TASK 2**: Add Responsive Layout & Styling
   - Write 5 failing tests (RED phase)
   - Add responsive CSS (GREEN phase)
   - Refactor for maintainability (REFACTOR phase)
   - Run `npm run test` - all 11 tests should pass

4. **TASK 3**: Integration with Auth Flow & Error Handling
   - Write 4 failing tests (RED phase)
   - Add error handling logic (GREEN phase)
   - Refactor for clarity (REFACTOR phase)
   - Run `npm run test` - all 15 tests should pass

5. **TASK 4**: Comprehensive Test Suite & Accessibility
   - Write 5 accessibility/additional tests (RED phase)
   - Add accessibility features (GREEN phase)
   - Refactor and organize tests (REFACTOR phase)
   - Run `npm run test` - all 20 tests should pass

6. **TASK 5**: Final Integration & Cleanup
   - Run full test suite
   - Run lint checks
   - Run TypeScript check
   - Run build
   - Verify manually in browser

---

## 🔑 Key Points

### What You're Building
- **Component**: `src/pages/LoginPage.tsx` (replacing current implementation)
- **Styling**: `src/pages/LoginPage.module.css` (new responsive styles)
- **Tests**: `src/pages/__tests__/LoginPage.component.test.tsx` (20 test cases)

### What You're NOT Changing
- ✅ CallbackPage (existing callback flow works unchanged)
- ✅ App.tsx routing (routes already exist)
- ✅ Auth context/utilities (no changes needed)
- ✅ Design token system (just using existing colors)

### TDD Approach
Each task follows the **Red-Green-Refactor cycle**:
1. **RED**: Write tests that fail
2. **GREEN**: Write minimal code to pass tests
3. **REFACTOR**: Improve code quality while keeping tests green

### Testing Strategy
- **20 total test cases** covering:
  - Component rendering (6 tests)
  - Responsive design (5 tests)
  - Authentication flow (4 tests)
  - Accessibility (5 tests)

### Design Token Integration
The Lock Widget primary color comes from your existing design system:
```typescript
const { primary } = useThemeColors();
// Pass to Lock: theme: { primaryColor: primary.main }
```

---

## 📊 Architecture Overview

```
Current (External Auth0)        →    New (Embedded Lock)
┌─────────────────────┐             ┌──────────────────┐
│ LoginPage           │             │ LoginPage        │
├─────────────────────┤             ├──────────────────┤
│ Email input         │             │ Hero Section     │
│ Password input      │             │ (optional left)  │
│ External link       │    →        │                  │
│ "Login with Auth0"  │             │ Lock Widget      │
└─────────────────────┘             │ (right column)   │
         ↓                          │                  │
User leaves app                     │ - Login tab      │
         ↓                          │ - Sign up tab    │
Auth0 hosted page                   │ - Error handling │
         ↓                          └──────────────────┘
/callback redirect                           ↓
         ↓                          Lock handles auth
Existing CallbackPage               (no changes needed)
         ↓                                    ↓
Authenticated user                  /callback redirect
                                            ↓
                                 Existing CallbackPage
                                            ↓
                                 Authenticated user
```

---

## ✅ Definition of Done

Before submitting code review, verify:
- [ ] All 20 tests passing: `npm run test`
- [ ] Full test suite passing (no regressions): `npm run test`
- [ ] TypeScript strict mode: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] Build passes: `npm run build`
- [ ] Manually tested in browser:
  - [ ] LoginPage loads without errors
  - [ ] Lock Widget visible
  - [ ] Can enter credentials
  - [ ] Can click Sign Up tab
  - [ ] Mobile view works (360px)
  - [ ] Tablet view works (768px)
  - [ ] Desktop view works (1200px)
- [ ] Code review checklist passed

---

## 🚀 Files to Create

```
src/pages/LoginPage.tsx
  ├─ New LoginPage component with Lock Widget
  ├─ Hooks: useState, useEffect
  ├─ Uses: useThemeColors, Auth0Lock
  └─ Responsive design with design tokens

src/pages/LoginPage.module.css
  ├─ Responsive breakpoints
  ├─ Touch target sizing (44px minimum)
  ├─ CSS overrides for Lock Widget styles
  └─ Dark mode support

src/pages/__tests__/LoginPage.component.test.tsx
  ├─ 6 component tests (TASK 1)
  ├─ 5 responsive design tests (TASK 2)
  ├─ 4 auth/error handling tests (TASK 3)
  ├─ 5 accessibility tests (TASK 4)
  └─ Total: 20 tests
```

---

## 🔧 Implementation Commands

```bash
# Start feature branch
git checkout -b feat/auth0-lock-integration

# Run tests in watch mode (recommended during development)
npm run test -- --watch

# Run specific test file
npm run test -- LoginPage.component.test.tsx

# Full test suite (before submitting)
npm run test

# Lint check
npm run lint

# Format code
npm run format

# TypeScript check
npm run type-check

# Build
npm run build

# Start dev server to test in browser
npm run start
```

---

## 📚 Reference Documentation

### Auth0 Lock Documentation
- **Package**: `auth0-lock` (already installed)
- **Official Docs**: https://auth0.com/docs/libraries/auth0-lock
- **Lock GitHub**: https://github.com/auth0/lock

### React Testing Library
- **Docs**: https://testing-library.com/docs/react-testing-library/intro/
- **Query Examples**: https://testing-library.com/docs/dom-testing-library/queries

### WCAG 2.1 AA Accessibility
- **Quick Reference**: https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast**: https://webaim.org/articles/contrast/

### Project Resources
- **Design Tokens**: See `src/theme/tokens.ts`
- **Theme Hook**: See `src/hooks/useThemeColors.ts`
- **Existing CallbackPage**: `src/pages/CallbackPage.tsx`

---

## ⚠️ Important Notes

### Design Token Colors
The Lock Widget will use your primary color from design tokens:
```typescript
// Light theme
themeColors.primary.main = '#667eea'

// Dark theme
themeColors.primary.main = (adaptive color)
```

### Lock Widget Behavior
- Lock automatically shows email/password form
- Lock automatically handles validation
- Lock automatically redirects to `/callback?code=...&state=...`
- Lock automatically shows error messages

### No Breaking Changes
- Existing CallbackPage flow unchanged
- Existing routes unchanged
- Existing auth context unchanged
- All existing tests continue to pass

### Error Handling
Lock provides built-in error handling for:
- Invalid email/password
- Email already registered
- Network errors
- Invalid state/code

Your code just needs to listen to Lock events and display messages.

---

## 🎬 Next Steps

### For Frontend Engineer
1. Create feature branch
2. Read all specification documents
3. Start TASK 1 (create failing tests first)
4. Follow TDD approach strictly
5. Run tests frequently
6. Commit regularly with clear messages
7. Submit PR when all 5 tasks complete

### For Code Reviewer
1. Verify all 20 tests passing
2. Check responsive design on multiple devices
3. Verify no breaking changes to existing code
4. Check accessibility compliance
5. Review code quality and TDD approach
6. Approve for merge

### For Product Owner
This feature:
- ✅ Improves user experience (users stay in app)
- ✅ Allows design system styling
- ✅ Provides built-in sign up functionality
- ✅ Maintains security (Auth0 managed credentials)
- ✅ Requires zero changes to backend

---

## 📞 Questions?

Refer to the detailed specifications:
- **"Why this approach?"** → See intent.md
- **"What should the user experience be?"** → See requirements.md
- **"How does it technically work?"** → See design.md
- **"How do I implement this?"** → See tasks.md

---

## 🏁 Success Criteria

This feature is complete when:
1. ✅ All 20 tests passing
2. ✅ Full test suite passing (no regressions)
3. ✅ TypeScript strict mode passing
4. ✅ Lint checks passing
5. ✅ Build successful
6. ✅ Responsive design verified
7. ✅ Accessibility compliant
8. ✅ Manual testing verified
9. ✅ Code review approved
10. ✅ Merged to main branch

---

**Prepared by**: Principal System Architect
**Date**: 2026-02-15
**Ready for Implementation**: Yes ✅
