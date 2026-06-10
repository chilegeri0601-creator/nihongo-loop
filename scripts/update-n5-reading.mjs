import fs from "node:fs";

const path = "data/features.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

data.reading.description =
  "N5 使用阅读理解题模式：先读日语文本并作答，答完后再显示中文意思和解析；N4-N1 逐步进入通知、邮件、观点文和长文。";

data.reading.levels.N5 = [
  {
    id: "reading-n5-sentence-family",
    category: "短句理解",
    title: "家人在家",
    goal: "只看日语句子，回答具体信息题。",
    steps: ["读原文", "看题目", "答后看中文解析"],
    sample: "お母さんはうちにいます。",
    translation: "妈妈在家。",
    tip: "题目问“谁在家”。原文开头的「お母さん」就是人物。",
    question: {
      text: "谁在家？",
      options: ["お母さん", "お父さん", "わたし"],
      correct: "お母さん",
    },
  },
  {
    id: "reading-n5-sentence-time",
    category: "时间动作",
    title: "早上学习",
    goal: "根据日语原文判断时间和动作。",
    steps: ["读原文", "看题目", "答后看中文解析"],
    sample: "わたしは朝、日本語を勉強します。",
    translation: "我早上学习日语。",
    tip: "题目问“什么时候”。原文里的「朝」表示早上。",
    question: {
      text: "我什么时候学习日语？",
      options: ["朝", "夜", "日曜日"],
      correct: "朝",
    },
  },
  {
    id: "reading-n5-sentence-object",
    category: "物品判断",
    title: "这本书",
    goal: "根据日语原文判断物品是什么。",
    steps: ["读原文", "看题目", "答后看中文解析"],
    sample: "これは日本語の本です。",
    translation: "这是日语书。",
    tip: "题目问“这是什么”。「日本語の本」就是日语书。",
    question: {
      text: "这是什么？",
      options: ["日本語の本", "バス", "教室"],
      correct: "日本語の本",
    },
  },
  {
    id: "reading-n5-sentence-place",
    category: "地点理解",
    title: "去学校",
    goal: "根据日语原文判断人物去哪里。",
    steps: ["读原文", "看题目", "答后看中文解析"],
    sample: "山田さんは学校へ行きます。",
    translation: "山田去学校。",
    tip: "题目问“去哪里”。「学校へ行きます」表示去学校。",
    question: {
      text: "山田要去哪里？",
      options: ["学校", "うち", "店"],
      correct: "学校",
    },
  },
  {
    id: "reading-n5-sentence-like",
    category: "喜好表达",
    title: "喜欢水果",
    goal: "根据日语原文判断谁喜欢什么。",
    steps: ["读原文", "看题目", "答后看中文解析"],
    sample: "妹はりんごが好きです。",
    translation: "妹妹喜欢苹果。",
    tip: "题目问“喜欢什么”。「りんごが好きです」表示喜欢苹果。",
    question: {
      text: "妹妹喜欢什么？",
      options: ["りんご", "ご飯", "お茶"],
      correct: "りんご",
    },
  },
  {
    id: "reading-n5-sentence-negative",
    category: "否定句",
    title: "今天不下雨",
    goal: "根据日语原文判断否定内容。",
    steps: ["读原文", "看题目", "答后看中文解析"],
    sample: "今日は雨ではありません。",
    translation: "今天不是雨天。",
    tip: "题目问哪个说法正确。「雨ではありません」表示不是雨天。",
    question: {
      text: "关于今天，哪个说法正确？",
      options: ["雨ではありません", "大雨です", "テストがあります"],
      correct: "雨ではありません",
    },
  },
];

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
