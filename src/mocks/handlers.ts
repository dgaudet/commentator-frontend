/**
 * Mock Service Worker (MSW) Request Handlers
 * Defines mock API responses for testing
 *
 * Implements all 5 class endpoints with proper validation and error handling
 * Reference: TASK-1.4
 *
 * Also implements Subject endpoints (US-REFACTOR-012)
 * Key Difference: Subject has NO year field, only name validation
 */
import { http, HttpResponse } from 'msw'
import { mockClasses } from './data/classes'
import { mockSubjects } from './data/subjects'
import { Class } from '../types/Class'
import { Subject } from '../types/Subject'
import { OutcomeComment } from '../types/OutcomeComment'

const BASE_URL = 'http://localhost:3000'

// In-memory storage for test data (resets between test runs)
const classes: Class[] = [...mockClasses]
let nextClassId = 4

const subjects: Subject[] = [...mockSubjects]
let nextSubjectId = 4

// Reset function for test isolation
export function resetMockData() {
  classes.length = 0
  classes.push(...mockClasses)
  nextClassId = 4

  subjects.length = 0
  subjects.push(...mockSubjects)
  nextSubjectId = 4
}

// Mock outcome comments storage
// Related: TD-002 (OutcomeComment classId → subjectId Migration)
const outcomeComments: OutcomeComment[] = [
  {
    id: 1,
    subjectId: 1,
    comment: 'Students demonstrated excellent problem-solving skills',
    upperRange: 85,
    lowerRange: 70,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    subjectId: 1,
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
 * Validation helper: Check if subject name is valid (NO year field)
 */
function validateSubjectRequest(body: Record<string, unknown>): ValidationResult {
  const name = body.name

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Subject name is required',
        statusCode: 400,
        details: { name: ['Subject name is required'] },
      },
    }
  }

  if (name.length > 100) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Subject name must be between 1 and 100 characters',
        statusCode: 400,
        details: { name: ['Subject name must be between 1 and 100 characters'] },
      },
    }
  }

  return { valid: true }
}

/**
 * Validation helper: Check if outcome comment request is valid
 */
function validateOutcomeCommentRequest(body: Record<string, unknown>): ValidationResult {
  const { comment, upperRange, lowerRange, subjectId } = body

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

  if (subjectId !== undefined && (typeof subjectId !== 'number' || !Number.isInteger(subjectId))) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Valid subject ID is required',
        statusCode: 400,
        details: { subjectId: ['Valid subject ID is required'] },
      },
    }
  }

  return { valid: true }
}

function validateOutcomeCommentUpdateRequest(body: Record<string, unknown>): ValidationResult {
  const { comment, upperRange, lowerRange, subjectId } = body

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

  if (subjectId !== undefined && (typeof subjectId !== 'number' || !Number.isInteger(subjectId))) {
    return {
      valid: false,
      error: {
        error: 'Bad Request',
        message: 'Valid subject ID is required',
        statusCode: 400,
        details: { subjectId: ['Valid subject ID is required'] },
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
      id: nextClassId++,
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

  // GET /outcome-comment?subjectId={subjectId} - Get outcome comments for a subject
  // Related: TD-002 (OutcomeComment classId → subjectId Migration)
  http.get(`${BASE_URL}/outcome-comment`, ({ request }) => {
    const url = new URL(request.url)
    const subjectId = url.searchParams.get('subjectId')

    if (!subjectId) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Subject ID is required',
        statusCode: 400,
      }, { status: 400 })
    }

    // Validate subject ID
    const validation = validateId(subjectId)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Filter comments for this subject
    const subjectComments = outcomeComments.filter(comment => comment.subjectId === Number(subjectId))
    return HttpResponse.json(subjectComments)
  }),

  // POST /outcome-comment - Create new outcome comment
  http.post(`${BASE_URL}/outcome-comment`, async ({ request }) => {
    const body = await request.json() as { subjectId: number; comment: string; upperRange: number; lowerRange: number }

    // Validate request body
    const validation = validateOutcomeCommentRequest(body)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Validate subject ID
    const subjectValidation = validateId(String(body.subjectId))
    if (!subjectValidation.valid) {
      return HttpResponse.json(subjectValidation.error, { status: 400 })
    }

    // Create new comment
    const newComment: OutcomeComment = {
      id: nextCommentId++,
      subjectId: body.subjectId,
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

  // ==================== SUBJECT ENDPOINTS ====================
  // Subject has NO year field - only id, name, createdAt, updatedAt

  // GET /subject - List all subjects
  http.get(`${BASE_URL}/subject`, () => {
    return HttpResponse.json(subjects)
  }),

  // POST /subject - Create new subject (name only, no year)
  http.post(`${BASE_URL}/subject`, async ({ request }) => {
    const body = await request.json() as { name: string }

    // Validate request (name only)
    const validation = validateSubjectRequest(body)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Create new subject
    const newSubject: Subject = {
      id: nextSubjectId++,
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    subjects.push(newSubject)
    return HttpResponse.json(newSubject, { status: 201 })
  }),

  // GET /subject/:id - Get subject by ID
  http.get(`${BASE_URL}/subject/:id`, ({ params }) => {
    const { id } = params

    // Validate ID
    const validation = validateId(id as string)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Find subject
    const subject = subjects.find((s) => s.id === Number(id))
    if (!subject) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Subject not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(subject)
  }),

  // PUT /subject/:id - Update subject (name only)
  http.put(`${BASE_URL}/subject/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { name: string }

    // Validate ID
    const idValidation = validateId(id as string)
    if (!idValidation.valid) {
      return HttpResponse.json(idValidation.error, { status: 400 })
    }

    // Validate request body
    const bodyValidation = validateSubjectRequest(body)
    if (!bodyValidation.valid) {
      return HttpResponse.json(bodyValidation.error, { status: 400 })
    }

    // Find subject
    const subjectIndex = subjects.findIndex((s) => s.id === Number(id))
    if (subjectIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Subject not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Update subject
    const updatedSubject: Subject = {
      ...subjects[subjectIndex],
      name: body.name,
      updatedAt: new Date().toISOString(),
    }

    subjects[subjectIndex] = updatedSubject
    return HttpResponse.json(updatedSubject)
  }),

  // DELETE /subject/:id - Delete subject
  http.delete(`${BASE_URL}/subject/:id`, ({ params }) => {
    const { id } = params

    // Validate ID
    const validation = validateId(id as string)
    if (!validation.valid) {
      return HttpResponse.json(validation.error, { status: 400 })
    }

    // Find subject
    const subjectIndex = subjects.findIndex((s) => s.id === Number(id))
    if (subjectIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Subject not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Delete subject
    const deletedSubject = subjects[subjectIndex]
    subjects.splice(subjectIndex, 1)

    return HttpResponse.json({
      message: 'Subject deleted successfully',
      deletedSubject,
    })
  }),
]
