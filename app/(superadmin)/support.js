import SupportScreenImport from '../../src/superadmin/screens/SupportScreen';
import ScreenWithBack from '../../src/superadmin/components/ScreenWithBack';
import { useNav } from '../../src/superadmin/hooks/useNav';

const SupportScreen = SupportScreenImport;

export default function Support() {
  const navigation = useNav();

  return (
    <ScreenWithBack title="Support Requests" onBack={() => navigation.goBack()}>
      <SupportScreen navigation={navigation} />
    </ScreenWithBack>
  );
}
