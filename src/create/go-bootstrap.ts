import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { ensureTool } from "../fs/command-exists.js";

export type GoBootstrapMethod = "go-mod" | "host";

export const GO_BOOTSTRAP_OPTIONS: Array<{
  value: GoBootstrapMethod;
  label: string;
  hint: string;
}> = [
  {
    value: "go-mod",
    label: "go mod init",
    hint: "Initialize a Go module (default)",
  },
  {
    value: "host",
    label: "Host",
    hint: "Empty directory; Ark template only",
  },
];

export function isGoStack(stacks: string[]): boolean {
  return stacks.some((s) => s.toLowerCase() === "go");
}

export function parseGoBootstrap(
  value: unknown,
): GoBootstrapMethod | undefined {
  if (value === "go-mod" || value === "host") return value;
  return undefined;
}

function sanitizeModulePath(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._/-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "app";
}

function run(
  command: string,
  args: string[],
  opts: { cwd: string },
): void {
  const result = spawnSync(command, args, {
    cwd: opts.cwd,
    stdio: "inherit",
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `Command failed (${result.status}): ${command} ${args.join(" ")}`,
    );
  }
}

function assertEmptyOrMissing(dir: string): void {
  if (!existsSync(dir)) return;
  if (readdirSync(dir).length > 0) {
    throw new Error(`Target directory is not empty: ${dir}`);
  }
}

export function bootstrapGo(opts: {
  method: GoBootstrapMethod;
  targetDir: string;
  name: string;
}): void {
  const targetDir = resolve(opts.targetDir);
  assertEmptyOrMissing(targetDir);
  mkdirSync(targetDir, { recursive: true });

  switch (opts.method) {
    case "go-mod": {
      ensureTool("go", "Install Go: https://go.dev/dl/");
      const modulePath = `github.com/example/${sanitizeModulePath(opts.name)}`;
      run("go", ["mod", "init", modulePath], { cwd: targetDir });
      return;
    }
    case "host": {
      return;
    }
    default: {
      const _exhaustive: never = opts.method;
      throw new Error(`Unknown Go bootstrap method: ${_exhaustive}`);
    }
  }
}
