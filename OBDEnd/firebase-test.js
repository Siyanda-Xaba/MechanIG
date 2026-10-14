import { firebaseDb } from "./config/firebase.js";

const vehicleId = "test_vehicle_001";

console.log("Starting vehicle write...");

await firebaseDb.ref(`vehicles/${vehicleId}`).set({
  id: vehicleId,
  ownerId: "test-user",
  createdAt: new Date().toISOString(),
  make: "Toyota",
  model: "Corolla",
  year: 2020,
  vin: null,
  nickname: "Test Toyota",
});

console.log("Vehicle write successful.");

const snapshot = await firebaseDb.ref(`vehicles/${vehicleId}`).get();

console.log("Vehicle read successful:");
console.log(snapshot.val());

await firebaseDb.ref(`vehicles/${vehicleId}`).remove();

console.log("Vehicle delete successful.");