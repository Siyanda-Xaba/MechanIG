import HomeScreen from '../../src/superadmin/screens/HomeScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

export default function SuperAdminHomeRoute() {
  const navigation = useNav();

  return <HomeScreen navigation={navigation} />;
}
