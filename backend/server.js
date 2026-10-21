const http = require('node:http');
const crypto = require('node:crypto');

const PORT = Number(process.env.PICTURE_SEARCH_PORT || 3001);
const HOST = process.env.PICTURE_SEARCH_HOST || '0.0.0.0';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const GEMINI_FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.6-flash,gemini-3.5-flash-lite')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);
const GEMINI_RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const requestWindows = new Map();
const REQUEST_WINDOW_MS = 60_000;
const ROUTE_LIMITS = new Map([
  ['/api/v1/part-searches', 8],
  ['/api/v1/part-searches/offers', 20],
  ['/api/v1/nearby-fuel-stations', 20],
  ['/api/v1/nearby-stores', 20],
]);
const allowedOrigins = new Set((process.env.PICTURE_SEARCH_CORS_ORIGINS || '')
  .split(',').map((origin) => origin.trim()).filter(Boolean));
let adminAuthPromise;

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

async function authenticateRequest(request) {
  const match = String(request.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  try {
    if (!adminAuthPromise) {
      adminAuthPromise = (async () => {
        const [{ getApps, initializeApp }, { getAuth }] = await Promise.all([
          import('firebase-admin/app'), import('firebase-admin/auth'),
        ]);
        const appName = 'picture-search-token-verification';
        const app = getApps().find((candidate) => candidate.name === appName)
          || initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'mechaniq-3a0f2' }, appName);
        return getAuth(app);
      })();
    }
    const auth = await adminAuthPromise;
    await auth.verifyIdToken(match[1], process.env.NODE_ENV === 'production');
    return true;
  } catch (error) {
    console.error('Picture-search authentication failed:', { code: error?.code || 'UNKNOWN' });
    return false;
  }
}

function isRateLimited(request, pathname) {
  const limit = ROUTE_LIMITS.get(pathname);
  if (!limit) return false;
  const now = Date.now();
  const key = `${pathname}:${request.socket.remoteAddress || 'unknown'}`;
  let current = requestWindows.get(key);
  if (!current && requestWindows.size >= 5000) {
    for (const [entry, window] of requestWindows) {
      if (now - window.startedAt >= REQUEST_WINDOW_MS) requestWindows.delete(entry);
    }
    if (requestWindows.size >= 5000) return true;
    current = requestWindows.get(key);
  }
  if (!current || now - current.startedAt >= REQUEST_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  if (requestWindows.size > 5000) {
    for (const [entry, window] of requestWindows) {
      if (now - window.startedAt >= REQUEST_WINDOW_MS) requestWindows.delete(entry);
    }
  }
  return current.count > limit;
}

function imageSignatureIsValid(image) {
  const data = image.data;
  const mime = image.mimeType.split(';')[0].trim().toLowerCase();
  const jpeg = data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  const png = data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = data.length >= 12 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP';
  return (mime === 'image/jpeg' && jpeg) || (mime === 'image/png' && png) || (mime === 'image/webp' && webp);
}

async function readBody(request, limit = MAX_IMAGE_BYTES) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > limit) {
      const error = new Error('The uploaded request is larger than the allowed limit.');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function parseMultipart(body, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw new Error('The image upload is missing a multipart boundary.');
  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const headerSeparator = Buffer.from('\r\n\r\n');
  const fields = {};
  const files = {};
  let position = body.indexOf(boundary);

  while (position >= 0) {
    let partStart = position + boundary.length;
    if (body.subarray(partStart, partStart + 2).equals(Buffer.from('--'))) break;
    if (body.subarray(partStart, partStart + 2).equals(Buffer.from('\r\n'))) partStart += 2;
    const headersEnd = body.indexOf(headerSeparator, partStart);
    if (headersEnd < 0) break;
    const nextBoundary = body.indexOf(boundary, headersEnd + headerSeparator.length);
    if (nextBoundary < 0) break;
    const headers = body.subarray(partStart, headersEnd).toString('utf8');
    let contentEnd = nextBoundary;
    if (body.subarray(contentEnd - 2, contentEnd).equals(Buffer.from('\r\n'))) contentEnd -= 2;
    const content = body.subarray(headersEnd + headerSeparator.length, contentEnd);
    const dispositionLine = headers.match(/content-disposition:\s*([^\r\n]+)/i)?.[1] || '';
    const name = dispositionLine.match(/(?:^|;)\s*name="([^"]+)"/i)?.[1];
    const fileName = dispositionLine.match(/(?:^|;)\s*filename="([^"]*)"/i)?.[1];
    if (name) {
      const contentTypeHeader = headers.match(/content-type:\s*([^\r\n]+)/i);
      if (fileName !== undefined) {
        files[name] = { data: content, fileName, mimeType: contentTypeHeader?.[1]?.trim() || 'application/octet-stream' };
      } else {
        fields[name] = content.toString('utf8');
      }
    }
    position = nextBoundary;
  }
  return { fields, files };
}

function extractJson(text) {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace < 0 || lastBrace < firstBrace) throw new Error('The recognition service returned an invalid response.');
  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
}

function normalizeRecognition(value) {
  const confidence = Math.max(0, Math.min(1, Number(value?.confidence) || 0));
  const categories = Array.isArray(value?.categories) ? value.categories.filter((item) => typeof item === 'string').slice(0, 5) : [];
  const partName = typeof value?.partName === 'string' && value.partName.trim() ? value.partName.trim() : 'Part not identified';
  return { partName, confidence, categories };
}

async function recognizePart(image, vehicle) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Picture recognition is not configured. Add GEMINI_API_KEY to .env.local and restart the app.');
  }
  if (!image.mimeType.startsWith('image/')) throw new Error('Choose a valid image file.');
  const prompt = [
    'Identify the primary visible automotive part in this image.',
    'Return only JSON with: partName (specific common part name), confidence (number from 0 to 1), and categories (array of broad automotive categories).',
    'If the image is not an automotive part or is too unclear, use partName "Part not identified" and confidence below 0.3.',
    `Vehicle context: ${vehicle.year || 'unknown year'} ${vehicle.make || 'unknown make'} ${vehicle.model || 'unknown model'} ${vehicle.engine || ''}`.trim(),
    'Do not claim vehicle compatibility from the image alone.',
  ].join('\n');
  const requestBody = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }, { inline_data: { mime_type: image.mimeType, data: image.data.toString('base64') } }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
  });
  const models = [...new Set([GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS])];
  let lastError;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
    const model = models[modelIndex];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
          body: requestBody,
          signal: AbortSignal.timeout(30000),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const error = new Error(payload?.error?.message || `Recognition service returned HTTP ${response.status}.`);
          error.status = response.status;
          throw error;
        }
        const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
        return normalizeRecognition(extractJson(text));
      } catch (error) {
        lastError = error;
        const retryable = GEMINI_RETRYABLE_STATUS_CODES.has(error?.status)
          || error?.name === 'TimeoutError'
          || error?.name === 'AbortError'
          || error?.name === 'TypeError';
        if (!retryable) throw error;

        if (attempt < 1) {
          await new Promise((resolve) => setTimeout(resolve, 700 * (2 ** attempt) + Math.floor(Math.random() * 300)));
        } else if (modelIndex < models.length - 1) {
          console.warn(`Gemini model ${model} is busy; trying fallback model ${models[modelIndex + 1]}.`);
        }
      }
    }
  }

  throw lastError || new Error('Image recognition is temporarily unavailable. Please try again shortly.');
}

function distanceKm(from, to) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function localityFromAddress(address) {
  if (!address) return null;
  const parts = String(address).split(',').map((part) => part.trim()).filter(Boolean);
  return [...parts].reverse().find((part) => !/^\d{4,6}$/.test(part)
    && !/south africa|gauteng|johannesburg/i.test(part)) || parts.at(-1) || null;
}

async function findOffers(query, location, partName) {
  if (!process.env.SERPAPI_API_KEY) return { offers: [], nearbyCount: 0, onlineCount: 0, notice: 'Add SERPAPI_API_KEY to .env.local to enable live retailer deals.' };
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  const hasLocation = Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
  const localSearch = async () => {
    if (!hasLocation) return [];
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_maps');
    url.searchParams.set('type', 'search');
    url.searchParams.set('q', `${query} auto parts store mechanic`);
    url.searchParams.set('ll', `@${latitude},${longitude},14z`);
    url.searchParams.set('hl', 'en');
    url.searchParams.set('api_key', process.env.SERPAPI_API_KEY);
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error || `Nearby shop search returned HTTP ${response.status}.`);
    const origin = { latitude, longitude };
    return (payload?.local_results || []).map((item, index) => {
      const coordinates = item.gps_coordinates;
      const distance = coordinates && Number.isFinite(Number(coordinates.latitude)) && Number.isFinite(Number(coordinates.longitude))
        ? distanceKm(origin, { latitude: Number(coordinates.latitude), longitude: Number(coordinates.longitude) })
        : null;
      return {
        id: `nearby-${item.data_id || item.data_cid || index}`,
        sourceType: 'nearby',
        productName: partName,
        retailer: [item.title || 'Nearby automotive shop', localityFromAddress(item.address)].filter(Boolean).join(' · '),
        priceText: 'Call to confirm price and stock',
        thumbnail: item.thumbnail || null,
        productUrl: item.links?.directions || (item.data_cid ? `https://www.google.com/maps?cid=${encodeURIComponent(item.data_cid)}` : null),
        rating: item.rating || null,
        reviewCount: item.reviews || null,
        delivery: [item.address, distance === null ? null : `${distance.toFixed(1)} km away`].filter(Boolean).join(' · ') || null,
        recommendation: 'Confirm this exact part and fitment with the shop',
        distanceKm: distance,
        phone: item.phone || null,
        address: item.address || null,
      };
    }).filter((item) => item.distanceKm !== null && item.distanceKm <= 50)
      .sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  };
  const onlineSearch = async () => {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_shopping');
    url.searchParams.set('q', query);
    url.searchParams.set('gl', 'za');
    url.searchParams.set('hl', 'en');
    url.searchParams.set('api_key', process.env.SERPAPI_API_KEY);
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error || `Online product search returned HTTP ${response.status}.`);
    return (payload?.shopping_results || []).slice(0, 10).map((item, index) => ({
      id: `online-${item.product_id || item.position || index}`,
      sourceType: 'online',
      productName: item.title || partName,
      retailer: item.source || item.seller || 'Online retailer',
      priceText: item.price || item.extracted_price?.toString() || 'Price unavailable',
      thumbnail: item.thumbnail || null,
      productUrl: item.link || item.product_link || null,
      rating: item.rating || null,
      reviewCount: item.reviews || null,
      delivery: item.delivery || null,
      recommendation: 'Confirm fitment before purchase',
    }));
  };
  const [nearbyResult, onlineResult] = await Promise.allSettled([localSearch(), onlineSearch()]);
  const nearbyOffers = nearbyResult.status === 'fulfilled' ? nearbyResult.value : [];
  const onlineOffers = onlineResult.status === 'fulfilled' ? onlineResult.value : [];
  if (!nearbyOffers.length && !onlineOffers.length) {
    const firstError = nearbyResult.status === 'rejected' ? nearbyResult.reason : onlineResult.reason;
    throw firstError || new Error('No nearby shops or online offers were found.');
  }
  const offers = [...nearbyOffers, ...onlineOffers];
  return {
    offers,
    nearbyCount: nearbyOffers.length,
    onlineCount: onlineOffers.length,
    notice: [
      nearbyOffers.length ? 'Nearby shops are listed first; call to confirm stock and price.' : hasLocation ? 'No nearby shops matched this search; showing online offers.' : 'Location is unavailable; showing online offers only.',
      nearbyResult.status === 'rejected' ? 'Nearby shop search failed.' : null,
      onlineResult.status === 'rejected' ? 'Online offer search failed.' : null,
    ].filter(Boolean).join(' '),
  };
}

async function findNearbyFuelStations(location) {
  if (!process.env.SERPAPI_API_KEY) return { stations: [], notice: 'Nearby fuel stations are not configured. Add SERPAPI_API_KEY to the backend environment.' };
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return { stations: [], notice: 'Allow location access to find nearby fuel stations.' };
  }
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_maps');
  url.searchParams.set('type', 'search');
  url.searchParams.set('q', 'petrol stations');
  url.searchParams.set('ll', `@${latitude},${longitude},14z`);
  url.searchParams.set('hl', 'en');
  url.searchParams.set('api_key', process.env.SERPAPI_API_KEY);
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Fuel station search returned HTTP ${response.status}.`);
  const origin = { latitude, longitude };
  const stations = (payload?.local_results || []).map((item, index) => {
    const coordinates = item.gps_coordinates;
    const stationLocation = coordinates
      && Number.isFinite(Number(coordinates.latitude))
      && Number.isFinite(Number(coordinates.longitude))
      ? { latitude: Number(coordinates.latitude), longitude: Number(coordinates.longitude) }
      : null;
    const distance = stationLocation ? distanceKm(origin, stationLocation) : null;
    const openText = String(item.open_state || '').toLowerCase();
    return {
      id: String(item.data_id || item.data_cid || index),
      name: item.title || 'Fuel station',
      area: localityFromAddress(item.address),
      address: item.address || null,
      latitude: stationLocation?.latitude ?? null,
      longitude: stationLocation?.longitude ?? null,
      distanceKm: distance === null ? null : Number(distance.toFixed(1)),
      isOpen: /open/.test(openText) ? true : /closed/.test(openText) ? false : null,
      phone: item.phone || null,
      rating: item.rating || null,
      googleMapsUrl: item.links?.directions || (item.data_cid
        ? `https://www.google.com/maps?cid=${encodeURIComponent(item.data_cid)}`
        : stationLocation ? `https://www.google.com/maps/search/?api=1&query=${stationLocation.latitude},${stationLocation.longitude}` : null),
    };
  }).filter((station) => station.distanceKm !== null && station.distanceKm <= 50)
    .sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 20);
  return {
    stations,
    notice: stations.length ? null : 'No fuel stations with a mappable location were found within 50 km.',
  };
}

async function findNearbyStores(location) {
  if (!process.env.SERPAPI_API_KEY) return { stores: [], notice: 'Nearby store search is not configured.' };
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return { stores: [], notice: 'Allow location access to find nearby automotive stores.' };
  }
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_maps');
  url.searchParams.set('type', 'search');
  url.searchParams.set('q', 'auto parts stores');
  url.searchParams.set('ll', `@${latitude},${longitude},14z`);
  url.searchParams.set('hl', 'en');
  url.searchParams.set('api_key', process.env.SERPAPI_API_KEY);
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Nearby store search returned HTTP ${response.status}.`);
  const origin = { latitude, longitude };
  const stores = (payload?.local_results || []).map((item, index) => {
    const coordinates = item.gps_coordinates;
    const storeLocation = coordinates
      && Number.isFinite(Number(coordinates.latitude))
      && Number.isFinite(Number(coordinates.longitude))
      ? { latitude: Number(coordinates.latitude), longitude: Number(coordinates.longitude) }
      : null;
    const distance = storeLocation ? distanceKm(origin, storeLocation) : null;
    const openText = String(item.open_state || '').toLowerCase();
    return {
      id: `store-${item.data_id || item.data_cid || index}`,
      name: item.title || 'Automotive parts store',
      address: item.address || null,
      latitude: storeLocation?.latitude ?? null,
      longitude: storeLocation?.longitude ?? null,
      distanceKm: distance === null ? null : Number(distance.toFixed(1)),
      isOpen: /open/.test(openText) ? true : /closed/.test(openText) ? false : null,
      closingTime: openText.match(/closes?\s+(.+)$/i)?.[1] || null,
      rating: item.rating || null,
      reviewCount: item.reviews || null,
    };
  }).filter((store) => store.distanceKm === null || store.distanceKm <= 50)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    .slice(0, 20);
  return {
    stores,
    notice: stores.length ? null : 'No nearby automotive parts stores were found.',
  };
}

async function handlePartSearch(request, response) {
  const body = await readBody(request);
  const { fields, files } = parseMultipart(body, request.headers['content-type'] || '');
  const image = files.image;
  if (!image?.data?.length) return sendJson(response, 400, { error: 'Select or capture an image before searching.' });
  if (!imageSignatureIsValid(image)) return sendJson(response, 400, { error: 'Use a valid JPEG, PNG, or WebP image.' });
  const recognition = await recognizePart(image, fields);
  return sendJson(response, 200, { searchId: crypto.randomUUID(), recognition, catalogueMatches: [], offers: [], notice: 'Recognition is an estimate. Confirm the OEM number or VIN before buying a part.' });
}

async function handleOffers(request, response) {
  const body = await readBody(request, 1024 * 1024);
  let input;
  try { input = JSON.parse(body.toString('utf8') || '{}'); }
  catch { return sendJson(response, 400, { error: 'The request body must be valid JSON.' }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return sendJson(response, 400, { error: 'The request body must be a JSON object.' });
  if (typeof input.partName !== 'string' || !input.partName.trim() || input.partName.length > 120) return sendJson(response, 400, { error: 'A part name between 1 and 120 characters is required.' });
  for (const key of ['year', 'make', 'model', 'engine']) {
    if (input[key] != null && (typeof input[key] !== 'string' && typeof input[key] !== 'number' || String(input[key]).length > 80)) {
      return sendJson(response, 400, { error: 'Vehicle search details are invalid.' });
    }
  }
  const vehicle = [input.year, input.make, input.model, input.engine].filter(Boolean).join(' ');
  const result = await findOffers(`${vehicle} ${input.partName}`.trim(), input.location, input.partName.trim());
  return sendJson(response, 200, result);
}

async function handleNearbyFuelStations(request, response) {
  const body = await readBody(request, 1024 * 1024);
  let input;
  try { input = JSON.parse(body.toString('utf8') || '{}'); }
  catch { return sendJson(response, 400, { error: 'The request body must be valid JSON.' }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return sendJson(response, 400, { error: 'The request body must be a JSON object.' });
  return sendJson(response, 200, await findNearbyFuelStations(input.location));
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    const origin = request.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Vary', 'Origin');
    }
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');
    if (request.method === 'OPTIONS') return sendJson(response, 204, {});
    if (request.method === 'GET' && url.pathname === '/health') {
      return sendJson(response, 200, { ok: true, recognitionConfigured: Boolean(process.env.GEMINI_API_KEY), offersConfigured: Boolean(process.env.SERPAPI_API_KEY), model: GEMINI_MODEL });
    }
    if (ROUTE_LIMITS.has(url.pathname)) {
      if (isRateLimited(request, url.pathname)) return sendJson(response, 429, { error: 'Too many requests. Please wait and try again.' });
      if (!await authenticateRequest(request)) return sendJson(response, 401, { error: 'Sign in again to use this service.' });
    }
    if (request.method === 'POST' && url.pathname === '/api/v1/part-searches') return await handlePartSearch(request, response);
    if (request.method === 'POST' && url.pathname === '/api/v1/part-searches/offers') return await handleOffers(request, response);
    if (request.method === 'POST' && url.pathname === '/api/v1/nearby-fuel-stations') return await handleNearbyFuelStations(request, response);
    if (request.method === 'POST' && url.pathname === '/api/v1/nearby-stores') {
      const body = await readBody(request, 1024 * 1024);
      let input;
      try { input = JSON.parse(body.toString('utf8') || '{}'); }
      catch { return sendJson(response, 400, { error: 'The request body must be valid JSON.' }); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return sendJson(response, 400, { error: 'The request body must be a JSON object.' });
      return sendJson(response, 200, await findNearbyStores(input));
    }
    return sendJson(response, 404, { error: 'Endpoint not found.' });
  } catch (error) {
    console.error('Picture-search request failed:', {
      name: error?.name || 'Error',
      status: error?.status || null,
      code: error?.code || null,
    });
    const message = error instanceof Error ? error.message : 'The picture-search request failed.';
    const clientError = error?.status === 400 || error?.status === 413;
    const safeMessage = clientError || process.env.NODE_ENV !== 'production'
      ? message
      : 'The request could not be completed. Please try again later.';
    return sendJson(response, clientError ? error.status : 502, { error: safeMessage });
  }
});

if (require.main === module) {
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.listen(PORT, HOST, () => {
    console.log(`MechanIQ picture-search API listening on http://${HOST}:${PORT}`);
    if (!process.env.GEMINI_API_KEY) console.warn('GEMINI_API_KEY is missing; health checks work, but recognition requests will be rejected.');
  });
}

module.exports = { extractJson, normalizeRecognition, parseMultipart, server };
