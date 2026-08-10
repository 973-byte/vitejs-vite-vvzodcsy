export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'GEMINI_KEY not set in environment variables' });

  const { type, prompt, image } = req.body || {};

  try {
    const parts = [];

    if (type === 'nutrition' && image?.data) {
      parts.push({ inline_data: { mime_type: image.mimeType || 'image/jpeg', data: image.data } });
      parts.push({ text: `You are a nutrition expert. Analyze this food image.
Return ONLY valid JSON, no markdown, no explanation:
{"foods":["item1"],"calories":400,"protein":30,"carbs":45,"fats":12,"fiber":3,"confidence":"high","notes":"brief note"}
All numbers are integers. confidence is "high","medium", or "low".` });
    } else if (type === 'chat' && prompt) {
      parts.push({ text: prompt });
    } else {
      return res.status(400).json({ error: 'Invalid request: provide type=nutrition with image, or type=chat with prompt' });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: type === 'nutrition' ? 0.1 : 0.7,
            maxOutputTokens: type === 'nutrition' ? 400 : 800
          }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const msg = data?.error?.message || `Gemini error ${geminiRes.status}`;
      return res.status(geminiRes.status).json({ error: msg });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (type === 'nutrition') {
      try {
        const clean = text.replace(/```json|```/g, '').trim();
        const nutrition = JSON.parse(clean);
        return res.status(200).json({ success: true, nutrition });
      } catch {
        return res.status(200).json({ success: false, error: 'Could not parse response. Try a clearer photo.', raw: text });
      }
    }

    return res.status(200).json({ success: true, text });

  } catch (err) {
    console.error('Gemini handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
