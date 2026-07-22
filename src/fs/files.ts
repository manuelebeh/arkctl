import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const TOKEN_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export function applyTokens(input: string, vars: Record<string, string>): string {
  return input.replace(TOKEN_RE, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

export function copyTemplateDir(
  from: string,
  to: string,
  vars: Record<string, string>,
): void {
  mkdirSync(to, { recursive: true });

  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const destName = applyTokens(entry, vars);
    const dest = join(to, destName);
    const st = statSync(src);

    if (st.isDirectory()) {
      copyTemplateDir(src, dest, vars);
      continue;
    }

    const content = readFileSync(src, "utf8");
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, applyTokens(content, vars), "utf8");
  }
}

export function pathExists(path: string): boolean {
  return existsSync(path);
}

export function copyDir(from: string, to: string): void {
  cpSync(from, to, { recursive: true });
}

export function listFilesRecursive(root: string): string[] {
  const out: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else {
        out.push(relative(root, full).split("\\").join("/"));
      }
    }
  }

  if (existsSync(root)) {
    walk(root);
  }
  return out;
}
