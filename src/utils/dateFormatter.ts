/**
 * Date Formatting Utilities
 * Uses date-fns for consistent date formatting
 * Reference: TASK-4.3
 */
import { format } from 'date-fns'

/**
 * Format ISO 8601 timestamp to human-readable date
 * Example: "2024-01-15T10:30:00Z" → "Jan 15, 2024"
 *
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string or "Invalid date" if parsing fails
 */
export function formatDate(isoString: string): string {
  try {
    if (!isoString) {
      return 'Invalid date'
    }
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    return format(date, 'MMM d, yyyy')
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Format ISO 8601 timestamp with time
 * Example: "2024-01-15T10:30:00Z" → "Jan 15, 2024, 10:30 AM"
 *
 * @param isoString - ISO 8601 date string
 * @returns Formatted datetime string or "Invalid date" if parsing fails
 */
export function formatDateTime(isoString: string): string {
  try {
    if (!isoString) {
      return 'Invalid date'
    }
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    return format(date, 'MMM d, yyyy, h:mm a')
  } catch (error) {
    return 'Invalid date'
  }
}
