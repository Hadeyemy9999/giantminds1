// Session Tracker - Monitors active user time on website
// Displays quotes every 30 minutes of active engagement

class SessionTracker {
  constructor() {
    this.totalSessionTime = 0; // in milliseconds
    this.sessionStartTime = Date.now();
    this.isTabActive = true;
    this.thirtyMinuteIntervals = 0;
    this.lastIntervalTriggerTime = 0;
    this.isInitialized = false;
    this.sessionStorageKey = 'giantminds_session_time';
    this.lastQuoteTimeKey = 'giantminds_last_quote_time';
  }

  // Initialize session tracking
  init() {
    if (this.isInitialized) return;

    this.setupEventListeners();
    this.restoreSessionTime();
    this.startTracking();
    this.isInitialized = true;

    console.log('Session tracker initialized');
  }

  // Setup event listeners
  setupEventListeners() {
    // Track when tab comes into focus
    window.addEventListener('focus', () => {
      this.onTabFocus();
    });

    // Track when tab loses focus
    window.addEventListener('blur', () => {
      this.onTabBlur();
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      this.saveSessionTime();
    });

    // Also save periodically
    setInterval(() => {
      this.saveSessionTime();
    }, 5000); // Save every 5 seconds
  }

  // Tab comes into focus
  onTabFocus() {
    this.isTabActive = true;
    this.sessionStartTime = Date.now();
    console.log('Tab is now active');
  }

  // Tab loses focus
  onTabBlur() {
    this.isTabActive = false;
    this.addSessionTime();
    console.log('Tab is now inactive. Time paused.');
  }

  // Start tracking session time
  startTracking() {
    setInterval(() => {
      if (this.isTabActive) {
        this.checkForIntervals();
      }
    }, 1000); // Check every 1 second
  }

  // Check if 30-minute interval has been reached
  checkForIntervals() {
    const now = Date.now();
    const elapsedSinceStart = now - this.sessionStartTime;
    const totalActiveTime = this.totalSessionTime + elapsedSinceStart;

    // Calculate how many 30-minute intervals have passed
    const intervalsCompleted = Math.floor(totalActiveTime / (30 * 60 * 1000));

    // If we've reached a new interval and haven't just triggered a quote
    if (intervalsCompleted > this.thirtyMinuteIntervals) {
      const timeSinceLastQuote = now - this.lastIntervalTriggerTime;
      
      // Only trigger if at least 30 minutes have passed since last quote
      if (timeSinceLastQuote > 30 * 60 * 1000 || this.lastIntervalTriggerTime === 0) {
        this.thirtyMinuteIntervals = intervalsCompleted;
        this.lastIntervalTriggerTime = now;
        this.triggerQuoteDisplay();
      }
    }
  }

  // Add elapsed time to total session time
  addSessionTime() {
    const now = Date.now();
    const elapsedTime = now - this.sessionStartTime;
    this.totalSessionTime += elapsedTime;
    this.sessionStartTime = now;
  }

  // Get total active session time in seconds
  getTotalSessionTime() {
    const now = Date.now();
    const elapsedTime = now - this.sessionStartTime;
    return (this.totalSessionTime + elapsedTime) / 1000; // Convert to seconds
  }

  // Get session time in minutes
  getSessionTimeInMinutes() {
    return Math.floor(this.getTotalSessionTime() / 60);
  }

  // Save session time to localStorage
  saveSessionTime() {
    if (this.isTabActive) {
      this.addSessionTime();
    }
    const totalTime = this.totalSessionTime;
    sessionStorage.setItem(this.sessionStorageKey, totalTime.toString());
  }

  // Restore session time from localStorage
  restoreSessionTime() {
    const savedTime = sessionStorage.getItem(this.sessionStorageKey);
    if (savedTime) {
      this.totalSessionTime = parseInt(savedTime, 10) || 0;
    }
  }

  // Trigger quote display
  triggerQuoteDisplay() {
    console.log('30-minute interval reached! Displaying quote...');

    // Check if quotesPopup and timeQuoteSelector are available
    if (typeof timeQuoteSelector !== 'undefined' && typeof quotesPopup !== 'undefined') {
      const quote = timeQuoteSelector.getTimeBasedQuote();
      const category = timeQuoteSelector.getTimePeriod();
      const categoryQuotes = QUOTE_BANK[category];

      quotesPopup.show(quote, category, categoryQuotes);

      // Save the time of this quote display
      const now = Date.now();
      localStorage.setItem(this.lastQuoteTimeKey, now.toString());
    }
  }

  // Reset session (for debugging or testing)
  resetSession() {
    this.totalSessionTime = 0;
    this.sessionStartTime = Date.now();
    this.thirtyMinuteIntervals = 0;
    this.lastIntervalTriggerTime = 0;
    sessionStorage.removeItem(this.sessionStorageKey);
    console.log('Session reset');
  }

  // Get time until next quote display
  getTimeUntilNextQuote() {
    const now = Date.now();
    const timeSinceLastQuote = now - this.lastIntervalTriggerTime;
    const timeUntilNext = (30 * 60 * 1000) - (timeSinceLastQuote % (30 * 60 * 1000));
    return Math.ceil(timeUntilNext / 1000); // Return in seconds
  }

  // Debug info
  getDebugInfo() {
    return {
      totalSessionTime: this.totalSessionTime,
      totalSessionTimeMinutes: this.getSessionTimeInMinutes(),
      isTabActive: this.isTabActive,
      thirtyMinuteIntervalsCompleted: this.thirtyMinuteIntervals,
      timeUntilNextQuote: this.getTimeUntilNextQuote()
    };
  }
}

// Create global instance
const sessionTracker = new SessionTracker();

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    sessionTracker.init();
  });
} else {
  sessionTracker.init();
}
