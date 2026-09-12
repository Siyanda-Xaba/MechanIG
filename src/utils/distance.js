const EARTH_RADIUS_KM = 6371;

const radians = (degrees) => (degrees * Math.PI) / 180;

export function distanceInKm(from, to) {
  
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}
