# Build Errors Fix - User Stories

**Feature**: Fix TypeScript Build Errors and Unblock Deployment
**Version**: 1.0
**Status**: Ready for Implementation
**Total Stories**: 9
**Total Errors**: 68

---

## Priority & Risk Tiers

| Tier | Risk Level | Effort | Count |
|------|-----------|--------|-------|
| P0 - Critical | HIGH | L1 | 3 stories |
| P1 - Medium | MEDIUM | L1 | 2 stories |
| P2 - Low | LOW | L0-L1 | 4 stories |

---

## P0 - Critical Path (Must Fix First)

These block the build pipeline. Estimated: 1.5 hours

---

### STORY 1: Fix ID Type Inconsistencies in Service Tests

**ID**: TASK-1.1
**Risk Tier**: Medium
**Effort**: L1 (30-40 min)
**Priority**: CRITICAL

**User Story**:
```
WHEN developers run `npm run build`
THEN the build should pass TypeScript compilation for all service test files
```

**Context**:
IDs were recently migrated from `number` to `string` type across the API. Test files still pass numeric IDs to service functions, causing type mismatch errors during build.

**Acceptance Criteria**:
- [ ] All numeric IDs in test calls are converted to strings (e.g., `1` → `"1"`)
- [ ] No `TS2345: number is not assignable to type 'string'` errors remain
- [ ] All affected test files still pass when run with `npm run test`
- [ ] Build passes with `npm run build`

**Affected Files** (8 files, ~40 errors):
- `src/services/api/__tests__/finalCommentService.test.ts` (3 errors)
- `src/services/api/__tests__/outcomeCommentService.test.ts` (3 errors)
- `src/services/api/__tests__/personalizedCommentService.test.ts` (6 errors)
- `src/utils/__tests__/classStorageUtils.test.ts` (1 error)
- `src/components/finalComments/__tests__/FinalCommentsModal.accessibility.test.tsx` (3 errors)
- `src/components/finalComments/__tests__/FinalCommentsModal.edge-cases.test.tsx` (5 errors)
- `src/utils/__tests__/personalizedCommentRating.test.ts` (1 error)
- `src/utils/__tests__/subjectStorageUtils.test.ts` (1 error)

**Test Strategy**:
- Verify each test file runs without errors
- Spot-check 2-3 updated functions to ensure string IDs work correctly
- Run full build to confirm no related type errors

**Notes**:
- This is mechanical replacement work (number → string literals)
- No business logic changes required
- Tests should not need modification beyond ID type changes

---

### STORY 2: Complete Axios Response Mocks with Required Properties

**ID**: TASK-1.2
**Risk Tier**: Medium
**Effort**: L1 (20-30 min)
**Priority**: CRITICAL

**User Story**:
```
WHEN service tests mock axios responses
THEN the mocks should include all required AxiosResponse properties
```

**Context**:
Service tests mock axios responses with only `{ data }`, but the actual `AxiosResponse` type requires additional properties: `status`, `statusText`, `headers`, and `config`. This type mismatch blocks the build.

**Acceptance Criteria**:
- [ ] All axios response mocks include: `status`, `statusText`, `headers`, `config`
- [ ] No `TS2345: missing properties` errors remain
- [ ] Mocks can be minimal/stub values (e.g., `status: 200`, `headers: {}`, `config: {}`)
- [ ] Tests still pass when run with `npm run test`
- [ ] Build passes with `npm run build`

**Affected Files** (2 files, ~12 errors):
- `src/services/api/__tests__/classService.test.ts` (4 errors)
- `src/services/api/__tests__/apiClient.test.ts` (1 error)

**Example Fix Pattern**:
```typescript
// BEFORE
mockAxios.post.mockResolvedValue({ data: mockClass })

// AFTER
mockAxios.post.mockResolvedValue({
  data: mockClass,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as AxiosRequestConfig
})
```

**Test Strategy**:
- Verify tests still pass with updated mocks
- Confirm build compiles without errors
- No functional changes to test logic required

**Notes**:
- Can use stub values for properties not critical to the test
- Follow existing patterns in codebase for consistency
- May want to create a helper function for reusable mock factory

---

### STORY 3: Create Missing CSS Module Files for Login Pages

**ID**: TASK-1.3
**Risk Tier**: Low
**Effort**: L0 (5-10 min)
**Priority**: CRITICAL

**User Story**:
```
WHEN LoginPage and CallbackPage are imported
THEN all referenced CSS modules should be resolvable
```

**Context**:
`LoginPage.tsx` and `CallbackPage.tsx` import CSS modules that don't exist, causing module resolution errors during build.

**Acceptance Criteria**:
- [ ] `src/pages/LoginPage.module.css` file created
- [ ] `src/pages/CallbackPage.module.css` file created
- [ ] Files can be empty initially or include basic styling
- [ ] No `TS2307: Cannot find module` errors
- [ ] Build passes with `npm run build`

**Affected Files** (2 files, 2 errors):
- `src/pages/LoginPage.tsx`
- `src/pages/CallbackPage.tsx`

**Test Strategy**:
- Run build to confirm module resolution works
- (Optional) Visual check that pages still render if applicable

**Notes**:
- This is a structural fix, not a feature implementation
- CSS content can be added incrementally as styling work progresses
- Consider following existing CSS module patterns in the project

---

## P1 - Medium Priority (Complete After Critical)

Estimated: 30-45 min

---

### STORY 4: Fix Design Token Color Weight Indexing

**ID**: TASK-2.1
**Risk Tier**: Medium
**Effort**: L1 (15-20 min)
**Priority**: HIGH

**User Story**:
```
WHEN PlaceholderTipsBox accesses design token colors
THEN it should use valid token properties that exist
```

**Context**:
`PlaceholderTipsBox.tsx` attempts to index color tokens with numeric weights (50, 200, 700) that don't exist in the design token system. Design tokens only have `main`, `dark`, and `light` properties.

**Acceptance Criteria**:
- [ ] Update color token references to use valid properties (`main`, `dark`, `light`)
- [ ] Component still renders with intended visual appearance
- [ ] No `TS7053: Element implicitly has any type` errors
- [ ] Build passes with `npm run build`
- [ ] Visual regression testing confirms colors look correct

**Affected Files** (1 file, 3 errors):
- `src/components/common/PlaceholderTipsBox.tsx`

**Test Strategy**:
- Visual inspection of component in application
- Verify colors match design intent
- Run build to confirm type errors resolved

**Notes**:
- May require design review if weight system should be added to tokens
- Current fix should map to appropriate existing token properties
- Document any design token assumptions for future reference

---

### STORY 5: Fix setTimeout Return Type in CopyButton State

**ID**: TASK-2.2
**Risk Tier**: Medium
**Effort**: L1 (15-20 min)
**Priority**: HIGH

**User Story**:
```
WHEN CopyButton manages timeout state
THEN the type annotations should match the actual setTimeout return value
```

**Context**:
`CopyButton.tsx` uses `setTimeout()` which returns a `Timeout` object (not a `number`), but the state is typed as `number`. This type mismatch causes build errors.

**Acceptance Criteria**:
- [ ] State type updated from `number` to `Timeout | null`
- [ ] Initial state handles `null` properly
- [ ] No `TS2322: Timeout is not assignable to type number` errors remain
- [ ] Copy-to-clipboard functionality works as before
- [ ] Component cleanup properly clears timeouts
- [ ] Build passes with `npm run build`

**Affected Files** (1 file, 3 errors):
- `src/components/common/CopyButton.tsx` (lines 82, 129, 148)

**Code Pattern**:
```typescript
// BEFORE
const [timeoutId, setTimeoutId] = useState<number | null>(null)
setTimeoutId(setTimeout(() => {...}, 2000))

// AFTER
const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
setTimeoutId(setTimeout(() => {...}, 2000))
```

**Test Strategy**:
- Verify copy button functionality in UI
- Check timeout behavior (feedback disappears after delay)
- Confirm cleanup happens on unmount
- Run build to confirm no type errors

**Notes**:
- Use `NodeJS.Timeout` for proper type definition
- Ensure cleanup in useEffect dependencies
- May need to import timeout type from appropriate location

---

## P2 - Low Priority (Nice to Have)

Estimated: 30-40 min total

---

### STORY 6: Complete useOutcomeComments Hook Mock with All Methods

**ID**: TASK-3.1
**Risk Tier**: Low
**Effort**: L1 (15 min)
**Priority**: MEDIUM

**User Story**:
```
WHEN FinalCommentsModal tests mock the useOutcomeComments hook
THEN the mock should include all properties required by the hook interface
```

**Context**:
Test mocks for `useOutcomeComments` hook are incomplete. They include only `outcomeComments`, `loading`, `error`, and `loadOutcomeComments`, but the actual hook interface also requires `createComment`, `updateComment`, `deleteComment`, and `clearError`.

**Acceptance Criteria**:
- [ ] Mock includes all properties from `UseOutcomeCommentsReturn` type
- [ ] Method stubs use `jest.Mock` or `jest.fn()`
- [ ] No `TS2345: missing properties` errors
- [ ] Tests still pass with complete mocks
- [ ] Build passes with `npm run build`

**Affected Files** (2 files, 2 errors):
- `src/components/finalComments/__tests__/FinalCommentsModal.accessibility.test.tsx` (line 82)
- `src/components/finalComments/__tests__/FinalCommentsModal.edge-cases.test.tsx` (line 62)

**Mock Pattern**:
```typescript
// BEFORE
{
  outcomeComments: [...],
  loading: false,
  error: null,
  loadOutcomeComments: jest.fn()
}

// AFTER
{
  outcomeComments: [...],
  loading: false,
  error: null,
  loadOutcomeComments: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
  clearError: jest.fn()
}
```

**Test Strategy**:
- Run affected tests to confirm they pass
- Verify mocks don't need actual implementations for these tests
- Build should compile without errors

**Notes**:
- Methods can be no-op stubs since tests don't exercise them
- Consider creating reusable mock factory for consistency
- Document mock pattern in test utils for future reference

---

### STORY 7: Resolve Missing '@/types' Import

**ID**: TASK-3.2
**Risk Tier**: Low
**Effort**: L1 (10-15 min)
**Priority**: MEDIUM

**User Story**:
```
WHEN test-utils/fixtures.ts imports types from '@/types'
THEN the types should be resolvable and available
```

**Context**:
`src/test-utils/fixtures.ts` imports from `@/types` which cannot be resolved. Either the path is configured incorrectly or the types don't exist.

**Acceptance Criteria**:
- [ ] `@/` alias is correctly configured in `tsconfig.json`
- [ ] `src/types/index.ts` exists (or types are defined elsewhere)
- [ ] All necessary types are exported from the types module
- [ ] No `TS2307: Cannot find module '@/types'` errors
- [ ] Build passes with `npm run build`

**Affected Files** (1 file, 1 error):
- `src/test-utils/fixtures.ts`

**Investigation Steps**:
1. Check `tsconfig.json` for `@/` path alias configuration
2. Verify `src/types/` directory exists
3. Confirm necessary types are exported
4. Update import path if needed

**Test Strategy**:
- Verify build compiles
- Run test suite to confirm fixtures load correctly

**Notes**:
- May need to create `src/types/index.ts` if it doesn't exist
- Follow existing path alias patterns in the project

---

### STORY 8: Remove Unused _variant Variable from Tabs Component

**ID**: TASK-3.3
**Risk Tier**: Trivial
**Effort**: L0 (2-5 min)
**Priority**: LOW

**User Story**:
```
WHEN TypeScript compiler runs with strict settings
THEN all declared variables should be used
```

**Context**:
`Tabs.tsx` declares `_variant` variable at line 66 but never uses it. This causes a build warning (`TS6133`).

**Acceptance Criteria**:
- [ ] `_variant` declaration removed from `Tabs.tsx`
- [ ] Component functionality unchanged
- [ ] No `TS6133: declared but value never used` warnings
- [ ] Build passes with `npm run build`

**Affected Files** (1 file, 1 error):
- `src/components/common/Tabs.tsx` (line 66)

**Test Strategy**:
- Visual verification that Tabs component still renders correctly
- Build should compile without warnings

**Notes**:
- This is dead code cleanup
- Verify variable isn't needed before deletion
- Document reason for deletion if it was intentional

---

### STORY 9: Create Missing TestComponent in AuthContext Test

**ID**: TASK-3.4
**Risk Tier**: Low
**Effort**: L1 (10-15 min)
**Priority**: MEDIUM

**User Story**:
```
WHEN AuthContext tests reference TestComponent
THEN the component should be defined and importable
```

**Context**:
`src/contexts/__tests__/AuthContext.test.tsx` references `TestComponent` at line 254, but it's not defined or imported. This causes a build error.

**Acceptance Criteria**:
- [ ] `TestComponent` is defined in the test file or imported from appropriate location
- [ ] Component serves its intended purpose in the test
- [ ] No `TS2304: Cannot find name 'TestComponent'` errors
- [ ] Test still runs successfully
- [ ] Build passes with `npm run build`

**Affected Files** (1 file, 1 error):
- `src/contexts/__tests__/AuthContext.test.tsx` (line 254)

**Investigation Steps**:
1. Review test to understand TestComponent's purpose
2. Check if it should be defined locally or imported from test-utils
3. Create or import appropriately

**Test Strategy**:
- Run AuthContext tests to confirm they pass
- Verify test still validates intended behavior
- Build should compile without errors

**Notes**:
- May be a test utility that should be in test-utils/
- Consider if it could be reused by other tests

---

## Story Dependencies & Implementation Order

**Recommended Implementation Sequence**:

```
1. TASK-1.3: Create missing CSS files (L0 - fastest)
   ↓
2. TASK-1.1: Fix ID type inconsistencies (L1 - most files)
   ↓
3. TASK-1.2: Complete axios mocks (L1 - good parallel work)
   ↓
4. TASK-2.1: Fix design token indexing (L1)
   ↓
5. TASK-2.2: Fix setTimeout type (L1)
   ↓
6. TASK-3.1: Complete hook mocks (L1)
   ↓
7. TASK-3.2: Resolve type imports (L1)
   ↓
8. TASK-3.3: Remove unused variables (L0)
   ↓
9. TASK-3.4: Create TestComponent (L1)
```

**Can be parallelized**:
- TASK-1.1 and TASK-1.2 (different files)
- TASK-2.1 and TASK-2.2 (different files)
- TASK-3.1, TASK-3.2, TASK-3.3, TASK-3.4 (can all work in parallel)

---

## Success Criteria for Feature Completion

**Build Pipeline**:
- [ ] `npm run build` completes without errors
- [ ] All 68 TypeScript errors resolved
- [ ] `npm run lint` passes without errors
- [ ] `npm run test` passes without new test failures

**Quality Gates**:
- [ ] No new errors introduced
- [ ] Code follows existing patterns and conventions
- [ ] CSS modules follow project styling patterns
- [ ] Type annotations use correct imports

**Deployment Readiness**:
- [ ] Build artifacts generated successfully
- [ ] No regressions in manual testing
- [ ] CI/CD pipeline passes all checks
- [ ] Ready to deploy to staging/production

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Incomplete ID migrations missed | Review each affected file carefully |
| Mocks become out of sync | Document mock patterns, add test utilities |
| CSS file conflicts | Follow existing module naming conventions |
| Type definition confusion | Add comments explaining type choices |

---

## Glossary

- **TS2322**: TypeScript assignment type mismatch error
- **TS2345**: TypeScript function argument type error
- **TS2307**: TypeScript module resolution error
- **TS2304**: TypeScript name not found error
- **TS6133**: TypeScript unused variable warning
- **TS7053**: TypeScript implicit any type error
- **L0-L1**: Effort levels (L0 = trivial, L1 = straightforward)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
**Status**: Ready for Implementation
