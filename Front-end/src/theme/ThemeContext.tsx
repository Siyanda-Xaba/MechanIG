import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { darkColors, lightColors } from './colors'

type ThemeMode = 'light' | 'dark'

type ThemeContextType = {
  theme: ThemeMode
  colors: typeof darkColors
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'mechaniq-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark')

  useEffect(() => {
    loadTheme()
  }, [])

  async function loadTheme() {
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme)
    }
  }

  async function setTheme(newTheme: ThemeMode) {
    setThemeState(newTheme)
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}