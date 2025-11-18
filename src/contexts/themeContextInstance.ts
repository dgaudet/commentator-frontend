/**
 * ThemeContext Instance
 *
 * US-DARK-003: Theme Toggle UI Component
 *
 * Exported separately to comply with React Fast Refresh rules.
 * The context instance must not be exported from the same file as the component.
 */

import { createContext } from 'react'
import { ThemeContextValue } from '../hooks/useTheme'

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
