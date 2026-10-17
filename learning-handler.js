// ============================================================================
// LupuX AI Learning Module
// Otomatik olarak AI response'larından öğrenmeleri parse eder ve kaydeder
// ============================================================================

class LearningHandler {
  constructor(githubToken = null) {
    this.githubToken = githubToken;
    this.learnings = [];
    this.aiMdUrl = 'https://raw.githubusercontent.com/lupusoftco/lupusoftco.github.io/main/ai.md';
    this.learningPattern = /\[LEARNING\]\s+([^|]+)\|\s+([^|]+)\|\s+(.+?)(?=\n|$)/g;
  }

  /**
   * AI response'tan öğrenmeleri extract et
   */
  extractLearnings(aiResponse) {
    const learnings = [];
    let match;

    while ((match = this.learningPattern.exec(aiResponse)) !== null) {
      learnings.push({
        category: match[1].trim(),
        title: match[2].trim(),
        content: match[3].trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('tr-TR')
      });
    }

    return learnings;
  }

  /**
   * Öğrenmeleri ai.md dosyasına format et
   */
  formatForMarkdown(learning) {
    return `### [${learning.date}] - ${learning.title}
**Kategori:** ${learning.category}
**İçerik:** ${learning.content}
**Tarih:** ${learning.timestamp}

`;
  }

  /**
   * Browser localStorage'e kaydet (offline backup)
   */
  saveLearningLocally(learning) {
    try {
      const stored = JSON.parse(localStorage.getItem('lupux_learnings') || '[]');
      stored.push(learning);
      localStorage.setItem('lupux_learnings', JSON.stringify(stored));
      console.log('✅ Learning saved locally:', learning.title);
    } catch (error) {
      console.error('❌ Error saving learning locally:', error);
    }
  }

  /**
   * GitHub'a kaydet (Main method)
   */
  async saveLearningToGitHub(learning) {
    if (!this.githubToken) {
      console.warn('⚠️ GitHub token not configured. Using local storage only.');
      this.saveLearningLocally(learning);
      return false;
    }

    try {
      // 1. Mevcut ai.md dosyasını oku
      const response = await fetch(
        'https://api.github.com/repos/lupusoftco/lupusoftco.github.io/contents/ai.md',
        {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+raw'
          }
        }
      );

      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

      const currentContent = await response.text();

      // 2. Yeni öğrenmeyi ekle (📝 Öğrenim Kaydı Formatı bölümünün altına)
      const newEntry = this.formatForMarkdown(learning);
      const insertPoint = currentContent.indexOf('---\n\n**Not:**');

      let updatedContent;
      if (insertPoint !== -1) {
        updatedContent =
          currentContent.slice(0, insertPoint) +
          newEntry +
          currentContent.slice(insertPoint);
      } else {
        updatedContent = currentContent + '\n\n' + newEntry;
      }

      // 3. GitHub'a geri yaz
      const updateResponse = await fetch(
        'https://api.github.com/repos/lupusoftco/lupusoftco.github.io/contents/ai.md',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `📚 Learning: ${learning.title}`,
            content: btoa(updatedContent), // Base64 encode
            branch: 'main'
          })
        }
      );

      if (updateResponse.ok) {
        console.log('✅ Learning saved to GitHub:', learning.title);
        return true;
      } else {
        throw new Error('Failed to update ai.md');
      }
    } catch (error) {
      console.error('❌ Error saving to GitHub:', error);
      // Fallback: localStorage'e kaydet
      this.saveLearningLocally(learning);
      return false;
    }
  }

  /**
   * AI response'u işle ve öğrenmeleri kaydet
   */
  async processResponse(aiResponse) {
    const learnings = this.extractLearnings(aiResponse);

    if (learnings.length === 0) {
      console.log('ℹ️ No learnings in this response');
      return;
    }

    console.log(`🧠 Found ${learnings.length} learning(s)`);

    for (const learning of learnings) {
      await this.saveLearningToGitHub(learning);
    }
  }

  /**
   * Öğrenmeleri filtrele ve göster
   */
  getLearningsByCategory(category) {
    try {
      const stored = JSON.parse(localStorage.getItem('lupux_learnings') || '[]');
      return stored.filter(l => l.category.includes(category));
    } catch (error) {
      console.error('Error retrieving learnings:', error);
      return [];
    }
  }

  /**
   * Tüm öğrenmeleri göster
   */
  getAllLearnings() {
    try {
      return JSON.parse(localStorage.getItem('lupux_learnings') || '[]');
    } catch (error) {
      console.error('Error retrieving learnings:', error);
      return [];
    }
  }
}

// ============================================================================
// INTEGRATION WITH LupuX AI CHAT
// ============================================================================

// Başlat (token yoksa sadece localStorage kullan)
const learningHandler = new LearningHandler(
  localStorage.getItem('github_token') // Eğer user token sağlamışsa
);

// AI response aldıktan sonra çağır:
// learningHandler.processResponse(aiResponseText);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LearningHandler;
}
