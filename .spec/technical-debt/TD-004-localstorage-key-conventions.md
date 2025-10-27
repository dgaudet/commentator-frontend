# TD-004: localStorage Keys Use Different Conventions

**Priority**: LOW
**Effort**: 1-2 story points
**Status**: Not Started
**Related**: Code Consistency, User Experience
**Dependencies**: None (can be done anytime)

---

## Problem Statement

The application uses different naming conventions for localStorage keys across features, creating inconsistency and potential confusion for developers. This inconsistency makes the codebase harder to maintain and increases the risk of key collisions.

**Current localStorage Keys**:

| Feature | Key | Convention | Location |
|---------|-----|------------|----------|
| Class Selection | `commentator.selectedClassId` | Namespaced, camelCase | `useClasses.ts` |
| Subject Selection | `commentator.selectedSubjectId` | Namespaced, camelCase | `useSubjects.ts` |
| (Future) Theme | `theme` or `commentator.theme`? | Unknown | Not yet implemented |
| (Future) User Prefs | `userPreferences`? | Unknown | Not yet implemented |

**Issues**:
1. **Inconsistency Risk**: As more features use localStorage, naming patterns may diverge
2. **No Central Registry**: No single source of truth for localStorage keys
3. **Collision Risk**: Future features might accidentally reuse keys
4. **Hard to Debug**: Scattered key definitions make debugging difficult
5. **No TypeScript Safety**: Keys are string literals, no autocomplete or type checking

**Why LOW Priority**:
Currently, only 2 keys exist and both follow the same `commentator.` namespace convention. No bugs or user issues have occurred. This is preventative maintenance to avoid future problems as the app grows.

---

## User Stories (EARS Format)

### US-TD-004-001: Centralize localStorage Key Definitions (LOW - 1 pt)

**As a** developer
**I want** all localStorage keys defined in a central constant file
**So that** I can prevent key collisions and maintain consistency

**Acceptance Criteria**:

WHEN localStorage keys are needed in the application
THE SYSTEM SHALL retrieve them from a central `src/constants/storageKeys.ts` file

WHEN a new feature requires localStorage
THE SYSTEM SHALL enforce adding the key to the central registry

WHEN localStorage keys are accessed
THE SYSTEM SHALL use TypeScript constants for type safety

WHEN reviewing the codebase
THE SYSTEM SHALL have zero hard-coded localStorage key strings outside the constants file

### US-TD-004-002: Add localStorage Key Documentation (LOW - 1 pt)

**As a** developer
**I want** documentation explaining localStorage key conventions
**So that** future developers follow consistent patterns

**Acceptance Criteria**:

WHEN adding a new localStorage key
THE SYSTEM SHALL provide documentation on naming conventions

WHEN documentation is reviewed
THE SYSTEM SHALL explain the `commentator.` namespace prefix

WHEN documentation is reviewed
THE SYSTEM SHALL list all current localStorage keys and their purposes

WHEN documentation is reviewed
THE SYSTEM SHALL provide examples of proper key naming

---

## Technical Design

### Option 1: Central Constants File (Recommended)

**Pros**:
- Single source of truth for all keys
- TypeScript autocomplete and type safety
- Easy to audit all localStorage usage
- Prevents accidental key collisions

**Cons**:
- Requires updating all existing localStorage usage
- Minor refactoring effort

**Implementation**:

#### 1. Create `src/constants/storageKeys.ts`

```typescript
/**
 * Central registry for all localStorage keys used in the application.
 *
 * Naming Convention:
 * - All keys use the "commentator." namespace prefix
 * - Use camelCase for key names
 * - Be descriptive and specific
 *
 * Examples:
 * - commentator.selectedSubjectId
 * - commentator.theme
 * - commentator.userPreferences
 * - commentator.lastLoginDate
 */

export const STORAGE_KEYS = {
  /**
   * Stores the ID of the currently selected subject.
   * Used to persist user's subject selection across page reloads.
   * Type: number (stored as string)
   */
  SELECTED_SUBJECT_ID: 'commentator.selectedSubjectId',

  /**
   * (Legacy) Stores the ID of the currently selected class.
   * Will be removed after Class infrastructure deprecation (TD-003).
   * Type: number (stored as string)
   * @deprecated Use SELECTED_SUBJECT_ID instead
   */
  SELECTED_CLASS_ID: 'commentator.selectedClassId',

  // Future keys (add as needed):
  // THEME: 'commentator.theme',
  // USER_PREFERENCES: 'commentator.userPreferences',
  // LAST_LOGIN_DATE: 'commentator.lastLoginDate',
} as const

/**
 * Type-safe localStorage wrapper for getting values.
 *
 * @param key - One of the predefined storage keys
 * @returns The stored value, or null if not found
 *
 * @example
 * const subjectId = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
 */
export function getStorageItem(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]): string | null {
  return localStorage.getItem(key)
}

/**
 * Type-safe localStorage wrapper for setting values.
 *
 * @param key - One of the predefined storage keys
 * @param value - The value to store
 *
 * @example
 * setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '123')
 */
export function setStorageItem(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], value: string): void {
  localStorage.setItem(key, value)
}

/**
 * Type-safe localStorage wrapper for removing values.
 *
 * @param key - One of the predefined storage keys
 *
 * @example
 * removeStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
 */
export function removeStorageItem(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]): void {
  localStorage.removeItem(key)
}

/**
 * Clear all commentator-specific localStorage keys.
 * Useful for logout or reset functionality.
 */
export function clearCommentatorStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}
```

#### 2. Update `src/hooks/useSubjects.ts`

```typescript
// BEFORE
useEffect(() => {
  const savedId = localStorage.getItem('commentator.selectedSubjectId')
  if (savedId) {
    const numId = Number(savedId)
    // ...
  }
}, [subjects])

// AFTER
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys'

useEffect(() => {
  const savedId = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
  if (savedId) {
    const numId = Number(savedId)
    // ...
  }
}, [subjects])

// Update setSelectedSubject callback
const setSelectedSubject = useCallback((subject: Subject | null) => {
  setSelected(subject)
  if (subject) {
    setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, subject.id.toString())
  }
}, [])
```

#### 3. Update `src/hooks/useClasses.ts` (if not yet deprecated)

```typescript
// BEFORE
useEffect(() => {
  const savedId = localStorage.getItem('commentator.selectedClassId')
  // ...
}, [classes])

// AFTER
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys'

useEffect(() => {
  const savedId = getStorageItem(STORAGE_KEYS.SELECTED_CLASS_ID)
  // ...
}, [classes])
```

#### 4. Update E2E Tests

**File**: `e2e/subjectManagement.spec.ts`

```typescript
// BEFORE
await page.evaluate(() => {
  localStorage.setItem('commentator.selectedSubjectId', '1')
})

// AFTER
import { STORAGE_KEYS } from '../src/constants/storageKeys'

await page.evaluate((key) => {
  localStorage.setItem(key, '1')
}, STORAGE_KEYS.SELECTED_SUBJECT_ID)
```

### Option 2: Enum-Based Keys (Alternative)

**Implementation**:
```typescript
export enum StorageKey {
  SelectedSubjectId = 'commentator.selectedSubjectId',
  SelectedClassId = 'commentator.selectedClassId',
}

// Usage
localStorage.getItem(StorageKey.SelectedSubjectId)
```

**Why Not Recommended**:
- Less flexible than const object
- Harder to add documentation
- No built-in type-safe helper functions

---

## Implementation Tasks

### Task 1: Create Central Storage Keys File (GREEN)
**Risk**: Trivial
**Effort**: 30 minutes

1. Create `src/constants/storageKeys.ts`
2. Define `STORAGE_KEYS` constant with current keys
3. Add JSDoc documentation for each key
4. Export type-safe helper functions (getStorageItem, setStorageItem, removeStorageItem)
5. Add `clearCommentatorStorage()` utility function
6. Run TypeScript compiler to verify no errors

### Task 2: Update useSubjects Hook (RED)
**Risk**: Low
**Effort**: 15 minutes

1. Import `STORAGE_KEYS` and helper functions in `useSubjects.ts`
2. Replace `localStorage.getItem('commentator.selectedSubjectId')` with `getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)`
3. Replace `localStorage.setItem('commentator.selectedSubjectId', ...)` with `setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, ...)`
4. Run TypeScript compiler to verify no errors
5. Verify tests still pass

### Task 3: Update useClasses Hook (RED) (Skip if Class already deprecated)
**Risk**: Low
**Effort**: 15 minutes

1. Import `STORAGE_KEYS` and helper functions in `useClasses.ts`
2. Replace hard-coded key with `STORAGE_KEYS.SELECTED_CLASS_ID`
3. Use helper functions instead of direct localStorage calls
4. Run TypeScript compiler to verify no errors
5. Verify tests still pass

### Task 4: Update E2E Tests (GREEN)
**Risk**: Low
**Effort**: 30 minutes

1. Import `STORAGE_KEYS` in `e2e/subjectManagement.spec.ts`
2. Replace hard-coded key strings with constants
3. Update `e2e/classManagement.spec.ts` if not yet deprecated
4. Run E2E tests to verify functionality unchanged
5. Verify localStorage persistence tests still pass

### Task 5: Add Unit Tests for Storage Utilities (GREEN)
**Risk**: Trivial
**Effort**: 30 minutes

1. Create `src/constants/__tests__/storageKeys.test.ts`
2. Test `getStorageItem()` returns correct values
3. Test `setStorageItem()` stores values correctly
4. Test `removeStorageItem()` removes values
5. Test `clearCommentatorStorage()` clears all commentator keys
6. Mock localStorage for tests
7. Run tests to verify all pass

### Task 6: Verify No Hard-Coded Keys Remain (REFACTOR)
**Risk**: Trivial
**Effort**: 15 minutes

1. Search codebase for `'commentator.` strings
2. Search codebase for `localStorage.getItem` calls
3. Search codebase for `localStorage.setItem` calls
4. Verify all usages now use `STORAGE_KEYS` constants
5. Update any missed occurrences
6. Run all tests to confirm

### Task 7: Add Documentation (REFACTOR)
**Risk**: Trivial
**Effort**: 15 minutes

1. Add localStorage section to `README.md`
2. Document naming conventions
3. List all current storage keys and purposes
4. Add examples of adding new keys
5. Update `CLAUDE.md` with localStorage guidelines

---

## Testing Strategy

### Unit Tests

Create `src/constants/__tests__/storageKeys.test.ts`:

```typescript
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearCommentatorStorage
} from '../storageKeys'

describe('storageKeys', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('STORAGE_KEYS', () => {
    it('should define SELECTED_SUBJECT_ID key', () => {
      expect(STORAGE_KEYS.SELECTED_SUBJECT_ID).toBe('commentator.selectedSubjectId')
    })

    it('should define SELECTED_CLASS_ID key', () => {
      expect(STORAGE_KEYS.SELECTED_CLASS_ID).toBe('commentator.selectedClassId')
    })

    it('should have commentator namespace prefix for all keys', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(key).toMatch(/^commentator\./)
      })
    })
  })

  describe('getStorageItem', () => {
    it('should retrieve stored value', () => {
      localStorage.setItem('commentator.selectedSubjectId', '123')
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBe('123')
    })

    it('should return null for non-existent key', () => {
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBeNull()
    })
  })

  describe('setStorageItem', () => {
    it('should store value in localStorage', () => {
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '456')
      const value = localStorage.getItem('commentator.selectedSubjectId')
      expect(value).toBe('456')
    })
  })

  describe('removeStorageItem', () => {
    it('should remove value from localStorage', () => {
      localStorage.setItem('commentator.selectedSubjectId', '789')
      removeStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      const value = localStorage.getItem('commentator.selectedSubjectId')
      expect(value).toBeNull()
    })
  })

  describe('clearCommentatorStorage', () => {
    it('should clear all commentator keys', () => {
      localStorage.setItem('commentator.selectedSubjectId', '1')
      localStorage.setItem('commentator.selectedClassId', '2')
      localStorage.setItem('other.key', 'keep-me')

      clearCommentatorStorage()

      expect(localStorage.getItem('commentator.selectedSubjectId')).toBeNull()
      expect(localStorage.getItem('commentator.selectedClassId')).toBeNull()
      expect(localStorage.getItem('other.key')).toBe('keep-me')
    })
  })
})
```

### Integration Tests
- [ ] useSubjects hook still persists selection after refactor
- [ ] useClasses hook still persists selection after refactor
- [ ] E2E tests for localStorage persistence still pass
- [ ] No hard-coded localStorage key strings found in codebase

### Validation
- [ ] TypeScript compilation successful
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Grep for hard-coded keys returns zero results

---

## Documentation Updates

### README.md

Add new section:

```markdown
## localStorage Usage

The application uses localStorage to persist user preferences across sessions. All keys follow a consistent naming convention.

### Storage Keys

All localStorage keys use the `commentator.` namespace prefix to avoid collisions with other applications or browser extensions.

| Key | Purpose | Type |
|-----|---------|------|
| `commentator.selectedSubjectId` | Persist selected subject across page reloads | number (stored as string) |
| `commentator.selectedClassId` | (Deprecated) Persist selected class | number (stored as string) |

### Adding New Storage Keys

When adding a new localStorage key:

1. Add the key to `src/constants/storageKeys.ts`
2. Use the `commentator.` namespace prefix
3. Use camelCase for key names
4. Add JSDoc documentation explaining the key's purpose
5. Use type-safe helper functions (`getStorageItem`, `setStorageItem`, `removeStorageItem`)

**Example**:

\`\`\`typescript
// In src/constants/storageKeys.ts
export const STORAGE_KEYS = {
  // ... existing keys
  THEME: 'commentator.theme',
} as const

// Usage in components/hooks
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys'

const theme = getStorageItem(STORAGE_KEYS.THEME)
setStorageItem(STORAGE_KEYS.THEME, 'dark')
\`\`\`

### Clearing Storage

To clear all commentator-specific localStorage data:

\`\`\`typescript
import { clearCommentatorStorage } from '../constants/storageKeys'

clearCommentatorStorage()
\`\`\`
```

### CLAUDE.md

Add to Code Quality Standards section:

```markdown
### localStorage Conventions

When using localStorage:
1. Always use constants from `src/constants/storageKeys.ts`
2. Use the `commentator.` namespace prefix for all keys
3. Use camelCase for key names
4. Add JSDoc documentation for each key
5. Use type-safe helper functions (`getStorageItem`, `setStorageItem`, `removeStorageItem`)
6. Never use hard-coded string literals for localStorage keys

**Bad**:
\`\`\`typescript
localStorage.getItem('selectedSubjectId')
localStorage.setItem('theme', 'dark')
\`\`\`

**Good**:
\`\`\`typescript
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys'

getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
setStorageItem(STORAGE_KEYS.THEME, 'dark')
\`\`\`
```

---

## Benefits

### Code Quality
- **Type Safety**: TypeScript autocomplete for all storage keys
- **Single Source of Truth**: All keys defined in one file
- **No Collisions**: Easy to audit and prevent duplicate keys
- **Better Refactoring**: Can rename keys in one place

### Developer Experience
- **Autocomplete**: IDE suggests available storage keys
- **Documentation**: JSDoc comments explain each key's purpose
- **Consistency**: All code follows same pattern
- **Easier Debugging**: Can see all storage keys at a glance

### Maintenance
- **Easy Auditing**: Review all storage usage in one file
- **Safe Deprecation**: Mark old keys as deprecated
- **Migration Path**: Clear way to rename or remove keys
- **Testing**: Can mock storage consistently

---

## Risks and Mitigation

### Risk 1: Breaking Existing User Data
**Scenario**: Users have data stored with old keys

**Mitigation**:
- Use exact same key strings in constants (no renaming)
- Only change how we reference keys in code
- User data remains accessible with no migration needed

### Risk 2: Missed Hard-Coded Keys
**Scenario**: Some localStorage calls not updated

**Mitigation**:
- Use grep to search for all localStorage usage
- Add ESLint rule to warn on direct localStorage usage (future)
- Run comprehensive test suite
- Manual code review

---

## Dependencies

- **Requires**: None (standalone improvement)
- **Blocks**: None (does not block other work)
- **Relates to**: TD-003 (Class deprecation will remove SELECTED_CLASS_ID)

---

## Acceptance Criteria

This technical debt item is complete when:

1. `src/constants/storageKeys.ts` file created with all keys
2. Type-safe helper functions implemented
3. `useSubjects.ts` updated to use constants
4. `useClasses.ts` updated to use constants (if not deprecated)
5. E2E tests updated to use constants
6. Unit tests for storage utilities passing
7. Zero hard-coded localStorage key strings remain (verified by grep)
8. Documentation updated (README.md, CLAUDE.md)
9. All tests pass (unit, integration, E2E)
10. TypeScript compilation successful
11. Code review approved
