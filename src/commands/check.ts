import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { resolve } from "node:path";
import { checkProject } from "../check/engine.js";

export const checkCommand = defineCommand({
  meta: {
    name: "check",
    description: "Validate a project against its architecture contract",
  },
  args: {
    path: {
      type: "positional",
      description: "Project path (default: .)",
      required: false,
      default: ".",
    },
  },
  run({ args }) {
    const root = resolve(args.path);
    p.intro(`ark check → ${root}`);

    const result = checkProject(root);
    const errors = result.issues.filter((i) => i.severity === "error");
    const warns = result.issues.filter((i) => i.severity === "warn");

    if (result.issues.length === 0) {
      p.log.success(`OK: architecture "${result.architectureId}"`);
      p.outro("No issues");
      return;
    }

    for (const issue of result.issues) {
      const label = issue.path ? `${issue.path}: ${issue.message}` : issue.message;
      if (issue.severity === "error") {
        p.log.error(`[${issue.code}] ${label}`);
      } else {
        p.log.warn(`[${issue.code}] ${label}`);
      }
    }

    p.outro(
      `${errors.length} error(s), ${warns.length} warning(s) (${result.architectureId})`,
    );
    if (errors.length > 0) {
      process.exit(1);
    }
  },
});
