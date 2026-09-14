import type { IngredientDefinition } from "../types/content.js";

export const SUNLEAF: IngredientDefinition = {
  id: "sunleaf",
  name: "Sunleaf",
  symbol: "✦",
  description: "A bright field herb whose essence bends toward warm, luminous effects.",
  path: [
    { x: 0, y: 0 },
    { x: 74, y: -24 },
    { x: 132, y: -72 },
    { x: 198, y: -42 },
    { x: 246, y: -88 },
  ],
};

export const INGREDIENTS: readonly IngredientDefinition[] = [SUNLEAF];
