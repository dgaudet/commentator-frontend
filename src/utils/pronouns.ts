/**
 * Pronoun-to-Placeholder Replacement Utility
 * TASK-1.1: Reusable utility function for converting pronouns to standardized placeholders
 *
 * Features:
 * - Case-insensitive pronoun matching
 * - Word boundary matching to prevent partial matches
 * - Multiple pronoun support
 * - Replacement counting
 * - Text formatting preservation
 */

import type { Pronoun } from '../types'

/**
 * Result object from pronoun replacement operation
 *
 * @property replacedText - The text with pronouns replaced by placeholders
 * @property replacementCount - Count of replacements made for each pronoun type
 */
export interface ReplacePronounsResult {
  /** The text with pronouns replaced by placeholders */
  replacedText: string
  /** Count of replacements made for each pronoun type */
  replacementCount: {
    /** Number of subject pronoun replacements */
    pronoun: number
    /** Number of possessive pronoun replacements */
    possessivePronoun: number
  }
}

/**
 * Escapes special regex characters in a string to prevent regex injection
 * Escapes: . * + ? [ ] ( ) { } ^ $ | \
 *
 * @param str - The string to escape
 * @returns The escaped string safe for use in regex patterns
 */
function escapeRegexSpecialChars(str: string): string {
  return str.replace(/[.*+?[\](){}^$|\\]/g, '\\$&')
}

/**
 * Replaces actual pronoun values with standardized placeholders.
 *
 * This function processes each pronoun in the provided array and replaces
 * matching pronouns in the text with <pronoun> and possessive pronouns
 * with <possessive pronoun>. Matching is case-insensitive and uses word
 * boundaries to prevent partial word matches (e.g., "the" is not matched
 * within "they").
 *
 * @param text - The comment text containing pronouns to replace
 * @param pronouns - Array of Pronoun objects from the API
 * @returns Object with replaced text and replacement counts
 *
 * @example
 * ```typescript
 * const result = replacePronounsWithPlaceholders(
 *   'He is excellent. His work is great.',
 *   [{ pronoun: 'he', possessivePronoun: 'his', ... }]
 * )
 * // result.replacedText === '<pronoun> is excellent. <possessive pronoun> work is great.'
 * // result.replacementCount === { pronoun: 1, possessivePronoun: 1 }
 * ```
 */
export function replacePronounsWithPlaceholders(
  text: string,
  pronouns: Pronoun[],
): ReplacePronounsResult {
  let result = text
  let pronounCount = 0
  let possessivePronounCount = 0

  // Process each pronoun from the array
  for (const pronoun of pronouns) {
    // Skip if neither pronoun nor possessivePronoun is present
    if (!pronoun.pronoun && !pronoun.possessivePronoun) {
      continue
    }

    // Replace subject pronouns (case-insensitive with word boundaries)
    if (pronoun.pronoun) {
      // Use word boundary \b to match complete words only (e.g., "he" but not "the")
      // Global flag (g) replaces all occurrences
      // Case-insensitive flag (i) matches He, he, HE, hE, etc.
      // Escape regex special characters to prevent regex injection
      const escapedPronoun = escapeRegexSpecialChars(pronoun.pronoun)
      const pronounRegex = new RegExp(`\\b${escapedPronoun}\\b`, 'gi')
      const matches = result.match(pronounRegex)
      if (matches) {
        pronounCount += matches.length
      }
      result = result.replace(pronounRegex, '<pronoun>')
    }

    // Replace possessive pronouns (case-insensitive with word boundaries)
    if (pronoun.possessivePronoun) {
      // Escape regex special characters to prevent regex injection
      const escapedPossessivePronoun = escapeRegexSpecialChars(pronoun.possessivePronoun)
      const possessiveRegex = new RegExp(`\\b${escapedPossessivePronoun}\\b`, 'gi')
      const matches = result.match(possessiveRegex)
      if (matches) {
        possessivePronounCount += matches.length
      }
      result = result.replace(possessiveRegex, '<possessive pronoun>')
    }
  }

  return {
    replacedText: result,
    replacementCount: {
      pronoun: pronounCount,
      possessivePronoun: possessivePronounCount,
    },
  }
}
