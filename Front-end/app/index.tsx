{/*import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
*/}
// app/index.tsx — TEMPORARY, for previewing only
import WelcomeScreen from './AuthenticationScreens/WelcomeScreen';
import LoginScreen from './AuthenticationScreens/LoginScreen';
import SignUp from './SignUpScreens/SignUp';
import HomeScreen from './AdminScreens/HomeScreen';
import MechanicScreen from './AdminScreens/MechanicScreen';
import ProifleScreen from './AdminScreens/ProifleScreen';
import UserScreen from './AdminScreens/UserScreen';
import OperationsScreen from './AdminScreens/OperationsScreen';


export default function Index() {
  return < OperationsScreen navigation={{ navigate: () => {} }} />;
}