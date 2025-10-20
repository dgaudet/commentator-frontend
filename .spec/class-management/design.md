# Technical Design: Class Management Feature

**Version:** 1.0.0
**Created:** 2025-10-17
**Author:** System Architect
**Status:** APPROVED FOR IMPLEMENTATION

---

## Table of Contents

1. [Component Architecture](#1-component-architecture)
2. [REST API Specification](#2-rest-api-specification)
3. [Data Flow & State Management](#3-data-flow--state-management)
4. [Technical Risks & Dependencies](#4-technical-risks--dependencies)
5. [Architecture Diagrams](#5-architecture-diagrams)
6. [Security Considerations](#6-security-considerations)
7. [Performance Considerations](#7-performance-considerations)
8. [Testing Strategy](#8-testing-strategy)
9. [Deployment Checklist](#9-deployment-checklist)

---

## 1. Component Architecture

### Component Hierarchy

```
src/
├── components/
│   ├── classes/
│   │   ├── ClassList/
│   │   │   ├── ClassList.tsx              # Container component
│   │   │   ├── ClassList.test.tsx
│   │   │   ├── ClassListItem.tsx          # Individual class row
│   │   │   ├── ClassListItem.test.tsx
│   │   │   ├── EmptyState.tsx             # No classes message
│   │   │   └── EmptyState.test.tsx
│   │   ├── ClassForm/
│   │   │   ├── ClassForm.tsx              # Add/Edit form
│   │   │   ├── ClassForm.test.tsx
│   │   │   ├── ClassFormFields.tsx        # Form inputs
│   │   │   └── ClassFormFields.test.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── ConfirmDialog.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── hooks/
│   ├── useClasses.ts                      # Custom hook for class operations
│   ├── useClasses.test.ts
│   ├── useClassForm.ts                    # Form state management
│   └── useClassForm.test.ts
├── services/
│   ├── api/
│   │   ├── classService.ts                # API client for classes
│   │   ├── classService.test.ts
│   │   └── apiClient.ts                   # Base HTTP client
│   └── validation/
│       ├── classValidation.ts             # Validation rules
│       └── classValidation.test.ts
├── types/
│   ├── Class.ts                           # TypeScript interfaces
│   └── ApiResponse.ts
└── utils/
    ├── dateFormatter.ts                   # Date formatting utilities
    ├── dateFormatter.test.ts
    └── errorHandler.ts
```

### DES-1: ClassList Component (Container)

**Responsibility**: Display list of all classes, handle loading/error states, coordinate child components

**Props**:
```typescript
interface ClassListProps {
  // No props - fetches data internally via useClasses hook
}
```

**State Management**:
- Uses `useClasses()` custom hook to fetch and manage class data
- Manages loading, error, and empty states
- Handles sort order (year desc, name asc)

**User Story Mapping**: US-CLASS-001 (View List)

---

### DES-2: ClassListItem Component

**Responsibility**: Render individual class row with formatted data

**Props**:
```typescript
interface ClassListItemProps {
  class: Class;
  onEdit?: (classId: string) => void;    // Future: US-CLASS-003
  onDelete?: (classId: string) => void;  // Future: US-CLASS-005
  onView?: (classId: string) => void;    // Future: US-CLASS-004
}
```

**Displays**:
- Class name
- Academic year
- Formatted created date
- Formatted updated date

**User Story Mapping**: US-CLASS-001 (View List)

---

### DES-3: ClassForm Component

**Responsibility**: Handle add/edit operations with validation

**Props**:
```typescript
interface ClassFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Class>;
  onSubmit: (data: ClassFormData) => Promise<void>;
  onCancel: () => void;
}
```

**Features**:
- Client-side validation (name length, year range)
- Duplicate detection
- Error display
- Loading state during submission

**User Story Mapping**: US-CLASS-002 (Add), US-CLASS-003 (Edit)

---

### DES-4: EmptyState Component

**Responsibility**: Display friendly message when no classes exist

**Props**:
```typescript
interface EmptyStateProps {
  onCreateFirst?: () => void;  // Navigate to create form
}
```

**User Story Mapping**: US-CLASS-001 (View List - empty state)

---

## 2. REST API Specification

### Base Configuration

- **Base URL**: `/api/v1` (configured via `VITE_API_BASE_URL` environment variable)
- **Authentication**: Bearer token (JWT) in `Authorization` header
- **Content-Type**: `application/json`

### DES-5: TypeScript Type Definitions

```typescript
// src/types/Class.ts

/**
 * Class entity representing an educational class
 * Maps to backend Class model
 */
export interface Class {
  id: string;                    // UUID format, system-generated
  name: string;                  // 1-100 characters
  year: number;                  // 2000-2099
  created_at: string;            // ISO 8601 timestamp (UTC)
  updated_at: string;            // ISO 8601 timestamp (UTC)
}

/**
 * Request payload for creating a new class
 */
export interface CreateClassRequest {
  name: string;
  year: number;
}

/**
 * Request payload for updating an existing class
 */
export interface UpdateClassRequest {
  name: string;
  year: number;
}
```

---

### DES-6: API Response Types

```typescript
// src/types/ApiResponse.ts

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  error: string;                           // Error type/code
  message: string;                         // Human-readable message
  statusCode: number;                      // HTTP status code
  details?: Record<string, string[]>;      // Field-level validation errors
}
```

---

### DES-7: REST API Endpoints

#### GET /api/v1/classes

**Purpose**: Fetch all classes for the authenticated teacher
**User Story**: US-CLASS-001 (View List)

**Request**:
```http
GET /api/v1/classes
Authorization: Bearer {token}
```

**Query Parameters** (optional):
- `sort`: `year_desc` (default), `name_asc`, `created_desc`
- `limit`: number (pagination - future enhancement)
- `offset`: number (pagination - future enhancement)

**Success Response** (200 OK):
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Math 101",
      "year": 2025,
      "created_at": "2025-01-15T14:30:00Z",
      "updated_at": "2025-01-15T14:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "English 201",
      "year": 2024,
      "created_at": "2024-09-01T08:00:00Z",
      "updated_at": "2024-09-01T08:00:00Z"
    }
  ],
  "message": "Classes retrieved successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication token
- `500 Internal Server Error`: Server-side error

---

#### POST /api/v1/classes

**Purpose**: Create a new class
**User Story**: US-CLASS-002 (Add Class)

**Request**:
```http
POST /api/v1/classes
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Math 101",
  "year": 2025
}
```

**Success Response** (201 Created):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Math 101",
    "year": 2025,
    "created_at": "2025-01-15T14:30:00Z",
    "updated_at": "2025-01-15T14:30:00Z"
  },
  "message": "Class created successfully"
}
```

**Error Responses**:

**400 Bad Request** - Validation errors:
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "statusCode": 400,
  "details": {
    "name": ["Class name is required", "Name must be 1-100 characters"],
    "year": ["Year must be between 2000 and 2099"]
  }
}
```

**409 Conflict** - Duplicate name + year combination:
```json
{
  "error": "DuplicateError",
  "message": "A class with this name already exists for this year",
  "statusCode": 409
}
```

Other errors:
- `401 Unauthorized`: Invalid authentication
- `500 Internal Server Error`: Server-side error

---

#### GET /api/v1/classes/:id

**Purpose**: Fetch single class details
**User Story**: US-CLASS-004 (View Details)

**Request**:
```http
GET /api/v1/classes/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Math 101",
    "year": 2025,
    "created_at": "2025-01-15T14:30:00Z",
    "updated_at": "2025-01-16T10:45:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Class doesn't exist or doesn't belong to teacher
- `401 Unauthorized`: Invalid authentication

---

#### PUT /api/v1/classes/:id

**Purpose**: Update existing class
**User Story**: US-CLASS-003 (Edit Class)

**Request**:
```http
PUT /api/v1/classes/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Math 102",
  "year": 2025
}
```

**Success Response** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Math 102",
    "year": 2025,
    "created_at": "2025-01-15T14:30:00Z",
    "updated_at": "2025-01-17T09:20:00Z"
  },
  "message": "Class updated successfully"
}
```

**Business Rules**:
- `id` cannot be changed (immutable)
- `created_at` must remain unchanged (immutable)
- `updated_at` automatically set to current timestamp by backend

**Error Responses**:
- `400 Bad Request`: Validation errors (same format as POST)
- `404 Not Found`: Class not found
- `409 Conflict`: Duplicate name + year combination
- `401 Unauthorized`: Invalid authentication

---

#### DELETE /api/v1/classes/:id

**Purpose**: Delete a class
**User Story**: US-CLASS-005 (Delete Class)

**Request**:
```http
DELETE /api/v1/classes/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "message": "Class deleted successfully"
}
```

**Error Responses**:

**409 Conflict** - Class has associated data:
```json
{
  "error": "ConstraintViolation",
  "message": "Cannot delete this class because it has associated data. Remove all students and comments first.",
  "statusCode": 409
}
```

Other errors:
- `404 Not Found`: Class not found
- `401 Unauthorized`: Invalid authentication

---

## 3. Data Flow & State Management

### DES-8: State Management Architecture

**Approach**: Lightweight, hook-based state management (no external state libraries for MVP)

#### Rationale:
- ✅ Simpler architecture for MVP
- ✅ Faster development velocity
- ✅ No additional dependencies
- ✅ Easier to refactor to centralized state later if needed
- ✅ Aligns with React best practices

#### State Layers:

```typescript
// DES-8.1: Component-Level State (Local UI State)
// - Form input values
// - Modal open/closed state
// - Dropdown expanded state

// DES-8.2: Feature-Level State (Custom Hooks)
// - Classes list data
// - Loading/error states
// - CRUD operation states

// DES-8.3: Application-Level State (React Context - Future)
// - Authentication token
// - User profile
// - Global notifications
```

---

### DES-9: Custom Hook - useClasses

Centralized hook for all class-related data operations:

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
  updateClass: (id: string, data: UpdateClassRequest) => Promise<Class>;
  deleteClass: (id: string) => Promise<void>;
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

  // Fetch all classes on mount
  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await classService.getAll();
      setClasses(data);
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
      setClasses(prev => [...prev, newClass]);
      return newClass;
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update existing class
  const updateClass = useCallback(async (id: string, data: UpdateClassRequest): Promise<Class> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedClass = await classService.update(id, data);
      setClasses(prev => prev.map(c => c.id === id ? updatedClass : c));
      return updatedClass;
    } catch (err: any) {
      setError(err.message || 'Failed to update class');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete class
  const deleteClass = useCallback(async (id: string): Promise<void> => {
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

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
  };
}
```

**User Story Mapping**: Supports US-CLASS-001 through US-CLASS-005

---

### DES-10: Data Flow Diagram

```mermaid
graph TD
    A[ClassList Component] -->|useClasses hook| B[Custom Hook State]
    B -->|fetchClasses| C[classService API]
    C -->|HTTP GET| D[Backend REST API]
    D -->|Response| C
    C -->|Update State| B
    B -->|Re-render| A

    E[ClassForm Component] -->|onSubmit| F[useClasses.createClass]
    F -->|HTTP POST| C
    C -->|New Class| B
    B -->|Update List| A

    G[User Interaction] -->|Click Add| E
    A -->|Success Message| H[Toast/Notification]

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style C fill:#d4edda
    style D fill:#f8d7da
    style E fill:#e1f5ff
```

---

### DES-11: Service Layer Implementation

#### API Client Base

```typescript
// src/services/api/apiClient.ts

import axios, { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Base API client with authentication and error handling
 * Provides centralized HTTP operations with automatic token management
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: Add authentication token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: Handle global errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Redirect to login on authentication failure
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
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

#### Class Service

```typescript
// src/services/api/classService.ts

import { Class, CreateClassRequest, UpdateClassRequest } from '../../types/Class';
import { ApiResponse } from '../../types/ApiResponse';
import { apiClient } from './apiClient';

/**
 * Service for class-related API operations
 * Provides abstraction over HTTP calls to backend API
 */
export const classService = {
  /**
   * Fetch all classes for authenticated teacher
   * Maps to: GET /api/v1/classes
   *
   * @returns Promise<Class[]> List of classes
   * @throws ApiError on failure
   */
  async getAll(): Promise<Class[]> {
    const response = await apiClient.get<ApiResponse<Class[]>>('/classes');
    return response.data.data;
  },

  /**
   * Fetch single class by ID
   * Maps to: GET /api/v1/classes/:id
   *
   * @param id - Class UUID
   * @returns Promise<Class> Class details
   * @throws ApiError on failure (404 if not found)
   */
  async getById(id: string): Promise<Class> {
    const response = await apiClient.get<ApiResponse<Class>>(`/classes/${id}`);
    return response.data.data;
  },

  /**
   * Create new class
   * Maps to: POST /api/v1/classes
   *
   * @param data - Class creation data
   * @returns Promise<Class> Created class with generated ID
   * @throws ApiError on failure (400 validation, 409 duplicate)
   */
  async create(data: CreateClassRequest): Promise<Class> {
    const response = await apiClient.post<ApiResponse<Class>>('/classes', data);
    return response.data.data;
  },

  /**
   * Update existing class
   * Maps to: PUT /api/v1/classes/:id
   *
   * @param id - Class UUID
   * @param data - Updated class data
   * @returns Promise<Class> Updated class
   * @throws ApiError on failure (400 validation, 404 not found, 409 duplicate)
   */
  async update(id: string, data: UpdateClassRequest): Promise<Class> {
    const response = await apiClient.put<ApiResponse<Class>>(`/classes/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete class
   * Maps to: DELETE /api/v1/classes/:id
   *
   * @param id - Class UUID
   * @returns Promise<void>
   * @throws ApiError on failure (404 not found, 409 has dependencies)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/classes/${id}`);
  },
};
```

---

## 4. Technical Risks & Dependencies

### DES-12: Risk Assessment

| Risk ID | Risk Description | Impact | Probability | Mitigation Strategy | Owner |
|---------|-----------------|--------|-------------|---------------------|-------|
| RISK-1 | Backend API not ready for integration | **HIGH** | Medium | Create mock API service with MSW for parallel development | Backend Team |
| RISK-2 | Duplicate detection performance issues with large datasets | Medium | Low | Implement backend-side validation; client-side as UX enhancement only | Backend Team |
| RISK-3 | Authentication token management complexity | Medium | Medium | Use existing auth patterns from other features; create reusable auth hook | Frontend Team |
| RISK-4 | Form validation library selection (Formik vs React Hook Form vs native) | Low | Low | Start with native React validation; refactor to library if complexity grows | Frontend Team |
| RISK-5 | Date formatting inconsistencies across timezones | Medium | Medium | Use `date-fns` for consistent formatting; store UTC on backend | Frontend Team |
| RISK-6 | Accessibility compliance (WCAG 2.1 AA) | Medium | Medium | Follow WAI-ARIA best practices; add ARIA labels; keyboard navigation | Frontend Team |
| RISK-7 | State synchronization after CRUD operations | Low | Low | Use optimistic updates with rollback on error | Frontend Team |
| RISK-8 | Error message clarity and user-friendliness | Low | High | Create error message mapping service; UX review of all error states | Frontend Team |

---

### DES-13: Dependencies

#### External Dependencies (npm packages):

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "axios": "^1.6.x",           // HTTP client
    "date-fns": "^3.x"            // Date formatting utility
  },
  "devDependencies": {
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "msw": "^2.x"                 // Mock Service Worker for API mocking
  }
}
```

#### Backend Dependencies:
- ✅ **Authentication API**: JWT token generation and validation
- ✅ **Classes CRUD API**: All 5 endpoints defined in DES-7
- ✅ **Database Schema**: Class table with proper indexes on (teacher_id, name, year)
- ⚠️ **CORS Configuration**: Frontend domain must be whitelisted

#### Infrastructure Dependencies:
- Environment variables configuration (`.env` file)
- API base URL configuration (`VITE_API_BASE_URL`)
- Authentication token storage strategy

---

### DES-14: Critical Path Analysis

```mermaid
graph LR
    A[Setup Project Structure] --> B[Create Type Definitions]
    B --> C[Build API Client]
    C --> D[Create Mock API MSW]
    D --> E[Build useClasses Hook]
    E --> F1[ClassList Component]
    E --> F2[ClassForm Component]
    F1 --> G[Integration Testing]
    F2 --> G
    G --> H[Backend Integration]
    H --> I[E2E Testing]

    style A fill:#d4edda
    style B fill:#d4edda
    style C fill:#fff3cd
    style D fill:#fff3cd
    style E fill:#fff3cd
    style F1 fill:#e1f5ff
    style F2 fill:#e1f5ff
    style G fill:#f8d7da
    style H fill:#f8d7da
    style I fill:#f8d7da
```

**Critical Path Tasks** (must be sequential):
1. Type definitions → API client → Custom hook → Components
2. Backend API readiness blocks final integration testing

**Parallelizable Tasks**:
- Component UI development (with mock data)
- Validation logic development
- Date formatting utilities
- Common UI components (Button, Input, etc.)

---

## 5. Architecture Diagrams

### DES-15: Component Interaction Diagram

```mermaid
graph TD
    subgraph "UI Layer"
        A[ClassList Container]
        B[ClassListItem]
        C[EmptyState]
        D[ClassForm]
        E[LoadingSpinner]
        F[ErrorMessage]
    end

    subgraph "Business Logic Layer"
        G[useClasses Hook]
        H[useClassForm Hook]
    end

    subgraph "Service Layer"
        I[classService]
        J[apiClient]
        K[classValidation]
    end

    subgraph "External"
        L[Backend REST API]
        M[LocalStorage Auth]
    end

    A -->|renders| B
    A -->|renders| C
    A -->|renders| E
    A -->|renders| F
    A -->|uses| G

    D -->|uses| H
    D -->|uses| K

    G -->|calls| I
    H -->|calls| I

    I -->|uses| J
    J -->|HTTP| L
    J -->|reads token| M

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#e1f5ff
    style G fill:#fff3cd
    style H fill:#fff3cd
    style I fill:#d4edda
    style J fill:#d4edda
    style L fill:#f8d7da
```

---

### DES-16: Data Flow Sequence - View Classes (US-CLASS-001)

```mermaid
sequenceDiagram
    actor User
    participant ClassList
    participant useClasses
    participant classService
    participant apiClient
    participant Backend

    User->>ClassList: Navigate to classes page
    ClassList->>useClasses: Mount component
    useClasses->>useClasses: Set isLoading = true
    useClasses->>classService: getAll()
    classService->>apiClient: GET /classes
    apiClient->>apiClient: Add auth token
    apiClient->>Backend: HTTP GET request
    Backend-->>apiClient: 200 + class data
    apiClient-->>classService: Response data
    classService-->>useClasses: Class[]
    useClasses->>useClasses: Set classes, isLoading = false
    useClasses-->>ClassList: Re-render with data
    ClassList->>ClassList: Sort by year desc, name asc
    ClassList-->>User: Display class list
```

---

### DES-17: Data Flow Sequence - Add Class (US-CLASS-002)

```mermaid
sequenceDiagram
    actor User
    participant ClassForm
    participant useClassForm
    participant Validation
    participant useClasses
    participant classService
    participant Backend

    User->>ClassForm: Click "Add Class" button
    ClassForm-->>User: Display empty form

    User->>ClassForm: Enter name and year
    ClassForm->>useClassForm: Update form state

    User->>ClassForm: Click "Submit"
    ClassForm->>Validation: Validate input

    alt Validation Fails
        Validation-->>ClassForm: Return errors
        ClassForm-->>User: Display validation errors
    else Validation Passes
        Validation-->>ClassForm: Valid
        ClassForm->>ClassForm: Set isLoading = true
        ClassForm->>useClasses: createClass(data)
        useClasses->>classService: create(data)
        classService->>Backend: POST /classes

        alt API Success
            Backend-->>classService: 201 + new class
            classService-->>useClasses: New class object
            useClasses->>useClasses: Add to classes array
            useClasses-->>ClassForm: Success
            ClassForm-->>User: Redirect to list + success message
        else API Error (Duplicate)
            Backend-->>classService: 409 Conflict
            classService-->>useClasses: Throw error
            useClasses-->>ClassForm: Error message
            ClassForm-->>User: Display error message
        end
    end
```

---

### DES-18: Component State Machine

```mermaid
stateDiagram-v2
    [*] --> Initializing

    Initializing --> Loading: useEffect triggers fetch
    Loading --> Success: API returns data
    Loading --> Error: API fails
    Loading --> Empty: API returns []

    Success --> Success: User views list
    Success --> Creating: User clicks "Add Class"

    Empty --> Creating: User clicks "Create First Class"

    Creating --> Validating: User submits form
    Validating --> ValidationError: Client validation fails
    Validating --> Submitting: Validation passes

    ValidationError --> Creating: User corrects input

    Submitting --> Success: API success (201)
    Submitting --> ApiError: API fails (400/409/500)

    ApiError --> Creating: User retries

    Error --> Loading: User clicks "Retry"

    Success --> [*]
```

---

## 6. Security Considerations

### DES-20: Security Requirements

#### Authentication & Authorization
- ✅ **JWT Token Management**: Store in `localStorage` (consider `httpOnly` cookies for production)
- ✅ **Token Expiration**: Handle 401 responses with automatic redirect to login
- ✅ **CSRF Protection**: Required if using cookie-based auth (not needed for Bearer tokens)
- ✅ **Authorization**: Backend validates teacher can only access their own classes

#### Input Validation
- ✅ **Client-side validation**: User experience (prevent bad requests)
- ✅ **Server-side validation**: Security boundary (never trust client)
- ✅ **XSS Prevention**: React escapes by default, but verify no `dangerouslySetInnerHTML` usage
- ✅ **SQL Injection**: Backend responsibility (parameterized queries)

#### Data Protection
- ✅ **HTTPS Only**: Enforce TLS in production
- ✅ **Sensitive Data**: No PII in class entity (just name/year)
- ✅ **Audit Logging**: Backend logs all CRUD operations with user ID

#### Error Handling
- ❌ **Never expose stack traces** to frontend
- ✅ **Generic error messages** for security issues
- ✅ **Detailed errors** only for validation failures

---

## 7. Performance Considerations

### DES-21: Performance Optimizations

#### Initial Load
- ✅ **Code splitting**: Lazy load ClassForm component
- ✅ **Bundle size**: Monitor with `vite-bundle-analyzer`
- ✅ **Tree shaking**: Ensure Vite config optimized

#### Runtime Performance
- ✅ **Memoization**: Use `React.memo()` for ClassListItem
- ✅ **useCallback**: Wrap event handlers in ClassList
- ✅ **Virtual scrolling**: Implement if >100 classes (future enhancement)
- ✅ **Debounce**: Add to search input (future feature)

#### Network Optimization
- ✅ **Caching**: Implement stale-while-revalidate strategy (future)
- ✅ **Pagination**: Backend pagination for large datasets (future)
- ✅ **Compression**: Enable gzip/brotli on backend

---

## 8. Testing Strategy

### DES-22: Test Coverage Requirements

| Layer | Coverage Target | Test Types |
|-------|----------------|------------|
| Utilities | 100% | Unit tests |
| Services | 90%+ | Unit tests with MSW |
| Hooks | 90%+ | Unit tests with `renderHook` |
| Components | 85%+ | Unit + Integration tests |
| E2E Workflows | 100% of critical paths | Playwright E2E |

### Test Pyramid

```
           /\
          /E2E\        ← 2 tests (view list, add class)
         /------\
        /Integration\   ← 5 tests (component interactions)
       /------------\
      /  Unit Tests  \  ← 50+ tests (components, hooks, utils)
     /----------------\
```

### Test Data Strategy

#### Mock Data for Development/Testing

```typescript
// src/mocks/data/classes.ts

export const mockClasses: Class[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Math 101',
    year: 2025,
    created_at: '2025-01-15T14:30:00Z',
    updated_at: '2025-01-15T14:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'English 201',
    year: 2024,
    created_at: '2024-09-01T08:00:00Z',
    updated_at: '2024-09-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Science 301',
    year: 2025,
    created_at: '2025-01-20T09:00:00Z',
    updated_at: '2025-01-20T09:00:00Z',
  },
];
```

---

## 9. Deployment Checklist

### DES-23: Pre-Deployment Requirements

#### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings

#### Configuration
- [ ] Environment variables configured
- [ ] API base URL set for production
- [ ] Authentication flow tested end-to-end
- [ ] Error handling verified

#### Testing
- [ ] Unit test coverage ≥ 85%
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Accessibility audit passed (WCAG 2.1 AA)

#### Performance
- [ ] Initial load time < 3 seconds
- [ ] Bundle size analyzed and optimized
- [ ] Lighthouse score > 90

#### Browser Compatibility
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile responsiveness verified

#### Documentation
- [ ] API documentation updated
- [ ] Component documentation complete
- [ ] README updated with setup instructions
- [ ] Deployment guide created

---

## Traceability Matrix

| User Story | Design Elements | Implementation Tasks |
|------------|----------------|----------------------|
| US-CLASS-001 (View List) | DES-1, DES-2, DES-4, DES-7, DES-9, DES-16 | TASK-1.3, TASK-3.1, TASK-4.2, TASK-4.3, TASK-4.4 |
| US-CLASS-002 (Add Class) | DES-3, DES-7, DES-9, DES-11, DES-17 | TASK-1.4, TASK-2.3, TASK-3.1, TASK-4.5 |
| US-CLASS-003 (Edit Class) | DES-3, DES-7, DES-9, DES-11 | Future sprint (post-MVP) |
| US-CLASS-004 (View Details) | DES-7 | Future sprint (post-MVP) |
| US-CLASS-005 (Delete Class) | DES-7, DES-9 | Future sprint (post-MVP) |

---

## Approval & Sign-off

**Technical Design Approved By:**
- [ ] System Architect: __________________ Date: __________
- [ ] Frontend Lead: ____________________ Date: __________
- [ ] Backend Lead: _____________________ Date: __________
- [ ] Product Owner: ____________________ Date: __________

**Implementation Ready**: ✅ Approved to proceed with task execution

---

**Next Step**: Proceed to `tasks.md` for TDD implementation breakdown
