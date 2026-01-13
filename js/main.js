/**
 * The Urinal Game - Main Entry Point
 * Initializes and connects all game modules
 */

(function() {
  'use strict';

  /**
   * Application configuration
   */
  const AppConfig = {
    debug: false,
    version: '2.0.0',
    originalYear: 1997,
    remakeYear: 2024
  };

  /**
   * Initialize the application when DOM is ready
   */
  function initApp() {
    if (AppConfig.debug) {
      console.log(`The Urinal Game v${AppConfig.version}`);
      console.log(`Original: ${AppConfig.originalYear} | Remake: ${AppConfig.remakeYear}`);
      console.log('Modules loaded:', {
        scenarios: typeof SCENARIOS !== 'undefined',
        renderer: typeof Renderer !== 'undefined',
        game: typeof Game !== 'undefined'
      });
    }

    // Verify all modules are loaded
    if (!verifyModules()) {
      showLoadError();
      return;
    }

    // Initialize game
    Game.init();

    // Set up additional event listeners
    setupEventListeners();

    // Handle visibility changes (pause/resume)
    setupVisibilityHandler();

    // Log initialization complete
    if (AppConfig.debug) {
      console.log('Game initialized successfully');
    }
  }

  /**
   * Verify all required modules are loaded
   * @returns {boolean} Whether all modules are available
   */
  function verifyModules() {
    const required = [
      { name: 'SCENARIOS', value: typeof SCENARIOS },
      { name: 'RATINGS', value: typeof RATINGS },
      { name: 'getRating', value: typeof getRating },
      { name: 'Renderer', value: typeof Renderer },
      { name: 'Game', value: typeof Game }
    ];

    const missing = required.filter(m => m.value === 'undefined');

    if (missing.length > 0) {
      console.error('Missing modules:', missing.map(m => m.name));
      return false;
    }

    return true;
  }

  /**
   * Show error message if modules fail to load
   */
  function showLoadError() {
    const container = document.getElementById('game');
    if (container) {
      container.innerHTML = `
        <div class="screen" style="padding: 2rem; text-align: center;">
          <h1 style="color: #FF6B35; font-family: 'Bangers', cursive; font-size: 2rem;">
            Oops! Something went wrong.
          </h1>
          <p style="color: #B8B8D1; margin-top: 1rem;">
            Failed to load game modules. Please refresh the page.
          </p>
          <button onclick="location.reload()"
                  style="margin-top: 1.5rem; padding: 0.75rem 1.5rem;
                         background: #FF3AF2; color: white; border: none;
                         border-radius: 9999px; cursor: pointer;
                         font-family: 'Bangers', cursive; font-size: 1.25rem;">
            RELOAD
          </button>
        </div>
      `;
    }
  }

  /**
   * Set up additional event listeners
   */
  function setupEventListeners() {
    // Prevent context menu on game elements (optional)
    const restroom = document.getElementById('restroom');
    if (restroom) {
      restroom.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    }

    // Handle window resize for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    });

    // Prevent zoom on double-tap (mobile)
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }

  // Track last touch for double-tap prevention
  let lastTouchEnd = 0;

  /**
   * Handle window resize events
   */
  function handleResize() {
    // Could trigger re-render if needed
    if (AppConfig.debug) {
      console.log('Window resized:', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }

  /**
   * Set up visibility change handler
   * Useful for pausing/resuming game or analytics
   */
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        onPageHidden();
      } else {
        onPageVisible();
      }
    });
  }

  /**
   * Handle page becoming hidden
   */
  function onPageHidden() {
    if (AppConfig.debug) {
      console.log('Page hidden');
    }
    // Could pause timers, animations, etc.
  }

  /**
   * Handle page becoming visible
   */
  function onPageVisible() {
    if (AppConfig.debug) {
      console.log('Page visible');
    }
    // Could resume timers, refresh state, etc.
  }

  /**
   * Expose debug utilities in development
   */
  if (AppConfig.debug) {
    window.UrinalGame = {
      config: AppConfig,
      getState: () => Game.getState(),
      scenarios: SCENARIOS,
      restart: () => Game.restartGame(),
      version: AppConfig.version
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    // DOM already loaded
    initApp();
  }
})();
