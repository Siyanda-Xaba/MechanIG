const http = require('node:http');
const crypto = require('node:crypto');

const PORT = Number(process.env.PICTURE_SEARCH_PORT || 3001);
const HOST = process.env.PICTURE_SEARCH_HOST || '0.0.0.0';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request, limit = MAX_IMAGE_BYTES) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > limit) throw new Error('The uploaded image is larger than 10 MB.');
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
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }, { inline_data: { mime_type: image.mimeType, data: image.data.toString('base64') } }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    }),
    signal: AbortSignal.timeout(45000),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || `Recognition service returned HTTP ${response.status}.`);
  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  return normalizeRecognition(extractJson(text));
}

async function findOffers(query) {
  if (!process.env.SERPAPI_API_KEY) return { offers: [], notice: 'Add SERPAPI_API_KEY to .env.local to enable live retailer deals.' };
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_shopping');
  url.searchParams.set('q', query);
  url.searchParams.set('gl', 'za');
  url.searchParams.set('hl', 'en');
  url.searchParams.set('api_key', process.env.SERPAPI_API_KEY);
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Retail search returned HTTP ${response.status}.`);
  const offers = (payload?.shopping_results || []).slice(0, 10).map((item, index) => ({
    id: String(item.product_id || item.position || index),
    productName: item.title || 'Automotive part', retailer: item.source || item.seller || 'Retailer',
    priceText: item.price || item.extracted_price?.toString() || null, thumbnail: item.thumbnail || null,
    productUrl: item.link || item.product_link || null, rating: item.rating || null, reviewCount: item.reviews || null,
    delivery: item.delivery || null, recommendation: 'Confirm fitment before purchase',
  }));
  return { offers, notice: offers.length ? null : 'No live retailer deals were found.' };
}

async function handlePartSearch(request, response) {
  const body = await readBody(request);
  const { fields, files } = parseMultipart(body, request.headers['content-type'] || '');
  const image = files.image;
  if (!image?.data?.length) return sendJson(response, 400, { error: 'Select or capture an image before searching.' });
  const recognition = await recognizePart(image, fields);
  return sendJson(response, 200, { searchId: crypto.randomUUID(), recognition, catalogueMatches: [], offers: [], notice: 'Recognition is an estimate. Confirm the OEM number or VIN before buying a part.' });
}

async function handleOffers(request, response) {
  const body = await readBody(request, 1024 * 1024);
  const input = JSON.parse(body.toString('utf8') || '{}');
  if (!input.partName?.trim()) return sendJson(response, 400, { error: 'A part name is required.' });
  const vehicle = [input.year, input.make, input.model, input.engine].filter(Boolean).join(' ');
  const result = await findOffers(`${vehicle} ${input.partName}`.trim());
  return sendJson(response, 200, result);
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (request.method === 'GET' && url.pathname === '/health') {
      return sendJson(response, 200, { ok: true, recognitionConfigured: Boolean(process.env.GEMINI_API_KEY), offersConfigured: Boolean(process.env.SERPAPI_API_KEY), model: GEMINI_MODEL });
    }
    if (request.method === 'POST' && url.pathname === '/api/v1/part-searches') return await handlePartSearch(request, response);
    if (request.method === 'POST' && url.pathname === '/api/v1/part-searches/offers') return await handleOffers(request, response);
    if (request.method === 'POST' && url.pathname === '/api/v1/nearby-stores') return sendJson(response, 200, { stores: [], notice: 'Nearby store search is not configured.' });
    return sendJson(response, 404, { error: 'Endpoint not found.' });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'The picture-search request failed.';
    return sendJson(response, /not configured|larger|missing|required|valid image|Select/.test(message) ? 400 : 502, { error: message });
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`MechanIQ picture-search API listening on http://${HOST}:${PORT}`);
    if (!process.env.GEMINI_API_KEY) console.warn('GEMINI_API_KEY is missing; health checks work, but recognition requests will be rejected.');
  });
}

module.exports = { extractJson, normalizeRecognition, parseMultipart, server };
