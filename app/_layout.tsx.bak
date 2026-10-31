import { Stack } from 'expo-router'

import { ThemeProvider } from '../src/theme/ThemeContext'
import { UserProvider } from '../src/users/UserContext'
import { VehicleProvider } from '../src/vehicles/VehicleContext'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <VehicleProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </VehicleProvider>
      </UserProvider>
    </ThemeProvider>
  )
}