/**
 * Final Comments API Service
 * TDD Phase: GREEN - Implementing service to pass tests
 * Service for managing final comments with REST API operations
 *
 * User Stories: US-FINAL-001, US-FINAL-002, US-FINAL-003
 *
 * Endpoints:
 * - GET /final-comment?classId={classId} - Get all final comments for a class
 * - POST /final-comment - Create new final comment
 * - PUT /final-comment/{id} - Update existing final comment
 * - DELETE /final-comment/{id} - Delete final comment
 */

import { apiClient } from '../apiClient'
import type {
  FinalComment,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
} from '../../types'

export const finalCommentService = {
  /**
   * Get all final comments for a specific class
   * @param classId - The ID of the class to fetch comments for
   */
  async getByClassId(classId: number): Promise<FinalComment[]> {
    try {
      const response = await apiClient.get<FinalComment[]>(
        `/final-comment?classId=${classId}`,
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch final comments:', error)
      throw new Error('Failed to fetch final comments for class')
    }
  },

  /**
   * Create a new final comment for a student in a class
   */
  async create(request: CreateFinalCommentRequest): Promise<FinalComment> {
    try {
      const response = await apiClient.post<FinalComment>(
        '/final-comment',
        request,
      )
      return response.data
    } catch (error) {
      console.error('Failed to create final comment:', error)
      throw new Error('Failed to create final comment')
    }
  },

  /**
   * Update an existing final comment
   */
  async update(id: number, request: UpdateFinalCommentRequest): Promise<FinalComment> {
    try {
      const response = await apiClient.put<FinalComment>(
        `/final-comment/${id}`,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Failed to update final comment:', error)
      throw new Error('Failed to update final comment')
    }
  },

  /**
   * Delete a final comment
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/final-comment/${id}`)
    } catch (error) {
      console.error('Failed to delete final comment:', error)
      throw new Error('Failed to delete final comment')
    }
  },
}
