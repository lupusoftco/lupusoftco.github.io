// ============================================================================
// LupuX AI - Chat Interface (Refactored & Enhanced)
// Features: Dark Mode, Export Chats, Loading State, XSS Protection, Learning Module
// ============================================================================

// LEARNING MODULE - Auto-learns from AI responses
class LearningHandler {
  constructor() {
    this.learningPattern = /\[LEARNING\]\s+([^|]+)\|\s+([^|]+)\|\s+(.+?)(?=\n|$)/g;
    this.storageKey = 'lupux_learnings';
    this.maxLearnings = 500;
  }

  extractLearnings(aiResponse) {
    const learnings = [];
    let match;
    this.learningPattern.lastIndex = 0;

    while ((match = this.learningPattern.exec(aiResponse)) !== null) {
      learnings.push({
        id: Date.now() + Math.random(),
        category: match[1].trim(),
        title: match[2].trim(),
        content: match[3].trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('tr-TR')
      });
    }

    return learnings;
  }

  saveLearning(learning) {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

      // Prevent duplicates
      if (stored.some(l => l.title === learning.title && l.category === learning.category)) {
        return false;
      }

      stored.unshift(learning); // Add to beginning

      // Keep only latest N learnings
      if (stored.length > this.maxLearnings) {
        stored.pop();
      }

      localStorage.setItem(this.storageKey, JSON.stringify(stored));
      showToast(`📚 Yeni öğrenme kaydedildi: ${learning.title}`, 'success');
      console.log('✅ Learning saved:', learning.title);
      return true;
    } catch (error) {
      console.error('❌ Error saving learning:', error);
      showToast('Öğrenme kaydedilirken hata oluştu', 'error');
      return false;
    }
  }

  processResponse(aiResponse) {
    const learnings = this.extractLearnings(aiResponse);

    if (learnings.length > 0) {
      learnings.forEach(learning => this.saveLearning(learning));
      return learnings.length;
    }

    return 0;
  }

  getAllLearnings() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch (error) {
      console.error('Error retrieving learnings:', error);
      return [];
    }
  }

  getLearningsByCategory(category) {
    return this.getAllLearnings().filter(l => l.category.includes(category));
  }

  getTotalCount() {
    return this.getAllLearnings().length;
  }

  clearAllLearnings() {
    if (confirm('Tüm öğrenmeleri silmek istediğinize emin misiniz?')) {
      localStorage.removeItem(this.storageKey);
      showToast('Tüm öğrenmeler silindi', 'info');
      return true;
    }
    return false;
  }
}

const learningHandler = new LearningHandler();

// Toast Notification System
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  const colors = {
    success: { bg: '#10a37f', text: '#fff' },
    error: { bg: '#ff6b6b', text: '#fff' },
    info: { bg: '#4a90e2', text: '#fff' },
    warning: { bg: '#f5a623', text: '#fff' }
  };

  const color = colors[type] || colors.info;
  toast.style.backgroundColor = color.bg;
  toast.style.color = color.text;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// DOM ELEMENTS
const chatList = document.getElementById("chatList");
const messagesEl = document.getElementById("messages");
const promptEl = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

// CONFIGURATION
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/st14fh11cfbigyzpxo6clkermnat59v8";
const STORAGE_KEYS = {
  CHATS: "lupux_chats",
  CURRENT_CHAT: "lupux_current_chat",
  THEME: "lupux_theme"
};

// STATE MANAGEMENT
const state = {
  chats: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS)) || [],
  currentChatId: localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT) || null,
  isLoading: false
};

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function initializeTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
  const isLight = savedTheme === "light";
  applyTheme(savedTheme);
  updateLogoBasedOnTheme(isLight);
  updateAvatarBackground(isLight);
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  updateThemeButtonText();
  updateLogoBasedOnTheme(isLight);
}

function updateLogoBasedOnTheme(isLight) {
  const logoImg = document.getElementById('logoImg');
  if (logoImg) {
    // Light theme uses dark logo, dark theme uses light logo (for contrast)
    const filename = isLight ? "logo_ui_dark.png" : "logo_ui_light.png";
    logoImg.src = filename;
  }

  // Update avatar background based on theme
  updateAvatarBackground(isLight);
}

function updateAvatarBackground(isLight) {
  const filename = isLight ? "logo_ui_dark.png" : "logo_ui_light.png";
  const avatars = document.querySelectorAll('.message.assistant .avatar');
  avatars.forEach(avatar => {
    avatar.style.backgroundImage = `url('${filename}')`;
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}

function updateThemeButtonText() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  themeBtn.textContent = currentTheme === "dark" ? "☀️ Tema" : "🌙 Tema";
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Generate unique ID for chats
function generateId() {
  return Date.now().toString();
}

// Save state to localStorage
function saveState() {
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(state.chats));
  localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, state.currentChatId);
}

// Format text with links (XSS-SAFE: uses textContent first, then replaces links)
function createSafeMessageElement(text) {
  const container = document.createElement("div");

  // Split text by URL pattern
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const parts = text.split(urlRegex);

  parts.forEach((part, index) => {
    if (urlRegex.test(part)) {
      // This is a URL
      const link = document.createElement("a");
      link.href = part;
      link.textContent = part;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.color = "inherit";
      link.style.textDecoration = "underline";
      link.style.fontWeight = "500";
      container.appendChild(link);
    } else {
      // This is regular text - use textContent to prevent XSS
      const span = document.createElement("span");
      span.textContent = part;
      container.appendChild(span);
    }
  });

  // Handle line breaks (\n -> <br>)
  const html = container.innerHTML
    .replace(/\n/g, "<br>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;font-weight:500;">$1</a>');

  const safeContainer = document.createElement("div");
  safeContainer.innerHTML = html;
  return safeContainer;
}

// Show/hide loading indicator
function setLoading(isLoading) {
  state.isLoading = isLoading;
  loadingIndicator.style.display = isLoading ? "flex" : "none";
  sendBtn.disabled = isLoading;

  if (isLoading) {
    promptEl.focus();
  }
}

// Get current active chat
function getCurrentChat() {
  return state.chats.find(c => c.id === state.currentChatId) || null;
}

// ============================================================================
// CHAT MANAGEMENT
// ============================================================================

function createNewChat() {
  const chat = {
    id: generateId(),
    title: "Yeni Sohbet",
    messages: [],
    createdAt: new Date().toISOString()
  };

  state.chats.unshift(chat);
  state.currentChatId = chat.id;
  saveState();
  renderChats();
  renderMessages();
  promptEl.focus();
}

function deleteChat(id) {
  state.chats = state.chats.filter(c => c.id !== id);

  if (state.currentChatId === id) {
    state.currentChatId = state.chats.length ? state.chats[0].id : null;

    if (state.currentChatId === null) {
      createNewChat();
      return;
    }
  }

  saveState();
  renderChats();
  renderMessages();
}

// ============================================================================
// RENDERING
// ============================================================================

function renderChats() {
  chatList.innerHTML = "";

  if (state.chats.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.style.padding = "12px";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.fontSize = "12px";
    emptyMsg.style.opacity = "0.6";
    emptyMsg.textContent = "Henüz sohbet yok";
    chatList.appendChild(emptyMsg);
    return;
  }

  state.chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "chat-item" + (chat.id === state.currentChatId ? " active" : "");

    const titleEl = document.createElement("span");
    titleEl.className = "chat-title";
    titleEl.textContent = chat.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "chat-delete-btn";
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Sohbeti Sil";

    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Bu sohbeti silmek istediğinize emin misiniz?")) {
        deleteChat(chat.id);
      }
    };

    item.onclick = () => {
      state.currentChatId = chat.id;
      saveState();
      renderChats();
      renderMessages();
    };

    item.appendChild(titleEl);
    item.appendChild(deleteBtn);
    chatList.appendChild(item);
  });
}

function renderMessages() {
  messagesEl.innerHTML = "";
  const chat = getCurrentChat();

  if (!chat) return;

  chat.messages.forEach(msg => {
    addMessageToDOM(msg.role, msg.content);
  });

  // Auto-scroll to bottom
  setTimeout(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 0);
}

function addMessageToDOM(role, content, isTyping = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";

    // Set correct logo based on current theme
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const isLight = currentTheme === "light";
    const filename = isLight ? "logo_ui_dark.png" : "logo_ui_light.png";
    avatar.style.backgroundImage = `url('${filename}')`;

    wrapper.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.id = `bubble-${Date.now()}`;

  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);

  if (isTyping && role === "assistant") {
    // Typing animation for assistant messages
    typeMessage(bubble, content);
  } else {
    // Regular display for user messages
    const safeContent = createSafeMessageElement(content);
    bubble.appendChild(safeContent);
  }

  // Auto-scroll to bottom
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Typing animation effect
function typeMessage(bubbleElement, content) {
  const TYPING_SPEED = 30; // ms per character
  let index = 0;
  let currentText = "";

  const typeInterval = setInterval(() => {
    if (index < content.length) {
      currentText += content[index];
      bubbleElement.innerHTML = "";

      // Parse and display with links
      const safeContent = createSafeMessageElement(currentText);
      bubbleElement.appendChild(safeContent);

      // Auto-scroll
      messagesEl.scrollTop = messagesEl.scrollHeight;
      index++;
    } else {
      clearInterval(typeInterval);
    }
  }, TYPING_SPEED);
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

function addMessage(role, content, isTyping = false) {
  const chat = getCurrentChat();
  if (!chat) return;

  chat.messages.push({ role, content });

  // Set chat title from first user message
  if (chat.messages.length === 1 && role === "user") {
    chat.title = content.slice(0, 30).trim() || "Sohbet";
  }

  saveState();
  renderChats();
  addMessageToDOM(role, content, isTyping);
}

async function sendMessage() {
  const text = promptEl.value.trim();
  if (!text || state.isLoading) return;

  // Create new chat if needed
  if (!getCurrentChat()) {
    createNewChat();
  }

  // Add user message
  addMessage("user", text);
  promptEl.value = "";

  // Auto-resize textarea
  promptEl.style.height = "auto";

  // Show loading state
  setLoading(true);

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.text();

    if (data && data.trim()) {
      // Process learning tags from response
      learningHandler.processResponse(data.trim());

      // Remove [LEARNING] tags for display
      const cleanData = data.trim().replace(/\[LEARNING\][^\n]*\n?/g, '').trim();
      addMessage("assistant", cleanData || data.trim(), true);
    } else {
      addMessage("assistant", "Yanıt boş geldi. Lütfen tekrar deneyin.", true);
    }
  } catch (error) {
    console.error("Error:", error);

    let errorMessage = "Bağlantı hatası oluştu.";
    if (error.message.includes("Failed to fetch")) {
      errorMessage = "Ağ bağlantısı kontrol edin.";
    } else if (error.message.includes("HTTP Error")) {
      errorMessage = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
    }

    addMessage("assistant", errorMessage, true);
  } finally {
    setLoading(false);
    promptEl.focus();
  }
}

// ============================================================================
// EXPORT FUNCTIONALITY
// ============================================================================

function exportChats() {
  if (state.chats.length === 0) {
    alert("Dışa aktarmak için sohbet bulunmuyor.");
    return;
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    totalChats: state.chats.length,
    chats: state.chats
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `lupux-chats-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  alert(`${state.chats.length} sohbet başarıyla indirildi.`);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Send message on button click
sendBtn.onclick = sendMessage;

// Send message on Enter (Shift+Enter for new line)
promptEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize textarea
promptEl.addEventListener("input", (e) => {
  e.target.style.height = "auto";
  e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
});

// New chat button
newChatBtn.onclick = createNewChat;

// Theme toggle
themeBtn.onclick = toggleTheme;

// Export button
exportBtn.onclick = exportChats;

// Mobile menu toggle
function updateMenuToggleVisibility() {
  const isMobile = window.innerWidth <= 768;
  if (menuToggle) {
    menuToggle.style.display = isMobile ? "block" : "none";
  }
}

function toggleSidebar() {
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

if (menuToggle) {
  menuToggle.onclick = toggleSidebar;
}

// Close sidebar when clicking on a chat (mobile)
window.addEventListener("resize", updateMenuToggleVisibility);
window.addEventListener("load", updateMenuToggleVisibility);

// ============================================================================
// INITIALIZATION
// ============================================================================

function initialize() {
  // Initialize theme
  initializeTheme();

  // Initialize chats
  if (state.chats.length === 0) {
    createNewChat();
  } else if (!state.currentChatId || !getCurrentChat()) {
    state.currentChatId = state.chats[0].id;
    saveState();
  }

  renderChats();
  renderMessages();
  promptEl.focus();
}

// Start app
initialize();
