# Project Memory Index

**Last Updated**: 2025-10-20
**Project**: Commentator Frontend - React Application for Student Report Card Comments

---

## Project Overview

This is a React frontend application for managing student report card comments. It integrates with a REST API to perform CRUD operations on Classes, OutcomeComments, PersonalizedComments, and FinalComments.

**Current State**: Early-stage setup phase - infrastructure and development protocols are established. Design and planning complete for Class Management feature. Implementation has not yet started.

---

## Technology Stack

- **Runtime**: Node.js v24
- **Framework**: React 18.x
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Testing**: Jest + React Testing Library
- **HTTP Client**: Axios
- **State Management**: React Hooks (no Redux/Zustand for MVP)
- **Package Manager**: npm

---

## Architecture Overview

```
src/
├── components/     # React components (presentational + container)
├── hooks/          # Custom React hooks for business logic
├── services/       # API clients and business services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (date formatting, etc.)
└── mocks/          # MSW mock handlers for testing
```

---

## Feature Index

### 1. Class Management
**Status**: 📋 Design Complete - Ready for Implementation
**Sprint**: Sprint 1 (MVP)
**Last Updated**: 2025-10-20

**Memory File**: `.github/instructions/memory/features/class-management/memory.md`

**Overview**:
Teachers can manage their class listings to organize students and report card comments by academic year.

**User Stories**:
- ✅ **US-CLASS-001** (HIGH): View List of Classes - Display all classes sorted by year/name
- ✅ **US-CLASS-002** (HIGH): Add New Class - Create new class with validation
- ⏳ **US-CLASS-003** (MEDIUM): Edit Existing Class - Update class details (Post-MVP)
- ⏳ **US-CLASS-004** (LOW): View Class Details - Show detailed class information (Post-MVP)
- ⏳ **US-CLASS-005** (LOW): Delete Class - Remove classes (Post-MVP)

**Key Files**:
- Requirements: `.spec/class-management/requirements.md`
- Design: `.spec/class-management/design.md`
- API Integration: `.spec/class-management/API_INTEGRATION.md`
- Tasks: `.spec/class-management/tasks.md` (19 tasks, ~29 hours)

**Key Decisions**:
- Hook-based state management (no Redux)
- Direct API response consumption (not wrapped)
- Dual validation (client + server)
- TDD-first implementation approach

**Backend Integration**:
- API URL: `http://localhost:3000`
- Endpoint: `/class` (singular)
- Documentation: `http://localhost:3000/api-docs/ui`
- Authentication: Not required for MVP

**Next Steps**: Begin TASK-1.1 (Initialize React + Vite Project)

---

### 2. Outcome Comments Management
**Status**: 🔜 Not Started
**Priority**: Post-MVP

**Planned Features**:
- Manage comments related to learning outcomes
- Associate comments with classes
- CRUD operations

---

### 3. Personalized Comments Management
**Status**: 🔜 Not Started
**Priority**: Post-MVP

**Planned Features**:
- Student-specific comments
- Personalization tools
- Comment templates

---

### 4. Final Comments Generation
**Status**: 🔜 Not Started
**Priority**: Post-MVP

**Planned Features**:
- Aggregate outcome and personalized comments
- Generate final report card comments
- Review and edit workflow

---

## Development Workflow

### Specification-First Methodology

This project follows a structured three-phase approach:

1. **Phase 1: Requirements** (`requirements.md`)
   - User stories in EARS notation format
   - Acceptance criteria
   - Edge cases and validation rules

2. **Phase 2: Design** (`design.md`)
   - Technical architecture and component design
   - Data models and API specifications
   - Security and performance considerations
   - Mermaid diagrams for complex interactions

3. **Phase 3: Implementation** (`tasks.md`)
   - Atomic, trackable tasks with risk tiers
   - TDD-first approach (Red-Green-Refactor)
   - Effort estimates and dependencies

### Risk Tiers

Tasks are classified by risk level:
- 🟢 **TRIVIAL**: Documentation, formatting (auto-approved, 0 retries)
- 🟡 **LOW**: Single-file changes, localized edits (auto-approved, 2 retries)
- 🟠 **MEDIUM**: Multi-file changes, additive APIs (requires approval, 1 retry)
- 🔴 **HIGH**: Cross-cutting refactors, deletions (requires approval, 0 retries)

### Test-Driven Development (TDD)

**MANDATORY** for all features: Red-Green-Refactor cycle
1. Write failing test (RED)
2. Confirm failure
3. Implement minimal code (GREEN)
4. Confirm success
5. Refactor and improve (REFACTOR)

**Coverage Targets**:
- Utilities: 100%
- Services: 90%+
- Hooks: 90%+
- Components: 85%+

---

## Backend API Integration

### API Details
- **Base URL**: `http://localhost:3000`
- **Documentation**: Swagger UI at `http://localhost:3000/api-docs/ui`
- **OpenAPI Spec**: `http://localhost:3000/api-docs` (JSON)
- **API Version**: 1.0.0
- **Authentication**: Not required for MVP

### Core Entities
1. **Classes** - Educational class groupings
2. **OutcomeComments** - Learning outcome-based comments
3. **PersonalizedComments** - Student-specific comments
4. **FinalComments** - Aggregated report card comments

### Important Notes
- Backend uses singular endpoint names (`/class`, not `/classes`)
- IDs are integers (`number`), not UUIDs (`string`)
- Field names use camelCase (`createdAt`), not snake_case (`created_at`)
- Responses are direct, not wrapped in `{data: ...}` objects
- CORS must be configured for `http://localhost:5173` (Vite dev server)

---

## Git Workflow

### Branch Strategy
- **Feature branches**: `feature/intent-v<spec-version>`
- **Main branch**: `main`

### Commit Standards
- Reference requirement IDs (e.g., `REQ-3`, `DES-3`, `TASK-3.1`)
- Files must end with newline character
- `npm run lint` must pass before commits

### Pull Requests
- Reference `intent.md` and `tasks.md`
- Include validation artifacts
- CI must pass before merge

---

## Project Context Files

### Core Documentation
- **CLAUDE.md**: Development guidelines and standards
- **README.md**: Project setup and overview
- **toDos.md**: Feature backlog

### Specification Templates
- `.github/prompts/spec.prompt.md`: Specification planning protocol (Kiro)
- `.github/prompts/intent.prompt.md`: State machine protocol

### Memory Files
- **This file** (`.github/instructions/memory-index.md`): Living index of all features
- **Feature memories**: `.github/instructions/memory/features/<feature-name>/memory.md`

---

## Active Initiatives

### Sprint 1 (Current)
**Goal**: Implement Class Management MVP
**User Stories**: US-CLASS-001, US-CLASS-002
**Duration**: ~4 days (1 developer)
**Status**: Design complete, implementation pending

**Tasks**:
- TASK-1.1 through TASK-1.4: Project setup and infrastructure
- TASK-2.1 through TASK-2.3: Service layer (API client, validation)
- TASK-3.1: Custom hooks (`useClasses`)
- TASK-4.1 through TASK-4.5: Components (ClassList, ClassForm, utilities)
- TASK-5.1: Integration testing with real API

### Upcoming Sprints
- **Sprint 2**: Class Management - Edit functionality (US-CLASS-003)
- **Sprint 3**: Outcome Comments Management (new feature)
- **Sprint 4**: Personalized Comments Management (new feature)

---

## Key Architectural Decisions

### 1. State Management
**Decision**: React Hooks (no Redux/Zustand for MVP)
**Rationale**: Simpler, faster development; easy to refactor later

### 2. Testing Strategy
**Decision**: TDD-first with test pyramid
**Layers**: Unit tests (Jest) → Integration tests (MSW) → E2E tests (Playwright)

### 3. Component Pattern
**Decision**: Container/Presentational with hooks
**Rationale**: Clear separation of concerns, testability

### 4. API Integration
**Decision**: Direct response consumption via Axios
**Rationale**: Matches actual backend implementation, no wrapper needed

### 5. Validation
**Decision**: Dual validation (client + server)
**Rationale**: Better UX + security boundary

---

## External Resources

### Development
- **Backend Repository**: [Link to backend repo]
- **Swagger API Docs**: http://localhost:3000/api-docs/ui
- **Design System**: TBD (currently using Tailwind utility classes)

### Documentation
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Testing Library**: https://testing-library.com
- **Axios**: https://axios-http.com

---

## Quick Start

### Prerequisites
- Node.js v24 (see `.nvmrc`)
- npm latest
- Backend API running at `http://localhost:3000`

### Setup (Once Implemented)
```bash
# Clone repository
git clone <repo-url>
cd commentator-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_BASE_URL if needed

# Start development server
npm run start

# Run tests
npm test

# Lint code
npm run lint
```

---

## Changelog

### 2025-10-20 - Class Management Planning Complete
- Created comprehensive requirements document (US-CLASS-001 through US-CLASS-005)
- Designed technical architecture with 23 design elements
- Documented API integration with actual backend specifications
- Created TDD-first task breakdown (19 tasks across 6 phases)
- Established memory documentation structure
- **Status**: Ready for implementation

---

## Notes

- This is a living document - update after each significant feature completion
- Each feature should have its own memory file in `.github/instructions/memory/features/`
- Link new features to this index as they are added
- Document key decisions and their rationale for future reference
- Keep external resource links up to date

---

**Document Version**: 1.0.0
**Maintained By**: System Architect & Development Team
**Last Updated**: 2025-10-20
