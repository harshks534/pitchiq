// =========================================
// PITCH IQ — Cricket Strategy AI
// app.js — talks to /api/chat (serverless)
// =========================================

// ---- State ----
let conversationHistory = [];
let isLoading = false;

// ---- DOM refs ----
const messagesList  = document.getElementById('messagesList');
const welcomeState  = document.getElementById('welcomeState');
const userInput     = document.getElementById('userInput');
const sendBtn       = document.getElementById('sendBtn');

// ---- Auto-resize textarea ----
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
});

// ---- Send on Enter (Shift+Enter = newline) ----
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

sendBtn.addEventListener('click', handleSend);

// ---- Suggestion chips ----
document.querySelectorAll('.suggestion-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const prompt = chip.dataset.prompt;
    userInput.value = prompt;
    userInput.dispatchEvent(new Event('input'));
    handleSend();
  });
});

// ---- Core send logic ----
async function handleSend() {
  const text = userInput.value.trim();
  if (!text || isLoading) return;

  // Hide welcome state
  if (welcomeState && welcomeState.style.display !== 'none') {
    welcomeState.style.animation = 'fadeOut 0.25s ease forwards';
    setTimeout(() => { welcomeState.style.display = 'none'; }, 250);
  }

  // Clear input
  userInput.value = '';
  userInput.style.height = 'auto';

  // Add user message
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });

  // Show typing
  const typingEl = showTyping();
  setLoading(true);

  try {
    const reply = await callAPI(conversationHistory);
    typingEl.remove();
    appendMessage('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    typingEl.remove();
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

// ---- API call → our serverless function ----
async function callAPI(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Server error ${res.status}`);
  }

  return data.reply;
}

// ---- DOM helpers ----
function appendMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'bot' ? '🏏' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = formatMessage(text);

  if (role === 'user') {
    msg.appendChild(bubble);
    msg.appendChild(avatar);
  } else {
    msg.appendChild(avatar);
    msg.appendChild(bubble);
  }

  messagesList.appendChild(msg);
  scrollToBottom();
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'typing-indicator';
  el.innerHTML = `
    <div class="msg-avatar" style="background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;">🏏</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messagesList.appendChild(el);
  scrollToBottom();
  return el;
}

function showError(msg) {
  const el = document.createElement('div');
  el.className = 'error-msg';
  el.innerHTML = `<span>⚠️</span><span>${escapeHtml(msg)}</span>`;
  messagesList.appendChild(el);
  scrollToBottom();
}

function setLoading(val) {
  isLoading = val;
  sendBtn.disabled = val;
  userInput.disabled = val;
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ---- Message formatter ----
function formatMessage(text) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^[•\-] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html
    .split(/\n\n+/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      if (block.startsWith('<h3>') || block.startsWith('<ul>') || block.startsWith('<blockquote>')) return block;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fade-out keyframe for welcome state
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);
