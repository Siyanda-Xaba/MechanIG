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

export default function Index() {
  return <WelcomeScreen navigation={{ navigate: () => {} }} />;
}