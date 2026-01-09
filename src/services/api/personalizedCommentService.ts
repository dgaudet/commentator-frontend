/**
 * Personalized Comments API Service
 * Service for managing personalized comments with REST API operations
 *
 * Simpler than OutcomeComment service - no upperRange/lowerRange fields
 *
 * Endpoints:
 * - GET /personalized-comment?subjectId={subjectId} - Get all personalized comments for a subject
 * - POST /personalized-comment - Create new personalized comment
 * - PUT /personalized-comment/{id} - Update existing personalized comment
 * - DELETE /personalized-comment/{id} - Delete personalized comment
 * - POST /personalized-comment/copy - Copy comments from one subject to another (US-CP-004)
 */

import { apiClient } from '../apiClient'
import type {
  PersonalizedComment,
  CreatePersonalizedCommentRequest,
  UpdatePersonalizedCommentRequest,
} from '../../types'

export const personalizedCommentService = {
  /**
   * Get all personalized comments for a specific subject
   * @param subjectId - The string ID of the subject to fetch comments for
   */
  async getBySubjectId(subjectId: string): Promise<PersonalizedComment[]> {
    try {
      const response = await apiClient.get<PersonalizedComment[]>(
        `/personalized-comment?subjectId=${subjectId}`,
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch personalized comments:', error)
      throw new Error('Failed to fetch personalized comments for subject')
    }
  },

  /**
   * Create a new personalized comment for a subject
   */
  async create(request: CreatePersonalizedCommentRequest): Promise<PersonalizedComment> {
    try {
      const response = await apiClient.post<PersonalizedComment>(
        '/personalized-comment',
        {
          comment: request.comment,
          subjectId: request.subjectId,
          rating: request.rating, // US-RATING-003: Include rating field
        },
      )
      return response.data
    } catch (error) {
      console.error('Failed to create personalized comment:', error)
      throw new Error('Failed to create personalized comment')
    }
  },

  /**
   * Update an existing personalized comment
   * Note: subjectId is immutable and cannot be changed, but backend requires it for validation
   * @param id - The string ID of the personalized comment to update
   */
  async update(id: string, request: UpdatePersonalizedCommentRequest): Promise<PersonalizedComment> {
    try {
      const response = await apiClient.put<PersonalizedComment>(
        `/personalized-comment/${id}`,
        {
          subjectId: request.subjectId,
          comment: request.comment,
          rating: request.rating, // US-RATING-003: Include rating field
        },
      )
      return response.data
    } catch (error) {
      console.error('Failed to update personalized comment:', error)
      throw new Error('Failed to update personalized comment')
    }
  },

  /**
   * Delete a personalized comment
   * @param id - The string ID of the personalized comment to delete
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/personalized-comment/${id}`)
    } catch (error) {
      console.error('Failed to delete personalized comment:', error)
      throw new Error('Failed to delete personalized comment')
    }
  },

  /**
   * Copy personalized comments from one subject to another
   * Reference: US-CP-004 - Implement Copy API Integration with Feedback
   * @param subjectFromId - ObjectId of source subject
   * @param subjectToId - ObjectId of target subject
   * @param overwrite - Whether to overwrite (true) or append (false) comments
   * @returns Array of PersonalizedComment objects that were copied
   */
  async copy(request: {
    subjectFromId: string
    subjectToId: string
    overwrite: boolean
  }): Promise<PersonalizedComment[]> {
    try {
      const response = await apiClient.post<PersonalizedComment[]>(
        '/personalized-comment/copy',
        request,
      )
      return response.data
    } catch (error) {
      console.error('Failed to copy personalized comments:', error)
      throw new Error('Failed to copy personalized comments')
    }
  },
}
