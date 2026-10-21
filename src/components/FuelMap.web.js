import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

function validCoordinate(value) {
  return value
    && Number.isFinite(Number(value.latitude))
    && Number.isFinite(Number(value.longitude))
    && Math.abs(Number(value.latitude)) <= 90
    && Math.abs(Number(value.longitude)) <= 180;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function createMapDocument(customer, stations) {
  const mapStations = stations.filter((station) => validCoordinate(station));
  const serialized = JSON.stringify({
    customer: customer ? { latitude: Number(customer.latitude), longitude: Number(customer.longitude) } : null,
    stations: mapStations.map((station) => ({
      name: escapeHtml(station.name),
      area: escapeHtml(station.area),
      address: escapeHtml(station.address),
      distanceKm: station.distanceKm,
      latitude: Number(station.latitude),
      longitude: Number(station.longitude),
    })),
  }).replace(/</g, '\\u003c');

  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;width:100%;margin:0} .leaflet-popup-content{font:14px Arial,sans-serif}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>const data=${serialized};const points=[];const map=L.map('map',{zoomControl:true});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);if(data.customer){const p=[data.customer.latitude,data.customer.longitude];points.push(p);L.circleMarker(p,{radius:8,color:'#ffffff',weight:2,fillColor:'#246BFD',fillOpacity:1}).addTo(map).bindPopup('<b>Your location</b>')}data.stations.forEach(s=>{const p=[s.latitude,s.longitude];points.push(p);const title=s.name+(s.area?' · '+s.area:'');const address=s.address?'<br>'+s.address:'';const distance=s.distanceKm!=null?'<br>'+Number(s.distanceKm).toFixed(1)+' km away':'';L.circleMarker(p,{radius:8,color:'#ffffff',weight:2,fillColor:'#13A89E',fillOpacity:1}).addTo(map).bindPopup('<b>'+title+'</b>'+address+distance)});if(points.length>1){map.fitBounds(points,{padding:[28,28],maxZoom:15})}else if(points.length===1){map.setView(points[0],14)}else{map.setView([-26.2041,28.0473],12)}setTimeout(()=>map.invalidateSize(),100)</script></body></html>`;
}

export default function FuelMap({
  customerLocation,
  stations = [],
  deliveryVehicleLocation = null,
  isLoading = false,
  errorMessage = null,
  height = 300,
}) {
  const { colors } = useTheme();
  const customer = validCoordinate(customerLocation) ? customerLocation : null;
  const mappedStations = stations.filter((station) => validCoordinate(station));
  const focus = customer || mappedStations[0] || (validCoordinate(deliveryVehicleLocation) ? deliveryVehicleLocation : null);

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

  return (
    <View style={[styles.container, { height, backgroundColor: colors.card, borderColor: colors.border }]}>
      {createElement('iframe', {
        title: 'Nearby fuel stations map',
        srcDoc: createMapDocument(customer, mappedStations),
        loading: 'lazy',
        referrerPolicy: 'no-referrer',
        style: { display: 'block', width: '100%', height: '100%', border: 0 },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden', borderWidth: 1, borderRadius: 14 },
  stateContainer: { width: '100%', borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { marginTop: 10, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  message: { marginTop: 5, fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
