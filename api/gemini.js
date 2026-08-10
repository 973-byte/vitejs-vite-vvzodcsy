export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_KEY = process.env.GEMINI_KEY;

  if (!GEMINI_KEY) {
    return res.status(500).json({
      error: 'GEMINI_KEY not set in environment variables'
    });
  }

  const {
    type,
    prompt,
    image,
    history = []
  } = req.body || {};

  try {
    const parts = [];

    // Nutrition image analysis
    if (type === 'nutrition' && image?.data) {
      parts.push({
        inline_data: {
          mime_type: image.mimeType || 'image/jpeg',
          data: image.data
        }
      });

      parts.push({
        text: `You are a nutrition expert.

Analyze this food image.

Return ONLY valid JSON, no markdown, no explanation:

{
  "foods":["item1"],
  "calories":400,
  "protein":30,
  "carbs":45,
  "fats":12,
  "fiber":3,
  "confidence":"high",
  "notes":"brief note"
}

All numbers are integers.
confidence must be "high", "medium", or "low".`
      });
    }

    // Normal AI chat
    else if (type === 'chat' && prompt) {
      parts.push({
        text: prompt
      });
    }

    else {
      return res.status(400).json({
        error: 'Invalid request: provide type=nutrition with image, or type=chat with prompt'
      });
    }

    // Convert frontend conversation history into Gemini format
    const contents = [];

    if (Array.isArray(history)) {
      for (const message of history) {
        if (!message?.text) continue;

        contents.push({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [
            {
              text: message.text
            }
          ]
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are Overload AI, the fitness assistant inside the Overload workout app.

Your job is to help users with:
- Workouts
- Exercises
- Muscle building
- Weight loss
- Nutrition
- Meal planning
- Training progression
- Recovery
- Using the Overload app

Conversation behavior:
- Talk naturally like a helpful fitness coach.
- Remember and use information from previous messages.
- Do not ask for information the user has already provided.
- Do not repeat the same explanation unnecessarily.
- Ask useful follow-up questions when important information is missing.
- Personalize your answers using the user's stated information.
- Do not make assumptions about personal information.
- Keep answers clear and easy to read.
- Use headings and bullet points when useful.
- Do not sound robotic.
- Do not constantly say "As an AI".
- Be friendly and practical.
- Use emojis sparingly.

For nutrition and fitness calculations:
- Clearly identify estimates.
- Don't present guesses as exact medical or nutritional facts.
- If a question involves a medical condition, injury, or potentially dangerous situation, recommend consulting a qualified healthcare professional.

Most importantly, behave like a continuing conversation rather than answering every message as a completely new question.`
              }
            ]
          },

          contents,

          generationConfig: {
            maxOutputTokens: type === 'nutrition' ? 400 : 1200
          }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const msg =
        data?.error?.message ||
        `Gemini error ${geminiRes.status}`;

      return res.status(geminiRes.status).json({
        error: msg
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Nutrition response
    if (type === 'nutrition') {
      try {
        const clean = text
          .replace(/```json|```/g, '')
          .trim();

        const nutrition = JSON.parse(clean);

        return res.status(200).json({
          success: true,
          nutrition
        });
      } catch {
        return res.status(200).json({
          success: false,
          error: 'Could not parse response. Try a clearer photo.',
          raw: text
        });
      }
    }

    // Chat response
    return res.status(200).json({
      success: true,
      text
    });

  } catch (err) {
    console.error('Gemini handler error:', err);

    return res.status(500).json({
      error: err.message || 'Internal server error'
    });
  }
}
