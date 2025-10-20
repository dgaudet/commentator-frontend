/**
 * Class Service - CRUD Operations
 * Consumes existing backend API at http://localhost:3000
 * API Documentation: http://localhost:3000/api-docs/ui
 *
 * Reference: TASK-2.3, US-CLASS-001, US-CLASS-002, DES-7, DES-11
 *
 * All endpoints return direct responses (not wrapped in ApiResponse<T>)
 */
import { Class, CreateClassRequest, UpdateClassRequest } from '../../types/Class'
import { apiClient } from './apiClient'

/**
 * Service for class-related API operations
 */
export const classService = {
  /**
   * Fetch all classes
   * Maps to: GET /class
   *
   * @returns Promise<Class[]> List of classes (direct array response)
   * @throws ApiError on failure
   */
  async getAll(): Promise<Class[]> {
    const response = await apiClient.get<Class[]>('/class')
    return response.data
  },

  /**
   * Fetch single class by ID
   * Maps to: GET /class/:id
   *
   * @param id - Class ID (integer)
   * @returns Promise<Class> Class details (direct object response)
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async getById(id: number): Promise<Class> {
    const response = await apiClient.get<Class>(`/class/${id}`)
    return response.data
  },

  /**
   * Create new class
   * Maps to: POST /class
   *
   * @param data - Class creation data {name, year}
   * @returns Promise<Class> Created class with auto-generated ID (direct object response)
   * @throws ApiError on failure (400 validation errors)
   */
  async create(data: CreateClassRequest): Promise<Class> {
    const response = await apiClient.post<Class>('/class', data)
    return response.data
  },

  /**
   * Update existing class
   * Maps to: PUT /class/:id
   *
   * @param id - Class ID (integer)
   * @param data - Updated class data {name, year}
   * @returns Promise<Class> Updated class (direct object response)
   * @throws ApiError on failure (400 validation, 404 not found)
   */
  async update(id: number, data: UpdateClassRequest): Promise<Class> {
    const response = await apiClient.put<Class>(`/class/${id}`, data)
    return response.data
  },

  /**
   * Delete class
   * Maps to: DELETE /class/:id
   *
   * @param id - Class ID (integer)
   * @returns Promise<{message: string, deletedClass: Class}> Delete confirmation
   * @throws ApiError on failure (400 bad request, 404 not found)
   */
  async delete(id: number): Promise<{ message: string; deletedClass: Class }> {
    const response = await apiClient.delete<{ message: string; deletedClass: Class }>(
      `/class/${id}`,
    )
    return response.data
  },
}
