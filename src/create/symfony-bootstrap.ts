import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { ensureTool } from "../fs/command-exists.js";

export type SymfonyBootstrapMethod = "symfony-cli" | "composer" | "host";

export const SYMFONY_BOOTSTRAP_OPTIONS: Array<{
  value: SymfonyBootstrapMethod;
  label: string;
  hint: string;
}> = [
  {
    value: "symfony-cli",
    label: "Symfony CLI",
    hint: "symfony new (default)",
  },
  {
    value: "composer",
    label: "Composer",
    hint: "composer create-project symfony/skeleton",
  },
  {
    value: "host",
    label: "Host",
    hint: "Empty directory; Ark template only",
  },
];

export function isSymfonyStack(stacks: string[]): boolean {
  return stacks.some((s) => s.toLowerCase() === "symfony");
}

export function parseSymfonyBootstrap(
  value: unknown,
): SymfonyBootstrapMethod | undefined {
  if (value === "symfony-cli" || value === "composer" || value === "host") {
    return value;
  }
  return undefined;
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

export function bootstrapSymfony(opts: {
  method: SymfonyBootstrapMethod;
  targetDir: string;
  name: string;
}): void {
  const targetDir = resolve(opts.targetDir);
  const parent = dirname(targetDir);
  const dirName = basename(targetDir);
  assertEmptyOrMissing(targetDir);

  switch (opts.method) {
    case "symfony-cli": {
      ensureTool(
        "symfony",
        "Install Symfony CLI: https://symfony.com/download",
      );
      mkdirSync(parent, { recursive: true });
      run(
        "symfony",
        ["new", dirName, "--no-git", "--version=lts"],
        { cwd: parent },
      );
      return;
    }
    case "composer": {
      ensureTool("composer", "Install Composer: https://getcomposer.org/");
      mkdirSync(parent, { recursive: true });
      run(
        "composer",
        [
          "create-project",
          "symfony/skeleton",
          dirName,
          "--prefer-dist",
          "--no-interaction",
        ],
        { cwd: parent },
      );
      return;
    }
    case "host": {
      mkdirSync(targetDir, { recursive: true });
      return;
    }
    default: {
      const _exhaustive: never = opts.method;
      throw new Error(`Unknown Symfony bootstrap method: ${_exhaustive}`);
    }
  }
}
