import type { IngredientDefinition } from "../types/content.js";

export const SUNLEAF: IngredientDefinition = {
  id: "sunleaf",
  name: "Солнцелист",
  symbol: "✦",
  description: "Яркая полевая трава, чья эссенция тянется к тёплым, светящимся эффектам.",
  path: [
    { x: 0, y: 0 },
    { x: 74, y: -24 },
    { x: 132, y: -72 },
    { x: 198, y: -42 },
    { x: 246, y: -88 },
  ],
};

export const INGREDIENTS: readonly IngredientDefinition[] = [SUNLEAF];
