import ScreenWithBack from '../../src/superadmin/components/ScreenWithBack';
import AddRoleScreenImport from '../../src/superadmin/screens/AddRoleScreen';
import { useNav } from '../../src/superadmin/hooks/useNav';

const AddRoleScreen = AddRoleScreenImport;

export default function AddRole() {
  const navigation = useNav();

  return (
    <ScreenWithBack title="Add Role" onBack={() => navigation.goBack()}>
      <AddRoleScreen onDone={() => navigation.goBack()} />
    </ScreenWithBack>
  );
}
