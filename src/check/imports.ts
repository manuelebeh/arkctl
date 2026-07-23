import { readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import type {
  ArchitectureManifest,
  CheckIssue,
  Conventions,
  ImportRule,
} from "../types.js";
import { matchImportGlob, matchSimpleGlob } from "./glob.js";
import { resolveSeverity } from "./severity.js";

const JS_SOURCE_EXT = /\.(tsx?|jsx?|mts|cts)$/;
const PHP_SOURCE_EXT = /\.php$/;
const SKIP_DIR = /^(node_modules|dist|vendor|\.git)(\/|$)/;

const IMPORT_RE =
  /(?:import\s+(?:type\s+)?(?:[^"'`]+?\s+from\s+)?|export\s+(?:type\s+)?(?:[^"'`]+?\s+from\s+)|(?:import|require)\s*\(\s*)['"]([^'"]+)['"]/g;

const PHP_USE_RE =
  /^use\s+(?!function\b|const\b)([A-Za-z_][A-Za-z0-9_\\]*)(?:\s+as\s+[A-Za-z_][A-Za-z0-9_]*)?\s*;/gm;

export function parseModulesPath(pathPattern: string): {
  parentDir: string;
  placeholder: string;
} {
  const trimmed = pathPattern.replace(/\/$/, "");
  const parts = trimmed.split("/");
  const last = parts[parts.length - 1] ?? "";
  if (!last.startsWith(":") || parts.length < 2) {
    throw new Error(
      `Invalid modules.path "${pathPattern}" (expected e.g. features/:name)`,
    );
  }
  return {
    parentDir: parts.slice(0, -1).join("/"),
    placeholder: last.slice(1),
  };
}

export function checkImports(
  projectRoot: string,
  files: string[],
  conventions: Conventions,
  manifest: ArchitectureManifest,
  modulesPath?: string,
): CheckIssue[] {
  const deny = conventions.imports?.deny ?? [];
  const allow = conventions.imports?.allow ?? [];
  const crossModuleBlocked =
    conventions.placement?.cross_module_imports === false;
  const publicApi = conventions.placement?.public_api;

  if (deny.length === 0 && !crossModuleBlocked) {
    return [];
  }

  const issues: CheckIssue[] = [];
  const sourceFiles = files.filter(
    (f) =>
      (JS_SOURCE_EXT.test(f) || PHP_SOURCE_EXT.test(f)) && !SKIP_DIR.test(f),
  );

  for (const file of sourceFiles) {
    const abs = join(projectRoot, file);
    let content: string;
    try {
      content = readFileSync(abs, "utf8");
    } catch {
      continue;
    }

    const isPhp = PHP_SOURCE_EXT.test(file);
    const targets = isPhp
      ? extractPhpImportTargets(content, files)
      : extractJsImportTargets(file, content, files);

    for (const target of targets) {
      const fromModule = modulesPath
        ? moduleName(file, modulesPath)
        : null;
      const toModule = modulesPath
        ? moduleName(target, modulesPath)
        : null;

      if (matchesAnyRule(file, target, allow)) {
        continue;
      }

      const denyRule = findMatchingRule(file, target, deny);
      if (denyRule) {
        issues.push({
          severity: resolveSeverity(
            manifest,
            "denied-import",
            denyRule.severity,
          ),
          code: "denied-import",
          message: `Import from "${file}" to "${target}" is denied (${denyRule.from} → ${denyRule.to})`,
          path: file,
        });
        continue;
      }

      if (fromModule && toModule && fromModule === toModule) {
        continue;
      }

      if (
        crossModuleBlocked &&
        modulesPath &&
        publicApi &&
        fromModule &&
        toModule &&
        fromModule !== toModule &&
        !isPublicApi(target, toModule, publicApi)
      ) {
        issues.push({
          severity: resolveSeverity(manifest, "cross-module-import"),
          code: "cross-module-import",
          message: `Cross-module import from "${fromModule}" to "${toModule}" must go through the public API`,
          path: file,
        });
      }
    }
  }

  return issues;
}

function extractJsImportTargets(
  file: string,
  content: string,
  files: string[],
): string[] {
  const out: string[] = [];
  for (const specifier of extractImportSpecifiers(content)) {
    const target = resolveRelativeImport(file, specifier, files);
    if (target) out.push(target);
  }
  return out;
}

function extractPhpImportTargets(content: string, files: string[]): string[] {
  const out: string[] = [];
  for (const fqcn of extractPhpUseNames(content)) {
    const target = resolvePhpUseToPath(fqcn, files);
    if (target) out.push(target);
  }
  return out;
}

function extractImportSpecifiers(content: string): string[] {
  const out: string[] = [];
  IMPORT_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = IMPORT_RE.exec(content)) !== null) {
    out.push(match[1]!);
  }
  return out;
}

function extractPhpUseNames(content: string): string[] {
  const out: string[] = [];
  PHP_USE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PHP_USE_RE.exec(content)) !== null) {
    const name = match[1]!;
    // Skip grouped use Foo\{Bar, Baz}
    if (name.includes("{")) continue;
    out.push(name);
  }
  return out;
}

/**
 * Map a PHP FQCN to a project-relative path (best-effort PSR-4 heuristics).
 */
export function resolvePhpUseToPath(
  fqcn: string,
  files: string[],
): string | null {
  const parts = fqcn.split("\\").filter(Boolean);
  if (parts.length < 2) return null;

  const candidates: string[] = [];
  const root = parts[0]!;

  if (root === "App") {
    candidates.push(joinPosix(["app", ...parts.slice(1)]) + ".php");
  } else if (root === "Shared") {
    candidates.push(joinPosix(["shared", ...parts.slice(1)]) + ".php");
    candidates.push(joinPosix(["app", "Shared", ...parts.slice(1)]) + ".php");
  } else if (root === "Modules") {
    const moduleName = parts[1];
    const rest = parts.slice(2);
    if (moduleName) {
      // nwidart: Modules\Accounts\* → Modules/Accounts/app/*
      candidates.push(
        joinPosix(["Modules", moduleName, "app", ...rest]) + ".php",
      );
      // InterNACHI: Modules\Accounts\* → app-modules/accounts/src/*
      candidates.push(
        joinPosix([
          "app-modules",
          pascalToKebab(moduleName),
          "src",
          ...rest,
        ]) + ".php",
      );
    }
  }

  if (candidates.length === 0) return null;

  const fileSet = new Set(files);
  for (const c of candidates) {
    if (fileSet.has(c)) return c;
  }
  return candidates[0] ?? null;
}

function joinPosix(parts: string[]): string {
  return parts.filter(Boolean).join("/");
}

function pascalToKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/** Resolve relative imports only; returns project-relative path or null. */
function resolveRelativeImport(
  fromFile: string,
  specifier: string,
  files: string[],
): string | null {
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
    return null;
  }

  const fromDir = dirname(fromFile);
  const joined = normalize(join(fromDir, specifier)).split("\\").join("/");
  const normalized = joined.replace(/^\.\//, "");

  if (normalized.startsWith("..") || normalized.includes("/../")) {
    return null;
  }

  const candidates = [
    normalized,
    `${normalized}.ts`,
    `${normalized}.tsx`,
    `${normalized}.js`,
    `${normalized}.jsx`,
    `${normalized}.mts`,
    `${normalized}.cts`,
    `${normalized}.php`,
    `${normalized}/index.ts`,
    `${normalized}/index.tsx`,
    `${normalized}/index.js`,
    `${normalized}/index.jsx`,
    `${normalized}/index.php`,
  ];

  const fileSet = new Set(files);
  for (const c of candidates) {
    if (fileSet.has(c)) return c;
  }

  // Still return the best-effort path so glob rules can match missing files
  // that clearly target a module tree (e.g. ../other/ui/Foo).
  return normalized;
}

function moduleName(path: string, modulesPath: string): string | null {
  const { parentDir } = parseModulesPath(modulesPath);
  const escaped = parentDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`^${escaped}/([^/]+)/`).exec(path);
  return m?.[1] ?? null;
}

function matchesAnyRule(
  from: string,
  to: string,
  rules: ImportRule[],
): boolean {
  return findMatchingRule(from, to, rules) !== undefined;
}

function findMatchingRule(
  from: string,
  to: string,
  rules: ImportRule[],
): ImportRule | undefined {
  return rules.find(
    (rule) =>
      matchImportGlob(from, rule.from) && matchImportGlob(to, rule.to),
  );
}

function isPublicApi(
  target: string,
  name: string,
  publicApiPattern: string,
): boolean {
  const pattern = publicApiPattern.replace(/:[a-zA-Z_][a-zA-Z0-9_]*/g, name);
  return matchSimpleGlob(target, pattern);
}
