# 🏏 Pitch IQ — Cricket Strategy AI

A purpose-built cricket strategy chatbot. Not a generic chat wrapper — Pitch IQ is designed to feel like a real analyst desk for cricket fans, coaches, and strategists.

**[Live Demo →](https://pitchiq.vercel.app)** &nbsp;|&nbsp; Built for Thinkly Labs SWE Assignment

---

## Why Cricket?

Cricket — especially IPL and Test cricket — has a layer of tactical depth that most casual fans never fully see: field settings, pitch reading, match-up data, bowling plans, batting order theory, declaration timing. There's a genuine product gap for a conversational tool that can break this down clearly. Pitch IQ fills that gap.

---

## What I Built

A **single-page chatbot** (plain HTML + CSS + JS, no framework) with:

-  **Deep system prompt** — the bot is tuned specifically for cricket: T20 tactics, IPL strategy, Test match nuances, pitch conditions, player roles
-  **Full conversation memory** — the entire message history is sent per request so the bot can reference earlier context
-  **Polished experience design**:
  - Welcome state with 6 curated starter questions to eliminate blank-canvas paralysis
  - Animated typing indicator (3-dot bounce)
  - Error states with clear messaging (rate limit, bad API key, network error)
  - Auto-resizing textarea
  - Markdown-ish formatting: **bold**, bullet lists, headers rendered from Claude's output
  - Stadium-dark aesthetic with cricket-green accents — *feels* like a cricket product
- 📱 Fully responsive — works on mobile

---





## Running Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/harshks534/pitchiq.git
   cd pitchiq
   ```

2. Serve locally (any static server works):
   ```bash
   npx serve .
   # or
   python3 -m http.server 3000
   ```

3. Open `http://localhost:3000`

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

That's it — static site, zero config needed.

---

## Design Decisions

**Why no framework?** The assignment is about product thinking and frontend judgment. A plain HTML/CSS/JS implementation is faster to ship, easier to reason about, and proves you understand the fundamentals. Frameworks are a tool — not a requirement.

**Why a system prompt over a knowledge base?** For a time-boxed assignment, a deeply crafted system prompt gives the AI genuine domain personality without needing a RAG pipeline or vector DB. The "knowledge base" is groq cricket understanding, shaped by careful prompting.

**UI choices that show thought:**
- Suggestion chips solve the cold-start problem — users don't know what to ask a new product
- Error messages are specific (`"Invalid API key"` vs `"Rate limit hit"`) — not just `"Something went wrong"`
- Typing indicator uses a staggered bounce to feel alive, not mechanical
- The green accent (`#4ade80`) was chosen to echo a cricket outfield, not just as a generic "success" color

---

## File Structure

```
pitchiq/
├── index.html      # Structure + welcome state + chat shell
├── style.css       # Full visual design, animations, responsive
├── app.js          # API calls, message state, formatting, error handling
└── README.md
```

---

## Author

Built by [Harsh Sinha] · [harshks534@gmail.com](mailto:your@email.com)  
Submission for Thinkly Labs — Software Engineering Role
