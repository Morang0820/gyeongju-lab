// =============================================
// 정답 설정 — 수정이 필요한 경우 여기서만 바꾸세요
// =============================================
const answers = {
  1: { accept: ['천마총'] },
  2: { accept: ['왕의 무덤', '왕의무덤', '왕릉', '무덤'] },
  3: { accept: ['27', '27단'] },
  4: { accept: ['선덕여왕', '선덕'] },
  5: { accept: ['김알지'] },
  6: { accept: ['닭', '계'] },
  7: { accept: ['초록', '초록색', '녹색'] }, // ⚠️ 현장 확인 후 수정!
  8: { accept: ['황남동', '황남'] }
};

// 힌트 글자 순서 (첨성대 자음/모음 분리)
const letters = ['ㅊ', 'ㅓ', 'ㅁ', 'ㅅ', 'ㅓ', 'ㅇ', 'ㄷ', 'ㅐ'];

// =============================================
// 상태 관리
// =============================================
const collected = {};
const stageHints = { 1: [null, null], 2: [null, null], 3: [null, null], 4: [null, null] };

// =============================================
// 헬퍼 함수
// =============================================
function getStageAndPos(qNum) {
  const stage = Math.ceil(qNum / 2);
  const pos = (qNum % 2 === 0) ? 1 : 0;
  return { stage, pos };
}

function getFbId(qNum) {
  const { stage, pos } = getStageAndPos(qNum);
  return `fb${stage}${pos === 0 ? 'a' : 'b'}`;
}

// =============================================
// 정답 확인
// =============================================
function checkAnswer(qNum, inputId) {
  if (collected[qNum]) return;

  const input = document.getElementById(inputId);
  const val = input.value.trim();
  if (!val) return;

  const fbEl = document.getElementById(getFbId(qNum));
  const { stage, pos } = getStageAndPos(qNum);
  const letter = letters[qNum - 1];

  const ok = answers[qNum].accept.some(
    a => val.replace(/\s/g, '').toLowerCase() === a.replace(/\s/g, '').toLowerCase()
  );

  if (ok) {
    input.classList.add('correct');
    fbEl.className = 'feedback correct';
    fbEl.textContent = '✓ 정답입니다!';
    collected[qNum] = letter;
    updateSlot(qNum - 1, letter);
    updateStageHint(stage, pos, letter);
    updateProgress();
  } else {
    input.classList.add('wrong');
    fbEl.className = 'feedback wrong';
    fbEl.textContent = '✗ 다시 생각해보세요';
    setTimeout(() => {
      input.classList.remove('wrong');
      fbEl.textContent = '';
    }, 1500);
  }
}

// =============================================
// UI 업데이트
// =============================================
function updateStageHint(stage, pos, letter) {
  stageHints[stage][pos] = letter;
  const hints = stageHints[stage].filter(Boolean);

  if (hints.length > 0) {
    const card = document.getElementById(`hint${stage}`);
    const lettersEl = document.getElementById(`hintLetters${stage}`);
    card.classList.add('show');
    lettersEl.innerHTML = '';
    hints.forEach((l, i) => {
      const el = document.createElement('div');
      el.className = 'hint-letter';
      el.style.animationDelay = i * 0.1 + 's';
      el.textContent = l;
      lettersEl.appendChild(el);
    });
    if (hints.length === 2) {
      document.getElementById(`num${stage}`).classList.add('done');
    }
  }
}

function updateSlot(idx, letter) {
  const slot = document.getElementById(`slot${idx}`);
  slot.textContent = letter;
  slot.classList.add('filled');
}

function updateProgress() {
  const count = Object.keys(collected).length;
  document.getElementById('progressBar').style.width = (count / 8 * 100) + '%';
  document.getElementById('progressText').textContent = `${count} / 8 단서 수집`;
}

function toggleStage(num) {
  const body = document.getElementById(`body${num}`);
  const arrow = document.getElementById(`arrow${num}`);
  const isOpen = body.classList.contains('open');
  [1, 2, 3, 4].forEach(n => {
    document.getElementById(`body${n}`).classList.remove('open');
    document.getElementById(`arrow${n}`).classList.remove('open');
  });
  if (!isOpen) {
    body.classList.add('open');
    arrow.classList.add('open');
  }
}

function showFinal() {
  const count = Object.keys(collected).length;
  if (count < 8) {
    alert(`아직 ${8 - count}개의 단서가 남아있어요!`);
    return;
  }
  document.getElementById('finalReveal').classList.add('show');
  document.getElementById('finalBtn').style.display = 'none';
}

// =============================================
// 초기화
// =============================================
function initStars() {
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 1;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;--d:${2 + Math.random() * 3}s;--delay:${Math.random() * 3}s`;
    starsEl.appendChild(s);
  }
}

initStars();
toggleStage(1);
