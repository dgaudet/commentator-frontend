---
category: development
priority: critical
scope: team
---

# Test-Driven Development (TDD) - Mandatory Practice

## Overview

Test-Driven Development (TDD) is a **MANDATORY** practice for all developer personas in the PDD Framework. This is not optional - every line of production code must be preceded by a failing test.

## The Red-Green-Refactor Cycle

### 🔴 RED - Write a Failing Test First

**ALWAYS start here. No exceptions.**

1. **Identify the smallest behavior** you want to implement
2. **Write a test** that defines that behavior
3. **Run the test** and confirm it fails
4. **Verify the failure** is for the right reason

**Example (Backend - Node.js/Jest):**
```javascript
// ❌ RED: This test will fail because the function doesn't exist yet
describe('UserService', () => {
  it('should create a new user with valid email', async () => {
    const userService = new UserService();
    const user = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User'
    });
    
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
  });
});
```

**Example (Frontend - React/Testing Library):**
```javascript
// ❌ RED: This test will fail because the component doesn't exist yet
import { render, screen } from '@testing-library/react';
import { LoginButton } from './LoginButton';

describe('LoginButton', () => {
  it('should display login text when user is not authenticated', () => {
    render(<LoginButton isAuthenticated={false} />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Login');
  });
});
```

### 🟢 GREEN - Write Minimal Code to Pass

**Write ONLY enough code to make the test pass. Nothing more.**

1. **Implement the simplest solution** that makes the test green
2. **Run the test** and confirm it passes
3. **Resist the urge** to add extra features or "nice-to-haves"

**Example (Backend - Minimal Implementation):**
```javascript
// ✅ GREEN: Minimal code to pass the test
class UserService {
  async createUser(userData) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: userData.name
    };
  }
}
```

**Example (Frontend - Minimal Implementation):**
```javascript
// ✅ GREEN: Minimal code to pass the test
export function LoginButton({ isAuthenticated }) {
  return (
    <button>
      {isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}
```

### 🔄 REFACTOR - Improve Code Quality

**Now you can improve the code while keeping tests green.**

1. **Improve code structure** and readability
2. **Extract duplications** and apply patterns
3. **Optimize performance** if needed
4. **Run tests continuously** to ensure they stay green

**Example (Backend - Refactored):**
```javascript
// 🔄 REFACTOR: Improved with better structure
class UserService {
  constructor(userRepository, idGenerator) {
    this.userRepository = userRepository;
    this.idGenerator = idGenerator;
  }

  async createUser(userData) {
    const user = {
      id: this.idGenerator.generate(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString()
    };
    
    return await this.userRepository.save(user);
  }
}
```

**Example (Frontend - Refactored):**
```javascript
// 🔄 REFACTOR: Improved with better accessibility and styling
export function LoginButton({ isAuthenticated, onLoginClick }) {
  const buttonText = isAuthenticated ? 'Logout' : 'Login';
  
  return (
    <button
      onClick={onLoginClick}
      className="auth-button"
      aria-label={`${buttonText} to your account`}
    >
      {buttonText}
    </button>
  );
}
```

## TDD Workflow Enforcement

### ✅ Acceptable Practices

1. **Test First, Always**
   - Write the failing test before any implementation
   - Show the RED phase explicitly in code reviews
   - Document the expected behavior in test names

2. **Minimal Implementation**
   - Write just enough code to pass the current test
   - Avoid "future-proofing" during GREEN phase
   - Add features incrementally with new tests

3. **Continuous Refactoring**
   - Refactor after each GREEN phase
   - Keep tests running and green during refactoring
   - Improve design without changing behavior

4. **Test Coverage as Byproduct**
   - Coverage emerges naturally from TDD
   - Don't write tests just to increase coverage percentage
   - Focus on behavior, not coverage metrics

### ❌ Unacceptable Practices (Violations)

1. **Implementation Before Tests**
   ```javascript
   // ❌ VIOLATION: Writing code first, tests later
   function createUser(data) { /* implementation */ }
   
   // Then writing tests...
   test('should create user', () => { /* ... */ });
   ```

2. **Testing After the Fact**
   ```javascript
   // ❌ VIOLATION: "Let me add tests for this code I just wrote"
   ```

3. **Writing Extra Code During GREEN**
   ```javascript
   // ❌ VIOLATION: Adding features not required by current test
   function createUser(data) {
     // The test doesn't require validation yet!
     if (!data.email.includes('@')) throw new Error('Invalid email');
     // ... 
   }
   ```

4. **Skipping the RED Phase**
   ```javascript
   // ❌ VIOLATION: Writing a test that passes immediately
   // This means you didn't write the test first!
   ```

## Enforcement in Personas

### Backend Developer TDD Requirements

```yaml
TDD-MANDATE:
  enforcement: CRITICAL
  workflow:
    - RED: Write failing test for API endpoint, service method, or business logic
    - GREEN: Implement minimal code to pass the test
    - REFACTOR: Improve structure, add error handling, optimize queries
  
  test_types:
    - unit: Test individual functions and methods
    - integration: Test service interactions and database operations
    - api: Test HTTP endpoints and request/response handling
    
  violations:
    - Implementation code without preceding failing test
    - Skipping test phases or writing tests after implementation
    - Over-engineering during GREEN phase
```

### Frontend Developer TDD Requirements

```yaml
TDD-MANDATE:
  enforcement: CRITICAL
  workflow:
    - RED: Write failing test for component behavior or user interaction
    - GREEN: Implement minimal component code to pass the test
    - REFACTOR: Improve accessibility, styling, and component structure
  
  test_types:
    - component: Test component rendering and props
    - interaction: Test user events and state changes
    - integration: Test component communication and data flow
    - accessibility: Test ARIA attributes and keyboard navigation
    
  violations:
    - Component code without preceding failing test
    - Skipping test phases or writing tests after implementation
    - Adding styling or features not required by current test
```

## Quality Gate: TDD Compliance

Every code submission must pass the TDD Compliance gate:

### Verification Checklist

- [ ] Every feature has a corresponding failing test written first
- [ ] Test failure was verified before implementation
- [ ] Implementation was minimal to pass the test
- [ ] Refactoring maintained green tests throughout
- [ ] No production code exists without a test
- [ ] Test names clearly describe expected behavior
- [ ] RED-GREEN-REFACTOR cycle is documented in commits

### Code Review Questions

1. "Can you show me the failing test that preceded this implementation?"
2. "Did you verify the test failed for the right reason?"
3. "Is this the minimal code needed to pass the test?"
4. "What refactoring did you do after getting to green?"
5. "Are there any code paths without corresponding tests?"

## TDD Anti-Patterns to Avoid

### 1. Test-Last Development
```javascript
// ❌ Anti-pattern: Writing code first
function calculateDiscount(price, couponCode) {
  // Implementation written without a test
}

// Then writing tests to match the implementation
```

### 2. Over-Engineering in GREEN Phase
```javascript
// ❌ Anti-pattern: Adding unnecessary features
test('should add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

function add(a, b) {
  // Test only requires addition!
  if (typeof a !== 'number') throw new Error('Invalid type');
  if (typeof b !== 'number') throw new Error('Invalid type');
  return a + b;
}
```

### 3. Testing Implementation Details
```javascript
// ❌ Anti-pattern: Testing private methods or implementation
test('should use Array.map internally', () => {
  const spy = jest.spyOn(Array.prototype, 'map');
  transform([1, 2, 3]);
  expect(spy).toHaveBeenCalled();
});
```

### 4. Coverage-Driven Testing
```javascript
// ❌ Anti-pattern: Writing tests just to hit coverage targets
// Instead of writing tests that define behavior
```

## TDD Benefits

### For Developers

- **Design Improvement**: Tests force you to think about API design
- **Confidence**: Green tests provide safety for refactoring
- **Documentation**: Tests serve as living documentation
- **Debugging**: Failures pinpoint exact issues quickly
- **Focus**: One behavior at a time keeps work manageable

### For Teams

- **Code Quality**: TDD enforces modular, testable design
- **Collaboration**: Tests communicate intent to team members
- **Regression Prevention**: Tests catch breaking changes immediately
- **Onboarding**: New developers learn system through tests
- **Maintenance**: Well-tested code is easier to modify safely

### For Projects

- **Reliability**: High confidence in system behavior
- **Agility**: Easy to add features without breaking existing ones
- **Quality Gates**: Automated verification of requirements
- **Technical Debt**: Reduced accumulation through continuous refactoring
- **Compliance**: Demonstrates quality practices for audits

## Integration with PDD Framework

### During `pdd invoke`

When a developer persona is invoked:

1. **Activation Notice** includes TDD mandate
2. **First Response** must acknowledge TDD requirement
3. **Code Examples** must show Red-Green-Refactor progression
4. **Violations** are called out immediately if detected

### Quality Gates Integration

```javascript
// .pdd/quality-gates/tdd-compliance.js
module.exports = {
  name: 'TDD Compliance',
  required: true,
  
  async validate(codeChanges) {
    const results = {
      passed: true,
      violations: [],
      recommendations: []
    };
    
    // Check for implementation without tests
    const hasTests = codeChanges.tests.length > 0;
    const hasImplementation = codeChanges.implementation.length > 0;
    
    if (hasImplementation && !hasTests) {
      results.passed = false;
      results.violations.push(
        'Implementation code found without corresponding tests'
      );
    }
    
    // Check test-first order in commits
    const testCommitFirst = codeChanges.commits[0]?.type === 'test';
    if (!testCommitFirst) {
      results.violations.push(
        'Tests must be committed before implementation'
      );
    }
    
    return results;
  }
};
```

## Resources and Further Reading

- **Books**:
  - "Test Driven Development: By Example" by Kent Beck
  - "Growing Object-Oriented Software, Guided by Tests" by Freeman & Pryce
  
- **Articles**:
  - [Martin Fowler's TDD Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
  - [Uncle Bob's Three Laws of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)

- **Videos**:
  - "TDD: The Bad Parts" by Matt Parker
  - "Is TDD Dead?" discussion series with Kent Beck, Martin Fowler, and DHH

## Summary

**TDD is mandatory. No exceptions. Every developer persona must:**

1. ✅ Write failing tests FIRST
2. ✅ Implement minimal code to pass
3. ✅ Refactor while keeping tests green
4. ✅ Demonstrate Red-Green-Refactor in all examples
5. ✅ Never write implementation without a failing test

**Remember**: If you're writing code without a failing test in front of you, you're doing it wrong. Stop, write the test, see it fail, then implement.

---

*This is a quality gate requirement. All code must demonstrate TDD compliance to be merged.*
