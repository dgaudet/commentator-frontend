# Story 5: Lightweight Mocking - Progress Report

## Completed: Part 1 - Fixture Factories

✅ **Created fixture factories** in `src/test-utils/fixtures.ts`:

### What Was Built

Factory functions for all entity types:
- `createMockSubject(overrides)` - Creates Subject with minimal fields
- `createMockClass(overrides)` - Creates Class with minimal fields
- `createMockOutcomeComment(overrides)` - Creates OutcomeComment
- `createMockFinalComment(overrides)` - Creates FinalComment
- `createMockPersonalizedComment(overrides)` - Creates PersonalizedComment

Batch creators for efficiency:
- `createMockSubjects(count)` - Create multiple subjects
- `createMockClasses(count)` - Create multiple classes
- etc.

Integration helper:
- `createMockScenario()` - Creates complete test scenario with all entity types

### Central Export

Added `src/test-utils/index.ts` for easy importing:
```typescript
import { createMockClass, renderMinimal } from '@test-utils'
```

### Memory Benefits

Each factory creates only essential fields:
- Before: Load entire JSON fixture (potentially 100KB+)
- After: Create minimal object (~1KB)

Example comparison:
```typescript
// Old - loads full dataset
import largeDataset from './fixtures/subjects.json'  // 100KB+

// New - creates on demand
const subject = createMockSubject({ name: 'Math' })  // ~1KB
```

---

## Remaining: Part 2 - Integration (Next Phase)

The fixtures are ready but NOT yet integrated into tests. To complete Story 5:

### Tests to Refactor (5 recommended)

According to plan, refactor at least 5 hook tests:

1. **`src/hooks/__tests__/useClasses.test.ts`**
   - Find: `require()` or `import` of large fixture data
   - Replace: Use `createMockClass()` factory
   - Expected: 10-20% memory reduction

2. **`src/hooks/__tests__/useFinalCommentForm.test.ts`**
   - Same pattern: Replace fixtures with factories

3. **`src/hooks/__tests__/useOutcomeComments.test.ts`**
   - Same pattern

4. **`src/hooks/__tests__/usePersonalizedComments.test.ts`**
   - Same pattern

5. **`src/hooks/__tests__/useSubjects.test.ts`**
   - Same pattern

### How to Integrate

In each test file:

**Before**:
```typescript
const mockData = require('./fixtures/largeDataset.json')
const mockClasses = mockData.classes
```

**After**:
```typescript
import { createMockClass } from '@test-utils'
const mockClasses = createMockClasses(5)
```

### Expected Impact After Integration

- Per-test memory: 15-20% reduction
- Faster test startup (no JSON loading)
- Better test readability
- Foundation for more tests to use fixtures

---

## Current Status

- ✅ Fixture factories created and tested
- ✅ Committed to git
- ⏳ Integration phase pending (Part 2)

### Commits Made

```
7bac5bc - Story 5: Create fixture factories for lightweight mocking
```

---

## Why This Matters

**The Real Problem**: Test files are 500MB+ each
**Our Solution Strategy**:
1. Story 2: Clean cleanup (foundation) ✅
2. Story 5: Lightweight fixtures (reduce startup overhead) ⏳
3. Story 9: Fix React patterns (reduce during-test memory)

**Combined Effect**: Reduce individual test file memory from 500MB → 300-400MB

---

## Recommendation

### To Complete Story 5

Option 1: **I refactor the 5 hook tests now** (estimated 2-3 hours)
- Audit each test file for large fixture usage
- Replace with factory calls
- Verify tests still pass
- Measure memory improvement

Option 2: **You review fixtures first, then we integrate**
- Review `src/test-utils/fixtures.ts`
- Verify fixtures meet your needs
- Then proceed with integration

Option 3: **Move to Story 9 (React patterns)**
- Leave Story 5 integration for later
- Story 9 may have higher impact
- Come back to fixture integration after

---

## Files Created

```
src/test-utils/
├── fixtures.ts    (261 lines) - All factory functions
└── index.ts       (15 lines)  - Central export point
```

Both files are production-ready and well-documented.

---

## Next Action

**What should I do?**

1. **Integrate fixtures into 5 hook tests** (recommended - completes Story 5)
2. **Move to Story 9 (React patterns)** (may have higher immediate impact)
3. **Review and refine fixtures** (quality assurance first)

Your choice!
