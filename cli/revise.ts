import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviseScore, validateScore, type ChiptuneScore, type RevisionRequest } from "../src/index.js";

const scorePath = process.argv[2];
const requestPath = process.argv[3];
const outputPath = process.argv[4] ?? "score.revised.chiptune.json";
if (!scorePath || !requestPath) {
  console.error("Usage: tsx cli/revise.ts <score.json> <revision.json> [output.json]");
  process.exit(2);
}
const score = JSON.parse(await readFile(resolve(scorePath), "utf8")) as ChiptuneScore;
const request = JSON.parse(await readFile(resolve(requestPath), "utf8")) as RevisionRequest;
const revised = reviseScore(score, request);
const report = validateScore(revised);
await writeFile(resolve(outputPath), JSON.stringify(revised, null, 2));
console.log(JSON.stringify({ outputPath: resolve(outputPath), valid: report.valid, metrics: report.metrics }, null, 2));
process.exit(report.valid ? 0 : 1);
