const params = new URLSearchParams(window.location.search);
const requestedTestType = params.get("type") || "vocabulary";
const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
const toast = document.querySelector("#toast");
const unitCompletePromptKey = `nihongoLoopUnitPrompt:${window.location.search}`;
let toastTimer;
let resumeNoticeShown = false;

const typeMeta = {
  vocabulary: { name: "单词", nameKey: "module.vocabulary", tag: "単語 · Vocabulary", study: "vocabulary.html", storage: "vocabulary" },
  grammar: { name: "语法", nameKey: "module.grammar", tag: "文法 · Grammar", study: "grammar.html", storage: "grammar" },
  reading: { name: "阅读", nameKey: "module.reading", tag: "読解 · Reading", study: "reading.html", storage: "reading" },
  listening: { name: "听力", nameKey: "module.listening", tag: "聴解 · Listening", study: "listening.html", storage: "listening" },
};

const testType = typeMeta[requestedTestType] ? requestedTestType : "vocabulary";
const meta = typeMeta[testType] || typeMeta.vocabulary;

function t(key, params = {}) {
  return window.NihongoI18n?.t(key, params) || key;
}

function metaName() {
  return t(meta.nameKey);
}

const session = {
  level: params.get("level") || savedState[`${testType}Level`] || savedState.level || "N5",
  index: 0,
  questions: [],
  correct: 0,
  answers: [],
  unitIndex: Number(params.get("unit")),
  mistakesOnly: params.get("mistakes") === "1",
  dailyGoal: Number(params.get("goal") || savedState.vocabularyDailyGoal || 30),
  vocabularyTotalWords: 0,
};

const dailyGoalOptions = [10, 20, 30, 50];
if (!dailyGoalOptions.includes(session.dailyGoal)) session.dailyGoal = 30;
if (!Number.isInteger(session.unitIndex) || session.unitIndex < 0) session.unitIndex = null;

function isVocabularyUnitTest() {
  return testType === "vocabulary" && session.unitIndex !== null;
}

function isVocabularyMistakeTest() {
  return testType === "vocabulary" && session.mistakesOnly;
}

function testProgressKey() {
  const unitPart = isVocabularyMistakeTest() ? "mistakes" : isVocabularyUnitTest() ? `unit-${session.unitIndex}-goal-${session.dailyGoal}` : "full";
  return `nihongoLoopTestProgress:${currentUserId}:${testType}:${session.level}:${unitPart}`;
}

function questionIds() {
  return session.questions.map((question) => question.id).join("|");
}

function clearTestProgress() {
  localStorage.removeItem(testProgressKey());
}

function persistTestProgress() {
  if (!session.questions.length || session.index >= session.questions.length) {
    clearTestProgress();
    return;
  }
  localStorage.setItem(
    testProgressKey(),
    JSON.stringify({
      index: session.index,
      correct: session.correct,
      answers: session.answers,
      questionIds: questionIds(),
      updatedAt: new Date().toISOString(),
    }),
  );
}

function restoreTestProgress() {
  try {
    const raw = localStorage.getItem(testProgressKey());
    if (!raw) return false;
    const progress = JSON.parse(raw);
    const sameQuestions = progress.questionIds === questionIds();
    const index = Number(progress.index || 0);
    if (!sameQuestions || index <= 0 || index >= session.questions.length) {
      clearTestProgress();
      return false;
    }
    session.index = index;
    session.correct = Number(progress.correct || 0);
    session.answers = Array.isArray(progress.answers) ? progress.answers : [];
    return true;
  } catch {
    clearTestProgress();
    return false;
  }
}

function advanceAfterAnswer(delay = 700) {
  session.index += 1;
  persistTestProgress();
  window.setTimeout(draw, delay);
}

function vocabularyUnitRange(words) {
  if (!isVocabularyUnitTest()) return { start: 0, end: words.length, words };
  const start = session.unitIndex * session.dailyGoal;
  const end = Math.min(start + session.dailyGoal, words.length);
  return { start, end, words: words.slice(start, end) };
}

function unitLabel() {
  if (isVocabularyMistakeTest()) return "错题本";
  return isVocabularyUnitTest() ? `第 ${session.unitIndex + 1} 单元` : "";
}

function nextVocabularyUnitIndex() {
  if (!isVocabularyUnitTest() || !session.vocabularyTotalWords) return null;
  const nextIndex = session.unitIndex + 1;
  return nextIndex * session.dailyGoal < session.vocabularyTotalWords ? nextIndex : null;
}

function vocabularyStudyHref(unitIndex = session.unitIndex) {
  return `vocabulary.html?level=${encodeURIComponent(session.level)}&unit=${unitIndex}&goal=${session.dailyGoal}`;
}

function vocabularyMistakesHref() {
  return `vocabulary.html?level=${encodeURIComponent(session.level)}#vocabMistakes`;
}

function vocabularyMistakeTestHref() {
  return `test.html?type=vocabulary&level=${encodeURIComponent(session.level)}&mistakes=1`;
}

function nextUnitPromptHtml() {
  if (!isVocabularyUnitTest()) return "";
  const nextIndex = nextVocabularyUnitIndex();
  const isLastUnit = nextIndex === null;
  return `
    <div class="unit-complete-prompt" role="dialog" aria-modal="true" aria-label="单元测验完成">
      <div class="unit-complete-card">
        <span>测验完成</span>
        <h4>${isLastUnit ? `${session.level} 所有单元完成啦` : `要继续第 ${nextIndex + 1} 单元吗？`}</h4>
        <p>${isLastUnit ? "这一等级的单元测验已经做完，可以回到单词页复习错题本或重新选择单元。" : "现在继续会直接进入下一单元学习页，不用再回去慢慢找。"}</p>
        <div class="unit-complete-actions">
          ${
            isLastUnit
              ? `<a class="btn btn-dark" href="${vocabularyMistakesHref()}">回到单词页</a>`
              : `<a class="btn btn-dark" href="${vocabularyStudyHref(nextIndex)}">继续学习第 ${nextIndex + 1} 单元</a>`
          }
          <button class="btn btn-light" type="button" data-close-unit-prompt>先休息</button>
        </div>
      </div>
    </div>
  `;
}

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

function scopedFeatureRecords(featureName) {
  savedState.featureRecords = savedState.featureRecords || {};
  savedState.featureRecords[currentUserId] = savedState.featureRecords[currentUserId] || {};
  savedState.featureRecords[currentUserId][featureName] = savedState.featureRecords[currentUserId][featureName] || {};
  const scopedRecords = savedState.featureRecords[currentUserId][featureName];
  const legacyRecords = savedState.features?.[featureName] || {};
  Object.entries(legacyRecords).forEach(([id, record]) => {
    if (!scopedRecords[id]) scopedRecords[id] = record;
  });
  return scopedRecords;
}

function buildOptions(items, current, key) {
  const others = unique(items.map((item) => item[key]).filter((value) => value !== current[key]));
  return shuffle([current[key], ...shuffle(others).slice(0, 3)]);
}

function normalizeTypedAnswer(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .trim();
}

async function loadVocabularyQuestions() {
  const data = await apiRequest(`/api/vocabulary?userId=${encodeURIComponent(currentUserId)}&level=${encodeURIComponent(session.level)}`);
  const words = data.vocabulary.words;
  session.vocabularyTotalWords = words.length;
  const range = vocabularyUnitRange(words);
  const wrongCount = (word) => Math.max(0, Number(word.attempts || 0) - Number(word.correct || 0));
  const mistakeWords = words.filter((word) => wrongCount(word) > 0 && !word.mastered);
  const scopedWords = isVocabularyMistakeTest() ? mistakeWords : range.words.length ? range.words : words;
  return scopedWords.map((word, index) => {
    if (isVocabularyUnitTest() || isVocabularyMistakeTest()) {
      return {
        id: word.id,
        word: word.word,
        kana: word.kana,
        meaning: word.meaning,
        prompt: word.meaning,
        hint: "听发音，写出日语",
        correct: word.word,
        acceptedAnswers: unique([word.word, word.kana]),
        audioText: word.kana || word.word,
        spelling: true,
        explanation: `正确答案：${word.word}${word.kana && word.kana !== word.word ? `（${word.kana}）` : ""}`,
        save: (correct) => apiRequest("/api/vocabulary/answer", { method: "POST", body: JSON.stringify({ userId: currentUserId, wordId: word.id, correct }) }),
      };
    }
    const zhToJp = index % 2 === 1;
    return {
      id: word.id,
      word: word.word,
      kana: word.kana,
      meaning: word.meaning,
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
    prompt: testType === "reading" ? `${item.sample} ${item.question.text}` : item.question.text,
    hint: item.category,
    audioText: testType === "listening" ? item.sample : "",
    correct: item.question.correct,
    options: item.question.options,
    explanation:
      testType === "reading"
        ? `中文意思：${item.translation || ""} ${item.tip || ""}`
        : "答对了，这个训练点已完成。",
    save: async (correct) => {
      if (correct) {
        const featureRecords = scopedFeatureRecords(testType);
        featureRecords[item.id] = { completed: true, completedAt: new Date().toISOString() };
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
  document.querySelector("#testTitle").textContent = `${session.level} ${metaName()}${isVocabularyUnitTest() || isVocabularyMistakeTest() ? unitLabel() : ""} ${t("common.test")}`;
  document.querySelector("#testCounter").textContent = `${Math.min(session.index + 1, total)} / ${total}`;
  document.querySelector("#testProgress").style.width = `${percent}%`;
  if (!question) {
    clearTestProgress();
    const missed = session.answers.filter((item) => !item.correct);
    const learned = session.answers.filter((item) => item.correct);
    const accuracy = total ? Math.round((session.correct / total) * 100) : 0;
    document.querySelector("#testProgress").style.width = "100%";
    document.querySelector("#testContent").innerHTML = `
      <div class="test-result">
        <strong>${session.correct}/${total}</strong>
        <h3>${isVocabularyUnitTest() || isVocabularyMistakeTest() ? `${unitLabel()}测验完成` : "测验完成"}</h3>
        <p>${
          isVocabularyMistakeTest()
            ? total
              ? `错题复习完成：本次答对 ${learned.length} 个，仍需复习 ${missed.length} 个。答对的单词会更新记录，掌握后会离开错题本。`
              : `当前 ${session.level} 没有需要复习的错题，可以先回到单词页继续学习或做单元测验。`
            : isVocabularyUnitTest()
              ? `本单元背会 ${learned.length} 个，待复习 ${missed.length} 个。答错的单词已经进入错题本，下次可以继续查看。`
              : `你已经完成 ${session.level} ${metaName()}测验，可以回到学习页继续复习。`
        }</p>
        ${
          isVocabularyUnitTest() || isVocabularyMistakeTest()
            ? `<div class="test-result-metrics">
                <div><b>${learned.length}</b><span>本次背会</span></div>
                <div><b>${missed.length}</b><span>待复习</span></div>
                <div><b>${accuracy}%</b><span>正确率</span></div>
              </div>
              ${
                missed.length
                  ? `<div class="test-review-list">
                      <span>进入错题本的单词</span>
                      ${missed
                        .map((item) => `<em>${escapeHtml(item.word)} · ${escapeHtml(item.meaning)}</em>`)
                        .join("")}
                    </div>`
                  : `<div class="test-review-list clear"><span>这一单元没有错题</span><em>很稳，可以进入下一个单元。</em></div>`
              }`
            : ""
        }
        <div class="hero-actions">
          <a class="btn btn-dark" href="${meta.study}">返回学习</a>
          ${isVocabularyUnitTest() && nextVocabularyUnitIndex() !== null ? `<a class="btn btn-red" href="${vocabularyStudyHref(nextVocabularyUnitIndex())}">继续第 ${nextVocabularyUnitIndex() + 1} 单元</a>` : ""}
          ${isVocabularyUnitTest() || isVocabularyMistakeTest() ? `<a class="btn btn-light" href="${vocabularyMistakesHref()}">查看错题本</a>` : ""}
          ${isVocabularyMistakeTest() && total ? `<a class="btn btn-light" href="${vocabularyMistakeTestHref()}">再做错题测试</a>` : ""}
          <button class="btn btn-light" type="button" id="restartTest">再测一次</button>
        </div>
        ${nextUnitPromptHtml()}
      </div>
    `;
    document.querySelector("#restartTest").addEventListener("click", () => {
      clearTestProgress();
      setLevel(session.level, { reset: true });
    });
    document.querySelector("[data-close-unit-prompt]")?.addEventListener("click", () => {
      document.querySelector(".unit-complete-prompt")?.remove();
      sessionStorage.setItem(unitCompletePromptKey, "closed");
    });
    if (isVocabularyUnitTest() && sessionStorage.getItem(unitCompletePromptKey) === "closed") {
      document.querySelector(".unit-complete-prompt")?.remove();
    }
    return;
  }
  if (question.spelling) {
    document.querySelector("#testContent").innerHTML = `
      <div class="test-question-only spelling-quiz">
        <div class="audio-panel spelling-audio">
          <div>
            <span>${escapeHtml(question.hint)}</span>
            <strong>先听发音，再写出日语</strong>
          </div>
          <button class="btn btn-dark" type="button" data-play-audio="${escapeHtml(question.audioText)}">播放发音</button>
        </div>
        <span>中文意思</span>
        <h3>${escapeHtml(question.prompt)}</h3>
        <form class="spelling-form" data-spelling-form>
          <label>
            日语答案
            <input type="text" data-spelling-answer autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入日语、假名或汉字" />
          </label>
          <button class="btn btn-red" type="submit">提交答案</button>
        </form>
        <p id="testFeedback">可以输入汉字写法，也可以输入假名。</p>
      </div>
    `;
    const playButton = document.querySelector("[data-play-audio]");
    const answerInput = document.querySelector("[data-spelling-answer]");
    const form = document.querySelector("[data-spelling-form]");
    const playCurrentAudio = () => {
      speakJapanese(question.audioText);
      if (playButton) playButton.textContent = "重播发音";
    };
    playButton?.addEventListener("click", playCurrentAudio);
    window.setTimeout(playCurrentAudio, 180);
    answerInput?.focus();
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const userAnswer = normalizeTypedAnswer(answerInput.value);
      if (!userAnswer) {
        showToast("先写下你的答案");
        answerInput.focus();
        return;
      }
      const accepted = (question.acceptedAnswers || [question.correct]).map(normalizeTypedAnswer);
      const correct = accepted.includes(userAnswer);
      session.answers.push({
        id: question.id,
        word: question.word,
        meaning: question.meaning,
        correct,
      });
      form.classList.add(correct ? "correct" : "wrong");
      answerInput.disabled = true;
      form.querySelector("button").disabled = true;
      document.querySelector("#testFeedback").textContent = correct ? `答对了。${question.explanation}` : `还差一点。${question.explanation}`;
      if (correct) session.correct += 1;
      advanceAfterAnswer(correct ? 850 : 1300);
      question.save(correct).catch(() => {
        // Keep the test moving even if backend is unavailable.
      });
    });
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
      session.answers.push({
        id: question.id,
        word: question.word || question.prompt,
        meaning: question.meaning || question.correct,
        correct,
      });
      button.classList.add(correct ? "correct" : "wrong");
      document.querySelector("#testFeedback").textContent = correct
        ? question.explanation || "答对了。"
        : question.explanation
          ? `答案不对。${question.explanation}`
          : "答案不对，先记下错因，下一题继续。";
      document.querySelectorAll("[data-test-answer]").forEach((item) => (item.disabled = true));
      if (correct) session.correct += 1;
      advanceAfterAnswer(700);
      question.save(correct).catch(() => {
        // Keep the test moving even if backend is unavailable.
      });
    });
  });
}

async function setLevel(level, options = {}) {
  session.level = level;
  session.index = 0;
  session.correct = 0;
  session.answers = [];
  resumeNoticeShown = false;
  if (options.reset) clearTestProgress();
  document.querySelectorAll("[data-test-level]").forEach((button) => {
    button.classList.toggle("active", button.dataset.testLevel === level);
  });
  document.querySelector("#testContent").innerHTML = `<div class="vocab-loading"><strong>正在载入 ${level} 测验</strong><span>准备题目中。</span></div>`;
  saveLevel();
  session.questions = await loadQuestions();
  if (!options.reset && restoreTestProgress() && !resumeNoticeShown) {
    resumeNoticeShown = true;
    showToast(`已从第 ${session.index + 1} 题继续`);
  }
  draw();
}

document.querySelector("#testHeading").textContent = `${metaName()} ${t("common.test")}`;
document.querySelector("#testLead").textContent = t("test.lead");
document.querySelector("#testTag").textContent = meta.tag;
document.querySelector("#testStatus").textContent = `${metaName()} ${t("common.test")}`;
document.querySelector("#backToStudyLink").href = meta.study;
document.querySelectorAll("[data-test-level]").forEach((button) => {
  button.addEventListener("click", () => setLevel(button.dataset.testLevel));
});

setLevel(session.level);

window.addEventListener("nihongo:languagechange", () => {
  document.querySelector("#testHeading").textContent = `${metaName()} ${t("common.test")}`;
  document.querySelector("#testLead").textContent = t("test.lead");
  document.querySelector("#testStatus").textContent = `${metaName()} ${t("common.test")}`;
  draw();
});
