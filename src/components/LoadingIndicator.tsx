/**
 * LoadingIndicator Component
 *
 * Displays an animated teacher character during app initialization and API calls.
 * Can be controlled via visible prop or automatically via LoadingContext.
 *
 * Features:
 * - Minimalist line-art teacher character animation
 * - Gentle pencil-tapping motion (1.8 second smooth loop)
 * - Centered on screen, responsive
 * - WCAG AA accessible (aria-busy, role, aria-label)
 * - SVG-based for performance (<50KB)
 * - Supports controlled (via visible prop) and uncontrolled (via LoadingContext) modes
 *
 * Usage:
 * // Controlled mode (pass visible prop)
 * <LoadingIndicator visible={isLoading} />
 *
 * // Uncontrolled mode (uses LoadingContext automatically)
 * <LoadingIndicator />
 */

import { useLoading } from '../contexts/LoadingContext'

interface LoadingIndicatorProps {
  /**
   * Optional: Controls visibility of the loading indicator
   * When provided, displays the animation based on this prop
   * When not provided, uses LoadingContext to determine visibility
   * Can be true when: app is initializing OR any API call is in progress
   */
  visible?: boolean
}

export function LoadingIndicator({ visible }: LoadingIndicatorProps) {
  const { isLoading } = useLoading()

  // Use provided visible prop if given, otherwise use context
  const shouldShow = visible !== undefined ? visible : isLoading

  if (!shouldShow) {
    return null
  }

  return (
    <div
      data-testid="loading-indicator-container"
      role="status"
      aria-busy="true"
      aria-label="Application initializing, please wait"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'transparent',
      }}
    >
      <svg
        data-testid="loading-animation"
        width="64"
        height="64"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'tapping 1.8s ease-in-out infinite',
        }}
      >
        <defs>
          <style>{`
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
          `}</style>
        </defs>

        {/* Main teacher figure with tapping animation */}
        <g className="teacher-figure">
          {/* Head */}
          <circle cx="50" cy="28" r="15" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Hair */}
          <path d="M 35 22 Q 35 14 50 14 Q 65 14 65 22" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Eyes (engaged, thinking) */}
          <circle cx="44" cy="26" r="2" fill="#0066FF"/>
          <circle cx="56" cy="26" r="2" fill="#0066FF"/>

          {/* Thinking expression (eyebrows up) */}
          <path d="M 41 22 Q 44 20 47 22" fill="none" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 53 22 Q 56 20 59 22" fill="none" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round"/>

          {/* Friendly smile */}
          <path d="M 44 31 Q 50 33 56 31" fill="none" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Body/Torso */}
          <path d="M 39 40 L 39 58 Q 39 62 42 62 L 58 62 Q 61 62 61 58 L 61 40" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Left arm */}
          <path d="M 39 43 L 28 52" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Right arm (extended with pencil) */}
          <path d="M 61 43 L 72 35" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Pencil in right hand */}
          <line x1="72" y1="35" x2="82" y2="25" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Pencil point (eraser side) */}
          <path d="M 82 25 L 84 23" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" fill="#0066FF"/>

          {/* Legs */}
          <line x1="45" y1="62" x2="45" y2="72" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="55" y1="62" x2="55" y2="72" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round"/>
        </g>

        {/* Thinking indicator (optional subtle motion) */}
        <g className="thinking-indicator">
          {/* Small dots above head indicating thought */}
          <circle cx="68" cy="18" r="1.5" fill="#0066FF"/>
          <circle cx="73" cy="14" r="1.2" fill="#0066FF"/>
          <circle cx="78" cy="12" r="1" fill="#0066FF"/>
        </g>
      </svg>
    </div>
  )
}
