/**
 * Class Service Tests
 * Unit tests for class service structure and methods
 * Reference: TASK-2.3, US-CLASS-001, US-CLASS-002
 *
 * Note: Full integration tests with MSW will be performed at the component/hook level
 * This avoids MSW v2 + Jest ESM compatibility issues when testing services in isolation
 */
import { classService } from './classService'

describe('ClassService', () => {
  it('should be defined', () => {
    expect(classService).toBeDefined()
  })

  describe('API methods', () => {
    it('should have getAll method', () => {
      expect(classService.getAll).toBeDefined()
      expect(typeof classService.getAll).toBe('function')
    })

    it('should have getById method', () => {
      expect(classService.getById).toBeDefined()
      expect(typeof classService.getById).toBe('function')
    })

    it('should have create method', () => {
      expect(classService.create).toBeDefined()
      expect(typeof classService.create).toBe('function')
    })

    it('should have update method', () => {
      expect(classService.update).toBeDefined()
      expect(typeof classService.update).toBe('function')
    })

    it('should have delete method', () => {
      expect(classService.delete).toBeDefined()
      expect(typeof classService.delete).toBe('function')
    })
  })

  describe('method signatures', () => {
    it('getAll should return Promise', () => {
      const result = classService.getAll()
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('getById should accept number parameter', () => {
      const result = classService.getById(1)
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('create should accept request object', () => {
      const result = classService.create({ name: 'Test', year: 2024 })
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('update should accept id and request object', () => {
      const result = classService.update(1, { name: 'Test', year: 2024 })
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('delete should accept number parameter', () => {
      const result = classService.delete(1)
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })
  })
})

// Note: Integration tests validating actual API behavior with MSW handlers
// will be performed in:
// - TASK-3.1: useClasses hook tests (tests service + handlers together)
// - TASK-4.x: Component tests (tests full integration)
// This approach avoids MSW v2 ESM compatibility issues in Jest
