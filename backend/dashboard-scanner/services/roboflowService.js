const ROBOFLOW_ENDPOINT = process.env.ROBOFLOW_WARNING_LIGHTS_ENDPOINT
  || 'https://serverless.roboflow.com/car_dashboard_warning_icons-ywqdx/1';
const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function detectWarningLights(image) {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) {
    const error = new Error('Dashboard warning-light recognition is not configured. Add ROBOFLOW_API_KEY to the main app .env.local and restart the app.');
    error.status = 503;
    throw error;
  }

  const mimeType = String(image?.mimeType || '').split(';')[0].trim().toLowerCase();
  if (!image?.data?.length || !SUPPORTED_MIME_TYPES.has(mimeType)) {
    const error = new Error('Use a valid JPEG, PNG, or WebP dashboard image.');
    error.status = 400;
    throw error;
  }

  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const fileName = `dashboard.${extension}`;
  const form = new FormData();
  form.append('file', new Blob([image.data], { type: mimeType }), fileName);

  let response;
  try {
    response = await fetch(ROBOFLOW_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    const error = new Error('The warning-light recognition service could not be reached. Check the backend network connection and try again.');
    error.status = 502;
    throw error;
  }

  const responseText = await response.text();
  let payload;
  try {
    payload = JSON.parse(responseText);
  } catch {
    const error = new Error('The warning-light recognition service returned an invalid response.');
    error.status = 502;
    throw error;
  }
  if (!response.ok) {
    const error = new Error('The warning-light recognition service could not analyze this image. Try a clearer dashboard photo.');
    error.status = 502;
    throw error;
  }
  if (!Array.isArray(payload?.predictions)) {
    const error = new Error('The warning-light recognition service returned an invalid prediction list.');
    error.status = 502;
    throw error;
  }
  return payload;
}

module.exports = { detectWarningLights };
