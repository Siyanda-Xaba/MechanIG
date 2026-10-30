import { Stack } from 'expo-router';
import SuperAdminGuard from '../../src/superadmin/SuperAdminGuard';

export default function SuperAdminLayout() {
  return (
    <SuperAdminGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </SuperAdminGuard>
  );
}
