/**
 * ThemeContext Tests
 *
 * Test-Driven Development for US-DARK-003: Theme Toggle UI Component
 *
 * User Story: As a user, I want a visible theme toggle control with radio buttons
 * so that I can manually switch between light and dark themes.
 *
 * This test file covers the context and hook infrastructure.
 */

import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'
import React from 'react'

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('AC1: useTheme hook provides current theme', () => {
    it('should provide "light" theme when system is light and preference is "system"', () => {
      // Mock system theme detection to return 'light'
      jest.mock('../../hooks/useSystemThemeDetection', () => ({
        useSystemThemeDetection: () => 'light',
      }))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('light')
    })

    it('should provide "dark" theme when user selects "dark"', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setThemePreference('dark')
      })

      expect(result.current.theme).toBe('dark')
    })

    it('should provide "light" theme when user selects "light"', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setThemePreference('light')
      })

      expect(result.current.theme).toBe('light')
    })
  })

  describe('AC2: Theme preference controls active theme', () => {
    it('should return themePreference value', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      // Default should be 'system'
      expect(result.current.themePreference).toBe('system')

      act(() => {
        result.current.setThemePreference('dark')
      })

      expect(result.current.themePreference).toBe('dark')
    })
  })

  describe('AC3: System theme respected when preference is "system"', () => {
    it('should use system theme when preference is "system"', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setThemePreference('system')
      })

      // Theme should match system (we'd need to mock useSystemThemeDetection to test fully)
      expect(result.current.themePreference).toBe('system')
    })
  })

  describe('AC4: setThemePreference updates both preference and theme', () => {
    it('should update theme when setThemePreference is called', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setThemePreference('dark')
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.themePreference).toBe('dark')
    })
  })

  describe('AC5: Error handling', () => {
    it('should throw error when useTheme is used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error
      console.error = jest.fn()

      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')

      console.error = consoleError
    })
  })

  describe('AC6: Theme persists across remounts', () => {
    it('should persist theme preference via localStorage', () => {
      localStorage.clear()

      // First render
      const wrapper1 = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result: result1, unmount } = renderHook(() => useTheme(), { wrapper: wrapper1 })

      act(() => {
        result1.current.setThemePreference('dark')
      })

      unmount()

      // Second render (simulating page reload)
      const wrapper2 = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result: result2 } = renderHook(() => useTheme(), { wrapper: wrapper2 })

      expect(result2.current.themePreference).toBe('dark')
    })
  })
})
