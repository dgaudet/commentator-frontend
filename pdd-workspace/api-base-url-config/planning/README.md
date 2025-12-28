# API Base URL Configuration Feature - Planning Documentation

**Feature**: Make API Client Base URL Configurable via apiConfig
**Status**: ✅ COMPLETE
**Created**: 2025-12-28
**Completed**: 2025-12-28
**Complexity**: L0 (ATOMIC)

---

## ✅ Completion Summary

**All 4 User Stories Completed**:
- ✅ TASK-1.1: ApiConfig Interface created in `src/config/apiConfig.ts`
- ✅ TASK-1.2: getDefaultApiConfig() factory implemented, reads VITE_API_BASE_URL from environment
- ✅ TASK-1.3: createTestApiConfig() test helper implemented with optional overrides
- ✅ TASK-1.4: apiClient.ts updated to use getDefaultApiConfig()

**Quality Metrics**:
- Build: ✅ 0 TypeScript errors
- Tests: ✅ 1,359 tests passing
- Pattern: ✅ Matches authConfig.ts exactly
- Breaking Changes: ✅ None

**Key Implementation Detail**:
vite.config.ts strips the VITE_ prefix when defining variables, so VITE_API_BASE_URL becomes process.env.API_BASE_URL in code. setupTests.ts was updated to set the correct environment variable for tests.

---

## 📋 Quick Navigation

This workspace contains all planning documentation for creating a centralized API configuration class (`apiConfig.ts`) that mirrors the existing `authConfig.ts` pattern.

### Documents in This Feature

| Document | Purpose | Audience |
|----------|---------|----------|
| **prd.md** | Product Requirements with business context, goals, and success metrics | Product managers, stakeholders |
| **user-stories.md** | 4 detailed user stories with acceptance criteria and implementation tasks | Developers, QA engineers |
| **metadata.json** | Feature complexity assessment and scope summary | Team leads, planners |
| **README.md** | This file - navigation and quick reference | Everyone |

---

## 🎯 At a Glance

**Total Effort**: ~30 minutes
**Total Stories**: 4
**Total Files**: 1 new, 1 updated
**Complexity Level**: L0 (ATOMIC)

### Story Breakdown by Priority
```
P0 - Critical (Must Do)
├── TASK-1.1: Create ApiConfig Interface       (5 min)
├── TASK-1.2: Create getDefaultApiConfig()     (5 min)
└── TASK-1.4: Update apiClient to use apiConfig (10 min)

P1 - High Value (Should Do)
└── TASK-1.3: Create createTestApiConfig()     (5 min)

Total: ~30 minutes
```

---

## 🚀 Getting Started

### For Developers
1. Read `user-stories.md` to understand the work (4 small stories)
2. Review `prd.md` for business context and requirements
3. Reference `src/config/authConfig.ts` as your pattern guide
4. Implement stories in recommended order (TASK-1.1 → TASK-1.2 → TASK-1.3 → TASK-1.4)
5. Verify with `npm run test` and `npm run build`

### For Code Reviewers
1. Check `prd.md` for acceptance criteria
2. Verify each story in `user-stories.md` is complete
3. Ensure pattern matches `authConfig.ts` exactly
4. Confirm no breaking changes to existing code

### For Team Leads
1. Review `metadata.json` for scope and complexity assessment
2. This is a quick L0 feature - single developer, <1 hour
3. No architectural decisions needed
4. No blockers or dependencies

---

## 📖 Pattern Reference

### Follow This Exactly: `src/config/authConfig.ts`

```typescript
// Interface
export interface AuthConfig {
  domain: string
  clientId: string
  redirectUri: string
  audience: string
}

// Factory function
export function getDefaultAuthConfig(): AuthConfig {
  const domain = process.env.AUTH0_DOMAIN
  // ... validation ...
  return { domain, clientId, redirectUri, audience }
}

// Test helper
export function createTestAuthConfig(overrides?: Partial<AuthConfig>): AuthConfig {
  return {
    domain: 'test.auth0.com',
    clientId: 'test-client-id',
    // ...
    ...overrides,
  }
}
```

### Apply This Pattern to apiConfig.ts

```typescript
// Interface
export interface ApiConfig {
  baseUrl: string
}

// Factory function
export function getDefaultApiConfig(): ApiConfig {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  return {
    baseUrl: baseUrl || 'http://localhost:3000'
  }
}

// Test helper
export function createTestApiConfig(overrides?: Partial<ApiConfig>): ApiConfig {
  return {
    baseUrl: 'http://localhost:3000',
    ...overrides,
  }
}
```

---

## ✅ Implementation Checklist

### Before Starting
- [ ] Read `prd.md` for business context
- [ ] Read `user-stories.md` for detailed requirements
- [ ] Review `authConfig.ts` to understand the pattern
- [ ] Set up development environment

### During Implementation
- [ ] Follow recommended story order (TASK-1.1 → TASK-1.2 → TASK-1.3 → TASK-1.4)
- [ ] Create feature branch: `feature/api-base-url-config`
- [ ] Commit with clear messages referencing story IDs (TASK-1.1, etc.)
- [ ] After each story, verify: `npm run build`, `npm run test`, `npm run lint`

### Story Implementation Steps

#### TASK-1.1: Create Interface
- [ ] Create `src/config/apiConfig.ts`
- [ ] Define `ApiConfig` interface with `baseUrl: string`
- [ ] Add JSDoc comments

#### TASK-1.2: getDefaultApiConfig()
- [ ] Read `VITE_API_BASE_URL` from `import.meta.env`
- [ ] Implement fallback to `http://localhost:3000`
- [ ] Add comprehensive JSDoc

#### TASK-1.3: createTestApiConfig()
- [ ] Create test factory function
- [ ] Support optional overrides
- [ ] Add JSDoc with examples

#### TASK-1.4: Update apiClient
- [ ] Import `getDefaultApiConfig` in `apiClient.ts`
- [ ] Update `getBaseUrl()` to use apiConfig
- [ ] Verify all tests pass

### Verification
- [ ] All 4 stories implemented
- [ ] `npm run build` passes (0 errors, 0 warnings)
- [ ] `npm run test` passes (all tests green)
- [ ] `npm run lint` passes (0 errors, 0 warnings)
- [ ] No breaking changes to existing code
- [ ] Pattern matches `authConfig.ts`

### Code Review
- [ ] Code follows project style guide
- [ ] TypeScript types are correct
- [ ] JSDoc comments are clear
- [ ] Tests provide good coverage
- [ ] PR description references `prd.md` and `user-stories.md`

### Final Steps
- [ ] Merge to `main` branch
- [ ] Verify CI/CD pipeline passes
- [ ] Update team on completion
- [ ] Celebrate! 🎉 (Small but high-quality feature)

---

## 📊 File Structure

### New File: `src/config/apiConfig.ts`
- ~50 lines
- 1 interface (ApiConfig)
- 2 functions (getDefaultApiConfig, createTestApiConfig)
- Full JSDoc documentation

### Updated File: `src/services/apiClient.ts`
- Update `getBaseUrl()` function (~2 lines)
- Add import for `getDefaultApiConfig`
- Remove or update `env.baseUrl` dependency

### Optional Update: `src/config/env.ts`
- Could export apiConfig instead of raw baseUrl
- Not required, but improves consistency

---

## 🧪 Testing Strategy

### Unit Tests (Recommended but Optional)

```typescript
// src/config/__tests__/apiConfig.test.ts
describe('apiConfig', () => {
  it('should provide default configuration from environment', () => {
    const config = getDefaultApiConfig()
    // Should return baseUrl from env or default
  })

  it('should provide test configuration', () => {
    const config = createTestApiConfig()
    expect(config.baseUrl).toBe('http://localhost:3000')
  })

  it('should support test configuration overrides', () => {
    const config = createTestApiConfig({ baseUrl: 'http://custom:3000' })
    expect(config.baseUrl).toBe('http://custom:3000')
  })
})
```

### Integration Testing
- Verify `apiClient` uses `apiConfig` correctly
- Test with different VITE_API_BASE_URL values
- Verify production build uses .env.production values

---

## 🔧 Common Patterns & Solutions

### Pattern: Reading Environment Variables

**Before**: `process.env.VITE_API_BASE_URL`
**After**: `import.meta.env.VITE_API_BASE_URL`

Why? `import.meta.env` works consistently in both browser and test environments with Vite's static replacement.

### Pattern: Fallback Values

```typescript
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
```

Ensures a value is always returned, even if env var is not set.

### Pattern: Dependency Injection

```typescript
// Use the config directly (simplest)
const config = getDefaultApiConfig()

// Or inject custom config in tests
const testConfig = createTestApiConfig({ baseUrl: 'http://test:3000' })
```

---

## 📚 Environment Variables Reference

| Variable | Required? | Default | Development | Production |
|----------|-----------|---------|-------------|------------|
| `VITE_API_BASE_URL` | No | `http://localhost:3000` | `http://localhost:3001` | `https://api.example.com` |

### Where to Set
- **Development**: `.env`
- **Production**: `.env.production`
- **Tests**: Use `createTestApiConfig()` or `createTestApiConfig({ baseUrl: '...' })`

---

## 🤝 Code Review Checklist

When reviewing PRs for this feature:

- [ ] `apiConfig.ts` matches `authConfig.ts` pattern
- [ ] Interface has proper JSDoc
- [ ] `getDefaultApiConfig()` reads from `import.meta.env.VITE_API_BASE_URL`
- [ ] Fallback value is `http://localhost:3000`
- [ ] `createTestApiConfig()` supports overrides
- [ ] `apiClient.ts` updated to use `getDefaultApiConfig()`
- [ ] All tests pass
- [ ] No breaking changes
- [ ] TypeScript compilation successful
- [ ] Linting passes

---

## ❓ FAQ

**Q: Why create a new config file instead of just using env.ts?**
A: Consistency. We have `authConfig.ts` for Auth0 configuration using the same pattern. One pattern = predictability.

**Q: Do we need to write tests for apiConfig.ts?**
A: Optional. The logic is simple enough that tests may be overkill, but they're a nice addition.

**Q: Will this break anything?**
A: No. The refactoring maintains identical behavior. All API calls work the same.

**Q: Can we use this pattern for other configurations?**
A: Yes! Future database configs, logging configs, etc. can follow the same pattern.

**Q: What about the fallback URL?**
A: We're keeping `http://localhost:3000` as default because it's what the code currently uses.

---

## 🎓 Learning Resources

This feature demonstrates:
- Configuration management patterns
- Dependency injection in JavaScript/TypeScript
- Environment variable handling in Vite
- Test fixture factories
- Factory pattern usage

---

## 📝 Document History

| Date | Author | Change |
|------|--------|--------|
| 2025-12-28 | Product Owner | Initial planning documentation |

---

## Related Documentation

- **Pattern Reference**: `src/config/authConfig.ts`
- **Current Implementation**: `src/services/apiClient.ts`
- **Environment File**: `.env` and `.env.production`
- **Project Config**: `.pdd/core-config.yaml`

---

**Prepared By**: Principal Product Owner
**Status**: ✅ IMPLEMENTATION COMPLETE
**Next Step**: Feature is ready for merge and deployment

---

## 🎉 Implementation Complete!

### Completed By
Frontend Engineer (Principal)

### Implementation Timeline
- Created: 2025-12-28
- Completed: 2025-12-28
- Actual Time: ~30 minutes (as estimated)

### Deliverables
- [x] `src/config/apiConfig.ts` - Configuration interface and factories
- [x] Updated `src/services/apiClient.ts` - Uses getDefaultApiConfig()
- [x] Updated `src/setupTests.ts` - Test environment variables
- [x] All 4 user stories passing acceptance criteria
- [x] 0 TypeScript compilation errors
- [x] 1,359 tests passing
- [x] No breaking changes

### Ready for Production
The feature is production-ready and maintains backward compatibility with existing code. The API client now properly reads the base URL from environment variables across all deployment environments (development, staging, production).
