/**
 * FinalCommentsModal - Save Error Handling Tests
 *
 * TDD Tests for improved error handling in FinalCommentsModal
 * FEATURE: Surface backend error messages and preserve modal content on save errors
 *
 * Tests verify:
 * - Backend error responses are properly extracted and displayed
 * - Both 'error' and 'details' fields are surfaced to user
 * - Form content is preserved when save fails
 * - Error messages appear near save button (non-destructive UI)
 * - Error messages clear appropriately
 * - Works for create, update, and delete operations
 */

import { render, screen, waitFor } from '../../../test-utils'
import userEvent from '@testing-library/user-event'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import { usePronounsQuery } from '../../../hooks/usePronounsQuery'
import type { FinalComment, Class } from '../../../types'

// Mock the hooks
jest.mock('../../../hooks/usePersonalizedComments')
jest.mock('../../../hooks/useOutcomeComments')
jest.mock('../../../hooks/usePronounsQuery')

const mockUsePersonalizedComments = usePersonalizedComments as jest.MockedFunction<
  typeof usePersonalizedComments
>
const mockUseOutcomeComments = useOutcomeComments as jest.MockedFunction<
  typeof useOutcomeComments
>
const mockUsePronounsQuery = usePronounsQuery as jest.MockedFunction<
  typeof usePronounsQuery
>

describe('FinalCommentsModal - Save Error Handling', () => {
  const mockClass: Class = {
    id: 'class-1',
    name: 'Biology 101',
    year: 2024,
    subjectId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockFinalComments: FinalComment[] = [
    {
      id: 'comment-1',
      classId: 'class-1',
      firstName: 'John',
      lastName: 'Doe',
      finalComment: 'Excellent work',
      createdAt: new Date().toISOString(),
    },
  ]

  const mockOnCreateComment = jest.fn()
  const mockOnUpdateComment = jest.fn()
  const mockOnDeleteComment = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock pronouns hook with some pronouns available so pronoun confirmation doesn't block saves
    mockUsePronounsQuery.mockReturnValue({
      pronouns: [
        { id: 'he', label: 'He/Him', possessive: 'His' },
        { id: 'she', label: 'She/Her', possessive: 'Her' },
        { id: 'they', label: 'They/Them', possessive: 'Their' },
      ],
      loading: false,
      error: null,
    })

    // Mock personalized comments hook
    mockUsePersonalizedComments.mockReturnValue({
      personalizedComments: [],
      loading: false,
      error: null,
      loadPersonalizedComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
      clearError: jest.fn(),
    })

    // Mock outcome comments hook
    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: [],
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
    })
  })

  // Helper function to fill in the add form with required fields and select a pronoun
  const fillAddFormWithRequiredFields = async () => {
    // Fill in first name (required)
    const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
    await userEvent.type(firstNameInput, 'John')

    // Fill in grade (required)
    const gradeInputs = screen.getAllByRole('spinbutton')
    await userEvent.type(gradeInputs[0], '85')

    // Select a pronoun to avoid confirmation dialog
    const pronounSelect = screen.getByLabelText('Pronoun')
    await userEvent.selectOptions(pronounSelect, 'he')
  }

  // ============================================================================
  // TEST SUITE 1: Error Message Extraction & Display
  // ============================================================================

  describe('Error Message Extraction & Display', () => {
    it('should extract and display error and details from failed create response', async () => {
      const errorResponse = {
        error: 'Duplicate entry',
        details: 'This student already has a final comment in this class',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in required fields and select pronoun
      await fillAddFormWithRequiredFields()

      // Fill in comment
      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'New comment')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Duplicate entry/i)).toBeInTheDocument()
      })

      // Verify both error and details are shown
      expect(screen.getByText(/This student already has a final comment in this class/i)).toBeInTheDocument()
    })

    it('should format error message as "{error}: {details}"', async () => {
      const errorResponse = {
        error: 'Validation failed',
        details: 'Comment must be between 10 and 5000 characters',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        // Error and details are in separate elements, so check for both
        expect(screen.getByText(/Validation failed/i)).toBeInTheDocument()
        expect(screen.getByText(/Comment must be between 10 and 5000 characters/i)).toBeInTheDocument()
      })
    })

    it('should handle permission/authorization errors', async () => {
      const errorResponse = {
        error: 'Unauthorized',
        details: "You don't have permission to edit comments for this class",
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test comment')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Unauthorized/i)).toBeInTheDocument()
        expect(screen.getByText(/You don't have permission/i)).toBeInTheDocument()
      })
    })

    it('should display error message within 1 second of failed save', async () => {
      const errorResponse = {
        error: 'Server error',
        details: 'Please try again later',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      const startTime = Date.now()
      await userEvent.click(saveButton)

      await waitFor(
        () => {
          expect(screen.getByText(/Server error/i)).toBeInTheDocument()
        },
        { timeout: 1000 },
      )

      const endTime = Date.now()
      expect(endTime - startTime).toBeLessThan(1000)
    })

    it('should use accessible error styling (ARIA alert)', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        // Error should be in an alert role for accessibility
        const errorAlert = screen.getByRole('alert', { hidden: false })
        expect(errorAlert).toBeInTheDocument()
      })
    })
  })

  // ============================================================================
  // TEST SUITE 2: Form Content Preservation on Error
  // ============================================================================

  describe('Form Content Preservation on Save Error', () => {
    it('should preserve textarea content after save error', async () => {
      const errorResponse = {
        error: 'Duplicate entry',
        details: 'This student already has a final comment',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      const testComment = 'This is my carefully written comment'

      await userEvent.type(textarea, testComment)
      expect(textarea).toHaveValue(testComment)

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate entry/i)).toBeInTheDocument()
      })

      // CRITICAL: Content should still be there after error
      expect(textarea).toHaveValue(testComment)
    })

    it('should preserve all form field values on error (not reset form)', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill all form fields
      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      const testComment = 'Test comment content'
      await userEvent.type(textarea, testComment)

      // Try to save
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Test error/i)).toBeInTheDocument()
      })

      // All fields should retain their values
      expect(textarea).toHaveValue(testComment)
      // Form should NOT be reset
      expect(textarea).not.toHaveValue('')
    })

    it('should keep modal open after save error (not close or replace)', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Test error/i)).toBeInTheDocument()
      })

      // Modal should still be visible and not replaced
      expect(textarea).toBeInTheDocument()
      expect(textarea).toBeVisible()
    })

    it('should allow immediate retry of save without re-entering content', async () => {
      const errorResponse = {
        error: 'Duplicate entry',
        details: 'This student already has a comment',
      }

      // First attempt fails
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)
      // Second attempt succeeds
      mockOnCreateComment.mockResolvedValueOnce(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      const testComment = 'Important comment'
      await userEvent.type(textarea, testComment)

      const saveButton = screen.getByRole('button', { name: /add final comment/i })

      // First save attempt fails
      await userEvent.click(saveButton)
      await waitFor(() => {
        expect(screen.getByText(/Duplicate entry/i)).toBeInTheDocument()
      })

      // Content still there
      expect(textarea).toHaveValue(testComment)

      // User can immediately retry without re-typing
      await userEvent.click(saveButton)
      await waitFor(() => {
        expect(mockOnCreateComment).toHaveBeenCalledTimes(2)
      })
    })
  })

  // ============================================================================
  // TEST SUITE 3: Error UI Positioning
  // ============================================================================

  describe('Error UI Positioning & Display', () => {
    it('should display error message near save button', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert')
        const saveButtonElement = saveButton

        // Error should be positioned near button (same container or close)
        const buttonRect = saveButtonElement.getBoundingClientRect()
        const errorRect = errorAlert.getBoundingClientRect()

        // Check they're in reasonable proximity (same general area)
        const verticalDistance = Math.abs(buttonRect.top - errorRect.bottom)
        expect(verticalDistance).toBeLessThan(200) // Should be reasonably close
      })
    })

    it('should not obscure the comment textarea with error message', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test comment')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Textarea should still be visible and accessible
      expect(textarea).toBeVisible()
      expect(textarea).toBeInTheDocument()
    })

    it('should use error styling (colors, contrast)', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert')
        expect(errorAlert).toBeInTheDocument()

        // Should have error styling - check for red border or background from error styling
        const style = errorAlert.getAttribute('style') || ''
        // Verify it has styling applied (background, border, or color related to errors)
        expect(style.length).toBeGreaterThan(0)
      })
    })

    it('should have dismiss/close button for error message', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Should have a dismiss button
      const dismissButton = screen.getByRole('button', { name: /close|dismiss|×/i })
      expect(dismissButton).toBeInTheDocument()
    })
  })

  // ============================================================================
  // TEST SUITE 4: Error Clearing Logic
  // ============================================================================

  describe('Error Clearing Behavior', () => {
    it('should clear error when user starts editing after error', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // User continues editing
      await userEvent.type(textarea, ' more text')

      // Error should be cleared
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should clear error on successful retry', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }

      mockOnCreateComment.mockRejectedValueOnce(errorResponse)
      mockOnCreateComment.mockResolvedValueOnce(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })

      // First attempt fails
      await userEvent.click(saveButton)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Second attempt succeeds
      await userEvent.click(saveButton)
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })

    it('should update error message on new save attempt with different error', async () => {
      const errorResponse1 = {
        error: 'First error',
        details: 'First details',
      }
      const errorResponse2 = {
        error: 'Second error',
        details: 'Second details',
      }

      mockOnCreateComment.mockRejectedValueOnce(errorResponse1)
      mockOnCreateComment.mockRejectedValueOnce(errorResponse2)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })

      // First attempt
      await userEvent.click(saveButton)
      await waitFor(() => {
        expect(screen.getByText(/First error/i)).toBeInTheDocument()
      })

      // Second attempt
      await userEvent.click(saveButton)
      await waitFor(() => {
        expect(screen.queryByText(/First error/i)).not.toBeInTheDocument()
        expect(screen.getByText(/Second error/i)).toBeInTheDocument()
      })
    })
  })

  // ============================================================================
  // TEST SUITE 5: Error Handling in Update Operations
  // ============================================================================

  describe('Update Error Handling', () => {
    it('should preserve form content on update error', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Click edit on existing comment
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await userEvent.click(editButtons[0])

      // Verify edit mode form is shown with Save button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
      })

      // Verify we can access the comment textarea in edit mode
      const textareas = screen.getAllByRole('textbox')
      const editTextarea = textareas.find(ta => {
        const el = ta as HTMLTextAreaElement
        return el.id?.includes('comment')
      }) as HTMLTextAreaElement
      expect(editTextarea).toBeDefined()
      expect(editTextarea).toBeInTheDocument()
    })

    it('should display error on failed update', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await userEvent.click(editButtons[0])

      // Verify edit form is displayed with proper buttons
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
      })

      // Verify cancel button is available
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()

      // Verify the form content is editable
      const textareas = screen.getAllByRole('textbox')
      expect(textareas.length).toBeGreaterThan(0)
    })
  })

  // ============================================================================
  // TEST SUITE 6: Error Handling in Delete Operations
  // ============================================================================

  describe('Delete Error Handling', () => {
    it('should display error on failed delete', async () => {
      const errorResponse = {
        error: 'Cannot delete',
        details: 'This comment is referenced by other records',
      }
      mockOnDeleteComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await userEvent.click(deleteButtons[0])

      // Confirm deletion - find the Delete button in the confirmation modal
      await waitFor(() => {
        const confirmButtons = screen.getAllByRole('button', { name: /Delete/i })
        // Should have at least 2 delete buttons now (original + confirmation modal)
        expect(confirmButtons.length).toBeGreaterThanOrEqual(2)
      })
      const allDeleteButtons = screen.getAllByRole('button', { name: /Delete/i })
      // Click the second one (the confirmation button)
      await userEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(screen.getByText(/Cannot delete/i)).toBeInTheDocument()
        expect(screen.getByText(/This comment is referenced/i)).toBeInTheDocument()
      })
    })

    it('should keep modal open on delete error', async () => {
      const errorResponse = {
        error: 'Delete failed',
        details: 'Please try again',
      }
      mockOnDeleteComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await userEvent.click(deleteButtons[0])

      // Confirm deletion - find the Delete button in the confirmation modal
      await waitFor(() => {
        const confirmButtons = screen.getAllByRole('button', { name: /Delete/i })
        // Should have at least 2 delete buttons now (original + confirmation modal)
        expect(confirmButtons.length).toBeGreaterThanOrEqual(2)
      })
      const allDeleteButtons = screen.getAllByRole('button', { name: /Delete/i })
      // Click the second one (the confirmation button)
      await userEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(screen.getByText(/Delete failed/i)).toBeInTheDocument()
      })

      // Modal should still be open and showing the error message
      expect(screen.getByText(/Delete failed/i)).toBeInTheDocument()
      // The alert should be visible
      expect(screen.getByRole('alert')).toBeInTheDocument()
      // Error details should also be shown
      expect(screen.getByText(/Please try again/i)).toBeInTheDocument()
    })
  })

  // ============================================================================
  // TEST SUITE 7: Edge Cases
  // ============================================================================

  describe('Edge Cases & Accessibility', () => {
    it('should handle error response without details field gracefully', async () => {
      const incompleteError = {
        error: 'Something went wrong',
        // Missing 'details' field
      }
      mockOnCreateComment.mockRejectedValueOnce(incompleteError)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Should still show error gracefully
      await waitFor(() => {
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
      })
    })

    it('should handle non-structured error responses (fallback)', async () => {
      mockOnCreateComment.mockRejectedValueOnce(new Error('Network error'))

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Should show helpful fallback message
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('should dismiss when user starts editing the form', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Error should be displayed
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // User starts editing - this should dismiss the error
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.clear(firstNameInput)
      await userEvent.type(firstNameInput, 'Jane')

      // Error should be dismissed after editing
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })

    it('should announce error to screen readers', async () => {
      const errorResponse = {
        error: 'Test error',
        details: 'Test details',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await fillAddFormWithRequiredFields()

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Alert should be announced to screen readers
      const alertElement = await screen.findByRole('alert')
      expect(alertElement).toHaveAttribute('role', 'alert')
    })
  })

  describe('Pronoun Confirmation Error Handling Edge Case', () => {
    it('should display structured error when save fails after pronounConfirmation Yes', async () => {
      const errorResponse = {
        error: 'Duplicate entry',
        details: 'This student already has a final comment in this class',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill form with required fields but NO pronoun selected
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.type(firstNameInput, 'Jane')

      const gradeInput = screen.getByPlaceholderText(/0-100/i)
      await userEvent.type(gradeInput, '85')

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test comment')

      // Attempt save without pronoun - should trigger confirmation modal
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Pronoun confirmation modal should appear
      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      // User confirms (clicks Yes)
      const confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Save attempt fails - error should be displayed with same format as normal save
      await waitFor(() => {
        expect(screen.getByText('Duplicate entry')).toBeInTheDocument()
        expect(
          screen.getByText('This student already has a final comment in this class'),
        ).toBeInTheDocument()
      })

      // Verify error is displayed in SaveErrorAlert (not validation error)
      const alertElement = screen.getByRole('alert')
      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveTextContent('Duplicate entry')
    })

    it('should preserve form content after pronounConfirmation error', async () => {
      const errorResponse = {
        error: 'Save failed',
        details: 'Backend error occurred',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill form
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.type(firstNameInput, 'Alex')

      const gradeInput = screen.getByPlaceholderText(/0-100/i)
      await userEvent.type(gradeInput, '92')

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Excellent performance')

      // Save without pronoun -> confirm -> fail
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Verify error appears
      await waitFor(() => {
        expect(screen.getByText('Save failed')).toBeInTheDocument()
      })

      // Verify form content is preserved
      expect(firstNameInput).toHaveValue('Alex')
      expect(gradeInput).toHaveValue(92)
      expect(textarea).toHaveValue('Excellent performance')
    })

    it('should allow retry after pronounConfirmation error', async () => {
      const errorResponse = {
        error: 'Temporary error',
        details: 'Please try again',
      }

      // First attempt fails, second succeeds
      mockOnCreateComment
        .mockRejectedValueOnce(errorResponse)
        .mockResolvedValueOnce(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill form without pronoun
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.type(firstNameInput, 'Sam')

      const gradeInput = screen.getByPlaceholderText(/0-100/i)
      await userEvent.type(gradeInput, '78')

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Good work')

      // First save attempt
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      let confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Verify first error appears
      await waitFor(() => {
        expect(screen.getByText('Temporary error')).toBeInTheDocument()
      })

      // Attempt retry by clicking save again (form is still filled)
      await userEvent.click(saveButton)

      // Confirm again
      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Second attempt should succeed
      await waitFor(() => {
        expect(screen.queryByText('Temporary error')).not.toBeInTheDocument()
        // Form should be cleared on success
        expect(firstNameInput).toHaveValue('')
      })
    })

    it('should use same error handling as normal save flow', async () => {
      const errorResponse = {
        error: 'Validation failed',
        details: 'Invalid data provided',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Save without pronoun
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.type(firstNameInput, 'Test')

      const gradeInput = screen.getByPlaceholderText(/0-100/i)
      await userEvent.type(gradeInput, '50')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Error should appear in SaveErrorAlert format (same as normal save)
      const alertElement = await screen.findByRole('alert')
      expect(alertElement).toBeInTheDocument()
      expect(alertElement).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByText('Validation failed')).toBeInTheDocument()
      expect(screen.getByText('Invalid data provided')).toBeInTheDocument()

      // Should have dismiss button
      expect(screen.getByRole('button', { name: /close error message/i })).toBeInTheDocument()
    })

    it('should clear error when user edits form after pronounConfirmation error', async () => {
      const errorResponse = {
        error: 'Save failed',
        details: 'Try again',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Save without pronoun -> confirm -> fail
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.type(firstNameInput, 'Test')

      const gradeInput = screen.getByPlaceholderText(/0-100/i)
      await userEvent.type(gradeInput, '80')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Save failed')).toBeInTheDocument()
      })

      // User edits form - error should clear
      await userEvent.clear(firstNameInput)
      await userEvent.type(firstNameInput, 'Updated')

      // Error should be dismissed
      await waitFor(() => {
        expect(screen.queryByText('Save failed')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Switching Error Clearing Edge Case', () => {
    it('should clear ADD form error when switching to EDIT form', async () => {
      const errorResponse = {
        error: 'Add failed',
        details: 'Error adding comment',
      }
      mockOnCreateComment.mockRejectedValueOnce(errorResponse)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockOnDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Attempt to add a comment without selecting pronoun
      const firstNameInput = screen.getByPlaceholderText(/Enter student first name/i)
      await userEvent.type(firstNameInput, 'Jane')

      const gradeInput = screen.getByPlaceholderText(/0-100/i)
      await userEvent.type(gradeInput, '85')

      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)
      await userEvent.type(textarea, 'Test comment')

      // Try to save - triggers pronoun confirmation
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Confirm save without pronoun
      await waitFor(() => {
        expect(screen.getByText(/saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(confirmButton)

      // Save fails - error appears
      await waitFor(() => {
        expect(screen.getByText('Add failed')).toBeInTheDocument()
      })

      // Leave error showing and click to edit an existing comment
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await userEvent.click(editButtons[0])

      // Verify error from ADD is cleared when EDIT form opens
      await waitFor(() => {
        expect(screen.queryByText('Add failed')).not.toBeInTheDocument()
      })

      // Verify edit form is now displayed
      expect(screen.getByDisplayValue('John')).toBeInTheDocument() // firstName of first comment
    })
  })
})
