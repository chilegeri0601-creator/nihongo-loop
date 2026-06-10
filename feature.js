const featureKey = document.body.dataset.feature || "reading";
const toast = document.querySelector("#toast");
const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
let toastTimer;
let featureData;
let session = {
  level: savedState[`${featureKey}Level`] || savedState.level || "N5",
  index: 0,
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
  utterance.rate = featureKey === "listening" ? 0.78 : 0.86;
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

function saveState() {
  savedState[`${featureKey}Level`] = session.level;
  localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
}

function records() {
  savedState.features = savedState.features || {};
  savedState.features[featureKey] = savedState.features[featureKey] || {};
  return savedState.features[featureKey];
}

function currentItems() {
  return featureData.levels[session.level] || [];
}

function currentItem() {
  const items = currentItems();
  return items[Math.min(session.index, Math.max(0, items.length - 1))];
}

function renderList() {
  return currentItems()
    .map((item, index) => {
      const done = Boolean(records()[item.id]?.completed);
      return `
        <button type="button" class="feature-list-item ${index === session.index ? "current" : ""} ${done ? "completed" : ""}" data-feature-index="${index}">
          <span>${escapeHtml(item.category)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <em>${done ? "已完成" : "待训练"}</em>
        </button>
      `;
    })
    .join("");
}

function completedCount() {
  return currentItems().filter((item) => records()[item.id]?.completed).length;
}

function renderFeatureQuestion(item, record) {
  if (featureKey !== "reading" || !item.question) return "";
  const answered = Boolean(record.answer);
  const correct = record.answer === item.question.correct;
  return `
    <div class="feature-question-card ${answered ? (correct ? "correct" : "wrong") : ""}">
      <span>阅读理解</span>
      <h4>${escapeHtml(item.question.text)}</h4>
      <div class="feature-answer-grid">
        ${item.question.options
          .map((option) => {
            const selected = record.answer === option;
            return `<button type="button" class="${selected ? "selected" : ""}" data-feature-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`;
          })
          .join("")}
      </div>
      <p id="featureAnswerFeedback">${
        answered
          ? correct
            ? "答对了，这句话已经理解完成。"
            : `还差一点。正确理解是：${escapeHtml(item.question.correct)}`
          : "读完上面的日语句子，选择它讲了什么。"
      }</p>
      <div class="feature-question-actions">
        <button class="btn btn-light" type="button" data-feature-reset-answer>重新选择</button>
        <button class="btn btn-dark" type="button" data-feature-next ${correct ? "" : "disabled"}>下一句</button>
      </div>
    </div>
  `;
}

function draw() {
  const item = currentItem();
  if (!item) return;
  const items = currentItems();
  const done = completedCount();
  const percent = Math.round((done / items.length) * 100);
  const record = records()[item.id] || {};
  document.querySelector("#featureTitle").textContent = `${session.level} ${featureData.name}训练`;
  document.querySelector("#featureContent").innerHTML = `
    <div class="feature-shell">
      <aside class="feature-sidebar">
        <div class="grammar-stats">
          <div><strong>${done}/${items.length}</strong><span>已完成</span></div>
          <div><strong>${item.category}</strong><span>当前分类</span></div>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        <div class="feature-list">${renderList()}</div>
      </aside>
      <section class="feature-detail">
        <div class="grammar-detail-top">
          <span>${session.level} · ${escapeHtml(item.category)}</span>
          <strong>${record.completed ? "已完成" : "训练中"}</strong>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="feature-goal">${escapeHtml(item.goal)}</p>
        <div class="feature-sample-wrap">
          ${
            featureKey === "listening"
              ? `<button class="sound-button" type="button" data-feature-audio="${escapeHtml(item.sample)}">播放音频</button>`
              : ""
          }
          <div class="feature-sample">${escapeHtml(item.sample)}</div>
        </div>
        <div class="feature-steps">
          ${item.steps.map((step, index) => `<article><span>Step ${index + 1}</span><p>${escapeHtml(step)}</p></article>`).join("")}
        </div>
        <div class="grammar-example">
          <b>学习提示</b>
          <span>${escapeHtml(item.tip)}</span>
        </div>
        ${renderFeatureQuestion(item, record)}
        <div class="study-link-panel feature-test-cta">
          <span>学习模式</span>
          <h4>这里只做内容训练</h4>
          <p>读完材料和步骤后，进入独立测验页答题。</p>
          <a class="btn btn-dark" href="test.html?type=${encodeURIComponent(featureKey)}&level=${encodeURIComponent(session.level)}">进入 ${session.level} ${escapeHtml(featureData.name)}测验</a>
        </div>
      </section>
    </div>
  `;
  bind();
}

function bind() {
  document.querySelectorAll("[data-feature-index]").forEach((button) => {
    button.addEventListener("click", () => {
      session.index = Number(button.dataset.featureIndex);
      draw();
    });
  });
  document.querySelectorAll("[data-feature-audio]").forEach((button) => {
    button.addEventListener("click", () => {
      speakJapanese(button.dataset.featureAudio);
      button.textContent = "重播音频";
    });
  });
  document.querySelectorAll("[data-feature-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = currentItem();
      const answer = button.dataset.featureAnswer;
      const correct = answer === item.question.correct;
      const featureRecords = records();
      featureRecords[item.id] = {
        ...featureRecords[item.id],
        answer,
        completed: correct,
        completedAt: correct ? new Date().toISOString() : featureRecords[item.id]?.completedAt || "",
      };
      saveState();
      draw();
    });
  });
  document.querySelector("[data-feature-reset-answer]")?.addEventListener("click", () => {
    const item = currentItem();
    const featureRecords = records();
    featureRecords[item.id] = { ...featureRecords[item.id], answer: "", completed: false };
    saveState();
    draw();
  });
  document.querySelector("[data-feature-next]")?.addEventListener("click", () => {
    const items = currentItems();
    if (session.index < items.length - 1) {
      session.index += 1;
      draw();
    } else {
      showToast("N5 短句阅读完成啦，可以进入测验巩固。");
    }
  });
}

async function setLevel(level) {
  session.level = level;
  session.index = 0;
  document.querySelectorAll("[data-feature-level]").forEach((button) => {
    button.classList.toggle("active", button.dataset.featureLevel === level);
  });
  saveState();
  draw();
}

async function loadFeature() {
  const response = await fetch("data/features.json");
  const data = await response.json();
  featureData = data[featureKey];
  document.querySelector("#featureHeading").textContent = `${featureData.name}学习`;
  document.querySelector("#featureLead").textContent = featureData.description;
  document.querySelector("#featureTag").textContent = featureData.tag;
  document.querySelector("#featureStatus").textContent = `${featureData.name}训练`;
  document.querySelectorAll("[data-feature-level]").forEach((button) => {
    button.addEventListener("click", () => setLevel(button.dataset.featureLevel));
  });
  setLevel(session.level);
}

document.querySelector("#featureCompleteButton").addEventListener("click", async () => {
  window.location.href = `test.html?type=${encodeURIComponent(featureKey)}&level=${encodeURIComponent(session.level)}`;
});

loadFeature();
