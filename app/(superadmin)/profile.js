import ProfileScreen from '../../src/superadmin/screens/ProfileScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

export default function Profile() {
  const navigation = useNav();

  return (
    <ProfileScreen
      navigation={navigation}
      onLogout={() => navigation.navigate('Home')}
    />
  );
}
