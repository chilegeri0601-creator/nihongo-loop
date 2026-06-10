import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const vocabularyPath = path.join(root, "data", "vocabulary.json");
const levels = [
  { level: "N2", min: 1000 },
  { level: "N1", min: 2000 },
];

const vocabulary = JSON.parse(fs.readFileSync(vocabularyPath, "utf8"));

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function typeFromPos(pos) {
  const raw = normalizeText(pos).toLowerCase();
  const types = [];
  if (/\bn\b/.test(raw)) types.push("名词");
  if (/\bvs\b|v[1-5]|vk|vz|vt|vi/.test(raw)) types.push("动词");
  if (/adj-i|adj-na|adj-no|adj-pn|adj-t|adj-f/.test(raw)) types.push("形容词");
  if (/\badv\b|adv-to/.test(raw)) types.push("副词");
  if (/\bprt\b/.test(raw)) types.push("助词");
  if (/\bconj\b/.test(raw)) types.push("接续词");
  if (/\bexp\b/.test(raw)) types.push("表达");
  if (/\bpref\b/.test(raw)) types.push("前缀");
  if (/\bsuf\b/.test(raw)) types.push("接尾词");
  if (/\bpn\b/.test(raw)) types.push("代词");
  return [...new Set(types)].join("/") || "词汇";
}

function splitExample(exampleText, word) {
  const lines = String(exampleText || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const japaneseLine = lines.find((line) => /[\u3040-\u30ff\u3400-\u9fff]/.test(line));
  const japaneseIndex = japaneseLine ? lines.indexOf(japaneseLine) : -1;
  const englishLine = japaneseIndex >= 0 ? lines.slice(japaneseIndex + 1).find((line) => !/[\u3040-\u30ff\u3400-\u9fff]/.test(line)) : "";
  return {
    example: japaneseLine || `「${word}」を使って文を作ります。`,
    exampleMeaning: englishLine || `用「${word}」造句。`,
  };
}

function parsePayload(payload, level) {
  const key = `vocabulary-list-${level.toLowerCase()}`;
  const listIndex = payload[2]?.[key];
  const itemIndices = payload[listIndex];
  if (!Array.isArray(itemIndices)) throw new Error(`${level} vocabulary list not found in payload`);

  return itemIndices.map((itemIndex, position) => {
    const item = payload[itemIndex];
    const word = normalizeText(payload[item.Kanji]);
    const kana = normalizeText(payload[item.Kana]);
    const pos = normalizeText(payload[item.POS]);
    const meaning = normalizeText(payload[item.Meaning]);
    const { example, exampleMeaning } = splitExample(payload[item.Example], word || kana);
    return {
      id: `${level.toLowerCase()}-${position + 1}-${slug(kana || word) || position + 1}`,
      word: word || kana,
      kana: kana || word,
      meaning,
      type: typeFromPos(pos),
      example,
      exampleMeaning,
    };
  });
}

async function fetchLevel({ level, min }) {
  const sourcePageUrl = `https://www.gyanmirai.com/jlpt/jlpt-${level.toLowerCase()}/vocabulary-list`;
  const pageHtml = await (await fetch(sourcePageUrl)).text();
  const payloadHref = pageHtml.match(/href="([^"]*_payload\.json[^"]*)"/)?.[1];
  if (!payloadHref) throw new Error(`${level} payload URL not found`);
  const payloadUrl = new URL(payloadHref, sourcePageUrl).href;
  const payload = JSON.parse(await (await fetch(payloadUrl)).text());

  const existingByPair = new Map((vocabulary[level] || []).map((word) => [`${word.word}|${word.kana}`, word]));
  const seen = new Set();
  const merged = [];
  for (const row of parsePayload(payload, level)) {
    const key = `${row.word}|${row.kana}`;
    if (!row.word || !row.kana || !row.meaning || seen.has(key)) continue;
    seen.add(key);
    const existing = existingByPair.get(key);
    merged.push({ ...(existing || {}), ...row, id: existing?.id || row.id });
  }
  if (merged.length < min) throw new Error(`${level} vocabulary import too small: ${merged.length}`);
  return merged;
}

for (const levelConfig of levels) {
  const words = await fetchLevel(levelConfig);
  vocabulary[levelConfig.level] = words;
  const tsvPath = path.join(root, "data", `${levelConfig.level.toLowerCase()}-vocabulary.tsv`);
  fs.writeFileSync(
    tsvPath,
    ["id\tword\tkana\tmeaning\ttype\texample\texampleMeaning", ...words.map((word) => [word.id, word.word, word.kana, word.meaning, word.type, word.example, word.exampleMeaning].join("\t"))].join("\n") + "\n",
  );
  console.log(`${levelConfig.level} vocabulary: ${words.length}`);
}

fs.writeFileSync(vocabularyPath, `${JSON.stringify(vocabulary, null, 2)}\n`);
