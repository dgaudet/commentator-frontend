import { useState } from 'react'
import './App.css'
import { SubjectList } from './components/subjects/SubjectList'
import { SubjectForm } from './components/subjects/SubjectForm'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { OutcomeCommentsModal } from './components/outcomeComments/OutcomeCommentsModal'
import { PersonalizedCommentsModal } from './components/personalizedComments/PersonalizedCommentsModal'
import { ClassManagementModal } from './components/classes/ClassManagementModal'
import { FinalCommentsModal } from './components/finalComments/FinalCommentsModal'
import { useOutcomeComments } from './hooks/useOutcomeComments'
import { usePersonalizedComments } from './hooks/usePersonalizedComments'
import { useClasses } from './hooks/useClasses'
import { useFinalComments } from './hooks/useFinalComments'
import type { Subject } from './types/Subject'
import type {
  Class,
  CreateOutcomeCommentRequest,
  UpdateOutcomeCommentRequest,
  CreatePersonalizedCommentRequest,
  UpdatePersonalizedCommentRequest,
  CreateClassRequest,
  UpdateClassRequest,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
} from './types'

/**
 * Main application component
 * Entry point for the Commentator frontend
 *
 * Integrates subject management features:
 * - View list of subjects (US-REFACTOR-005)
 * - Add new subject (US-REFACTOR-007)
 * - Edit existing subject (US-REFACTOR-007)
 * - Delete subject
 *
 * Note: SubjectList manages its own subjects state via useSubjects hook.
 * App.tsx only coordinates UI state (forms, dialogs) and passes callbacks.
 */
function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    onConfirm?:() => Promise<void>
    subjectName?: string
      }>({ isOpen: false })
  const [outcomeCommentsModal, setOutcomeCommentsModal] = useState<{
    isOpen: boolean
    subjectItem?: Subject
  }>({ isOpen: false })

  const [personalizedCommentsModal, setPersonalizedCommentsModal] = useState<{
    isOpen: boolean
    subjectItem?: Subject
  }>({ isOpen: false })

  const [classManagementModal, setClassManagementModal] = useState<{
    isOpen: boolean
    subjectItem?: Subject
  }>({ isOpen: false })

  const [finalCommentsModal, setFinalCommentsModal] = useState<{
    isOpen: boolean
    classItem?: Class
  }>({ isOpen: false })

  // Hook for managing outcome comments state and API operations
  const {
    outcomeComments,
    loading: outcomeCommentsLoading,
    error: outcomeCommentsError,
    loadOutcomeComments,
    createComment,
    updateComment,
    deleteComment,
    clearError: clearOutcomeCommentsError,
  } = useOutcomeComments()

  // Hook for managing personalized comments state and API operations
  const {
    personalizedComments,
    loading: personalizedCommentsLoading,
    error: personalizedCommentsError,
    loadPersonalizedComments,
    createComment: createPersonalizedComment,
    updateComment: updatePersonalizedComment,
    deleteComment: deletePersonalizedComment,
    clearError: clearPersonalizedCommentsError,
  } = usePersonalizedComments()

  // Hook for managing classes state and API operations
  const {
    classes,
    loading: classesLoading,
    error: classesError,
    loadClasses,
    createClass,
    updateClass,
    deleteClass,
    clearError: clearClassesError,
  } = useClasses()

  // Hook for managing final comments state and API operations
  const {
    finalComments,
    loading: finalCommentsLoading,
    error: finalCommentsError,
    loadFinalComments,
    createComment: createFinalComment,
    updateComment: updateFinalComment,
    deleteComment: deleteFinalComment,
    clearError: clearFinalCommentsError,
  } = useFinalComments()

  const handleAddSubject = () => {
    setEditingSubject(undefined)
    setShowForm(true)
  }

  const handleEditSubject = (subjectItem: Subject) => {
    setEditingSubject(subjectItem)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingSubject(undefined)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSubject(undefined)
  }

  // This callback will be called by SubjectList when user clicks delete
  // SubjectList passes us the subject info and a delete function to call on confirm
  const handleDeleteRequest = (subjectName: string, onConfirm: () => Promise<void>) => {
    setDeleteConfirm({
      isOpen: true,
      subjectName,
      onConfirm,
    })
  }

  // This callback will be called by SubjectList when user clicks view outcome comments
  const handleViewOutcomeComments = async (subjectItem: Subject) => {
    setOutcomeCommentsModal({
      isOpen: true,
      subjectItem,
    })
    // Load outcome comments for this subject
    await loadOutcomeComments(subjectItem.id)
  }

  const handleOutcomeCommentsClose = () => {
    setOutcomeCommentsModal({ isOpen: false })
    // Clear any error state when closing modal
    clearOutcomeCommentsError()
  }

  // Real API handler for creating outcome comments
  const handleCreateOutcomeComment = async (request: CreateOutcomeCommentRequest) => {
    await createComment(request)
  }

  // Real API handler for updating outcome comments
  const handleUpdateOutcomeComment = async (id: number, request: UpdateOutcomeCommentRequest) => {
    await updateComment(id, request)
  }

  // Real API handler for deleting outcome comments
  const handleDeleteOutcomeComment = async (id: number) => {
    await deleteComment(id)
  }

  // This callback will be called by SubjectList when user clicks view personalized comments
  const handleViewPersonalizedComments = async (subjectItem: Subject) => {
    setPersonalizedCommentsModal({
      isOpen: true,
      subjectItem,
    })
    // Load personalized comments for this subject
    await loadPersonalizedComments(subjectItem.id)
  }

  const handlePersonalizedCommentsClose = () => {
    setPersonalizedCommentsModal({ isOpen: false })
    // Clear any error state when closing modal
    clearPersonalizedCommentsError()
  }

  // Real API handler for creating personalized comments
  const handleCreatePersonalizedComment = async (request: CreatePersonalizedCommentRequest) => {
    await createPersonalizedComment(request)
  }

  // Real API handler for updating personalized comments
  const handleUpdatePersonalizedComment = async (id: number, request: UpdatePersonalizedCommentRequest) => {
    await updatePersonalizedComment(id, request)
  }

  // Real API handler for deleting personalized comments
  const handleDeletePersonalizedComment = async (id: number) => {
    await deletePersonalizedComment(id)
  }

  // This callback will be called by SubjectList when user clicks manage classes
  const handleViewClasses = async (subjectItem: Subject) => {
    setClassManagementModal({
      isOpen: true,
      subjectItem,
    })
    // Load classes for this subject
    await loadClasses(subjectItem.id)
  }

  const handleClassManagementClose = () => {
    setClassManagementModal({ isOpen: false })
    // Clear any error state when closing modal
    clearClassesError()
  }

  // Real API handler for creating classes
  const handleCreateClass = async (request: CreateClassRequest) => {
    await createClass(request)
  }

  // Real API handler for updating classes
  const handleUpdateClass = async (id: number, request: UpdateClassRequest) => {
    await updateClass(id, request)
  }

  // Real API handler for deleting classes
  const handleDeleteClass = async (id: number) => {
    await deleteClass(id)
  }

  // This callback will be called by ClassManagementModal when user clicks Final Comments button
  const handleViewFinalComments = async (classItem: Class) => {
    setFinalCommentsModal({
      isOpen: true,
      classItem,
    })
    // Load final comments for this class
    await loadFinalComments(classItem.id)
  }

  const handleFinalCommentsClose = () => {
    setFinalCommentsModal({ isOpen: false })
    // Clear any error state when closing modal
    clearFinalCommentsError()
  }

  // Real API handler for creating final comments
  const handleCreateFinalComment = async (request: CreateFinalCommentRequest) => {
    await createFinalComment(request)
  }

  // Real API handler for updating final comments
  const handleUpdateFinalComment = async (id: number, request: UpdateFinalCommentRequest) => {
    await updateFinalComment(id, request)
  }

  // Real API handler for deleting final comments
  const handleDeleteFinalComment = async (id: number) => {
    await deleteFinalComment(id)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.onConfirm) {
      try {
        await deleteConfirm.onConfirm()
        setDeleteConfirm({ isOpen: false })
      } catch (error) {
        // Error is handled by useSubjects hook in SubjectList
        setDeleteConfirm({ isOpen: false })
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Commentator</h1>
        <p>Student Report Card Comment Management</p>
      </header>
      <main className="app-main">
        {showForm
          ? (
              <SubjectForm
                existingSubject={editingSubject}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )
          : (
              <SubjectList
                onAddSubject={handleAddSubject}
                onEdit={handleEditSubject}
                onDelete={handleDeleteRequest}
                onViewOutcomeComments={handleViewOutcomeComments}
                onViewPersonalizedComments={handleViewPersonalizedComments}
                onViewClasses={handleViewClasses}
              />
            )}
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Subject"
        message={`Are you sure you want to delete "${deleteConfirm.subjectName || 'this subject'}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      <OutcomeCommentsModal
        isOpen={outcomeCommentsModal.isOpen}
        entityData={outcomeCommentsModal.subjectItem || { id: 0, name: '', createdAt: '', updatedAt: '' }}
        outcomeComments={outcomeComments}
        onCreateComment={handleCreateOutcomeComment}
        onUpdateComment={handleUpdateOutcomeComment}
        onDeleteComment={handleDeleteOutcomeComment}
        loading={outcomeCommentsLoading}
        error={outcomeCommentsError}
        onClose={handleOutcomeCommentsClose}
      />

      <PersonalizedCommentsModal
        isOpen={personalizedCommentsModal.isOpen}
        entityData={personalizedCommentsModal.subjectItem || { id: 0, name: '', createdAt: '', updatedAt: '' }}
        personalizedComments={personalizedComments}
        onCreateComment={handleCreatePersonalizedComment}
        onUpdateComment={handleUpdatePersonalizedComment}
        onDeleteComment={handleDeletePersonalizedComment}
        loading={personalizedCommentsLoading}
        error={personalizedCommentsError}
        onClose={handlePersonalizedCommentsClose}
      />

      <ClassManagementModal
        isOpen={classManagementModal.isOpen}
        entityData={classManagementModal.subjectItem || { id: 0, name: '', createdAt: '', updatedAt: '' }}
        classes={classes}
        onCreateClass={handleCreateClass}
        onUpdateClass={handleUpdateClass}
        onDeleteClass={handleDeleteClass}
        onViewFinalComments={handleViewFinalComments}
        loading={classesLoading}
        error={classesError}
        onClose={handleClassManagementClose}
      />

      <FinalCommentsModal
        isOpen={finalCommentsModal.isOpen}
        entityData={finalCommentsModal.classItem || { id: 0, name: '', year: 2024, subjectId: 0, createdAt: '', updatedAt: '' }}
        finalComments={finalComments}
        onCreateComment={handleCreateFinalComment}
        onUpdateComment={handleUpdateFinalComment}
        onDeleteComment={handleDeleteFinalComment}
        loading={finalCommentsLoading}
        error={finalCommentsError}
        onClose={handleFinalCommentsClose}
      />
    </div>
  )
}

export default App
