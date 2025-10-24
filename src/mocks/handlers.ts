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
import { OutcomeComment } from '../types/OutcomeComment'

const BASE_URL = 'http://localhost:3000'

// In-memory storage for test data (resets between test runs)
const classes: Class[] = [...mockClasses]
let nextId = 4

// Reset function for test isolation
export function resetMockData() {
  classes.length = 0
  classes.push(...mockClasses)
  nextId = 4
}

// Mock outcome comments storage
const outcomeComments: OutcomeComment[] = [
  {
    id: 1,
    classId: 1,
    comment: 'Students demonstrated excellent problem-solving skills',
    upperRange: 85,
    lowerRange: 70,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    classId: 1,
    comment: 'Strong collaboration and teamwork observed',
    upperRange: 90,
    lowerRange: 75,
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
  },
]
let nextCommentId = 3

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
 * Validation helper: Check if outcome comment request is valid
 */
function validateOutcomeCommentRequest(body: Record<string, unknown>): ValidationResult {
  const { comment, upperRange, lowerRange, classId } = body

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Comment is required',
        statusCode: 400,
        details: { comment: ['Comment is required'] },
      },
    }
  }

  if (upperRange === undefined || typeof upperRange !== 'number' || upperRange < 0 || upperRange > 100) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Upper range is required and must be between 0 and 100',
        statusCode: 400,
        details: { upperRange: ['Upper range is required and must be between 0 and 100'] },
      },
    }
  }

  if (lowerRange === undefined || typeof lowerRange !== 'number' || lowerRange < 0 || lowerRange > 100) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Lower range is required and must be between 0 and 100',
        statusCode: 400,
        details: { lowerRange: ['Lower range is required and must be between 0 and 100'] },
      },
    }
  }

  if (lowerRange > upperRange) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Lower range cannot be greater than upper range',
        statusCode: 400,
        details: { lowerRange: ['Lower range cannot be greater than upper range'] },
      },
    }
  }

  if (classId !== undefined && (typeof classId !== 'number' || !Number.isInteger(classId))) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Valid class ID is required',
        statusCode: 400,
        details: { classId: ['Valid class ID is required'] },
      },
    }
  }

  return { valid: true }
}

function validateOutcomeCommentUpdateRequest(body: Record<string, unknown>): ValidationResult {
  const { comment, upperRange, lowerRange, classId } = body

  if (comment !== undefined && (typeof comment !== 'string' || comment.trim() === '')) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Comment must be a non-empty string',
        statusCode: 400,
        details: { comment: ['Comment must be a non-empty string'] },
      },
    }
  }

  if (upperRange !== undefined && (typeof upperRange !== 'number' || upperRange < 0 || upperRange > 100)) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Upper range must be between 0 and 100',
        statusCode: 400,
        details: { upperRange: ['Upper range must be between 0 and 100'] },
      },
    }
  }

  if (lowerRange !== undefined && (typeof lowerRange !== 'number' || lowerRange < 0 || lowerRange > 100)) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Lower range must be between 0 and 100',
        statusCode: 400,
        details: { lowerRange: ['Lower range must be between 0 and 100'] },
      },
    }
  }

  if (upperRange !== undefined && lowerRange !== undefined && lowerRange > upperRange) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Lower range cannot be greater than upper range',
        statusCode: 400,
        details: { lowerRange: ['Lower range cannot be greater than upper range'] },
      },
    }
  }

  if (classId !== undefined && (typeof classId !== 'number' || !Number.isInteger(classId))) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Valid class ID is required',
        statusCode: 400,
        details: { classId: ['Valid class ID is required'] },
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

  // GET /outcome-comment?classId={classId} - Get outcome comments for a class
  http.get(`${BASE_URL}/outcome-comment`, ({ request }) => {
    const url = new URL(request.url)
    const classId = url.searchParams.get('classId')

    if (!classId) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Class ID is required',
        statusCode: 400,
      }, { status: 400 })
    }

    // Validate class ID
    const validation = validateId(classId)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Filter comments for this class
    const classComments = outcomeComments.filter(comment => comment.classId === Number(classId))
    return HttpResponse.json(classComments)
  }),

  // POST /outcome-comment - Create new outcome comment
  http.post(`${BASE_URL}/outcome-comment`, async ({ request }) => {
    const body = await request.json() as { classId: number; comment: string; upperRange: number; lowerRange: number }

    // Validate request body
    const validation = validateOutcomeCommentRequest(body)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Validate class ID
    const classValidation = validateId(String(body.classId))
    if (!classValidation.valid) {
      return HttpResponse.json(classValidation.error, { status: 400 })
    }

    // Create new comment
    const newComment: OutcomeComment = {
      id: nextCommentId++,
      classId: body.classId,
      comment: body.comment,
      upperRange: body.upperRange,
      lowerRange: body.lowerRange,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    outcomeComments.push(newComment)
    return HttpResponse.json(newComment, { status: 201 })
  }),

  // PUT /outcome-comment/:id - Update outcome comment
  http.put(`${BASE_URL}/outcome-comment/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { comment?: string; upperRange?: number; lowerRange?: number }

    // Validate ID
    const idValidation = validateId(id as string)
    if (!idValidation.valid) {
      return HttpResponse.json(idValidation.error, { status: 400 })
    }

    // Find comment
    const commentIndex = outcomeComments.findIndex((c) => c.id === Number(id))
    if (commentIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Outcome comment not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Validate request body (if provided)
    if (Object.keys(body).length > 0) {
      const bodyValidation = validateOutcomeCommentUpdateRequest(body)
      if (!bodyValidation.valid) {
        return HttpResponse.json(bodyValidation.error, { status: 400 })
      }
    }

    // Update comment
    const updatedComment: OutcomeComment = {
      ...outcomeComments[commentIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    outcomeComments[commentIndex] = updatedComment
    return HttpResponse.json(updatedComment)
  }),

  // DELETE /outcome-comment/:id - Delete outcome comment
  http.delete(`${BASE_URL}/outcome-comment/:id`, ({ params }) => {
    const { id } = params

    // Validate ID
    const validation = validateId(id as string)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Find comment
    const commentIndex = outcomeComments.findIndex((c) => c.id === Number(id))
    if (commentIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Outcome comment not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Delete comment
    const deletedComment = outcomeComments[commentIndex]
    outcomeComments.splice(commentIndex, 1)

    return HttpResponse.json({
      message: 'Outcome comment deleted successfully',
      deletedComment,
    })
  }),
]
