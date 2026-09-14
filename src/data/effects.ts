import type { EffectDefinition } from "../types/content.js";

export const WARMTH_EFFECT: EffectDefinition = {
  id: "warmth",
  name: "Warmth",
  description: "A steady ember-like resonance that carries comforting heat.",
  node: { x: 286, y: -92 },
  resonanceRadius: 78,
};

export const EFFECTS: readonly EffectDefinition[] = [WARMTH_EFFECT];
