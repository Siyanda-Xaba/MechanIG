const SERP_API_URL = 'https://serpapi.com/search.json';

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function createSearchQuery({ partName, categories, vehicle }) {
  const part = partName || categories[0] || 'vehicle part';
  const vehicleText = [vehicle.year, vehicle.make, vehicle.model, vehicle.engine].filter(Boolean).join(' ');
  return `${vehicleText} ${part} auto parts`.trim();
}

function scoreOffer(offer, cheapestPrice) {
  const priceScore = cheapestPrice && offer.priceZar ? Math.max(0, 40 * (cheapestPrice / offer.priceZar)) : 0;
  const ratingScore = offer.rating ? Math.min(35, offer.rating * 7) : 10;
  const reviewScore = offer.reviewCount ? Math.min(15, Math.log10(offer.reviewCount + 1) * 7.5) : 0;
  const deliveryScore = offer.delivery ? 10 : 0;
  return Math.round(priceScore + ratingScore + reviewScore + deliveryScore);
}

function labelOffers(offers) {
  if (!offers.length) return offers;
  const cheapest = offers.reduce((best, offer) => offer.priceZar < best.priceZar ? offer : best);
  const highestRated = offers.reduce((best, offer) => (offer.rating || 0) > (best.rating || 0) ? offer : best);
  const bestValue = offers.reduce((best, offer) => offer.qualityScore > best.qualityScore ? offer : best);

  return offers.map((offer) => ({
    ...offer,
    recommendation: offer.id === bestValue.id
      ? 'Best value'
      : offer.id === cheapest.id
        ? 'Lowest listed price'
        : offer.id === highestRated.id
          ? 'Highest retailer rating'
          : 'Compatible option'
  }));
}

export async function findLiveOffers({ partName, categories, vehicle }) {
  if (!process.env.SERPAPI_KEY || process.env.SERPAPI_KEY === 'PASTE_YOUR_SERPAPI_KEY_HERE') {
    const error = new Error('Live prices are not configured. Set SERPAPI_KEY on the server to search verified retailer listings.');
    error.statusCode = 503;
    throw error;
  }

  const query = createSearchQuery({ partName, categories, vehicle });
  const url = new URL(SERP_API_URL);
  url.search = new URLSearchParams({
    engine: 'google_shopping',
    q: query,
    gl: 'za',
    hl: 'en',
    api_key: process.env.SERPAPI_KEY
  }).toString();

  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  const payload = await response.json();
  if (!response.ok || payload.error) {
    const error = new Error(payload.error || 'Live retailer search failed.');
    error.statusCode = response.status || 502;
    throw error;
  }

  const rawOffers = Array.isArray(payload.shopping_results) ? payload.shopping_results : [];
  const offers = rawOffers
    .map((item, index) => ({
      id: item.product_id || `offer-${index}`,
      productName: item.title || 'Unnamed product',
      retailer: item.source || 'Unknown retailer',
      productUrl: item.link || item.product_link || null,
      priceText: item.price || null,
      priceZar: numberOrNull(item.extracted_price),
      delivery: item.delivery || null,
      rating: numberOrNull(item.rating),
      reviewCount: numberOrNull(item.reviews),
      thumbnail: item.thumbnail || null,
      condition: item.second_hand_condition || 'new',
      source: 'Google Shopping via SerpApi'
    }))
    .filter((offer) => offer.productUrl && offer.priceZar !== null && offer.priceZar > 0 && offer.priceText?.includes('R'))
    .slice(0, 20);

  const cheapestPrice = Math.min(...offers.map((offer) => offer.priceZar));
  const ranked = offers
    .map((offer) => ({ ...offer, qualityScore: scoreOffer(offer, cheapestPrice) }))
    .sort((a, b) => b.qualityScore - a.qualityScore || a.priceZar - b.priceZar);

  return { query, offers: labelOffers(ranked) };
}
