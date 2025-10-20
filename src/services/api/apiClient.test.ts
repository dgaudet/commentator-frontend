/**
 * API Client Tests
 * Unit tests for API client structure and configuration
 * Integration tests with MSW will be in service layer tests
 */
import { apiClient } from './apiClient'

describe('ApiClient', () => {
  it('should be defined', () => {
    expect(apiClient).toBeDefined()
  })

  it('should have get method', () => {
    expect(apiClient.get).toBeDefined()
    expect(typeof apiClient.get).toBe('function')
  })

  it('should have post method', () => {
    expect(apiClient.post).toBeDefined()
    expect(typeof apiClient.post).toBe('function')
  })

  it('should have put method', () => {
    expect(apiClient.put).toBeDefined()
    expect(typeof apiClient.put).toBe('function')
  })

  it('should have delete method', () => {
    expect(apiClient.delete).toBeDefined()
    expect(typeof apiClient.delete).toBe('function')
  })
})

// Note: Full integration tests with MSW will be performed in classService.test.ts
// This avoids MSW v2 + Jest ESM compatibility issues when testing in isolation
