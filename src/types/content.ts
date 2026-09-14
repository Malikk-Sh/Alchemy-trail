import type { Vec2 } from "./game.js";

export interface EffectDefinition {
  id: string;
  name: string;
  description: string;
  node: Vec2;
  resonanceRadius: number;
}

export interface IngredientDefinition {
  id: string;
  name: string;
  symbol: string;
  description: string;
  path: readonly Vec2[];
}

export interface BottledPotion {
  effectId: string;
  effectName: string;
  potency: number;
  ingredientId: string;
  ingredientName: string;
}
