/**
 * Subject Type Definition Tests
 * TDD: RED Phase - Tests written BEFORE implementation
 *
 * These tests validate that our type definitions match the actual backend API
 * Backend API Reference: http://localhost:3000/api-docs/ui
 * API Change: /class → /subject (year field removed from Subject entity)
 */
import { describe, it, expect } from '@jest/globals'
import type { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../Subject'

describe('Subject Type Definitions', () => {
  describe('Subject interface', () => {
    it('should accept a valid subject object with all required fields', () => {
      const validSubject: Subject = {
        id: '65a1b2c3d4e5f6a7b8c9d0e1',
        name: 'Mathematics 101',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      // Type validation - if this compiles, types are correct
      expect(validSubject.id).toBe('65a1b2c3d4e5f6a7b8c9d0e1')
      expect(validSubject.name).toBe('Mathematics 101')
      expect(validSubject.createdAt).toBe('2024-01-15T10:30:00Z')
      expect(validSubject.updatedAt).toBe('2024-01-15T10:30:00Z')
    })

    it('should NOT have year field (removed in Subject entity)', () => {
      const subject: Subject = {
        id: '65a1b2c3d4e5f6a7b8c9d0e2',
        name: 'Test',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      // Subject entity does NOT have year field (unlike old Class entity)
      expect(subject).not.toHaveProperty('year')
    })

    it('should have id as string type (MongoDB ObjectId format)', () => {
      const subject: Subject = {
        id: '65a1b2c3d4e5f6a7b8c9d0e3', // MongoDB ObjectId string (24 hex characters)
        name: 'Test',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      expect(typeof subject.id).toBe('string')
      // Verify it matches MongoDB ObjectId format (24 hex characters)
      expect(subject.id).toMatch(/^[0-9a-fA-F]{24}$/)
    })

    it('should use camelCase field names (createdAt, not created_at)', () => {
      const subject: Subject = {
        id: '65a1b2c3d4e5f6a7b8c9d0e4',
        name: 'Test',
        createdAt: '2024-01-15T10:30:00Z', // camelCase
        updatedAt: '2024-01-15T10:30:00Z', // camelCase
      }

      expect(subject).toHaveProperty('createdAt')
      expect(subject).toHaveProperty('updatedAt')
      // Should NOT have snake_case properties
      expect(subject).not.toHaveProperty('created_at')
      expect(subject).not.toHaveProperty('updated_at')
    })

    it('should have ISO 8601 timestamp strings for dates', () => {
      const subject: Subject = {
        id: '65a1b2c3d4e5f6a7b8c9d0e5',
        name: 'Test',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T11:45:00Z',
      }

      expect(typeof subject.createdAt).toBe('string')
      expect(typeof subject.updatedAt).toBe('string')
      // Validate ISO 8601 format
      expect(subject.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('CreateSubjectRequest interface', () => {
    it('should accept valid subject creation data with only name', () => {
      const createRequest: CreateSubjectRequest = {
        name: 'English 201',
      }

      expect(createRequest.name).toBe('English 201')
    })

    it('should only require name (no year, id, or timestamps)', () => {
      const createRequest: CreateSubjectRequest = {
        name: 'Science 301',
      }

      // Should NOT have year (removed in Subject entity)
      expect(createRequest).not.toHaveProperty('year')
      // Should NOT have id, createdAt, or updatedAt
      expect(createRequest).not.toHaveProperty('id')
      expect(createRequest).not.toHaveProperty('createdAt')
      expect(createRequest).not.toHaveProperty('updatedAt')
    })

    it('should accept name as string type', () => {
      const createRequest: CreateSubjectRequest = {
        name: 'History 101',
      }

      expect(typeof createRequest.name).toBe('string')
    })
  })

  describe('UpdateSubjectRequest interface', () => {
    it('should accept valid subject update data with only name', () => {
      const updateRequest: UpdateSubjectRequest = {
        name: 'Mathematics 102',
      }

      expect(updateRequest.name).toBe('Mathematics 102')
    })

    it('should have same structure as CreateSubjectRequest', () => {
      const updateRequest: UpdateSubjectRequest = {
        name: 'Updated Subject',
      }

      // Should only have name (no year)
      expect(Object.keys(updateRequest)).toHaveLength(1)
      expect(updateRequest).toHaveProperty('name')
      expect(updateRequest).not.toHaveProperty('year')
    })

    it('should not include id or timestamps', () => {
      const updateRequest: UpdateSubjectRequest = {
        name: 'Test',
      }

      // ID and timestamps managed by backend
      expect(updateRequest).not.toHaveProperty('id')
      expect(updateRequest).not.toHaveProperty('createdAt')
      expect(updateRequest).not.toHaveProperty('updatedAt')
    })
  })

  describe('Type compatibility', () => {
    it('should allow CreateSubjectRequest and UpdateSubjectRequest to be interchangeable', () => {
      const data = {
        name: 'Test Subject',
      }

      // Should be assignable to both types
      const createReq: CreateSubjectRequest = data
      const updateReq: UpdateSubjectRequest = data

      expect(createReq).toEqual(updateReq)
    })
  })
})
