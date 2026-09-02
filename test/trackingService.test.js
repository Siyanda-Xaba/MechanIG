const assert = require("assert/strict");
const TrackingService = require("../src/services/trackingService").constructor;

const service = new TrackingService();
const created = service.start({
    requestId: "request-1",
    driverId: "driver-1",
    customerId: "customer-1",
    initialLocation: { latitude: -26.2041, longitude: 28.0473 }
});

assert.equal(created.status, "ASSIGNED");
const updated = service.updateLocation("request-1", { latitude: -26.205, longitude: 28.048, speed: 10 });
assert.equal(updated.latestLocation.speed, 10);
assert.equal(updated.locationHistory.length, 2);
assert.equal(service.setStatus("request-1", "EN_ROUTE").status, "EN_ROUTE");
assert.throws(() => service.updateLocation("missing", { latitude: 0, longitude: 0 }), /not found/);
assert.throws(() => service.start({ driverId: "d" }), /customerId/);

console.log("trackingService tests passed");
