const toast = document.querySelector("#toast");
const statusBadge = document.querySelector("#vocabServiceStatus");
let toastTimer;

const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
const params = new URLSearchParams(window.location.search);
let initialUnitApplied = false;
let isEditingPlan = false;

function t(key, params = {}) {
  return window.NihongoI18n?.t(key, params) || key;
}

function isEnglish() {
  return window.NihongoI18n?.currentLanguage?.() === "en";
}

function vocabText(key, params = {}) {
  const en = {
    planAria: "Choose vocabulary study plan",
    wordPlan: "{level} vocabulary plan",
    chooseGoal: "Choose words per unit first",
    planIntro: "Each account only needs to choose once. After that, this page shows that number of words and resumes from where you stopped.",
    wordsPerUnit: "words/unit",
    changeLater: "You can change it later from “Edit study plan”.",
    mastered: "Mastered",
    review: "Review",
    viewed: "Finished",
    learning: "Learning",
    new: "Not started",
    unitCompleteConfirm: "You finished studying {count} words in this unit. Start Unit {unit} quiz now?",
    stayStudy: "Staying on the study page. You can start the unit quiz later.",
    unitProgressTitle: "{level} unit progress",
    unitProgressLead: "Each unit now shows compact progress instead of a long word list. Tap a unit card to continue.",
    words: "words",
    unit: "Unit {unit}",
    seen: "seen",
    know: "known",
    notStudiedShort: "new",
    quiz: "Quiz",
    study: "Study",
    mistakeBook: "{level} mistake book",
    mistakeCount: "{count} words to review",
    mistakeLead: "Collapsed by default. Open it to review mistakes. Mark words as mastered or answer them correctly to remove them.",
    expandMistakes: "Open mistake book",
    collapseMistakes: "Close mistake book",
    mistakeQuiz: "Start mistake review quiz",
    mistakeScope: "Only tests unmastered mistakes in this level.",
    wrongRight: "Wrong {wrong} · Correct {correct}",
    listen: "Listen",
    noMistakes: "No mistakes right now",
    noMistakesLead: "Take a {level} vocabulary quiz and wrong words will appear here.",
    enterVocabQuiz: "Enter vocabulary quiz",
    planAriaFixed: "{level} vocabulary study plan",
    planSummary: "{level} study plan · {goal} words per unit",
    unitRange: "Unit {unit} · {start}-{end}",
    unitDoneLead: "You have viewed every word in this unit. Known words are mastered; unknown words go to review and the mistake book.",
    todayRangeLead: "Today: words {start}-{end}. Read the card, tap “Know / Don’t know”, then use “Next word”.",
    totalWords: "Total words",
    units: "Units",
    unitSeen: "Seen in unit",
    unitReview: "Unit review",
    notStudied: "Not studied",
    totalProgress: "Total progress",
    testUnit: "Quiz Unit {unit}",
    fixedPlan: "Account plan fixed",
    continueAt: "Next time: Unit {unit}, word {word}.",
    editPlan: "Edit study plan",
    closeEdit: "Close edit",
    currentUnitOverview: "Current unit overview",
    jumpHint: "Tap a word to jump directly",
    newWord: "New word",
    knownStatus: "Known",
    unknown: "Don’t know",
    pronunciation: "Pronunciation",
    known: "Know",
    nextWord: "Next word",
    currentUnit: "Current unit",
    unitKnown: "Known in unit",
    totalMastered: "Total mastered",
    studyMode: "Study mode",
    flashcardMode: "Flashcard-style progress",
    flashcardLead: "Known words count as mastered; unknown words enter review and can be checked later in the mistake book.",
    enterUnitQuiz: "Enter Unit {unit} quiz",
    viewMistakes: "View mistake book",
    fixedGoalToast: "Fixed at {goal} words per unit",
    todayDone: "Today's vocabulary task is complete",
    markedMastered: "Marked as mastered",
    backToReview: "Moved back to review",
    unknownSaved: "Saved as unknown. Review it later.",
  };
  const zh = {
    planAria: "选择单词学习计划",
    wordPlan: "{level} 单词计划",
    chooseGoal: "先固定每单元学习几个词",
    planIntro: "每个账号只需要选一次。选好后，页面会固定按这个数量显示单词，并自动从你上次停下的位置继续。",
    wordsPerUnit: "词/单元",
    changeLater: "之后想调整，可以在单词页点击“修改学习计划”。",
    mastered: "已掌握",
    review: "待复习",
    viewed: "已学完",
    learning: "学习中",
    new: "未开始",
    unitCompleteConfirm: "本单元 {count} 个单词学习完成！要现在进入第 {unit} 单元测试吗？",
    stayStudy: "已留在学习页，你可以稍后从单元卡片进入测试。",
    unitProgressTitle: "{level} 单元进度",
    unitProgressLead: "每个单元只显示进度，不再展开长长的单词表。点单元卡片即可继续学习。",
    words: "词",
    unit: "第 {unit} 单元",
    seen: "已看",
    know: "认识",
    notStudiedShort: "未学",
    quiz: "测验",
    study: "学习",
    mistakeBook: "{level} 错题本",
    mistakeCount: "{count} 个待复习单词",
    mistakeLead: "默认收起，点开后查看错题。复习后标记掌握，或连续答对后会离开错题本。",
    expandMistakes: "展开错题本",
    collapseMistakes: "收起错题本",
    mistakeQuiz: "开始错题复习测试",
    mistakeScope: "只测试当前等级里还没掌握的错题。",
    wrongRight: "错 {wrong} 次 · 答对 {correct} 次",
    listen: "听",
    noMistakes: "当前没有错题",
    noMistakesLead: "去做一次 {level} 单词测验，答错的词会自动收进这里。",
    enterVocabQuiz: "进入单词测验",
    planAriaFixed: "{level} 单词学习计划",
    planSummary: "{level} 学习计划 · 每单元 {goal} 词",
    unitRange: "第 {unit} 单元 · {start}-{end}",
    unitDoneLead: "本单元已经看完啦。认识的会记录为已掌握，不认识的会进入待复习和错题本。",
    todayRangeLead: "今天学习 {start}-{end} 号词。看词卡，点“认识 / 不认识”，再用“下一个”推进。",
    totalWords: "总词数",
    units: "单元",
    unitSeen: "本单元已看",
    unitReview: "本单元待复习",
    notStudied: "未学习",
    totalProgress: "总进度",
    testUnit: "测第 {unit} 单元",
    fixedPlan: "账号学习计划已固定",
    continueAt: "下次打开会继续第 {unit} 单元第 {word} 个词。",
    editPlan: "修改学习计划",
    closeEdit: "收起修改",
    currentUnitOverview: "当前单元速览",
    jumpHint: "点击单词可直接切换学习",
    newWord: "新单词",
    knownStatus: "已认识",
    unknown: "不认识",
    pronunciation: "听发音",
    known: "认识",
    nextWord: "下一词",
    currentUnit: "当前单元",
    unitKnown: "本单元认识",
    totalMastered: "总掌握",
    studyMode: "学习模式",
    flashcardMode: "像背单词一样推进",
    flashcardLead: "认识会计入本单元掌握；不认识会进入待复习，之后也能在错题本里回看。",
    enterUnitQuiz: "进入第 {unit} 单元测验",
    viewMistakes: "查看错题本",
    fixedGoalToast: "已固定为每单元 {goal} 个词",
    todayDone: "今日单词任务已完成",
    markedMastered: "已标记掌握",
    backToReview: "已放回复习",
    unknownSaved: "已记录为不认识，稍后复习。",
  };
  const source = isEnglish() ? en : zh;
  return String(source[key] || zh[key] || key).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

const localVocabularyByLevel = {
  N5: [
    { id: "n5-asa", word: "朝", kana: "あさ", meaning: "早晨", type: "名词", example: "朝、コーヒーを飲みます。", exampleMeaning: "早上喝咖啡。" },
    { id: "n5-iku", word: "行く", kana: "いく", meaning: "去", type: "动词", example: "学校へ行きます。", exampleMeaning: "去学校。" },
    { id: "n5-takai", word: "高い", kana: "たかい", meaning: "高的、贵的", type: "形容词", example: "この本は少し高いです。", exampleMeaning: "这本书有点贵。" },
  ],
  N4: [
    { id: "n4-yoyaku", word: "予約", kana: "よやく", meaning: "预约", type: "名词", example: "ホテルを予約しました。", exampleMeaning: "预约了酒店。" },
    { id: "n4-tsutaeru", word: "伝える", kana: "つたえる", meaning: "传达、告诉", type: "动词", example: "先生に予定を伝えます。", exampleMeaning: "把计划告诉老师。" },
    { id: "n4-benri", word: "便利", kana: "べんり", meaning: "方便", type: "形容动词", example: "このアプリは便利です。", exampleMeaning: "这个应用很方便。" },
  ],
  N3: [
    { id: "n3-kakunin", word: "確認", kana: "かくにん", meaning: "确认", type: "名词/サ变", example: "メールの内容を確認します。", exampleMeaning: "确认邮件内容。" },
    { id: "n3-sasaeru", word: "支える", kana: "ささえる", meaning: "支撑、支持", type: "动词", example: "家族が私を支えてくれます。", exampleMeaning: "家人支持着我。" },
    { id: "n3-kawari", word: "代わり", kana: "かわり", meaning: "代替、替换", type: "名词", example: "友達の代わりに行きます。", exampleMeaning: "代替朋友去。" },
  ],
  N2: [
    { id: "n2-atsukau", word: "扱う", kana: "あつかう", meaning: "处理、操作、对待", type: "动词", example: "このアプリは学習計画を自動で扱います。", exampleMeaning: "这个应用会自动处理学习计划。" },
    { id: "n2-oginau", word: "補う", kana: "おぎなう", meaning: "补充、弥补", type: "动词", example: "弱点を練習で補います。", exampleMeaning: "通过练习弥补弱点。" },
    { id: "n2-kaizen", word: "改善", kana: "かいぜん", meaning: "改善", type: "名词/サ变", example: "勉強方法を改善しました。", exampleMeaning: "改善了学习方法。" },
    { id: "n2-seigen", word: "制限", kana: "せいげん", meaning: "限制", type: "名词/サ变", example: "時間を制限して問題を解きます。", exampleMeaning: "限制时间做题。" },
    { id: "n2-hindo", word: "頻度", kana: "ひんど", meaning: "频率", type: "名词", example: "復習の頻度を上げます。", exampleMeaning: "提高复习频率。" },
  ],
  N1: [
    { id: "n1-gainen", word: "概念", kana: "がいねん", meaning: "概念", type: "名词", example: "抽象的な概念を理解します。", exampleMeaning: "理解抽象概念。" },
    { id: "n1-shisa", word: "示唆", kana: "しさ", meaning: "暗示、启发", type: "名词/サ变", example: "この結果は重要な点を示唆しています。", exampleMeaning: "这个结果暗示了重要之处。" },
    { id: "n1-chusho", word: "抽象", kana: "ちゅうしょう", meaning: "抽象", type: "名词/サ变", example: "抽象的な文章を読む練習をします。", exampleMeaning: "练习阅读抽象文章。" },
  ],
};

const session = {
  level: params.get("level") || savedState.level || "N5",
  index: 0,
  words: [],
  stats: { total: 0, mastered: 0, remaining: 0 },
  question: null,
  dailyGoal: 0,
};

const dailyGoalOptions = [10, 20, 30, 50];

function normalizeDailyGoal(value) {
  const goal = Number(value || 0);
  return dailyGoalOptions.includes(goal) ? goal : 30;
}

function ensureVocabularyPlanState() {
  savedState.vocabularyPlans = savedState.vocabularyPlans || {};
  savedState.vocabularyResume = savedState.vocabularyResume || {};
  savedState.vocabularyResume[currentUserId] = savedState.vocabularyResume[currentUserId] || {};
}

function currentPlan() {
  ensureVocabularyPlanState();
  return savedState.vocabularyPlans[currentUserId] || null;
}

function hasFixedPlan() {
  return Boolean(currentPlan()?.dailyGoal);
}

function planDailyGoal() {
  return normalizeDailyGoal(currentPlan()?.dailyGoal);
}

function saveVocabularyPlan(goal) {
  ensureVocabularyPlanState();
  savedState.vocabularyPlans[currentUserId] = {
    dailyGoal: normalizeDailyGoal(goal),
    fixedAt: new Date().toISOString(),
  };
  savedState.vocabularyDailyGoal = savedState.vocabularyPlans[currentUserId].dailyGoal;
  session.dailyGoal = savedState.vocabularyPlans[currentUserId].dailyGoal;
  saveLocalState();
}

function resumeKey(level = session.level) {
  return `${level}`;
}

function currentResume() {
  ensureVocabularyPlanState();
  return savedState.vocabularyResume[currentUserId][resumeKey()] || null;
}

function saveResume() {
  if (!hasFixedPlan() || !session.words.length) return;
  ensureVocabularyPlanState();
  savedState.vocabularyResume[currentUserId][resumeKey()] = {
    index: Math.min(Math.max(0, session.index), Math.max(0, session.words.length - 1)),
    dailyGoal: session.dailyGoal,
    updatedAt: new Date().toISOString(),
  };
  saveLocalState();
}

function applyResumeIndex() {
  const requestedUnit = Number(params.get("unit"));
  if (Number.isInteger(requestedUnit) && requestedUnit >= 0) {
    session.index = Math.min(requestedUnit * session.dailyGoal, Math.max(0, session.words.length - 1));
    return;
  }
  const resume = currentResume();
  const resumeIndex = Number(resume?.index);
  session.index = Number.isInteger(resumeIndex) ? Math.min(Math.max(0, resumeIndex), Math.max(0, session.words.length - 1)) : 0;
}

function unitCount() {
  return Math.max(1, Math.ceil(session.words.length / Math.max(1, session.dailyGoal)));
}

function currentUnitIndex() {
  return Math.floor(session.index / session.dailyGoal);
}

function unitRange(unitIndex = currentUnitIndex()) {
  const size = Math.max(1, session.dailyGoal);
  const start = unitIndex * size;
  const end = Math.min(start + size, session.words.length);
  return { start, end, words: session.words.slice(start, end) };
}

function unitMasteredCount(unitIndex = currentUnitIndex()) {
  return unitRange(unitIndex).words.filter((word) => word.mastered).length;
}

function unitKey(unitIndex = currentUnitIndex()) {
  return `${session.level}-${session.dailyGoal}-${unitIndex + 1}`;
}

function renderPlanSetup() {
  const suggested = normalizeDailyGoal(savedState.vocabularyDailyGoal || 20);
  return `
    <section class="vocab-plan-start" aria-label="${vocabText("planAria")}">
      <div class="vocab-plan-start-copy">
        <span>${vocabText("wordPlan", { level: session.level })}</span>
        <h3>${vocabText("chooseGoal")}</h3>
        <p>${vocabText("planIntro")}</p>
      </div>
      <div class="vocab-plan-choice-grid">
        ${dailyGoalOptions
          .map(
            (goal) => `
              <button type="button" class="${goal === suggested ? "active" : ""}" data-set-fixed-goal="${goal}">
                 <strong>${goal}</strong>
                <span>${vocabText("wordsPerUnit")}</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="vocab-plan-start-note">${vocabText("changeLater")}</p>
    </section>
  `;
}

function unitViewedIds(unitIndex = currentUnitIndex()) {
  ensureUnitTracking();
  return new Set(savedState.vocabularyViewedUnits[unitKey(unitIndex)] || []);
}

function ensureUnitTracking() {
  savedState.vocabularyViewedUnits = savedState.vocabularyViewedUnits || {};
  savedState.vocabularyUnitViewPrompts = savedState.vocabularyUnitViewPrompts || {};
}

function unitTestHref(unitIndex = currentUnitIndex()) {
  return `test.html?type=vocabulary&level=${encodeURIComponent(session.level)}&unit=${unitIndex}&goal=${session.dailyGoal}`;
}

function mistakeTestHref() {
  return `test.html?type=vocabulary&level=${encodeURIComponent(session.level)}&mistakes=1`;
}

function unitStudyStats(unitIndex = currentUnitIndex()) {
  const range = unitRange(unitIndex);
  const viewed = unitViewedIds(unitIndex);
  const viewedCount = range.words.filter((word) => viewed.has(word.id)).length;
  const mastered = range.words.filter((word) => word.mastered).length;
  const review = range.words.filter((word) => !word.mastered && wrongCount(word) > 0).length;
  const viewedComplete = range.words.length > 0 && viewedCount === range.words.length;
  const complete = range.words.length > 0 && mastered === range.words.length;
  return {
    ...range,
    mastered,
    review,
    viewedCount,
    viewedComplete,
    pending: Math.max(0, range.words.length - viewedCount),
    complete,
    status: complete ? "mastered" : review > 0 ? "review" : viewedComplete ? "viewed" : viewedCount > 0 ? "learning" : "new",
  };
}

function unitStatusLabel(stats) {
  if (stats.complete) return vocabText("mastered");
  if (stats.review > 0) return vocabText("review");
  if (stats.viewedComplete) return vocabText("viewed");
  if (stats.viewedCount > 0) return vocabText("learning");
  return vocabText("new");
}

function wrongCount(word) {
  return Math.max(0, Number(word.attempts || 0) - Number(word.correct || 0));
}

function markWordViewed(unitIndex, word) {
  if (!word?.id) return false;
  ensureUnitTracking();
  const key = unitKey(unitIndex);
  const viewed = new Set(savedState.vocabularyViewedUnits[key] || []);
  const wasViewed = viewed.has(word.id);
  viewed.add(word.id);
  savedState.vocabularyViewedUnits[key] = [...viewed];

  const range = unitRange(unitIndex);
  const unitViewedComplete = range.words.length > 0 && range.words.every((item) => viewed.has(item.id));
  saveLocalState();
  return !wasViewed && unitViewedComplete && !savedState.vocabularyUnitViewPrompts[key];
}

function maybePromptUnitFinished(unitIndex) {
  ensureUnitTracking();
  const key = unitKey(unitIndex);
  const range = unitRange(unitIndex);
  const viewed = unitViewedIds(unitIndex);
  const unitViewedComplete = range.words.length > 0 && range.words.every((item) => viewed.has(item.id));
  if (!unitViewedComplete || savedState.vocabularyUnitViewPrompts[key]) return false;
  savedState.vocabularyUnitViewPrompts[key] = new Date().toISOString();
  saveLocalState();
  window.setTimeout(() => {
    const goToTest = window.confirm(vocabText("unitCompleteConfirm", { count: range.words.length, unit: unitIndex + 1 }));
    if (goToTest) {
      window.location.href = unitTestHref(unitIndex);
    } else {
      showToast(vocabText("stayStudy"));
    }
  }, 160);
  return true;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setServiceStatus(isOnline) {
  statusBadge.textContent = isOnline ? t("common.online") : t("common.offline");
  statusBadge.classList.toggle("online", isOnline);
  statusBadge.classList.toggle("offline", !isOnline);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
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

function saveLocalState() {
  savedState.level = session.level;
  if (session.dailyGoal) savedState.vocabularyDailyGoal = session.dailyGoal;
  localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
}

function localPayload(level) {
  const records = savedState.vocabulary || {};
  const words = (localVocabularyByLevel[level] || localVocabularyByLevel.N5).map((word) => {
    const record = records[word.id] || {};
    return {
      ...word,
      mastered: Boolean(record.mastered),
      attempts: Number(record.attempts || 0),
      correct: Number(record.correct || 0),
    };
  });
  const mastered = words.filter((word) => word.mastered).length;
  return { level, words, stats: { total: words.length, mastered, remaining: words.length - mastered } };
}

async function loadVocabulary(level) {
  document.querySelector("#vocabPageTitle").textContent = `${level} ${t("module.vocabulary")} ${t("common.training")}`;
  document.querySelector("#vocabPageContent").innerHTML = `<div class="vocab-loading"><strong>正在载入 ${level} 单词</strong><span>准备单词表、发音和选择题。</span></div>`;
  try {
    const data = await apiRequest(`/api/vocabulary?userId=${encodeURIComponent(currentUserId)}&level=${encodeURIComponent(level)}`);
    setServiceStatus(true);
    return data.vocabulary;
  } catch {
    setServiceStatus(false);
    try {
      const response = await fetch("data/vocabulary.json");
      const vocabulary = await response.json();
      const records = savedState.vocabulary || {};
      const words = (vocabulary[level] || vocabulary.N5 || []).map((word) => {
        const record = records[word.id] || {};
        return {
          ...word,
          mastered: Boolean(record.mastered),
          attempts: Number(record.attempts || 0),
          correct: Number(record.correct || 0),
        };
      });
      const mastered = words.filter((word) => word.mastered).length;
      return { level, words, stats: { total: words.length, mastered, remaining: words.length - mastered } };
    } catch {
      return localPayload(level);
    }
  }
}

function resetQuestion() {
  session.question = null;
}

function updateTestLink() {
  const link = document.querySelector("#vocabTestLink");
  if (link) link.href = `test.html?type=vocabulary&level=${encodeURIComponent(session.level)}`;
}

async function setLevel(level) {
  session.level = level;
  session.dailyGoal = hasFixedPlan() ? planDailyGoal() : 0;
  resetQuestion();
  updateTestLink();
  document.querySelectorAll("[data-vocab-level]").forEach((button) => button.classList.toggle("active", button.dataset.vocabLevel === level));
  const payload = await loadVocabulary(level);
  session.words = payload.words;
  session.stats = payload.stats;
  if (!hasFixedPlan()) {
    initialUnitApplied = true;
    session.index = 0;
    saveLocalState();
    draw();
    return;
  }
  if (!initialUnitApplied) {
    applyResumeIndex();
    initialUnitApplied = true;
  } else {
    const resume = currentResume();
    const resumeIndex = Number(resume?.index);
    session.index = Number.isInteger(resumeIndex) ? Math.min(Math.max(0, resumeIndex), Math.max(0, session.words.length - 1)) : 0;
  }
  saveLocalState();
  draw();
}

function speakJapanese(text) {
  if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
    showToast("当前浏览器暂不支持语音朗读");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function renderWordList() {
  const units = Array.from({ length: unitCount() }, (_, unitIndex) => {
    const stats = unitStudyStats(unitIndex);
    return { unitIndex, ...stats };
  });

  return `
    <section class="vocab-list-panel" id="vocabList" aria-label="${session.level} 单词表">
      <div class="vocab-list-head">
        <div>
          <h4>${vocabText("unitProgressTitle", { level: session.level })}</h4>
          <p>${vocabText("unitProgressLead")}</p>
        </div>
        <strong>${session.words.length} ${vocabText("words")}</strong>
      </div>
      <div class="vocab-unit-list">
        ${units
          .map(
            ({ unitIndex, start, end, words, mastered, review, pending, viewedCount, viewedComplete, complete, status }) => {
              const progress = words.length ? Math.round((viewedCount / words.length) * 100) : 0;
              return `
                <section class="vocab-unit-card ${unitIndex === currentUnitIndex() ? "active" : ""} ${status}">
                  <button type="button" class="vocab-unit-card-main" data-unit="${unitIndex}">
                    <span>${vocabText("unit", { unit: unitIndex + 1 })}</span>
                    <b>${start + 1}-${end}</b>
                    <em>${unitStatusLabel({ complete, review, viewedComplete, viewedCount })}</em>
                  </button>
                  <div class="vocab-unit-card-progress" aria-hidden="true"><span style="width: ${progress}%"></span></div>
                  <div class="vocab-unit-card-stats">
                    <small>${viewedCount}/${words.length} ${vocabText("seen")}</small>
                    <small>${mastered} ${vocabText("know")}</small>
                    <small>${review} ${vocabText("review")}</small>
                    <small>${pending} ${vocabText("notStudiedShort")}</small>
                  </div>
                  <div class="vocab-unit-card-actions">
                    <a href="${unitTestHref(unitIndex)}">${vocabText("quiz")}</a>
                    <button type="button" data-unit="${unitIndex}">${vocabText("study")}</button>
                  </div>
              </section>
            `;
            },
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMistakeBook() {
  const mistakeWords = session.words.filter((word) => wrongCount(word) > 0 && !word.mastered);
  const shouldOpen = window.location.hash === "#vocabMistakes";
  return `
    <section class="vocab-list-panel vocab-mistake-panel" id="vocabMistakes" aria-label="${vocabText("mistakeBook", { level: session.level })}">
      ${
        mistakeWords.length
          ? `<details class="vocab-mistake-details" ${shouldOpen ? "open" : ""}>
              <summary class="vocab-mistake-summary">
                <div>
                   <span>${vocabText("mistakeBook", { level: session.level })}</span>
                   <strong>${vocabText("mistakeCount", { count: mistakeWords.length })}</strong>
                   <p>${vocabText("mistakeLead")}</p>
                </div>
                <em><b class="open-label">${vocabText("expandMistakes")}</b><b class="close-label">${vocabText("collapseMistakes")}</b></em>
              </summary>
              <div class="vocab-mistake-actions">
                <a class="btn btn-dark" href="${mistakeTestHref()}">${vocabText("mistakeQuiz")}</a>
                <span>${vocabText("mistakeScope")}</span>
              </div>
              <div class="vocab-mistake-grid">
                ${mistakeWords
                  .map((item) => {
                    const index = session.words.findIndex((word) => word.id === item.id);
                    return `
                      <article class="vocab-mistake-card">
                        <button type="button" class="vocab-mistake-main" data-index="${index}">
                          <span>${escapeHtml(item.word)}</span>
                          <em>${escapeHtml(item.kana)}</em>
                          <b>${escapeHtml(item.meaning)}</b>
                        </button>
                        <div class="vocab-mistake-meta">
                          <small>${vocabText("wrongRight", { wrong: wrongCount(item), correct: Number(item.correct || 0) })}</small>
                          <button type="button" class="sound-button small" data-speak="${escapeHtml(item.kana || item.word)}">${vocabText("listen")}</button>
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            </details>`
          : `<div class="vocab-empty-state">
              <strong>${vocabText("noMistakes")}</strong>
              <span>${vocabText("noMistakesLead", { level: session.level })}</span>
              <a class="btn btn-dark" href="test.html?type=vocabulary&level=${encodeURIComponent(session.level)}">${vocabText("enterVocabQuiz")}</a>
            </div>`
      }
    </section>
  `;
}

function renderStudyPlan() {
  const activeUnit = currentUnitIndex();
  const range = unitStudyStats(activeUnit);
  const percent = session.stats.total ? Math.round((session.stats.mastered / session.stats.total) * 100) : 0;
  const units = Array.from({ length: unitCount() }, (_, index) => {
    const unit = unitStudyStats(index);
    return {
      index,
      start: unit.start,
      end: unit.end,
      mastered: unit.mastered,
      review: unit.review,
      viewedCount: unit.viewedCount,
      viewedComplete: unit.viewedComplete,
      complete: unit.complete,
      status: unit.status,
      total: unit.words.length,
    };
  });

  return `
    <section class="vocab-plan-panel" aria-label="${vocabText("planAriaFixed", { level: session.level })}">
      <div class="vocab-plan-summary">
        <span>${vocabText("planSummary", { level: session.level, goal: session.dailyGoal })}</span>
        <h3>${vocabText("unitRange", { unit: activeUnit + 1, start: range.start + 1, end: range.end })}</h3>
        <p>${range.viewedComplete ? vocabText("unitDoneLead") : vocabText("todayRangeLead", { start: range.start + 1, end: range.end })}</p>
      </div>
      <div class="vocab-plan-metrics">
        <div><strong>${session.words.length}</strong><span>${vocabText("totalWords")}</span></div>
        <div><strong>${unitCount()}</strong><span>${vocabText("units")}</span></div>
        <div><strong>${range.viewedCount}/${range.words.length}</strong><span>${vocabText("unitSeen")}</span></div>
        <div><strong>${range.review}</strong><span>${vocabText("unitReview")}</span></div>
      </div>
      <div class="vocab-unit-summary ${range.status}">
        <div><strong>${range.pending}</strong><span>${vocabText("notStudied")}</span></div>
        <div><strong>${percent}%</strong><span>${vocabText("totalProgress")}</span></div>
        <a class="btn btn-dark" href="${unitTestHref(activeUnit)}">${vocabText("testUnit", { unit: activeUnit + 1 })}</a>
      </div>
      <div class="vocab-goal-panel ${isEditingPlan ? "editing" : ""}">
        <div>
          <span>${vocabText("fixedPlan")}</span>
          <strong>${session.dailyGoal} ${vocabText("wordsPerUnit")}</strong>
          <p>${vocabText("continueAt", { unit: activeUnit + 1, word: session.index - range.start + 1 })}</p>
        </div>
        <button class="btn btn-light" type="button" data-edit-plan>${isEditingPlan ? vocabText("closeEdit") : vocabText("editPlan")}</button>
        ${
          isEditingPlan
            ? `<div class="vocab-goal-buttons">
                ${dailyGoalOptions
                  .map(
                    (goal) => `
                      <button type="button" data-goal="${goal}" class="${goal === session.dailyGoal ? "active" : ""}">
                         ${goal} ${vocabText("wordsPerUnit")}
                      </button>
                    `,
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>
      <div class="vocab-unit-tabs" aria-label="选择学习单元">
        ${units
          .map(
            (unit) => `
              <button type="button" data-unit="${unit.index}" class="${unit.index === activeUnit ? "active" : ""} ${unit.status}">
                <span>${unit.index + 1}</span>
                <em>${unitStatusLabel(unit)} · ${unit.viewedCount}/${unit.total}</em>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCurrentUnitQueue(range, activeUnit) {
  return `
    <section class="vocab-unit-strip" aria-label="${vocabText("currentUnitOverview")}">
      <div class="vocab-unit-strip-head">
        <div>
          <span>${vocabText("currentUnitOverview")}</span>
          <strong>${vocabText("unitRange", { unit: activeUnit + 1, start: range.start + 1, end: range.end })}</strong>
        </div>
        <em>${vocabText("jumpHint")}</em>
      </div>
      <ul class="vocab-queue">
        ${range.words
          .map((item, offset) => {
            const index = range.start + offset;
            return `
              <li class="${index === session.index ? "current" : ""} ${item.mastered ? "mastered" : ""}">
                <button type="button" data-index="${index}">
                  <span>${escapeHtml(item.word)}</span>
                  <em>${item.mastered ? vocabText("mastered") : wrongCount(item) > 0 ? vocabText("review") : vocabText("notStudied")}</em>
                </button>
              </li>
            `;
          })
          .join("")}
      </ul>
    </section>
  `;
}

function draw() {
  if (!hasFixedPlan()) {
    document.querySelector("#vocabPageContent").innerHTML = renderPlanSetup();
    bind();
    return;
  }
  const word = session.words[session.index];
  if (!word) return;
  const percent = session.stats.total ? Math.round((session.stats.mastered / session.stats.total) * 100) : 0;
  const activeUnit = currentUnitIndex();
  markWordViewed(activeUnit, word);
  saveResume();
  const range = unitStudyStats(activeUnit);
  const unitPosition = session.index - range.start + 1;
  const unitProgress = range.words.length ? Math.round((unitPosition / range.words.length) * 100) : 0;
  const wordStatus = word.mastered ? vocabText("knownStatus") : wrongCount(word) > 0 ? vocabText("review") : vocabText("newWord");
  document.querySelector("#vocabPageContent").innerHTML = `
    <div class="vocab-shell vocab-learning-shell">
      ${renderStudyPlan()}
      <section class="vocab-card ${word.mastered ? "known" : wrongCount(word) > 0 ? "review" : ""}">
        <div class="vocab-topline">
          <span>${session.level} · ${vocabText("unit", { unit: activeUnit + 1 })} · ${unitPosition}/${range.words.length}</span>
          <em>${escapeHtml(word.type)} · ${wordStatus}</em>
        </div>
        <strong>${escapeHtml(word.word)}</strong>
        <small>${escapeHtml(word.kana)}</small>
        <p>${escapeHtml(word.meaning)}</p>
        <div class="vocab-example"><b>${escapeHtml(word.example)}</b><span>${escapeHtml(word.exampleMeaning)}</span></div>
        <div class="vocab-card-progress" aria-label="本单元学习位置"><span style="width: ${unitProgress}%"></span></div>
        <div class="vocab-actions vocab-memory-actions">
          <button type="button" class="vocab-unknown" data-known="false">${vocabText("unknown")}</button>
          <button type="button" class="sound-button" data-speak="${escapeHtml(word.kana || word.word)}">${vocabText("pronunciation")}</button>
          <button type="button" class="vocab-known" data-known="true">${word.mastered ? vocabText("knownStatus") : vocabText("known")}</button>
          <button type="button" data-next>${vocabText("nextWord")}</button>
        </div>
      </section>
      <aside class="vocab-study-side">
        <div class="vocab-unit-label">
          <span>${vocabText("currentUnit")}</span>
          <strong>${vocabText("unitRange", { unit: activeUnit + 1, start: range.start + 1, end: range.end })}</strong>
          <em>${unitStatusLabel(range)}</em>
        </div>
        <div class="vocab-stats">
          <div><strong>${range.viewedCount}/${range.words.length}</strong><span>${vocabText("unitSeen")}</span></div>
          <div><strong>${range.mastered}</strong><span>${vocabText("unitKnown")}</span></div>
          <div><strong>${range.review}</strong><span>${vocabText("review")}</span></div>
          <div><strong>${session.stats.mastered}/${session.stats.total}</strong><span>${vocabText("totalMastered")}</span></div>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        <div class="study-link-panel">
          <span>${vocabText("studyMode")}</span>
          <h4>${vocabText("flashcardMode")}</h4>
          <p>${vocabText("flashcardLead")}</p>
          <a class="btn btn-dark" href="${unitTestHref(activeUnit)}">${vocabText("enterUnitQuiz", { unit: activeUnit + 1 })}</a>
          <a class="btn btn-light" href="#vocabMistakes">${vocabText("viewMistakes")}</a>
        </div>
      </aside>
      ${renderCurrentUnitQueue(range, activeUnit)}
      ${renderMistakeBook()}
    </div>
  `;
  bind();
}

function updateStats() {
  session.stats.mastered = session.words.filter((word) => word.mastered).length;
  session.stats.remaining = session.stats.total - session.stats.mastered;
}

async function saveMaster(word, mastered) {
  const targetUnit = currentUnitIndex();
  const targetWasLast = session.index === unitRange(targetUnit).end - 1;
  const fallback = { attempts: word.attempts, correct: word.correct, mastered };
  try {
    const data = await apiRequest("/api/vocabulary/master", {
      method: "POST",
      body: JSON.stringify({ userId: currentUserId, wordId: word.id, mastered }),
    });
    Object.assign(word, data.record);
    Object.assign(savedState, data.progress);
    setServiceStatus(true);
    showToast(data.message);
  } catch {
    savedState.vocabulary = savedState.vocabulary || {};
    savedState.vocabulary[word.id] = fallback;
    Object.assign(word, fallback);
    setServiceStatus(false);
    showToast(mastered ? vocabText("markedMastered") : vocabText("backToReview"));
  }
  updateStats();
  savedState.vocabularyCompletedUnits = savedState.vocabularyCompletedUnits || {};
  const completedKey = unitKey(targetUnit);
  const unitComplete = unitStudyStats(targetUnit).complete;
  const newlyCompleted = mastered && unitComplete && !savedState.vocabularyCompletedUnits[completedKey];
  if (unitComplete) {
    savedState.vocabularyCompletedUnits[completedKey] = new Date().toISOString();
  } else {
    delete savedState.vocabularyCompletedUnits[completedKey];
  }
  saveLocalState();
  draw();
  if (newlyCompleted) {
    showToast(isEnglish() ? `Unit ${targetUnit + 1} is finished. You can take the unit quiz.` : `第 ${targetUnit + 1} 单元学习完啦，可以去做单元测验。`);
  }
  if (targetWasLast) {
    maybePromptUnitFinished(targetUnit);
  }
}

async function saveUnknown(word) {
  const targetUnit = currentUnitIndex();
  const targetWasLast = session.index === unitRange(targetUnit).end - 1;
  const fallback = {
    attempts: Number(word.attempts || 0) + 1,
    correct: Number(word.correct || 0),
    mastered: false,
  };
  try {
    const data = await apiRequest("/api/vocabulary/answer", {
      method: "POST",
      body: JSON.stringify({ userId: currentUserId, wordId: word.id, correct: false }),
    });
    Object.assign(word, data.record);
    Object.assign(savedState, data.progress);
    setServiceStatus(true);
    showToast(isEnglish() ? "Moved to review. It will appear in the mistake book." : "已放入待复习，之后会出现在错题本。");
  } catch {
    savedState.vocabulary = savedState.vocabulary || {};
    savedState.vocabulary[word.id] = fallback;
    Object.assign(word, fallback);
    setServiceStatus(false);
    showToast(vocabText("unknownSaved"));
  }
  updateStats();
  savedState.vocabularyCompletedUnits = savedState.vocabularyCompletedUnits || {};
  delete savedState.vocabularyCompletedUnits[unitKey(targetUnit)];
  saveLocalState();
  draw();
  if (targetWasLast) {
    maybePromptUnitFinished(targetUnit);
  }
}

function moveNextWord() {
  const targetUnit = currentUnitIndex();
  const targetWasLast = session.index === unitRange(targetUnit).end - 1;
  if (targetWasLast && maybePromptUnitFinished(targetUnit)) return;
  session.index = (session.index + 1) % session.words.length;
  resetQuestion();
  saveResume();
  draw();
}

function bind() {
  const word = session.words[session.index];
  document.querySelector("[data-next]")?.addEventListener("click", moveNextWord);
  document.querySelectorAll("[data-set-fixed-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      saveVocabularyPlan(button.dataset.setFixedGoal);
      isEditingPlan = false;
      applyResumeIndex();
      showToast(vocabText("fixedGoalToast", { goal: session.dailyGoal }));
      draw();
    });
  });
  document.querySelector("[data-edit-plan]")?.addEventListener("click", () => {
    isEditingPlan = !isEditingPlan;
    draw();
  });
  document.querySelectorAll("[data-known]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.known === "true") {
        saveMaster(word, true);
      } else {
        saveUnknown(word);
      }
    });
  });
  document.querySelectorAll("[data-index]").forEach((button) => {
    button.addEventListener("click", () => {
      session.index = Number(button.dataset.index);
      resetQuestion();
      saveResume();
      draw();
    });
  });
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextGoal = normalizeDailyGoal(button.dataset.goal);
      if (nextGoal === session.dailyGoal) {
        isEditingPlan = false;
        draw();
        return;
      }
      const confirmed = window.confirm(`确定把这个账号改成每单元 ${nextGoal} 个词吗？单元会重新按新数量分组，但会尽量停在当前单词附近。`);
      if (!confirmed) return;
      saveVocabularyPlan(nextGoal);
      session.index = Math.min(session.index, Math.max(0, session.words.length - 1));
      isEditingPlan = false;
      saveResume();
      draw();
    });
  });
  document.querySelectorAll("[data-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      session.index = Math.min(Number(button.dataset.unit) * session.dailyGoal, Math.max(0, session.words.length - 1));
      resetQuestion();
      saveResume();
      draw();
    });
  });
  document.querySelectorAll("[data-speak]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      speakJapanese(button.dataset.speak);
    });
  });
}

document.querySelectorAll("[data-vocab-level]").forEach((button) => {
  button.addEventListener("click", () => setLevel(button.dataset.vocabLevel));
});

document.querySelector("#vocabCompleteButton").addEventListener("click", async () => {
  savedState.completedModule = "单词";
  localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
  try {
    await apiRequest("/api/progress", {
      method: "PATCH",
      body: JSON.stringify({ userId: currentUserId, completedModule: "单词", activeModule: "单词", level: session.level }),
    });
    setServiceStatus(true);
  } catch {
    setServiceStatus(false);
  }
  showToast(vocabText("todayDone"));
});

setLevel(session.level);

window.addEventListener("nihongo:languagechange", () => {
  document.querySelector("#vocabPageTitle").textContent = `${session.level} ${t("module.vocabulary")} ${t("common.training")}`;
  setServiceStatus(statusBadge.classList.contains("online"));
});
