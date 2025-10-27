/**
 * Mock Service Worker (MSW) Request Handlers
 * Defines mock API responses for testing
 *
 * Implements Subject endpoints (US-REFACTOR-012)
 * Key Difference: Subject has NO year field, only name validation
 *
 * Related: TD-003 (Class infrastructure removed)
 */
import { http, HttpResponse } from 'msw'
import { mockSubjects } from './data/subjects'
import { mockPersonalizedComments } from './data/personalizedComments'
import { Subject } from '../types/Subject'
import { OutcomeComment } from '../types/OutcomeComment'
import { PersonalizedComment } from '../types/PersonalizedComment'

const BASE_URL = 'http://localhost:3000'

// In-memory storage for test data (resets between test runs)
const subjects: Subject[] = [...mockSubjects]
let nextSubjectId = 4

// Reset function for test isolation
export function resetMockData() {
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

// Mock personalized comments storage
const personalizedComments: PersonalizedComment[] = [...mockPersonalizedComments]
let nextPersonalizedCommentId = 4

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
 * API request handlers for Subject and OutcomeComment endpoints
 * Related: TD-003 (Class infrastructure removed)
 */
export const handlers = [
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

  // ==================== PERSONALIZED COMMENT ENDPOINTS ====================

  // GET /personalized-comment?subjectId={subjectId} - Get personalized comments for a subject
  http.get(`${BASE_URL}/personalized-comment`, ({ request }) => {
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
    const numId = Number(subjectId)
    if (isNaN(numId) || !Number.isInteger(numId)) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Invalid ID format',
        statusCode: 400,
      }, { status: 400 })
    }

    // Filter comments for this subject
    const subjectComments = personalizedComments.filter(comment => comment.subjectId === numId)
    return HttpResponse.json(subjectComments)
  }),

  // POST /personalized-comment - Create new personalized comment
  http.post(`${BASE_URL}/personalized-comment`, async ({ request }) => {
    const body = await request.json() as { subjectId: number; comment: string }

    // Validate comment text
    if (!body.comment || typeof body.comment !== 'string' || body.comment.trim() === '') {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Comment is required',
        statusCode: 400,
        details: { comment: ['Comment is required'] },
      }, { status: 400 })
    }

    const trimmedComment = body.comment.trim()

    if (trimmedComment.length < 10) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Comment must be at least 10 characters',
        statusCode: 400,
        details: { comment: ['Comment must be at least 10 characters'] },
      }, { status: 400 })
    }

    if (trimmedComment.length > 500) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Comment cannot exceed 500 characters',
        statusCode: 400,
        details: { comment: ['Comment cannot exceed 500 characters'] },
      }, { status: 400 })
    }

    // Validate subject ID
    if (!body.subjectId || typeof body.subjectId !== 'number' || !Number.isInteger(body.subjectId)) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Valid subject ID is required',
        statusCode: 400,
        details: { subjectId: ['Valid subject ID is required'] },
      }, { status: 400 })
    }

    // Check for duplicate comment (case-insensitive)
    const isDuplicate = personalizedComments.some(
      c => c.subjectId === body.subjectId && c.comment.toLowerCase() === trimmedComment.toLowerCase(),
    )

    if (isDuplicate) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'This comment already exists for this subject',
        statusCode: 400,
        details: { comment: ['This comment already exists for this subject'] },
      }, { status: 400 })
    }

    // Create new comment
    const newComment: PersonalizedComment = {
      id: nextPersonalizedCommentId++,
      comment: trimmedComment,
      subjectId: body.subjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    personalizedComments.push(newComment)
    return HttpResponse.json(newComment, { status: 201 })
  }),

  // PUT /personalized-comment/:id - Update personalized comment
  http.put(`${BASE_URL}/personalized-comment/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { comment: string }

    // Validate ID
    const numId = Number(id)
    if (isNaN(numId) || !Number.isInteger(numId)) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Invalid ID format',
        statusCode: 400,
      }, { status: 400 })
    }

    // Find comment
    const commentIndex = personalizedComments.findIndex((c) => c.id === numId)
    if (commentIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Personalized comment not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Validate comment text
    if (!body.comment || typeof body.comment !== 'string' || body.comment.trim() === '') {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Comment is required',
        statusCode: 400,
        details: { comment: ['Comment is required'] },
      }, { status: 400 })
    }

    const trimmedComment = body.comment.trim()

    if (trimmedComment.length < 10) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Comment must be at least 10 characters',
        statusCode: 400,
        details: { comment: ['Comment must be at least 10 characters'] },
      }, { status: 400 })
    }

    if (trimmedComment.length > 500) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Comment cannot exceed 500 characters',
        statusCode: 400,
        details: { comment: ['Comment cannot exceed 500 characters'] },
      }, { status: 400 })
    }

    // Check for duplicate comment (case-insensitive, excluding current comment)
    const isDuplicate = personalizedComments.some(
      c => c.id !== numId && c.subjectId === personalizedComments[commentIndex].subjectId &&
           c.comment.toLowerCase() === trimmedComment.toLowerCase(),
    )

    if (isDuplicate) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'This comment already exists for this subject',
        statusCode: 400,
        details: { comment: ['This comment already exists for this subject'] },
      }, { status: 400 })
    }

    // Update comment
    const updatedComment: PersonalizedComment = {
      ...personalizedComments[commentIndex],
      comment: trimmedComment,
      updatedAt: new Date().toISOString(),
    }

    personalizedComments[commentIndex] = updatedComment
    return HttpResponse.json(updatedComment)
  }),

  // DELETE /personalized-comment/:id - Delete personalized comment
  http.delete(`${BASE_URL}/personalized-comment/:id`, ({ params }) => {
    const { id } = params

    // Validate ID
    const numId = Number(id)
    if (isNaN(numId) || !Number.isInteger(numId)) {
      return HttpResponse.json({
        error: 'Bad Request',
        message: 'Invalid ID format',
        statusCode: 400,
      }, { status: 400 })
    }

    // Find comment
    const commentIndex = personalizedComments.findIndex((c) => c.id === numId)
    if (commentIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Personalized comment not found',
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Delete comment
    const deletedComment = personalizedComments[commentIndex]
    personalizedComments.splice(commentIndex, 1)

    return HttpResponse.json({
      message: 'Personalized comment deleted successfully',
      deletedComment,
    })
  }),
]
