import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import type { Registry } from "../types.js";

const here = dirname(fileURLToPath(import.meta.url));

/** Built-in catalog shipped with the CLI (dev: ../catalog, dist: ../catalog). */
export function defaultCatalogRoot(): string {
  const candidates = [
    join(here, "..", "catalog"),
    join(here, "..", "..", "catalog"),
  ];
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "registry.yaml"))) {
      return candidate;
    }
  }
  throw new Error("Could not locate built-in catalog/registry.yaml");
}

export function loadRegistry(catalogRoot = defaultCatalogRoot()): Registry {
  const raw = readFileSync(join(catalogRoot, "registry.yaml"), "utf8");
  return parseYaml(raw) as Registry;
}

export function resolveCatalogPath(
  catalogRoot: string,
  relativePath: string,
): string {
  return join(catalogRoot, relativePath);
}

export function readYamlFile<T>(path: string): T {
  return parseYaml(readFileSync(path, "utf8")) as T;
}
