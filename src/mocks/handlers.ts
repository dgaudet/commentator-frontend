/**
 * Mock Service Worker (MSW) Request Handlers
 * Defines mock API responses for testing
 *
 * Implements all 5 class endpoints with proper validation and error handling
 * Reference: TASK-1.4
 */
import { http, HttpResponse } from 'msw'
import { mockClasses } from './data/classes'
import { Class } from '../types/Class'

const BASE_URL = 'http://localhost:3000'

// In-memory storage for test data (resets between test runs)
const classes: Class[] = [...mockClasses]
let nextId = 4

interface ValidationResult {
  valid: boolean
  error?: {
    error: string
    message: string
    statusCode: number
    details?: Record<string, string[]>
  }
}

/**
 * Validation helper: Check if name and year are provided
 */
function validateClassRequest(body: Record<string, unknown>): ValidationResult {
  const name = body.name
  const year = body.year

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Class name is required',
        statusCode: 400,
        details: { name: ['Class name is required'] },
      },
    }
  }

  if (!year || typeof year !== 'number') {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Academic year is required',
        statusCode: 400,
        details: { year: ['Academic year is required'] },
      },
    }
  }

  if (year < 2000 || year > 2099) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Academic year must be between 2000 and 2099',
        statusCode: 400,
        details: { year: ['Academic year must be between 2000 and 2099'] },
      },
    }
  }

  return { valid: true }
}

/**
 * Validation helper: Check if ID is valid number
 */
function validateId(id: string): ValidationResult {
  const numId = Number(id)
  if (isNaN(numId) || !Number.isInteger(numId)) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Invalid ID format',
        statusCode: 400,
      },
    }
  }
  return { valid: true }
}

/**
 * API request handlers for Class endpoints
 */
export const handlers = [
  // GET /class - List all classes
  http.get(`${BASE_URL}/class`, () => {
    return HttpResponse.json(classes)
  }),

  // POST /class - Create new class
  http.post(`${BASE_URL}/class`, async ({ request }) => {
    const body = await request.json() as { name: string; year: number }

    // Validate request
    const validation = validateClassRequest(body)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Create new class
    const newClass: Class = {
      id: nextId++,
      name: body.name,
      year: body.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    classes.push(newClass)
    return HttpResponse.json(newClass, { status: 201 })
  }),

  // GET /class/:id - Get class by ID
  http.get(`${BASE_URL}/class/:id`, ({ params }) => {
    const { id } = params

    // Validate ID
    const validation = validateId(id as string)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Find class
    const classItem = classes.find((c) => c.id === Number(id))
    if (!classItem) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Class not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(classItem)
  }),

  // PUT /class/:id - Update class
  http.put(`${BASE_URL}/class/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { name: string; year: number }

    // Validate ID
    const idValidation = validateId(id as string)
    if (!idValidation.valid) {
      return HttpResponse.json(idValidation.error, { status: 400 })
    }

    // Validate request body
    const bodyValidation = validateClassRequest(body)
    if (!bodyValidation.valid) {
      return HttpResponse.json(bodyValidation.error, { status: 400 })
    }

    // Find class
    const classIndex = classes.findIndex((c) => c.id === Number(id))
    if (classIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Class not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Update class
    const updatedClass: Class = {
      ...classes[classIndex],
      name: body.name,
      year: body.year,
      updatedAt: new Date().toISOString(),
    }

    classes[classIndex] = updatedClass
    return HttpResponse.json(updatedClass)
  }),

  // DELETE /class/:id - Delete class
  http.delete(`${BASE_URL}/class/:id`, ({ params }) => {
    const { id } = params

    // Validate ID
    const validation = validateId(id as string)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Find class
    const classIndex = classes.findIndex((c) => c.id === Number(id))
    if (classIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Class not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Delete class
    const deletedClass = classes[classIndex]
    classes.splice(classIndex, 1)

    return HttpResponse.json({
      message: 'Class deleted successfully',
      deletedClass,
    })
  }),
]
