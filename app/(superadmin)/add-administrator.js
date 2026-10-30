import ScreenWithBack from '../../src/superadmin/components/ScreenWithBack';
import AddAdministratorScreenImport from '../../src/superadmin/screens/AddAdministratorScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

const AddAdministratorScreen = AddAdministratorScreenImport;

export default function AddAdministrator() {
  const navigation = useNav();

  return (
    <ScreenWithBack
      title="Add Administrator"
      onBack={() => navigation.goBack()}
    >
      <AddAdministratorScreen onDone={() => navigation.goBack()} />
    </ScreenWithBack>
  );
}
