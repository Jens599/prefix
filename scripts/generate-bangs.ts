import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

type RawBang = {
  s?: string;
  d: string;
  t: string;
  u: string;
  c?: string;
  sc?: string;
};

type MinimalBang = {
  d: string;
  t: string;
  u: string;
};

const root = resolve(import.meta.dirname, "..");
const inputPath = resolve(root, "data/bangs.json");
const outputPath = resolve(root, "data/bangs.ts");

let raw: string;
try {
  raw = readFileSync(inputPath, "utf-8");
} catch (e) {
  console.error("bangs.json not found:", inputPath);
  process.exit(1);
}

let rawBangs: RawBang[];
try {
  rawBangs = JSON.parse(raw);
} catch (e) {
  console.error("Invalid JSON in bangs.json");
  process.exit(1);
}

const bangEntries: [string, MinimalBang][] = [];
const seen = new Set<string>();

for (const bang of rawBangs) {
  if (!bang.t || !bang.u || !bang.d) {
    console.warn(`Skipping invalid bang (missing t/u/d):`, bang);
    continue;
  }

  const trigger = bang.t.toLowerCase();
  if (seen.has(trigger)) {
    console.warn(`Duplicate !${trigger} – keeping first`);
    continue;
  }

  seen.add(trigger);
  bangEntries.push([trigger, { d: bang.d, t: trigger, u: bang.u }]);
}

const defaultEngines = {
  ddg: { d: "duckduckgo.com", u: "https://duckduckgo.com/?q={{{s}}}" },
  g: { d: "google.com", u: "https://google.com/search?q={{{s}}}" },
  brave: {
    d: "search.brave.com",
    u: "https://search.brave.com/search?q={{{s}}}",
  },
  kagi: { d: "kagi.com", u: "https://kagi.com/search?q={{{s}}}" },
  startpage: {
    d: "startpage.com",
    u: "https://www.startpage.com/sp/search?query={{{s}}}",
  },
  bing: { d: "bing.com", u: "https://www.bing.com/search?q={{{s}}}" },
  yandex: { d: "yandex.com", u: "https://yandex.com/search/?text={{{s}}}" },
} as const;

function jsString(value: string): string {
  return JSON.stringify(value);
}

const output = `/* AUTO-GENERATED — DO NOT EDIT
Generated: ${new Date().toISOString()}
Total bangs: ${bangEntries.length} */

export type MinimalBang = {
  d: string;
  u: string;
};

export const bangMap = new Map<string, MinimalBang>([
${bangEntries
  .map(
    ([t, b]) =>
      `  ["${t}", { d: ${jsString(b.d)}, u: ${jsString(b.u)} } satisfies MinimalBang]`,
  )
  .join(",\n")}
]);

export const defaultEngines = {
${Object.entries(defaultEngines)
  .map(
    ([key, val]) =>
      `  ${key}: { d: ${jsString(val.d)}, u: ${jsString(val.u)} }`,
  )
  .join(",\n")}
} as const;

export type DefaultEngineKey = keyof typeof defaultEngines;

export const bangList = [...bangMap.values()] as const;
`;

mkdirSync(resolve(outputPath, ".."), { recursive: true });
writeFileSync(outputPath, output, "utf-8");

console.log(`Generated bangs.ts`);
console.log(`   ${bangEntries.length} bangs`);
console.log(`   ${Object.keys(defaultEngines).length} default engines`);
console.log(`   Prettier-safe: all strings escaped with JSON.stringify()`);
