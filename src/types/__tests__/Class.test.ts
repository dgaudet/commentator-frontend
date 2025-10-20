/**
 * Class Type Definition Tests
 * TDD: RED Phase - Tests written BEFORE implementation
 *
 * These tests validate that our type definitions match the actual backend API
 * Backend API Reference: http://localhost:3000/api-docs/ui
 */
import { describe, it, expect } from '@jest/globals'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../Class'

describe('Class Type Definitions', () => {
  describe('Class interface', () => {
    it('should accept a valid class object with all required fields', () => {
      const validClass: Class = {
        id: 1,
        name: 'Mathematics 101',
        year: 2024,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      // Type validation - if this compiles, types are correct
      expect(validClass.id).toBe(1)
      expect(validClass.name).toBe('Mathematics 101')
      expect(validClass.year).toBe(2024)
      expect(validClass.createdAt).toBe('2024-01-15T10:30:00Z')
      expect(validClass.updatedAt).toBe('2024-01-15T10:30:00Z')
    })

    it('should have id as number type (not string)', () => {
      const classItem: Class = {
        id: 123, // Must be number, not string UUID
        name: 'Test',
        year: 2024,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      expect(typeof classItem.id).toBe('number')
    })

    it('should use camelCase field names (createdAt, not created_at)', () => {
      const classItem: Class = {
        id: 1,
        name: 'Test',
        year: 2024,
        createdAt: '2024-01-15T10:30:00Z', // camelCase
        updatedAt: '2024-01-15T10:30:00Z', // camelCase
      }

      expect(classItem).toHaveProperty('createdAt')
      expect(classItem).toHaveProperty('updatedAt')
      // Should NOT have snake_case properties
      expect(classItem).not.toHaveProperty('created_at')
      expect(classItem).not.toHaveProperty('updated_at')
    })

    it('should have ISO 8601 timestamp strings for dates', () => {
      const classItem: Class = {
        id: 1,
        name: 'Test',
        year: 2024,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T11:45:00Z',
      }

      expect(typeof classItem.createdAt).toBe('string')
      expect(typeof classItem.updatedAt).toBe('string')
      // Validate ISO 8601 format
      expect(classItem.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('CreateClassRequest interface', () => {
    it('should accept valid class creation data', () => {
      const createRequest: CreateClassRequest = {
        name: 'English 201',
        year: 2025,
      }

      expect(createRequest.name).toBe('English 201')
      expect(createRequest.year).toBe(2025)
    })

    it('should only require name and year (no id or timestamps)', () => {
      const createRequest: CreateClassRequest = {
        name: 'Science 301',
        year: 2024,
      }

      // Should NOT have id, createdAt, or updatedAt
      expect(createRequest).not.toHaveProperty('id')
      expect(createRequest).not.toHaveProperty('createdAt')
      expect(createRequest).not.toHaveProperty('updatedAt')
    })

    it('should accept year as number type', () => {
      const createRequest: CreateClassRequest = {
        name: 'History 101',
        year: 2024,
      }

      expect(typeof createRequest.year).toBe('number')
    })
  })

  describe('UpdateClassRequest interface', () => {
    it('should accept valid class update data', () => {
      const updateRequest: UpdateClassRequest = {
        name: 'Mathematics 102',
        year: 2025,
      }

      expect(updateRequest.name).toBe('Mathematics 102')
      expect(updateRequest.year).toBe(2025)
    })

    it('should have same structure as CreateClassRequest', () => {
      const updateRequest: UpdateClassRequest = {
        name: 'Updated Class',
        year: 2024,
      }

      // Should only have name and year
      expect(Object.keys(updateRequest)).toHaveLength(2)
      expect(updateRequest).toHaveProperty('name')
      expect(updateRequest).toHaveProperty('year')
    })

    it('should not include id or timestamps', () => {
      const updateRequest: UpdateClassRequest = {
        name: 'Test',
        year: 2024,
      }

      // ID and timestamps managed by backend
      expect(updateRequest).not.toHaveProperty('id')
      expect(updateRequest).not.toHaveProperty('createdAt')
      expect(updateRequest).not.toHaveProperty('updatedAt')
    })
  })

  describe('Type compatibility', () => {
    it('should allow CreateClassRequest and UpdateClassRequest to be interchangeable', () => {
      const data = {
        name: 'Test Class',
        year: 2024,
      }

      // Should be assignable to both types
      const createReq: CreateClassRequest = data
      const updateReq: UpdateClassRequest = data

      expect(createReq).toEqual(updateReq)
    })
  })
})
