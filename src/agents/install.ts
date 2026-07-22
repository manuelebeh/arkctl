import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import { fetchGithubSource, parseGithubSource } from "../fetch/github.js";
import { copyDir } from "../fs/files.js";
import { readYamlFile, resolveCatalogPath } from "../catalog/load.js";
import type { AgentEntry, AgentManifest } from "../types.js";

export type InstalledAgent = {
  id: string;
  name: string;
  kind: AgentEntry["kind"];
  summary: string;
  location: string;
  post?: string[];
};

export async function installAgent(opts: {
  agent: AgentEntry;
  catalogRoot: string;
  projectRoot: string;
}): Promise<InstalledAgent> {
  const { agent, catalogRoot, projectRoot } = opts;

  if (agent.source === "local") {
    if (!agent.path) {
      throw new Error(`Local agent ${agent.id} missing path`);
    }
    const localRoot = resolveCatalogPath(catalogRoot, agent.path);

    if (agent.kind === "local") {
      return installLocalPersona(agent, catalogRoot, projectRoot);
    }
    if (agent.kind === "guidelines") {
      return installGuidelines(agent, localRoot, projectRoot);
    }
    if (agent.kind === "skill" || agent.kind === "tool-skill") {
      return installSkillPack(agent, localRoot, projectRoot);
    }
    throw new Error(`Unsupported local agent kind for ${agent.id}: ${agent.kind}`);
  }

  if (!agent.github) {
    throw new Error(`Agent ${agent.id} is remote but missing github locator`);
  }

  const source = parseGithubSource(agent.github);
  const cached = await fetchGithubSource(source);

  if (agent.kind === "guidelines") {
    return installGuidelines(agent, cached, projectRoot);
  }

  if (agent.kind === "skill" || agent.kind === "tool-skill") {
    return installSkillPack(agent, cached, projectRoot);
  }

  throw new Error(`Unsupported agent kind for ${agent.id}: ${agent.kind}`);
}

function installLocalPersona(
  agent: AgentEntry,
  catalogRoot: string,
  projectRoot: string,
): InstalledAgent {
  if (!agent.path) {
    throw new Error(`Local agent ${agent.id} missing path`);
  }
  const manifest = readYamlFile<AgentManifest>(
    resolveCatalogPath(catalogRoot, join(agent.path, "manifest.yaml")),
  );
  const agentOut = join(projectRoot, "agents", agent.id);
  mkdirSync(agentOut, { recursive: true });
  const body = [
    `# ${manifest.name}`,
    ``,
    `Role: ${manifest.role}`,
    ``,
    `## Constraints`,
    ...manifest.constraints.map((c) => `- ${c}`),
    ``,
    `## System prompt`,
    ``,
    manifest.system_prompt.trim(),
    ``,
  ].join("\n");
  writeFileSync(join(agentOut, "SYSTEM.md"), body, "utf8");

  return {
    id: agent.id,
    name: manifest.name,
    kind: "local",
    summary: manifest.role,
    location: `agents/${agent.id}/SYSTEM.md`,
  };
}

function installGuidelines(
  agent: AgentEntry,
  cached: string,
  projectRoot: string,
): InstalledAgent {
  const markdown = readCachedMarkdown(cached);
  const agentOut = join(projectRoot, "agents", agent.id);
  mkdirSync(agentOut, { recursive: true });
  writeFileSync(join(agentOut, "SYSTEM.md"), markdown, "utf8");

  return {
    id: agent.id,
    name: agent.name,
    kind: agent.kind,
    summary: agent.description ?? "Guidelines pack",
    location: `agents/${agent.id}/SYSTEM.md`,
    post: agent.install?.post,
  };
}

function installSkillPack(
  agent: AgentEntry,
  cached: string,
  projectRoot: string,
): InstalledAgent {
  const targetRel =
    agent.install?.target ?? `.agents/skills/${agent.id}`;
  const targetAbs = join(projectRoot, targetRel);
  mkdirSync(join(projectRoot, ".agents", "skills"), { recursive: true });

  if (statSync(cached).isDirectory()) {
    // If cache is a dir of a single file guidelines mistaken as skill, still copy
    copyDir(cached, targetAbs);
  } else {
    mkdirSync(targetAbs, { recursive: true });
    writeFileSync(join(targetAbs, basename(cached)), readFileSync(cached));
  }

  // Convenience mirror under agents/ for tools that only scan agents/
  const mirror = join(projectRoot, "agents", agent.id);
  mkdirSync(mirror, { recursive: true });
  const skillMd = findSkillMarkdown(targetAbs);
  const summary = agent.description ?? "Agent skill pack";
  writeFileSync(
    join(mirror, "SYSTEM.md"),
    [
      `# ${agent.name}`,
      ``,
      summary,
      ``,
      `Skill pack installed at \`${targetRel}\`.`,
      skillMd ? `Primary file: \`${targetRel}/${skillMd}\`.` : "",
      ``,
      agent.kind === "tool-skill" && agent.install?.post?.length
        ? `## Post-install\n\n${agent.install.post.map((c) => `\`${c}\``).join("\n")}`
        : "",
      ``,
    ]
      .filter(Boolean)
      .join("\n"),
    "utf8",
  );

  return {
    id: agent.id,
    name: agent.name,
    kind: agent.kind,
    summary,
    location: targetRel,
    post: agent.install?.post,
  };
}

function readCachedMarkdown(cached: string): string {
  if (statSync(cached).isFile()) {
    return readFileSync(cached, "utf8");
  }
  const preferred = ["CONTENT.md", "AGENTS.md", "CLAUDE.md", "SYSTEM.md", "SKILL.md"];
  for (const name of preferred) {
    const p = join(cached, name);
    if (existsSync(p)) return readFileSync(p, "utf8");
  }
  const md = readdirSync(cached).find((f) => f.endsWith(".md"));
  if (!md) {
    throw new Error(`No markdown content found in cached agent pack: ${cached}`);
  }
  return readFileSync(join(cached, md), "utf8");
}

function findSkillMarkdown(dir: string): string | null {
  if (existsSync(join(dir, "SKILL.md"))) return "SKILL.md";
  if (existsSync(join(dir, "AGENTS.md"))) return "AGENTS.md";
  return null;
}

export function writeAgentsIndex(
  projectRoot: string,
  installed: InstalledAgent[],
  extraNotes: string[] = [],
): void {
  const blocks: string[] = [
    `# Agents`,
    ``,
    `Agent packs installed at create time. Tools that read AGENTS.md or Agent Skills can use them.`,
    ``,
  ];

  for (const agent of installed) {
    blocks.push(`## ${agent.name} (\`${agent.id}\`)`);
    blocks.push(``);
    blocks.push(`- Kind: \`${agent.kind}\``);
    blocks.push(`- ${agent.summary}`);
    blocks.push(`- Location: \`${agent.location}\``);
    if (agent.post?.length) {
      blocks.push(`- Post-install:`);
      for (const cmd of agent.post) {
        blocks.push(`  - \`${cmd}\``);
      }
    }
    blocks.push(``);

    // Inline guidelines into AGENTS.md for always-on hosts
    if (agent.kind === "guidelines" || agent.kind === "local") {
      const systemPath = join(projectRoot, "agents", agent.id, "SYSTEM.md");
      if (existsSync(systemPath)) {
        blocks.push(`<details>`);
        blocks.push(`<summary>Full instructions</summary>`);
        blocks.push(``);
        blocks.push(readFileSync(systemPath, "utf8").trim());
        blocks.push(``);
        blocks.push(`</details>`);
        blocks.push(``);
      }
    }
  }

  const postAll = installed.flatMap((a) => a.post ?? []);
  if (postAll.length || extraNotes.length) {
    mkdirSync(join(projectRoot, ".agents"), { recursive: true });
    writeFileSync(
      join(projectRoot, ".agents", "POSTINSTALL.md"),
      [
        `# Post-install`,
        ``,
        ...(postAll.length
          ? [
              `## Commands`,
              ``,
              `Run these from the project root after scaffolding:`,
              ``,
              ...postAll.map((c) => `- \`${c}\``),
              ``,
            ]
          : []),
        ...(extraNotes.length
          ? [`## Notes`, ``, ...extraNotes.map((n) => `- ${n}`), ``]
          : []),
      ].join("\n"),
      "utf8",
    );
  }

  writeFileSync(join(projectRoot, "AGENTS.md"), blocks.join("\n"), "utf8");
}
