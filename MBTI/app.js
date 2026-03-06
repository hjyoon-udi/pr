const questions = [
  // E / I
  {
    dimension: "EI",
    text: "휴식을 할 때 나는...",
    options: [
      { text: "사람들을 만나서 수다 떨며 에너지를 충전한다.", value: "E" },
      { text: "혼자 조용히 보내야 에너지가 회복된다.", value: "I" }
    ]
  },
  {
    dimension: "EI",
    text: "새로운 모임에 가면 나는...",
    options: [
      { text: "먼저 말을 걸고 분위기를 띄우는 편이다.", value: "E" },
      { text: "상황을 살피며 천천히 적응하는 편이다.", value: "I" }
    ]
  },
  // S / N
  {
    dimension: "SN",
    text: "일을 할 때 나는...",
    options: [
      { text: "지금 눈앞의 사실과 현실적인 부분을 먼저 본다.", value: "S" },
      { text: "미래 가능성과 전체적인 그림부터 떠올린다.", value: "N" }
    ]
  },
  {
    dimension: "SN",
    text: "설명을 들을 때 나는...",
    options: [
      { text: "예시와 구체적인 사례가 있으면 이해가 잘 된다.", value: "S" },
      { text: "핵심 개념과 아이디어 위주로 듣는 편이다.", value: "N" }
    ]
  },
  // T / F
  {
    dimension: "TF",
    text: "의사결정을 할 때 나는...",
    options: [
      { text: "논리와 기준을 세우고 최대한 객관적으로 판단한다.", value: "T" },
      { text: "사람들의 감정과 관계에 미치는 영향을 더 고려한다.", value: "F" }
    ]
  },
  {
    dimension: "TF",
    text: "친구가 고민을 털어놓으면 나는...",
    options: [
      { text: "문제 해결 방법과 현실적인 조언을 먼저 생각한다.", value: "T" },
      { text: "먼저 공감해 주고 감정을 들어주는 편이다.", value: "F" }
    ]
  },
  // J / P
  {
    dimension: "JP",
    text: "여행을 갈 때 나는...",
    options: [
      { text: "일정과 동선을 미리 꼼꼼하게 계획해 둔다.", value: "J" },
      { text: "대략적인 방향만 정해두고, 상황에 따라 움직인다.", value: "P" }
    ]
  },
  {
    dimension: "JP",
    text: "마감이 다가오면 나는...",
    options: [
      { text: "미리 조금씩 해두어 여유 있게 끝내려고 한다.", value: "J" },
      { text: "마감 직전에 집중이 확 되어서 한 번에 끝낸다.", value: "P" }
    ]
  }
];

const descriptions = {
  INTJ: "독립적이고 전략적인 계획러 타입으로, 구조 잡기와 장기적인 그림 그리기에 강합니다.",
  INTP: "호기심 많은 분석가 타입으로, 아이디어를 탐구하고 이해하는 것을 좋아합니다.",
  ENTJ: "목표 지향적인 리더 타입으로, 효율적으로 판을 짜고 추진하는 데 강점이 있습니다.",
  ENTP: "아이디어 뱅크형 토론가 타입으로, 새롭고 재치 있는 발상을 즐깁니다.",
  INFJ: "통찰력 있는 조언자 타입으로, 타인의 성장을 돕고 의미를 추구합니다.",
  INFP: "가치 지향적인 이상가 타입으로, 자신의 신념과 진정성을 중시합니다.",
  ENFJ: "사람 중심의 리더 타입으로, 조화로운 분위기를 만들고 이끄는 데 능합니다.",
  ENFP: "열정적인 활동가 타입으로, 가능성을 보고 사람들에게 에너지를 전파합니다.",
  ISTJ: "신뢰할 수 있는 관리자 타입으로, 책임감 있고 계획적으로 일을 처리합니다.",
  ISFJ: "헌신적인 보호자 타입으로, 주변 사람들을 세심하게 챙기는 편입니다.",
  ESTJ: "현실적인 실행가 타입으로, 조직화와 관리 능력이 뛰어납니다.",
  ESFJ: "분위기 메이커 조정자 타입으로, 타인의 필요를 잘 파악하고 도와줍니다.",
  ISTP: "차분한 해결사 타입으로, 문제 상황에서 유연하게 대처합니다.",
  ISFP: "따뜻한 예술가 타입으로, 조용하지만 감수성이 풍부합니다.",
  ESTP: "즉흥적인 활동가 타입으로, 현장에서 직접 부딪치며 배우는 것을 선호합니다.",
  ESFP: "즐거운 분위기를 만드는 엔터테이너 타입으로, 경험을 통해 삶을 즐깁니다."
};

let currentIndex = 0;
const answers = new Array(questions.length).fill(null);

const questionContainer = document.getElementById("question-container");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const questionSection = document.getElementById("question-section");
const resultSection = document.getElementById("result-section");
const resultMbti = document.getElementById("result-mbti");
const resultDescription = document.getElementById("result-description");
const resultScores = document.getElementById("result-scores");
const retryBtn = document.getElementById("retry-btn");
const historyList = document.getElementById("history-list");

function renderQuestion() {
  const q = questions[currentIndex];

  questionContainer.innerHTML = `
    <h2 class="question-title">${q.text}</h2>
    <div class="options">
      ${q.options
        .map(
          (opt, idx) => `
        <label class="option ${answers[currentIndex] === opt.value ? "selected" : ""}">
          <input
            type="radio"
            name="q${currentIndex}"
            value="${opt.value}"
            data-index="${currentIndex}"
          />
          <span class="option-label">${opt.text}</span>
        </label>
      `
        )
        .join("")}
    </div>
  `;

  const radios = questionContainer.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      answers[currentIndex] = e.target.value;
      const labels = questionContainer.querySelectorAll(".option");
      labels.forEach((label) => label.classList.remove("selected"));
      e.target.closest(".option").classList.add("selected");
      nextBtn.disabled = false;
      updateNextButtonText();
    });
  });

  updateProgress();
  updateNavigationButtons();
}

function updateProgress() {
  progressText.textContent = `${currentIndex + 1} / ${questions.length} 문항`;
  const percent = ((currentIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${percent}%`;
}

function updateNavigationButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = answers[currentIndex] === null;
  updateNextButtonText();
}

function updateNextButtonText() {
  if (currentIndex === questions.length - 1) {
    nextBtn.textContent = "결과 보기";
  } else {
    nextBtn.textContent = "다음";
  }
}

function calculateResult() {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  };

  answers.forEach((value, index) => {
    if (!value) return;
    const dim = questions[index].dimension;
    if (dim === "EI") scores[value] += 1;
    if (dim === "SN") scores[value] += 1;
    if (dim === "TF") scores[value] += 1;
    if (dim === "JP") scores[value] += 1;
  });

  const mbti =
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P");

  return { mbti, scores };
}

function showResult() {
  const { mbti, scores } = calculateResult();
  resultMbti.textContent = mbti;

  resultDescription.textContent =
    descriptions[mbti] ??
    "여러 지표가 비슷한 비율로 나와서, 특정 한 유형으로 딱 떨어지지 않는 경향이 있습니다.";

  resultScores.innerHTML = `
    <li>E vs I: ${scores.E} : ${scores.I}</li>
    <li>S vs N: ${scores.S} : ${scores.N}</li>
    <li>T vs F: ${scores.T} : ${scores.F}</li>
    <li>J vs P: ${scores.J} : ${scores.P}</li>
  `;

  // 최근 결과를 로컬 스토리지에 저장 (최대 5개)
  const now = new Date();
  const stamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  let history = [];
  try {
    const raw = localStorage.getItem("mbtiHistory");
    if (raw) history = JSON.parse(raw);
  } catch (e) {
    history = [];
  }

  history.unshift({ mbti, time: stamp });
  history = history.slice(0, 5);
  localStorage.setItem("mbtiHistory", JSON.stringify(history));

  historyList.innerHTML = history
    .map((item, idx) =>
      idx === 0
        ? `<li><strong>이번</strong> · ${item.time} · ${item.mbti}</li>`
        : `<li>이전 · ${item.time} · ${item.mbti}</li>`
    )
    .join("");

  questionSection.classList.add("card-hidden");
  resultSection.classList.remove("card-hidden");
}

function resetQuiz() {
  for (let i = 0; i < answers.length; i += 1) {
    answers[i] = null;
  }
  currentIndex = 0;

  questionSection.classList.remove("card-hidden");
  resultSection.classList.add("card-hidden");

  renderQuestion();
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (answers[currentIndex] === null) return;

  if (currentIndex === questions.length - 1) {
    showResult();
  } else {
    currentIndex += 1;
    renderQuestion();
  }
});

retryBtn.addEventListener("click", resetQuiz);

renderQuestion();

