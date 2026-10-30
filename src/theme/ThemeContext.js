import { jsx as _jsx } from 'react/jsx-runtime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { darkColors, lightColors } from './colors';

const THEME_MODE_KEY = 'mechaniq-theme-mode';
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState('dark');

    useEffect(() => {
        let mounted = true;
        AsyncStorage.getItem(THEME_MODE_KEY)
            .then((savedMode) => {
                if (mounted && (savedMode === 'light' || savedMode === 'dark')) setMode(savedMode);
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    const setThemeMode = useCallback(async (nextMode) => {
        const safeMode = nextMode === 'light' ? 'light' : 'dark';
        setMode(safeMode);
        try { await AsyncStorage.setItem(THEME_MODE_KEY, safeMode); } catch {}
    }, []);
    const toggleThemeMode = useCallback(() => setThemeMode(mode === 'dark' ? 'light' : 'dark'), [mode, setThemeMode]);
    const value = useMemo(() => ({
        mode,
        colors: mode === 'light' ? lightColors : darkColors,
        setThemeMode,
        toggleThemeMode,
    }), [mode, setThemeMode, toggleThemeMode]);

    return _jsx(ThemeContext.Provider, { value, children });
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context;
}
