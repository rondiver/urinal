# The Urinal Game - Modern Recreation with Maximalism Theme

## Project Overview
A browser-based recreation of the classic 1997 "Urinal Game" by CleverMedia, styled with the Maximalism design aesthetic. The game tests players' knowledge of men's restroom etiquette through interactive scenarios.

## Design Philosophy: Maximalism
**Tagline**: "Clashing patterns, dense layouts, oversaturated colors, intentional visual clutter. MORE IS MORE."

**Emotional Target**: Euphoric, playful, overwhelming, Y2K-meets-Gen-Z, hyperpop aesthetic, digital maximalism. Think Lisa Frank fever dream meets Nickelodeon slime era meets contemporary hyperpop album art. It should feel like eating a bag of Skittles while watching fireworks.

**Guiding Question**: "Is this visually overwhelming in a joyful way?" If no, add more.

---

## Design Token System

### Color Palette (Dark Mode Foundation)
```css
:root {
  /* Base Colors */
  --bg-primary: #0D0D1A;        /* Deep cosmic purple-black */
  --bg-secondary: #1A1A2E;      /* Slightly lighter for layering */
  --text-primary: #FFFFFF;      /* Pure white for readability */
  --text-secondary: #B8B8D1;    /* Muted lavender */
  
  /* Accent Colors (Rotate through these) */
  --accent-1-magenta: #FF3AF2;  /* Hot pink/magenta - electric energy */
  --accent-2-cyan: #00F5D4;     /* Electric cyan/teal - digital glow */
  --accent-3-yellow: #FFE600;   /* Screaming yellow - attention grabber */
  --accent-4-orange: #FF6B35;   /* Electric orange - warmth chaos */
  --accent-5-purple: #7B2FFF;   /* Vivid purple - mystical depth */
}
```

### Color Usage Rules
- **Section Rotation**: Cycle through accents using `index % 5`
- **No Matching**: Borders should clash with backgrounds (magenta bg = yellow/cyan border)
- **Contrast Ratios**: White (#FFFFFF) on dark (#0D0D1A) = 19.5:1 (AAA)
- **Accent Text**: Only for decorative text, labels, or non-critical content

### Typography
```css
/* Font Families */
--font-body: 'DM Sans', sans-serif;      /* Clean, readable in chaos */
--font-display: 'Bangers', cursive;       /* Comic energy for headlines */

/* Type Scale (Aggressive sizing) */
--text-hero: clamp(48px, 10vw, 128px);    /* MASSIVE */
--text-section: clamp(36px, 6vw, 72px);   /* Bold presence */
--text-subheading: clamp(20px, 3vw, 30px);/* Standout */
--text-body: clamp(16px, 2vw, 20px);      /* Larger than typical */
--text-small: clamp(12px, 1.5vw, 16px);   /* Labels, meta */

/* Weight Distribution */
Headlines: 800-900 weight
Body: 400-500 weight
Labels: 700 bold

/* Letter Spacing */
Headlines: tracking-tight (-0.02em)
Labels: tracking-widest (0.1em)
Body: normal
```

### Text Shadow System (Stacked Glitch Effect)
```css
/* Single Shadow */
--shadow-single: 2px 2px 0px var(--accent-5-purple);

/* Double Shadow */
--shadow-double: 2px 2px 0px var(--accent-5-purple), 
                 4px 4px 0px var(--accent-1-magenta);

/* Triple Stack */
--shadow-triple: 2px 2px 0px var(--accent-5-purple), 
                 4px 4px 0px var(--accent-1-magenta), 
                 6px 6px 0px var(--accent-2-cyan);

/* Mega Stack (Hero headlines only) */
--shadow-mega: 4px 4px 0px var(--accent-5-purple), 
               8px 8px 0px var(--accent-1-magenta), 
               12px 12px 0px var(--accent-2-cyan);
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(90deg, #FF3AF2, #00F5D4, #FFE600, #FF3AF2);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Border & Radius System
```css
/* Border Styles (Mix deliberately) */
--border-solid: 3px solid;      /* Default */
--border-dashed: 3px dashed;    /* 30% of borders */
--border-double: 4px double;    /* Special containers */

/* Border Radius Values */
--radius-button: 9999px;        /* Pill shape */
--radius-card: 24px;            /* Generous curves */
--radius-container: 16px;       /* Moderate curves */
--radius-sharp: 0px;            /* Contrast accent */

/* Neon Glow Effect */
--glow-magenta: 0 0 20px rgba(255, 58, 242, 0.5);
--glow-cyan: 0 0 20px rgba(0, 245, 212, 0.5);
```

### Decorative Elements
Scatter these SVG elements randomly:
- ⭐ Stars (yellow, various sizes)
- ✦ Four-pointed stars (magenta/cyan)
- ◇ Diamonds (outline, rotating)
- ○ Circles (outline, purple stroke)
- ✧ Sparkles (animated)

---

## Game Mechanics

### Core Concept
Test the unwritten rules of men's restroom etiquette using the "urinal selection algorithm" - choosing a urinal that maximizes distance from other occupants.

### Etiquette Rules (Priority Order)
1. **Maximum Distance**: Choose urinal farthest from any occupied urinal
2. **End Preference**: When empty, prefer end positions (1 or N)
3. **Buffer Zone**: Leave at least one urinal gap when possible
4. **Privacy Option**: Sometimes the stall is the only correct answer

### Game Flow
```
[TITLE SCREEN] → [PROBLEM 1-6] → [FEEDBACK] → [RESULTS]
     ↓                ↓              ↓            ↓
  Click to        Click on       Shows if      Final score
   start          urinal        correct/       & rating
                               incorrect
```

### Scenarios
```javascript
const scenarios = [
  {
    id: 1,
    totalUrinals: 6,
    occupied: [0],
    hasStall: true,
    correct: [5],
    acceptable: [4, 5],
    prompt: "Urinal One is occupied.",
    correctMsg: "Perfect! Maximum distance is key.",
    wrongMsg: "Too close for comfort!"
  },
  {
    id: 2,
    totalUrinals: 6,
    occupied: [0, 5],
    hasStall: true,
    correct: [2, 3],
    acceptable: [2, 3],
    prompt: "Both ends are occupied.",
    correctMsg: "Excellent! Middle ground achieved.",
    wrongMsg: "You're crowding someone!"
  },
  {
    id: 3,
    totalUrinals: 5,
    occupied: [0, 2, 4],
    hasStall: true,
    correct: ['stall'],
    acceptable: ['stall', 'wait'],
    prompt: "All positions violate the buffer zone!",
    correctMsg: "Smart! The stall is the gentleman's choice.",
    wrongMsg: "Awkward! No buffer zone!"
  },
  {
    id: 4,
    totalUrinals: 6,
    occupied: [],
    hasStall: true,
    correct: [0, 5],
    acceptable: [0, 1, 4, 5],
    prompt: "Empty restroom. Your move.",
    correctMsg: "End position! Classic power move.",
    wrongMsg: "Middle? Bold but not optimal."
  },
  {
    id: 5,
    totalUrinals: 6,
    occupied: [2],
    hasStall: true,
    correct: [5],
    acceptable: [0, 5],
    prompt: "Urinal Three is occupied.",
    correctMsg: "Maximum distance achieved!",
    wrongMsg: "You could've gone farther!"
  },
  {
    id: 6,
    totalUrinals: 6,
    occupied: [0, 3],
    hasStall: true,
    correct: [5],
    acceptable: [5],
    prompt: "Urinals One and Four are taken.",
    correctMsg: "Far right! Textbook etiquette.",
    wrongMsg: "Suboptimal positioning!"
  }
];
```

### Scoring System
- **Correct**: +1 point
- **Acceptable**: +0.5 points
- **Wrong**: 0 points

### Final Ratings
- 6/6: "URINAL MASTER" 🏆
- 5-5.5: "Etiquette Expert" ⭐
- 4-4.5: "Bathroom Regular" 👍
- 3-3.5: "Needs Practice" 😬
- 0-2.5: "Social Disaster" 💀

---

## File Structure
```
urinal-game/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── scenarios.js
│   └── renderer.js
└── README.md
```

---

## Technical Implementation

### State Machine
```javascript
const GameState = {
  TITLE: 'title',
  PLAYING: 'playing',
  FEEDBACK: 'feedback',
  RESULTS: 'results'
};
```

### Urinal Selection Algorithm
```javascript
function findOptimalUrinals(total, occupied) {
  if (occupied.length === 0) return [0, total - 1];
  
  let maxMinDist = -1;
  let optimal = [];
  
  for (let i = 0; i < total; i++) {
    if (occupied.includes(i)) continue;
    
    const minDist = Math.min(...occupied.map(o => Math.abs(i - o)));
    
    if (minDist > maxMinDist) {
      maxMinDist = minDist;
      optimal = [i];
    } else if (minDist === maxMinDist) {
      optimal.push(i);
    }
  }
  
  return optimal;
}
```

### Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

---

## Accessibility
- Keyboard navigation (Tab + Enter)
- ARIA labels on interactive elements
- Sufficient color contrast (19.5:1)
- Reduced motion option
- Screen reader announcements for game state

---

## Deployment
Static files ready for:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

No build step required - pure HTML/CSS/JS.