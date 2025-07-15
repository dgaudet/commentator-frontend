This is a nodeJS web application that uses as the react library. The application is designed to be modular, with a focus on clean architecture and maintainability.
It is responsible for working with a rest api related to classes and students, allowing for CRUD operations on OutcomeComments, PersonalizedComments, FinalComments and Classes.
Please follow these guidelines when contributing to the codebase:

## Code Standards

### Required before each commit:
- Run `npm run lint` to check for linting errors.

### Development flow:
- Run: `npm run start` to start the server.
- Run: `npm run test` to run the test suite.

### Repository Structure:
- `src/` - Contains the source code for the application.
- `src/components/` - Contains React components.
- `src/hooks/` - Contains custom React hooks.
- `src/services/` - Contains service files for API interactions.
- `src/utils/` - Contains utility functions and helpers.
- `src/styles/` - Contains CSS or styled-components for styling.
- Readme.md - Documentation for the project.
- `.github/` - Contains GitHub-specific files, including issue templates and workflows.

## Key Guidelines
1. Follow Go best practices and idiomatic patterns
2. Maintain existing code structure and organization
3. Use dependency injection patterns where appropriate
4. Add unit tests for new features and bug fixes
5. Document public APIs and complex logic. Suggest changes to the `Readme.md` when appropriate
6. Ensure the last line of each file ends with a newline character