/**
 * Pronoun Entity Types
 *
 * Represents a pronoun (e.g., he/his, she/her, they/their) for personalization
 * TASK-1.3: Implement pronoun dropdown selector in Final Comments form
 *
 * Properties:
 * - id: Unique identifier
 * - pronoun: Subject form (he, she, they, zie, etc.)
 * - possessivePronoun: Possessive form (his, her, their, zis, etc.)
 * - userId: Owner of the pronoun
 * - createdAt: ISO timestamp when created
 * - updatedAt: ISO timestamp when last updated
 */

/**
 * Pronoun entity returned from API
 */
export interface Pronoun {
  /** Unique identifier for the pronoun */
  id: string
  /** Subject form (e.g., he, she, they) */
  pronoun: string
  /** Possessive form (e.g., his, her, their) */
  possessivePronoun: string
  /** User ID who owns this pronoun */
  userId: string
  /** ISO 8601 timestamp when created */
  createdAt: string
  /** ISO 8601 timestamp when last updated */
  updatedAt: string
}

/**
 * Request to create a new pronoun
 */
export interface CreatePronounRequest {
  /** Subject form (e.g., he, she, they) */
  pronoun: string
  /** Possessive form (e.g., his, her, their) */
  possessivePronoun: string
}

/**
 * Request to update an existing pronoun
 */
export interface UpdatePronounRequest {
  /** Subject form (e.g., he, she, they) */
  pronoun?: string
  /** Possessive form (e.g., his, her, their) */
  possessivePronoun?: string
}
