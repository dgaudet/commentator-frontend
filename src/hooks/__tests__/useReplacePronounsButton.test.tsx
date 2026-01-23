/**
 * useReplacePronounsButton Hook Tests
 *
 * Story 2: Reusable Replace Pronouns Component/Hook
 * - Custom hook to manage replace pronouns state and logic
 * - Reduces code duplication across BulkUploadModal, PersonalizedCommentsModal, and OutcomeCommentsModal
 * - Handles both single-section and multi-section use cases
 */

import { renderHook, act } from '@testing-library/react'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { useReplacePronounsButton } from '../useReplacePronounsButton'
import type { Pronoun } from '../../types'

describe('useReplacePronounsButton Hook - Story 2', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )
  const mockPronouns: Pronoun[] = [
    { id: '1', pronoun: 'he', possessivePronoun: 'his', userId: 'user-1', createdAt: '2026-01-21T00:00:00Z', updatedAt: '2026-01-21T00:00:00Z' },
    { id: '2', pronoun: 'she', possessivePronoun: 'her', userId: 'user-1', createdAt: '2026-01-21T00:00:00Z', updatedAt: '2026-01-21T00:00:00Z' },
  ]

  describe('Initialization', () => {
    it('should initialize with loading and message states as null/false', () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBeNull()
    })
  })

  describe('Replace Pronouns Handler', () => {
    it('should replace pronouns in text and update it', async () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      const originalText = 'He is great and his work is excellent'
      let updatedText = originalText

      await act(async () => {
        const newText = await result.current.handleReplacePronounsFunctionality(
          originalText,
          mockPronouns,
        )
        updatedText = newText
      })

      expect(updatedText).toContain('<pronoun>')
      expect(updatedText).toContain('<possessive pronoun>')
    })

    it('should show success message with replacement count', async () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      const text = 'He is great and his work is excellent'

      await act(async () => {
        await result.current.handleReplacePronounsFunctionality(text, mockPronouns)
      })

      expect(result.current.message).not.toBeNull()
      expect(result.current.message?.type).toBe('success')
      expect(result.current.message?.text).toMatch(/Replaced \d+ pronouns/)
    })

    it('should show info message when no pronouns found in text', async () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      // Text with no matching pronouns from mockPronouns array
      const text = 'This text has no pronouns to replace'

      await act(async () => {
        await result.current.handleReplacePronounsFunctionality(text, mockPronouns)
      })

      expect(result.current.message?.type).toBe('info')
      expect(result.current.message?.text).toBe('No pronouns found in text')
    })

    it('should show info message when text is empty', async () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      await act(async () => {
        await result.current.handleReplacePronounsFunctionality('', mockPronouns)
      })

      expect(result.current.message?.type).toBe('info')
      expect(result.current.message?.text).toBe('Please enter text first')
    })

    it('should set loading state during operation', async () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      act(() => {
        result.current.setIsLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setIsLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Message Styling', () => {
    it('should provide consistent message styling function', () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      const successStyle = result.current.getMessageBoxStyle('success')
      const errorStyle = result.current.getMessageBoxStyle('error')
      const infoStyle = result.current.getMessageBoxStyle('info')

      // All should have base properties
      expect(successStyle).toHaveProperty('marginTop')
      expect(successStyle).toHaveProperty('padding')
      expect(successStyle).toHaveProperty('borderRadius')
      expect(successStyle).toHaveProperty('fontSize')
      expect(successStyle).toHaveProperty('border')

      // Each should have unique colors
      expect(successStyle.backgroundColor).not.toBe(errorStyle.backgroundColor)
      expect(errorStyle.borderColor).not.toBe(infoStyle.borderColor)
    })
  })

  describe('Clearing Messages', () => {
    it('should clear message state', async () => {
      const { result } = renderHook(() => useReplacePronounsButton(), { wrapper })

      const text = 'He is great'

      await act(async () => {
        await result.current.handleReplacePronounsFunctionality(text, mockPronouns)
      })

      expect(result.current.message).not.toBeNull()

      act(() => {
        result.current.clearMessage()
      })

      expect(result.current.message).toBeNull()
    })
  })
})
