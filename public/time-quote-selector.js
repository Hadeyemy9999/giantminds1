// Time-Based Quote Selector
// Selects quotes based on current time of day and handles initial popup display

class TimeQuoteSelector {
  constructor() {
    this.currentPeriod = null;
    this.hasShownInitialQuote = false;
    this.initialQuoteKey = 'giantminds_initial_quote_shown';
  }

  // Initialize the selector
  init() {
    this.checkAndShowInitialQuote();
  }

  // Get current time period
  getTimePeriod() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 18) {
      return 'afternoon';
    } else {
      return 'night';
    }
  }

  // Get time period name for display
  getTimePeriodName() {
    const period = this.getTimePeriod();
    const names = {
      morning: 'Morning',
      afternoon: 'Afternoon',
      night: 'Night'
    };
    return names[period] || 'Daily';
  }

  // Get random quote from time-sensitive category
  getTimeBasedQuote() {
    const timePeriod = this.getTimePeriod();

    // Ensure QUOTE_BANK exists
    if (typeof QUOTE_BANK === 'undefined') {
      console.error('QUOTE_BANK is not defined. Make sure quotes-data.js is loaded.');
      return null;
    }

    const quotes = QUOTE_BANK[timePeriod];

    if (!quotes || quotes.length === 0) {
      console.error(`No quotes found for period: ${timePeriod}`);
      return null;
    }

    // Return random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  // Get all quotes for current time period
  getTimeBasedQuotes() {
    const timePeriod = this.getTimePeriod();

    if (typeof QUOTE_BANK === 'undefined') {
      console.error('QUOTE_BANK is not defined. Make sure quotes-data.js is loaded.');
      return [];
    }

    return QUOTE_BANK[timePeriod] || [];
  }

  // Check if initial quote has been shown in this session
  hasShownQuote() {
    const shown = sessionStorage.getItem(this.initialQuoteKey);
    return shown === 'true';
  }

  // Mark that initial quote has been shown
  markQuoteAsShown() {
    sessionStorage.setItem(this.initialQuoteKey, 'true');
    this.hasShownInitialQuote = true;
  }

  // Show initial quote on landing page
  checkAndShowInitialQuote() {
    // Wait for all dependencies to load
    const maxAttempts = 50;
    let attempts = 0;

    const tryShowQuote = () => {
      attempts++;

      // Check if dependencies exist
      if (typeof QUOTE_BANK === 'undefined' || typeof quotesPopup === 'undefined') {
        if (attempts < maxAttempts) {
          setTimeout(tryShowQuote, 100);
        } else {
          console.error('Failed to load quote dependencies');
        }
        return;
      }

      // Check if we should show the initial quote
      if (!this.hasShownQuote()) {
        this.displayInitialQuote();
      }
    };

    tryShowQuote();
  }

  // Display the initial quote
  displayInitialQuote() {
    try {
      const quote = this.getTimeBasedQuote();
      if (!quote) {
        console.error('Failed to get time-based quote');
        return;
      }

      const timePeriod = this.getTimePeriod();
      const categoryQuotes = QUOTE_BANK[timePeriod];

      // Show the quote
      quotesPopup.show(quote, timePeriod, categoryQuotes);

      // Mark as shown
      this.markQuoteAsShown();

      console.log(`Initial ${timePeriod} quote displayed`);
    } catch (error) {
      console.error('Error displaying initial quote:', error);
    }
  }

  // Get quote statistics
  getQuoteStats() {
    const stats = {};

    if (typeof QUOTE_BANK !== 'undefined') {
      Object.keys(QUOTE_BANK).forEach(period => {
        stats[period] = QUOTE_BANK[period].length;
      });
      stats.total = Object.values(stats).reduce((a, b) => a + b, 0);
    }

    return stats;
  }

  // Get time-appropriate greeting
  getTimeBasedGreeting() {
    const period = this.getTimePeriod();
    const greetings = {
      morning: '🌅 Good morning! Here\'s your morning motivation:',
      afternoon: '☀️ Afternoon motivation:',
      night: '🌙 Good night! Here\'s your evening reflection:'
    };
    return greetings[period] || 'Here\'s your daily motivation:';
  }

  // Manually trigger quote display (useful for testing)
  forceShowQuote() {
    const quote = this.getTimeBasedQuote();
    if (!quote) return;

    const timePeriod = this.getTimePeriod();
    const categoryQuotes = QUOTE_BANK[timePeriod];

    quotesPopup.show(quote, timePeriod, categoryQuotes);
  }

  // Get debug info
  getDebugInfo() {
    return {
      currentPeriod: this.getTimePeriod(),
      currentHour: new Date().getHours(),
      hasShownInitialQuote: this.hasShownInitialQuote,
      quoteStats: this.getQuoteStats(),
      currentGreeting: this.getTimeBasedGreeting()
    };
  }
}

// Create global instance
const timeQuoteSelector = new TimeQuoteSelector();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    timeQuoteSelector.init();
  });
} else {
  timeQuoteSelector.init();
}
