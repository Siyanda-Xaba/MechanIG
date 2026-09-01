import { StyleSheet, View } from 'react-native'

import Vehicle3DViewer from '../../src/components/Vehicle3DViewer'
import { getVehicleModelSource } from '../../src/vehicles/modelRegistry'
import { useTheme } from '../../src/theme/ThemeContext'

export default function CustomerHome() {
  const { colors } = useTheme()

  const bmwModel = getVehicleModelSource('bmw-320i')

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Vehicle3DViewer
        modelSource={bmwModel}
        height={300}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})