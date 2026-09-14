import { Stack } from 'expo-router'

import { CustomerHomeProvider } from '../../src/customer/CustomerHomeContext'

export default function CustomerActivityLayout() {
  return (
    <CustomerHomeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CustomerHomeProvider>
  )
}