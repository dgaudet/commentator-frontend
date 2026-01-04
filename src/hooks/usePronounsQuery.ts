/**
 * usePronounsQuery Hook
 *
 * Fetches pronouns from GET /api/pronouns endpoint
 * TASK-1.3: Implement pronoun dropdown selector in Final Comments form
 *
 * Features:
 * - Fetches all pronouns for the authenticated user
 * - Handles loading and error states
 * - Caches results during component lifetime
 * - Provides refetch capability
 *
 * @returns Object with pronouns list, loading state, error message, and refetch function
 *
 * @example
 * const { pronouns, loading, error, refetch } = usePronounsQuery()
 *
 * if (loading) return <LoadingSpinner />
 * if (error) return <ErrorMessage message={error} />
 *
 * return (
 *   <select>
 *     {pronouns.map(p => (
 *       <option key={p.id} value={p.id}>
 *         {p.pronoun} - {p.possessivePronoun}
 *       </option>
 *     ))}
 *   </select>
 * )
 */

import { useEffect, useState } from 'react'
import type { Pronoun } from '../types'
import { apiClient } from '../services/apiClient'

interface UsePronounsQueryReturn {
  /** List of pronouns */
  pronouns: Pronoun[]
  /** Loading state - true while fetching pronouns */
  loading: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Function to refetch pronouns */
  refetch: () => Promise<void>
}

/**
 * Hook to fetch pronouns from the API
 * @returns Object containing pronouns, loading state, error, and refetch function
 */
export const usePronounsQuery = (): UsePronounsQueryReturn => {
  const [pronouns, setPronouns] = useState<Pronoun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPronouns = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get('/pronoun')
      setPronouns(response)
    } catch (err) {
      console.error('Failed to fetch pronouns:', err)
      setError('Failed to load pronouns')
      setPronouns([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch pronouns on mount
  useEffect(() => {
    fetchPronouns()
  }, [])

  return {
    pronouns,
    loading,
    error,
    refetch: fetchPronouns,
  }
}
