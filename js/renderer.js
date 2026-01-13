/**
 * The Urinal Game - DOM Renderer
 * Handles rendering of restroom elements
 */

const Renderer = (function() {
  // Cache DOM elements
  let restroomContainer = null;

  /**
   * Initialize renderer with container reference
   */
  function init() {
    restroomContainer = document.getElementById('restroom');
  }

  /**
   * Create a person element for occupied urinals
   * @returns {HTMLElement} Person element
   */
  function createPerson() {
    const person = document.createElement('div');
    person.className = 'person';
    person.setAttribute('aria-hidden', 'true');

    const head = document.createElement('div');
    head.className = 'person-head';

    const body = document.createElement('div');
    body.className = 'person-body';

    const legs = document.createElement('div');
    legs.className = 'person-legs';

    const legLeft = document.createElement('div');
    legLeft.className = 'person-leg';

    const legRight = document.createElement('div');
    legRight.className = 'person-leg';

    legs.appendChild(legLeft);
    legs.appendChild(legRight);

    person.appendChild(head);
    person.appendChild(body);
    person.appendChild(legs);

    return person;
  }

  /**
   * Create a urinal element
   * @param {number} index - Urinal index for numbering
   * @param {boolean} occupied - Whether urinal is occupied
   * @param {Function} onClick - Click handler for available urinals
   * @returns {HTMLElement} Urinal container element
   */
  function createUrinal(index, occupied, onClick) {
    const container = document.createElement('div');
    container.className = 'urinal-container';

    const urinal = document.createElement('div');
    urinal.className = 'urinal';
    urinal.dataset.index = index;
    urinal.setAttribute('role', 'button');
    urinal.setAttribute('tabindex', occupied ? '-1' : '0');

    if (occupied) {
      urinal.classList.add('occupied');
      urinal.setAttribute('aria-label', `Urinal ${index + 1}, occupied`);
      urinal.appendChild(createPerson());
    } else {
      urinal.setAttribute('aria-label', `Urinal ${index + 1}, available. Click to select.`);

      // Click handler
      urinal.addEventListener('click', () => {
        if (onClick) onClick(index);
      });

      // Keyboard support
      urinal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(index);
        }
      });

      // Hover effect sound could be added here
      urinal.addEventListener('mouseenter', () => {
        urinal.classList.add('hovered');
      });

      urinal.addEventListener('mouseleave', () => {
        urinal.classList.remove('hovered');
      });
    }

    const number = document.createElement('div');
    number.className = 'urinal-number';
    number.textContent = index + 1;

    container.appendChild(urinal);
    container.appendChild(number);

    return container;
  }

  /**
   * Create a stall element
   * @param {number} index - Stall index
   * @param {boolean} occupied - Whether stall is occupied
   * @param {Function} onClick - Click handler
   * @returns {HTMLElement} Stall container element
   */
  function createStall(index, occupied, onClick) {
    const container = document.createElement('div');
    container.className = 'urinal-container';

    const stall = document.createElement('div');
    stall.className = 'stall';
    stall.dataset.index = index;
    stall.setAttribute('role', 'button');

    if (occupied) {
      stall.classList.add('occupied');
      stall.setAttribute('tabindex', '-1');
      stall.setAttribute('aria-label', 'Stall, occupied');
    } else {
      stall.setAttribute('tabindex', '0');
      stall.setAttribute('aria-label', 'Stall, available. Click to select.');

      // Click handler
      stall.addEventListener('click', () => {
        if (onClick) onClick(index);
      });

      // Keyboard support
      stall.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(index);
        }
      });

      // Hover effects
      stall.addEventListener('mouseenter', () => {
        stall.classList.add('hovered');
      });

      stall.addEventListener('mouseleave', () => {
        stall.classList.remove('hovered');
      });
    }

    const label = document.createElement('div');
    label.className = 'urinal-number';
    label.textContent = 'STALL';

    container.appendChild(stall);
    container.appendChild(label);

    return container;
  }

  /**
   * Render a complete restroom layout
   * @param {Array} layout - Array of fixture objects from scenario
   * @param {Function} onSelect - Callback when user selects a fixture
   */
  function renderRestroom(layout, onSelect) {
    if (!restroomContainer) {
      init();
    }

    // Clear existing content
    restroomContainer.innerHTML = '';

    // Render each fixture
    layout.forEach((fixture, index) => {
      let element;

      if (fixture.type === 'urinal') {
        element = createUrinal(index, fixture.occupied, onSelect);
      } else if (fixture.type === 'stall') {
        element = createStall(index, fixture.occupied, onSelect);
      }

      if (element) {
        restroomContainer.appendChild(element);
      }
    });

    // Add entrance animation
    animateEntrance();
  }

  /**
   * Animate fixtures appearing
   */
  function animateEntrance() {
    const fixtures = restroomContainer.children;
    Array.from(fixtures).forEach((fixture, index) => {
      fixture.style.opacity = '0';
      fixture.style.transform = 'translateY(20px)';

      setTimeout(() => {
        fixture.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        fixture.style.opacity = '1';
        fixture.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  /**
   * Highlight selected fixture
   * @param {number} index - Index of selected fixture
   */
  function highlightSelection(index) {
    const fixtures = restroomContainer.querySelectorAll('.urinal, .stall');
    fixtures.forEach((fixture) => {
      fixture.classList.remove('selected');
      if (parseInt(fixture.dataset.index) === index) {
        fixture.classList.add('selected');
      }
    });
  }

  /**
   * Highlight correct answer(s)
   * @param {Array} correctIndices - Array of correct answer indices
   */
  function highlightCorrect(correctIndices) {
    const fixtures = restroomContainer.querySelectorAll('.urinal, .stall');
    fixtures.forEach((fixture) => {
      const fixtureIndex = parseInt(fixture.dataset.index);
      if (correctIndices.includes(fixtureIndex)) {
        fixture.classList.add('correct-answer');
      }
    });
  }

  /**
   * Disable all fixture interactions
   */
  function disableInteractions() {
    const fixtures = restroomContainer.querySelectorAll('.urinal:not(.occupied), .stall:not(.occupied)');
    fixtures.forEach((fixture) => {
      fixture.classList.add('disabled');
      fixture.setAttribute('tabindex', '-1');
    });
  }

  /**
   * Clear the restroom container
   */
  function clear() {
    if (restroomContainer) {
      restroomContainer.innerHTML = '';
    }
  }

  /**
   * Update screen visibility
   * @param {string} screenId - ID of screen to show
   */
  function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => {
      if (screen.id === screenId) {
        screen.classList.remove('hidden');
        screen.classList.add('animate-pop');
      } else {
        screen.classList.add('hidden');
        screen.classList.remove('animate-pop');
      }
    });
  }

  /**
   * Update problem display
   * @param {number} problemNumber - Current problem number (1-6)
   * @param {string} problemText - Problem description text
   */
  function updateProblem(problemNumber, problemText) {
    const problemBadge = document.getElementById('problem-number');
    const problemTextEl = document.getElementById('problem-text');

    if (problemBadge) {
      problemBadge.textContent = `PROBLEM ${problemNumber}`;
    }

    if (problemTextEl) {
      problemTextEl.textContent = problemText;
    }
  }

  /**
   * Update score display
   * @param {number} score - Current score
   */
  function updateScore(score) {
    const scoreEl = document.getElementById('current-score');
    if (scoreEl) {
      scoreEl.textContent = score;
    }
  }

  /**
   * Show feedback screen
   * @param {boolean} isCorrect - Whether answer was correct
   * @param {Object} feedback - Feedback object with title and message
   */
  function showFeedback(isCorrect, feedback) {
    const iconEl = document.getElementById('feedback-icon');
    const titleEl = document.getElementById('feedback-title');
    const messageEl = document.getElementById('feedback-message');

    if (iconEl) {
      iconEl.textContent = isCorrect ? '✓' : '✗';
      iconEl.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
    }

    if (titleEl) {
      titleEl.textContent = feedback.title;
      titleEl.className = `feedback-title ${isCorrect ? 'correct' : 'wrong'}`;
    }

    if (messageEl) {
      messageEl.textContent = feedback.message;
    }

    showScreen('screen-feedback');
  }

  /**
   * Show results screen
   * @param {number} score - Final score
   * @param {Object} rating - Rating object with emoji, title, message
   */
  function showResults(score, rating) {
    const finalScoreEl = document.getElementById('final-score');
    const ratingEl = document.getElementById('results-rating');
    const messageEl = document.getElementById('results-message');

    if (finalScoreEl) {
      finalScoreEl.textContent = score;
    }

    if (ratingEl) {
      const emojiEl = ratingEl.querySelector('.rating-emoji');
      const titleEl = ratingEl.querySelector('.rating-text');

      if (emojiEl) emojiEl.textContent = rating.emoji;
      if (titleEl) titleEl.textContent = rating.title;
    }

    if (messageEl) {
      messageEl.textContent = rating.message;
    }

    showScreen('screen-results');
  }

  // Public API
  return {
    init,
    renderRestroom,
    highlightSelection,
    highlightCorrect,
    disableInteractions,
    clear,
    showScreen,
    updateProblem,
    updateScore,
    showFeedback,
    showResults
  };
})();
