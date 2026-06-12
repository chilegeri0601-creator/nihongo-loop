import fs from "node:fs";

const path = "data/features.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const levelMeta = {
  N5: {
    category: "基础听辨",
    goal: "听懂基础人物、地点、时间和动作。",
    steps: ["先听关键词", "再判断题目问什么", "最后选择对应答案"],
    tip: "N5 听力先抓人物、时间、地点和动作，句子短，关键词就是答案线索。",
  },
  N4: {
    category: "场景听辨",
    goal: "听懂通知、请求、时间变化和简单原因。",
    steps: ["先听场景", "抓住原因或要求", "确认该做什么"],
    tip: "N4 听力常出现 ので、ため、までに、場合は，要注意原因和行动要求。",
  },
  N3: {
    category: "短文听解",
    goal: "听懂两三句短文中的转折、理由和说话人态度。",
    steps: ["听第一句找主题", "听转折或理由", "判断说话人真正想表达什么"],
    tip: "N3 听力要特别注意 しかし、ただ、そのため、より 等连接词。",
  },
  N2: {
    category: "实用听解",
    goal: "听懂公告、邮件、说明和观点中的条件与重点。",
    steps: ["听清对象", "抓住限制条件", "选择最符合原文的答案"],
    tip: "N2 听力经常把重要信息放在 ただし、に限り、必要だ、予定だ 后面。",
  },
  N1: {
    category: "综合听解",
    goal: "听懂抽象观点、对比关系和作者真正强调的内容。",
    steps: ["先听主题", "留意否定和转折", "判断最后强调的观点"],
    tip: "N1 听力不要只听表面词，要抓 ではない、むしろ、だけでなく 后面的论点。",
  },
};

function buildListeningItem(level, readingItem, index) {
  const meta = levelMeta[level];
  return {
    id: `listening-${level.toLowerCase()}-${String(index + 1).padStart(2, "0")}-${readingItem.id.replace(/^reading-[a-z0-9]+-\d+-/, "")}`,
    category: meta.category,
    title: `${level} 听力题 ${index + 1}`,
    goal: meta.goal,
    steps: meta.steps,
    sample: readingItem.sample,
    tip: `${meta.tip} ${readingItem.tip || ""}`.trim(),
    question: {
      text: readingItem.question.text,
      options: readingItem.question.options,
      correct: readingItem.question.correct,
    },
  };
}

data.listening.description =
  "N5-N1 听力理解题库：点击播放后先听日语音频，再根据听到的内容选择答案。";

for (const level of ["N5", "N4", "N3", "N2", "N1"]) {
  data.listening.levels[level] = (data.reading.levels[level] || []).map((item, index) =>
    buildListeningItem(level, item, index),
  );
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
