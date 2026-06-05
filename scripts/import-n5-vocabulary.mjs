import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targetPath = path.join(root, "data", "vocabulary.json");

const required = ["id", "word", "kana", "meaning", "type", "example", "exampleMeaning"];
const vocabulary = JSON.parse(fs.readFileSync(targetPath, "utf8"));

function readLevel(level) {
  const sourcePath = path.join(root, "data", `${level.toLowerCase()}-vocabulary.tsv`);
  if (!fs.existsSync(sourcePath)) return null;

  const lines = fs.readFileSync(sourcePath, "utf8").trim().split(/\r?\n/);
  const header = lines.shift().split("\t");

  for (const key of required) {
    if (!header.includes(key)) {
      throw new Error(`Missing ${level} TSV column: ${key}`);
    }
  }

  const words = lines.map((line, index) => {
    const columns = line.split("\t");
    if (columns.length !== header.length) {
      throw new Error(`Bad ${level} TSV row ${index + 2}: expected ${header.length} columns, got ${columns.length}`);
    }

    return Object.fromEntries(header.map((key, columnIndex) => [key, columns[columnIndex].trim()]));
  });

  const ids = new Set();
  const wordKanaPairs = new Set();

  for (const word of words) {
    for (const key of required) {
      if (!word[key]) {
        throw new Error(`Missing ${key} for ${level} row ${word.id || "(no id)"}`);
      }
    }

    if (ids.has(word.id)) {
      throw new Error(`Duplicate ${level} id: ${word.id}`);
    }
    ids.add(word.id);

    const wordKanaPair = `${word.word}|${word.kana}`;
    if (wordKanaPairs.has(wordKanaPair)) {
      throw new Error(`Duplicate ${level} word/kana pair: ${wordKanaPair}`);
    }
    wordKanaPairs.add(wordKanaPair);
  }

  return words;
}

const imported = [];
for (const level of ["N5", "N4", "N3", "N2", "N1"]) {
  const words = readLevel(level);
  if (!words) continue;
  vocabulary[level] = words;
  imported.push(`${level}:${words.length}`);
}

fs.writeFileSync(targetPath, `${JSON.stringify(vocabulary, null, 2)}\n`, "utf8");

console.log(`Imported vocabulary entries: ${imported.join(", ")}`);
