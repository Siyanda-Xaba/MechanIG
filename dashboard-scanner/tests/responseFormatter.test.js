const test = require("node:test");
const assert = require("node:assert/strict");

const { formatPredictions } = require("../services/responseFormatter");

test("formats a known warning light", () => {
  const result = formatPredictions({
    predictions: [
      {
        class: "Check Engine",
        confidence: 0.95,
      },
    ],
  });

  assert.equal(result.success, true);
  assert.equal(result.totalDetections, 1);
  assert.equal(result.detections[0].title, "Check Engine Light");
  assert.equal(result.detections[0].explanationAvailable, true);
});

test("handles the ESP class returned by Roboflow", () => {
  const result = formatPredictions({
    predictions: [
      {
        class: "Electronic Stability Problem -ESP-",
        confidence: 0.92,
      },
    ],
  });

  assert.equal(result.totalDetections, 1);
  assert.equal(
    result.detections[0].title,
    "Electronic Stability Program (ESP)",
  );
  assert.equal(result.detections[0].explanationAvailable, true);
});

test("handles an unknown class safely", () => {
  const result = formatPredictions({
    predictions: [
      {
        class: "Unknown Dashboard Symbol",
        confidence: 0.85,
      },
    ],
  });

  assert.equal(result.totalDetections, 1);
  assert.equal(result.detections[0].explanationAvailable, false);
  assert.ok(result.detections[0].message);
});

test("handles no detections", () => {
  const result = formatPredictions({
    predictions: [],
  });

  assert.equal(result.success, true);
  assert.equal(result.totalDetections, 0);
  assert.equal(result.detections.length, 0);
  assert.match(result.message, /No warning lights were detected/);
});

test("rejects an invalid Roboflow response", () => {
  assert.throws(() => formatPredictions({}), /Invalid prediction response/);
});
