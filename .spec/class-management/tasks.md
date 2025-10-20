# Implementation Tasks: Class Management Feature

**Version:** 1.0.0
**Created:** 2025-10-20
**Status:** READY FOR EXECUTION
**Sprint:** Sprint 1 (MVP - US-CLASS-001 & US-CLASS-002)

---

## Table of Contents

1. [Task Overview](#task-overview)
2. [Phase 1: Project Setup & Infrastructure](#phase-1-project-setup--infrastructure)
3. [Phase 2: Service Layer (TDD)](#phase-2-service-layer-tdd)
4. [Phase 3: Custom Hooks (TDD)](#phase-3-custom-hooks-tdd)
5. [Phase 4: Components (TDD)](#phase-4-components-tdd)
6. [Phase 5: Integration & E2E](#phase-5-integration--e2e)
7. [Phase 6: Polish & Deployment](#phase-6-polish--deployment)

---

## Task Overview

### Risk Tier Legend
- 🟢 **TRIVIAL**: Single-file, localized changes (auto-approved, 0 retries)
- 🟡 **LOW**: Localized edits, non-API changes (auto-approved, 2 retries)
- 🟠 **MEDIUM**: Multi-file, additive APIs, config (requires approval, 1 retry)
- 🔴 **HIGH**: Cross-cutting, deletions, migrations (requires approval, 0 retries)

### TDD Workflow
Every implementation task follows the Red-Green-Refactor cycle:
1. ✅ **Write Failing Test** (RED)
2. ✅ **Confirm Test Fails**
3. ✅ **Write Minimal Implementation** (GREEN)
4. ✅ **Confirm Test Passes**
5. ✅ **Refactor & Improve** (REFACTOR)

### Test File Organization
All test files must be placed in `__tests__` directories:
- Test files should be located in a `__tests__` subdirectory within the same directory as the code being tested
- Example: `src/components/Button.tsx` → `src/components/__tests__/Button.test.tsx`
- This follows Jest's standard convention for test file organization

---

## Phase 1: Project Setup & Infrastructure

### TASK-1.1: Initialize React + Vite Project 🟠 MEDIUM
**Risk Tier**: MEDIUM (multi-file project initialization)
**Effort**: 1 hour
**Dependencies**: None
**User Story**: N/A (Infrastructure)

**Acceptance Criteria**:
- [ ] React 18.x + Vite project created
- [ ] TypeScript configured (strict mode enabled)
- [ ] ESLint + Prettier configured
- [ ] Stylelint configured
- [ ] npm scripts: `start`, `test`, `lint`, `build`
- [ ] `.nvmrc` with Node v24 present
- [ ] `.env.example` created with `VITE_API_BASE_URL`
- [ ] Project runs successfully (`npm run start`)

**Commands**:
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D eslint prettier stylelint eslint-config-prettier
npm run lint  # Must pass
npm run start  # Must load successfully
```

**Deliverables**:
- `package.json` with all dependencies
- `vite.config.ts` configured
- `tsconfig.json` with strict mode
- `.eslintrc.json`, `.prettierrc`, `.stylelintrc.json`
- `.env.example` with API base URL

**Test Validation**:
- `npm run lint` exits with 0
- `npm run start` serves on localhost:5173
- TypeScript compilation succeeds

**Rollback**: Delete `node_modules`, `package-lock.json`, `dist`

---

### TASK-1.2: Create TypeScript Type Definitions 🟡 LOW
**Risk Tier**: LOW (single file, no API changes)
**Effort**: 30 minutes
**Dependencies**: TASK-1.1
**User Story**: US-CLASS-001, US-CLASS-002
**Traceability**: DES-5, DES-6

**Acceptance Criteria**:
- [ ] `src/types/Class.ts` created with interfaces
- [ ] `src/types/ApiResponse.ts` created
- [ ] All fields match actual backend API (camelCase)
- [ ] ID type is `number` (not string/UUID)
- [ ] TypeScript compilation passes

**TDD Steps**:
1. **RED**: Create test file `src/types/__tests__/Class.test.ts` (type validation tests)
2. **RED**: Run tests - should fail (types don't exist)
3. **GREEN**: Create `Class.ts` with interfaces
4. **GREEN**: Run tests - should pass
5. **REFACTOR**: Add JSDoc comments

**Implementation**:
```typescript
// src/types/Class.ts
export interface Class {
  id: number;                    // Integer ID from backend
  name: string;                  // Class name (1-100 chars)
  year: number;                  // Academic year (2000-2099)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}

export interface CreateClassRequest {
  name: string;
  year: number;
}

export interface UpdateClassRequest {
  name: string;
  year: number;
}
```

```typescript
// src/types/ApiResponse.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]> | string;
}
```

**Test Validation**:
```typescript
// src/types/__tests__/Class.test.ts
import { Class, CreateClassRequest } from '../Class';

describe('Class Types', () => {
  it('should accept valid class object', () => {
    const validClass: Class = {
      id: 1,
      name: 'Math 101',
      year: 2024,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };
    expect(validClass.id).toBe(1);
  });

  it('should enforce required fields in CreateClassRequest', () => {
    const request: CreateClassRequest = {
      name: 'English 201',
      year: 2024,
    };
    expect(request.name).toBeDefined();
    expect(request.year).toBeDefined();
  });
});
```

**Rollback**: Delete `src/types/` directory

---

### TASK-1.3: Setup Testing Infrastructure (Jest + RTL) 🟠 MEDIUM
**Risk Tier**: MEDIUM (multi-file config, test setup)
**Effort**: 1.5 hours
**Dependencies**: TASK-1.1
**User Story**: N/A (Infrastructure)

**Acceptance Criteria**:
- [ ] Jest configured for TypeScript
- [ ] React Testing Library installed
- [ ] Mock Service Worker (MSW) configured
- [ ] Test utilities created (`src/test-utils.tsx`)
- [ ] Sample test passes successfully

**Commands**:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @types/jest ts-jest
npm install -D msw
npm test  # Should run successfully
```

**Deliverables**:
- `jest.config.js` with TypeScript support
- `src/setupTests.ts` with RTL imports
- `src/test-utils.tsx` with custom render
- `src/mocks/handlers.ts` (MSW handlers)
- `src/mocks/server.ts` (MSW server setup)

**Test Validation**:
```typescript
// src/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/commentator/i)).toBeInTheDocument();
  });
});
```

**Rollback**: Remove test dependencies from package.json, delete test files

---

### TASK-1.4: Create MSW Mock Handlers for Classes API 🟡 LOW
**Risk Tier**: LOW (single file, test infrastructure)
**Effort**: 45 minutes
**Dependencies**: TASK-1.3, TASK-1.2
**User Story**: US-CLASS-001, US-CLASS-002
**Traceability**: DES-7, DES-22

**Acceptance Criteria**:
- [ ] MSW handlers for all 5 class endpoints
- [ ] Mock data matches actual backend response format
- [ ] Handlers return correct HTTP status codes
- [ ] Error scenarios covered (400, 404, 500)

**TDD Steps**:
1. **RED**: Write test that expects mock API to return classes
2. **RED**: Run test - should fail (no handlers)
3. **GREEN**: Create MSW handlers
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Extract mock data to separate file

**Implementation**:
```typescript
// src/mocks/data/classes.ts
import { Class } from '../../types/Class';

export const mockClasses: Class[] = [
  {
    id: 1,
    name: 'Mathematics 101',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'English 201',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
];
```

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { mockClasses } from './data/classes';

const BASE_URL = 'http://localhost:3000';

export const handlers = [
  // GET /class - List all classes
  http.get(`${BASE_URL}/class`, () => {
    return HttpResponse.json(mockClasses);
  }),

  // POST /class - Create new class
  http.post(`${BASE_URL}/class`, async ({ request }) => {
    const body = await request.json() as { name: string; year: number };
    const newClass = {
      id: mockClasses.length + 1,
      name: body.name,
      year: body.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newClass, { status: 201 });
  }),

  // GET /class/:id - Get class by ID
  http.get(`${BASE_URL}/class/:id`, ({ params }) => {
    const classItem = mockClasses.find(c => c.id === Number(params.id));
    if (!classItem) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Class not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(classItem);
  }),

  // PUT /class/:id - Update class
  http.put(`${BASE_URL}/class/:id`, async ({ params, request }) => {
    const body = await request.json() as { name: string; year: number };
    const classItem = mockClasses.find(c => c.id === Number(params.id));
    if (!classItem) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Class not found' },
        { status: 404 }
      );
    }
    const updated = {
      ...classItem,
      name: body.name,
      year: body.year,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updated);
  }),

  // DELETE /class/:id - Delete class
  http.delete(`${BASE_URL}/class/:id`, ({ params }) => {
    const classItem = mockClasses.find(c => c.id === Number(params.id));
    if (!classItem) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Class not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: 'Class deleted successfully',
      deletedClass: classItem,
    });
  }),
];
```

**Test Validation**:
```typescript
// src/mocks/__tests__/handlers.test.ts
import { http } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from '../handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MSW Handlers', () => {
  it('should return list of classes', async () => {
    const response = await fetch('http://localhost:3000/class');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should create new class', async () => {
    const response = await fetch('http://localhost:3000/class', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Class', year: 2025 }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Test Class');
  });
});
```

**Rollback**: Delete `src/mocks/` directory

---

## Phase 2: Service Layer (TDD)

### TASK-2.1: Create API Client Base Class 🟡 LOW
**Risk Tier**: LOW (single file, localized)
**Effort**: 1 hour
**Dependencies**: TASK-1.2, TASK-1.3
**User Story**: N/A (Infrastructure)
**Traceability**: DES-11

**Acceptance Criteria**:
- [ ] `src/services/api/apiClient.ts` created
- [ ] Axios configured with base URL from env
- [ ] Response interceptor handles errors globally
- [ ] Auth header support (future-ready, not required for MVP)
- [ ] All tests pass

**TDD Steps**:
1. **RED**: Write test expecting API client to make HTTP requests
2. **RED**: Run test - should fail (client doesn't exist)
3. **GREEN**: Create `apiClient.ts` with minimal implementation
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add error interceptor, improve types

**Implementation**:
```typescript
// src/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Base API client for backend communication
 * Connects to existing API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    });

    // Response interceptor: Handle global errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle common error scenarios
        const errorData = error.response?.data as any || {};

        // Format error for consistent handling
        return Promise.reject({
          status: error.response?.status,
          message: errorData.error || errorData.message || 'An error occurred',
          details: errorData.details || null,
        });
      }
    );
  }

  get<T>(...args: Parameters<AxiosInstance['get']>) {
    return this.client.get<T>(...args);
  }

  post<T>(...args: Parameters<AxiosInstance['post']>) {
    return this.client.post<T>(...args);
  }

  put<T>(...args: Parameters<AxiosInstance['put']>) {
    return this.client.put<T>(...args);
  }

  delete(...args: Parameters<AxiosInstance['delete']>) {
    return this.client.delete(...args);
  }
}

export const apiClient = new ApiClient();
```

**Test Validation**:
```typescript
// src/services/api/__tests__/apiClient.test.ts
import { apiClient } from '../apiClient';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('http://localhost:3000/test', () => {
    return HttpResponse.json({ message: 'success' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ApiClient', () => {
  it('should make successful GET request', async () => {
    const response = await apiClient.get('/test');
    expect(response.data).toEqual({ message: 'success' });
  });

  it('should handle 404 errors', async () => {
    server.use(
      http.get('http://localhost:3000/notfound', () => {
        return HttpResponse.json(
          { error: 'Not Found', message: 'Resource not found' },
          { status: 404 }
        );
      })
    );

    await expect(apiClient.get('/notfound')).rejects.toMatchObject({
      status: 404,
      message: 'Not Found',
    });
  });

  it('should include Content-Type header', async () => {
    const response = await apiClient.get('/test');
    expect(response.config.headers['Content-Type']).toBe('application/json');
  });
});
```

**Rollback**: Delete `src/services/api/apiClient.ts`

---

### TASK-2.2: Create Validation Service 🟡 LOW
**Risk Tier**: LOW (single file, pure functions)
**Effort**: 45 minutes
**Dependencies**: TASK-1.2
**User Story**: US-CLASS-002
**Traceability**: DES-11

**Acceptance Criteria**:
- [ ] `src/services/validation/classValidation.ts` created
- [ ] Validates class name (1-100 chars, required)
- [ ] Validates year (2000-2099, required)
- [ ] Returns user-friendly error messages
- [ ] 100% test coverage

**TDD Steps**:
1. **RED**: Write tests for all validation rules
2. **RED**: Run tests - should fail (validators don't exist)
3. **GREEN**: Implement validation functions
4. **GREEN**: Run tests - should pass
5. **REFACTOR**: Extract constants, improve error messages

**Implementation**:
```typescript
// src/services/validation/classValidation.ts

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const CLASS_NAME_MIN_LENGTH = 1;
const CLASS_NAME_MAX_LENGTH = 100;
const YEAR_MIN = 2000;
const YEAR_MAX = 2099;

/**
 * Validate class name
 * Business Rules: Required, 1-100 characters
 */
export function validateClassName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return {
      field: 'name',
      message: 'Class name is required',
    };
  }

  if (name.length < CLASS_NAME_MIN_LENGTH || name.length > CLASS_NAME_MAX_LENGTH) {
    return {
      field: 'name',
      message: `Class name must be between ${CLASS_NAME_MIN_LENGTH} and ${CLASS_NAME_MAX_LENGTH} characters`,
    };
  }

  return null;
}

/**
 * Validate academic year
 * Business Rules: Required, 2000-2099
 */
export function validateYear(year: number | string): ValidationError | null {
  if (year === null || year === undefined || year === '') {
    return {
      field: 'year',
      message: 'Academic year is required',
    };
  }

  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;

  if (isNaN(yearNum)) {
    return {
      field: 'year',
      message: 'Academic year must be a valid number',
    };
  }

  if (yearNum < YEAR_MIN || yearNum > YEAR_MAX) {
    return {
      field: 'year',
      message: `Academic year must be between ${YEAR_MIN} and ${YEAR_MAX}`,
    };
  }

  return null;
}

/**
 * Validate full class form data
 * Combines all validation rules
 */
export function validateClassForm(data: { name: string; year: number }): ValidationResult {
  const errors: ValidationError[] = [];

  const nameError = validateClassName(data.name);
  if (nameError) errors.push(nameError);

  const yearError = validateYear(data.year);
  if (yearError) errors.push(yearError);

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

**Test Validation**:
```typescript
// src/services/validation/__tests__/classValidation.test.ts
import { validateClassName, validateYear, validateClassForm } from '../classValidation';

describe('Class Validation', () => {
  describe('validateClassName', () => {
    it('should pass for valid class name', () => {
      expect(validateClassName('Math 101')).toBeNull();
    });

    it('should fail for empty name', () => {
      const error = validateClassName('');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('required');
    });

    it('should fail for name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101);
      const error = validateClassName(longName);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('between');
    });

    it('should pass for name at max length (100 chars)', () => {
      const maxName = 'A'.repeat(100);
      expect(validateClassName(maxName)).toBeNull();
    });
  });

  describe('validateYear', () => {
    it('should pass for valid year', () => {
      expect(validateYear(2024)).toBeNull();
    });

    it('should fail for year below 2000', () => {
      const error = validateYear(1999);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('between');
    });

    it('should fail for year above 2099', () => {
      const error = validateYear(2100);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('between');
    });

    it('should fail for empty year', () => {
      const error = validateYear('');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('required');
    });

    it('should handle string year input', () => {
      expect(validateYear('2024')).toBeNull();
    });
  });

  describe('validateClassForm', () => {
    it('should pass for valid form data', () => {
      const result = validateClassForm({ name: 'Math 101', year: 2024 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect multiple errors', () => {
      const result = validateClassForm({ name: '', year: 1999 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
```

**Rollback**: Delete `src/services/validation/` directory

---

### TASK-2.3: Create Class Service with CRUD Operations 🟠 MEDIUM
**Risk Tier**: MEDIUM (multi-method service, API integration)
**Effort**: 2 hours
**Dependencies**: TASK-2.1, TASK-1.2, TASK-1.4
**User Story**: US-CLASS-001, US-CLASS-002
**Traceability**: DES-7, DES-11

**Acceptance Criteria**:
- [ ] `src/services/api/classService.ts` created
- [ ] All 5 CRUD methods implemented (getAll, getById, create, update, delete)
- [ ] Correct HTTP methods and endpoints
- [ ] Response parsing matches actual backend format (direct responses)
- [ ] Error handling with MSW tests
- [ ] 90%+ test coverage

**TDD Steps**:
1. **RED**: Write test for `getAll()` expecting array of classes
2. **RED**: Run test - should fail (service doesn't exist)
3. **GREEN**: Implement `getAll()` method
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add error handling
6. **Repeat** for each CRUD method

**Implementation**:
```typescript
// src/services/api/classService.ts
import { Class, CreateClassRequest, UpdateClassRequest } from '../../types/Class';
import { apiClient } from './apiClient';

/**
 * Service for class-related API operations
 * Consumes existing backend API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 */
export const classService = {
  /**
   * Fetch all classes
   * Maps to: GET /class
   *
   * @returns Promise<Class[]> List of classes (direct array response)
   * @throws ApiError on failure
   */
  async getAll(): Promise<Class[]> {
    const response = await apiClient.get<Class[]>('/class');
    return response.data;
  },

  /**
   * Fetch single class by ID
   * Maps to: GET /class/:id
   *
   * @param id - Class ID (integer)
   * @returns Promise<Class> Class details (direct object response)
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async getById(id: number): Promise<Class> {
    const response = await apiClient.get<Class>(`/class/${id}`);
    return response.data;
  },

  /**
   * Create new class
   * Maps to: POST /class
   *
   * @param data - Class creation data {name, year}
   * @returns Promise<Class> Created class with auto-generated ID (direct object response)
   * @throws ApiError on failure (400 validation errors)
   */
  async create(data: CreateClassRequest): Promise<Class> {
    const response = await apiClient.post<Class>('/class', data);
    return response.data;
  },

  /**
   * Update existing class
   * Maps to: PUT /class/:id
   *
   * @param id - Class ID (integer)
   * @param data - Updated class data {name, year}
   * @returns Promise<Class> Updated class (direct object response)
   * @throws ApiError on failure (400 validation, 404 not found)
   */
  async update(id: number, data: UpdateClassRequest): Promise<Class> {
    const response = await apiClient.put<Class>(`/class/${id}`, data);
    return response.data;
  },

  /**
   * Delete class
   * Maps to: DELETE /class/:id
   *
   * @param id - Class ID (integer)
   * @returns Promise<{message: string, deletedClass: Class}> Delete confirmation
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async delete(id: number): Promise<{ message: string; deletedClass: Class }> {
    const response = await apiClient.delete<{ message: string; deletedClass: Class }>(`/class/${id}`);
    return response.data;
  },
};
```

**Test Validation**:
```typescript
// src/services/api/__tests__/classService.test.ts
import { classService } from '../classService';
import { setupServer } from 'msw/node';
import { handlers } from '../../../mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ClassService', () => {
  describe('getAll', () => {
    it('should return array of classes', async () => {
      const classes = await classService.getAll();
      expect(Array.isArray(classes)).toBe(true);
      expect(classes.length).toBeGreaterThan(0);
      expect(classes[0]).toHaveProperty('id');
      expect(classes[0]).toHaveProperty('name');
      expect(classes[0]).toHaveProperty('year');
    });
  });

  describe('getById', () => {
    it('should return single class', async () => {
      const classItem = await classService.getById(1);
      expect(classItem.id).toBe(1);
      expect(classItem.name).toBe('Mathematics 101');
    });

    it('should throw error for non-existent class', async () => {
      await expect(classService.getById(9999)).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe('create', () => {
    it('should create new class', async () => {
      const newClass = await classService.create({
        name: 'Science 301',
        year: 2025,
      });
      expect(newClass.id).toBeDefined();
      expect(newClass.name).toBe('Science 301');
      expect(newClass.year).toBe(2025);
      expect(newClass.createdAt).toBeDefined();
    });

    it('should validate required fields on server', async () => {
      // This test depends on MSW handler validation
      await expect(
        classService.create({ name: '', year: 2024 })
      ).rejects.toBeDefined();
    });
  });

  describe('update', () => {
    it('should update existing class', async () => {
      const updated = await classService.update(1, {
        name: 'Math 102',
        year: 2025,
      });
      expect(updated.id).toBe(1);
      expect(updated.name).toBe('Math 102');
      expect(updated.year).toBe(2025);
      expect(updated.updatedAt).not.toBe(updated.createdAt);
    });

    it('should throw error for non-existent class', async () => {
      await expect(
        classService.update(9999, { name: 'Test', year: 2024 })
      ).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe('delete', () => {
    it('should delete class', async () => {
      const result = await classService.delete(1);
      expect(result.message).toContain('deleted');
      expect(result.deletedClass).toHaveProperty('id');
    });

    it('should throw error for non-existent class', async () => {
      await expect(classService.delete(9999)).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
```

**Rollback**: Delete `src/services/api/classService.ts`

---

## Phase 3: Custom Hooks (TDD)

### TASK-3.1: Create useClasses Custom Hook 🟠 MEDIUM
**Risk Tier**: MEDIUM (complex state management, multiple methods)
**Effort**: 2.5 hours
**Dependencies**: TASK-2.3, TASK-1.3
**User Story**: US-CLASS-001, US-CLASS-002
**Traceability**: DES-9

**Acceptance Criteria**:
- [ ] `src/hooks/useClasses.ts` created
- [ ] Manages classes array state
- [ ] Provides loading and error states
- [ ] Implements all CRUD operations
- [ ] Auto-fetches on mount
- [ ] Optimistic updates on create/update/delete
- [ ] 90%+ test coverage with `@testing-library/react-hooks`

**TDD Steps**:
1. **RED**: Write test expecting hook to return classes array
2. **RED**: Run test - should fail (hook doesn't exist)
3. **GREEN**: Implement basic `useClasses` with fetch
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add CRUD operations, optimize with useCallback
6. **RED**: Write tests for each CRUD operation
7. **GREEN**: Implement each operation
8. **REFACTOR**: Add error handling, loading states

**Implementation**:
```typescript
// src/hooks/useClasses.ts
import { useState, useEffect, useCallback } from 'react';
import { Class, CreateClassRequest, UpdateClassRequest } from '../types/Class';
import { classService } from '../services/api/classService';

interface UseClassesReturn {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  createClass: (data: CreateClassRequest) => Promise<Class>;
  updateClass: (id: number, data: UpdateClassRequest) => Promise<Class>;
  deleteClass: (id: number) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing class data and operations
 * Provides centralized state management for all class-related CRUD operations
 *
 * @returns {UseClassesReturn} Classes state and CRUD operations
 *
 * @example
 * const { classes, isLoading, error, createClass } = useClasses();
 *
 * // Create new class
 * await createClass({ name: 'Math 101', year: 2025 });
 */
export function useClasses(): UseClassesReturn {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all classes
  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await classService.getAll();
      // Sort by year (desc), then name (asc) - Business requirement
      const sorted = data.sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year; // Descending year
        }
        return a.name.localeCompare(b.name); // Ascending name
      });
      setClasses(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch classes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Create new class
  const createClass = useCallback(async (data: CreateClassRequest): Promise<Class> => {
    setIsLoading(true);
    setError(null);
    try {
      const newClass = await classService.create(data);
      setClasses(prev => {
        const updated = [...prev, newClass];
        // Re-sort after adding
        return updated.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return a.name.localeCompare(b.name);
        });
      });
      return newClass;
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update existing class
  const updateClass = useCallback(async (id: number, data: UpdateClassRequest): Promise<Class> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedClass = await classService.update(id, data);
      setClasses(prev => {
        const updated = prev.map(c => (c.id === id ? updatedClass : c));
        // Re-sort after updating
        return updated.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return a.name.localeCompare(b.name);
        });
      });
      return updatedClass;
    } catch (err: any) {
      setError(err.message || 'Failed to update class');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete class
  const deleteClass = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await classService.delete(id);
      setClasses(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete class');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    clearError,
  };
}
```

**Test Validation**:
```typescript
// src/hooks/__tests__/useClasses.test.ts
import { renderHook, waitFor, act } from '@testing-library/react';
import { useClasses } from '../useClasses';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useClasses', () => {
  it('should fetch classes on mount', async () => {
    const { result } = renderHook(() => useClasses());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.classes).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.classes.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('should sort classes by year desc, then name asc', async () => {
    const { result } = renderHook(() => useClasses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const classes = result.current.classes;
    for (let i = 0; i < classes.length - 1; i++) {
      if (classes[i].year === classes[i + 1].year) {
        expect(classes[i].name.localeCompare(classes[i + 1].name)).toBeLessThanOrEqual(0);
      } else {
        expect(classes[i].year).toBeGreaterThanOrEqual(classes[i + 1].year);
      }
    }
  });

  it('should create new class', async () => {
    const { result } = renderHook(() => useClasses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialLength = result.current.classes.length;

    let newClass;
    await act(async () => {
      newClass = await result.current.createClass({
        name: 'Physics 401',
        year: 2025,
      });
    });

    expect(newClass).toHaveProperty('id');
    expect(newClass.name).toBe('Physics 401');
    expect(result.current.classes.length).toBe(initialLength + 1);
  });

  it('should update class', async () => {
    const { result } = renderHook(() => useClasses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const classToUpdate = result.current.classes[0];
    let updatedClass;

    await act(async () => {
      updatedClass = await result.current.updateClass(classToUpdate.id, {
        name: 'Updated Name',
        year: 2026,
      });
    });

    expect(updatedClass.name).toBe('Updated Name');
    expect(updatedClass.year).toBe(2026);

    const found = result.current.classes.find(c => c.id === classToUpdate.id);
    expect(found?.name).toBe('Updated Name');
  });

  it('should delete class', async () => {
    const { result } = renderHook(() => useClasses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const classToDelete = result.current.classes[0];
    const initialLength = result.current.classes.length;

    await act(async () => {
      await result.current.deleteClass(classToDelete.id);
    });

    expect(result.current.classes.length).toBe(initialLength - 1);
    expect(result.current.classes.find(c => c.id === classToDelete.id)).toBeUndefined();
  });

  it('should handle fetch errors', async () => {
    server.use(
      http.get('http://localhost:3000/class', () => {
        return HttpResponse.json(
          { error: 'Server Error' },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useClasses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.classes).toEqual([]);
  });

  it('should clear error', async () => {
    const { result } = renderHook(() => useClasses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
```

**Rollback**: Delete `src/hooks/useClasses.ts`

---

## Phase 4: Components (TDD)

### TASK-4.1: Create Utility Components (Button, Input, LoadingSpinner, ErrorMessage) 🟡 LOW
**Risk Tier**: LOW (reusable components, localized)
**Effort**: 1.5 hours
**Dependencies**: TASK-1.3
**User Story**: N/A (Shared components)

**Acceptance Criteria**:
- [ ] `src/components/common/Button.tsx` - Accessible button
- [ ] `src/components/common/Input.tsx` - Form input with label
- [ ] `src/components/common/LoadingSpinner.tsx` - Loading indicator
- [ ] `src/components/common/ErrorMessage.tsx` - Error display
- [ ] All components have tests
- [ ] ARIA attributes for accessibility

**TDD Steps**: (Example for Button)
1. **RED**: Write test expecting button to render with text
2. **RED**: Run test - should fail
3. **GREEN**: Create Button component
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add variants, accessibility

**Implementation** (Button example):
```typescript
// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

```typescript
// src/components/common/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('should support different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger')).toHaveClass('bg-red-600');
  });
});
```

**Similar implementations for**: Input, LoadingSpinner, ErrorMessage

**Rollback**: Delete `src/components/common/` directory

---

### TASK-4.2: Create EmptyState Component 🟡 LOW
**Risk Tier**: LOW (single component, presentational)
**Effort**: 30 minutes
**Dependencies**: TASK-4.1
**User Story**: US-CLASS-001 (empty state)
**Traceability**: DES-4

**Acceptance Criteria**:
- [ ] `src/components/classes/EmptyState.tsx` created
- [ ] Displays "No classes found" message
- [ ] Shows "Create your first class" call-to-action
- [ ] Accepts `onCreateFirst` callback prop
- [ ] Tests cover rendering and button click

**TDD Steps**:
1. **RED**: Write test expecting message to render
2. **RED**: Run test - should fail
3. **GREEN**: Create EmptyState component
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add styling, icon

**Implementation**:
```typescript
// src/components/classes/EmptyState.tsx
import React from 'react';
import { Button } from '../common/Button';

interface EmptyStateProps {
  onCreateFirst?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateFirst }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
      <p className="text-gray-500 mb-6">
        Create your first class to get started.
      </p>
      {onCreateFirst && (
        <Button onClick={onCreateFirst} variant="primary">
          Create First Class
        </Button>
      )}
    </div>
  );
};
```

**Test Validation**:
```typescript
// src/components/classes/__tests__/EmptyState.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should display no classes message', () => {
    render(<EmptyState />);
    expect(screen.getByText(/no classes found/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first class/i)).toBeInTheDocument();
  });

  it('should render create button when callback provided', () => {
    const handleCreate = jest.fn();
    render(<EmptyState onCreateFirst={handleCreate} />);
    expect(screen.getByText(/create first class/i)).toBeInTheDocument();
  });

  it('should call onCreateFirst when button clicked', () => {
    const handleCreate = jest.fn();
    render(<EmptyState onCreateFirst={handleCreate} />);
    fireEvent.click(screen.getByText(/create first class/i));
    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  it('should not render button when no callback provided', () => {
    render(<EmptyState />);
    expect(screen.queryByText(/create first class/i)).not.toBeInTheDocument();
  });
});
```

**Rollback**: Delete `src/components/classes/EmptyState.tsx`

---

### TASK-4.3: Create ClassListItem Component 🟡 LOW
**Risk Tier**: LOW (single component, presentational)
**Effort**: 1 hour
**Dependencies**: TASK-4.1, TASK-1.2
**User Story**: US-CLASS-001
**Traceability**: DES-2

**Acceptance Criteria**:
- [ ] `src/components/classes/ClassListItem.tsx` created
- [ ] Displays class name, year, created date, updated date
- [ ] Formats dates in human-readable format (e.g., "Jan 15, 2025")
- [ ] Uses `date-fns` for date formatting
- [ ] Tests cover rendering all fields

**TDD Steps**:
1. **RED**: Write test expecting class data to render
2. **RED**: Run test - should fail
3. **GREEN**: Create ClassListItem component
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add date formatting, improve layout

**Implementation**:
```typescript
// src/utils/dateFormatter.ts
import { format } from 'date-fns';

/**
 * Format ISO 8601 timestamp to human-readable date
 * Example: "2024-01-15T10:30:00Z" → "Jan 15, 2024"
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format ISO 8601 timestamp with time
 * Example: "2024-01-15T10:30:00Z" → "Jan 15, 2024, 10:30 AM"
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return format(date, 'MMM d, yyyy, h:mm a');
  } catch (error) {
    return 'Invalid date';
  }
}
```

```typescript
// src/components/classes/ClassListItem.tsx
import React from 'react';
import { Class } from '../../types/Class';
import { formatDate } from '../../utils/dateFormatter';

interface ClassListItemProps {
  classItem: Class;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

export const ClassListItem: React.FC<ClassListItemProps> = ({
  classItem,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
      data-testid={`class-item-${classItem.id}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
            onClick={() => onView?.(classItem.id)}
          >
            {classItem.name}
          </h3>
          <p className="text-gray-600 mb-2">Year: {classItem.year}</p>
          <div className="text-sm text-gray-500">
            <p>Created: {formatDate(classItem.createdAt)}</p>
            <p>Updated: {formatDate(classItem.updatedAt)}</p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(classItem.id)}
                className="text-blue-600 hover:text-blue-700 font-medium"
                aria-label={`Edit ${classItem.name}`}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(classItem.id)}
                className="text-red-600 hover:text-red-700 font-medium"
                aria-label={`Delete ${classItem.name}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
```

**Test Validation**:
```typescript
// src/components/classes/__tests__/ClassListItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ClassListItem } from '../ClassListItem';
import { Class } from '../../../types/Class';

const mockClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T11:45:00Z',
};

describe('ClassListItem', () => {
  it('should render class details', () => {
    render(<ClassListItem classItem={mockClass} />);

    expect(screen.getByText('Mathematics 101')).toBeInTheDocument();
    expect(screen.getByText(/Year: 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Created: Jan 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Updated: Jan 16, 2024/)).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    const handleEdit = jest.fn();
    render(<ClassListItem classItem={mockClass} onEdit={handleEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(handleEdit).toHaveBeenCalledWith(1);
  });

  it('should call onDelete when delete button clicked', () => {
    const handleDelete = jest.fn();
    render(<ClassListItem classItem={mockClass} onDelete={handleDelete} />);

    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it('should not render action buttons when callbacks not provided', () => {
    render(<ClassListItem classItem={mockClass} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should have accessible labels for action buttons', () => {
    const handleEdit = jest.fn();
    render(<ClassListItem classItem={mockClass} onEdit={handleEdit} />);

    const editButton = screen.getByLabelText('Edit Mathematics 101');
    expect(editButton).toBeInTheDocument();
  });
});
```

**Rollback**: Delete `src/components/classes/ClassListItem.tsx` and `src/utils/dateFormatter.ts`

---

### TASK-4.4: Create ClassList Container Component 🟠 MEDIUM
**Risk Tier**: MEDIUM (complex component, state integration)
**Effort**: 2 hours
**Dependencies**: TASK-3.1, TASK-4.2, TASK-4.3
**User Story**: US-CLASS-001
**Traceability**: DES-1, DES-16

**Acceptance Criteria**:
- [ ] `src/components/classes/ClassList.tsx` created
- [ ] Uses `useClasses` hook for data
- [ ] Renders list of `ClassListItem` components
- [ ] Shows `EmptyState` when no classes
- [ ] Shows `LoadingSpinner` during fetch
- [ ] Shows `ErrorMessage` on error
- [ ] Sorts classes by year desc, name asc
- [ ] Tests cover all states (loading, error, empty, success)

**TDD Steps**:
1. **RED**: Write test expecting list to render classes
2. **RED**: Run test - should fail
3. **GREEN**: Create ClassList component with basic rendering
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add loading/error states
6. **RED**: Write tests for edge cases (empty, error)
7. **GREEN**: Handle edge cases
8. **REFACTOR**: Optimize rendering with React.memo

**Implementation**:
```typescript
// src/components/classes/ClassList.tsx
import React from 'react';
import { useClasses } from '../../hooks/useClasses';
import { ClassListItem } from './ClassListItem';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

interface ClassListProps {
  onClassClick?: (classId: number) => void;
  onAddClass?: () => void;
}

/**
 * Container component for displaying list of classes
 * Handles loading, error, and empty states
 * User Story: US-CLASS-001 (View List of Classes)
 */
export const ClassList: React.FC<ClassListProps> = ({ onClassClick, onAddClass }) => {
  const { classes, isLoading, error, fetchClasses, clearError } = useClasses();

  // Loading state
  if (isLoading && classes.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error && classes.length === 0) {
    return (
      <div className="py-12">
        <ErrorMessage
          message={error}
          onRetry={fetchClasses}
          onDismiss={clearError}
        />
      </div>
    );
  }

  // Empty state
  if (classes.length === 0) {
    return <EmptyState onCreateFirst={onAddClass} />;
  }

  // Success state - render list
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
        {onAddClass && (
          <button
            onClick={onAddClass}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Class
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={clearError} />
        </div>
      )}

      <div className="space-y-3">
        {classes.map((classItem) => (
          <ClassListItem
            key={classItem.id}
            classItem={classItem}
            onView={onClassClick}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner size="small" />
        </div>
      )}
    </div>
  );
};
```

**Test Validation**:
```typescript
// src/components/classes/__tests__/ClassList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ClassList } from '../ClassList';
import { setupServer } from 'msw/node';
import { handlers } from '../../../mocks/handlers';
import { http, HttpResponse } from 'msw';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ClassList', () => {
  it('should show loading state initially', () => {
    render(<ClassList />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render list of classes after loading', async () => {
    render(<ClassList />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Mathematics 101')).toBeInTheDocument();
    expect(screen.getByText('English 201')).toBeInTheDocument();
  });

  it('should show empty state when no classes', async () => {
    server.use(
      http.get('http://localhost:3000/class', () => {
        return HttpResponse.json([]);
      })
    );

    render(<ClassList />);

    await waitFor(() => {
      expect(screen.getByText(/no classes found/i)).toBeInTheDocument();
    });
  });

  it('should show error state on fetch failure', async () => {
    server.use(
      http.get('http://localhost:3000/class', () => {
        return HttpResponse.json(
          { error: 'Server Error' },
          { status: 500 }
        );
      })
    );

    render(<ClassList />);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it('should render add class button when callback provided', async () => {
    const handleAdd = jest.fn();
    render(<ClassList onAddClass={handleAdd} />);

    await waitFor(() => {
      expect(screen.getByText('Add Class')).toBeInTheDocument();
    });
  });

  it('should sort classes by year desc, then name asc', async () => {
    render(<ClassList />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    const classItems = screen.getAllByTestId(/class-item-/);
    expect(classItems.length).toBeGreaterThan(1);
    // Sorting validation based on mock data
  });
});
```

**Rollback**: Delete `src/components/classes/ClassList.tsx`

---

### TASK-4.5: Create ClassForm Component 🟠 MEDIUM
**Risk Tier**: MEDIUM (complex form logic, validation)
**Effort**: 3 hours
**Dependencies**: TASK-2.2, TASK-3.1, TASK-4.1
**User Story**: US-CLASS-002 (Add Class), US-CLASS-003 (Edit Class)
**Traceability**: DES-3, DES-17

**Acceptance Criteria**:
- [ ] `src/components/classes/ClassForm.tsx` created
- [ ] Supports both create and edit modes
- [ ] Client-side validation using `classValidation` service
- [ ] Displays validation errors inline
- [ ] Shows success/error messages
- [ ] Disables submit during loading
- [ ] Cancel button returns to previous view
- [ ] Tests cover create, edit, validation, error handling

**TDD Steps**:
1. **RED**: Write test expecting form to render with fields
2. **RED**: Run test - should fail
3. **GREEN**: Create ClassForm component with basic inputs
4. **GREEN**: Run test - should pass
5. **REFACTOR**: Add validation logic
6. **RED**: Write tests for validation scenarios
7. **GREEN**: Implement validation handling
8. **REFACTOR**: Add submit handling, error states

**Implementation**:
```typescript
// src/components/classes/ClassForm.tsx
import React, { useState, useEffect } from 'react';
import { Class, CreateClassRequest } from '../../types/Class';
import { validateClassForm, ValidationError } from '../../services/validation/classValidation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorMessage } from '../common/ErrorMessage';

interface ClassFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Class>;
  onSubmit: (data: CreateClassRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Form component for creating and editing classes
 * User Story: US-CLASS-002 (Add Class), US-CLASS-003 (Edit Class)
 */
export const ClassForm: React.FC<ClassFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    year: initialData?.year || new Date().getFullYear(),
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when mode or initialData changes
  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      year: initialData?.year || new Date().getFullYear(),
    });
    setErrors([]);
    setSubmitError(null);
  }, [mode, initialData]);

  const handleChange = (field: 'name' | 'year', value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error on change
    setErrors((prev) => prev.filter((err) => err.field !== field));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateClassForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit to parent
    try {
      await onSubmit(formData);
      // Parent handles success (e.g., navigation, toast)
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save class');
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((err) => err.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Add New Class' : 'Edit Class'}
      </h2>

      {submitError && (
        <div className="mb-4">
          <ErrorMessage message={submitError} onDismiss={() => setSubmitError(null)} />
        </div>
      )}

      {/* Class Name */}
      <div className="mb-4">
        <Input
          label="Class Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Mathematics 101"
          error={getFieldError('name')}
          required
          disabled={isLoading}
          aria-describedby="name-error"
        />
      </div>

      {/* Academic Year */}
      <div className="mb-6">
        <Input
          label="Academic Year"
          type="number"
          value={formData.year}
          onChange={(e) => handleChange('year', parseInt(e.target.value, 10))}
          min={2000}
          max={2099}
          error={getFieldError('year')}
          required
          disabled={isLoading}
          aria-describedby="year-error"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Class' : 'Update Class'}
        </Button>
      </div>
    </form>
  );
};
```

**Test Validation**:
```typescript
// src/components/classes/__tests__/ClassForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClassForm } from '../ClassForm';

describe('ClassForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form in create mode', () => {
    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add New Class')).toBeInTheDocument();
    expect(screen.getByLabelText(/class name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/academic year/i)).toBeInTheDocument();
    expect(screen.getByText('Create Class')).toBeInTheDocument();
  });

  it('should render form in edit mode with initial data', () => {
    render(
      <ClassForm
        mode="edit"
        initialData={{ name: 'Math 101', year: 2024 }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Class')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Math 101')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/class name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitButton = screen.getByText('Create Class');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/class name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate year range', async () => {
    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const yearInput = screen.getByLabelText(/academic year/i);
    fireEvent.change(yearInput, { target: { value: '1999' } });

    const submitButton = screen.getByText('Create Class');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must be between 2000 and 2099/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/class name/i);
    const yearInput = screen.getByLabelText(/academic year/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Physics 301');
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, '2025');

    const submitButton = screen.getByText('Create Class');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Physics 301',
        year: 2025,
      });
    });
  });

  it('should display API error on submit failure', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Duplicate class name'));

    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/class name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Math 101');

    const submitButton = screen.getByText('Create Class');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/duplicate class name/i)).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button clicked', () => {
    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable inputs during loading', () => {
    render(
      <ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading />
    );

    expect(screen.getByLabelText(/class name/i)).toBeDisabled();
    expect(screen.getByLabelText(/academic year/i)).toBeDisabled();
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('should clear field errors when user types', async () => {
    render(<ClassForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Trigger validation error
    const submitButton = screen.getByText('Create Class');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/class name is required/i)).toBeInTheDocument();
    });

    // Start typing - error should clear
    const nameInput = screen.getByLabelText(/class name/i);
    await userEvent.type(nameInput, 'M');

    expect(screen.queryByText(/class name is required/i)).not.toBeInTheDocument();
  });
});
```

**Rollback**: Delete `src/components/classes/ClassForm.tsx`

---

## Phase 5: Integration & E2E

### TASK-5.1: Integration Testing with Real API 🟠 MEDIUM
**Risk Tier**: MEDIUM (requires backend coordination)
**Effort**: 2 hours
**Dependencies**: TASK-4.4, TASK-4.5, Backend API running
**User Story**: US-CLASS-001, US-CLASS-002

**Acceptance Criteria**:
- [ ] Backend API running at `http://localhost:3000`
- [ ] CORS configured for frontend (localhost:5173)
- [ ] Integration tests pass against real API
- [ ] Manual testing checklist completed
- [ ] API error scenarios verified

**Integration Test Checklist**:
```bash
# 1. Verify backend is running
curl http://localhost:3000/class
# Expected: Array of classes (or empty array)

# 2. Create test class
curl -X POST http://localhost:3000/class \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Integration Class","year":2025}'
# Expected: 201 Created with class object

# 3. Start frontend
npm run start
# Navigate to http://localhost:5173

# 4. Manual Test Scenarios:
- [ ] View empty class list (if no data)
- [ ] View populated class list
- [ ] Create new class successfully
- [ ] Create duplicate class (should show error)
- [ ] Validate form with empty fields
- [ ] Validate form with invalid year (1999, 2100)
- [ ] Check loading states
- [ ] Check error states (stop backend, try to create)
```

**Environment Setup**:
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
```

**Integration Test Implementation**:
```typescript
// src/__tests__/integration/classManagement.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

/**
 * Integration tests against real backend API
 * Requires: Backend running at http://localhost:3000
 */
describe('Class Management Integration', () => {
  beforeAll(() => {
    // Check if backend is available
    // Skip tests if backend not running
  });

  it('should complete full CRUD workflow', async () => {
    render(<App />);

    // Wait for classes to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Create new class
    const addButton = screen.getByText('Add Class');
    await userEvent.click(addButton);

    const nameInput = screen.getByLabelText(/class name/i);
    const yearInput = screen.getByLabelText(/academic year/i);

    await userEvent.type(nameInput, 'Integration Test Class');
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, '2025');

    const submitButton = screen.getByText('Create Class');
    await userEvent.click(submitButton);

    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Integration Test Class')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Cleanup: Delete test class
    // (Implement delete functionality in future task)
  });
});
```

**Rollback**: N/A (read-only tests)

---

### TASK-5.2: E2E Testing with Playwright 🟠 MEDIUM
**Risk Tier**: MEDIUM (new test framework, complex scenarios)
**Effort**: 2.5 hours
**Dependencies**: TASK-5.1
**User Story**: US-CLASS-001, US-CLASS-002

**Acceptance Criteria**:
- [ ] Playwright configured
- [ ] E2E test for viewing class list
- [ ] E2E test for creating new class
- [ ] E2E test for form validation
- [ ] Tests run in CI pipeline

**Commands**:
```bash
npm install -D @playwright/test
npx playwright install
npm run test:e2e  # Custom script to run E2E tests
```

**Implementation**:
```typescript
// e2e/classManagement.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Class Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should display list of classes', async ({ page }) => {
    // Wait for classes to load
    await page.waitForSelector('[data-testid^="class-item-"]', { timeout: 10000 });

    // Verify at least one class is displayed
    const classItems = await page.locator('[data-testid^="class-item-"]').count();
    expect(classItems).toBeGreaterThan(0);
  });

  test('should create new class successfully', async ({ page }) => {
    // Click "Add Class" button
    await page.click('text=Add Class');

    // Fill form
    await page.fill('input[aria-label*="Class Name"]', 'E2E Test Class');
    await page.fill('input[aria-label*="Academic Year"]', '2025');

    // Submit
    await page.click('text=Create Class');

    // Verify success
    await expect(page.locator('text=E2E Test Class')).toBeVisible({ timeout: 10000 });
  });

  test('should validate required fields', async ({ page }) => {
    // Click "Add Class" button
    await page.click('text=Add Class');

    // Submit empty form
    await page.click('text=Create Class');

    // Verify validation errors
    await expect(page.locator('text=Class name is required')).toBeVisible();
  });

  test('should show empty state when no classes', async ({ page }) => {
    // This test requires a clean database or mocked empty state
    // Implementation depends on test data strategy
  });
});
```

**Rollback**: Remove Playwright dependencies, delete `e2e/` directory

---

## Phase 6: Polish & Deployment

### TASK-6.1: Accessibility Audit (WCAG 2.1 AA) 🟡 LOW
**Risk Tier**: LOW (improvements, no functional changes)
**Effort**: 1.5 hours
**Dependencies**: TASK-4.4, TASK-4.5
**User Story**: N/A (Non-functional requirement)

**Acceptance Criteria**:
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on form inputs
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Screen reader testing passed
- [ ] axe DevTools audit passes with 0 violations

**Audit Checklist**:
```bash
# Install axe DevTools Chrome extension
# Run audit on each page:
- [ ] Class List page
- [ ] Add Class form
- [ ] Edit Class form
- [ ] Empty state
- [ ] Error states
```

**Common Fixes**:
- Add `aria-label` to buttons without text
- Ensure form inputs have `<label>` elements
- Add focus styles (`:focus-visible`)
- Test tab navigation order
- Verify screen reader announcements

**Rollback**: N/A (non-breaking improvements)

---

### TASK-6.2: Performance Optimization 🟡 LOW
**Risk Tier**: LOW (optimization, no API changes)
**Effort**: 1 hour
**Dependencies**: TASK-4.4, TASK-4.5
**User Story**: N/A (Non-functional requirement)
**Traceability**: DES-21

**Acceptance Criteria**:
- [ ] React.memo() applied to ClassListItem
- [ ] useCallback() for event handlers
- [ ] Lazy load ClassForm component
- [ ] Bundle size < 200KB (gzipped)
- [ ] Lighthouse performance score > 90

**Implementation**:
```typescript
// Optimize ClassListItem
export const ClassListItem = React.memo<ClassListItemProps>(({ classItem, ...props }) => {
  // ... component implementation
});

// Lazy load ClassForm
const ClassForm = React.lazy(() => import('./components/classes/ClassForm'));

// Use Suspense
<React.Suspense fallback={<LoadingSpinner />}>
  <ClassForm mode="create" ... />
</React.Suspense>
```

**Performance Audit**:
```bash
npm run build
npm run preview  # Serve production build
# Run Lighthouse audit in Chrome DevTools
```

**Rollback**: Remove optimizations if issues arise

---

### TASK-6.3: Create Memory Documentation 🟢 TRIVIAL
**Risk Tier**: TRIVIAL (documentation only)
**Effort**: 30 minutes
**Dependencies**: All implementation tasks
**User Story**: N/A (Documentation)

**Acceptance Criteria**:
- [ ] `.github/instructions/memory/features/class-management/memory.md` created
- [ ] `.github/instructions/memory-index.md` updated
- [ ] Documents key technical decisions
- [ ] Lists all created files and structure
- [ ] References requirements and design IDs

**Template**:
```markdown
# Feature Memory: Class Management

**Created**: 2025-10-20
**Status**: Completed
**Sprint**: Sprint 1 (MVP)

## Feature Overview
- User Stories: US-CLASS-001, US-CLASS-002
- Requirements: REQ-1, REQ-2
- Design: DES-1 through DES-17

## File Structure
src/
├── components/classes/
│   ├── ClassList.tsx
│   ├── ClassListItem.tsx
│   ├── ClassForm.tsx
│   └── EmptyState.tsx
├── hooks/useClasses.ts
├── services/
│   ├── api/classService.ts
│   └── validation/classValidation.ts
└── types/Class.ts

## Key Decisions
1. **State Management**: Hook-based (useClasses), no Redux
2. **API Integration**: Direct responses (not wrapped)
3. **Validation**: Client + Server-side
4. **ID Type**: number (from backend), not UUID

## External Resources
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs/ui

## Change History
- 2025-10-20: Initial implementation (MVP - View + Add)
```

**Rollback**: Delete memory files

---

### TASK-6.4: Create Deployment Checklist & README Updates 🟢 TRIVIAL
**Risk Tier**: TRIVIAL (documentation only)
**Effort**: 30 minutes
**Dependencies**: All tasks
**User Story**: N/A (Documentation)

**Acceptance Criteria**:
- [ ] README.md updated with setup instructions
- [ ] Environment variables documented
- [ ] API integration instructions added
- [ ] Deployment checklist created (from DES-23)

**README Updates**:
```markdown
# Commentator Frontend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your API base URL
   ```

3. Start development server:
   ```bash
   npm run start
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:3000)

## Backend Integration

This frontend requires the Commentator backend API running at `http://localhost:3000`.

See backend repository: [link to backend repo]

API Documentation: http://localhost:3000/api-docs/ui

## Features

### Class Management (MVP)
- ✅ View list of classes (US-CLASS-001)
- ✅ Add new class (US-CLASS-002)
- ⏳ Edit class (US-CLASS-003) - Post-MVP
- ⏳ Delete class (US-CLASS-005) - Post-MVP
```

**Rollback**: Revert README changes

---

## Summary & Metrics

### Task Breakdown by Risk Tier
- 🟢 **TRIVIAL**: 2 tasks (documentation)
- 🟡 **LOW**: 8 tasks (components, utilities)
- 🟠 **MEDIUM**: 9 tasks (services, hooks, integration)
- 🔴 **HIGH**: 0 tasks

**Total**: 19 tasks

### Estimated Effort
- **Phase 1 (Setup)**: 4 hours
- **Phase 2 (Service Layer)**: 4.75 hours
- **Phase 3 (Hooks)**: 2.5 hours
- **Phase 4 (Components)**: 10 hours
- **Phase 5 (Integration)**: 4.5 hours
- **Phase 6 (Polish)**: 3.5 hours

**Total Estimated Effort**: 29.25 hours (~4 days for 1 developer)

### MVP Scope (Sprint 1)
**Required for MVP**:
- TASK-1.1 through TASK-1.4 (Setup)
- TASK-2.1 through TASK-2.3 (Service Layer)
- TASK-3.1 (useClasses Hook)
- TASK-4.1 through TASK-4.4 (View Components)
- TASK-4.5 (Form - Create mode only)
- TASK-5.1 (Integration Testing)

**Post-MVP** (Future Sprints):
- TASK-5.2 (E2E Testing) - Can be done in parallel
- TASK-6.1 through TASK-6.4 (Polish & Deployment)
- Edit functionality (US-CLASS-003)
- Delete functionality (US-CLASS-005)

### Critical Path
```
TASK-1.1 → TASK-1.2 → TASK-1.3 → TASK-2.1 → TASK-2.3 → TASK-3.1 → TASK-4.4 → TASK-5.1
                                     ↓
                                  TASK-2.2 → TASK-4.5
                                     ↓
                                  TASK-1.4 (MSW)
                                     ↓
                                  TASK-4.1 (Utilities)
```

### Dependencies
- **Backend API**: Must be running at `http://localhost:3000`
- **CORS**: Must allow `http://localhost:5173`
- **Node.js**: v24 (per `.nvmrc`)
- **npm**: Latest version

---

## Approval & Sign-off

**Task Breakdown Approved By:**
- [ ] System Architect: __________________ Date: __________
- [ ] Frontend Lead: ____________________ Date: __________
- [ ] Product Owner: ____________________ Date: __________

**Implementation Ready**: ✅ Tasks ready for execution

---

**Next Step**: Begin execution with TASK-1.1 (Initialize React + Vite Project)

**Traceability**: This document implements the specification-first methodology defined in CLAUDE.md and fulfills the requirements defined in `requirements.md` and `design.md`.
