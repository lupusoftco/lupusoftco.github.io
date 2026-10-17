# 🧠 LupuX AI Learning Module - Entegrasyon Rehberi

## Kurulum

### 1️⃣ System Prompt'a Ekle (Make.com)

Make.com'da mevcut system prompt'ın sonuna ekle:

```markdown
## Learning Module
After each response, if you discovered something new or valuable:

1. Extract key insights
2. Format as: [LEARNING] Category | Title | Content
3. Include in your response before the main answer

Important: Use this format ONLY when there's genuine new learning.

Example:
[LEARNING] 💡 Performance Tips | Cache Busting | Using Math.random() causes re-downloads instead of using browser cache

Categories:
- 💡 Sık Sorulan Konular
- 🔧 Teknik Bilgiler
- 🎨 Tasarım & UX
- 📊 Proje Bilgileri
- 🗣️ Konuşma Örnekleri
```

---

### 2️⃣ Script'e Ekle (index.html)

`index.html`'de `script.js` yüklenmesinden SONRA ekle:

```html
<!-- Learning Module -->
<script src="learning-handler.js"></script>
<script>
  // AI response'u işle
  // sendMessage() fonksiyonunun yanıtını buraya ver
  
  // Örneğin, response'u almadan sonra:
  // learningHandler.processResponse(aiResponseText);
</script>
```

---

### 3️⃣ script.js'i Modifiye Et

`sendMessage()` fonksiyonunda, AI response'u aldıktan sonra ekle:

```javascript
// Var olan kod:
const data = await response.text();
if (data && data.trim()) {
  addMessage("assistant", data.trim(), true);
}

// SONRA şu kodu ekle:
// Learning'leri process et
if (window.learningHandler) {
  learningHandler.processResponse(data.trim());
}
```

---

### 4️⃣ GitHub Token Ayarı (Opsiyonel)

GitHub'a direkt yazmak için:

```javascript
// localStorage'e token kaydet
localStorage.setItem('github_token', 'ghp_YOUR_GITHUB_TOKEN_HERE');

// Veya settings UI'da ekle:
<input type="password" id="githubToken" placeholder="GitHub Token">
<script>
  document.getElementById('githubToken').addEventListener('change', (e) => {
    localStorage.setItem('github_token', e.target.value);
    console.log('✅ Token saved');
  });
</script>
```

---

## Kullanım

### AI'dan Learning Nasıl Çıkar?

System prompt aktifse, AI otomatik olarak şu format'ta yazacak:

```
[LEARNING] 💡 Sık Sorulan Konular | Cache Optimization | Math.random() kullanmak gereksiz re-download'a neden olur

Cevabım burada...
```

### Learnings Nereye Yazılır?

1. **Eğer GitHub Token varsa:** `ai.md` dosyasına direkt GitHub'a
2. **Token yoksa:** Browser `localStorage`'e (offline backup)

### Learnings Nasıl Görüntülenir?

```javascript
// Tüm learnings:
learningHandler.getAllLearnings();

// Kategori'ye göre filtrele:
learningHandler.getLearningsByCategory('💡 Sık Sorulan Konular');
```

---

## Workflow

```
User: "sen deepseek misin?"
  ↓
Make.com: System Prompt ile AI'ya gönder
  ↓
AI: "ben LupuX AI'yım" (normal cevap)
   [LEARNING] 🗣️ Konuşma Örnekleri | Identity Check | Users ask about my identity
  ↓
learning-handler.js: [LEARNING] tagını parse et
  ↓
GitHub/localStorage'e kaydet
  ↓
Chat UI: Temiz cevap göster (Learning'ler filtre edilir)
```

---

## Temiz Çıktı (Learning'leri Sakla)

Chat UI'de [LEARNING] taglarını gizlemek için:

```javascript
// script.js'de addMessage() değiştir:
function addMessage(role, content, isTyping = false) {
  // [LEARNING] taglarını çıkar
  const cleanContent = content.replace(/\[LEARNING\].*?(?=\n|$)/gs, '').trim();
  
  // Rest of function...
  chat.messages.push({ role, content: cleanContent });
}
```

---

## Önemli Notlar

✅ **Avantajlar:**
- Otomatik learning'ler
- GitHub + localStorage backup
- Sıfır workflow modifikasyonu (System Prompt + JS)
- Offline çalışabilir

⚠️ **Limitasyonlar:**
- GitHub token gerekli (optional)
- Rate limiting (GitHub API)
- localStorage ~5-10MB limit

🔐 **Security:**
- Token'ı localStorage'de saklamayın (production'da)
- Environment variable kullanın
- Public repo'da sensitive veri koymayın

---

## Debugging

```javascript
// Console'da test et:
learningHandler.extractLearnings('[LEARNING] 💡 Test | Title | Content');
learningHandler.getAllLearnings();

// Debug mode:
console.log('Learning Handler initialized');
```

---

**Hazır!** 🚀 Şimdi her konuşmada AI otomatik olarak öğrenecek!
