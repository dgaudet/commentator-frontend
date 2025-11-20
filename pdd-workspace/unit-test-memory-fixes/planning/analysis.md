# Unit Test Memory Issues - Analysis & Findings

## Executive Summary

The commentator-frontend test suite is experiencing out-of-memory (OOM) errors during execution. Investigation reveals multiple contributing factors:

1. **Configuration**: Jest configured without explicit memory limits or worker constraints
2. **Test Volume**: 80+ test files with significant setup overhead
3. **Component Complexity**: FinalCommentsModal has 9 separate test files with duplicated setup
4. **Test Patterns**: React act() warnings and improper cleanup indicate resource leaks
5. **Mocking Overhead**: MSW mock server setup may not be optimized for test performance

---

## Current Test Landscape

### Test File Count & Distribution
- **Total Test Files**: 80+
- **Largest Test Suite**: FinalCommentsModal with 9 separate test files
  - FinalCommentsModal.test.tsx (main)
  - FinalCommentsModal.accessibility.test.tsx
  - FinalCommentsModal.add-form-styling.test.tsx
  - FinalCommentsModal.edge-cases.test.tsx
  - FinalCommentsModal.edit-form-styling.test.tsx
  - FinalCommentsModal.form-position.test.tsx
  - FinalCommentsModal.header-cleanup.test.tsx
  - FinalCommentsModal.integration.test.tsx
  - FinalCommentsModal.outcome-integration.test.tsx
  - FinalCommentsModal.personalized-comments.test.tsx
  - FinalCommentsModal.populate-button.test.tsx
  - FinalCommentsModal.typeahead-add-form.test.tsx
  - FinalCommentsModal.typeahead-edit-form.test.tsx

### Component Test Files
- **PersonalizedCommentsModal**: 3 test files
- **OutcomeCommentsModal**: 1+ test files
- **Common Components**: 15+ test files (Input, Button, etc.)
- **Hooks**: 9 test files (useClasses, useFinalCommentForm, etc.)
- **Services**: 6 API service test files

---

## Identified Issues

### 1. Test Setup Duplication
Each FinalCommentsModal test file independently:
- Wraps component with ThemeProvider and custom wrapper
- Creates mock form state
- Sets up MSW mock handlers
- Renders the component

**Impact**: N duplicate setups × memory per setup = O(n²) memory problem

**Solution**: Consolidate setup or use shared fixtures

### 2. Component Re-render Cycles (React act() Warning)
```
Warning: An update to FinalCommentsModal inside a test was not wrapped in act(...).
```

**Impact**: State updates not batched properly, causing extra renders and cleanup cycles

**Solution**: Wrap state changes in act() and verify proper batching

### 3. Jest Worker Configuration
Current jest.config.js has no explicit `maxWorkers` setting, meaning Jest defaults to CPU core count.

**Example Scenario**:
- 8-core machine: 8 workers × 256MB per Jest instance = 2GB+ just for workers
- Each worker runs multiple test suites in parallel
- Components mount/unmount simultaneously in multiple workers

**Solution**: Reduce maxWorkers to 1-2 or use explicit memory limits

### 4. MSW Mock Server Overhead
MSW v2 with custom export conditions may be loading more handlers than necessary per test.

**Impact**: Unused mock routes in memory for every test

**Solution**: Lazy-load MSW handlers by test file/concern

### 5. Component Complexity
FinalCommentsModal is a complex component with:
- Theme context
- Form state management
- Multiple nested components
- Async operations

Each test file re-creates all this complexity.

**Impact**: 13+ tests × complex component setup = high memory cost

**Solution**: Extract common setup patterns, use minimal test wrappers for unit tests

---

## Memory Profile Estimate (Before Optimization)

```
Scenario: Running full test suite on 8-core machine

Jest Process: 1 parent + 8 workers
├── Parent process: ~100MB
└── Worker processes (8×): ~300-500MB each
    └── Per worker:
        ├── Node runtime: ~100MB
        ├── Jest/babel infrastructure: ~100MB
        ├── Test suites loaded: variable
        │   ├── FinalCommentsModal tests (13 files): ~400MB
        │   ├── Common component tests: ~200MB
        │   └── Other tests: ~200MB
        └── Active component mounts: ~200MB

Peak Memory: ~4-5GB (OOM on systems with 4GB or less)
```

---

## Root Cause Analysis

| Issue | Root Cause | Severity | Quick Fix? |
|-------|-----------|----------|-----------|
| Jest workers = CPU cores | Default Jest behavior | High | Yes - Add maxWorkers:1 |
| No per-worker memory limit | Jest configuration | High | Yes - Add max memory option |
| Duplicated test setup | No shared fixtures | Medium | Yes - Extract fixtures |
| act() warnings | Incomplete async wrapping | Medium | Yes - Audit state updates |
| MSW not optimized | All handlers loaded | Low-Medium | Maybe - Profile MSW |
| Heavy component tests | FinalCommentsModal complexity | Medium | Partial - Can't change component |

---

## Recommended Fix Strategy

### Immediate (Today - Story 7)
**Jest Configuration Optimization**

Change: Add maxWorkers to jest.config.js
```javascript
maxWorkers: '50%'  // Use 50% of CPU cores
```

**Impact**: Reduces OOM risk significantly
**Time to implement**: 5 minutes
**Risk**: Minimal - config change only

### Short-term (This Sprint - Stories 1, 2, 5)
1. Profile memory to establish baseline
2. Clean up test setup/teardown
3. Optimize MSW mocking

**Expected improvement**: 30-40% memory reduction
**Time**: 2-3 days
**Risk**: Low - test infrastructure only

### Medium-term (Next Sprint - Stories 3, 4, 6)
1. Consolidate FinalCommentsModal tests
2. Reduce wrapper complexity
3. Split large test files

**Expected improvement**: 40-50% additional reduction
**Time**: 3-5 days
**Risk**: Medium - test file reorganization

### Long-term (Ongoing - Story 10)
1. Document best practices
2. Add pre-commit checks
3. Prevent future memory issues

---

## Industry Best Practices

### Jest Memory Management
1. **maxWorkers**: Set to `--max-workers 1` for CI environments with limited memory
2. **testTimeout**: Increase if tests are timing out (not recommended for memory issues)
3. **cache**: Disable if cache is causing issues: `--no-cache`
4. **bail**: Stop on first failure to fail faster: `--bail`

### React Testing Best Practices
1. Use `render()` from Testing Library and cleanup happens automatically
2. Always wrap async operations in `act()`
3. Avoid nested renders (component in component in test wrapper)
4. Mock heavy dependencies, not implementations

### MSW Best Practices
1. Define handlers once, share across tests
2. Only override handlers in specific tests
3. Use `beforeAll` to set up handlers, not `beforeEach`
4. Clean up handlers in `afterEach` to avoid state bleed

---

## Implementation Roadmap

```
Week 1: Quick Wins
├─ Day 1: Jest config (Story 7) - 5 minutes
├─ Day 2: Memory profiling (Story 1) - 2 hours
├─ Day 3: Test setup cleanup (Story 2) - 3 hours
└─ Day 4: Verify & document - 1 hour

Week 2: Root Cause Fixes
├─ Day 1-2: MSW optimization (Story 5) - 4 hours
├─ Day 3: React cleanup fixes (Story 9) - 3 hours
└─ Day 4: Wrapper refactor (Story 3) - 3 hours

Week 3: Restructuring
├─ Day 1-2: Consolidate tests (Story 4) - 6 hours
├─ Day 3: Split large files (Story 6) - 4 hours
└─ Day 4: Parallelization strategy (Story 8) - 2 hours

Week 4: Governance
└─ Documentation (Story 10) - 3 hours
```

---

## Success Criteria

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Peak Memory | ~4-5GB (OOM) | <2GB | Monitor during test run |
| Test Execution | ~60-120s | <60s | npm run test timing |
| Test Count | 80+ files | 80+ files (no deletion) | Jest summary |
| Pass Rate | ~95% | 100% | Jest exit code |
| CI/CD Success | Fails on OOM | 100% | GitHub Actions success rate |

---

## Risk Assessment

### Technical Risks
- **Risk**: Test reorganization could break existing tests
- **Mitigation**: Run full suite after each change, maintain git branches

### Coverage Risks
- **Risk**: Consolidating tests might lose test specificity
- **Mitigation**: Use clear test descriptions, avoid deleting tests

### Performance Risks
- **Risk**: Over-optimization could make tests slower
- **Mitigation**: Benchmark before/after each optimization

---

## Dependencies & Prerequisites

1. ✅ Node.js v24 (already configured)
2. ✅ Jest v29.7.0 (already installed)
3. ✅ Testing Library (already installed)
4. ✅ MSW v2 (already installed)

No dependency upgrades needed.

---

## Monitoring & Metrics

### During Implementation
- Peak memory usage per test run
- Test execution time
- Pass/fail rate
- Specific test file memory consumption

### After Implementation
- Baseline metrics stored in version control
- Regular CI/CD monitoring
- Team education on best practices

---

## Next Steps

1. **Approval**: Review this analysis and user stories
2. **Prioritization**: Confirm implementation order
3. **Execution**: Start with Story 7 (Jest Config) for immediate relief
4. **Monitoring**: Track metrics throughout implementation
5. **Documentation**: Update team practices
