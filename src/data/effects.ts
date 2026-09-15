import type { EffectDefinition } from "../types/content.js";

export const WARMTH_EFFECT: EffectDefinition = {
  id: "warmth",
  name: "Тепло",
  description: "Ровный резонанс, похожий на тлеющий уголёк и несущий мягкое согревающее тепло.",
  node: { x: 246, y: -88 },
  resonanceRadius: 72,
};

export const EFFECTS: readonly EffectDefinition[] = [WARMTH_EFFECT];
