# 🤖 LupuX AI - Lightweight AI Assistant

> A browser-based, privacy-first chat interface with persistent learning memory. Run locally, scale globally—zero server infrastructure required.

![LupuX AI](https://img.shields.io/badge/License-GPL--3.0-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-green.svg)

**[🚀 Try Now](https://lupusoftco.github.io)** | **[📖 Documentation](#table-of-contents)** | **[🐛 Report Issue](https://github.com/lupusoftco/lupusoftco.github.io/issues)**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Learning System](#learning-system)
- [API Setup](#api-setup)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [License](#license)

---

## 🎯 Overview

**LupuX AI** is a lightweight, self-contained AI chat interface that runs entirely in your browser. Unlike traditional chatbots, it:

- 🔒 **Stores everything locally** - No data leaves your device (localStorage only)
- 🧠 **Learns from conversations** - Auto-extracts and remembers key information
- ⚡ **Works with low-spec models** - Haiku, Nano, or any small LLM
- 💰 **Zero server costs** - Deploys on GitHub Pages (~30KB total)
- 📱 **Fully responsive** - Desktop, tablet, mobile
- 🎨 **Beautiful dark/light themes** - Automatic or manual toggle
- 🔐 **Privacy-first** - No tracking, no analytics, no external calls

### Core Philosophy

> **Minimal infrastructure. Maximum intelligence.**

By combining a small AI model with a persistent learning system, LupuX AI achieves smart conversations without expensive server infrastructure. Perfect for entrepreneurs, hobbyists, and privacy-conscious users.

---

## ✨ Features

### 💬 Chat Interface
- **Real-time streaming** - Messages display with character-by-character typing animation
- **Multiple conversations** - Unlimited chat history in browser localStorage
- **Message export** - Download all chats as JSON with metadata
- **Auto-save** - Every message persists automatically
- **Auto-scroll** - Messages automatically scroll to bottom
- **Clean interface** - Modern, minimal design inspired by ChatGPT

### 🧠 Learning System
- **Auto-learning** - AI extracts knowledge from every response
- **Persistent memory** - Previous learnings included in context for next message
- **Toast feedback** - Visual notification when AI learns something
- **Private learnings** - All stored locally, never uploaded
- **Automatic deduplication** - Same learning not saved twice
- **Max 500 learnings** - Auto-cleanup of oldest learnings

### 🎨 Theme & UI
- **Dark/Light modes** - Toggle with one click (default: dark)
- **Persistent theme** - Your preference saved automatically
- **Logo switching** - Different logos for each theme
- **Responsive design** - Optimized for all screen sizes:
  - Desktop (≥1024px) - Full sidebar + chat
  - Tablet (769-1024px) - Optimized layout
  - Mobile (≤768px) - Collapsible sidebar
  - Small phones (≤480px) - Touch-optimized
  - Landscape - Condensed layout
- **CSS variables** - Easy color customization
- **Zero dependencies** - Pure vanilla JavaScript + CSS

### 🔐 Privacy & Security
- **XSS protection** - Safe message rendering with link detection
- **No tracking** - No analytics, cookies, or external calls
- **Open source** - GPL-3.0 license, full transparency
- **Self-hosted** - Full control over your data
- **GDPR-friendly** - No personal data collection

---

## 🚀 Quick Start

### 1. **Visit the App**

```
https://lupusoftco.github.io
```

The app is live and ready to use! No installation needed.

### 2. **Configure AI Backend**

By default, the app needs a webhook to an AI service. Follow [API Setup](#api-setup) section to configure Make.com (free tier available).

### 3. **Start Chatting**

1. Type a message
2. Press `Enter` or click `➤`
3. AI responds with typing animation
4. Learning automatically saved

---

## 🏗️ Architecture

### Project Structure

```
lupusoftco.github.io/
├── index.html                 # HTML structure (responsive)
├── script.js                  # Main app logic (565 lines)
├── style.css                  # Styling & themes (694 lines)
├── README.md                  # Documentation
├── LICENSE                    # GPL-3.0
├── favicon.png                # Tab icon
├── logo_ui_dark.png           # Light theme logo
└── logo_ui_light.png          # Dark theme logo
```

### Data Flow

```
User Input
    ↓
[Retrieve Previous Learnings from localStorage]
    ↓
Prepend Learnings as Context
    ↓
Send to Make.com Webhook
    ↓
AI Responds (includes [LEARNING] tags)
    ↓
Extract & Save Learnings to localStorage
    ↓
Remove Tags from Display
    ↓
Show Toast Notification
    ↓
Display Message with Typing Animation
```

### Storage Structure

All data is stored in browser `localStorage`:

```javascript
{
  // Chat history
  "lupux_chats": [
    {
      "id": "1729185040000",
      "title": "First Chat",
      "messages": [
        { "role": "user", "content": "Hello" },
        { "role": "assistant", "content": "Hi there!" }
      ],
      "createdAt": "2026-10-17T22:50:40.000Z"
    }
  ],
  "lupux_current_chat": "1729185040000",
  "lupux_theme": "dark",
  
  // Learning memory (auto-saved)
  "lupux_learnings": [
    {
      "id": 1729185050000.123,
      "title": "User Preference",
      "content": "User prefers bullet points over paragraphs",
      "timestamp": "2026-10-17T22:50:50.123Z",
      "date": "17.10.2026"
    }
  ]
}
```

### Performance Metrics

| Metric | Value |
|--------|-------|
| Bundle Size | ~30KB (all files) |
| Lines of Code | 565 (script.js) |
| CSS Rules | 694 lines |
| HTML | 90 lines |
| Dependencies | 0 (zero!) |
| Load Time | <1 second |
| Initial Paint | <500ms |

---

## 🧠 Learning System

### How It Works

**Step 1: AI Includes [LEARNING] Tags**

The system prompt instructs your AI to include learning tags:

```
[LEARNING] User Preference | Prefers bullet points over paragraphs

Here's my detailed response...
```

**Step 2: JavaScript Extracts Learning**

The app uses regex to extract:
- **Title:** "User Preference"  
- **Content:** "Prefers bullet points over paragraphs"

**Step 3: Save to localStorage**

Learning is saved with:
- Unique ID (timestamp + random)
- Date formatted (Turkish format: 17.10.2026)
- ISO timestamp for sorting

**Step 4: Next Message Includes Context**

All previous learnings are prepended to the next user message:

```
📖 BİLGİ BANKASI (Daha önceki dersler):
• User Preference: Prefers bullet points over paragraphs
• Technical Level: Understands React and Node.js
• Communication Style: Direct, no fluff

---

[User's actual message]
```

The AI now has full context and can reference previous learnings!

### Format Requirements

Your system prompt must instruct the AI to use this format:

```
After EVERY response, include a [LEARNING] tag if you learned something:

Format: [LEARNING] Title | Knowledge/Lesson
Place it at the TOP of your response, BEFORE your answer.

Examples:
[LEARNING] User Name | User is named Burak
[LEARNING] React Knowledge | User understands hooks and context API
[LEARNING] Preference | User prefers concise answers
```

### Limitations & Notes

| Aspect | Details |
|--------|---------|
| **Max Learnings** | 500 (oldest auto-deleted) |
| **Storage Type** | Browser localStorage only |
| **Device Sync** | No cross-device sync |
| **Deduplication** | Prevents exact duplicates |
| **Persistence** | Lost if browser cache cleared |

### Console Commands (Developer)

```javascript
// View all learnings
learningHandler.getAllLearnings()

// Search learnings by title
learningHandler.getLearningsByTitle("React")

// Get total count
learningHandler.getTotalCount()

// Clear all learnings (warning!)
learningHandler.clearAllLearnings()

// Test extraction
learningHandler.processResponse("[LEARNING] Test | This is a test")
```

---

## 🔌 API Setup (Make.com)

LupuX AI communicates with Make.com using a webhook. Here's the complete setup:

### Step 1: Create Make.com Account

1. Go to [make.com](https://make.com)
2. Sign up (free tier available)
3. Go to Dashboard → Scenarios

### Step 2: Create Scenario

1. Click **Create New Scenario**
2. Name: "LupuX AI"
3. Choose **Custom Webhook** as trigger

### Step 3: Add AI Module

1. Add **Run AI Agent** module (or AI integration of choice)
2. Click **Create Connection** if needed

### Step 4: Configure AI Settings

| Setting | Value |
|---------|-------|
| **Model** | GPT-5 Nano, Claude Haiku, or similar |
| **Token Limit** | 30% (keep responses short) |
| **System Prompt** | See [System Prompt](#system-prompt) section |
| **Output Type** | Text |

### Step 5: Add Response Module

1. Add **Webhook Response** module
2. Set Body: `{{ module_name.response }}`
3. Status: `200`
4. Content-Type: `text/plain`

### Step 6: Get Webhook URL

1. Activate the scenario (toggle ON)
2. Copy the webhook URL from the trigger module
3. Update `script.js`:

```javascript
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/your-webhook-id";
```

### Step 7: Test

1. Refresh the app (Ctrl+Shift+R)
2. Send a test message
3. Should see loading spinner → typing animation → response

### System Prompt Template

```markdown
You are LupuX AI, a helpful assistant.

## Response Format
- Keep responses brief (2-3 sentences max)
- Use bullet points for multiple ideas
- Be direct and concise

## Learning Module
After EVERY response, if you learned something:
[LEARNING] Title | Knowledge

Examples:
[LEARNING] User Name | User is named Burak
[LEARNING] Preference | User prefers bullet points
[LEARNING] React Knowledge | User understands hooks
```

### Alternative Providers

You can use any HTTP API:

**OpenAI:**
```javascript
// Requires authentication
// Custom request format needed
```

**Anthropic Claude:**
```javascript
// Use Claude API directly
// Requires API key management
```

**Ollama (Local):**
```javascript
const MAKE_WEBHOOK_URL = "http://localhost:11434/api/generate";
```

---

## ⚙️ Configuration

### Webhook URL

In `script.js` (line ~20):

```javascript
const MAKE_WEBHOOK_URL = "https://your-webhook-url";
```

### Typing Speed

In `script.js`, `typeMessage()` function:

```javascript
const TYPING_SPEED = 30; // milliseconds per character
```

Lower = faster, higher = slower

### Max Learnings

In `script.js`, `LearningHandler` constructor:

```javascript
this.maxLearnings = 500; // Maximum stored learnings
```

### Theme Colors

In `style.css`, CSS Variables section:

**Dark Mode:**
```css
:root[data-theme="dark"] {
  --bg-primary: #343541;
  --text-primary: #ececf1;
  --accent-color: #10a37f;
  --border-color: #565869;
  /* ... more colors ... */
}
```

**Light Mode:**
```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #0d0d0d;
  --accent-color: #10a37f;
  /* ... more colors ... */
}
```

### Responsive Breakpoints

In `style.css`:

```css
/* Tablet: 769px - 1024px */
@media (max-width: 1024px) { ... }

/* Mobile: ≤ 768px */
@media (max-width: 768px) { ... }

/* Small phones: ≤ 480px */
@media (max-width: 480px) { ... }

/* Landscape: max height 500px */
@media (max-height: 500px) { ... }
```

---

## 📖 Usage Guide

### Starting a Chat

1. **Type your message** in the textarea
2. **Press Enter** or click **➤** (send button)
3. **Wait for response** - Shows loading spinner while AI thinks
4. **Watch typing animation** - AI response appears character-by-character
5. **Get toast notification** - If AI learned something (appears for 3 seconds)

### Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Send message | `Enter` |
| New line in message | `Shift + Enter` |
| Create new chat | Click **＋ Yeni Sohbet** |
| Switch theme | Click **🌙 Tema** |
| Export all chats | Click **💾 İndir** |

### Chat Management

**Create New Chat:**
- Click **＋ Yeni Sohbet** button in sidebar
- Automatically switches to new chat

**Switch Between Chats:**
- Click chat name in sidebar
- Previous chat is automatically saved

**Delete Chat:**
- Hover over chat name
- Click **×** button (if shown)
- Or right-click and select delete

**Export All Chats:**
- Click **💾 İndir** button
- Downloads JSON file
- Can be imported later or analyzed

### Theme Toggle

**Switch Theme:**
- Click **🌙 Tema** button in sidebar
- Theme changes immediately
- Logo updates automatically
- Preference saved to localStorage

**Custom Colors:**
- Edit CSS variables in `style.css`
- Both themes use same variable names
- Easy to customize entire look

### Learning Memory

**Check Saved Learnings:**

Open browser DevTools (F12) → Console → Type:

```javascript
learningHandler.getAllLearnings()
```

Shows array of all learned information.

**Search Learnings:**

```javascript
learningHandler.getLearningsByTitle("React")
```

Returns matching learnings.

**View Statistics:**

```javascript
learningHandler.getTotalCount()
```

Shows how many learnings are saved.

**Clear Everything:**

```javascript
learningHandler.clearAllLearnings()
```

⚠️ Warning: This deletes all learnings!

---

## 🌍 Deployment

### GitHub Pages (Recommended)

```bash
# 1. Push to your GitHub Pages repo
git push origin main

# 2. Site deploys to:
# https://yourusername.github.io

# 3. Updates cache every 24 hours
```

**With Custom Domain:**

1. Create `CNAME` file in repo:
   ```
   yourdomain.com
   ```
2. Configure DNS in registrar
3. Enable HTTPS in GitHub Pages settings

### Netlify

```bash
# 1. Connect GitHub repo
# 2. Build command: (leave empty)
# 3. Publish directory: . (current)
# 4. Deploy

# Site goes live automatically
```

### Vercel

```bash
# 1. Import project from GitHub
# 2. Select root directory: .
# 3. Deploy

# Automatic updates on git push
```

### Self-Hosted

Just upload these files to any web server:

```
index.html
script.js
style.css
favicon.png
logo_ui_dark.png
logo_ui_light.png
```

No build process, no dependencies!

---

## 🐛 Troubleshooting

### "Chat not sending / AI not responding"

**Check Make.com webhook:**

1. Open `script.js`, find `MAKE_WEBHOOK_URL`
2. Copy the URL
3. Go to Make.com → Scenarios → Your scenario
4. Verify scenario is **ACTIVATED** (toggle switch ON)
5. Test webhook manually in Make.com UI

**Check browser console:**

- Press F12 → Console tab
- Try sending a message
- Look for error messages
- Common errors:
  - `Failed to fetch` - Network issue
  - `HTTP 400/500` - Webhook error
  - `Empty response` - AI didn't respond

**Check network:**

- F12 → Network tab
- Try sending message
- Look for `make.com` request
- Should show `200` status

### "Learning not saving"

**Check if [LEARNING] tags in response:**

1. Send a message
2. Open DevTools → Console
3. Look for `✅ Learning saved:` messages
4. If not appearing, AI isn't outputting tags

**Check localStorage:**

```javascript
JSON.parse(localStorage.getItem('lupux_learnings'))
```

Should show array of learnings.

**Verify system prompt:**

- Make.com → Your scenario
- AI Agent module → System Prompt section
- Must include `[LEARNING] Title | Content` format
- Must include instruction to output on EVERY response

### "Dark mode not working / logos not changing"

**Hard refresh browser:**

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Clear cache:**

- F12 → Application → Storage
- Clear localStorage
- Refresh page

**Check CSS loads:**

- F12 → Network tab
- Should see `style.css?v=2024`
- Should be `200` status

**Verify theme attribute:**

- F12 → Elements tab
- Find `<html>` tag
- Should have `data-theme="dark"` or `data-theme="light"`

### "Mobile layout broken / sidebar not showing"

**Test on real mobile:**

- Browser resize isn't accurate
- Test on actual phone if possible

**Check viewport meta:**

In `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Should be present.

**Check sidebar toggle:**

- At ≤768px width
- Click ☰ button in top-left
- Should show/hide sidebar

**Test responsive breakpoints:**

- F12 → Device toolbar icon
- Test iPhone, iPad, Android sizes

### "Typing animation stutters / lags"

**Check TYPING_SPEED:**

```javascript
const TYPING_SPEED = 30; // should be 30ms
```

**Check CPU usage:**

- Close other browser tabs
- Try in private/incognito mode
- Check if other apps using CPU

**Try different browser:**

- Chrome, Firefox, Safari
- See if issue persists
- Might be browser-specific

### "Can't see info bubble text"

**Hover over ℹ️ icon:**

- Bottom-left of sidebar
- Hover to see tooltip
- Should show "LupuX AI" and "Lightweight AI Assistant"

---

## 👨‍💻 Development

### Project Structure

| File | Lines | Purpose |
|------|-------|---------|
| `script.js` | 565 | Core logic, chat, learning |
| `style.css` | 694 | Responsive design, themes |
| `index.html` | 90 | HTML structure |
| `README.md` | - | Documentation |
| `LICENSE` | - | GPL-3.0 license |

### Key Classes & Functions

**LearningHandler Class:**
```javascript
extractLearnings(aiResponse)        // Parse [LEARNING] tags
saveLearning(learning)              // Store to localStorage
processResponse(aiResponse)         // Main processor
getAllLearnings()                   // Retrieve all
getLearningsByTitle(searchTerm)     // Search
getTotalCount()                     // Statistics
clearAllLearnings()                 // Reset
```

**Main Functions:**
```javascript
sendMessage()                       // Send to Make.com
createNewChat()                     // New conversation
deleteChat(chatId)                  // Remove conversation
renderChats()                       // Update sidebar
renderMessages()                    // Display messages
toggleTheme()                       // Switch dark/light
addMessage(role, content, isTyping) // Add to DOM
typeMessage(bubbleElement, content) // Typing animation
```

### Adding Features

**Add New Chat Function:**

1. Edit `script.js` → Chat Management section
2. Follow existing function patterns
3. Test on mobile (≤768px)

**Add Theme Colors:**

1. Edit `style.css` → CSS Variables
2. Update both dark and light mode sections
3. Test readability in both themes

**Modify Learning Behavior:**

1. Edit `LearningHandler` class methods
2. Update regex if format changes
3. Test in console: `learningHandler.processResponse(testString)`

### Code Quality

- **No dependencies** - Pure vanilla JavaScript
- **No build process** - Direct deployment
- **XSS protection** - Safe DOM creation
- **Responsive** - Mobile-first design
- **Performance** - Optimized for speed

---

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Latest | Full support |
| Firefox | ✅ Latest | Full support |
| Safari | ✅ Latest | Full support |
| Edge | ✅ Latest | Full support |
| Mobile Chrome | ✅ Latest | Full support |
| Mobile Safari | ✅ Latest | Full support |
| IE11 | ❌ Not supported | Use modern browser |

---

## 🔐 Privacy & Data

- **Location:** Browser `localStorage`
- **Sharing:** Never sent to servers
- **Deletion:** Clear browser cache to delete
- **Export:** Download as JSON anytime
- **Tracking:** None (no analytics)
- **GDPR:** Fully compliant (no data collection)

---

## 📝 License

**GNU General Public License v3 (GPL-3.0)**

You can:
- ✅ Use freely
- ✅ Modify code
- ✅ Distribute it
- ⚠️ Must share source code
- ⚠️ Same license for derivatives

See [LICENSE](LICENSE) file.

---

## 🤝 Contributing

Contributions welcome! To contribute:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Make changes
4. Test thoroughly
5. Commit (`git commit -m "Add feature"`)
6. Push (`git push origin feature/amazing`)
7. Open Pull Request

### Areas Needing Help

- 🎨 UI/UX improvements
- 🌍 Internationalization (i18n)
- 📱 Mobile optimizations
- 🔒 Security audits
- 📚 Documentation
- 🧪 Test coverage
- 🚀 Performance improvements

---

## 📞 Support

- **GitHub Issues:** [Open Issue](https://github.com/lupusoftco/lupusoftco.github.io/issues)
- **Email:** lupusyazilim@gmail.com
- **Live:** https://lupusoftco.github.io

---

## 🚀 Roadmap

### Phase 1: ✅ Complete
- [x] Learning system
- [x] Dark/light theme
- [x] Chat export
- [x] Responsive design
- [x] Learning context injection

### Phase 2: 🔄 In Progress
- [ ] Offline mode (Service Worker)
- [ ] Learning dashboard
- [ ] Chat search

### Phase 3: 📋 Planned
- [ ] Keyboard shortcuts
- [ ] Voice input
- [ ] Multiple AI providers
- [ ] Learning statistics

---

## 📊 Statistics

- **Commits:** 30+
- **Stars:** ⭐ (please star!)
- **Contributors:** Welcome!
- **Version:** 1.0
- **Status:** Active & Maintained

---

**Made with ❤️ by Lupusoft**

```
LupuX AI - Lightweight AI Assistant
Zero-server. Privacy-first. Forever free.
```

---

**Last Updated:** October 2026 | **Version:** 2.0
