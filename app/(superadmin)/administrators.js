import AdministratorsScreenImport from '../../src/superadmin/screens/AdministratorsScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

const AdministratorsScreen = AdministratorsScreenImport;

export default function Administrators() {
  const navigation = useNav();

  return (
    <AdministratorsScreen
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNavigate={(name) => navigation.navigate(name)}
    />
  );
}
