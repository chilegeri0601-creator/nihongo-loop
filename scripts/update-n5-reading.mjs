import fs from "node:fs";

const path = "data/features.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

data.reading.description =
  "N5 从简单句子开始，读完马上做一句话理解题；N4-N1 再逐步进入通知、邮件、观点文和长文。";

data.reading.levels.N5 = [
  {
    id: "reading-n5-sentence-family",
    category: "短句理解",
    title: "家人在家",
    goal: "读懂一句简单日语，判断这句话在说谁、在哪里、做什么。",
    steps: ["先看主语是谁", "再看地点或时间", "最后看动作"],
    sample: "お母さんはうちにいます。",
    tip: "「います」用于人或动物在某处。这里的重点是：妈妈在家。",
    question: {
      text: "这句话讲了什么？",
      options: ["妈妈在家", "爸爸在学校", "我去车站"],
      correct: "妈妈在家",
    },
  },
  {
    id: "reading-n5-sentence-time",
    category: "时间动作",
    title: "早上学习",
    goal: "读懂时间词和动作，判断句子的主要内容。",
    steps: ["找时间词", "找动作词", "把谁做什么连起来"],
    sample: "わたしは朝、日本語を勉強します。",
    tip: "「朝」是早上，「勉強します」是学习。",
    question: {
      text: "这句话讲了什么？",
      options: ["我早上学习日语", "我晚上买书", "老师喝茶"],
      correct: "我早上学习日语",
    },
  },
  {
    id: "reading-n5-sentence-object",
    category: "物品判断",
    title: "这本书",
    goal: "读懂「これ / それ / あれ」和名词说明。",
    steps: ["先看指示词", "再看名词", "最后看判断句"],
    sample: "これは日本語の本です。",
    tip: "「これは A です」表示“这是 A”。",
    question: {
      text: "这句话讲了什么？",
      options: ["这是日语书", "那是公交车", "这里是教室"],
      correct: "这是日语书",
    },
  },
  {
    id: "reading-n5-sentence-place",
    category: "地点理解",
    title: "去学校",
    goal: "读懂地点和移动动词。",
    steps: ["找地点", "看助词へ", "确认去哪里"],
    sample: "山田さんは学校へ行きます。",
    tip: "「へ行きます」表示“去某地”。",
    question: {
      text: "这句话讲了什么？",
      options: ["山田去学校", "山田在家睡觉", "山田买了水"],
      correct: "山田去学校",
    },
  },
  {
    id: "reading-n5-sentence-like",
    category: "喜好表达",
    title: "喜欢水果",
    goal: "读懂「好きです」表达喜欢什么。",
    steps: ["找谁喜欢", "找喜欢的对象", "确认肯定或否定"],
    sample: "妹はりんごが好きです。",
    tip: "「A が好きです」表示“喜欢 A”。",
    question: {
      text: "这句话讲了什么？",
      options: ["妹妹喜欢苹果", "哥哥不喜欢苹果", "妹妹在吃米饭"],
      correct: "妹妹喜欢苹果",
    },
  },
  {
    id: "reading-n5-sentence-negative",
    category: "否定句",
    title: "今天不下雨",
    goal: "读懂简单否定句。",
    steps: ["找时间", "看天气词", "注意ありません"],
    sample: "今日は雨ではありません。",
    tip: "「ではありません」是否定，意思是“不是”。",
    question: {
      text: "这句话讲了什么？",
      options: ["今天不是雨天", "今天下大雨", "明天有考试"],
      correct: "今天不是雨天",
    },
  },
];

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
