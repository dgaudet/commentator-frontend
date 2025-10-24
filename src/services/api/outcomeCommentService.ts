/**
 * Outcome Comments API Service
 * Service for managing outcome comments with REST API operations
 * 
 * Endpoints:
 * - GET /outcome-comment?classId={classId} - Get all outcome comments for a class
 * - POST /outcome-comment - Create new outcome comment
 * - PUT /outcome-comment/{id} - Update existing outcome comment
 * - DELETE /outcome-comment/{id} - Delete outcome comment
 */

import { apiClient } from './apiClient'
import type { 
  OutcomeComment, 
  CreateOutcomeCommentRequest, 
  UpdateOutcomeCommentRequest
} from '../../types'

export const outcomeCommentService = {
  /**
   * Get all outcome comments for a specific class
   */
  async getByClassId(classId: number): Promise<OutcomeComment[]> {
    try {
      const response = await apiClient.get<OutcomeComment[]>(
        `/outcome-comment?classId=${classId}`
      )
      return response.data
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
      const response = await apiClient.post<OutcomeComment>(
        `/outcome-comment`,
        { 
          comment: request.comment,
          upperRange: request.upperRange,
          lowerRange: request.lowerRange,
          classId: request.classId
        }
      )
      return response.data
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
      const response = await apiClient.put<OutcomeComment>(
        `/outcome-comment/${id}`,
        request
      )
      return response.data
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
      await apiClient.delete(`/outcome-comment/${id}`)
    } catch (error) {
      console.error('Failed to delete outcome comment:', error)
      throw new Error('Failed to delete outcome comment')
    }
  }
}