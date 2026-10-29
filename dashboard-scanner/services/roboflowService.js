

const ROBOFLOW_ENDPOINT =
  "https://serverless.roboflow.com/car_dashboard_warning_icons-ywqdx/1";

async function detectWarningLights(imageBuffer) {
  const apiKey = process.env.ROBOFLOW_API_KEY;

  if (!apiKey) {
    throw new Error("Roboflow API key is missing.");
  }

  const form = new FormData();

  form.append(
    "file",
    new Blob([imageBuffer], { type: "image/jpeg" }),
    "dashboard.jpg"
  );

  const response = await fetch(ROBOFLOW_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: form
  });

  const responseText = await response.text();

  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error("Roboflow returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      result.message || `Roboflow request failed: ${response.status}`
    );
  }

  return result;
}

module.exports = { detectWarningLights };
