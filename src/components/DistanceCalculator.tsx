interface Location {
  latitude: number;
  longitude: number;
}

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const DistanceCalculator = (locationA: Location, locationB: Location): number => {
  const earthRadius = 6371;

  const latA = toRadians(locationA.latitude);
  const lonA = toRadians(locationA.longitude);
  const latB = toRadians(locationB.latitude);
  const lonB = toRadians(locationB.longitude);

  const dLon = lonB - lonA;
  const dLat = latB - latA;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance * 1000;
};

export default DistanceCalculator;