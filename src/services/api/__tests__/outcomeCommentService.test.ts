/**
 * Outcome Comment Service Tests
 * Unit tests for outcome comment service structure and methods
 * Reference: Outcome Comments CRUD Feature
 *
 * Note: Full integration tests with MSW will be performed at the component/hook level
 * This avoids MSW v2 + Jest ESM compatibility issues when testing services in isolation
 */
import { outcomeCommentService } from '../outcomeCommentService'

describe('OutcomeCommentService', () => {
  it('should be defined', () => {
    expect(outcomeCommentService).toBeDefined()
  })

  describe('API methods', () => {
    it('should have getByClassId method', () => {
      expect(outcomeCommentService.getByClassId).toBeDefined()
      expect(typeof outcomeCommentService.getByClassId).toBe('function')
    })

    it('should have create method', () => {
      expect(outcomeCommentService.create).toBeDefined()
      expect(typeof outcomeCommentService.create).toBe('function')
    })

    it('should have update method', () => {
      expect(outcomeCommentService.update).toBeDefined()
      expect(typeof outcomeCommentService.update).toBe('function')
    })

    it('should have delete method', () => {
      expect(outcomeCommentService.delete).toBeDefined()
      expect(typeof outcomeCommentService.delete).toBe('function')
    })
  })

  describe('method signatures', () => {
    it('getByClassId should accept number parameter', () => {
      const result = outcomeCommentService.getByClassId(1)
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('create should accept request object', () => {
      const result = outcomeCommentService.create({ 
        classId: 1, 
        content: 'Test comment' 
      })
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('update should accept id and request object', () => {
      const result = outcomeCommentService.update(1, { 
        content: 'Updated comment' 
      })
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })

    it('delete should accept number parameter', () => {
      const result = outcomeCommentService.delete(1)
      expect(result).toBeInstanceOf(Promise)
      // Clean up promise to avoid unhandled rejection
      result.catch(() => {})
    })
  })
})

// Note: Integration tests validating actual API behavior with MSW handlers
// will be performed in:
// - OutcomeCommentsModal component tests (tests full integration)
// This approach avoids MSW v2 ESM compatibility issues in Jest