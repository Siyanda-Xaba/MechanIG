import ProfileScreen from '../../src/superadmin/screens/ProfileScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';
import { useRouter } from 'expo-router';
import { signOutUser } from '../../src/auth/authService';

export default function Profile() {
  const navigation = useNav();
  const router = useRouter();

  async function handleLogout() {
    await signOutUser();
    router.replace('/auth/login');
  }

  return (
    <ProfileScreen
      navigation={navigation}
      onLogout={handleLogout}
    />
  );
}
