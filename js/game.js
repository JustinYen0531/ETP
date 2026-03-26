// ============================================================
// ETP GAME SHOW - Game State & Logic
// ============================================================

const GameState = {
  phase: 'home',         // 'home' | 'randomize' | 'board' | 'question' | 'stats'
  currentTeam: 0,        // 0-3 index
  teams: [],             // Array of { name, members, color, score, properties }
  tiles: [],             // Array of { owner: teamIdx | null, level: 1-3 }
  currentQuestion: null, // { tile, question, challenger, defender }
  roundPassCount: 0,

  init() {
    this.tiles = BOARD_TILES.map(() => ({ owner: null, level: 0 }));
    this.teams = TEAM_NAMES.map((name, i) => ({
      name,
      members: [],
      colorClass: TEAM_COLORS[i],
      hex: TEAM_HEX[i],
      score: 0,
      properties: []
    }));
  }
};

// ============================================================
// Screen Navigation
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(`screen-${id}`).classList.remove('hidden');
  GameState.phase = id;
}

// ============================================================
// Team Randomizer
// ============================================================
function randomizeTeams() {
  const pool = [...STUDENT_POOL];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // Distribute into 4 teams
  GameState.teams.forEach(t => t.members = []);
  pool.forEach((student, idx) => {
    GameState.teams[idx % 4].members.push(student);
  });
  renderTeamSlots();
  
  // Animate the number spinner
  animatePoolCount();
}

function animatePoolCount() {
  const el = document.getElementById('pool-count');
  if (!el) return;
  let count = 0;
  const interval = setInterval(() => {
    el.textContent = Math.floor(Math.random() * 20);
    count++;
    if (count > 15) { clearInterval(interval); el.textContent = '15'; }
  }, 50);
}

function renderTeamSlots() {
  TEAM_NAMES.forEach((name, i) => {
    const el = document.getElementById(`team-slot-${i}`);
    if (!el) return;
    const members = GameState.teams[i].members;
    el.innerHTML = `
      <div class="slot-label" style="font-weight:900;">SLOT 0${i + 1}</div>
      <div class="slot-team-name" style="color: ${GameState.teams[i].hex}">${name}</div>
      <div class="slot-status">READY</div>
      <div class="slot-members" style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-top:0.75rem;">
        ${members.map(m => `<span style="font-size:0.9rem; font-weight:600; padding:0.4rem; text-align:center; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);">${m}</span>`).join('')}
      </div>
    `;
  });
}

// ============================================================
// Board Rendering
// ============================================================
function renderBoard() {
  // Update team HUD scores
  GameState.teams.forEach((team, i) => {
    const scoreEl = document.getElementById(`hud-score-${i}`);
    if (scoreEl) scoreEl.textContent = team.score.toLocaleString();
  });

  // Update tile states
  BOARD_TILES.forEach((tile, idx) => {
    const el = document.getElementById(`tile-${idx}`);
    if (!el) return;
    const state = GameState.tiles[idx];

    // Remove existing owner class
    el.className = el.className.replace(/owner-\d/g, '').trim();

    if (state.owner !== null) {
      const team = GameState.teams[state.owner];
      el.style.borderColor = team.hex + '80';
      el.style.boxShadow = `0 0 20px ${team.hex}33`;

      // Level indicator
      const levelEl = el.querySelector('.tile-level');
      if (levelEl) {
        levelEl.textContent = `LV ${state.level}`;
        levelEl.style.color = team.hex;
        levelEl.style.borderColor = team.hex + '40';
      }
      // Owner badge
      const ownerEl = el.querySelector('.tile-owner');
      if (ownerEl) {
        ownerEl.textContent = team.name[0]; // First letter
        ownerEl.style.backgroundColor = team.hex + '20';
        ownerEl.style.color = team.hex;
      }
    } else {
      el.style.borderColor = '';
      el.style.boxShadow = '';
      const levelEl = el.querySelector('.tile-level');
      if (levelEl) levelEl.textContent = '';
      const ownerEl = el.querySelector('.tile-owner');
      if (ownerEl) ownerEl.textContent = '';
    }
  });

  // Current team indicator
  const curTeamEl = document.getElementById('current-team-display');
  if (curTeamEl) {
    const team = GameState.teams[GameState.currentTeam];
    curTeamEl.textContent = `TEAM ${team.name}'S TURN`;
    curTeamEl.style.color = team.hex;
  }
}

// ============================================================
// Dice Roll
// ============================================================
function rollDice() {
  const diceEl = document.getElementById('dice-icon');
  if (!diceEl) return;

  // Dice animation
  let rolls = 0;
  const faces = ['casino', 'filter_1', 'filter_2', 'filter_3', 'filter_4', 'filter_5', 'filter_6'];
  const interval = setInterval(() => {
    diceEl.textContent = faces[Math.floor(Math.random() * faces.length)];
    rolls++;
    if (rolls > 10) {
      clearInterval(interval);
      const result = Math.floor(Math.random() * 6) + 1;
      diceEl.textContent = 'casino';
      showDiceResult(result);
    }
  }, 80);
}

function showDiceResult(steps) {
  const resultEl = document.getElementById('dice-result');
  if (resultEl) {
    resultEl.textContent = `ROLLED ${steps}`;
    resultEl.style.opacity = 1;
    setTimeout(() => { resultEl.style.opacity = 0; }, 3000);
  }
  // Alert: which tile to land on (simplified — no token movement in v1)
  showToast(`Team ${GameState.teams[GameState.currentTeam].name} rolled ${steps}! Move ${steps} spaces.`);
}

// ============================================================
// Question Flow
// ============================================================
function triggerQuestion(tileIdx) {
  const tile = BOARD_TILES[tileIdx];
  if (!tile.bankKey) return; // Skip special tiles

  const tileState = GameState.tiles[tileIdx];
  const challenger = GameState.currentTeam;
  const defender = tileState.owner;
  const questionLevel = tileState.owner === null ? 1 : tileState.level + 1;

  if (questionLevel > 3) {
    showToast('This tile is at MAX LEVEL — skipped!');
    endTurn();
    return;
  }

  const q = QUESTION_BANK[tile.bankKey][questionLevel - 1];
  GameState.currentQuestion = { tileIdx, q, challenger, defender, questionLevel };

  // Populate question modal
  const levelLabels = ['', 'Level 1 · Fill in the Blank', 'Level 2 · Calculation', 'Level 3 · Open Question'];
  document.getElementById('q-level-label').textContent = levelLabels[questionLevel];
  document.getElementById('q-subject').textContent = tile.label;
  document.getElementById('q-text').textContent = q.question;
  document.getElementById('q-answer').textContent = q.answer;
  document.getElementById('q-answer').classList.add('hidden');

  // Context line
  const ctxEl = document.getElementById('q-context');
  if (defender === null) {
    ctxEl.textContent = `Unclaimed tile · Answer correctly to OWN it`;
    ctxEl.style.color = '#8ff5ff';
  } else {
    const defTeam = GameState.teams[defender];
    ctxEl.textContent = `Defending: TEAM ${defTeam.name} (Lv ${tileState.level}) · Answer correctly to CONQUER`;
    ctxEl.style.color = defTeam.hex;
  }

  openModal('question-modal');
}

function revealAnswer() {
  document.getElementById('q-answer').classList.remove('hidden');
}

function judgeResult(correct) {
  const { tileIdx, q, challenger, defender, questionLevel } = GameState.currentQuestion;

  if (correct) {
    if (defender === null) {
      // Claim unowned tile
      GameState.tiles[tileIdx].owner = challenger;
      GameState.tiles[tileIdx].level = 1;
      GameState.teams[challenger].score += questionLevel * 100;
      GameState.teams[challenger].properties.push(tileIdx);
    } else {
      // Conquer tile
      GameState.teams[defender].properties = GameState.teams[defender].properties.filter(t => t !== tileIdx);
      GameState.tiles[tileIdx].owner = challenger;
      GameState.tiles[tileIdx].level = Math.min(questionLevel, 3);
      GameState.teams[challenger].score += questionLevel * 100;
      GameState.teams[challenger].properties.push(tileIdx);
    }
    showToast(`✅ Correct! TEAM ${GameState.teams[challenger].name} ${defender === null ? 'claimed' : 'conquered'} the tile!`);
  } else {
    if (defender !== null) {
      // Auto-upgrade defender's tile
      GameState.tiles[tileIdx].level = Math.min(GameState.tiles[tileIdx].level + 1, 3);
      GameState.teams[defender].score += 50;
      showToast(`❌ Wrong! TEAM ${GameState.teams[defender].name} defends + auto-upgrades to Lv ${GameState.tiles[tileIdx].level}!`);
    } else {
      showToast(`❌ Wrong! Tile remains unclaimed.`);
    }
  }

  closeModal('question-modal');
  renderBoard();
  endTurn();
}

// ============================================================
// Turn Management
// ============================================================
function endTurn() {
  GameState.currentTeam = (GameState.currentTeam + 1) % 4;
  renderBoard();
  checkGameEnd();
}

function checkGameEnd() {
  const allMaxed = GameState.tiles
    .filter(t => BOARD_TILES[GameState.tiles.indexOf(t)]?.type === 'subject')
    .every(t => t.level >= 3);
  if (allMaxed) {
    setTimeout(() => showScreen('stats'), 500);
  }
}

// ============================================================
// Stats Screen
// ============================================================
function renderStats() {
  GameState.teams.forEach((team, i) => {
    const scoreEl = document.getElementById(`stats-score-${i}`);
    const propsEl = document.getElementById(`stats-props-${i}`);
    if (scoreEl) scoreEl.textContent = team.score.toLocaleString();
    if (propsEl) {
      propsEl.innerHTML = team.properties.map(tileIdx => {
        const tile = BOARD_TILES[tileIdx];
        const state = GameState.tiles[tileIdx];
        return `<span class="prop-chip">${tile.label} Lv${state.level}</span>`;
      }).join('') || '<span class="text-zinc-600">No properties</span>';
    }
  });

  const winner = GameState.teams.reduce((a, b) => a.score > b.score ? a : b);
  const winEl = document.getElementById('stats-winner');
  if (winEl) {
    winEl.textContent = `TEAM ${winner.name}`;
    winEl.style.color = winner.hex;
  }
}

// ============================================================
// Modal Helpers
// ============================================================
function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

// ============================================================
// Toast Notification
// ============================================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  GameState.init();
  showScreen('home');
});
