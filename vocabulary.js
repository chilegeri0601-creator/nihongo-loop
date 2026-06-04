const toast = document.querySelector("#toast");
const statusBadge = document.querySelector("#vocabServiceStatus");
let toastTimer;

const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";

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
  level: savedState.level || "N5",
  index: 0,
  words: [],
  stats: { total: 0, mastered: 0, remaining: 0 },
  question: null,
};

function wrongCount(word) {
  return Math.max(0, Number(word.attempts || 0) - Number(word.correct || 0));
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
  statusBadge.textContent = isOnline ? "后端已连接" : "离线演示";
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
  document.querySelector("#vocabPageTitle").textContent = `${level} 单词训练`;
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
  resetQuestion();
  updateTestLink();
  document.querySelectorAll("[data-vocab-level]").forEach((button) => button.classList.toggle("active", button.dataset.vocabLevel === level));
  const payload = await loadVocabulary(level);
  session.words = payload.words;
  session.stats = payload.stats;
  session.index = 0;
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
  return `
    <section class="vocab-list-panel" id="vocabList" aria-label="${session.level} 单词表">
      <div class="vocab-list-head">
        <div>
          <h4>${session.level} 单词表</h4>
          <p>点击任意单词可以切到词卡学习，也可以直接听发音。</p>
        </div>
        <strong>${session.words.length} 词</strong>
      </div>
      <div class="vocab-table">
        ${session.words
          .map(
            (item, index) => `
              <article class="vocab-row ${index === session.index ? "current" : ""} ${item.mastered ? "mastered" : ""}">
                <button type="button" class="vocab-row-main" data-index="${index}">
                  <span>${escapeHtml(item.word)}</span>
                  <em>${escapeHtml(item.kana)}</em>
                  <b>${escapeHtml(item.meaning)}</b>
                  <small>${escapeHtml(item.type)}</small>
                </button>
                <button type="button" class="sound-button small" data-speak="${escapeHtml(item.word)}" aria-label="听 ${escapeHtml(item.word)} 的发音">听</button>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMistakeBook() {
  const mistakeWords = session.words.filter((word) => wrongCount(word) > 0 && !word.mastered);
  return `
    <section class="vocab-list-panel vocab-mistake-panel" id="vocabMistakes" aria-label="${session.level} 单词错题本">
      <div class="vocab-list-head">
        <div>
          <h4>${session.level} 错题本</h4>
          <p>测验答错的单词会自动进入这里。复习后标记掌握，或连续答对后会离开错题本。</p>
        </div>
        <strong>${mistakeWords.length} 词</strong>
      </div>
      ${
        mistakeWords.length
          ? `<div class="vocab-mistake-grid">
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
                        <small>错 ${wrongCount(item)} 次 · 答对 ${Number(item.correct || 0)} 次</small>
                        <button type="button" class="sound-button small" data-speak="${escapeHtml(item.word)}">听</button>
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>`
          : `<div class="vocab-empty-state">
              <strong>当前没有错题</strong>
              <span>去做一次 ${session.level} 单词测验，答错的词会自动收进这里。</span>
              <a class="btn btn-dark" href="test.html?type=vocabulary&level=${encodeURIComponent(session.level)}">进入单词测验</a>
            </div>`
      }
    </section>
  `;
}

function draw() {
  const word = session.words[session.index];
  if (!word) return;
  const percent = session.stats.total ? Math.round((session.stats.mastered / session.stats.total) * 100) : 0;
  document.querySelector("#vocabPageContent").innerHTML = `
    <div class="vocab-shell vocab-learning-shell">
      <section class="vocab-card">
        <div class="vocab-topline"><span>${session.level}</span><em>${escapeHtml(word.type)}</em></div>
        <strong>${escapeHtml(word.word)}</strong>
        <small>${escapeHtml(word.kana)}</small>
        <p>${escapeHtml(word.meaning)}</p>
        <div class="vocab-example"><b>${escapeHtml(word.example)}</b><span>${escapeHtml(word.exampleMeaning)}</span></div>
        <div class="vocab-actions wide">
          <button type="button" data-prev>上一词</button>
          <button type="button" class="sound-button" data-speak="${escapeHtml(word.word)}">听发音</button>
          <button type="button" data-master="${word.mastered ? "false" : "true"}">${word.mastered ? "放回复习" : "标记掌握"}</button>
          <button type="button" data-next>下一词</button>
        </div>
      </section>
      <aside class="vocab-study-side">
        <div class="vocab-stats">
          <div><strong>${session.stats.mastered}/${session.stats.total}</strong><span>已掌握</span></div>
          <div><strong>${word.correct}/${word.attempts}</strong><span>测验记录</span></div>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        <div class="study-link-panel">
          <span>学习模式</span>
          <h4>这里只看单词和例句</h4>
          <p>完成本页学习后，进入独立测验页做选择题。</p>
          <a class="btn btn-dark" href="test.html?type=vocabulary&level=${encodeURIComponent(session.level)}">进入 ${session.level} 单词测验</a>
          <a class="btn btn-light" href="#vocabMistakes">查看错题本</a>
        </div>
        <ul class="vocab-queue">
          ${session.words
            .slice(0, 8)
            .map(
              (item, index) => `
                <li class="${index === session.index ? "current" : ""} ${item.mastered ? "mastered" : ""}">
                  <button type="button" data-index="${index}"><span>${escapeHtml(item.word)}</span><em>${item.mastered ? "已掌握" : "待复习"}</em></button>
                </li>
              `,
            )
            .join("")}
        </ul>
      </aside>
      ${renderWordList()}
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
    showToast(mastered ? "已标记掌握" : "已放回复习");
  }
  updateStats();
  saveLocalState();
  draw();
}

function bind() {
  const word = session.words[session.index];
  document.querySelector("[data-prev]").addEventListener("click", () => {
    session.index = (session.index - 1 + session.words.length) % session.words.length;
    resetQuestion();
    draw();
  });
  document.querySelector("[data-next]").addEventListener("click", () => {
    session.index = (session.index + 1) % session.words.length;
    resetQuestion();
    draw();
  });
  document.querySelector("[data-master]").addEventListener("click", (event) => saveMaster(word, event.currentTarget.dataset.master === "true"));
  document.querySelectorAll("[data-index]").forEach((button) => {
    button.addEventListener("click", () => {
      session.index = Number(button.dataset.index);
      resetQuestion();
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
  showToast("今日单词任务已完成");
});

setLevel(session.level);
