import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { supportedCategories, findParts } from '../services/catalogueService.js';
import { findLiveOffers } from '../services/offersService.js';
import { analysePartImage } from '../services/visionAnalyzer.js';

const router = Router();
const acceptedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    callback(null, acceptedMimeTypes.has(file.mimetype));
  }
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}

function renderHtmlResult(result) {
  const recognition = result.recognition;
  const offers = result.offers.length
    ? `<section class="grid">${result.offers.slice(0, 12).map((offer) => `<a class="card" href="${escapeHtml(safeUrl(offer.productUrl))}" target="_blank" rel="noopener noreferrer"><div class="image">${offer.thumbnail ? `<img src="${escapeHtml(safeUrl(offer.thumbnail))}" alt="${escapeHtml(offer.productName)}">` : '<span>No image</span>'}</div><div class="body"><span class="badge">${escapeHtml(offer.recommendation)}</span><h3>${escapeHtml(offer.productName)}</h3><p class="store">${escapeHtml(offer.retailer)}</p><p class="price">${escapeHtml(offer.priceText || 'Price unavailable')}</p>${offer.rating ? `<p class="rating">★ ${escapeHtml(offer.rating)}${offer.reviewCount ? ` (${escapeHtml(offer.reviewCount)})` : ''}</p>` : '<p class="rating muted">No retailer rating</p>'}${offer.delivery ? `<p class="delivery">${escapeHtml(offer.delivery)}</p>` : ''}</div></a>`).join('')}</section>`
    : '<p>No live retailer offers were found for this image and vehicle combination. Try a closer image, add the OEM number, or check the vehicle details.</p>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><base target="_blank"><style>*{box-sizing:border-box}body{background:#f7f8fa;color:#1d2630;font:14px Arial,sans-serif;margin:0;padding:14px;line-height:1.35}header{margin:0 0 14px}h2{font-size:20px;margin:0 0 4px}.meta{color:#62707d;margin:0}.grid{display:grid;gap:10px;grid-template-columns:repeat(2,minmax(0,1fr))}.card{background:#fff;border:1px solid #e3e8ed;border-radius:10px;color:inherit;display:block;overflow:hidden;text-decoration:none;transition:border-color .15s,box-shadow .15s}.card:hover{border-color:#32a571;box-shadow:0 2px 12px #0002}.image{align-items:center;background:#f1f3f4;display:flex;height:130px;justify-content:center;padding:10px}.image img{height:100%;max-width:100%;object-fit:contain}.body{padding:10px}.badge{background:#e7f7ef;border-radius:999px;color:#137044;display:inline-block;font-size:11px;font-weight:700;margin-bottom:6px;padding:3px 7px}h3{font-size:14px;line-height:1.25;margin:0 0 5px}.store,.delivery{color:#63717d;font-size:12px;margin:3px 0}.price{font-size:17px;font-weight:700;margin:5px 0}.rating{color:#db9c00;font-size:12px;margin:4px 0}.muted{color:#85919c}@media(max-width:390px){.grid{grid-template-columns:1fr}}</style></head><body><header><h2>${escapeHtml(recognition.partName || 'Picture search complete')}</h2><p class="meta">Detected: ${escapeHtml(recognition.categories.join(', ') || 'No confident part match')} · ${Math.round(recognition.confidence * 100)}% confidence</p></header>${offers}<p class="meta">${escapeHtml(result.notice)}</p></body></html>`;
}

router.get('/part-categories', (_request, response) => {
  response.json({ categories: supportedCategories });
});

router.post('/part-searches', upload.single('image'), async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).json({ error: 'Attach one JPEG, PNG, or WebP image in the image field.' });
    }

    const vehicle = {
      make: request.body.make?.trim(),
      model: request.body.model?.trim(),
      year: request.body.year?.trim(),
      engine: request.body.engine?.trim()
    };
    const analysis = await analysePartImage(request.file);
    const catalogueMatches = analysis.categories.length ? findParts({ categories: analysis.categories, vehicle }) : [];
    const liveResults = analysis.categories.length
      ? await findLiveOffers({ partName: analysis.partName, categories: analysis.categories, vehicle })
      : { query: null, offers: [] };

    const result = {
      searchId: randomUUID(),
      vehicle,
      recognition: analysis,
      liveSearchQuery: liveResults.query,
      offers: liveResults.offers,
      catalogueMatches,
      notice: 'Prices and availability are retailer-provided and may change. Confirm fitment using VIN or OEM part number before buying or fitting a part.'
    };

    if (request.body.responseFormat === 'html') {
      return response.status(200).type('html').send(renderHtmlResult(result));
    }
    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
