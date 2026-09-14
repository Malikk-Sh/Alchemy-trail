import { distance, pointAtDistance, polylineLength, slicePolylineByFraction } from "../../core/math.js";
import type { EffectDefinition, PotionQuality } from "../../types/content.js";
import type { Vec2 } from "../../types/game.js";

export interface ResonancePreview {
  distance: number;
  potency: number;
  resonating: boolean;
}

export function buildIngredientPath(
  start: Vec2,
  localPath: readonly Vec2[],
  fraction: number,
): Vec2[] {
  const sliced = slicePolylineByFraction(localPath, fraction);
  const origin = sliced[0];
  if (!origin) return [{ ...start }];

  return sliced.map((point) => ({
    x: start.x + point.x - origin.x,
    y: start.y + point.y - origin.y,
  }));
}

export function markerAtDistance(path: readonly Vec2[], travelled: number): Vec2 {
  return pointAtDistance(path, Math.max(0, travelled));
}

export function pathCompletion(path: readonly Vec2[], travelled: number): number {
  const total = polylineLength(path);
  if (total === 0) return 0;
  return Math.min(1, Math.max(0, travelled / total));
}

export function resonancePreview(marker: Vec2, effect: EffectDefinition): ResonancePreview {
  const nodeDistance = distance(marker, effect.node);
  const potency = Math.max(0, 1 - nodeDistance / effect.resonanceRadius);
  return {
    distance: nodeDistance,
    potency,
    resonating: nodeDistance <= effect.resonanceRadius,
  };
}

export function unwrapAngleDelta(previous: number, current: number): number {
  const raw = current - previous;
  return Math.atan2(Math.sin(raw), Math.cos(raw));
}

export function potionQuality(potency: number): PotionQuality {
  const clamped = Math.min(1, Math.max(0, potency));

  if (clamped >= 0.9) {
    return {
      id: "masterwork",
      name: "Masterwork",
      description: "The essence settled almost exactly on the resonance core.",
    };
  }

  if (clamped >= 0.65) {
    return {
      id: "potent",
      name: "Potent",
      description: "A strong, clean infusion with a vivid magical signature.",
    };
  }

  if (clamped >= 0.35) {
    return {
      id: "steady",
      name: "Steady",
      description: "A reliable infusion with a clear but softer effect.",
    };
  }

  return {
    id: "faint",
    name: "Faint",
    description: "The effect was captured at the edge of resonance.",
  };
}
