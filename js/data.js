// ============================================================
// ETP GAME SHOW - Question Bank (題庫)
// 4 subjects × 2 tiles × 3 levels = 24 questions
// ============================================================

const QUESTION_BANK = {
  // Tile 1: Accounting - Kelly
  ACQ1: [
    {
      level: 1, type: 'fill',
      question: "Accounts that represent what the business owes to others are called ______.",
      answer: "Liabilities"
    },
    {
      level: 2, type: 'calc',
      question: "If a company buys a $5,000 equipment with Cash, what is the net effect on Total Assets? (Increase/Decrease/No Change)",
      answer: "No Change"
    },
    {
      level: 3, type: 'open',
      question: "Why is the Income Statement prepared for a 'period of time' instead of a 'single point in time'?",
      answer: "Because it records the financial performance (flow) over a duration, unlike the Balance Sheet which is a stock concept for a single point in time."
    }
  ],

  // Tile 5: Accounting - Carrie
  ACQ2: [
    {
      level: 1, type: 'fill',
      question: "The resources owned by a business that are expected to provide future economic benefits are called ______.",
      answer: "Assets"
    },
    {
      level: 2, type: 'calc',
      question: "If a company has Total Assets of $50,000 and Total Equity of $20,000, what is the total amount of its Liabilities? (Enter number only)",
      answer: "30000"
    },
    {
      level: 3, type: 'open',
      question: "Explain the concept of 'Depreciation' and why it is recorded as an expense even if no cash flow occurs during the period.",
      answer: "Depreciation represents the systematic allocation of an asset's cost over its useful life to match expenses with revenue earned (Matching Principle)."
    }
  ],

  // Tile 2: Statistics - Ally
  STQ1: [
    {
      level: 1, type: 'fill',
      question: "According to the Central Limit Theorem, as the sample size becomes sufficiently large, the sampling distribution of the sample mean approaches a ______ distribution, regardless of the population's original shape.",
      answer: "Normal"
    },
    {
      level: 2, type: 'calc',
      question: "If a dataset has a population mean of μ=75 and a standard deviation of σ=5, what is the Z-score for a data point with a value of X=85?",
      answer: "2"
    },
    {
      level: 3, type: 'open',
      question: "When looking at housing prices in a city, or starting salaries for college graduates, why is the 'Median' often a better measure of a typical value than the 'Mean'?",
      answer: "The mean is highly sensitive to extreme values (outliers), which can distort the average."
    }
  ],

  // Tile 6: Statistics - Justin
  STQ2: [
    {
      level: 1, type: 'fill',
      question: "A probability distribution where the mean, median, and mode are all equal and the curve is perfectly bell-shaped is the ______ distribution.",
      answer: "Normal"
    },
    {
      level: 2, type: 'calc',
      question: "In a standard deck of 52 cards, what is the probability of drawing a 'Heart' card? (Enter as a fraction, e.g., 1/2)",
      answer: "1/4"
    },
    {
      level: 3, type: 'open',
      question: "Explain the main difference between 'Descriptive Statistics' and 'Inferential Statistics'.",
      answer: "Descriptive statistics summarize and describe data, while inferential statistics use sample data to make predictions or generalizations about a larger population."
    }
  ],

  // Tile 3: Calculus - Ally
  CAQ1: [
    {
      level: 1, type: 'fill',
      question: "The Fundamental Theorem of Calculus establishes a connection between the two main operations of calculus: differentiation and ______.",
      answer: "Integration"
    },
    {
      level: 2, type: 'calc',
      question: "Evaluate the definite integral: ∫²₀ 3x^2 dx",
      answer: "8"
    },
    {
      level: 3, type: 'open',
      question: "If a function s(t) represents the position of a car at time t, what do its first derivative s′(t) and second derivative s′′(t) represent in the real world?",
      answer: "The first derivative s′(t) represents the car's Velocity, and the second derivative s′′(t) represents its Acceleration."
    }
  ],

  // Tile 7: Calculus - Justin
  CAQ2: [
    {
      level: 1, type: 'fill',
      question: "The mathematical concept used to measure the rate at which a function changes at a specific point is the ______.",
      answer: "Derivative"
    },
    {
      level: 2, type: 'calc',
      question: "Find the derivative (f') of f(x) = 5x^2 + 7x - 3.",
      answer: "10x + 7"
    },
    {
      level: 3, type: 'open',
      question: "In calculus, what does it mean for a function to be 'Continuous' at a specific point?",
      answer: "It means the limit as you approach the point equals the actual function value at that point (there are no jumps, holes, or gaps in the graph)."
    }
  ],

  // Tile 4: Economics - Kelly
  ECQ1: [
    {
      level: 1, type: 'fill',
      question: "A situation where the quantity supplied exceeds the quantity demanded at the current price is called a ______.",
      answer: "Surplus"
    },
    {
      level: 2, type: 'calc',
      question: "If the price of a cup of coffee increases by 20% and the quantity demanded falls by 10%, what is the Price Elasticity of Demand? (Enter number only)",
      answer: "0.5"
    },
    {
      level: 3, type: 'open',
      question: "Explain why a 'Price Ceiling' (such as rent control) often leads to a shortage in the long run.",
      answer: "Because the price is fixed below the equilibrium, quantity demanded increases while quantity supplied decreases, creating a gap (shortage)."
    }
  ],

  // Tile 8: Economics - Carrie 
  ECQ2: [
    {
      level: 1, type: 'fill',
      question: "When the price of a good increases, the Quantity Demanded usually decreases; this relationship is known as the Law of ______.",
      answer: "Demand"
    },
    {
      level: 2, type: 'calc',
      question: "If a consumer has a budget of $120 and the price of a book is $15, how many books can they purchase at most?",
      answer: "8"
    },
    {
      level: 3, type: 'open',
      question: "Explain why a consumer's willingness to pay for a product often decreases as they consume more units of that same product.",
      answer: "Due to the Law of Diminishing Marginal Utility, the satisfaction (utility) gained from each additional unit decreases, reducing the willingness to pay."
    }
  ]
};

// Board tile configuration (索引 0-9)
const BOARD_TILES = [
  { id: 0, type: 'special', label: 'START', icon: 'flag', color: 'white', bankKey: null },
  { id: 1, type: 'subject', label: 'ACQ', icon: 'account_balance', color: 'tertiary', bankKey: 'ACQ1' },
  { id: 2, type: 'subject', label: 'STQ', icon: 'insights', color: 'primary', bankKey: 'STQ1' },
  { id: 3, type: 'subject', label: 'CAQ', icon: 'calculate', color: 'secondary', bankKey: 'CAQ1' },
  { id: 4, type: 'subject', label: 'ECQ', icon: 'trending_up', color: 'cyan', bankKey: 'ECQ1' },
  { id: 5, type: 'subject', label: 'ACQ', icon: 'account_balance_wallet', color: 'tertiary', bankKey: 'ACQ2' },
  { id: 6, type: 'subject', label: 'STQ', icon: 'analytics', color: 'primary', bankKey: 'STQ2' },
  { id: 7, type: 'subject', label: 'CAQ', icon: 'functions', color: 'secondary', bankKey: 'CAQ2' },
  { id: 8, type: 'subject', label: 'ECQ', icon: 'science', color: 'cyan', bankKey: 'ECQ2' },
  { id: 9, type: 'special', label: 'CHANCE', icon: 'casino', color: 'white', bankKey: null },
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
