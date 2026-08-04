export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

  const { type, prompt, image } = req.body;

  try {
    let requestBody;

    if (type === 'nutrition' && image) {
      // Food photo analysis
      requestBody = {
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: image.mimeType,
                data: image.data
              }
            },
            {
              text: `You are a nutrition expert. Analyze this food image and provide estimated nutritional information.

Return ONLY a JSON object in this exact format, no other text:
{
  "foods": ["food item 1", "food item 2"],
  "calories": 450,
  "protein": 35,
  "carbs": 42,
  "fats": 12,
  "fiber": 4,
  "confidence": "high",
  "notes": "Brief note about the meal"
}

All values should be numbers (grams for macros, kcal for calories).
Confidence should be "high", "medium", or "low".
Be realistic with Indian food portions if applicable.`
            }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
      };
    } else {
      // AI Bot chat
      requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (type === 'nutrition') {
      try {
        const clean = text.replace(/```json|```/g, '').trim();
        const nutrition = JSON.parse(clean);
        return res.status(200).json({ success: true, nutrition });
      } catch {
        return res.status(200).json({ success: false, error: 'Could not parse nutrition data', raw: text });
      }
    }

    return res.status(200).json({ success: true, text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
