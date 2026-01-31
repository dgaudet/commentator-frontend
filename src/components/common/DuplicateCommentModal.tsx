/**
 * DuplicateCommentModal Component
 * Reusable modal for notifying users about duplicate comments
 * Used by both OutcomeCommentsModal and PersonalizedCommentsModal
 */

interface DuplicateCommentModalProps {
  isOpen: boolean
  existingComment: string
  commentType: 'outcome' | 'personalized'
  subjectName: string
  onCancel: () => void
}

export function DuplicateCommentModal({
  isOpen,
  existingComment,
  commentType,
  subjectName,
  onCancel,
}: DuplicateCommentModalProps): JSX.Element | null {
  if (!isOpen) {
    return null
  }

  const commentTypeLabel = commentType === 'outcome' ? 'outcome' : 'personalized'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <h2
          id="duplicate-modal-title"
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          Duplicate Comment Detected
        </h2>

        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            color: '#424242',
          }}
        >
          This
          {' '}
          {commentTypeLabel}
          {' '}
          comment already exists for
          {' '}
          &quot;
          {subjectName}
          &quot;
          :
        </p>

        <div
          data-testid="existing-comment-display"
          style={{
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #1976d2',
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#212121',
              lineHeight: '1.5',
            }}
          >
            {existingComment}
          </p>
        </div>

        <p
          style={{
            margin: '0 0 20px 0',
            fontSize: '13px',
            color: '#666666',
            fontStyle: 'italic',
          }}
        >
          Please edit the existing comment or enter a different comment.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1565c0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
