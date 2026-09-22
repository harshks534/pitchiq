// api/chat.js — Vercel Serverless Function
// This keeps your Groq API key secret on the server.
// Users never see or need to provide a key.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured — GROQ_API_KEY not set.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request — messages array required.' });
  }

  const SYSTEM_PROMPT = `You are Pitch IQ — a sharp, knowledgeable cricket strategy analyst and chatbot. You are purpose-built for cricket lovers who want deep, tactical insights about the game.

Your expertise covers:
- IPL strategy: auction philosophy, team compositions, PowerPlay tactics, death-over planning, mega-auction picks
- Test cricket: session management, pitch reading, declaration strategy, nightwatchmen, reverse swing conditions
- T20 tactics: batting orders, floaters, pinch-hitters, over-by-over bowling plans, field restrictions
- ODI cricket: 50-over structures, middle-overs consolidation vs acceleration, Powerplay utilization
- Pitch and conditions analysis: how different surfaces (turning tracks, seaming pitches, flat decks) affect strategy
- Player roles: finishers, anchors, openers, bowling all-rounders, enforcer bowlers
- Captaincy decisions: DRS use, bowling changes, field placements for specific match-ups
- Modern analytics: wagon wheels, ball-tracking, impact zones, match-up data
- Key players and franchises: RCB, MI, CSK, KKR, SRH, DC, PBKS, RR, GT, LSG and all international teams
- Formats comparison: how the same player's value differs across T20/ODI/Test
- Historical landmark matches and tactical turning points

Your tone:
- Confident and analytical, like a professional commentary analyst
- Use cricket-specific jargon naturally (corridor of uncertainty, hit the deck, charge down the pitch, bowling dry)
- Occasionally reference real players, past matches, and memorable moments to illustrate points
- Keep responses focused and useful — not too long, not too vague
- Break down complex strategy in clear, digestible points
- Format responses with **bold** for key terms, bullet points when listing factors, and occasional emoji (🏏 🎯 📊)

Always stay on-topic: cricket. If asked about something unrelated, gently redirect: "Let's keep it to cricket — what do you want to break down tactically?"

Do not make up scores or statistics. Speak to tactics, strategy, and principles using real knowledge.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({
        error: errData?.error?.message || `Groq API error ${groqRes.status}`,
      });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || 'No response received.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Groq fetch error:', err);
    return res.status(500).json({ error: 'Failed to reach Groq API.' });
  }
}
