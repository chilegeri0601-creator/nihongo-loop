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
const readingUnitSize = 5;
const listeningGroupSize = 5;

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

function readingUnitCount() {
  return Math.max(1, Math.ceil(currentItems().length / readingUnitSize));
}

function currentReadingUnitIndex() {
  return Math.floor(session.index / readingUnitSize);
}

function readingUnitRange(unitIndex = currentReadingUnitIndex()) {
  const items = currentItems();
  const start = unitIndex * readingUnitSize;
  const end = Math.min(start + readingUnitSize, items.length);
  return { start, end, items: items.slice(start, end) };
}

function renderReadingUnits() {
  if (featureKey !== "reading") return "";
  const activeUnit = currentReadingUnitIndex();
  return `
    <div class="reading-unit-panel">
      <span>阅读单元</span>
      <strong>每单元 ${readingUnitSize} 题</strong>
      <div class="reading-unit-tabs">
        ${Array.from({ length: readingUnitCount() }, (_, unitIndex) => {
          const range = readingUnitRange(unitIndex);
          const done = range.items.filter((item) => records()[item.id]?.completed).length;
          return `
            <button type="button" class="${unitIndex === activeUnit ? "active" : ""}" data-reading-unit="${unitIndex}">
              <b>${unitIndex + 1}</b>
              <em>${done}/${range.items.length}</em>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderList() {
  const range = featureKey === "reading" ? readingUnitRange() : { start: 0, items: currentItems() };
  return range.items
    .map((item, offset) => {
      const index = range.start + offset;
      const done = Boolean(records()[item.id]?.completed);
      const label = featureKey === "reading" ? "読解" : item.category;
      const title = featureKey === "reading" ? `第 ${index + 1} 题` : item.title;
      return `
        <button type="button" class="feature-list-item ${index === session.index ? "current" : ""} ${done ? "completed" : ""}" data-feature-index="${index}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(title)}</strong>
          <em>${done ? "已完成" : "待训练"}</em>
        </button>
      `;
    })
    .join("");
}

function completedCount() {
  return currentItems().filter((item) => records()[item.id]?.completed).length;
}

function currentListeningGroupIndex() {
  return Math.floor(session.index / listeningGroupSize);
}

function listeningGroupRange(groupIndex = currentListeningGroupIndex()) {
  const items = currentItems();
  const start = groupIndex * listeningGroupSize;
  const end = Math.min(start + listeningGroupSize, items.length);
  return { start, end, items: items.slice(start, end) };
}

function renderListeningTrainer(item, record, items, done, percent) {
  const range = listeningGroupRange();
  return `
    <div class="listening-shell">
      <section class="listening-card">
        <div class="listening-topline">
          <span>${session.level} · ${escapeHtml(item.category)}</span>
          <strong>${session.index + 1}/${items.length}</strong>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.goal)}</p>
        <button class="sound-button listening-play" type="button" data-feature-audio="${escapeHtml(item.sample)}">
          播放音频
        </button>
        <div class="listening-actions">
          <button class="btn btn-light" type="button" data-feature-prev ${session.index === 0 ? "disabled" : ""}>上一题</button>
          <button class="btn btn-dark" type="button" data-listening-complete>${record.completed ? "已听懂" : "标记已听懂"}</button>
          <button class="btn btn-light" type="button" data-feature-next>${session.index >= items.length - 1 ? "完成" : "下一题"}</button>
        </div>
        <details class="listening-transcript">
          <summary>查看原文和提示</summary>
          <div class="feature-sample">${escapeHtml(item.sample)}</div>
          <p>${escapeHtml(item.tip)}</p>
        </details>
      </section>
      <aside class="listening-side">
        <div class="grammar-stats">
          <div><strong>${done}/${items.length}</strong><span>已听懂</span></div>
          <div><strong>${range.start + 1}-${range.end}</strong><span>当前小组</span></div>
        </div>
        <div class="listening-group">
          <span>本组练习</span>
          <div>
            ${range.items
              .map((groupItem, offset) => {
                const index = range.start + offset;
                const completed = Boolean(records()[groupItem.id]?.completed);
                return `
                  <button type="button" class="${index === session.index ? "active" : ""} ${completed ? "completed" : ""}" data-feature-index="${index}">
                    ${index + 1}
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
        <div class="study-link-panel feature-test-cta">
          <span>测验模式</span>
          <h4>进入 ${session.level} 听力测验</h4>
          <p>学习页只保留播放、标记和切换题目；集中答题请进入独立测验页。</p>
          <a class="btn btn-dark" href="test.html?type=${encodeURIComponent(featureKey)}&level=${encodeURIComponent(session.level)}">开始测验</a>
        </div>
      </aside>
    </div>
  `;
}

function renderFeatureQuestion(item, record) {
  if (featureKey !== "reading" || !item.question) return "";
  const answered = Boolean(record.answer);
  const correct = record.answer === item.question.correct;
  const explanation = answered
    ? `<div class="feature-reading-explain">
        <b>${correct ? "回答正确" : "答案解析"}</b>
        <p>中文意思：${escapeHtml(item.translation || "")}</p>
        <p>${escapeHtml(item.tip || "")}</p>
      </div>`
    : "";
  return `
    <div class="feature-question-card ${answered ? (correct ? "correct" : "wrong") : ""}">
      <span>読解問題</span>
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
            ? "答对了。下面可以看中文意思和解析。"
            : `还差一点。正确答案是：${escapeHtml(item.question.correct)}`
          : "请只根据上面的日语文本选择正确答案。"
      }</p>
      ${explanation}
      <div class="feature-question-actions">
        <button class="btn btn-light" type="button" data-feature-reset-answer>重新选择</button>
        <button class="btn btn-dark" type="button" data-feature-next ${correct ? "" : "disabled"}>下一题</button>
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
  const readingMode = featureKey === "reading";
  const listeningMode = featureKey === "listening";
  const readingRange = readingMode ? readingUnitRange() : null;
  document.querySelector("#featureTitle").textContent = `${session.level} ${featureData.name}训练`;
  if (listeningMode) {
    document.querySelector("#featureContent").innerHTML = renderListeningTrainer(item, record, items, done, percent);
    bind();
    return;
  }
  document.querySelector("#featureContent").innerHTML = `
    <div class="feature-shell">
      <aside class="feature-sidebar">
        <div class="grammar-stats">
          <div><strong>${done}/${items.length}</strong><span>已完成</span></div>
          <div><strong>${readingMode ? `${currentReadingUnitIndex() + 1}/${readingUnitCount()}` : item.category}</strong><span>${readingMode ? "当前单元" : "当前分类"}</span></div>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        ${readingMode ? renderReadingUnits() : ""}
        ${readingMode ? `<div class="reading-unit-note">当前单元：第 ${readingRange.start + 1}-${readingRange.end} 题</div>` : ""}
        <div class="feature-list">${renderList()}</div>
      </aside>
      <section class="feature-detail">
        <div class="grammar-detail-top">
          <span>${session.level} · ${escapeHtml(readingMode ? "読解" : item.category)}</span>
          <strong>${record.completed ? "已完成" : "训练中"}</strong>
        </div>
        <h3>${escapeHtml(readingMode ? `阅读题 ${session.index + 1}` : item.title)}</h3>
        ${readingMode ? "" : `<p class="feature-goal">${escapeHtml(item.goal)}</p>`}
        <div class="feature-sample-wrap ${readingMode ? "reading-passage" : ""}">
          ${
            featureKey === "listening"
              ? `<button class="sound-button" type="button" data-feature-audio="${escapeHtml(item.sample)}">播放音频</button>`
              : ""
          }
          <div class="feature-sample">${escapeHtml(item.sample)}</div>
        </div>
        ${
          readingMode
            ? ""
            : `<div class="feature-steps">
                ${item.steps.map((step, index) => `<article><span>Step ${index + 1}</span><p>${escapeHtml(step)}</p></article>`).join("")}
              </div>
              <div class="grammar-example">
                <b>学习提示</b>
                <span>${escapeHtml(item.tip)}</span>
              </div>`
        }
        ${renderFeatureQuestion(item, record)}
        <div class="study-link-panel feature-test-cta">
          <span>学习模式</span>
          <h4>${readingMode ? "像考试一样做阅读理解" : "这里只做内容训练"}</h4>
          <p>${readingMode ? "先在这里完成短句理解，也可以进入独立测验页集中练习。" : "读完材料和步骤后，进入独立测验页答题。"}</p>
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
  document.querySelectorAll("[data-reading-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      session.index = Number(button.dataset.readingUnit) * readingUnitSize;
      draw();
    });
  });
  document.querySelectorAll("[data-feature-audio]").forEach((button) => {
    button.addEventListener("click", () => {
      speakJapanese(button.dataset.featureAudio);
      button.textContent = "重播音频";
    });
  });
  document.querySelector("[data-feature-prev]")?.addEventListener("click", () => {
    if (session.index > 0) {
      session.index -= 1;
      draw();
    }
  });
  document.querySelector("[data-listening-complete]")?.addEventListener("click", () => {
    const item = currentItem();
    const featureRecords = records();
    featureRecords[item.id] = {
      ...featureRecords[item.id],
      completed: true,
      completedAt: featureRecords[item.id]?.completedAt || new Date().toISOString(),
    };
    saveState();
    if (session.index < currentItems().length - 1) {
      session.index += 1;
    }
    draw();
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
      showToast(`${session.level} ${featureData.name}完成啦，可以进入测验巩固。`);
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
