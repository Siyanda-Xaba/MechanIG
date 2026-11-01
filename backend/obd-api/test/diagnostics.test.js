import assert from "node:assert/strict";
import { mkdir, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import test from "node:test";
process.env.NODE_ENV = "test";
const { default: app } = await import("../app.js");
const { setTestTokenVerifier } = await import("../middlewares/identityMiddleware.js");
setTestTokenVerifier(async (token) => {
  if (!token.startsWith("test:")) { const error = new Error("Invalid test token"); error.code = "auth/invalid-id-token"; throw error; }
  return { uid: token.slice(5) };
});

let server;
let baseUrl;
let dataDirectory;

const customerHeaders = {
  "content-type": "application/json",
  authorization: "Bearer test:customer_1",
};

test.before(async () => {
  dataDirectory = path.join(process.cwd(), "test", `.mechaniq-tests-${randomUUID()}`);
  await mkdir(dataDirectory, { recursive: true });
  process.env.MECHANIQ_DATA_DIR = dataDirectory;
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  await rm(dataDirectory, { recursive: true, force: true });
});

test("health route reports the API as live", async () => {
  const response = await fetch(`${baseUrl}/health/live`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.ok(body.requestId);
});

test("protected vehicle routes require an identity", async () => {
  const response = await fetch(`${baseUrl}/api/v1/vehicles`);
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.error, "AUTHENTICATION_REQUIRED");
});

test("lists at least ten supported vehicle problems", async () => {
  const response = await fetch(`${baseUrl}/api/v1/diagnostics/problems`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.data.length >= 10);
  assert.ok(body.data.some((problem) => problem.code === "P0300"));
});

test("translates raw Bluetooth-adapter-style OBD responses", async () => {
  const response = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      vehicle: { make: "Test", model: "Vehicle", year: 2024 },
      rawDtcResponse: "43 03 00 04 20",
      rawResponses: ["41 0C 1A F8", "41 0D 3C", "41 05 7B"],
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.summary.troubleCodeCount, 2);
  assert.equal(body.data.problems[0].code, "P0300");
  assert.equal(body.data.problems[0].severity, "urgent");
  assert.equal(body.data.problems[1].code, "P0420");
  assert.deepEqual(
    body.data.readings.map((reading) => reading.value),
    [1726, 60, 83],
  );

  // CAN bus format with DTC count byte (43 01 03 00 00 00)
  const canResponse = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      vehicle: { make: "Test", model: "Vehicle", year: 2024 },
      rawDtcResponse: "43 01 03 00 00 00",
      rawResponses: ["41 0C 1A F8"],
    }),
  });
  const canBody = await canResponse.json();
  assert.equal(canResponse.status, 200);
  assert.equal(canBody.data.summary.troubleCodeCount, 1);
  assert.equal(canBody.data.problems[0].code, "P0300");

  // Zero DTCs response (43 00)
  const zeroDtcResponse = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      vehicle: { make: "Test", model: "Vehicle", year: 2024 },
      rawDtcResponse: "43 00",
      rawResponses: ["41 0C 1A F8"],
    }),
  });
  const zeroBody = await zeroDtcResponse.json();
  assert.equal(zeroDtcResponse.status, 200);
  assert.equal(zeroBody.data.summary.troubleCodeCount, 0);
  assert.equal(zeroBody.data.problems.length, 0);
});

test("accepts the readings alias and rejects malformed OBD bytes cleanly", async () => {
  const response = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ readings: ["41 0D 3C"] }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.readings[0].value, 60);

  const invalidResponse = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ rawDtcResponse: "not hex" }),
  });
  assert.equal(invalidResponse.status, 400);
});

test("rejects invalid DTC input with a frontend-friendly error", async () => {
  const response = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ dtcs: ["not-a-code"] }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, "VALIDATION_ERROR");
});

test("persists a vehicle-owned scan, returns history, and protects it from another user", async () => {
  const vinRequest = await fetch(`${baseUrl}/api/v1/vehicles`, {
    method: "POST",
    headers: customerHeaders,
    body: JSON.stringify({ make: "BMW", model: "GLB", year: 2024, vin: "TEST-VIN" }),
  });
  assert.equal(vinRequest.status, 400);

  const vehicleResponse = await fetch(`${baseUrl}/api/v1/vehicles`, {
    method: "POST",
    headers: customerHeaders,
    body: JSON.stringify({
      make: "BMW",
      model: "GLB",
      year: 2024,
      nickname: "Daily driver",
    }),
  });
  const vehicle = (await vehicleResponse.json()).data;
  assert.equal(vehicleResponse.status, 201);

  const scanResponse = await fetch(`${baseUrl}/api/v1/diagnostics/scans`, {
    method: "POST",
    headers: customerHeaders,
    body: JSON.stringify({
      vehicleId: vehicle.id,
      rawDtcResponse: "43 04 42",
      rawResponses: ["41 0D 3C"],
    }),
  });
  const scan = (await scanResponse.json()).data;
  assert.equal(scanResponse.status, 201);
  assert.ok(scan.id.startsWith("scan_"));
  assert.equal(scan.raw.dtcResponse, "43 04 42");
  assert.equal(scan.interpretation.problems[0].code, "P0442");

  const historyResponse = await fetch(
    `${baseUrl}/api/v1/diagnostics/scans?vehicleId=${vehicle.id}`,
    { headers: customerHeaders },
  );
  const history = (await historyResponse.json()).data;
  assert.equal(historyResponse.status, 200);
  assert.equal(history.length, 1);
  assert.equal(history[0].id, scan.id);
  assert.equal(history[0].problemCodes[0], "P0442");

  const guideResponse = await fetch(
    `${baseUrl}/api/v1/diagnostics/scans/${scan.id}/repair-guide`,
    { headers: customerHeaders },
  );
  const guide = (await guideResponse.json()).data;
  assert.equal(guideResponse.status, 200);
  assert.equal(guide.outcome, "limited-diy-check");

  const otherUserResponse = await fetch(
    `${baseUrl}/api/v1/diagnostics/scans/${scan.id}`,
    { headers: { authorization: "Bearer test:customer_2" } },
  );
  assert.equal(otherUserResponse.status, 404);

  const otherUserDelete = await fetch(
    `${baseUrl}/api/v1/diagnostics/scans/${scan.id}`,
    { method: "DELETE", headers: { authorization: "Bearer test:customer_2" } },
  );
  assert.equal(otherUserDelete.status, 404);

  const ownerDelete = await fetch(
    `${baseUrl}/api/v1/diagnostics/scans/${scan.id}`,
    { method: "DELETE", headers: customerHeaders },
  );
  assert.equal(ownerDelete.status, 204);

  const deletedScanRead = await fetch(
    `${baseUrl}/api/v1/diagnostics/scans/${scan.id}`,
    { headers: customerHeaders },
  );
  assert.equal(deletedScanRead.status, 404);
});

test("rejects raw command and unapproved fields before diagnostic translation", async () => {
  for (const payload of [
    { command: "04" },
    { operation: "clearCodes" },
    { rawResponses: ["44"] },
    { rawResponses: ["41 0C 1A F8 00"] },
    { unsupportedPids: ["FF"] },
  ]) {
    const response = await fetch(`${baseUrl}/api/v1/diagnostics/translate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    assert.equal(response.status, 400, JSON.stringify(payload));
  }
});

test("rate limits repeated API requests", async () => {
  let lastResponse;
  for (let attempt = 0; attempt < 125; attempt += 1) {
    lastResponse = await fetch(`${baseUrl}/health/live`);
    if (lastResponse.status === 429) break;
  }
  assert.equal(lastResponse.status, 429);
});
