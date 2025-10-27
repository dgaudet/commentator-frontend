/**
 * Class API Service
 * Service for managing classes with REST API operations
 *
 * Endpoints:
 * - GET /class?subjectId={subjectId} - Get all classes for a subject
 * - POST /class - Create new class
 * - PUT /class/{id} - Update existing class
 * - DELETE /class/{id} - Delete class
 */

import { apiClient } from './apiClient'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../../types'

export const classService = {
  /**
   * Get all classes for a specific subject
   * @param subjectId - The ID of the subject to fetch classes for
   */
  async getBySubjectId(subjectId: number): Promise<Class[]> {
    try {
      const response = await apiClient.get<Class[]>(`/class?subjectId=${subjectId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      throw new Error('Failed to fetch classes for subject')
    }
  },

  /**
   * Create a new class for a subject
   */
  async create(request: CreateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.post<Class>('/class', request)
      return response.data
    } catch (error) {
      console.error('Failed to create class:', error)
      throw new Error('Failed to create class')
    }
  },

  /**
   * Update an existing class
   */
  async update(id: number, request: UpdateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.put<Class>(`/class/${id}`, request)
      return response.data
    } catch (error) {
      console.error('Failed to update class:', error)
      throw new Error('Failed to update class')
    }
  },

  /**
   * Delete a class
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/class/${id}`)
    } catch (error) {
      console.error('Failed to delete class:', error)
      throw new Error('Failed to delete class')
    }
  },
}
