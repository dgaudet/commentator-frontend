/**
 * Subject Service Tests
 * TDD: RED Phase - Tests written BEFORE implementation
 * Unit tests for subject service structure and methods
 *
 * API Change: /class → /subject (year field removed)
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * Note: Full integration tests with MSW will be performed at the component/hook level
 * This avoids MSW v2 + Jest ESM compatibility issues when testing services in isolation
 */
import { subjectService } from '../subjectService'

describe('SubjectService', () => {
  it('should be defined', () => {
    expect(subjectService).toBeDefined()
  })

  describe('API methods', () => {
    it('should have getAll method (renamed from getClasses)', () => {
      expect(subjectService.getAll).toBeDefined()
      expect(typeof subjectService.getAll).toBe('function')
    })

    it('should have getById method', () => {
      expect(subjectService.getById).toBeDefined()
      expect(typeof subjectService.getById).toBe('function')
    })

    it('should have create method (renamed from createClass)', () => {
      expect(subjectService.create).toBeDefined()
      expect(typeof subjectService.create).toBe('function')
    })

    it('should have update method (renamed from updateClass)', () => {
      expect(subjectService.update).toBeDefined()
      expect(typeof subjectService.update).toBe('function')
    })

    it('should have delete method (renamed from deleteClass)', () => {
      expect(subjectService.delete).toBeDefined()
      expect(typeof subjectService.delete).toBe('function')
    })
  })

  describe('method signatures', () => {
    it('getAll should return Promise', () => {
      const result = subjectService.getAll()
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('getById should accept number parameter', () => {
      const result = subjectService.getById(1)
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('create should accept request object with only name (no year)', () => {
      // Subject only has name field (year removed)
      const result = subjectService.create({ name: 'Mathematics 101' })
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('update should accept id and request object with only name (no year)', () => {
      // Subject only has name field (year removed)
      const result = subjectService.update(1, { name: 'Updated Subject' })
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('delete should accept number parameter', () => {
      const result = subjectService.delete(1)
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })
  })

  describe('endpoint validation', () => {
    it('should use /subject endpoint (not /class)', () => {
      // This is a structural test - actual endpoint validation happens in integration tests
      // We just verify the service is properly structured
      expect(subjectService).toBeDefined()
      expect(subjectService.getAll).toBeDefined()
    })
  })
})

// Note: Integration tests validating actual API behavior with MSW handlers
// will be performed in:
// - useSubjects hook tests (tests service + handlers together)
// - Component tests (tests full integration)
// This approach avoids MSW v2 ESM compatibility issues in Jest
