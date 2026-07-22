import type { PresetEntry, Registry } from "../types.js";

export function expandPresetAgents(
  registry: Registry,
  presetIds: string[],
): { agentIds: string[]; notes: string[] } {
  const agentIds: string[] = [];
  const notes: string[] = [];
  const presets = registry.presets ?? [];

  for (const presetId of presetIds) {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) {
      throw new Error(`Unknown preset: ${presetId}`);
    }
    for (const id of preset.agents) {
      if (!registry.agents.some((a) => a.id === id)) {
        throw new Error(`Preset ${presetId} references unknown agent: ${id}`);
      }
      if (!agentIds.includes(id)) agentIds.push(id);
    }
    if (preset.notes?.length) {
      notes.push(...preset.notes.map((n) => `[${preset.id}] ${n}`));
    }
  }

  return { agentIds, notes };
}

export function mergeAgentIds(...lists: string[][]): string[] {
  const out: string[] = [];
  for (const list of lists) {
    for (const id of list) {
      if (!out.includes(id)) out.push(id);
    }
  }
  return out;
}

export function listPresets(registry: Registry): PresetEntry[] {
  return registry.presets ?? [];
}
