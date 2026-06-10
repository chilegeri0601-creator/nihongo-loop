import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const grammarPath = path.join(root, "data", "grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const levels = {
  N4: { pages: 4, min: 120 },
  N3: { pages: 5, min: 170 },
  N2: { pages: 5, min: 190 },
  N1: { pages: 7, min: 240 },
};

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value) {
  return normalizeText(decodeHtml(String(value || "").replace(/<[^>]+>/g, " ")));
}

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getCells(rowHtml) {
  return rowHtml.split(/<td\b[^>]*>/i).slice(1);
}

function inferCategory(meaning, jp) {
  const text = `${meaning} ${jp}`.toLowerCase();
  if (/because|due to|reason|since|as a result|therefore|原因|ゆえ|ため/.test(text)) return "原因结果";
  if (/if|when|case|unless|条件|ば|たら|なら|場合/.test(text)) return "条件";
  if (/while|during|after|before|until|as soon as|time|間|ところ|うち|以来|最中/.test(text)) return "时间";
  if (/although|even if|despite|no matter|regardless|ても|けれど|ものの|ながら/.test(text)) return "让步";
  if (/rather|instead|compared|than|contrast|whereas|一方|わり|にしては|比べ/.test(text)) return "对比";
  if (/in order|so that|purpose|ため|ように/.test(text)) return "目的";
  if (/seems|looks|probably|must|supposed|apparently|よう|そう|らしい|はず/.test(text)) return "推量判断";
  if (/only|just|as long as|limited|限り|だけ|ばかり|しか/.test(text)) return "限定";
  if (/must|should|need|have to|べき|なければ|なくては/.test(text)) return "义务建议";
  if (/try|decide|plan|intend|つもり|ことにする|てみる/.test(text)) return "意志行动";
  if (/not|without|ない|ず|ぬ/.test(text)) return "否定";
  if (/honorific|humble|敬語|お.+になる|いただく|くださる/.test(text)) return "敬语";
  if (/quote|say|という|との|って/.test(text)) return "引用";
  if (/emphasis|very|even|こそ|さえ|まで/.test(text)) return "强调";
  return "常用表达";
}

function parseRows(html, level) {
  const rows = [];
  const chunks = html.split(/<tr class=jl-row>/).slice(1);
  for (const chunk of chunks) {
    const rowHtml = chunk.split(/<tr class=jl-row>|<\/table>|JLPT .*? Grammar List total/i)[0];
    const cells = getCells(rowHtml);
    if (cells.length < 4) continue;
    const number = Number(stripTags(cells[0]));
    const romaji = stripTags(cells[1]);
    const jp = stripTags(cells[2]);
    const meaning = stripTags(cells[3]);
    const href = (cells[2].match(/href=([^ >]+)/)?.[1] || cells[1].match(/href=([^ >]+)/)?.[1] || "").replace(/^"|"$/g, "");
    if (!number || !jp || !meaning || !href) continue;
    rows.push({
      id: `${level.toLowerCase()}-${number}-${slug(romaji || jp) || number}`,
      level,
      number,
      romaji,
      jp,
      meaning,
      detailUrl: new URL(href, "https://jlptsensei.com").href,
    });
  }
  return rows;
}

async function fetchList(level, pages) {
  const rows = [];
  for (let page = 1; page <= pages; page += 1) {
    const url = page === 1 ? `https://jlptsensei.com/jlpt-${level.toLowerCase()}-grammar-list/` : `https://jlptsensei.com/jlpt-${level.toLowerCase()}-grammar-list/page/${page}/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    rows.push(...parseRows(await response.text(), level));
  }
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.jp}|${row.meaning}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchExample(row) {
  try {
    const html = await (await fetch(row.detailUrl)).text();
    const exampleBlock = html.match(/id=example_1[\s\S]*?(?=<div class="example-cont|<div id=comments|<\/article>)/)?.[0] || "";
    const main = stripTags(exampleBlock.match(/example-main"><p[^>]*>([\s\S]*?)<\/div>/)?.[1] || "");
    const english = stripTags(exampleBlock.match(/id=example_1_en><div class="alert alert-primary">([\s\S]*?)<\/div>/)?.[1] || "");
    return {
      example: main || `「${row.jp}」を使って文を作ります。`,
      exampleMeaning: english || `这个例句使用「${row.jp}」这个语法。`,
    };
  } catch {
    return {
      example: `「${row.jp}」を使って文を作ります。`,
      exampleMeaning: `这个例句使用「${row.jp}」这个语法。`,
    };
  }
}

function buildPoint(row, example) {
  const category = inferCategory(row.meaning, row.jp);
  const meaning = `表示：${row.meaning}`;
  return {
    id: row.id,
    level: row.level,
    category,
    title: `${row.jp}：${row.romaji || row.meaning}`,
    pattern: row.jp,
    meaning,
    whenToUse: `阅读或造句时，用它表达“${row.meaning}”这一类关系。先看前后句，判断它是在说明时间、条件、原因、让步还是强调。`,
    structure: `${row.jp}。具体接续请结合前面的动词、名词、形容词普通形或ます形来判断。`,
    example: example.example,
    exampleMeaning: example.exampleMeaning,
    beginnerTip: `先把「${row.jp}」和核心语感“${row.meaning}”绑定，再通过例句记接续。`,
    commonMistake: "不要只按单词直译；高级语法更重要的是前后句关系和语气。",
    miniQuestion: {
      question: `「${row.jp}」主要表达什么？`,
      options: [meaning, "单纯列举物品", "动作对象"],
      correct: meaning,
      explanation: `「${row.jp}」的核心语感是：${row.meaning}。`,
    },
  };
}

for (const [level, config] of Object.entries(levels)) {
  const rows = await fetchList(level, config.pages);
  if (rows.length < config.min) throw new Error(`${level} grammar import too small: ${rows.length}`);
  const examples = await mapLimit(rows, 8, fetchExample);
  grammar[level] = rows.map((row, index) => buildPoint(row, examples[index]));
  console.log(`${level} grammar: ${grammar[level].length}`);
}

fs.writeFileSync(grammarPath, `${JSON.stringify(grammar, null, 2)}\n`);
