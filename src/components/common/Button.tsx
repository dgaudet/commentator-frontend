/**
 * Button Component
 * Reusable button with variants and accessibility features
 */
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  // US-STYLE-001 AC2: Modern blue button styling from test.webp
  // Accessibility: Using transparent borders that become visible in high-contrast mode
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '16px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#0066FF',
      color: '#FFFFFF',
      borderColor: '#0066FF',
    },
    secondary: {
      backgroundColor: '#E5E7EB',
      color: '#1F2937',
      borderColor: '#E5E7EB',
    },
    danger: {
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
      borderColor: '#DC2626',
    },
  }

  const hoverColors: Record<string, string> = {
    primary: '#0052CC',
    secondary: '#D1D5DB',
    danger: '#B91C1C',
  }

  return (
    <button
      type={type}
      className={className}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColors[variant]
        e.currentTarget.style.borderColor = hoverColors[variant]
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor as string
        e.currentTarget.style.borderColor = variantStyles[variant].borderColor as string
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      {...props}
    >
      {children}
    </button>
  )
}
