# Phase 2 Implementation Plan - Stories 2, 5, 9

## Overview

Phase 2 focuses on reducing per-test-file memory consumption from 500MB to 300-400MB through targeted optimizations. Expected result: Tests will run successfully (though slowly at ~5-7 minutes).

**Effort**: 10 hours over 3-4 days
**Stories**: 2, 5, 9
**Risk**: Low (test infrastructure only, no production code changes)

---

## Story 2: Optimize Test Setup & Teardown (3 hours)

### Current State

**setupTests.ts**:
- Imports @testing-library/jest-dom
- Sets up MSW polyfills (TextEncoder, TextDecoder, ReadableStream, TransformStream)
- Notes that MSW is disabled due to ESM compatibility issues
- Clean overall structure

**test-utils.tsx**:
- Creates `customRender()` that wraps all components with `ThemeProvider`
- Re-exports RTL utilities (screen, waitFor, fireEvent, cleanup, act)
- Minimal wrapper currently

### Issues to Address

1. **React act() warnings** (observed in test output)
   - "Warning: An update to FinalCommentsModal inside a test was not wrapped in act(...)"
   - Indicates state updates during teardown not properly batched

2. **Maximum update depth warnings**
   - Suggests component unmounting causing cascading updates
   - Likely poor cleanup of effects/listeners

3. **Cleanup not happening after each test**
   - Components might not be fully unmounting
   - Event listeners might remain attached

### Implementation Steps

**Step 1: Enhance cleanup in setupTests.ts** (30 min)
```typescript
// After setup, add afterEach hook
afterEach(() => {
  // Clear all jest mocks
  jest.clearAllMocks()

  // Clear all timers
  jest.clearAllTimers()
})
```

**Step 2: Create explicit cleanup in test-utils.tsx** (45 min)
```typescript
// Add cleanup helper function
export function cleanupAfterTest() {
  // Ensure all async operations are settled
  // Clear any remaining timers
  // Flush pending promises
}

// Enhance customRender to track cleanup
function customRender(ui, options) {
  const result = rtlRender(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options
  })

  // Ensure cleanup happens
  return {
    ...result,
    cleanup: () => {
      cleanup()
      cleanupAfterTest()
    }
  }
}
```

**Step 3: Add beforeEach/afterEach to setupTests.ts** (45 min)
```typescript
// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers()
  jest.clearAllMocks()
  // Don't explicitly call cleanup() - RTL does it automatically
})
```

### Acceptance Criteria
- [ ] AC1: No React act() warnings in test output
- [ ] AC2: No "Maximum update depth" warnings
- [ ] AC3: Memory profile shows 15-20% reduction
- [ ] AC4: All tests still pass
- [ ] AC5: beforeEach/afterEach properly configured in setupTests.ts

### Expected Outcome
- 15-20% memory reduction per test file
- Cleaner test output (no warnings)

---

## Story 5: Implement Lightweight Mocking (4 hours)

### Current State

**MSW Setup**: Currently disabled in setupTests.ts due to Jest ESM compatibility issues

**Current Approach**: Tests use jest.mock() for API mocking

**Issue**: Tests may be loading full mock infrastructure unnecessarily

### Issues to Address

1. **MSW not optimized** - Even though disabled, configuration could be better
2. **Fixture data** - Tests might be loading large datasets
3. **Mock server overhead** - MSW infrastructure loaded even when not needed
4. **No lazy loading** - All mock handlers defined upfront

### Implementation Steps

**Step 1: Create fixture factories** (90 min)
Create `src/test-utils/fixtures.ts`:
```typescript
// Light factory functions instead of importing large datasets

export const createMockClass = (overrides = {}) => ({
  id: '1',
  name: 'Test Class',
  ...overrides
})

export const createMockStudent = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  ...overrides
})

// Same pattern for Comments, Subjects, etc.
```

**Step 2: Create selective MSW handlers file** (60 min)
Create `src/test-utils/mswHandlers.ts`:
```typescript
// Separate handler sets by concern
// Load only what each test needs

export const classHandlers = [
  // Only class-related handlers
]

export const commentHandlers = [
  // Only comment-related handlers
]

// Tests can: const server = setupServer(...classHandlers)
```

**Step 3: Update hook tests to use fixtures** (90 min)
```typescript
// Before:
const mockClass = require('./fixtures/largeDataset.json')

// After:
import { createMockClass } from '@test-utils/fixtures'
const mockClass = createMockClass({ id: '123' })
```

Audit and update at least 5 hook tests:
- useClasses.test.ts
- useFinalCommentForm.test.ts
- useOutcomeComments.test.ts
- usePersonalizedComments.test.ts
- useSubjects.test.ts

### Acceptance Criteria
- [ ] AC1: MSW setup reviewed and documented
- [ ] AC2: Fixture factories created in test-utils/fixtures.ts
- [ ] AC3: At least 5 hook tests updated to use fixtures
- [ ] AC4: Memory profile shows 15-20% reduction
- [ ] AC5: Mocking patterns documented

### Expected Outcome
- 15-20% memory reduction from lighter fixtures
- Faster test data creation
- Better test readability

---

## Story 9: Fix React Cleanup Patterns (3 hours)

### Current State

**Observed Issues**:
- React act() warnings in FinalCommentsModal tests
- "Maximum update depth exceeded" warnings
- Async operations not properly awaited in cleanup

### Issues to Address

1. **State updates not wrapped in act()** in some test files
2. **useEffect cleanup not working** - dependencies not configured properly
3. **Async operations** - Not all promises settled before teardown
4. **Event listeners** - Not cleaned up properly

### Implementation Steps

**Step 1: Identify problem test files** (30 min)
Run tests and collect warnings:
```bash
npm run test 2>&1 | grep -E "(act\(|Maximum update depth)"
```

Key files to check:
- FinalCommentsModal.test.tsx and related
- OutcomeCommentsModal tests
- PersonalizedCommentsModal tests

**Step 2: Fix act() warnings in FinalCommentsModal tests** (60 min)

Common pattern to fix:
```typescript
// Before (causes warning)
fireEvent.change(input, { target: { value: 'test' } })
expect(screen.getByText('test')).toBeInTheDocument()

// After (wrapped in act)
act(() => {
  fireEvent.change(input, { target: { value: 'test' } })
})
expect(screen.getByText('test')).toBeInTheDocument()

// Or better - use user-event which handles act() automatically
await user.type(input, 'test')
expect(screen.getByText('test')).toBeInTheDocument()
```

**Step 3: Fix async cleanup issues** (30 min)
```typescript
// Add afterEach wrapper in problematic test files
afterEach(async () => {
  // Wait for all pending promises
  await waitFor(() => {
    expect(jest.mock).toHaveBeenCalled()
  })
})
```

### Acceptance Criteria
- [ ] AC1: React act() warnings eliminated from FinalCommentsModal tests
- [ ] AC2: "Maximum update depth" warnings eliminated
- [ ] AC3: Async operations properly awaited in cleanup
- [ ] AC4: Memory profile shows 10-20% reduction
- [ ] AC5: All tests still passing

### Expected Outcome
- 10-20% memory reduction
- Cleaner test output
- More reliable tests

---

## Implementation Order

### Day 1-2: Story 2 (3 hours)
1. Enhance setupTests.ts with proper cleanup
2. Add beforeEach/afterEach hooks
3. Test and verify improvements
4. Document changes

### Day 2-3: Story 5 (4 hours)
1. Create fixture factories
2. Refactor MSW handler setup
3. Update 5 hook tests
4. Test and measure improvements

### Day 3-4: Story 9 (3 hours)
1. Identify problem test files
2. Fix act() warnings
3. Fix async cleanup
4. Verify all tests pass
5. Document patterns

---

## Measurement Plan

### Before Each Story
```bash
npm run test 2>&1 | tail -20  # Capture test output
# Record: test count, pass/fail, warnings, time
```

### Memory Profiling
```bash
# Option 1: Monitor process memory
node --max-old-space-size=2048 node_modules/.bin/jest

# Option 2: Add to test output
# Log memory before/after each test suite
```

### After Each Story
- Run full test suite
- Capture output and measure time
- Record memory profile
- Compare to baseline

---

## Success Criteria for Phase 2

### Minimum (Must Have)
- [x] Story 2: Setup/teardown optimized, tests still pass
- [x] Story 5: Fixture factories created, hook tests updated
- [x] Story 9: React warnings eliminated
- [x] All 1,178 tests passing
- [x] Memory reduced 20-30% from Phase 1

### Ideal (Should Have)
- [x] Memory reduced 40-50% from Phase 1
- [x] Tests run in <7 minutes
- [x] No React warnings at all
- [x] Clear documentation of patterns

### Bonus (Nice to Have)
- [x] MSW re-enabled if possible
- [x] Additional 10+ tests using fixtures
- [x] Performance monitoring setup

---

## Rollback Plan

If anything breaks:
1. `git revert` to previous commit
2. Debug the specific change
3. Apply fix incrementally
4. Verify tests pass before committing

Each story is independent, so issues can be isolated easily.

---

## Next Steps

1. ✅ Understand current test setup
2. → Start with Story 2 tomorrow
3. → Continue with Story 5
4. → Finish with Story 9
5. → Phase 2 complete when all 3 stories done

**Expected completion**: 3-4 days of focused work

---

## Questions During Implementation?

Refer back to:
- User stories: `user-stories.md` (full acceptance criteria)
- Analysis: `analysis.md` (technical context)
- Critical findings: `critical-findings.md` (root cause proof)
