/**
 * LoadingContext
 *
 * Provides global API loading state management for the application.
 * Tracks loading state for API calls across the entire app.
 *
 * Usage:
 * 1. Wrap your app with <LoadingProvider>
 * 2. Use useLoading() hook to access and update loading state
 * 3. Call startLoading() before API call
 * 4. Call stopLoading() after API call completes
 *
 * Supports multiple concurrent API calls with a loading counter:
 * - startLoading() increments counter
 * - stopLoading() decrements counter
 * - isLoading = true when counter > 0
 *
 * Example:
 * const { isLoading, startLoading, stopLoading } = useLoading()
 *
 * const fetchData = async () => {
 *   startLoading()
 *   try {
 *     const data = await api.getData()
 *     return data
 *   } finally {
 *     stopLoading()
 *   }
 * }
 */

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextType {
  /**
   * Whether any API calls are currently loading
   */
  isLoading: boolean

  /**
   * Start a loading operation
   * Increments internal counter - supports multiple concurrent operations
   */
  startLoading: () => void

  /**
   * Stop a loading operation
   * Decrements internal counter - will not go below 0
   */
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

/**
 * LoadingProvider component
 *
 * Wraps the application to provide global loading state for API calls.
 *
 * Place near the root of your app:
 * <LoadingProvider>
 *   <App />
 * </LoadingProvider>
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  // Use a counter to handle multiple concurrent API calls
  // isLoading = true when counter > 0
  const [loadingCounter, setLoadingCounter] = useState(0)

  const startLoading = () => {
    setLoadingCounter(prev => prev + 1)
  }

  const stopLoading = () => {
    setLoadingCounter(prev => Math.max(0, prev - 1))
  }

  const value: LoadingContextType = {
    isLoading: loadingCounter > 0,
    startLoading,
    stopLoading,
  }

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

/**
 * useLoading hook
 *
 * Access global loading state for API calls.
 * Must be used within a LoadingProvider.
 *
 * Returns:
 * - isLoading: boolean - true if any API calls are in progress
 * - startLoading: () => void - call before API request
 * - stopLoading: () => void - call after API request completes
 *
 * @throws Error if used outside LoadingProvider
 *
 * Example:
 * const { isLoading, startLoading, stopLoading } = useLoading()
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
