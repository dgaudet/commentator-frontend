# Unit Test Memory Issues - User Stories

## Epic Summary
The unit test suite is running out of memory during execution, causing failures and preventing reliable CI/CD integration. This epic addresses memory optimization, test isolation improvements, and resource management to ensure tests run reliably.

---

## Story 1: INVESTIGATE & PROFILE TEST MEMORY USAGE

**Type**: Investigation / Analysis

**WHEN** developers run the full test suite
**THE SYSTEM SHALL** provide clear visibility into memory consumption by test file, test count, and component complexity

**Acceptance Criteria:**
- AC1: Generate memory profile showing peak memory usage per test file
- AC2: Identify which test files consume the most memory
- AC3: Identify which components (FinalCommentsModal, etc.) have memory-heavy tests
- AC4: Document test counts per file and estimate memory per test
- AC5: Create baseline metrics for comparison after optimizations

**Business Value**: Medium - Establishes the scope of the problem and enables data-driven optimization decisions

**Risk Tier**: Trivial - Pure investigation, no code changes

**Definition of Done**:
- Memory profiling document created with top 10 memory-consuming test files
- Peak memory usage during full test run recorded
- Recommendations for optimization areas identified
- Baseline metrics stored in `pdd-workspace/unit-test-memory-fixes/metrics/baseline.json`

---

## Story 2: OPTIMIZE TEST SETUP & TEARDOWN

**Type**: Performance Optimization

**WHEN** Jest runs before/afterEach hooks in test suites
**THE SYSTEM SHALL** properly clean up resources and avoid memory leaks from unmounted components

**Acceptance Criteria:**
- AC1: Review setupTests.ts for resource leaks (MSW handlers, event listeners, timers)
- AC2: Ensure all rendered components are cleaned up after each test
- AC3: Verify mocked services don't accumulate in memory
- AC4: Implement proper cleanup in test utilities
- AC5: Verify memory usage drops after test completion

**Business Value**: High - Should provide immediate memory reduction

**Risk Tier**: Low - Localized changes to test utilities and setup

**Definition of Done**:
- setupTests.ts refactored with proper cleanup
- test-utils.tsx refactored to ensure component cleanup
- Before/after memory profiles show improvement
- No test failures introduced

---

## Story 3: REDUCE COMPONENT TEST ISOLATION OVERHEAD

**Type**: Test Architecture Refactor

**WHEN** tests render components like FinalCommentsModal with complex contexts
**THE SYSTEM SHALL** minimize context provider wrapping to only what's necessary

**Acceptance Criteria:**
- AC1: Audit all test wrapper implementations for unnecessary providers
- AC2: Create a minimal wrapper for simple unit tests
- AC3: Create a full wrapper for integration tests
- AC4: Extract repeated wrapper logic into reusable test utilities
- AC5: Document when to use minimal vs full wrapper

**Business Value**: High - Reduces boilerplate and memory per test

**Risk Tier**: Low - Affects test utilities, not production code

**Definition of Done**:
- Minimal and full test wrappers created in test-utils.tsx
- Documentation added to test-utils.tsx explaining wrapper selection
- 10+ test files migrated to use minimal wrapper where appropriate
- Memory usage for test files shows measurable reduction

---

## Story 4: CONSOLIDATE REDUNDANT TEST SUITES

**Type**: Code Consolidation

**WHEN** multiple similar test files exist (e.g., FinalCommentsModal.* tests)
**THE SYSTEM SHALL** combine related tests into single file or split by concern with proper cleanup

**Acceptance Criteria:**
- AC1: Analyze FinalCommentsModal test files (9 separate files detected)
- AC2: Identify redundant setup code across files
- AC3: Determine if tests can be consolidated without losing clarity
- AC4: If consolidating: merge and ensure all tests still pass
- AC5: If splitting by concern: ensure each file has a clear purpose
- AC6: Verify memory savings from reduced setup duplication

**Business Value**: High - Significant memory reduction from setup duplication

**Risk Tier**: Medium - Multi-file changes with high test coverage

**Definition of Done**:
- Plan for FinalCommentsModal test consolidation created (to show current structure)
- Memory profile before/after consolidation
- All tests still passing
- Clear documentation of test file structure

---

## Story 5: IMPLEMENT TEST-SPECIFIC MOCKING FOR HEAVY DEPENDENCIES

**Type**: Test Optimization

**WHEN** tests for components need to work with APIs, services, or complex data
**THE SYSTEM SHALL** use lightweight mocks instead of full implementations

**Acceptance Criteria:**
- AC1: Audit MSW setup to ensure light mock servers configured
- AC2: Implement lazy loading for mock handlers (only load what's needed)
- AC3: Create fixture factory for test data instead of loading full datasets
- AC4: Verify hook tests (useClasses, useFinalCommentForm, etc.) use minimal mocks
- AC5: Document mocking patterns for future tests

**Business Value**: Medium-High - Reduces memory from unnecessary mock infrastructure

**Risk Tier**: Low - Changes only test code, not production

**Definition of Done**:
- MSW handlers reviewed and optimized
- Fixture factories created for heavy data structures
- At least 5 hook tests refactored with lighter mocks
- Memory profile shows improvement

---

## Story 6: SPLIT LARGE TEST FILES INTO SMALLER FOCUSED SUITES

**Type**: Test Architecture Refactor

**WHEN** a single test file has 100+ tests with significant setup
**THE SYSTEM SHALL** split into multiple smaller files with focused concerns

**Acceptance Criteria:**
- AC1: Identify test files with 100+ tests
- AC2: Group tests by feature/functionality
- AC3: Create separate test files for each concern
- AC4: Ensure each file has minimal, focused setup
- AC5: Verify total test count is preserved

**Business Value**: Medium - Improves test maintainability and reduces per-file memory

**Risk Tier**: Medium - Affects test organization but not behavior

**Definition of Done**:
- Analysis of large test files documented
- Plan for splitting created (if applicable)
- If splitting: all tests still passing
- Memory improvement metrics captured

---

## Story 7: CONFIGURE JEST MEMORY LIMITS & MAXWORKERS

**Type**: Configuration Optimization

**WHEN** Jest runs tests with default worker configuration
**THE SYSTEM SHALL** use optimal worker count to balance parallelization and memory

**Acceptance Criteria:**
- AC1: Audit current jest.config.js maxWorkers setting (if any)
- AC2: Test with maxWorkers=1 to see if single-threaded runs (baseline)
- AC3: Benchmark with maxWorkers=2 and maxWorkers=4
- AC4: Set maxWorkers to optimal value in jest.config.js
- AC5: Add --max-workers flag to npm scripts as alternative
- AC6: Document in README why this setting exists

**Business Value**: High - Quick fix that can immediately resolve OOM issues

**Risk Tier**: Trivial - Configuration change only

**Definition of Done**:
- jest.config.js updated with maxWorkers setting
- npm run test:coverage completes without OOM
- Benchmarks documented showing improvement
- README updated with explanation

---

## Story 8: IMPLEMENT TEST PARALLELIZATION STRATEGY

**Type**: Process Optimization

**WHEN** running full test suite in CI/CD or locally
**THE SYSTEM SHALL** execute tests in optimal batches to prevent memory exhaustion

**Acceptance Criteria:**
- AC1: Create test batching strategy (group by directory or concern)
- AC2: Implement npm script to run batches sequentially
- AC3: Add npm script for full parallel run (for high-memory environments)
- AC4: Add npm script for low-memory mode (single-threaded, no parallelization)
- AC5: Document which script to use in which scenario
- AC6: Verify all batch strategies produce same test results

**Business Value**: Medium - Enables reliable testing in resource-constrained environments

**Risk Tier**: Trivial - New npm scripts, no code changes

**Definition of Done**:
- test:batch and test:low-memory scripts added to package.json
- Documentation in README explaining each script
- All scripts produce passing test results
- CI/CD config can reference these scripts

---

## Story 9: ADDRESS SPECIFIC HIGH-MEMORY TEST PATTERNS

**Type**: Code Optimization

**WHEN** tests for FinalCommentsModal or similar complex components run
**THE SYSTEM SHALL** avoid render/cleanup cycles that accumulate memory

**Acceptance Criteria:**
- AC1: Review act() warning in FinalCommentsModal tests (seen in coverage output)
- AC2: Wrap state updates in act() properly to avoid re-renders
- AC3: Check for uncleared intervals/timeouts in timer-based tests
- AC4: Verify theme context isn't being recreated unnecessarily
- AC5: Implement proper cleanup for any async operations in tests

**Business Value**: Medium-High - Direct fix for identified test warnings

**Risk Tier**: Low - Localized test fixes

**Definition of Done**:
- FinalCommentsModal test warnings eliminated
- All tests still passing with cleaner output
- Memory profile shows improvement for affected tests
- Pattern documented to avoid in future tests

---

## Story 10: CREATE TEST MEMORY GOVERNANCE & DOCUMENTATION

**Type**: Documentation & Standards

**WHEN** developers write new tests or modify existing ones
**THE SYSTEM SHALL** provide clear guidelines for memory-efficient test practices

**Acceptance Criteria:**
- AC1: Document best practices for test setup/teardown
- AC2: Create examples of efficient vs inefficient test patterns
- AC3: Add memory-aware testing guidelines to CONTRIBUTING.md or similar
- AC4: Document when to use minimal vs full test wrapper
- AC5: Create checklist for test code review: "Does this test leak memory?"
- AC6: Add pre-commit hook to warn about potential memory issues

**Business Value**: Medium - Prevents future memory issues in new tests

**Risk Tier**: Trivial - Documentation only

**Definition of Done**:
- TEST_MEMORY_BEST_PRACTICES.md created with examples
- CONTRIBUTING.md updated with memory guidelines
- Code review checklist shared with team
- Baseline metrics document updated with lessons learned

---

## Prioritization & Dependencies

**Phase 1 (Immediate - Quick Wins)**
1. Story 7: Configure Jest Memory Limits
2. Story 2: Optimize Test Setup & Teardown
3. Story 1: Investigate & Profile Memory Usage

**Phase 2 (Short-term - Root Causes)**
4. Story 5: Implement Lightweight Mocking
5. Story 9: Address Specific High-Memory Patterns
6. Story 3: Reduce Component Test Isolation Overhead

**Phase 3 (Medium-term - Restructuring)**
7. Story 4: Consolidate Redundant Test Suites
8. Story 6: Split Large Test Files
9. Story 8: Implement Test Parallelization

**Phase 4 (Ongoing)**
10. Story 10: Create Test Memory Governance

---

## Success Metrics

- **Memory Usage**: Reduce peak memory from current OOM state to <2GB
- **Test Execution Time**: Maintain or improve test execution time
- **Test Coverage**: Maintain 100% test count (no tests deleted)
- **CI/CD Reliability**: Tests consistently pass in CI without OOM
- **Developer Experience**: Local test runs complete in <30 seconds

---

## Risk Assessment

**Overall Risk**: Medium
- Memory issues often indicate architectural test problems
- Changes affect test infrastructure but not production code
- High confidence in fixes due to industry-standard patterns

**Mitigation**:
- Run full test suite after each story to verify no regressions
- Maintain baseline metrics for before/after comparison
- Document all changes for knowledge sharing
