import { Stack } from 'expo-router'

import { ThemeProvider } from '../src/theme/ThemeContext'
import { VehicleProvider } from '../src/vehicles/VehicleContext'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <VehicleProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </VehicleProvider>
    </ThemeProvider>
  )
}