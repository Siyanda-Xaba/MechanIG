# MechanIQ picture-search API

This standalone JavaScript backend accepts a vehicle-part photo, asks a vision model to identify the visible part, and returns compatible catalogue entries. It intentionally does not alter the Expo app.

## Run locally

1. From this `backend` folder, run `npm install`.
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`. Keep the key on the server only.
3. Run `npm run dev`.

The API starts on `http://localhost:3001` by default.

## Endpoints

`GET /health` checks the service.

`GET /api/v1/part-categories` returns the currently supported categories.

`POST /api/v1/part-searches` accepts `multipart/form-data`:

| Field | Required | Example |
| --- | --- | --- |
| `image` | Yes | JPEG, PNG, or WebP file, maximum 8 MB |
| `make` | No | Toyota |
| `model` | No | Corolla |
| `year` | No | 2020 |
| `engine` | No | 1.8L |

Example:

```bash
curl -X POST http://localhost:3001/api/v1/part-searches \
  -F "image=@brake-pad.jpg" \
  -F "make=Toyota" \
  -F "model=Corolla" \
  -F "year=2020" \
  -F "engine=1.8L"
```

The service returns the recognised category, confidence, a safety message, and compatible sample catalogue entries. Replace `data/parts.json` with a verified supplier/fitment catalogue before production. Photo identification is advisory: users must verify the OEM part number or VIN before purchase or repair.

## Gemini key

Create a Gemini API key in Google AI Studio, then place it in `.env` as `GEMINI_API_KEY=...`. The selected `gemini-3.5-flash-lite` model has a free development tier with usage limits; check Google's current pricing and data-usage terms before production use.

## Live retailer offers

Set `SERPAPI_KEY` in `.env` to enable live South African Google Shopping results. Each offer contains the retailer, displayed price, direct product link where supplied by the result, delivery text, ratings/review counts when available, and an explainable quality/price score. The backend does not fabricate prices: without this key it returns a configuration error instead.
