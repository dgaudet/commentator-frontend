/**
 * ObjectId Generator Utility
 * Generates MongoDB-compatible ObjectId strings for mock data
 *
 * MongoDB ObjectId Format:
 * - 24 character hexadecimal string
 * - Structure: [8-char timestamp][16-char random/hash]
 *
 * Task: TASK-3.1 - Create ObjectId Generator Utility
 */

/**
 * Generate a mock MongoDB ObjectId string
 * Optionally uses a seed for deterministic generation
 *
 * @param seed - Optional string to generate consistent IDs (for testing)
 * @returns 24-character hexadecimal string representing a MongoDB ObjectId
 *
 * @example
 * const id1 = generateMockObjectId() // Random, e.g., '65a1b2c3d4e5f6g7h8i9j0k1'
 * const id2 = generateMockObjectId('math') // Deterministic from seed
 */
export function generateMockObjectId(seed?: string): string {
  // Generate 8-character timestamp (current time in seconds, hex)
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')

  // Generate 16-character random/hash component
  let randomPart: string

  if (seed) {
    // Deterministic: hash the seed to generate consistent IDs
    const hash = Array.from(seed).reduce((h, c) => {
      return ((h << 5) - h) + c.charCodeAt(0)
    }, 0)
    randomPart = Math.abs(hash)
      .toString(16)
      .padStart(16, '0')
      .slice(0, 16)
  } else {
    // Random: use Math.random()
    randomPart = Math.random()
      .toString(16)
      .slice(2, 18)
      .padStart(16, '0')
  }

  // Combine and ensure exactly 24 characters
  return (timestamp + randomPart).slice(0, 24)
}

/**
 * Validate if a string is a valid MongoDB ObjectId format
 *
 * @param id - String to validate
 * @returns true if string is 24 hexadecimal characters, false otherwise
 *
 * @example
 * isValidObjectId('65a1b2c3d4e5f6g7h8i9j0k1') // true
 * isValidObjectId('123') // false
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}
