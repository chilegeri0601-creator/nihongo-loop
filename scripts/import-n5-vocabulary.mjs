import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "data", "n5-vocabulary.tsv");
const targetPath = path.join(root, "data", "vocabulary.json");

const required = ["id", "word", "kana", "meaning", "type", "example", "exampleMeaning"];
const lines = fs.readFileSync(sourcePath, "utf8").trim().split(/\r?\n/);
const header = lines.shift().split("\t");

for (const key of required) {
  if (!header.includes(key)) {
    throw new Error(`Missing TSV column: ${key}`);
  }
}

const words = lines.map((line, index) => {
  const columns = line.split("\t");
  if (columns.length !== header.length) {
    throw new Error(`Bad TSV row ${index + 2}: expected ${header.length} columns, got ${columns.length}`);
  }

  return Object.fromEntries(header.map((key, columnIndex) => [key, columns[columnIndex].trim()]));
});

const ids = new Set();
const wordKanaPairs = new Set();

for (const word of words) {
  for (const key of required) {
    if (!word[key]) {
      throw new Error(`Missing ${key} for row ${word.id || "(no id)"}`);
    }
  }

  if (ids.has(word.id)) {
    throw new Error(`Duplicate id: ${word.id}`);
  }
  ids.add(word.id);

  const wordKanaPair = `${word.word}|${word.kana}`;
  if (wordKanaPairs.has(wordKanaPair)) {
    throw new Error(`Duplicate word/kana pair: ${wordKanaPair}`);
  }
  wordKanaPairs.add(wordKanaPair);
}

const vocabulary = JSON.parse(fs.readFileSync(targetPath, "utf8"));
vocabulary.N5 = words;
fs.writeFileSync(targetPath, `${JSON.stringify(vocabulary, null, 2)}\n`, "utf8");

console.log(`Imported ${words.length} N5 vocabulary entries.`);
