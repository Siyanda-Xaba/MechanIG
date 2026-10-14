import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import app from "../app.js";

let server;
let baseUrl;
let dataDirectory;

const customerHeaders = {
  "content-type": "application/json",
  "x-mechaniq-user-id": "customer_1",
};

test.before(async () => {
  dataDirectory = await mkdtemp(path.join(os.tmpdir(), "mechaniq-tests-"));
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
      vehicle: { vin: "TESTVIN123" },
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
    { headers: { "x-mechaniq-user-id": "customer_2" } },
  );
  assert.equal(otherUserResponse.status, 404);
});
