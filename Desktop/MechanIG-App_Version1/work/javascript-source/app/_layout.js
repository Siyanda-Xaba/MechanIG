import { jsx as _jsx } from "react/jsx-runtime";
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { UserProvider } from '../src/users/UserContext';
import { VehicleProvider } from '../src/vehicles/VehicleContext';
export default function RootLayout() {
    return (_jsx(ThemeProvider, { children: _jsx(UserProvider, { children: _jsx(VehicleProvider, { children: _jsx(Stack, { screenOptions: {
                        headerShown: false,
                        gestureEnabled: false,
                    } }) }) }) }));
}
