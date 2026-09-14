import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { compose, exportBeepBoxBridge, exportMidi, renderWav, validateScore, type MusicBrief } from "../src/index.js";

function usage(): never {
  console.error("Usage: npm run compose -- <brief.json> [output-dir]");
  process.exit(2);
}

const briefPath = process.argv[2];
if (!briefPath) usage();
const outputDir = resolve(process.argv[3] ?? join(dirname(briefPath), `${basename(briefPath, ".json")}-out`));
const brief = JSON.parse(await readFile(resolve(briefPath), "utf8")) as MusicBrief;
const score = compose(brief);
const report = validateScore(score);

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(join(outputDir, "brief.json"), JSON.stringify(brief, null, 2)),
  writeFile(join(outputDir, "score.chiptune.json"), JSON.stringify(score, null, 2)),
  writeFile(join(outputDir, "validation.json"), JSON.stringify(report, null, 2)),
  writeFile(join(outputDir, "song.mid"), exportMidi(score)),
  writeFile(join(outputDir, "preview.wav"), renderWav(score)),
  writeFile(join(outputDir, "song.beepbox-bridge.json"), JSON.stringify(exportBeepBoxBridge(score), null, 2)),
]);

console.log(JSON.stringify({ outputDir, valid: report.valid, metrics: report.metrics }, null, 2));
process.exit(report.valid ? 0 : 1);
