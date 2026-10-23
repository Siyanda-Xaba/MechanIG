import { Stack } from 'expo-router';
import { ConnectivityProvider } from '../src/offline/ConnectivityContext';
import { MessagingProvider } from '../src/messaging/MessagingContext';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { UserProvider } from '../src/users/UserContext';
import { VehicleProvider } from '../src/vehicles/VehicleContext';
import '../src/components/IconFontBootstrap';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <UserProvider>
                <ConnectivityProvider>
                    <MessagingProvider>
                        <VehicleProvider>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    gestureEnabled: false,
                                }}
                            />
                        </VehicleProvider>
                    </MessagingProvider>
                </ConnectivityProvider>
            </UserProvider>
        </ThemeProvider>
    );
}
