if (process.env.RUN_FIREBASE_SMOKE_TEST !== "true") {
  console.log("This script writes and deletes a test Firebase record. Set RUN_FIREBASE_SMOKE_TEST=true to run it deliberately.");
} else {
  const { firebaseDb } = await import("./config/firebase.js");
  const vehicleId = `test_vehicle_${Date.now()}`;
  try {
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
    const snapshot = await firebaseDb.ref(`vehicles/${vehicleId}`).get();
    console.log("Firebase read/write succeeded:", snapshot.val()?.id === vehicleId);
  } finally {
    await firebaseDb.ref(`vehicles/${vehicleId}`).remove();
  }
}
