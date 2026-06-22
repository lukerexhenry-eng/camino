// netlify/functions/generate-lesson.js
//
// This runs on Netlify's servers, never in the browser — so the API key
// never gets exposed to anyone viewing the page source. The frontend calls
// /.netlify/functions/generate-lesson instead of any AI API directly.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let typed;
  try {
    const body = JSON.parse(event.body || '{}');
    typed = (body.typed || '').trim();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request body' }) };
  }

  if (!typed) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nothing to build a lesson from' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server is missing GEMINI_API_KEY — check Netlify environment variables.' }) };
  }

  const prompt = `You are a Colombian Spanish tutor. A beginner with imperfect spelling typed this from a real chat with their Colombian friend: "${typed}"
FIRST correct misspellings to what they most likely meant (Colombian context). THEN build a mini-lesson around the corrected term plus 3-5 related words.
Respond ONLY valid JSON (no markdown, no code fences): {"understood":"corrected term","title":"short English title","emoji":"one emoji","summary":"one warm English sentence","cards":[{"es":"Spanish","en":"English","hook":"tip","note":"note or empty"}]}
Colombian Spanish; beginner-friendly; 4-6 cards.`;

  // gemini-2.5-flash is on Google's free tier as of mid-2026. If this ever
  // stops working, check https://ai.google.dev/gemini-api/docs/pricing for
  // the current free-tier model name and swap it in below.
  const MODEL = 'gemini-2.5-flash';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: `Gemini API error (${res.status}): ${errText.slice(0, 300)}` }) };
    }

    const data = await res.json();
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text;

    if (!text) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Gemini returned no usable content' }) };
    }

    const cleaned = text.replace(/```json|```/g, '').trim();

    // Validate it's actually parseable JSON before sending it back, so the
    // frontend never has to guess whether a failure happened here or there.
    JSON.parse(cleaned);

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: cleaned };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: `Lesson generation failed: ${e.message}` }) };
  }
};
