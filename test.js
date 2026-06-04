const params = new URLSearchParams(window.location.search);
const testType = params.get("type") || "vocabulary";
const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
const toast = document.querySelector("#toast");
let toastTimer;

const typeMeta = {
  vocabulary: { name: "单词", tag: "単語 · Vocabulary", study: "vocabulary.html", storage: "vocabulary" },
  grammar: { name: "语法", tag: "文法 · Grammar", study: "grammar.html", storage: "grammar" },
  reading: { name: "阅读", tag: "読解 · Reading", study: "reading.html", storage: "reading" },
  listening: { name: "听力", tag: "聴解 · Listening", study: "listening.html", storage: "listening" },
  exam: { name: "等级考试模拟", tag: "試験 · Mock Exam", study: "exam.html", storage: "exam" },
};

const meta = typeMeta[testType] || typeMeta.vocabulary;
const session = {
  level: params.get("level") || savedState[`${testType}Level`] || savedState.level || "N5",
  index: 0,
  questions: [],
  correct: 0,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function speakJapanese(text) {
  if (!text) return;
  if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
    showToast("当前浏览器暂不支持语音播放");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = testType === "listening" ? 0.78 : 0.86;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.message || "请求失败");
  return data;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildOptions(items, current, key) {
  const others = unique(items.map((item) => item[key]).filter((value) => value !== current[key]));
  return shuffle([current[key], ...shuffle(others).slice(0, 3)]);
}

async function loadVocabularyQuestions() {
  const data = await apiRequest(`/api/vocabulary?userId=${encodeURIComponent(currentUserId)}&level=${encodeURIComponent(session.level)}`);
  const words = data.vocabulary.words;
  return words.map((word, index) => {
    const zhToJp = index % 2 === 1;
    return {
      id: word.id,
      prompt: zhToJp ? word.meaning : word.word,
      hint: zhToJp ? "选择对应日语" : word.kana,
      correct: zhToJp ? word.word : word.meaning,
      options: buildOptions(words, word, zhToJp ? "word" : "meaning"),
      save: (correct) => apiRequest("/api/vocabulary/answer", { method: "POST", body: JSON.stringify({ userId: currentUserId, wordId: word.id, correct }) }),
    };
  });
}

async function loadGrammarQuestions() {
  const data = await apiRequest(`/api/grammar?userId=${encodeURIComponent(currentUserId)}&level=${encodeURIComponent(session.level)}`);
  return data.grammar.points.map((point) => ({
    id: point.id,
    prompt: point.miniQuestion.question,
    hint: point.pattern,
    correct: point.miniQuestion.correct,
    options: point.miniQuestion.options,
    explanation: point.miniQuestion.explanation,
    save: (correct) => apiRequest("/api/grammar/answer", { method: "POST", body: JSON.stringify({ userId: currentUserId, grammarId: point.id, correct }) }),
  }));
}

async function loadFeatureQuestions() {
  const response = await fetch("data/features.json");
  const data = await response.json();
  const feature = data[testType];
  const items = feature.levels[session.level] || [];
  return items.map((item) => ({
    id: item.id,
    prompt: item.question.text,
    hint: item.category,
    audioText: testType === "listening" ? item.sample : "",
    correct: item.question.correct,
    options: item.question.options,
    explanation: "答对了，这个训练点已完成。",
    save: async (correct) => {
      if (correct) {
        savedState.features = savedState.features || {};
        savedState.features[testType] = savedState.features[testType] || {};
        savedState.features[testType][item.id] = { completed: true, completedAt: new Date().toISOString() };
        localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
      }
      try {
        await apiRequest("/api/progress", {
          method: "PATCH",
          body: JSON.stringify({ userId: currentUserId, activeModule: meta.name, completedModule: correct ? meta.name : "", level: session.level }),
        });
      } catch {
        // Local progress is enough for static mode.
      }
    },
  }));
}

async function loadQuestions() {
  if (testType === "vocabulary") return loadVocabularyQuestions();
  if (testType === "grammar") return loadGrammarQuestions();
  return loadFeatureQuestions();
}

function saveLevel() {
  savedState[`${testType}Level`] = session.level;
  if (testType === "vocabulary") savedState.level = session.level;
  localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
}

function draw() {
  const total = session.questions.length;
  const question = session.questions[session.index];
  const percent = total ? Math.round((session.index / total) * 100) : 0;
  document.querySelector("#testTitle").textContent = `${session.level} ${meta.name}测验`;
  document.querySelector("#testCounter").textContent = `${Math.min(session.index + 1, total)} / ${total}`;
  document.querySelector("#testProgress").style.width = `${percent}%`;
  if (!question) {
    document.querySelector("#testProgress").style.width = "100%";
    document.querySelector("#testContent").innerHTML = `
      <div class="test-result">
        <strong>${session.correct}/${total}</strong>
        <h3>测验完成</h3>
        <p>你已经完成 ${session.level} ${meta.name}测验，可以回到学习页继续复习。</p>
        <div class="hero-actions">
          <a class="btn btn-dark" href="${meta.study}">返回学习</a>
          <button class="btn btn-light" type="button" id="restartTest">再测一次</button>
        </div>
      </div>
    `;
    document.querySelector("#restartTest").addEventListener("click", () => setLevel(session.level));
    return;
  }
  document.querySelector("#testContent").innerHTML = `
    <div class="test-question-only">
      ${
        question.audioText
          ? `<div class="audio-panel">
              <div>
                <span>听力音频</span>
                <strong>先听音频，再选择答案</strong>
              </div>
              <button class="btn btn-dark" type="button" data-play-audio="${escapeHtml(question.audioText)}">播放音频</button>
            </div>`
          : ""
      }
      <span>${escapeHtml(question.hint)}</span>
      <h3>${escapeHtml(question.prompt)}</h3>
      <div class="test-options">
        ${question.options.map((option) => `<button type="button" data-test-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
      </div>
      <p id="testFeedback">请选择答案。</p>
    </div>
  `;
  document.querySelectorAll("[data-play-audio]").forEach((button) => {
    button.addEventListener("click", () => {
      speakJapanese(button.dataset.playAudio);
      button.textContent = "重播音频";
    });
  });
  document.querySelectorAll("[data-test-answer]").forEach((button) => {
    button.addEventListener("click", async () => {
      const correct = button.dataset.testAnswer === question.correct;
      button.classList.add(correct ? "correct" : "wrong");
      document.querySelector("#testFeedback").textContent = correct ? question.explanation || "答对了。" : "答案不对，先记下错因，下一题继续。";
      document.querySelectorAll("[data-test-answer]").forEach((item) => (item.disabled = true));
      if (correct) session.correct += 1;
      try {
        await question.save(correct);
      } catch {
        // Keep the test moving even if backend is unavailable.
      }
      window.setTimeout(() => {
        session.index += 1;
        draw();
      }, 700);
    });
  });
}

async function setLevel(level) {
  session.level = level;
  session.index = 0;
  session.correct = 0;
  document.querySelectorAll("[data-test-level]").forEach((button) => {
    button.classList.toggle("active", button.dataset.testLevel === level);
  });
  document.querySelector("#testContent").innerHTML = `<div class="vocab-loading"><strong>正在载入 ${level} 测验</strong><span>准备题目中。</span></div>`;
  saveLevel();
  session.questions = await loadQuestions();
  draw();
}

document.querySelector("#testHeading").textContent = `${meta.name}测验`;
document.querySelector("#testLead").textContent = "这里是独立测验页面，不显示学习讲解内容。";
document.querySelector("#testTag").textContent = meta.tag;
document.querySelector("#testStatus").textContent = `${meta.name}测验`;
document.querySelector("#backToStudyLink").href = meta.study;
document.querySelectorAll("[data-test-level]").forEach((button) => {
  button.addEventListener("click", () => setLevel(button.dataset.testLevel));
});

setLevel(session.level);
