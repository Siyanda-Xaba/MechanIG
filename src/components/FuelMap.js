import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons, } from '@expo/vector-icons';
import { StyleSheet, Text, View, } from 'react-native';
import MapView, { Marker, Polyline, } from 'react-native-maps';
import { useTheme } from '../theme/ThemeContext';
function isValidCoordinate(latitude, longitude) {
    return (latitude !== null &&
        longitude !== null &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180);
}
function createInitialRegion(customerLocation, deliveryVehicleLocation, stations) {
    if (customerLocation) {
        return {
            latitude: customerLocation.latitude,
            longitude: customerLocation.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        };
    }
    if (deliveryVehicleLocation) {
        return {
            latitude: deliveryVehicleLocation.latitude,
            longitude: deliveryVehicleLocation.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        };
    }
    const firstStation = stations.find((station) => isValidCoordinate(station.latitude, station.longitude));
    if (firstStation?.latitude !== null &&
        firstStation?.latitude !== undefined &&
        firstStation.longitude !== null &&
        firstStation.longitude !== undefined) {
        return {
            latitude: firstStation.latitude,
            longitude: firstStation.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        };
    }
    return null;
}
export default function FuelMap({ customerLocation, stations = [], deliveryVehicleLocation = null, routeCoordinates = [], isLoading = false, errorMessage = null, height = 300, onStationPress, }) {
    const { colors } = useTheme();
    const [mapInstance, setMapInstance] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const initialRegion = createInitialRegion(customerLocation, deliveryVehicleLocation, stations);
    const mappedStations = useMemo(() => stations.filter((station) => isValidCoordinate(station.latitude, station.longitude)), [stations]);
    const mapCoordinates = useMemo(() => [
        ...(isValidCoordinate(customerLocation?.latitude, customerLocation?.longitude) ? [customerLocation] : []),
        ...mappedStations.map((station) => ({ latitude: station.latitude, longitude: station.longitude })),
        ...(isValidCoordinate(deliveryVehicleLocation?.latitude, deliveryVehicleLocation?.longitude) ? [deliveryVehicleLocation] : []),
    ], [customerLocation, deliveryVehicleLocation, mappedStations]);
    const fitMapToMarkers = useCallback(() => {
        if (mapReady && mapCoordinates.length > 1) {
            mapInstance?.fitToCoordinates(mapCoordinates, {
                edgePadding: { top: 48, right: 40, bottom: 48, left: 40 },
                animated: true,
            });
        }
    }, [mapCoordinates, mapInstance, mapReady]);
    useEffect(() => {
        fitMapToMarkers();
    }, [fitMapToMarkers]);
    if (isLoading) {
        return (_jsxs(View, { style: [
                styles.stateContainer,
                {
                    height,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "map-marker-radius-outline", size: 32, color: colors.accent }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Loading map" }), _jsx(Text, { style: [
                        styles.stateMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Getting location information..." })] }));
    }
    if (errorMessage) {
        return (_jsxs(View, { style: [
                styles.stateContainer,
                {
                    height,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "map-marker-alert-outline", size: 32, color: colors.danger }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Map unavailable" }), _jsx(Text, { style: [
                        styles.stateMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: errorMessage })] }));
    }
    if (!initialRegion) {
        return (_jsxs(View, { style: [
                styles.stateContainer,
                {
                    height,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "crosshairs-question", size: 32, color: colors.accent }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Location required" }), _jsx(Text, { style: [
                        styles.stateMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Location information is needed to display this map." })] }));
    }
    return (_jsx(View, { style: [
            styles.mapContainer,
            {
                height,
                borderColor: colors.border,
            },
        ], children: _jsxs(MapView, { ref: setMapInstance, style: styles.map, initialRegion: initialRegion, onMapReady: () => setMapReady(true), showsCompass: true, showsScale: false, showsMyLocationButton: false, toolbarEnabled: false, children: [customerLocation ? (_jsx(Marker, { coordinate: customerLocation, title: "Your Location", description: "Fuel delivery destination", zIndex: 3, children: _jsx(View, { style: [
                            styles.marker,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.accent,
                            },
                        ], children: _jsx(MaterialCommunityIcons, { name: "account", size: 18, color: colors.accent }) }) })) : null, mappedStations.map((station) => {
                    const coordinate = {
                        latitude: station.latitude,
                        longitude: station.longitude,
                    };
                    return (_jsx(Marker, { coordinate: coordinate, title: [station.name, station.area].filter(Boolean).join(' · '), description: station.address ??
                            (station.distanceKm !==
                                null
                                ? `${station.distanceKm} km away`
                                : undefined), onPress: () => {
                            onStationPress?.(station);
                        }, zIndex: 1, children: _jsx(View, { style: [
                                styles.marker,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.electricBlue,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "gas-station", size: 18, color: colors.electricBlue }) }) }, station.id));
                }), deliveryVehicleLocation ? (_jsx(Marker, { coordinate: deliveryVehicleLocation, title: "Fuel Delivery", description: "Delivery vehicle location", zIndex: 4, children: _jsx(View, { style: [
                            styles.deliveryMarker,
                            {
                                backgroundColor: colors.accent,
                                borderColor: colors.background,
                            },
                        ], children: _jsx(MaterialCommunityIcons, { name: "truck-delivery-outline", size: 19, color: "#000000" }) }) })) : null, routeCoordinates.length >=
                    2 ? (_jsx(Polyline, { coordinates: routeCoordinates, strokeColor: colors.accent, strokeWidth: 4 })) : null] }) }));
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
});
