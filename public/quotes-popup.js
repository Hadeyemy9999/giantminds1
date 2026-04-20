// Quotes Popup Modal Logic
// Handles display, interactions, and user actions for the quotes popup

class QuotesPopup {
  constructor() {
    this.currentQuote = null;
    this.currentQuoteIndex = 0;
    this.timeoutId = null;
    this.timerBarId = null;
    this.currentCategory = null;
    this.currentCategoryQuotes = [];
    this.isOpen = false;
  }

  // Initialize the popup
  init() {
    this.createPopupHTML();
    this.setupEventListeners();
    this.setupTouchListeners();
  }

  // Create popup HTML if it doesn't exist
  createPopupHTML() {
    if (document.getElementById('quotes-popup')) {
      return; // Already exists
    }

    const popupHTML = `
      <div id="quotes-popup" class="quotes-modal" style="display: none;">
        <div class="quotes-container">
          <!-- Close Button -->
          <button id="close-quotes" class="quotes-close" title="Close">×</button>
          
          <!-- Quote Display -->
          <div id="quote-display" class="quote-text">
            <p id="quote-content"></p>
            <p id="quote-author" class="quote-author"></p>
            <p id="quote-greeting" class="quote-greeting"></p>
          </div>
          
          <!-- Action Buttons -->
          <div class="quotes-actions">
            <button id="prev-quote" class="quotes-btn prev-btn" title="Previous quote">← Previous</button>
            <button id="copy-quote" class="quotes-btn copy-btn" title="Copy to clipboard">📋 Copy</button>
            <button id="next-quote" class="quotes-btn next-btn" title="Next quote">Next →</button>
          </div>
          
          <!-- Progress Indicator -->
          <div class="quotes-progress">
            <div id="timer-bar" class="timer-bar"></div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }

  // Setup event listeners
  setupEventListeners() {
    const closeBtn = document.getElementById('close-quotes');
    const copyBtn = document.getElementById('copy-quote');
    const nextBtn = document.getElementById('next-quote');
    const prevBtn = document.getElementById('prev-quote');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (copyBtn) copyBtn.addEventListener('click', () => this.copyQuote());
    if (nextBtn) nextBtn.addEventListener('click', () => this.showNextQuote());
    if (prevBtn) prevBtn.addEventListener('click', () => this.showPreviousQuote());
  }

  // Setup touch/swipe listeners
  setupTouchListeners() {
    const popup = document.getElementById('quotes-popup');
    if (!popup) return;

    let touchStartX = 0;
    let touchEndX = 0;

    popup.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    popup.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, false);
  }

  // Handle swipe gestures
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next quote
        this.showNextQuote();
      } else {
        // Swiped right - show previous quote
        this.showPreviousQuote();
      }
    }
  }

  // Display the popup with a quote
  show(quote, category, quotes) {
    this.currentQuote = quote;
    this.currentCategory = category;
    this.currentCategoryQuotes = quotes;
    this.currentQuoteIndex = quotes.findIndex(q => q.id === quote.id);
    this.isOpen = true;

    this.displayQuote(quote);
    this.openPopup();
    this.startTimer();
  }

  // Display a specific quote
  displayQuote(quote) {
    const contentEl = document.getElementById('quote-content');
    const authorEl = document.getElementById('quote-author');
    const greetingEl = document.getElementById('quote-greeting');

    if (contentEl) {
      contentEl.textContent = `"${quote.text}"`;
    }

    if (authorEl) {
      authorEl.textContent = quote.author ? `— ${quote.author}` : '';
    }

    if (greetingEl) {
      greetingEl.textContent = 'Welcome to Giant Minds';
    }

    this.currentQuote = quote;
  }

  // Open popup with animation
  openPopup() {
    const popup = document.getElementById('quotes-popup');
    if (popup) {
      popup.style.display = 'flex';
      // Trigger animation
      setTimeout(() => {
        popup.classList.add('show');
      }, 10);
    }
  }

  // Close popup with animation
  close() {
    const popup = document.getElementById('quotes-popup');
    if (popup) {
      popup.classList.remove('show');
      setTimeout(() => {
        popup.style.display = 'none';
        this.isOpen = false;
      }, 300);
    }

    this.clearTimer();
  }

  // Show next quote
  showNextQuote() {
    this.clearTimer();

    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.currentCategoryQuotes.length;
    const nextQuote = this.currentCategoryQuotes[this.currentQuoteIndex];

    this.displayQuote(nextQuote);
    this.startTimer();
  }

  // Show previous quote
  showPreviousQuote() {
    this.clearTimer();

    this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.currentCategoryQuotes.length) % this.currentCategoryQuotes.length;
    const prevQuote = this.currentCategoryQuotes[this.currentQuoteIndex];

    this.displayQuote(prevQuote);
    this.startTimer();
  }

  // Copy quote to clipboard
  copyQuote() {
    if (!this.currentQuote) return;

    const textToCopy = `"${this.currentQuote.text}" — ${this.currentQuote.author || 'Unknown'}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const copyBtn = document.getElementById('copy-quote');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy quote:', err);
      // Fallback for older browsers
      this.fallbackCopyToClipboard(textToCopy);
    });
  }

  // Fallback copy method for older browsers
  fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      const copyBtn = document.getElementById('copy-quote');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    document.body.removeChild(textarea);
  }

  // Start 70-second timer
  startTimer() {
    this.clearTimer();

    const timerBar = document.getElementById('timer-bar');
    if (timerBar) {
      timerBar.style.width = '100%';
    }

    this.timeoutId = setTimeout(() => {
      this.close();
    }, 70000); // 70 seconds

    // Animate timer bar
    if (timerBar) {
      timerBar.style.animation = 'none';
      setTimeout(() => {
        timerBar.style.animation = 'shrink 70s linear forwards';
      }, 10);
    }
  }

  // Clear timer
  clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const timerBar = document.getElementById('timer-bar');
    if (timerBar) {
      timerBar.style.animation = 'none';
    }
  }

  // Check if popup is currently open
  isOpenNow() {
    return this.isOpen;
  }
}

// Create global instance
const quotesPopup = new QuotesPopup();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    quotesPopup.init();
  });
} else {
  quotesPopup.init();
}
