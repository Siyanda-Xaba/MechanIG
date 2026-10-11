import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, } from 'react';
import { darkColors } from './colors';
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children, }) {
    return (_jsx(ThemeContext.Provider, { value: {
            colors: darkColors,
        }, children: children }));
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return context;
}
