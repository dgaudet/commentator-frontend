/**
 * Subject Service - CRUD Operations
 * Consumes backend Subject API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 *
 * API Change: /class → /subject
 * Entity Change: Subject no longer has year field
 *
 * All endpoints return direct responses (not wrapped in ApiResponse<T>)
 */
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../../types/Subject'
import { apiClient } from './apiClient'

/**
 * Service for subject-related API operations
 */
export const subjectService = {
  /**
   * Fetch all subjects
   * Maps to: GET /subject
   *
   * @returns Promise<Subject[]> List of subjects (direct array response)
   * @throws ApiError on failure
   */
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get<Subject[]>('/subject')
    return response.data
  },

  /**
   * Fetch single subject by ID
   * Maps to: GET /subject/:id
   *
   * @param id - Subject ID (integer)
   * @returns Promise<Subject> Subject details (direct object response)
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async getById(id: number): Promise<Subject> {
    const response = await apiClient.get<Subject>(`/subject/${id}`)
    return response.data
  },

  /**
   * Create new subject
   * Maps to: POST /subject
   *
   * @param data - Subject creation data {name} (no year field)
   * @returns Promise<Subject> Created subject with auto-generated ID (direct object response)
   * @throws ApiError on failure (400 validation errors)
   */
  async create(data: CreateSubjectRequest): Promise<Subject> {
    const response = await apiClient.post<Subject>('/subject', data)
    return response.data
  },

  /**
   * Update existing subject
   * Maps to: PUT /subject/:id
   *
   * @param id - Subject ID (integer)
   * @param data - Updated subject data {name} (no year field)
   * @returns Promise<Subject> Updated subject (direct object response)
   * @throws ApiError on failure (400 validation, 404 not found)
   */
  async update(id: number, data: UpdateSubjectRequest): Promise<Subject> {
    const response = await apiClient.put<Subject>(`/subject/${id}`, data)
    return response.data
  },

  /**
   * Delete subject
   * Maps to: DELETE /subject/:id
   *
   * @param id - Subject ID (integer)
   * @returns Promise<{message: string, deletedSubject: Subject}> Delete confirmation
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async delete(id: number): Promise<{ message: string; deletedSubject: Subject }> {
    const response = await apiClient.delete<{ message: string; deletedSubject: Subject }>(
      `/subject/${id}`,
    )
    return response.data
  },
}
