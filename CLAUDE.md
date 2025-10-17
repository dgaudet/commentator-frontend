# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React frontend application for managing student report card comments. It integrates with a REST API to perform CRUD operations on Classes, OutcomeComments, PersonalizedComments, and FinalComments.

**Current State**: Early-stage setup phase - infrastructure and development protocols are established, but implementation code has not yet been created.

## Development Commands

```bash
# Start development server
npm run start

# Run tests
npm run test

# Check linting errors (MUST pass before commits)
npm run lint
```

**Required before each commit**: `npm run lint` must pass without errors.

## Technology Stack

- **Runtime**: Node.js v24 (see `.nvmrc`)
- **Framework**: React
- **Build Tool**: Vite
- **Testing**: Jest
- **Linting**: ESLint, Stylelint
- **Package Manager**: npm

## Architecture & Code Structure

When implemented, the codebase will follow this structure:

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # API interactions with REST backend
├── utils/          # Utility functions and helpers
└── styles/         # CSS or styled-components
```

### Domain Model

The application manages four core entities via REST API:

1. **Classes** - Educational classes
2. **OutcomeComments** - Comments related to learning outcomes
3. **PersonalizedComments** - Student-specific comments
4. **FinalComments** - Aggregated final comments for reports

All entities support full CRUD operations.

## Specification-First Development

This project follows a structured three-phase methodology using specification files stored in `.spec/<feature-name>/`:

### Phase 1: Requirements (📋 `requirements.md`)
- User stories in EARS notation format:
  ```
  WHEN [condition/event]
  THE SYSTEM SHALL [expected behavior]
  ```
- Clear acceptance criteria
- Edge cases and validation rules

### Phase 2: Design (🎨 `design.md`)
- Technical architecture and component design
- Data models and API specifications
- Security considerations
- Include Mermaid diagrams for complex interactions

### Phase 3: Implementation (📅 `tasks.md`)
- Atomic, trackable tasks with risk tiers
- TDD-first approach (Red-Green-Refactor cycle)
- Effort estimates and dependencies

### Specification Files Structure

Each feature generates these files in `.spec/<feature-name>/`:
- `intent.md` - Canonical specification
- `requirements.md` - User stories in EARS format
- `design.md` - Technical architecture
- `tasks.md` - Implementation checklist with risk tiers
- `state.json` - Machine-readable state persistence
- `delivery_report.md` - Validation results
- `rollback.md` - Rollback instructions

**State Machine**: The development workflow follows a strict state machine:
1. `INTENT_REFINEMENT` - Planning and specification (requires confidence ≥ 0.85 to proceed)
2. `TASK_EXECUTION` - Implementation with TDD-first approach
3. `DELIVERY_VALIDATION` - Testing and quality verification

## Test-Driven Development (TDD)

**MANDATORY for all features**: Follow the Red-Green-Refactor cycle:

1. **Write Failing Test**: Create test that defines desired behavior
2. **Confirm Failure**: Run test to verify it fails as expected
3. **Implement Code**: Write minimal code to pass the test
4. **Confirm Success**: Run test to verify it passes
5. **Refactor**: Improve code quality while keeping tests green

**Never**:
- Weaken or delete tests without explicit approval
- Skip test creation for new features or bug fixes

**Always**:
- Add regression tests for fixed bugs
- Create minimal test suites if none exist

## Risk-Tiered Task Management

Tasks are classified by risk level with corresponding approval and retry policies:

### Trivial Risk
- Single-file localized changes (docs, formatting, minor test updates)
- **Approval**: Auto-approved after plan preview
- **Retries**: 0 auto-retries

### Low Risk
- Localized edits, lint/format fixes, single-file non-API changes
- **Approval**: Auto-approved
- **Retries**: Up to 2 for transient failures

### Medium Risk
- Multi-file changes within a module, additive APIs, config changes
- **Approval**: Explicit user approval required
- **Retries**: Up to 1 auto-retry

### High Risk
- Cross-cutting refactors, deletions/moves, migrations, major dependency changes
- **Approval**: Explicit user approval required
- **Retries**: 0 auto-retries without explicit approval

## Git Workflow

### Branch Strategy
- Feature branches: `feature/intent-v<spec-version>`
- Main branch for PRs: `main`

### Commit Standards
- Ensure the last line of each file ends with a newline character
- Reference requirement IDs in commits for traceability (e.g., `REQ-3`, `DES-3`, `TASK-3.1`)

### Pull Requests
- Reference `intent.md` and `tasks.md` in PR description
- Include validation artifacts from `delivery_report.md`
- CI must pass before merge

## Memory Management

### Per-Feature Memory
Store in `.github/instructions/memory/features/<feature-name>/memory.md`:
- Current file structure
- Key technical decisions
- Change history with rationale
- External resources referenced

### Global Memory Index
Maintain `.github/instructions/memory-index.md`:
- Living index of all features
- Links to feature-specific memory files
- Quick project overview

**Update both files after**:
- Every significant phase completion
- Major architectural changes

## Code Quality Standards

1. Follow React best practices and idiomatic patterns
2. Maintain clean architecture principles with modular design
3. Use dependency injection patterns where appropriate
4. Document complex logic and public APIs
5. Suggest README updates when appropriate
6. Ensure all files end with a newline character

**Note**: The copilot instructions mention "Go best practices" which appears to be a copy-paste error - this is a React/JavaScript project.

## Project Context Files

Key files for understanding the project:
- `.github/copilot-instructions.md` - Development guidelines and standards
- `.github/prompts/spec.prompt.md` - Specification planning agent protocol (Kiro methodology)
- `.github/prompts/intent.prompt.md` - Production-grade co-pilot state machine protocol
- `toDos.md` - Feature backlog and pending work

## Traceability

Maintain requirement traceability across phases:
- Requirements: `REQ-x`
- Design: `DES-x`
- Tasks: `TASK-x.y`

Reference these IDs in specs, comments, commits, and PRs for full audit trail.