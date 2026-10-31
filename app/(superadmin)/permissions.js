import PermissionsScreenImport from '../../src/superadmin/screens/PermissionsScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

const PermissionsScreen = PermissionsScreenImport;

export default function Permissions() {
  const navigation = useNav();

  return (
    <PermissionsScreen
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNavigate={(name) => navigation.navigate(name)}
    />
  );
}
