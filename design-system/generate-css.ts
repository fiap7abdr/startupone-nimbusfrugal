import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokens } from "./tokens";
import { sidebarKeyToCssVar, tokenKeyToCssVar } from "./utils";

const CSS_PATH = resolve(process.cwd(), "app/globals.css");
const ROOT_START = "/* >>> design-tokens:start */";
const ROOT_END = "/* <<< design-tokens:end */";

function buildRootBlock(): string {
  const lines: string[] = [];
  lines.push(ROOT_START);
  lines.push(":root {");
  for (const [k, v] of Object.entries(tokens.colors)) {
    lines.push(`  ${tokenKeyToCssVar(k)}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.sidebar)) {
    lines.push(`  ${sidebarKeyToCssVar(k)}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.spacing)) {
    lines.push(`  --spacing-${k}: ${v};`);
  }
  lines.push(`  --font-sans: ${tokens.typography.fontSans};`);
  lines.push(`  --font-mono: ${tokens.typography.fontMono};`);
  lines.push("}");
  lines.push(ROOT_END);
  return lines.join("\n");
}

function main() {
  const check = process.argv.includes("--check");
  const current = readFileSync(CSS_PATH, "utf8");
  const block = buildRootBlock();

  const startIdx = current.indexOf(ROOT_START);
  const endIdx = current.indexOf(ROOT_END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `Could not find design-tokens markers in ${CSS_PATH}. Add the start/end comments.`,
    );
  }
  const next =
    current.slice(0, startIdx) + block + current.slice(endIdx + ROOT_END.length);

  if (check) {
    if (next !== current) {
      console.error(
        "Design tokens out of sync. Run `npm run tokens` to regenerate.",
      );
      process.exit(1);
    }
    console.log("Design tokens in sync.");
    return;
  }

  writeFileSync(CSS_PATH, next, "utf8");
  console.log(`Wrote design tokens to ${CSS_PATH}`);
}

main();
