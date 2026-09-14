import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateScore, type ChiptuneScore } from "../src/index.js";

const scorePath = process.argv[2];
if (!scorePath) {
  console.error("Usage: npm run validate -- <score.chiptune.json>");
  process.exit(2);
}
const score = JSON.parse(await readFile(resolve(scorePath), "utf8")) as ChiptuneScore;
const report = validateScore(score);
console.log(JSON.stringify(report, null, 2));
process.exit(report.valid ? 0 : 1);
