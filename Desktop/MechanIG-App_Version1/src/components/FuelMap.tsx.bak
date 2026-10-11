import {
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import MapView, {
  Marker,
  Polyline,
  type LatLng,
  type Region,
} from 'react-native-maps'

import { useTheme } from '../theme/ThemeContext'
import type {
  FuelStation,
} from '../customer/fuelTypes'

export type FuelMapCoordinate = {
  latitude: number
  longitude: number
}

type FuelMapProps = {
  customerLocation: FuelMapCoordinate | null

  stations?: FuelStation[]

  deliveryVehicleLocation?:
    | FuelMapCoordinate
    | null

  routeCoordinates?: FuelMapCoordinate[]

  isLoading?: boolean
  errorMessage?: string | null

  height?: number

  onStationPress?: (
    station: FuelStation
  ) => void
}

function isValidCoordinate(
  latitude: number | null,
  longitude: number | null
) {
  return (
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  )
}

function createInitialRegion(
  customerLocation: FuelMapCoordinate | null,
  deliveryVehicleLocation:
    | FuelMapCoordinate
    | null,
  stations: FuelStation[]
): Region | null {
  if (customerLocation) {
    return {
      latitude:
        customerLocation.latitude,
      longitude:
        customerLocation.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }
  }

  if (deliveryVehicleLocation) {
    return {
      latitude:
        deliveryVehicleLocation.latitude,
      longitude:
        deliveryVehicleLocation.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }
  }

  const firstStation =
    stations.find((station) =>
      isValidCoordinate(
        station.latitude,
        station.longitude
      )
    )

  if (
    firstStation?.latitude !== null &&
    firstStation?.latitude !== undefined &&
    firstStation.longitude !== null &&
    firstStation.longitude !== undefined
  ) {
    return {
      latitude: firstStation.latitude,
      longitude: firstStation.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }
  }

  return null
}

export default function FuelMap({
  customerLocation,
  stations = [],
  deliveryVehicleLocation = null,
  routeCoordinates = [],
  isLoading = false,
  errorMessage = null,
  height = 300,
  onStationPress,
}: FuelMapProps) {
  const { colors } = useTheme()

  const initialRegion =
    createInitialRegion(
      customerLocation,
      deliveryVehicleLocation,
      stations
    )

  const mappedStations =
    stations.filter((station) =>
      isValidCoordinate(
        station.latitude,
        station.longitude
      )
    )

  if (isLoading) {
    return (
      <View
        style={[
          styles.stateContainer,
          {
            height,
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="map-marker-radius-outline"
          size={32}
          color={colors.accent}
        />

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Loading map
        </Text>

        <Text
          style={[
            styles.stateMessage,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Getting location information...
        </Text>
      </View>
    )
  }

  if (errorMessage) {
    return (
      <View
        style={[
          styles.stateContainer,
          {
            height,
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="map-marker-alert-outline"
          size={32}
          color={colors.danger}
        />

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Map unavailable
        </Text>

        <Text
          style={[
            styles.stateMessage,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {errorMessage}
        </Text>
      </View>
    )
  }

  if (!initialRegion) {
    return (
      <View
        style={[
          styles.stateContainer,
          {
            height,
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="crosshairs-question"
          size={32}
          color={colors.accent}
        />

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Location required
        </Text>

        <Text
          style={[
            styles.stateMessage,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Location information is needed
          to display this map.
        </Text>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.mapContainer,
        {
          height,
          borderColor: colors.border,
        },
      ]}
    >
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass
        showsScale={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {customerLocation ? (
          <Marker
            coordinate={
              customerLocation
            }
            title="Your Location"
            description="Fuel delivery destination"
            zIndex={3}
          >
            <View
              style={[
                styles.marker,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={18}
                color={colors.accent}
              />
            </View>
          </Marker>
        ) : null}

        {mappedStations.map(
          (station) => {
            const coordinate: LatLng = {
              latitude:
                station.latitude as number,
              longitude:
                station.longitude as number,
            }

            return (
              <Marker
                key={station.id}
                coordinate={coordinate}
                title={station.name}
                description={
                  station.address ??
                  (station.distanceKm !==
                    null
                    ? `${station.distanceKm} km away`
                    : undefined)
                }
                onPress={() => {
                  onStationPress?.(
                    station
                  )
                }}
                zIndex={1}
              >
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.electricBlue,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="gas-station"
                    size={18}
                    color={
                      colors.electricBlue
                    }
                  />
                </View>
              </Marker>
            )
          }
        )}

        {deliveryVehicleLocation ? (
          <Marker
            coordinate={
              deliveryVehicleLocation
            }
            title="Fuel Delivery"
            description="Delivery vehicle location"
            zIndex={4}
          >
            <View
              style={[
                styles.deliveryMarker,
                {
                  backgroundColor:
                    colors.accent,
                  borderColor:
                    colors.background,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={19}
                color="#000000"
              />
            </View>
          </Marker>
        ) : null}

        {routeCoordinates.length >=
        2 ? (
          <Polyline
            coordinates={
              routeCoordinates
            }
            strokeColor={colors.accent}
            strokeWidth={4}
          />
        ) : null}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 14,
  },

  map: {
    ...StyleSheet.absoluteFill,
  },

  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deliveryMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  stateTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  stateMessage: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
})