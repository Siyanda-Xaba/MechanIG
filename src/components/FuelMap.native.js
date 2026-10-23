import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../theme/ThemeContext';

function isValidCoordinate(coordinate) {
  return coordinate != null
    && Number.isFinite(Number(coordinate.latitude))
    && Number.isFinite(Number(coordinate.longitude))
    && Math.abs(Number(coordinate.latitude)) <= 90
    && Math.abs(Number(coordinate.longitude)) <= 180;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function createMapDocument(customer, stations, deliveryVehicle, routeCoordinates) {
  const mapData = {
    customer: isValidCoordinate(customer) ? { latitude: Number(customer.latitude), longitude: Number(customer.longitude) } : null,
    deliveryVehicle: isValidCoordinate(deliveryVehicle) ? { latitude: Number(deliveryVehicle.latitude), longitude: Number(deliveryVehicle.longitude) } : null,
    stations: stations.filter(isValidCoordinate).map((station) => ({
      name: escapeHtml(station.name),
      area: escapeHtml(station.area),
      address: escapeHtml(station.address),
      distanceKm: station.distanceKm,
      latitude: Number(station.latitude),
      longitude: Number(station.longitude),
    })),
    route: routeCoordinates.filter(isValidCoordinate).map((point) => [Number(point.latitude), Number(point.longitude)]),
  };
  const serializedMapData = JSON.stringify(mapData).replace(/</g, '\\u003c');

  return `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" onerror="this.onerror=null;this.href='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'">
<style>
  html,body,#map{height:100%;width:100%;margin:0;background:#edf1f4}
  .leaflet-popup-content{font:14px Arial,sans-serif;line-height:1.45}
  .leaflet-container{font:12px Arial,sans-serif}
  .map-legend{position:absolute;z-index:1000;top:12px;left:12px;padding:9px 11px;border-radius:10px;background:#fff;box-shadow:0 2px 12px #17212b30;color:#24313c;font:12px Arial,sans-serif}
  .legend-row{display:flex;align-items:center;gap:7px;white-space:nowrap}.legend-row+.legend-row{margin-top:6px}
  .legend-dot{width:11px;height:11px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 0 1px #2563eb}
  .legend-pump{width:16px;height:16px;border-radius:50%;background:#0b8f83;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:10px}
  .map-marker-wrap{background:transparent;border:0}
  .station-pin{box-sizing:border-box;width:38px;height:38px;border:2px solid #fff;border-radius:50% 50% 50% 0;background:#07877d;box-shadow:0 3px 9px #102a3560;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center}
  .station-pin svg{width:21px;height:21px;transform:rotate(45deg)}
  .user-pin{width:24px;height:24px;border:3px solid #fff;border-radius:50%;background:#2563eb;box-shadow:0 2px 8px #102a3570;display:flex;align-items:center;justify-content:center}
  .user-pin svg{width:14px;height:14px}
  .delivery-pin{width:32px;height:32px;border:2px solid #fff;border-radius:50%;background:#f5c542;box-shadow:0 2px 8px #102a3570;display:flex;align-items:center;justify-content:center;font-size:17px}
</style>
</head><body>
<div id="map"></div>
<div class="map-legend"><div class="legend-row"><span class="legend-pump">⛽</span><span>Fuel stations (${mapData.stations.length})</span></div><div class="legend-row"><span class="legend-dot"></span><span>Your location</span></div></div>
<script>
const data=${serializedMapData};
function loadLeaflet(){const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=drawMap;script.onerror=()=>{const fallback=document.createElement('script');fallback.src='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';fallback.onload=drawMap;fallback.onerror=()=>window.ReactNativeWebView?.postMessage('map-error');document.head.appendChild(fallback)};document.head.appendChild(script)}
function drawMap(){
  if(!window.L){window.ReactNativeWebView?.postMessage('map-error');return}
  const map=L.map('map',{zoomControl:true,preferCanvas:true});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19,subdomains:'abcd',detectRetina:true,attribution:'© OpenStreetMap contributors © CARTO'}).addTo(map);
  const points=[];
  const stationIcon=L.divIcon({className:'map-marker-wrap',html:'<div class="station-pin"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M19 8h-1V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16h12v-6h1v6h2V9a1 1 0 0 0-1-1ZM14 18H6v-5h8v5Zm0-7H6V4h8v7Zm5-3.5-1.4-1.4-1.1 1.1L18 8.7V12h2V9a2 2 0 0 0-1-1.5Z"/></svg></div>',iconSize:[38,46],iconAnchor:[19,46],popupAnchor:[0,-42]});
  const userIcon=L.divIcon({className:'map-marker-wrap',html:'<div class="user-pin"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"/></svg></div>',iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-14]});
  if(data.customer){const p=[data.customer.latitude,data.customer.longitude];points.push(p);L.marker(p,{icon:userIcon,zIndexOffset:1000}).addTo(map).bindPopup('<b>Your location</b>')}
  data.stations.forEach(station=>{const p=[station.latitude,station.longitude];points.push(p);const title=station.name+(station.area?' · '+station.area:'');const address=station.address?'<br>'+station.address:'';const distance=station.distanceKm!=null?'<br>'+Number(station.distanceKm).toFixed(1)+' km away':'';L.marker(p,{icon:stationIcon}).addTo(map).bindPopup('<b>'+title+'</b>'+address+distance)});
  if(data.deliveryVehicle){const p=[data.deliveryVehicle.latitude,data.deliveryVehicle.longitude];points.push(p);const icon=L.divIcon({className:'map-marker-wrap',html:'<div class="delivery-pin">🚚</div>',iconSize:[36,36],iconAnchor:[18,18]});L.marker(p,{icon,zIndexOffset:1200}).addTo(map).bindPopup('<b>Fuel delivery vehicle</b>')}
  if(data.route.length>1){L.polyline(data.route,{color:'#2563eb',weight:4,opacity:.85}).addTo(map);points.push(...data.route)}
  if(points.length>1)map.fitBounds(points,{padding:[48,48],maxZoom:15});else if(points.length===1)map.setView(points[0],14);else map.setView([-26.2041,28.0473],12);
  requestAnimationFrame(()=>map.invalidateSize());setTimeout(()=>map.invalidateSize(),400);
}
loadLeaflet();
</script></body></html>`;
}

export default function FuelMap({
  customerLocation,
  stations = [],
  deliveryVehicleLocation = null,
  routeCoordinates = [],
  isLoading = false,
  errorMessage = null,
  height = 300,
}) {
  const { colors } = useTheme();
  const [webViewError, setWebViewError] = useState(false);
  const focus = isValidCoordinate(customerLocation)
    ? customerLocation
    : stations.find(isValidCoordinate)
      || (isValidCoordinate(deliveryVehicleLocation) ? deliveryVehicleLocation : null);
  const mapDocument = useMemo(
    () => createMapDocument(customerLocation, stations, deliveryVehicleLocation, routeCoordinates),
    [customerLocation, stations, deliveryVehicleLocation, routeCoordinates],
  );

  if (isLoading || errorMessage || !focus || webViewError) {
    const title = isLoading ? 'Loading map' : errorMessage || !focus ? 'Location required' : 'Map unavailable';
    const message = isLoading
      ? 'Getting location information...'
      : webViewError
        ? 'The map could not load. Check your internet connection and try again.'
        : errorMessage || 'Location information is needed to display this map.';
    return (
      <View style={[styles.stateContainer, { height, backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialCommunityIcons name={webViewError ? 'map-marker-alert-outline' : 'map-marker-radius-outline'} size={32} color={webViewError ? colors.danger : colors.accent} />
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, borderColor: colors.border }]}>
      <WebView
        source={{ html: mapDocument }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(event) => {
          if (event.nativeEvent.data === 'map-error') setWebViewError(true);
        }}
        onError={() => setWebViewError(true)}
        style={styles.webView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden', borderWidth: 1, borderRadius: 14 },
  webView: { flex: 1, backgroundColor: 'transparent' },
  stateContainer: { width: '100%', borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { marginTop: 10, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  message: { marginTop: 5, fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
