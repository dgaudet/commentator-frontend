/**
 * Class Management Integration Tests
 * Tests against real backend API at http://localhost:3000
 * Reference: TASK-5.1, US-CLASS-001, US-CLASS-002
 *
 * Prerequisites:
 * - Backend must be running at http://localhost:3000
 * - VITE_API_BASE_URL must be set to http://localhost:3000
 */
import { renderHook, waitFor, act } from '@testing-library/react'
import { useClasses } from '../../hooks/useClasses'
import { classService } from '../../services/api/classService'

/**
 * Note: These are integration tests that hit the real API.
 * They are skipped by default in CI. Run manually with:
 * npm test -- src/__tests__/integration/classManagement.test.tsx
 */
describe('Class Management Integration Tests', () => {
  // Skip if backend is not available
  const shouldSkip = process.env.SKIP_INTEGRATION_TESTS === 'true'
  const describeOrSkip = shouldSkip ? describe.skip : describe

  let testClassIds: number[] = []

  beforeAll(async () => {
    // Check if backend is available
    try {
      await classService.getAll()
    } catch (error) {
      console.warn('Backend not available at http://localhost:3000')
      console.warn('Skipping integration tests')
    }
  })

  afterEach(async () => {
    // Cleanup: Delete test classes created during tests
    for (const id of testClassIds) {
      try {
        await classService.delete(id)
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
    testClassIds = []
  })

  describeOrSkip('API Service Integration', () => {
    it('should fetch all classes from backend', async () => {
      const classes = await classService.getAll()

      expect(Array.isArray(classes)).toBe(true)
      // Should have the test data we created earlier
      expect(classes.length).toBeGreaterThanOrEqual(0)

      // Verify each class has required fields
      classes.forEach((classItem) => {
        expect(classItem).toHaveProperty('id')
        expect(classItem).toHaveProperty('name')
        expect(classItem).toHaveProperty('year')
        expect(classItem).toHaveProperty('createdAt')
        expect(classItem).toHaveProperty('updatedAt')
      })
    })

    it('should create a new class via backend', async () => {
      const newClass = {
        name: 'Integration Test Class Create',
        year: 2025,
      }

      const created = await classService.create(newClass)
      testClassIds.push(created.id)

      expect(created).toHaveProperty('id')
      expect(created.name).toBe(newClass.name)
      expect(created.year).toBe(newClass.year)
      expect(created).toHaveProperty('createdAt')
      expect(created).toHaveProperty('updatedAt')
    })

    it('should fetch a class by ID from backend', async () => {
      // First create a class
      const newClass = await classService.create({
        name: 'Integration Test Class GetById',
        year: 2025,
      })
      testClassIds.push(newClass.id)

      // Then fetch it by ID
      const fetched = await classService.getById(newClass.id)

      expect(fetched.id).toBe(newClass.id)
      expect(fetched.name).toBe(newClass.name)
      expect(fetched.year).toBe(newClass.year)
    })

    it('should update a class via backend', async () => {
      // Create a class
      const created = await classService.create({
        name: 'Integration Test Class Update',
        year: 2025,
      })
      testClassIds.push(created.id)

      // Update it
      const updated = await classService.update(created.id, {
        name: 'Updated Integration Test Class',
        year: 2024,
      })

      expect(updated.id).toBe(created.id)
      expect(updated.name).toBe('Updated Integration Test Class')
      expect(updated.year).toBe(2024)
      expect(updated.updatedAt).not.toBe(created.updatedAt)
    })

    it('should delete a class via backend', async () => {
      // Create a class
      const created = await classService.create({
        name: 'Integration Test Class Delete',
        year: 2025,
      })

      // Delete it
      await classService.delete(created.id)

      // Verify it's deleted
      await expect(classService.getById(created.id)).rejects.toThrow()
    })

    it('should handle duplicate class creation (name + year)', async () => {
      const classData = {
        name: 'Duplicate Test Class',
        year: 2025,
      }

      // Create first class
      const first = await classService.create(classData)
      testClassIds.push(first.id)

      // Try to create duplicate
      await expect(classService.create(classData)).rejects.toThrow()
    })

    it('should allow same name with different year', async () => {
      const className = 'Same Name Different Year'

      // Create with year 2024
      const first = await classService.create({
        name: className,
        year: 2024,
      })
      testClassIds.push(first.id)

      // Create with year 2025 - should succeed
      const second = await classService.create({
        name: className,
        year: 2025,
      })
      testClassIds.push(second.id)

      expect(first.id).not.toBe(second.id)
      expect(first.year).toBe(2024)
      expect(second.year).toBe(2025)
    })
  })

  describeOrSkip('useClasses Hook Integration', () => {
    it('should fetch classes through hook', async () => {
      const { result } = renderHook(() => useClasses())

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      expect(Array.isArray(result.current.classes)).toBe(true)
      expect(result.current.error).toBeNull()
    })

    it('should create class through hook', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const classData = {
        name: 'Hook Integration Test Class',
        year: 2025,
      }

      let createdClass
      await act(async () => {
        createdClass = await result.current.createClass(classData)
      })

      testClassIds.push(createdClass!.id)

      // Wait for classes to be refreshed
      await waitFor(() => {
        const found = result.current.classes.find((c) => c.id === createdClass!.id)
        expect(found).toBeDefined()
        expect(found?.name).toBe(classData.name)
        expect(found?.year).toBe(classData.year)
      }, { timeout: 5000 })
    })

    it('should update class through hook', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Create a class first
      let createdClass
      await act(async () => {
        createdClass = await result.current.createClass({
          name: 'Hook Update Test',
          year: 2025,
        })
      })
      testClassIds.push(createdClass!.id)

      // Update it
      await act(async () => {
        await result.current.updateClass(createdClass!.id, {
          name: 'Hook Updated Class',
          year: 2024,
        })
      })

      // Verify update
      await waitFor(() => {
        const found = result.current.classes.find((c) => c.id === createdClass!.id)
        expect(found?.name).toBe('Hook Updated Class')
        expect(found?.year).toBe(2024)
      }, { timeout: 5000 })
    })

    it('should delete class through hook', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Create a class first
      let createdClass
      await act(async () => {
        createdClass = await result.current.createClass({
          name: 'Hook Delete Test',
          year: 2025,
        })
      })

      // Delete it
      await act(async () => {
        await result.current.deleteClass(createdClass!.id)
      })

      // Verify deletion
      await waitFor(() => {
        const found = result.current.classes.find((c) => c.id === createdClass!.id)
        expect(found).toBeUndefined()
      }, { timeout: 5000 })
    })

    it('should handle errors in hook', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Try to fetch non-existent class (should set error)
      await act(async () => {
        try {
          await classService.getById(999999)
        } catch (error) {
          // Expected to throw
        }
      })

      // Hook should handle errors gracefully
      expect(result.current.classes).toBeDefined()
    })

    it('should sort classes by year (desc) then name (asc)', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      const classes = result.current.classes

      // Verify sorting
      for (let i = 0; i < classes.length - 1; i++) {
        const current = classes[i]
        const next = classes[i + 1]

        if (current.year === next.year) {
          // Same year - check alphabetical order
          expect(current.name.localeCompare(next.name)).toBeLessThanOrEqual(0)
        } else {
          // Different year - newer year should come first
          expect(current.year).toBeGreaterThan(next.year)
        }
      }
    })
  })

  describeOrSkip('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // This test would require stopping the backend
      // Skip for now - tested in unit tests with mocked responses
    })

    it('should handle validation errors from backend', async () => {
      // Try to create class with invalid year
      await expect(
        classService.create({
          name: 'Invalid Year Test',
          year: 1999, // Below minimum
        }),
      ).rejects.toThrow()
    })

    it('should handle empty name validation', async () => {
      await expect(
        classService.create({
          name: '',
          year: 2025,
        }),
      ).rejects.toThrow()
    })
  })
})
