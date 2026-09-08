import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const KITS_DIR = "kits";
const REQUIRED = [
  "01-hipaa-for-observers.md",
  "02-site-etiquette.md",
  "03-minors-consent-checklist.md",
  "04-day-of-checklist.md",
  "05-social-media-boundaries.md",
];

const SSN_PATTERN = /\b\d{3}-\d{2}-\d{4}\b/;

let failed = false;

for (const file of REQUIRED) {
  const path = join(KITS_DIR, file);
  if (!existsSync(path)) {
    console.error(`Missing kit: ${path}`);
    failed = true;
    continue;
  }
  const content = readFileSync(path, "utf8");
  if (SSN_PATTERN.test(content)) {
    console.error(`Possible SSN-like pattern in ${path}`);
    failed = true;
  }
}

const onDisk = readdirSync(KITS_DIR).filter((name) => name.endsWith(".md")).sort();
if (onDisk.length !== REQUIRED.length) {
  console.error(`Expected ${REQUIRED.length} kit files, found ${onDisk.length}`);
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log(`OK: ${REQUIRED.length} orientation kits present`);
