// =============================================
// 문제별 힌트 글자 & 슬롯 위치 설정
// letter: 힌트로 보여줄 글자 (섞인 순서)
// slot:   최종 정답 칸 위치 (0~7, 왼쪽부터)
// 슬롯 0~7 = ㅊ ㅓ ㅁ ㅅ ㅓ ㅇ ㄷ ㅐ 순서로 고정
// =============================================
const questionMap = [
  { letter: 'ㅅ', slot: 3 },  // Q1 대릉원 Q1
  { letter: 'ㄷ', slot: 6 },  // Q2 대릉원 Q2
  { letter: 'ㅓ', slot: 1 },  // Q3 첨성대 Q1
  { letter: 'ㅊ', slot: 0 },  // Q4 첨성대 Q2
  { letter: 'ㅐ', slot: 7 },  // Q5 계림 Q1
  { letter: 'ㅁ', slot: 2 },  // Q6 계림 Q2
  { letter: 'ㅇ', slot: 5 },  // Q7 소품샵 Q1
  { letter: 'ㅓ', slot: 4 },  // Q8 소품샵 Q2
];

// =============================================
// 정답 설정 — 수정이 필요하면 여기서만 바꾸세요
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

// =============================================
// 지도 스테이지 정보
// =============================================
const mapStages = [
  { id: 1, label: '대릉원',   x: 130, y: 130 },
  { id: 2, label: '첨성대',   x: 278, y: 148 },
  { id: 3, label: '계림',     x: 296, y: 252 },
  { id: 4, label: '황리단길', x: 130, y: 192 },
];

// =============================================
// 상태 관리
// =============================================
const collected = {};
const stageHints = { 1:[null,null], 2:[null,null], 3:[null,null], 4:[null,null] };
const stageCleared = { 1:false, 2:false, 3:false, 4:false };

// =============================================
// 헬퍼
// =============================================
function getStageAndPos(qNum) {
  return { stage: Math.ceil(qNum / 2), pos: qNum % 2 === 0 ? 1 : 0 };
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
  const { letter, slot } = questionMap[qNum - 1];

  const ok = answers[qNum].accept.some(
    a => val.replace(/\s/g,'').toLowerCase() === a.replace(/\s/g,'').toLowerCase()
  );

  if (ok) {
    input.classList.add('correct');
    fbEl.className = 'feedback correct';
    fbEl.textContent = '✓ 정답입니다!';
    collected[qNum] = true;
    updateSlot(slot, letter);
    updateStageHint(stage, pos, letter);
    updateProgress();
    checkStageCleared(stage);
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
function updateSlot(slot, letter) {
  const slotEl = document.getElementById(`slot${slot}`);
  slotEl.textContent = letter;
  slotEl.classList.add('filled');
}

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

function checkStageCleared(stage) {
  const q1 = (stage - 1) * 2 + 1;
  const q2 = q1 + 1;
  if (collected[q1] && collected[q2]) {
    stageCleared[stage] = true;
    updateMap();
  }
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
  [1,2,3,4].forEach(n => {
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
  // 잠깐 반짝이고 축하 화면으로 이동
  document.getElementById('finalBtn').textContent = '🌸 정답 공개 중...';
  document.getElementById('finalBtn').style.opacity = '0.6';
  setTimeout(() => {
    window.location.href = 'congrats.html';
  }, 800);
}

// =============================================
// 미니 지도
// =============================================
function buildMap() {
  const svg = document.getElementById('miniMap');
  const ns = 'http://www.w3.org/2000/svg';

  // 이동 경로선
  const pathD = mapStages.map((s, i) => `${i === 0 ? 'M' : 'L'}${s.x},${s.y}`).join(' ');
  const pathEl = document.createElementNS(ns, 'path');
  pathEl.setAttribute('d', pathD);
  pathEl.setAttribute('fill', 'none');
  pathEl.setAttribute('stroke', '#8b7355');
  pathEl.setAttribute('stroke-width', '1.5');
  pathEl.setAttribute('stroke-dasharray', '4 3');
  svg.appendChild(pathEl);

  // 스테이지 노드
  mapStages.forEach(s => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('id', `mapNode${s.id}`);
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => {
      toggleStage(s.id);
      document.getElementById(`stage${s.id}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // 원
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', s.x);
    circle.setAttribute('cy', s.y);
    circle.setAttribute('r', '16');
    circle.setAttribute('fill', '#3d2b1f');
    circle.setAttribute('stroke', '#8b7355');
    circle.setAttribute('stroke-width', '1.5');
    circle.setAttribute('id', `mapCircle${s.id}`);
    circle.style.transition = 'fill 0.4s, stroke 0.4s';

    // 숫자
    const num = document.createElementNS(ns, 'text');
    num.setAttribute('x', s.x);
    num.setAttribute('y', s.y + 4);
    num.setAttribute('text-anchor', 'middle');
    num.setAttribute('font-size', '11');
    num.setAttribute('fill', '#c4a882');
    num.setAttribute('font-family', 'Gowun Batang, serif');
    num.textContent = s.id;

    // 라벨 (노드 위쪽에 표시)
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', s.x);
    label.setAttribute('y', s.y - 22);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '10');
    label.setAttribute('fill', '#d4a843');
    label.setAttribute('font-family', 'Noto Serif KR, serif');
    label.setAttribute('font-weight', '600');
    label.textContent = s.label;

    g.appendChild(circle);
    g.appendChild(num);
    g.appendChild(label);
    svg.appendChild(g);
  });
}

function updateMap() {
  mapStages.forEach(s => {
    if (!stageCleared[s.id]) return;
    const circle = document.getElementById(`mapCircle${s.id}`);
    if (circle) {
      circle.setAttribute('fill', '#8b7355');
      circle.setAttribute('stroke', '#d4a843');
      circle.setAttribute('stroke-width', '2');
    }
  });
}

// =============================================
// 별 생성
// =============================================
function initStars() {
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 1;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*3}s;--delay:${Math.random()*3}s`;
    starsEl.appendChild(s);
  }
}

// =============================================
// 초기화
// =============================================
initStars();
buildMap();
toggleStage(1);
