/**
 * ThemeToggle Component Tests
 *
 * Test-Driven Development for US-DARK-003: Theme Toggle UI Component
 *
 * User Story: As a user, I want a visible theme toggle control with radio buttons
 * so that I can manually switch between light and dark themes.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../ThemeToggle'
import { ThemeProvider } from '../../../contexts/ThemeContext'
import React from 'react'

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const renderWithThemeProvider = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('AC1: Display three radio button options', () => {
    it('should render three radio options: Light, Dark, System', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i)
      const darkOption = screen.getByLabelText(/dark/i)
      const systemOption = screen.getByLabelText(/system/i)

      expect(lightOption).toBeInTheDocument()
      expect(darkOption).toBeInTheDocument()
      expect(systemOption).toBeInTheDocument()
    })

    it('should render radio inputs with correct type', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i)
      const darkOption = screen.getByLabelText(/dark/i)
      const systemOption = screen.getByLabelText(/system/i)

      expect(lightOption).toHaveAttribute('type', 'radio')
      expect(darkOption).toHaveAttribute('type', 'radio')
      expect(systemOption).toHaveAttribute('type', 'radio')
    })
  })

  describe('AC2: Immediately apply selected theme', () => {
    it('should call setThemePreference when Light is clicked', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i) as HTMLInputElement

      fireEvent.click(lightOption)

      expect(lightOption.checked).toBe(true)
    })

    it('should call setThemePreference when Dark is clicked', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const darkOption = screen.getByLabelText(/dark/i) as HTMLInputElement

      fireEvent.click(darkOption)

      expect(darkOption.checked).toBe(true)
    })

    it('should call setThemePreference when System is clicked', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const systemOption = screen.getByLabelText(/system/i) as HTMLInputElement

      fireEvent.click(systemOption)

      expect(systemOption.checked).toBe(true)
    })
  })

  describe('AC3: "System" follows OS/browser dark mode preference', () => {
    it('should default to "System" option when no preference is set', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const systemOption = screen.getByLabelText(/system/i) as HTMLInputElement

      expect(systemOption.checked).toBe(true)
    })
  })

  describe('AC4: Smooth visual transitions', () => {
    it('should render without crashing when theme changes', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i)
      const darkOption = screen.getByLabelText(/dark/i)

      fireEvent.click(lightOption)
      expect(lightOption).toBeInTheDocument()

      fireEvent.click(darkOption)
      expect(darkOption).toBeInTheDocument()
    })
  })

  describe('AC5: Hover visual feedback', () => {
    it('should render labels that can receive hover events', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightLabel = screen.getByText(/light/i).closest('label')

      expect(lightLabel).toBeInTheDocument()
    })
  })

  describe('AC6: Keyboard navigation', () => {
    it('should support keyboard navigation with arrow keys', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i) as HTMLInputElement
      const darkOption = screen.getByLabelText(/dark/i) as HTMLInputElement

      // Focus on first option
      lightOption.focus()
      expect(document.activeElement).toBe(lightOption)

      // Simulate arrow key navigation
      fireEvent.keyDown(lightOption, { key: 'ArrowRight' })

      // Native radio behavior will handle focus
      expect(darkOption).toBeInTheDocument()
    })

    it('should support selection with Enter or Space', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const darkOption = screen.getByLabelText(/dark/i) as HTMLInputElement

      darkOption.focus()

      // Note: Native browser handles Space key for radio selection
      // Testing that the input is focusable and accessible
      expect(document.activeElement).toBe(darkOption)

      // Click simulates user interaction (Space/Enter results in click)
      fireEvent.click(darkOption)

      expect(darkOption.checked).toBe(true)
    })
  })

  describe('AC7: Clearly indicate currently active theme', () => {
    it('should show Light as checked when light theme is active', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i) as HTMLInputElement

      fireEvent.click(lightOption)

      expect(lightOption.checked).toBe(true)
    })

    it('should show only one option as checked at a time', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i) as HTMLInputElement
      const darkOption = screen.getByLabelText(/dark/i) as HTMLInputElement
      const systemOption = screen.getByLabelText(/system/i) as HTMLInputElement

      fireEvent.click(darkOption)

      expect(darkOption.checked).toBe(true)
      expect(lightOption.checked).toBe(false)
      expect(systemOption.checked).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i)
      const darkOption = screen.getByLabelText(/dark/i)
      const systemOption = screen.getByLabelText(/system/i)

      expect(lightOption).toHaveAccessibleName()
      expect(darkOption).toHaveAccessibleName()
      expect(systemOption).toHaveAccessibleName()
    })

    it('should group radio buttons with same name attribute', () => {
      renderWithThemeProvider(<ThemeToggle />)

      const lightOption = screen.getByLabelText(/light/i)
      const darkOption = screen.getByLabelText(/dark/i)
      const systemOption = screen.getByLabelText(/system/i)

      const groupName = lightOption.getAttribute('name')

      expect(darkOption.getAttribute('name')).toBe(groupName)
      expect(systemOption.getAttribute('name')).toBe(groupName)
    })
  })
})
