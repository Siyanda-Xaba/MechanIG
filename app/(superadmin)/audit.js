import ScreenWithBack from '../../src/superadmin/components/ScreenWithBack';
import AuditScreenImport from '../../src/superadmin/screens/AuditScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

const AuditScreen = AuditScreenImport;

export default function Audit() {
  const navigation = useNav();

  return (
    <ScreenWithBack title="Audit Logs" onBack={() => navigation.goBack()}>
      <AuditScreen navigation={navigation} />
    </ScreenWithBack>
  );
}
