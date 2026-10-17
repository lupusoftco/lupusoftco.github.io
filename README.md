# LupuX AI - Chat Interface

A modern, feature-rich AI chat interface with dark/light theme support, typing animations, and chat export functionality.

![LupuX AI](favicon.png)

## ✨ Features

### 🎨 User Interface
- **Dark & Light Mode** - Automatic theme switching with persistent storage
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Typing animation for AI responses, fade-in effects
- **Modern Design** - Clean, minimal interface inspired by ChatGPT

### 💬 Chat Features
- **Multiple Conversations** - Create and manage multiple chat histories
- **Chat History** - All conversations automatically saved to localStorage
- **Smart Titles** - Chat titles auto-generated from first message
- **Quick Actions** - New chat, delete chat, export all chats

### 🔒 Security & Performance
- **XSS Protection** - Safe message rendering with link detection
- **Error Handling** - Graceful error messages and retry support
- **Auto-scroll** - Messages automatically scroll into view
- **Typing Indicator** - Shows when AI is "typing" (character-by-character animation)

### 📥 Export Functionality
- **JSON Export** - Download all your chats as a JSON file
- **Metadata** - Export includes timestamps and chat information
- **Backup** - Easy way to backup your conversation history

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Make webhook)

### Usage

1. **Open the App**
   - Visit: [https://lupusoftco.github.io](https://lupusoftco.github.io)

2. **Start Chatting**
   - Type your message in the input area
   - Press `Enter` to send (Shift+Enter for new line)
   - AI response appears with typing animation

3. **Create New Chat**
   - Click "＋ Yeni Sohbet" button in sidebar
   - Each chat is saved automatically

4. **Switch Themes**
   - Click "🌙 Tema" button in sidebar
   - Logo changes based on theme for better contrast
   - Your preference is saved

5. **Export Chats**
   - Click "💾 İndir" button in sidebar
   - Downloads all chats as JSON file
   - Includes metadata and timestamps

## 🔧 Configuration

### Change AI Webhook

Edit `script.js` and update the webhook URL:

```javascript
const MAKE_WEBHOOK_URL = "https://your-webhook-url-here";
```

### Customize Typing Speed

Adjust the character delay in `script.js`:

```javascript
function typeMessage(bubbleElement, content) {
  const TYPING_SPEED = 30; // milliseconds per character
  // ...
}
```

### Storage Keys

Customize localStorage keys in `script.js`:

```javascript
const STORAGE_KEYS = {
  CHATS: "your_custom_key_chats",
  CURRENT_CHAT: "your_custom_key_current",
  THEME: "your_custom_key_theme"
};
```

## 🎨 Customization

### Logo & Favicon

Replace the image files:
- `favicon.png` - Favicon
- `logo_ui_dark.png` - Dark mode logo
- `logo_ui_light.png` - Light mode logo

### Colors & Theme

Edit CSS variables in `style.css`:

```css
:root {
  --bg-primary: #343541;
  --text-primary: #ececf1;
  --accent-color: #10a37f;
  /* ... more variables ... */
}
```

### Responsive Breakpoints

Adjust mobile breakpoints in `style.css`:

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with CSS variables for theming
- **Vanilla JavaScript** - No dependencies, pure JS
- **LocalStorage** - Client-side data persistence
- **Make.com Webhook** - AI integration

## 📊 Project Structure

```
.
├── index.html          # Main HTML structure
├── style.css           # Responsive styling with themes
├── script.js           # Chat logic and UI interactions
├── favicon.png         # Favicon
├── logo_ui_dark.png    # Dark mode logo
├── logo_ui_light.png   # Light mode logo
└── README.md           # This file
```

## 🔐 Data & Privacy

- **Local Storage Only** - All data stored in browser's localStorage
- **No Server Storage** - Your chats never sent to server
- **Export Anytime** - You own your data, export whenever you want
- **No Tracking** - No analytics or tracking pixels

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Send Message | `Enter` |
| New Line | `Shift + Enter` |
| New Chat | Click "＋ Yeni Sohbet" |
| Switch Theme | Click "🌙 Tema" |
| Export Chats | Click "💾 İndir" |

## 🐛 Known Limitations

- Chat history only stored in single browser/device
- Maximum localStorage size ~5-10MB (browser dependent)
- No account/cloud sync
- No image/file uploads (text only)

## 🚀 Performance Tips

1. **Clear Old Chats** - Delete old chats to save storage space
2. **Export Regularly** - Backup important conversations
3. **Browser Cache** - Hard refresh (Ctrl+Shift+R) for updates

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

### Editing Files

1. Clone or fork the repository
2. Edit `index.html`, `style.css`, or `script.js`
3. Test locally or on a live server
4. Push changes to deploy

### Adding Features

The codebase is organized with clear separation:
- **DOM Manipulation** - `addMessageToDOM()`
- **State Management** - `state` object and `saveState()`
- **Theme Management** - `applyTheme()` and `toggleTheme()`
- **Chat Logic** - `sendMessage()` and `addMessage()`

## 📞 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Verify webhook URL is correct
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+Shift+R)

## 🎯 Future Enhancements

- [ ] Cloud synchronization
- [ ] Chat search and filtering
- [ ] Message editing and deletion
- [ ] Image support
- [ ] Markdown rendering
- [ ] Code syntax highlighting
- [ ] API integration options
- [ ] Progressive Web App (PWA)

---

Made with ❤️ by **Lupusoft**

**Last Updated:** October 2024 | **Version:** 2.0
