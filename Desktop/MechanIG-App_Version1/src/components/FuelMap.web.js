import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

function validCoordinate(value) {
  return value && Number.isFinite(Number(value.latitude)) && Number.isFinite(Number(value.longitude));
}

function coordinateLabel(value) {
  return `${Number(value.latitude).toFixed(5)}, ${Number(value.longitude).toFixed(5)}`;
}

export default function FuelMap({
  customerLocation,
  stations = [],
  deliveryVehicleLocation = null,
  isLoading = false,
  errorMessage = null,
  height = 300,
  onStationPress,
}) {
  const { colors } = useTheme();
  const customer = validCoordinate(customerLocation) ? customerLocation : null;
  const driver = validCoordinate(deliveryVehicleLocation) ? deliveryVehicleLocation : null;
  const mappedStations = stations.filter(validCoordinate);
  const focus = driver || customer || mappedStations[0] || null;

  if (isLoading || errorMessage || !focus) {
    const title = isLoading ? 'Loading map' : errorMessage ? 'Map unavailable' : 'Location required';
    const message = isLoading ? 'Getting location information...' : errorMessage || 'Location information is needed to display this map.';
    return (
      <View style={[styles.stateContainer, { height, backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialCommunityIcons name={errorMessage ? 'map-marker-alert-outline' : 'map-marker-radius-outline'} size={32} color={errorMessage ? colors.danger : colors.accent} />
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>{message}</Text>
      </View>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/?mlat=${focus.latitude}&mlon=${focus.longitude}#map=15/${focus.latitude}/${focus.longitude}`;
  return (
    <View style={[styles.container, { minHeight: height, backgroundColor: colors.card, borderColor: colors.border }]}>
      <MaterialCommunityIcons name="map-marker-radius-outline" size={40} color={colors.accent} />
      <Text style={[styles.title, { color: colors.text }]}>Location overview</Text>
      {customer ? <Text style={[styles.location, { color: colors.secondaryText }]}>Delivery: {coordinateLabel(customer)}</Text> : null}
      {driver ? <Text style={[styles.location, { color: colors.secondaryText }]}>Driver: {coordinateLabel(driver)}</Text> : null}
      {mappedStations.map((station) => (
        <TouchableOpacity key={station.id} onPress={() => onStationPress?.(station)} style={[styles.station, { borderColor: colors.border }]}>
          <MaterialCommunityIcons name="gas-station" size={18} color={colors.accent} />
          <Text style={[styles.stationText, { color: colors.text }]}>{station.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity accessibilityRole="link" onPress={() => Linking.openURL(mapUrl)} style={[styles.button, { backgroundColor: colors.accent }]}>
        <MaterialCommunityIcons name="open-in-new" size={18} color="#000000" />
        <Text style={styles.buttonText}>Open interactive map</Text>
      </TouchableOpacity>
      <Text style={[styles.note, { color: colors.secondaryText }]}>Interactive in-app maps are available on Android and iOS.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', padding: 22, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stateContainer: { width: '100%', paddingHorizontal: 24, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 10, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  message: { marginTop: 5, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  location: { marginTop: 7, fontSize: 11 },
  station: { width: '100%', marginTop: 10, padding: 10, borderWidth: 1, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 8 },
  stationText: { flex: 1, fontSize: 11, fontWeight: '600' },
  button: { minHeight: 42, marginTop: 18, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  buttonText: { color: '#000000', fontSize: 11, fontWeight: '700' },
  note: { marginTop: 10, fontSize: 9, textAlign: 'center' },
});
