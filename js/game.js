/**
 * The Urinal Game - Game Controller
 * Manages game state, score tracking, and answer validation
 */

const Game = (function() {
  // Game states
  const STATES = {
    TITLE: 'title',
    PLAYING: 'playing',
    FEEDBACK: 'feedback',
    RESULTS: 'results'
  };

  // Game state
  let state = {
    currentState: STATES.TITLE,
    currentScenario: 0,
    score: 0,
    answers: [],
    isTransitioning: false
  };

  // Configuration
  const config = {
    feedbackDelay: 300,      // Delay before showing feedback (ms)
    autoAdvanceDelay: 0,     // If > 0, auto-advance from feedback (ms)
    totalScenarios: 6
  };

  /**
   * Initialize the game
   */
  function init() {
    Renderer.init();
    resetState();
    bindEvents();
  }

  /**
   * Reset game state to initial values
   */
  function resetState() {
    state = {
      currentState: STATES.TITLE,
      currentScenario: 0,
      score: 0,
      answers: [],
      isTransitioning: false
    };
  }

  /**
   * Bind UI event handlers
   */
  function bindEvents() {
    // Start button
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', startGame);
    }

    // Continue button (after feedback)
    const continueBtn = document.getElementById('btn-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', nextScenario);
    }

    // Restart button
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', restartGame);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleKeyPress(e) {
    // Prevent shortcuts during transitions
    if (state.isTransitioning) return;

    switch (state.currentState) {
      case STATES.TITLE:
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        break;

      case STATES.FEEDBACK:
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextScenario();
        }
        break;

      case STATES.RESULTS:
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          restartGame();
        }
        break;
    }
  }

  /**
   * Start a new game
   */
  function startGame() {
    if (state.isTransitioning) return;

    resetState();
    state.currentState = STATES.PLAYING;

    Renderer.updateScore(0);
    loadScenario(0);
    Renderer.showScreen('screen-game');
  }

  /**
   * Load a scenario by index
   * @param {number} index - Scenario index (0-5)
   */
  function loadScenario(index) {
    if (index >= SCENARIOS.length) {
      showResults();
      return;
    }

    state.currentScenario = index;
    const scenario = SCENARIOS[index];

    // Update UI
    Renderer.updateProblem(scenario.id, scenario.problemText);
    Renderer.renderRestroom(scenario.layout, handleSelection);
  }

  /**
   * Handle user's fixture selection
   * @param {number} selectedIndex - Index of selected fixture
   */
  function handleSelection(selectedIndex) {
    if (state.currentState !== STATES.PLAYING || state.isTransitioning) {
      return;
    }

    state.isTransitioning = true;
    const scenario = SCENARIOS[state.currentScenario];

    // Check if answer is correct
    const isCorrect = checkAnswer(selectedIndex, scenario.correctAnswers);

    // Record answer
    state.answers.push({
      scenario: scenario.id,
      selected: selectedIndex,
      correct: isCorrect
    });

    // Update score if correct
    if (isCorrect) {
      state.score++;
      Renderer.updateScore(state.score);
    }

    // Visual feedback
    Renderer.highlightSelection(selectedIndex);
    Renderer.disableInteractions();

    // Show correct answer if wrong
    if (!isCorrect) {
      setTimeout(() => {
        Renderer.highlightCorrect(scenario.correctAnswers);
      }, 200);
    }

    // Show feedback after delay
    setTimeout(() => {
      showFeedback(isCorrect, scenario.feedback);
    }, config.feedbackDelay);
  }

  /**
   * Check if selected answer is correct
   * @param {number} selected - Selected fixture index
   * @param {Array} correctAnswers - Array of correct indices
   * @returns {boolean} Whether answer is correct
   */
  function checkAnswer(selected, correctAnswers) {
    return correctAnswers.includes(selected);
  }

  /**
   * Show feedback screen
   * @param {boolean} isCorrect - Whether answer was correct
   * @param {Object} feedback - Feedback messages from scenario
   */
  function showFeedback(isCorrect, feedback) {
    state.currentState = STATES.FEEDBACK;
    state.isTransitioning = false;

    const feedbackData = isCorrect ? feedback.correct : feedback.wrong;
    Renderer.showFeedback(isCorrect, feedbackData);

    // Auto-advance if configured
    if (config.autoAdvanceDelay > 0) {
      setTimeout(() => {
        if (state.currentState === STATES.FEEDBACK) {
          nextScenario();
        }
      }, config.autoAdvanceDelay);
    }
  }

  /**
   * Advance to next scenario or show results
   */
  function nextScenario() {
    if (state.isTransitioning) return;

    const nextIndex = state.currentScenario + 1;

    if (nextIndex >= SCENARIOS.length) {
      showResults();
    } else {
      state.currentState = STATES.PLAYING;
      loadScenario(nextIndex);
      Renderer.showScreen('screen-game');
    }
  }

  /**
   * Show final results screen
   */
  function showResults() {
    state.currentState = STATES.RESULTS;
    state.isTransitioning = false;

    const rating = getRating(state.score);
    Renderer.showResults(state.score, rating);

    // Log results for analytics (if needed)
    logGameComplete();
  }

  /**
   * Log game completion (for potential analytics)
   */
  function logGameComplete() {
    console.log('Game Complete:', {
      score: state.score,
      total: SCENARIOS.length,
      percentage: Math.round((state.score / SCENARIOS.length) * 100),
      answers: state.answers
    });
  }

  /**
   * Restart the game
   */
  function restartGame() {
    if (state.isTransitioning) return;
    startGame();
  }

  /**
   * Get current game state (for debugging)
   * @returns {Object} Current state object
   */
  function getState() {
    return { ...state };
  }

  /**
   * Get current score
   * @returns {number} Current score
   */
  function getScore() {
    return state.score;
  }

  /**
   * Check if game is in progress
   * @returns {boolean} Whether game is active
   */
  function isPlaying() {
    return state.currentState === STATES.PLAYING;
  }

  // Public API
  return {
    init,
    startGame,
    restartGame,
    getState,
    getScore,
    isPlaying,
    STATES
  };
})();
