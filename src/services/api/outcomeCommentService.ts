/**
 * Outcome Comments API Service
 * Service for managing outcome comments with REST API operations
 *
 * Related: TD-002 (OutcomeComment classId → subjectId Migration)
 * Change: API now uses subjectId parameter instead of classId
 *
 * Endpoints:
 * - GET /outcome-comment?subjectId={subjectId} - Get all outcome comments for a subject
 * - POST /outcome-comment - Create new outcome comment
 * - PUT /outcome-comment/{id} - Update existing outcome comment
 * - DELETE /outcome-comment/{id} - Delete outcome comment
 */

import { apiClient } from '../apiClient'
import type {
  OutcomeComment,
  CreateOutcomeCommentRequest,
  UpdateOutcomeCommentRequest,
} from '../../types'

export const outcomeCommentService = {
  /**
   * Get all outcome comments for a specific subject
   * @param subjectId - The string ID of the subject to fetch comments for
   */
  async getBySubjectId(subjectId: string): Promise<OutcomeComment[]> {
    try {
      const response = await apiClient.get<OutcomeComment[]>(
        `/outcome-comment?subjectId=${subjectId}`,
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch outcome comments:', error)
      throw new Error('Failed to fetch outcome comments for subject')
    }
  },

  /**
   * Create a new outcome comment for a subject
   */
  async create(request: CreateOutcomeCommentRequest): Promise<OutcomeComment> {
    try {
      const response = await apiClient.post<OutcomeComment>(
        '/outcome-comment',
        {
          comment: request.comment,
          upperRange: request.upperRange,
          lowerRange: request.lowerRange,
          subjectId: request.subjectId,
        },
      )
      return response.data
    } catch (error) {
      console.error('Failed to create outcome comment:', error)
      throw new Error('Failed to create outcome comment')
    }
  },

  /**
   * Update an existing outcome comment
   * @param id - The string ID of the outcome comment to update
   */
  async update(id: string, request: UpdateOutcomeCommentRequest): Promise<OutcomeComment> {
    try {
      const response = await apiClient.put<OutcomeComment>(
        `/outcome-comment/${id}`,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Failed to update outcome comment:', error)
      throw new Error('Failed to update outcome comment')
    }
  },

  /**
   * Delete an outcome comment
   * @param id - The string ID of the outcome comment to delete
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/outcome-comment/${id}`)
    } catch (error) {
      console.error('Failed to delete outcome comment:', error)
      throw new Error('Failed to delete outcome comment')
    }
  },
}
