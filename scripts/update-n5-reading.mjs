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
    goal: "只看日语句子，选择与原文一致的内容。",
    steps: ["读原文", "选答案", "答后看中文解析"],
    sample: "お母さんはうちにいます。",
    translation: "妈妈在家。",
    tip: "「います」用于人或动物在某处。原文说的是妈妈在家。",
    question: {
      text: "本文の内容として正しいものはどれですか。",
      options: ["お母さんはうちにいます。", "お父さんは学校にいます。", "わたしは駅へ行きます。"],
      correct: "お母さんはうちにいます。",
    },
  },
  {
    id: "reading-n5-sentence-time",
    category: "时间动作",
    title: "早上学习",
    goal: "根据日语原文判断时间和动作。",
    steps: ["读原文", "选答案", "答后看中文解析"],
    sample: "わたしは朝、日本語を勉強します。",
    translation: "我早上学习日语。",
    tip: "「朝」是早上，「勉強します」是学习。",
    question: {
      text: "本文の内容として正しいものはどれですか。",
      options: ["わたしは朝、日本語を勉強します。", "わたしは夜、本を買います。", "先生はお茶を飲みます。"],
      correct: "わたしは朝、日本語を勉強します。",
    },
  },
  {
    id: "reading-n5-sentence-object",
    category: "物品判断",
    title: "这本书",
    goal: "根据日语原文判断物品是什么。",
    steps: ["读原文", "选答案", "答后看中文解析"],
    sample: "これは日本語の本です。",
    translation: "这是日语书。",
    tip: "「これは A です」表示“这是 A”。",
    question: {
      text: "本文の内容として正しいものはどれですか。",
      options: ["これは日本語の本です。", "それはバスです。", "ここは教室です。"],
      correct: "これは日本語の本です。",
    },
  },
  {
    id: "reading-n5-sentence-place",
    category: "地点理解",
    title: "去学校",
    goal: "根据日语原文判断人物去哪里。",
    steps: ["读原文", "选答案", "答后看中文解析"],
    sample: "山田さんは学校へ行きます。",
    translation: "山田去学校。",
    tip: "「へ行きます」表示“去某地”。",
    question: {
      text: "本文の内容として正しいものはどれですか。",
      options: ["山田さんは学校へ行きます。", "山田さんはうちで寝ます。", "山田さんは水を買います。"],
      correct: "山田さんは学校へ行きます。",
    },
  },
  {
    id: "reading-n5-sentence-like",
    category: "喜好表达",
    title: "喜欢水果",
    goal: "根据日语原文判断谁喜欢什么。",
    steps: ["读原文", "选答案", "答后看中文解析"],
    sample: "妹はりんごが好きです。",
    translation: "妹妹喜欢苹果。",
    tip: "「A が好きです」表示“喜欢 A”。",
    question: {
      text: "本文の内容として正しいものはどれですか。",
      options: ["妹はりんごが好きです。", "兄はりんごが好きではありません。", "妹はご飯を食べています。"],
      correct: "妹はりんごが好きです。",
    },
  },
  {
    id: "reading-n5-sentence-negative",
    category: "否定句",
    title: "今天不下雨",
    goal: "根据日语原文判断否定内容。",
    steps: ["读原文", "选答案", "答后看中文解析"],
    sample: "今日は雨ではありません。",
    translation: "今天不是雨天。",
    tip: "「ではありません」是否定，意思是“不是”。",
    question: {
      text: "本文の内容として正しいものはどれですか。",
      options: ["今日は雨ではありません。", "今日は大雨です。", "明日はテストがあります。"],
      correct: "今日は雨ではありません。",
    },
  },
];

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
