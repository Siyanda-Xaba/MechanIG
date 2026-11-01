import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import FuelMap from '../src/components/FuelMap';
import { getPictureSearchEndpoint, getPictureSearchAuthHeaders } from '../src/config/pictureSearchApi';
import { useForegroundLocation } from '../src/location/useForegroundLocation';
import { useTheme } from '../src/theme/ThemeContext';

export default function NearbyFuelStationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { location, isLoadingLocation, locationError, refreshLocation } = useForegroundLocation();
  const [stations, setStations] = useState([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [stationError, setStationError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    if (!location) {
      return () => { active = false; };
    }
    Promise.resolve().then(async () => {
      if (active) {
        setIsLoadingStations(true);
        setStationError(null);
      }
      return fetch(getPictureSearchEndpoint('/api/v1/nearby-fuel-stations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...await getPictureSearchAuthHeaders() },
        body: JSON.stringify({ location }),
      });
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.error || 'Nearby fuel stations could not be loaded.');
        return payload;
      })
      .then((payload) => {
        if (!active) return;
        setStations(payload.stations || []);
        setStationError(payload.notice || null);
      })
      .catch((error) => {
        if (active) setStationError(error instanceof Error ? error.message : 'Nearby fuel stations could not be loaded.');
      })
      .finally(() => { if (active) setIsLoadingStations(false); });
    return () => { active = false; };
  }, [location, retryCount]);

  const openStation = (station) => {
    if (station.googleMapsUrl) Linking.openURL(station.googleMapsUrl).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StableScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.dismissTo('/fuel')} style={[styles.headerButton, { borderColor: colors.border }]}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Nearby Stations</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Fuel Stations Near You</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Nearby petrol stations are sorted by distance from your current location.
        </Text>

        <View style={styles.mapSection}>
          <FuelMap
            customerLocation={location}
            stations={stations}
            isLoading={isLoadingLocation || isLoadingStations}
            errorMessage={locationError}
            height={330}
            onStationPress={openStation}
          />
        </View>

        {locationError ? (
          <TouchableOpacity activeOpacity={0.75} onPress={refreshLocation} style={[styles.retryButton, { backgroundColor: colors.accent }]}>
            <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#000000" />
            <Text style={styles.retryButtonText}>Try Location Again</Text>
          </TouchableOpacity>
        ) : null}

        {!locationError && isLoadingStations ? (
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ActivityIndicator color={colors.accent} />
            <Text style={[styles.statusText, { color: colors.secondaryText }]}>Searching for nearby fuel stations…</Text>
          </View>
        ) : null}

        {!locationError && !isLoadingStations && stationError ? (
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="gas-station-off-outline" size={32} color={colors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Stations unavailable</Text>
            <Text style={[styles.emptyDescription, { color: colors.secondaryText }]}>{stationError}</Text>
            <TouchableOpacity activeOpacity={0.75} onPress={() => setRetryCount((count) => count + 1)} style={[styles.retryButton, { backgroundColor: colors.accent }]}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {location && stations.length > 0 ? (
          <View style={styles.stationList}>
            <Text style={[styles.listTitle, { color: colors.text }]}>Stations nearby</Text>
            {stations.map((station) => (
              <TouchableOpacity key={station.id} activeOpacity={0.75} onPress={() => openStation(station)} style={[styles.stationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <MaterialCommunityIcons name="gas-station" size={22} color={colors.accent} />
                <View style={styles.stationInfo}>
                  <Text style={[styles.stationName, { color: colors.text }]}>{station.name}</Text>
                  {station.area ? <Text style={[styles.stationArea, { color: colors.accent }]}>{station.area}</Text> : null}
                  {station.address ? <Text numberOfLines={2} style={[styles.stationAddress, { color: colors.secondaryText }]}>{station.address}</Text> : null}
                  <Text style={[styles.stationMeta, { color: colors.secondaryText }]}>
                    {station.distanceKm !== null ? `${station.distanceKm} km away` : 'Distance unavailable'}
                    {station.isOpen === true ? ' · Open' : station.isOpen === false ? ' · Closed' : ''}
                    {station.rating ? ` · ★ ${station.rating}` : ''}
                  </Text>
                  {station.phone ? <Text style={[styles.stationMeta, { color: colors.secondaryText }]}>{station.phone}</Text> : null}
                </View>
                <MaterialCommunityIcons name="open-in-new" size={18} color={colors.accent} />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerButton: { width: 38, height: 38, borderWidth: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerPlaceholder: { width: 38 },
  title: { marginTop: 14, fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, fontSize: 12, lineHeight: 18 },
  mapSection: { marginTop: 20 },
  retryButton: { minHeight: 42, marginTop: 12, paddingHorizontal: 16, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  retryButtonText: { color: '#000000', fontSize: 12, fontWeight: '700' },
  statusCard: { marginTop: 16, padding: 18, borderWidth: 1, borderRadius: 14, alignItems: 'center' },
  statusText: { marginTop: 8, fontSize: 12 },
  emptyTitle: { marginTop: 10, fontSize: 14, fontWeight: '700' },
  emptyDescription: { marginTop: 6, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  stationList: { marginTop: 22, gap: 10 },
  listTitle: { marginBottom: 2, fontSize: 16, fontWeight: '700' },
  stationCard: { padding: 12, borderWidth: 1, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 13, fontWeight: '700' },
  stationArea: { marginTop: 3, fontSize: 12, fontWeight: '700' },
  stationAddress: { marginTop: 3, fontSize: 10, lineHeight: 15 },
  stationMeta: { marginTop: 4, fontSize: 10 },
});
