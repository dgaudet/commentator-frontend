/**
 * Outcome Comments API Service
 * Service for managing outcome comments with REST API operations
 * 
 * Endpoints:
 * - GET /classes/:classId/outcome-comments - Get all outcome comments for a class
 * - POST /classes/:classId/outcome-comments - Create new outcome comment
 * - PUT /outcome-comments/:id - Update existing outcome comment
 * - DELETE /outcome-comments/:id - Delete outcome comment
 */

import { apiClient } from './apiClient'
import type { 
  OutcomeComment, 
  CreateOutcomeCommentRequest, 
  UpdateOutcomeCommentRequest,
  ApiResponse 
} from '../../types'

export const outcomeCommentService = {
  /**
   * Get all outcome comments for a specific class
   */
  async getByClassId(classId: number): Promise<OutcomeComment[]> {
    try {
      const response = await apiClient.get<ApiResponse<OutcomeComment[]>>(
        `/classes/${classId}/outcome-comments`
      )
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch outcome comments:', error)
      throw new Error('Failed to fetch outcome comments')
    }
  },

  /**
   * Create a new outcome comment for a class
   */
  async create(request: CreateOutcomeCommentRequest): Promise<OutcomeComment> {
    try {
      const response = await apiClient.post<ApiResponse<OutcomeComment>>(
        `/classes/${request.classId}/outcome-comments`,
        { 
          comment: request.comment,
          upperRange: request.upperRange,
          lowerRange: request.lowerRange
        }
      )
      return response.data.data
    } catch (error) {
      console.error('Failed to create outcome comment:', error)
      throw new Error('Failed to create outcome comment')
    }
  },

  /**
   * Update an existing outcome comment
   */
  async update(id: number, request: UpdateOutcomeCommentRequest): Promise<OutcomeComment> {
    try {
      const response = await apiClient.put<ApiResponse<OutcomeComment>>(
        `/outcome-comments/${id}`,
        request
      )
      return response.data.data
    } catch (error) {
      console.error('Failed to update outcome comment:', error)
      throw new Error('Failed to update outcome comment')
    }
  },

  /**
   * Delete an outcome comment
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/outcome-comments/${id}`)
    } catch (error) {
      console.error('Failed to delete outcome comment:', error)
      throw new Error('Failed to delete outcome comment')
    }
  }
}