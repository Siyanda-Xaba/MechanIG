import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConnectivityProvider } from '../src/offline/ConnectivityContext';
import { MessagingProvider } from '../src/messaging/MessagingContext';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { UserProvider } from '../src/users/UserContext';
import { VehicleProvider } from '../src/vehicles/VehicleContext';
import { useTheme } from '../src/theme/ThemeContext';
import '../src/components/IconFontBootstrap';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <ThemedAppShell />
        </ThemeProvider>
    );
}

function ThemedAppShell() {
    const { colors, mode } = useTheme();
    return (
        <>
            <StatusBar style={mode === 'light' ? 'dark' : 'light'} backgroundColor={colors.background} />
            <UserProvider>
                <ConnectivityProvider>
                    <MessagingProvider>
                        <VehicleProvider>
                            <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
                        </VehicleProvider>
                    </MessagingProvider>
                </ConnectivityProvider>
            </UserProvider>
        </>
    );
}
