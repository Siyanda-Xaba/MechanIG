import { GoogleGenAI } from '@google/genai';
import { supportedCategories } from './catalogueService.js';

function parseJson(text) {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
}

export async function analysePartImage(file) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
    const error = new Error('Picture recognition is not configured. Set GEMINI_API_KEY on the server.');
    error.statusCode = 503;
    throw error;
  }

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = [
    'You identify visible automotive parts for a vehicle-parts search service.',
    'Return only valid JSON. Do not diagnose faults or give repair instructions.',
    `Choose up to 3 categories only from: ${supportedCategories.join(', ')}.`,
    'If the photo is unclear, not an automotive part, or cannot be confidently identified, return an empty categories array.',
    'Use this exact schema:',
    '{"categories":["..."],"partName":"string or null","confidence":0.0,"reason":"short factual visual description","requiresManualVerification":true}',
    'confidence must be a number from 0 to 1. requiresManualVerification must always be true.'
  ].join('\n');

  const result = await client.interactions.create({
    model: process.env.GEMINI_VISION_MODEL || 'gemini-3.5-flash-lite',
    input: [
      { type: 'text', text: prompt },
      { type: 'image', data: file.buffer.toString('base64'), mime_type: file.mimetype }
    ]
  });

  let analysis;
  try {
    analysis = parseJson(result.output_text);
  } catch {
    const error = new Error('The recognition service returned an unreadable result. Please try a clearer photo.');
    error.statusCode = 502;
    throw error;
  }

  const categories = Array.isArray(analysis.categories)
    ? analysis.categories.filter((category) => supportedCategories.includes(category)).slice(0, 3)
    : [];

  return {
    categories,
    partName: typeof analysis.partName === 'string' ? analysis.partName : null,
    confidence: Math.min(1, Math.max(0, Number(analysis.confidence) || 0)),
    reason: typeof analysis.reason === 'string' ? analysis.reason : 'No reliable identification was possible.',
    requiresManualVerification: true
  };
}
