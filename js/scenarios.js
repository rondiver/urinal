/**
 * The Urinal Game - Scenarios Configuration
 * Each scenario defines the restroom layout, correct answers, and feedback
 */

const SCENARIOS = [
  // Scenario 1: Empty bathroom - 5 urinals
  {
    id: 1,
    problemText: "You enter an empty restroom with 5 urinals. Which do you choose?",
    layout: [
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false }
    ],
    correctAnswers: [0, 4], // Either end urinal is correct
    feedback: {
      correct: {
        title: "Perfect!",
        message: "Always choose an end urinal when the bathroom is empty. This maximizes future spacing options for others."
      },
      wrong: {
        title: "Awkward!",
        message: "When the bathroom is empty, always pick an end urinal. Choosing a middle urinal limits spacing options and is considered poor etiquette."
      }
    }
  },

  // Scenario 2: One person at the left end
  {
    id: 2,
    problemText: "One person is using the far left urinal. Where do you go?",
    layout: [
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false }
    ],
    correctAnswers: [4], // Far right end
    feedback: {
      correct: {
        title: "Excellent!",
        message: "You chose the urinal furthest from the occupied one. Maximum buffer zone achieved!"
      },
      wrong: {
        title: "Too Close!",
        message: "Always maximize distance from others. The far right urinal gives you the most space and respects the buffer zone."
      }
    }
  },

  // Scenario 3: One person in the middle
  {
    id: 3,
    problemText: "Someone is using the middle urinal. What's your move?",
    layout: [
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false }
    ],
    correctAnswers: [0, 4], // Either end urinal
    feedback: {
      correct: {
        title: "Smart Choice!",
        message: "Either end urinal maintains maximum distance from the middle. You've mastered the art of strategic positioning."
      },
      wrong: {
        title: "Personal Space Violation!",
        message: "Never stand next to someone when end urinals are available. The corners are your friends!"
      }
    }
  },

  // Scenario 4: Both ends occupied - includes stall option
  {
    id: 4,
    problemText: "Both end urinals are occupied. What do you do?",
    layout: [
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: true },
      { type: 'stall', occupied: false }
    ],
    correctAnswers: [2], // True middle maximizes distance from both
    feedback: {
      correct: {
        title: "Perfectly Centered!",
        message: "The middle urinal maintains equal distance from both occupied ends. Geometry meets etiquette!"
      },
      wrong: {
        title: "Unbalanced!",
        message: "When both ends are occupied, the exact middle urinal is optimal. It maintains equal buffer zones on both sides."
      }
    }
  },

  // Scenario 5: Complex pattern - alternating
  {
    id: 5,
    problemText: "A tricky situation! Find the best available spot.",
    layout: [
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: true }
    ],
    correctAnswers: [4], // Position 4 has occupied on right (5) but free on left
    feedback: {
      correct: {
        title: "Expert Navigation!",
        message: "You found the spot with the most breathing room. Only one neighbor instead of being sandwiched!"
      },
      wrong: {
        title: "Strategic Error!",
        message: "Position 5 (second from right) only has one occupied neighbor. Position 2 would sandwich you between two occupied urinals!"
      }
    }
  },

  // Scenario 6: No good options - use the stall
  {
    id: 6,
    problemText: "The restroom is getting crowded. Choose wisely!",
    layout: [
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: true },
      { type: 'urinal', occupied: false },
      { type: 'urinal', occupied: true },
      { type: 'stall', occupied: false }
    ],
    correctAnswers: [5], // Use the stall - all urinal options are adjacent to occupied
    feedback: {
      correct: {
        title: "Wise Decision!",
        message: "When all urinals would put you next to someone, the stall is the dignified choice. Privacy preserved!"
      },
      wrong: {
        title: "Awkward Encounter!",
        message: "Every available urinal is directly next to an occupied one. A true etiquette master uses the stall in this situation."
      }
    }
  }
];

/**
 * Rating thresholds based on final score
 */
const RATINGS = [
  {
    minScore: 6,
    emoji: "🏆",
    title: "URINAL MASTER",
    message: "Flawless! You've achieved peak restroom etiquette. Others should learn from your ways."
  },
  {
    minScore: 5,
    emoji: "🎖️",
    title: "ETIQUETTE EXPERT",
    message: "Impressive! You understand the unwritten rules. Just one small slip-up."
  },
  {
    minScore: 4,
    emoji: "👍",
    title: "SOCIALLY AWARE",
    message: "Pretty good! You've got the basics down but could use some fine-tuning."
  },
  {
    minScore: 3,
    emoji: "😐",
    title: "NEEDS PRACTICE",
    message: "You might be making some folks uncomfortable. Study the buffer zone!"
  },
  {
    minScore: 2,
    emoji: "😬",
    title: "SPACE INVADER",
    message: "Personal space is important! You're that guy everyone tries to avoid."
  },
  {
    minScore: 1,
    emoji: "🚨",
    title: "ETIQUETTE VIOLATOR",
    message: "Did you grow up in a barn? Please review basic restroom protocols."
  },
  {
    minScore: 0,
    emoji: "💀",
    title: "SOCIAL MENACE",
    message: "Incredible... You got every single one wrong. Are you doing this on purpose?"
  }
];

/**
 * Get rating based on score
 * @param {number} score - Final score (0-6)
 * @returns {Object} Rating object with emoji, title, and message
 */
function getRating(score) {
  for (const rating of RATINGS) {
    if (score >= rating.minScore) {
      return rating;
    }
  }
  return RATINGS[RATINGS.length - 1];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SCENARIOS, RATINGS, getRating };
}
