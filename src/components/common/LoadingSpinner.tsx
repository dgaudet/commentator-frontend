/**
 * LoadingSpinner Component
 * Animated teacher character loading indicator with accessibility features
 *
 * Displays a friendly teacher character tapping a pencil during loading states.
 * Uses SVG animations for smooth 60fps performance.
 *
 * US-TOKEN-002: Migrated to design tokens for theme support
 */
import React from 'react'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography } from '../../theme/tokens'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  'data-testid'?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  'data-testid': dataTestId = 'loading-spinner',
}) => {
  const themeColors = useThemeColors()

  const sizeMap = {
    small: '48px',
    medium: '64px',
    large: '96px',
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.xl} 0`,
  }

  const svgSize = sizeMap[size]

  const textStyle: React.CSSProperties = {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: themeColors.text.secondary,
  }

  return (
    <>
      {/* Keyframe animations for teacher character */}
      <style>
        {`
          @keyframes tapping {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(2px, -3px);
            }
            50% {
              transform: translate(0, 0);
            }
            75% {
              transform: translate(-2px, -3px);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          @keyframes thinking {
            0% {
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            40% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 0;
            }
          }

          .teacher-figure {
            animation: tapping 1.8s ease-in-out infinite;
            transform-origin: center;
          }

          .thinking-indicator {
            animation: thinking 1.8s ease-in-out infinite;
          }
        `}
      </style>
      <div
        role="status"
        aria-live="polite"
        data-testid={dataTestId}
        style={containerStyle}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            animation: 'tapping 1.8s ease-in-out infinite',
          }}
        >
          {/* Main teacher figure with tapping animation */}
          <g className="teacher-figure">
            {/* Head */}
            <circle
              cx="50"
              cy="28"
              r="15"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hair */}
            <path
              d="M 35 22 Q 35 14 50 14 Q 65 14 65 22"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Eyes (engaged, thinking) */}
            <circle cx="44" cy="26" r="2" fill={themeColors.primary.main} />
            <circle cx="56" cy="26" r="2" fill={themeColors.primary.main} />

            {/* Thinking expression (eyebrows up) */}
            <path
              d="M 41 22 Q 44 20 47 22"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 53 22 Q 56 20 59 22"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Friendly smile */}
            <path
              d="M 44 31 Q 50 33 56 31"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Body/Torso */}
            <path
              d="M 39 40 L 39 58 Q 39 62 42 62 L 58 62 Q 61 62 61 58 L 61 40"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Left arm */}
            <path
              d="M 39 43 L 28 52"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right arm (extended with pencil) */}
            <path
              d="M 61 43 L 72 35"
              fill="none"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Pencil in right hand */}
            <line
              x1="72"
              y1="35"
              x2="82"
              y2="25"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Pencil point (eraser side) */}
            <path
              d="M 82 25 L 84 23"
              stroke={themeColors.primary.main}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill={themeColors.primary.main}
            />

            {/* Legs */}
            <line
              x1="45"
              y1="62"
              x2="45"
              y2="72"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="55"
              y1="62"
              x2="55"
              y2="72"
              stroke={themeColors.primary.main}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Thinking indicator (optional subtle motion) */}
          <g className="thinking-indicator">
            {/* Small dots above head indicating thought */}
            <circle cx="68" cy="18" r="1.5" fill={themeColors.primary.main} />
            <circle cx="73" cy="14" r="1.2" fill={themeColors.primary.main} />
            <circle cx="78" cy="12" r="1" fill={themeColors.primary.main} />
          </g>
        </svg>
        <p style={textStyle}>{message}</p>
      </div>
    </>
  )
}
