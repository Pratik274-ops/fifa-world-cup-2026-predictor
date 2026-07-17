// === Data Layer ===
// Fetch from window.MATCHES injected by match-data.js
const MATCHES = globalThis.MATCHES;

// Helpers for flag URLs based on ISO country code
function getFlagUrl(iso) {
  return `https://flagcdn.com/w160/${iso}.png`;
}

// Game state encapsulation
let state = {
  score: 0,
  streak: 0,
  bestStreak: 0,
  idx: 0,
  sequence: [],
  correct: 0,
  active: false
};

// =================== Local Storage ===================
function getLS(key, fallback) {
  try {
    const v = globalThis.localStorage?.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function setLS(key, value) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {}
}
function getHighScore() { return getLS('wc26_hs', 0); }
function setHighScore(val) { setLS('wc26_hs', val); }
function getGamesPlayed() { return getLS('wc26_gp', 0); }
function setGamesPlayed(val) { setLS('wc26_gp', val); }
function getLeaderboard() { return getLS('wc26_lb', []); }
function setLeaderboard(lb) { setLS('wc26_lb', lb); }
function getSavedGame() { return getLS('wc26_save', null); }
function setSavedGame(data) { setLS('wc26_save', data); }
function clearSavedGame() { globalThis.localStorage?.removeItem('wc26_save'); }

// =================== Shuffle Utility ===================
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// =================== UI: Screen Handling ===================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// =================== Start Screen ===================
function renderStartScreen() {
  document.getElementById('start-hs').textContent = getHighScore();
  document.getElementById('start-games').textContent = getGamesPlayed();
  document.getElementById('start-total').textContent = MATCHES.length;

  const hasSave = !!getSavedGame();
  document.getElementById('btn-continue').style.display = hasSave ? 'block' : 'none';
  renderLeaderboardTable();
}

function rankDisplay(i) {
  const medalByIndex = { 0: '🥇', 1: '🥈', 2: '🥉' };
  return medalByIndex[i] ?? (i + 1);
}

function renderLeaderboardTable() {
  const entries = getLeaderboard().slice(0,5);
  const medals = ['gold','silver','bronze','',''];
  const el = document.getElementById('leaderboard-list');
  if (!entries.length) {
    el.innerHTML = '<div style="color:var(--muted);padding:10px 0;text-align:center;">No games played yet</div>';
    return;
  }
  el.innerHTML = entries.map((row, i) => {
    return `
      <div class="lb-row">
        <span class="lb-rank ${medals[i]}">${rankDisplay(i)}</span>
        <span class="lb-name">${row.name}</span>
        <span class="lb-date">${row.date}</span>
        <span class="lb-score">${row.score}</span>
      </div>`;
  }).join('');
}

// =================== Game Start ===================
function startGame(fromSave) {
  if (fromSave) {
    const save = getSavedGame();
    if (save?.sequence && save?.active) {
      state = {...save};
    }
  } else {
    state = {
      score: 0,
      streak: 0,
      bestStreak: 0,
      idx: 0,
      correct: 0,
      sequence: shuffle(MATCHES),
      active: true
    };
    clearSavedGame();
  }
  renderMatch();
  showScreen('screen-game');
}

// =================== Game UI Rendering ===================
function renderMatch() {
  const match = state.sequence[state.idx];

  // Score, streak, progress
  document.getElementById('game-score').textContent = state.score;
  document.getElementById('game-streak').textContent = state.streak;
  document.getElementById('game-progress-label').textContent =
    `Match ${state.idx + 1} / ${state.sequence.length}`;
  const pct = Math.round(((state.idx) / state.sequence.length) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';

  // Match info
  document.getElementById('game-badge').textContent = match.stage;
  document.getElementById('game-date').textContent = match.date;
  document.getElementById('game-venue').textContent = match.venue;

  // Teams, flags
  const flagAUrl = getFlagUrl(match.flags?.A);
  const flagBUrl = getFlagUrl(match.flags?.B);
  document.getElementById('team-a-flag').src = flagAUrl;
  document.getElementById('team-a-flag').alt = match.teamA + " flag";
  document.getElementById('team-b-flag').src = flagBUrl;
  document.getElementById('team-b-flag').alt = match.teamB + " flag";
  document.getElementById('team-a-name').textContent = match.teamA;
  document.getElementById('team-b-name').textContent = match.teamB;

  // Draw warning
  const drawWarn = document.getElementById('draw-warning');
  if (match.winner === "D") {
    drawWarn.textContent = "⚠️ Draw: Only a draw guess is correct for this match!";
  } else {
    drawWarn.textContent = "";
  }
  document.getElementById('arena-instruct').textContent = "Pick the winner for this match";

  // Reset cards
  resetCardStates();
  document.getElementById('team-a-card').addEventListener('click', pickAHandler, {once:true});
  document.getElementById('team-b-card').addEventListener('click', pickBHandler, {once:true});
  document.getElementById('team-a-card').setAttribute('aria-pressed','false');
  document.getElementById('team-b-card').setAttribute('aria-pressed','false');
  setSavedGame(state);
}
function resetCardStates() {
  const cardA = document.getElementById('team-a-card');
  const cardB = document.getElementById('team-b-card');
  cardA.className = 'team-card team-card-a';
  cardB.className = 'team-card team-card-b';
  cardA.setAttribute('aria-pressed','false');
  cardB.setAttribute('aria-pressed','false');
  cardA.classList.remove('selected-correct','selected-wrong','disabled');
  cardB.classList.remove('selected-correct','selected-wrong','disabled');
}

// == Pick Handlers ==
function pickAHandler() { pickTeam('A'); }
function pickBHandler() { pickTeam('B'); }

function isPickCorrect(match, pick) {
  if (match.winner === "D") return false;
  return pick === match.winner;
}

function applyCardResultStyles(pickedCard, otherCard, correct) {
  pickedCard.classList.add(correct ? 'selected-correct' : 'selected-wrong');
  otherCard.classList.add('disabled');
}

function revealActualWinner(match, cardA, cardB) {
  const winningCard = match.winner === "A" ? cardA : cardB;
  winningCard.classList.add('selected-correct');
}

function pickTeam(pick) {
  const match = state.sequence[state.idx];
  const cardA = document.getElementById('team-a-card');
  const cardB = document.getElementById('team-b-card');
  cardA.removeEventListener('click', pickAHandler);
  cardB.removeEventListener('click', pickBHandler);

  const correct = isPickCorrect(match, pick);
  const pickedCard = pick === "A" ? cardA : cardB;
  const otherCard = pick === "A" ? cardB : cardA;
  applyCardResultStyles(pickedCard, otherCard, correct);

  if (!correct && match.winner !== "D") {
    revealActualWinner(match, cardA, cardB);
  }

  setTimeout(() => showResult(match, correct, pick), 400);
}

function buildWrongMessage(match) {
  if (match.winner === "D") {
    return "It was a draw! Only draw guesses are accepted.";
  }
  const winningTeam = match.winner === "A" ? match.teamA : match.teamB;
  return `${winningTeam} won this match.`;
}

function applyCorrectOutcome(state) {
  state.score += 10 + state.streak * 2;
  state.streak += 1;
  state.correct += 1;
  if (state.streak > state.bestStreak) state.bestStreak = state.streak;
}

// ======= Result Overlay & Scoring =======
function showResult(match, correct, pick) {
  const overlay = document.getElementById('result-overlay');
  const card = document.getElementById('result-card');
  const icon = document.getElementById('result-icon');
  const title = document.getElementById('result-title');
  const scoreBox = document.getElementById('result-score');
  const msg = document.getElementById('result-message');
  const nextBtn = document.getElementById('result-next-btn');

  card.className = 'result-card' + (correct ? ' correct' : ' wrong');
  icon.textContent = correct ? '⚽' : '❌';
  title.textContent = correct ? 'CORRECT!' : match.winner === "D" ? "DRAW!" : "WRONG!";
  scoreBox.textContent = `${match.teamA} ${match.scoreA} – ${match.scoreB} ${match.teamB}`;
  title.classList.toggle('wrong', !correct);

  if (correct) {
    const streakBefore = state.streak;
    applyCorrectOutcome(state);
    msg.textContent = `+${10 + streakBefore * 2} points • Streak: ${state.streak}`;
    nextBtn.textContent = "Next Match →";
    if (state.streak > 1) confettiBurst();
  } else {
    state.streak = 0;
    msg.textContent = `${buildWrongMessage(match)} Game over!`;
    nextBtn.textContent = "See results";
  }
  overlay.classList.add('show');

  nextBtn.onclick = () => {
    overlay.classList.remove('show');
    if (correct) {
      advanceMatch();
    } else {
      setTimeout(() => endGame(false), 200);
    }
  };
}

// ==== Next Match or End ====
function advanceMatch() {
  state.idx++;
  setSavedGame(state);
  if (state.idx < state.sequence.length) {
    setTimeout(renderMatch, 220);
  } else {
    setTimeout(() => endGame(true), 200);
  }
}

// ========== End Game / Stats ==============
function endGame(perfect) {
  state.active = false;
  clearSavedGame();
  const hsPrev = getHighScore();
  const isNewHS = state.score > hsPrev;
  if (isNewHS) setHighScore(state.score);
  setGamesPlayed(getGamesPlayed() + 1);

  document.getElementById('final-score').textContent = state.score;
  document.getElementById('final-correct').textContent = state.correct;
  document.getElementById('final-streak').textContent = state.bestStreak;

  const subEl = document.getElementById('gameover-sub');
  if (perfect) {
    subEl.textContent = `🏆 Incredible! You predicted all ${state.correct} matches perfectly.`;
  } else {
    subEl.textContent = `You got ${state.correct} match${state.correct !== 1 ? "es" : ""} correct.`;
  }

  const badge = document.getElementById('newhs-badge');
  badge.className = 'newhs-badge' + (isNewHS && state.score > 0 ? ' show' : '');

  showScreen('screen-gameover');

  if (isNewHS && state.score > 0) {
    confettiBurst();
    setTimeout(() => showNameModal(state.score), 700);
  }
}

// ==== Leaderboard Modal ====
let pendingScore = 0;
function showNameModal(score) {
  pendingScore = score;
  document.getElementById('modal-backdrop').classList.add('show');
  document.getElementById('modal-input').focus();
}
function saveToLeaderboard() {
  const input = document.getElementById('modal-input');
  const name = input.value.trim() || "Anonymous";
  let lb = getLeaderboard();
  lb.push({
    name,
    score: pendingScore,
    date: new Date().toLocaleDateString("en-GB", {day:"numeric",month:"short"})
  });
  lb.sort((a, b) => b.score - a.score);
  setLeaderboard(lb.slice(0,10));
  input.value = "";
  document.getElementById('modal-backdrop').classList.remove('show');
  renderStartScreen();
}

// ==== Confetti Animation ====
function confettiBurst() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = Array.from({length:80}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: Math.random() * 10 + 4,
    h: Math.random() * 6 + 2,
    r: Math.random() * Math.PI,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    vr: (Math.random() - 0.5) * 0.13,
    color: ['#FFD700','#FFA500','#00C86A','#00E0FF','#7B61FF','#FF69B4'][Math.floor(Math.random()*6)],
    alpha: 1
  }));
  let frame;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += 0.1;
      p.alpha -= 0.01;
      if (p.y < canvas.height + 20 && p.alpha > 0) alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(draw);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); cancelAnimationFrame(frame); }
  }
  draw();
}

// ========== Event Listeners =========
document.getElementById('btn-start').addEventListener('click', () => startGame(false));
document.getElementById('btn-continue').addEventListener('click', () => startGame(true));
document.getElementById('btn-play-again').addEventListener('click', () => startGame(false));
document.getElementById('btn-home').addEventListener('click', () => {
  renderStartScreen();
  showScreen('screen-start');
});

document.getElementById('modal-save-btn').addEventListener('click', saveToLeaderboard);
document.getElementById('modal-input').addEventListener('keydown', (e) => {
  if (e.key === "Enter") saveToLeaderboard();
});

// Modal close on outside click
document.getElementById('modal-backdrop').addEventListener('mousedown', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove('show');
});

// ===== Initialization =====
renderStartScreen();
showScreen('screen-start');