import SettingsScreenImport from '../../src/superadmin/screens/SettingsScreen';
import ScreenWithBack from '../../src/superadmin/components/ScreenWithBack';
import { useNav } from '../../src/superadmin/hooks/useNav';

const SettingsScreen = SettingsScreenImport;

export default function Settings() {
  const navigation = useNav();

  return (
    <ScreenWithBack title="Platform Settings" onBack={() => navigation.goBack()}>
      <SettingsScreen navigation={navigation} />
    </ScreenWithBack>
  );
}
