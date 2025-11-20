# Unit Test Memory Fixes - Backlog Summary

## Quick Reference: 10-Story Backlog

| Priority | Story | Type | Effort | Risk | Impact |
|----------|-------|------|--------|------|--------|
| **1** | **Story 7: Configure Jest Memory Limits** | Config | 5 min | Trivial | **Critical** - Immediate relief |
| **2** | Story 1: Investigate & Profile | Analysis | 2 hrs | Trivial | High - Establishes baseline |
| **3** | Story 2: Optimize Setup/Teardown | Optimization | 3 hrs | Low | **High** - Direct memory savings |
| **4** | Story 5: Lightweight Mocking | Optimization | 4 hrs | Low | Medium-High - Reduces overhead |
| **5** | Story 9: Fix High-Memory Patterns | Fix | 3 hrs | Low | Medium-High - Fixes React warnings |
| **6** | Story 3: Reduce Test Wrapper Overhead | Refactor | 3 hrs | Low | Medium - Cleaner architecture |
| **7** | Story 4: Consolidate Redundant Tests | Consolidation | 6 hrs | Medium | High - Significant savings |
| **8** | Story 6: Split Large Test Files | Refactor | 4 hrs | Medium | Medium - Better maintainability |
| **9** | Story 8: Parallelization Strategy | Process | 2 hrs | Trivial | Medium - Flexibility |
| **10** | Story 10: Memory Governance | Documentation | 3 hrs | Trivial | Medium - Prevents future issues |

**Total Estimated Effort**: 31 hours
**Total Project Duration**: 2-3 sprints (2-3 weeks)

---

## Phase 1: Immediate (Today - 1 Hour)
Quick wins to get tests running again

### Story 7: Configure Jest Memory Limits
- **Status**: Ready to start
- **Why**: Jest parallelization is overwhelming system memory
- **What**: Add `maxWorkers: '50%'` to jest.config.js
- **Expected Result**: Tests should stop OOMing
- **Acceptance Criteria**:
  - maxWorkers configured
  - `npm run test` completes successfully
  - `npm run test:coverage` completes successfully

---

## Phase 2: Foundation (Sprint - 1 Week)
Establish baseline metrics and fix root causes

### Story 1: Investigate & Profile Memory Usage
- **Why**: Need data to verify optimizations work
- **Output**: Memory profile document, baseline metrics
- **Acceptance Criteria**:
  - Peak memory identified for current config
  - Top 10 memory-consuming test files identified
  - Baseline metrics stored for comparison

### Story 2: Optimize Test Setup & Teardown
- **Why**: Test setup duplicated across 80+ files
- **Output**: Cleaner setupTests.ts and test-utils.tsx
- **Acceptance Criteria**:
  - setupTests.ts reviewed and optimized
  - test-utils.tsx refactored for cleanup
  - Before/after memory comparison shows improvement

### Story 5: Implement Lightweight Mocking
- **Why**: MSW overhead for every test
- **Output**: Optimized mock setup, fixture factories
- **Acceptance Criteria**:
  - MSW handlers reviewed and optimized
  - Fixture factories created for heavy data
  - Hook tests refactored with lighter mocks

---

## Phase 3: Fixes (Sprint - 1 Week)
Address specific memory issues

### Story 9: Address High-Memory Test Patterns
- **Why**: React act() warnings indicate improper state updates
- **Output**: Fixed tests with proper cleanup
- **Acceptance Criteria**:
  - React warnings eliminated
  - Memory profile improves
  - All tests still passing

### Story 3: Reduce Test Wrapper Overhead
- **Why**: Complex wrappers for simple unit tests
- **Output**: Minimal and full wrapper utilities
- **Acceptance Criteria**:
  - Wrapper utilities created and documented
  - 10+ test files migrated to minimal wrapper
  - Memory improvement measured

---

## Phase 4: Restructuring (Sprint - 1.5 Weeks)
Reorganize tests for better architecture

### Story 4: Consolidate Redundant Test Suites
- **Why**: FinalCommentsModal has 13 separate test files with duplicated setup
- **Output**: Consolidated test structure
- **Acceptance Criteria**:
  - Consolidation plan created and documented
  - Tests consolidated or clearly split by concern
  - Memory improvement measured

### Story 6: Split Large Test Files
- **Why**: Some files have 100+ tests with expensive setup
- **Output**: Focused, smaller test files
- **Acceptance Criteria**:
  - Large files identified and split
  - Tests grouped by feature/functionality
  - Memory improvement measured

---

## Phase 5: Optimization (Next Sprint)
Handle parallelization and scalability

### Story 8: Implement Parallelization Strategy
- **Why**: Enable reliable testing in various environments
- **Output**: Multiple npm test scripts for different scenarios
- **Acceptance Criteria**:
  - test:batch script created
  - test:low-memory script created
  - All scripts produce same results

---

## Phase 6: Governance (Ongoing)
Prevent future memory issues

### Story 10: Create Test Memory Governance
- **Why**: Prevent new tests from causing memory issues
- **Output**: Documentation and best practices
- **Acceptance Criteria**:
  - Best practices documented
  - Code review checklist created
  - Team updated with guidelines

---

## Decision Points for Product Owner

### 1. Consolidation vs Separation Strategy
**Story 4 Decision**: FinalCommentsModal has 13 test files
- **Option A**: Consolidate into fewer files (fewer setups, easier to maintain)
- **Option B**: Keep separate but optimize setup (better test isolation, allows parallel execution)
- **Recommendation**: Option A - consolidation should provide 30-40% memory savings

### 2. Wrapper Complexity
**Story 3 Decision**: How many different test wrappers?
- **Option A**: One minimal wrapper for all unit tests
- **Option B**: Minimal wrapper + full wrapper + specialized wrappers per concern
- **Recommendation**: Option B - flexibility for different test types

### 3. Parallelization
**Story 8 Decision**: How to handle parallelization?
- **Option A**: Single-threaded only (safest, slowest)
- **Option B**: Multi-threaded with configurable workers
- **Recommendation**: Option B - provide flexibility with documented scripts

---

## Success Metrics by Phase

### Phase 1 (Immediate)
- [ ] Tests run without OOM errors
- [ ] `npm run test` completes successfully
- [ ] Jest configuration documented

### Phase 2 (Foundation)
- [ ] Baseline memory metrics established
- [ ] Memory reduced by 20-30%
- [ ] Test execution time maintained or improved

### Phase 3 (Fixes)
- [ ] React warnings eliminated
- [ ] Memory reduced by additional 20-30% (cumulative 40-60%)
- [ ] All tests passing

### Phase 4 (Restructuring)
- [ ] Test file count maintained (no tests deleted)
- [ ] Memory reduced by additional 20-30% (cumulative 60-80%)
- [ ] Test maintainability improved

### Phase 5 (Optimization)
- [ ] Multiple parallelization strategies available
- [ ] CI/CD and local development both supported
- [ ] Performance benchmarks documented

### Phase 6 (Governance)
- [ ] Team practices updated
- [ ] New tests follow memory best practices
- [ ] Pre-commit hook prevents memory-heavy patterns

---

## Final Success Criteria

| Metric | Starting Point | Target | Status |
|--------|---|---|---|
| **Peak Memory** | ~4-5GB (OOM) | <2GB | To measure |
| **Test Pass Rate** | ~95% | 100% | To measure |
| **Execution Time** | ~60-120s | <60s | To measure |
| **CI/CD Success** | Fails on OOM | 100% | To measure |
| **Team Confidence** | Low | High | To measure |

---

## Recommended Execution Order

1. **Start with Story 7** (Jest Config) - immediate relief, 5 minutes
2. **Then Story 1** (Profiling) - establish what works, 2 hours
3. **Then Story 2** (Setup/Teardown) - likely biggest win, 3 hours
4. **Then remaining stories** in priority order based on profiling results

---

## Related Documentation

- **Analysis**: [analysis.md](./analysis.md) - Root cause analysis and technical details
- **User Stories**: [user-stories.md](./user-stories.md) - Full story details with acceptance criteria
- **Quick Start**: Use this backlog summary to discuss priority and approach with the team
