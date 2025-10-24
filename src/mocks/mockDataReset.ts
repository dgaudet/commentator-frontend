/**
 * Mock Data Reset Utility
 * Provides a way to reset MSW mock data without importing MSW itself
 */

// Global variable to store the reset function
let globalResetFunction: (() => void) | null = null

/**
 * Register the reset function from the handlers module
 */
export function registerResetFunction(resetFn: () => void) {
  globalResetFunction = resetFn
}

/**
 * Reset mock data if a reset function has been registered
 */
export function resetMockData() {
  if (globalResetFunction) {
    globalResetFunction()
  }
}
