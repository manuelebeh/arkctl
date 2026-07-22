import type { AgentEntry } from "../types.js";

/**
 * Agents whose stacks include "*" or intersect the project stacks.
 * If projectStacks is empty, only "*" agents match (conservative).
 */
export function filterAgentsForStacks(
  agents: AgentEntry[],
  projectStacks: string[],
): AgentEntry[] {
  const stacks = new Set(projectStacks.map((s) => s.toLowerCase()));
  return agents.filter((agent) => {
    const agentStacks = (agent.stacks ?? ["*"]).map((s) => s.toLowerCase());
    if (agentStacks.includes("*")) return true;
    if (stacks.size === 0) return false;
    return agentStacks.some((s) => stacks.has(s));
  });
}

export function resolveProjectStacks(opts: {
  registryStacks?: string[];
  manifestTags?: string[];
}): string[] {
  const fromRegistry = opts.registryStacks ?? [];
  const fromManifest = opts.manifestTags ?? [];
  return [...new Set([...fromRegistry, ...fromManifest])];
}
