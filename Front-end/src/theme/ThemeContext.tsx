import {
  createContext,
  ReactNode,
  useContext,
} from 'react'

import { darkColors } from './colors'

type ThemeContextType = {
  colors: typeof darkColors
}

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  )

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ThemeContext.Provider
      value={{
        colors: darkColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    )
  }

  return context
}