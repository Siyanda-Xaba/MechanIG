import MarketplaceScreenImport from '../../src/superadmin/screens/MarketplaceScreen';
import ScreenWithBack from '../../src/superadmin/components/ScreenWithBack';
import { useNav } from '../../src/superadmin/hooks/useNav';

const MarketplaceScreen = MarketplaceScreenImport;

export default function Marketplace() {
  const navigation = useNav();

  return (
    <ScreenWithBack title="Marketplace" onBack={() => navigation.goBack()}>
      <MarketplaceScreen navigation={navigation} />
    </ScreenWithBack>
  );
}
