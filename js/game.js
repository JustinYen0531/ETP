// ============================================================
// ETP GAME SHOW - Game State & Logic
// ============================================================

// Visual board route follows the clockwise numbering shown on screen:
// 1,2,3,4,5,6,7,8,9,10 => tile ids [0,1,2,3,4,9,5,6,7,8]
const BOARD_ROUTE = [0, 1, 2, 3, 4, 9, 5, 6, 7, 8];
const DICE_FACES = ['filter_1', 'filter_2', 'filter_3', 'filter_4', 'filter_5', 'filter_6'];

const GameState = {
  phase: 'home',         // 'home' | 'randomize' | 'board' | 'question' | 'stats'
  currentTeam: 0,        // 0-3 index
  teams: [],             // Array of { name, members, color, score, properties }
  tiles: [],             // Array of { owner: teamIdx | null, level: 1-3 }
  currentQuestion: null, // { tile, question, challenger, defender }
  roundPassCount: 0,
  history: [],
  turnCount: 1,
  isRolling: false,
  pendingAnswerTile: null,
  activeStepTile: null,
  teamsRandomized: false,

  init() {
    this.tiles = BOARD_TILES.map(() => ({ owner: null, level: 0 }));
    this.teams = TEAM_NAMES.map((name, i) => ({
      name,
      members: [],
      colorClass: TEAM_COLORS[i],
      hex: TEAM_HEX[i],
      score: 0,
      properties: [],
      position: 0,
      manualBonus: 0,
      lapBonusCount: 0,
      scoreBreakdown: { lvl1: 0, lvl2: 0, lvl3: 0 }
    }));
    this.history = [];
    this.turnCount = 1;
    this.isRolling = false;
    this.pendingAnswerTile = null;
    this.activeStepTile = null;
    this.teamsRandomized = false;
  }
};

// ============================================================
// Screen Navigation
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(`screen-${id}`).classList.remove('hidden');
  GameState.phase = id;
  if (typeof refreshNavigationLockState === 'function') refreshNavigationLockState();
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
  GameState.teamsRandomized = true;
  renderTeamSlots();
  if (typeof updateProceedButtonState === 'function') updateProceedButtonState();
  
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
  // Update tile states
  BOARD_TILES.forEach((tile, idx) => {
    const el = document.getElementById(`tile-${idx}`);
    if (!el) return;
    const state = GameState.tiles[idx];

    // Remove existing owner class
    el.className = el.className.replace(/owner-\d/g, '').trim();
    el.classList.remove('owned-level-1', 'owned-level-2', 'owned-level-3');

    if (state.owner !== null) {
      const team = GameState.teams[state.owner];
      const glowByLevel = {
        1: {
          border: `${team.hex}80`,
          shadow: `0 0 20px ${team.hex}33`
        },
        2: {
          border: `${team.hex}b3`,
          shadow: `0 0 0 1px ${team.hex}55, 0 0 26px ${team.hex}66, inset 0 0 18px ${team.hex}18`
        },
        3: {
          border: `${team.hex}ff`,
          shadow: `0 0 0 1px ${team.hex}88, 0 0 18px ${team.hex}88, 0 0 36px ${team.hex}99, inset 0 0 24px ${team.hex}22`
        }
      };
      const glow = glowByLevel[state.level] || glowByLevel[1];
      el.style.setProperty('--owner-glow', team.hex);
      el.style.borderColor = glow.border;
      el.style.boxShadow = glow.shadow;
      el.classList.add(`owned-level-${Math.min(state.level, 3)}`);

      // Level indicator
      const levelEl = el.querySelector('.tile-level');
      if (levelEl) {
        levelEl.textContent = `LV ${state.level}`;
        levelEl.style.color = team.hex;
        levelEl.style.borderColor = team.hex + '40';
        levelEl.style.backgroundColor = state.level >= 2 ? `${team.hex}18` : 'transparent';
        levelEl.style.boxShadow = state.level === 3
          ? `0 0 18px ${team.hex}66`
          : state.level === 2
            ? `0 0 10px ${team.hex}40`
            : '';
      }
      // Owner badge
      const ownerEl = el.querySelector('.tile-owner');
      if (ownerEl) {
        ownerEl.textContent = team.name[0]; // First letter
        ownerEl.style.backgroundColor = team.hex + '20';
        ownerEl.style.color = team.hex;
      }
    } else {
      el.style.removeProperty('--owner-glow');
      el.style.borderColor = '';
      el.style.boxShadow = '';
      const levelEl = el.querySelector('.tile-level');
      if (levelEl) {
        levelEl.textContent = '';
        levelEl.style.backgroundColor = '';
        levelEl.style.boxShadow = '';
      }
      const ownerEl = el.querySelector('.tile-owner');
      if (ownerEl) ownerEl.textContent = '';
    }

    el.classList.toggle('step-active', GameState.activeStepTile === idx);
    renderTileTokens(el, idx);
  });

  // Current team indicator
  const curTeamEl = document.getElementById('current-team-display');
  if (curTeamEl) {
    const team = GameState.teams[GameState.currentTeam];
    curTeamEl.textContent = `TEAM ${team.name}'S TURN`;
    curTeamEl.style.color = team.hex;
  }

  const centerTile = document.getElementById('tile-center-cell');
  const tileIdx = GameState.pendingAnswerTile;
  const pendingTile = tileIdx === null ? null : BOARD_TILES[tileIdx];
  const canAnswer = pendingTile && pendingTile.bankKey;

  if (centerTile) {
    centerTile.classList.toggle('answer-mode', Boolean(canAnswer));
  }

  const answerButton = document.getElementById('btn-answer-tile');
  const answerLevel = document.getElementById('answer-tile-level');
  if (answerButton) {
    answerButton.classList.toggle('hidden', !canAnswer);
    if (canAnswer) {
      answerButton.textContent = `ANSWER TILE ${tileIdx + 1}`;
    }
  }
  if (answerLevel) {
    answerLevel.classList.toggle('hidden', !canAnswer);
    if (canAnswer) {
      const tileState = GameState.tiles[tileIdx];
      const nextLevel = tileState.owner === null ? 1 : Math.min(tileState.level + 1, 3);
      answerLevel.textContent = `LEVEL ${nextLevel}`;
    }
  }

  renderSidePanels();
}

// ============================================================
// Dice Roll
// ============================================================
function rollDice() {
  if (GameState.isRolling || GameState.pendingAnswerTile !== null) return;
  const diceEl = document.getElementById('dice-icon');
  const resultEl = document.getElementById('dice-result');
  if (!diceEl) return;
  GameState.isRolling = true;

  // Dice animation
  let rolls = 0;
  const interval = setInterval(() => {
    diceEl.textContent = DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)];
    rolls++;
    if (rolls > 10) {
      clearInterval(interval);
      const result = Math.floor(Math.random() * 6) + 1;
      diceEl.textContent = DICE_FACES[result - 1];
      if (resultEl) {
        resultEl.textContent = `ROLLED ${result}`;
        resultEl.style.opacity = 1;
      }
      setTimeout(() => animateTeamMove(result), 260);
    }
  }, 80);
}

async function animateTeamMove(steps) {
  const resultEl = document.getElementById('dice-result');
  const diceEl = document.getElementById('dice-icon');
  const team = GameState.teams[GameState.currentTeam];
  const from = team.position;
  let laps = 0;

  for (let i = 0; i < steps; i++) {
    const nextMove = getNextPlayableRouteIndex(team.position);
    team.position = nextMove.routeIndex;
    if (nextMove.wrapped) laps += 1;
    GameState.activeStepTile = BOARD_ROUTE[team.position];
    if (resultEl) resultEl.textContent = `MOVING ${i + 1}/${steps}`;
    renderBoard();
    await wait(260);
  }

  if (laps > 0) {
    team.lapBonusCount += laps;
    team.score += laps * 50;
  }

  GameState.activeStepTile = BOARD_ROUTE[team.position];
  GameState.pendingAnswerTile = BOARD_ROUTE[team.position];
  if (resultEl) resultEl.textContent = `LANDED ON ${team.position + 1}`;
  pushHistory(
    GameState.currentTeam,
    `Rolled ${steps} and moved from ${from + 1} to ${team.position + 1}${laps > 0 ? ' · Lap bonus +50' : ''}.`,
    `MOVE ${steps}`
  );
  renderBoard();
  showToast(`Team ${team.name} rolled ${steps} and moved to tile ${team.position + 1}.`);
  GameState.isRolling = false;
  setTimeout(() => {
    if (resultEl) resultEl.style.opacity = 0;
    if (diceEl) diceEl.textContent = 'casino';
  }, 2500);
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
  document.getElementById('q-text').textContent = q.question;
  document.getElementById('q-answer').textContent = q.answer;
  document.getElementById('q-answer').classList.add('hidden');

  // Author label (Top Right)
  const qAuthEl = document.getElementById('q-author');
  if (qAuthEl) {
    qAuthEl.textContent = tile.author.toUpperCase();
    qAuthEl.style.color = `var(--c-${tile.color})`;
    qAuthEl.style.textShadow = `0 0 15px var(--c-${tile.color})80`;
  }

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
      incrementScoreBreakdown(challenger, questionLevel);
      GameState.teams[challenger].properties.push(tileIdx);
    } else {
      // Conquer tile
      GameState.teams[defender].properties = GameState.teams[defender].properties.filter(t => t !== tileIdx);
      GameState.tiles[tileIdx].owner = challenger;
      GameState.tiles[tileIdx].level = Math.min(questionLevel, 3);
      GameState.teams[challenger].score += questionLevel * 100;
      incrementScoreBreakdown(challenger, questionLevel);
      GameState.teams[challenger].properties.push(tileIdx);
    }
    pushHistory(challenger, `Answered tile ${tileIdx + 1} correctly${defender === null ? ' and claimed it' : ` and conquered from ${GameState.teams[defender].name}`}.`, `+${questionLevel * 100}`);
    showToast(`✅ Correct! TEAM ${GameState.teams[challenger].name} ${defender === null ? 'claimed' : 'conquered'} the tile!`);
  } else {
    if (defender !== null) {
      // Auto-upgrade defender's tile
      GameState.tiles[tileIdx].level = Math.min(GameState.tiles[tileIdx].level + 1, 3);
      GameState.teams[defender].score += 50;
      pushHistory(defender, `Defended tile ${tileIdx + 1}; auto-upgrade to Lv ${GameState.tiles[tileIdx].level}.`, '+50 DEF');
      showToast(`❌ Wrong! TEAM ${GameState.teams[defender].name} defends + auto-upgrades to Lv ${GameState.tiles[tileIdx].level}!`);
    } else {
      pushHistory(challenger, `Missed tile ${tileIdx + 1}; no points awarded.`, 'WRONG');
      showToast(`❌ Wrong! Tile remains unclaimed.`);
    }
  }

  closeModal('question-modal');
  GameState.pendingAnswerTile = null;
  renderBoard();
  endTurn();
}

// ============================================================
// Turn Management
// ============================================================
function endTurn() {
  if (GameState.isRolling) return;
  GameState.pendingAnswerTile = null;
  GameState.activeStepTile = null;
  GameState.currentTeam = (GameState.currentTeam + 1) % 4;
  GameState.turnCount += 1;
  renderBoard();
  checkGameEnd();
}

function answerCurrentTile() {
  if (GameState.pendingAnswerTile === null) return;
  triggerQuestion(GameState.pendingAnswerTile);
}

function checkGameEnd() {
  const allMaxed = GameState.tiles
    .filter(t => BOARD_TILES[GameState.tiles.indexOf(t)]?.type === 'subject')
    .every(t => t.level >= 3);
  if (allMaxed) {
    setTimeout(() => goToStats(true), 500);
  }
}

function incrementScoreBreakdown(teamIdx, questionLevel) {
  const team = GameState.teams[teamIdx];
  if (questionLevel === 1) team.scoreBreakdown.lvl1 += 1;
  if (questionLevel === 2) team.scoreBreakdown.lvl2 += 1;
  if (questionLevel >= 3) team.scoreBreakdown.lvl3 += 1;
}

function pushHistory(teamIdx, text, tag = 'LOG') {
  const team = GameState.teams[teamIdx];
  GameState.history.unshift({
    teamIdx,
    teamName: team.name,
    color: team.hex,
    tag,
    text,
    turn: GameState.history.length + 1
  });
  GameState.history = GameState.history.slice(0, 12);
}

function renderSidePanels() {
  renderStatsPanel('stats-panel-top', [0, 1, 2, 3]);
  renderRoundPanel();
}

function renderStatsPanel(containerId, teamIndexes) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = 'team-stats-stack';
  el.innerHTML = teamIndexes.map((teamIdx) => {
    const team = GameState.teams[teamIdx];
    const breakdown = team.scoreBreakdown;
    return `
      <div class="team-stat-card" style="border-left:2px solid ${team.hex};">
        <div class="team-stat-top">
          <div>
            <div class="team-stat-name" style="color:${team.hex};">${team.name}</div>
            <div class="side-panel-note">Tile ${team.position + 1} · ${team.properties.length} assets</div>
          </div>
          <div class="team-stat-scorebox">
            <div class="team-stat-total-label">Total</div>
            <div class="team-stat-total" style="color:${team.hex};">${team.score}</div>
          </div>
        </div>
        <div class="team-breakdown">
          <div class="team-breakdown-row"><span class="team-breakdown-key"><span class="material-symbols-outlined team-breakdown-icon">looks_one</span>100</span><span>${breakdown.lvl1}</span></div>
          <div class="team-breakdown-row"><span class="team-breakdown-key"><span class="material-symbols-outlined team-breakdown-icon">looks_two</span>200</span><span>${breakdown.lvl2}</span></div>
          <div class="team-breakdown-row"><span class="team-breakdown-key"><span class="material-symbols-outlined team-breakdown-icon">looks_3</span>300</span><span>${breakdown.lvl3}</span></div>
          <div class="team-breakdown-row"><span class="team-breakdown-key"><span class="material-symbols-outlined team-breakdown-icon">sync</span>+50</span><span>${team.lapBonusCount}</span></div>
        </div>
        <div class="manual-score-wrap">
          <label class="manual-score-label" for="manual-score-${teamIdx}">Manual</label>
          <input id="manual-score-${teamIdx}" class="manual-score-input" type="number" inputmode="numeric" placeholder="Type score" value="${team.manualBonus}" oninput="updateManualScore(${teamIdx}, this.value)" />
        </div>
      </div>
    `;
  }).join('');
}

function renderRoundPanel() {
  const el = document.getElementById('round-panel');
  if (!el) return;
  const round = Math.floor((GameState.turnCount - 1) / 4) + 1;
  const turnInRound = ((GameState.turnCount - 1) % 4) + 1;
  const nextTeam = GameState.teams[GameState.currentTeam];

  el.innerHTML = `
    <div class="round-card" style="border-color:${nextTeam.hex}; box-shadow: 0 0 24px ${nextTeam.hex}20;">
      <div class="round-chip">Round ${round}</div>
      <div class="round-turn-label">Turn ${turnInRound}</div>
      <div class="round-turn-copy">Up Next</div>
      <div class="round-team-name" style="color:${nextTeam.hex}; border-color:${nextTeam.hex}55;">${nextTeam.name}</div>
    </div>
  `;
}

function updateManualScore(teamIdx, rawValue) {
  const team = GameState.teams[teamIdx];
  const nextManual = Number(rawValue) || 0;
  const delta = nextManual - team.manualBonus;
  team.manualBonus = nextManual;
  team.score += delta;
  pushHistory(teamIdx, `Manual score adjusted by ${delta >= 0 ? '+' : ''}${delta}.`, 'MANUAL');
  renderBoard();
}

function getWinningTeam() {
  return GameState.teams.reduce((best, team) => (team.score > best.score ? team : best), GameState.teams[0]);
}

function triggerStatsCelebration() {
  const layer = document.getElementById('celebration-layer');
  if (!layer) return;
  layer.innerHTML = '';

  const winner = getWinningTeam();
  const palette = [winner.hex, '#ffffff', '#ffe066', '#8ff5ff'];

  for (let i = 0; i < 48; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = palette[i % palette.length];
    piece.style.animationDelay = `${Math.random() * 220}ms`;
    piece.style.animationDuration = `${1600 + Math.random() * 1200}ms`;
    piece.style.transform = `translateY(0) rotate(${Math.random() * 180}deg)`;
    layer.appendChild(piece);
  }

  setTimeout(() => {
    layer.innerHTML = '';
  }, 3200);
}

function renderTileTokens(tileEl, tileIdx) {
  let layer = tileEl.querySelector('.tile-token-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'tile-token-layer';
    tileEl.appendChild(layer);
  }

  const teamsOnTile = GameState.teams
    .map((team, idx) => ({ team, idx }))
    .filter(({ team }) => BOARD_ROUTE[team.position] === tileIdx);

  layer.innerHTML = teamsOnTile.map(({ team, idx }) =>
    `<span class="team-token ${GameState.isRolling && idx === GameState.currentTeam ? 'moving' : ''}" title="${team.name}" style="background:${team.hex}; color:${team.hex}; outline: 1px solid ${team.hex}90;" data-team="${idx}"></span>`
  ).join('');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isMaxLevelTile(tileIdx) {
  const tile = BOARD_TILES[tileIdx];
  const state = GameState.tiles[tileIdx];
  return Boolean(tile?.bankKey) && (state?.level ?? 0) >= 3;
}

function getNextPlayableRouteIndex(currentRouteIndex) {
  const spaces = BOARD_ROUTE.length;
  let nextRouteIndex = currentRouteIndex;
  let wrapped = false;

  for (let i = 0; i < spaces; i++) {
    nextRouteIndex = (nextRouteIndex + 1) % spaces;
    if (nextRouteIndex === 0) wrapped = true;
    if (!isMaxLevelTile(BOARD_ROUTE[nextRouteIndex])) {
      return { routeIndex: nextRouteIndex, wrapped };
    }
  }

  return { routeIndex: currentRouteIndex, wrapped: false };
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
    winEl.textContent = winner.name;
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
// Question Index / Overview
// ============================================================
function openQuestionOverview() {
  renderQuestionOverview();
  openModal('overview-modal');
}

function renderQuestionOverview() {
  const grid = document.getElementById('overview-grid');
  if (!grid) return;

  grid.innerHTML = BOARD_TILES.filter(t => t.type === 'subject').map(tile => {
    return `
      <div class="overview-item" onclick="openQuestionPreview('${tile.bankKey}')">
        <div class="overview-item-top">
          <span class="overview-tile-num">TILE 0${tile.id}</span>
          <span class="material-symbols-outlined" style="color:var(--c-${tile.color});">${tile.icon}</span>
        </div>
        <div class="overview-subject">${tile.label}</div>
        <div class="overview-author-label">Created By</div>
        <div class="overview-author-name">${tile.author}</div>
      </div>
    `;
  }).join('');
}

function openQuestionPreview(bankKey) {
  const content = document.getElementById('preview-content');
  const accent = document.getElementById('preview-accent');
  if (!content || !bankKey) return;

  const subjectData = QUESTION_BANK[bankKey];
  const tile = BOARD_TILES.find(t => t.bankKey === bankKey);
  
  accent.style.background = `var(--c-${tile.color})`;

  content.innerHTML = `
    <span class="section-label">${tile.label} Bank · ${tile.author}</span>
    <h2 class="guide-title" style="margin-bottom:1.5rem;">Tile ${tile.id} Questions</h2>
    
    ${subjectData.map((q, i) => `
      <div class="preview-q-block" style="border-left-color: var(--c-${tile.color})">
        <div class="preview-q-level">Level ${i + 1}</div>
        <div class="preview-q-text">${q.question}</div>
        <div class="preview-q-ans">Ans: ${q.answer}</div>
      </div>
    `).join('')}
  `;

  openModal('preview-modal');
}

function closeModalOutside(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

// Custom Navigation Functions
function openHowToPlay() {
  openModal('how-to-play-modal');
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  GameState.init();
  renderSidePanels();
  showScreen('home');
});
