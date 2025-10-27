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
 */

import { apiClient } from './apiClient'
import type {
  PersonalizedComment,
  CreatePersonalizedCommentRequest,
  UpdatePersonalizedCommentRequest,
} from '../../types'

export const personalizedCommentService = {
  /**
   * Get all personalized comments for a specific subject
   * @param subjectId - The ID of the subject to fetch comments for
   */
  async getBySubjectId(subjectId: number): Promise<PersonalizedComment[]> {
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
   */
  async update(id: number, request: UpdatePersonalizedCommentRequest): Promise<PersonalizedComment> {
    try {
      const response = await apiClient.put<PersonalizedComment>(
        `/personalized-comment/${id}`,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Failed to update personalized comment:', error)
      throw new Error('Failed to update personalized comment')
    }
  },

  /**
   * Delete a personalized comment
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/personalized-comment/${id}`)
    } catch (error) {
      console.error('Failed to delete personalized comment:', error)
      throw new Error('Failed to delete personalized comment')
    }
  },
}
