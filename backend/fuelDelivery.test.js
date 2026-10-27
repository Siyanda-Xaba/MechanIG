const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateDistanceKm, mechanicIsAvailable, nearbyMechanicSummary } = require('./fuelDelivery');

test('Haversine mechanic summaries sort nearest first', () => {
  const origin = { latitude: -26.2041, longitude: 28.0473 };
  const near = nearbyMechanicSummary('near', { role: 'mechanic', location: { latitude: -26.205, longitude: 28.048 }, serviceRadiusKm: 20 }, origin, () => 'Near');
  const far = nearbyMechanicSummary('far', { role: 'mechanic', location: { latitude: -26.3, longitude: 28.1 }, serviceRadiusKm: 20 }, origin, () => 'Far');
  assert.ok(near.distanceKm < far.distanceKm);
  assert.deepEqual([far, near].sort((a, b) => a.distanceKm - b.distanceKm).map((item) => item.id), ['near', 'far']);
  assert.equal(calculateDistanceKm(origin.latitude, origin.longitude, origin.latitude, origin.longitude), 0);
});

test('eligibility rejects unavailable and explicitly unapproved mechanics', () => {
  assert.equal(mechanicIsAvailable({ role: 'mechanic', location: { latitude: 1, longitude: 1 } }), true);
  assert.equal(mechanicIsAvailable({ role: 'mechanic', isAvailable: false }), false);
  assert.equal(mechanicIsAvailable({ role: 'mechanic', isMechanicApproved: false }), false);
  assert.equal(mechanicIsAvailable({ role: 'mechanic', isVerified: false }), false);
  assert.equal(mechanicIsAvailable({ role: 'customer' }), false);
});
