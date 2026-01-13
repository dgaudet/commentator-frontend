/**
 * parseComments utility function
 * Story 3: Parse Bulk Comments with Rating Detection
 *
 * Parses pasted comments into an array of comment objects with optional ratings
 * Format: "comment text, rating" where rating is 1-5 (optional, defaults to 3)
 */

export interface ParsedComment {
  text: string
  rating: number
}

export function parseComments(input: string): ParsedComment[] {
  if (!input || !input.trim()) {
    return []
  }

  // Split by line endings (both \n and \r\n)
  const lines = input.split(/\r?\n/)

  const parsed: ParsedComment[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      continue
    }

    // Try to detect rating from last comma+digit pattern
    // Pattern: ", X" where X is a digit (1-5)
    const ratingMatch = trimmed.match(/, (\d)$/)

    let text: string
    let rating: number = 3 // default rating

    if (ratingMatch) {
      const ratingDigit = parseInt(ratingMatch[1], 10)

      // Only accept ratings 1-5
      if (ratingDigit >= 1 && ratingDigit <= 5) {
        // Remove the ", X" from the end
        text = trimmed.substring(0, trimmed.lastIndexOf(',')).trim()
        rating = ratingDigit
      } else {
        // Invalid rating number, keep entire text with default rating
        text = trimmed
        rating = 3
      }
    } else {
      // No rating pattern found
      text = trimmed
      rating = 3
    }

    parsed.push({ text, rating })
  }

  return parsed
}
