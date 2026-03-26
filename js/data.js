// ============================================================
// ETP GAME SHOW - Question Bank (題庫)
// 4 subjects × 2 tiles × 3 levels = 24 questions
// ============================================================

const QUESTION_BANK = {
  // Tile 1: Accounting - Library 1
  ACQ1: [
    {
      level: 1, type: 'fill',
      question: "The recording of an asset's cost as an expense over its useful life is called ______.",
      answer: "Depreciation"
    },
    {
      level: 2, type: 'calc',
      question: "Total Assets = $100, Total Equity = $60. How much are the Liabilities?",
      answer: "$40"
    },
    {
      level: 3, type: 'open',
      question: "Why do we need 'Adjusting Entries' at the end of a period?",
      answer: "To match revenues and expenses (accrual basis)"
    }
  ],

  // Tile 5: Accounting - Library 2
  ACQ2: [
    {
      level: 1, type: 'fill',
      question: "When a company sells a bond at $1,050 (Face Value: $1,000), it is called a ______.",
      answer: "Premium"
    },
    {
      level: 2, type: 'calc',
      question: "A machine costs $5,000 with a 5-year life. What is the annual straight-line depreciation?",
      answer: "$1,000"
    },
    {
      level: 3, type: 'open',
      question: "Explain the difference between 'Depreciation' and 'Amortization' in one simple sentence.",
      answer: "Depreciation is for tangible assets; Amortization is for intangible assets."
    }
  ],

  // Tile 2: Statistics - Library 1
  STQ1: [
    {
      level: 1, type: 'fill',
      question: "A value that is very far away from all other data points is called an ______.",
      answer: "Outlier"
    },
    {
      level: 2, type: 'calc',
      question: "Data: {1, 1, 2, 3, 8}. What is the Median?",
      answer: "2"
    },
    {
      level: 3, type: 'open',
      question: "Why is 'Correlation does not imply Causation' an important rule?",
      answer: "e.g. Ice cream sales don't cause shark attacks — two variables can move together without one causing the other."
    }
  ],

  // Tile 6: Statistics - Library 2
  STQ2: [
    {
      level: 1, type: 'fill',
      question: "If two variables move in opposite directions, they have a ______ correlation.",
      answer: "Negative"
    },
    {
      level: 2, type: 'calc',
      question: "If you flip a coin 3 times, what is the probability of getting 3 Heads?",
      answer: "1/8 (12.5%)"
    },
    {
      level: 3, type: 'open',
      question: "What does a 'P-value < 0.05' typically represent in a hypothesis test?",
      answer: "Statistically significant result — we reject the null hypothesis (H₀)."
    }
  ],

  // Tile 3: Calculus - Library 1
  CAQ1: [
    {
      level: 1, type: 'fill',
      question: "If the slope of a curve is zero, it might be a maximum or a ______ point.",
      answer: "Minimum"
    },
    {
      level: 2, type: 'calc',
      question: "Find the derivative (f') of f(x) = x³ + 2x.",
      answer: "3x² + 2"
    },
    {
      level: 3, type: 'open',
      question: "Describe a real-world scenario where we might need to use 'Optimization' (finding the maximum or minimum).",
      answer: "e.g. Minimizing production cost / Maximizing profit for a company."
    }
  ],

  // Tile 7: Calculus - Library 2
  CAQ2: [
    {
      level: 1, type: 'fill',
      question: "The reverse process of differentiation is called ______.",
      answer: "Integration (Antiderivative)"
    },
    {
      level: 2, type: 'calc',
      question: "What is the value of 'e' to two decimal places?",
      answer: "2.72"
    },
    {
      level: 3, type: 'open',
      question: "Explain the 'Chain Rule' in one simple sentence.",
      answer: "It's a rule for finding the derivative of a function inside another function (composite function)."
    }
  ],

  // Tile 4: Economics - Library 1
  ECQ1: [
    {
      level: 1, type: 'fill',
      question: "The point where Supply meets Demand is called the Market ______.",
      answer: "Equilibrium"
    },
    {
      level: 2, type: 'calc',
      question: "Price increases from $10 to $12. Quantity demanded drops from 100 to 80. Is the demand elastic or inelastic?",
      answer: "Elastic (% change in quantity > % change in price)"
    },
    {
      level: 3, type: 'open',
      question: "Explain 'Opportunity Cost' using an example from your daily life as a university student.",
      answer: "e.g. Choosing to sleep instead of studying — the opportunity cost is lost study time."
    }
  ],

  // Tile 8: Economics - Library 2
  ECQ2: [
    {
      level: 1, type: 'fill',
      question: "When your income increases and you buy LESS of a good, that good is called an ______ good.",
      answer: "Inferior"
    },
    {
      level: 2, type: 'calc',
      question: "You can work (earn $160) or go to a concert (ticket costs $100). What is the total opportunity cost of the concert?",
      answer: "$260 ($100 ticket + $160 forgone income)"
    },
    {
      level: 3, type: 'open',
      question: "In your opinion, what is one 'Negative Externality' of using AI for homework?",
      answer: "e.g. Losing critical thinking skills / Academic dishonesty."
    }
  ]
};

// Board tile configuration (索引 0-9)
const BOARD_TILES = [
  { id: 0, type: 'special', label: 'START',    icon: 'flag',             color: 'white',      bankKey: null },
  { id: 1, type: 'subject', label: 'ACQ',       icon: 'account_balance',  color: 'tertiary',   bankKey: 'ACQ1' },
  { id: 2, type: 'subject', label: 'STQ',       icon: 'insights',         color: 'primary',    bankKey: 'STQ1' },
  { id: 3, type: 'subject', label: 'CAQ',       icon: 'calculate',        color: 'secondary',  bankKey: 'CAQ1' },
  { id: 4, type: 'subject', label: 'ECQ',       icon: 'trending_up',      color: 'cyan',       bankKey: 'ECQ1' },
  { id: 5, type: 'subject', label: 'ACQ',       icon: 'account_balance_wallet', color: 'tertiary', bankKey: 'ACQ2' },
  { id: 6, type: 'subject', label: 'STQ',       icon: 'analytics',        color: 'primary',    bankKey: 'STQ2' },
  { id: 7, type: 'subject', label: 'CAQ',       icon: 'functions',        color: 'secondary',  bankKey: 'CAQ2' },
  { id: 8, type: 'subject', label: 'ECQ',       icon: 'science',          color: 'cyan',       bankKey: 'ECQ2' },
  { id: 9, type: 'special', label: 'CHANCE',   icon: 'casino',           color: 'white',      bankKey: null },
];

// Student pool (15 students, excluding 4 presenters: Justin, Kelly, Carrie, Ally)
const STUDENT_POOL = [
  'Anthony', 'Jimena', 'Peggie',   // Week 5
  'Annie', 'Dylan', 'Wendy',        // Week 7
  'Jason', 'Kevin', 'Maggie',       // Week 8
  'Ryan', 'Ruby',                   // Week 12
  'Dino', 'Vincent',                // Week 13
  'Regina', 'Tony'                  // Week 15
];

const TEAM_NAMES = ['ALPHA', 'BETA', 'GAMMA', 'DELTA'];
const TEAM_COLORS = ['primary', 'secondary', 'tertiary', 'error'];
const TEAM_HEX = ['#8ff5ff', '#c47fff', '#a0ed00', '#ff716c'];
