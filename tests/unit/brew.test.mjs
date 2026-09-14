import assert from "node:assert/strict";
import test from "node:test";

import { WARMTH_EFFECT } from "../../dist/js/data/effects.js";
import { SUNLEAF } from "../../dist/js/data/ingredients.js";
import {
  buildIngredientPath,
  markerAtDistance,
  pathCompletion,
  potionQuality,
  resonancePreview,
  unwrapAngleDelta,
} from "../../dist/js/systems/brewing/BrewMath.js";

test("ingredient grind fraction slices then translates a local path", () => {
  const path = buildIngredientPath({ x: 100, y: 50 }, [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }], 0.5);
  assert.deepEqual(path, [{ x: 100, y: 50 }, { x: 200, y: 50 }]);
});

test("stir marker travels by polyline arc length", () => {
  const marker = markerAtDistance([{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 40 }], 50);
  assert.deepEqual(marker, { x: 30, y: 20 });
});

test("path completion clamps to the actual path", () => {
  const path = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
  assert.equal(pathCompletion(path, 25), 0.25);
  assert.equal(pathCompletion(path, 150), 1);
});

test("resonance preview is deterministic from distance", () => {
  const effect = { id: "test", name: "Test", description: "", node: { x: 100, y: 0 }, resonanceRadius: 50 };
  const preview = resonancePreview({ x: 75, y: 0 }, effect);
  assert.equal(preview.resonating, true);
  assert.equal(preview.potency, 0.5);
});

test("the tutorial Sunleaf path can land exactly on the Warmth core", () => {
  const path = buildIngredientPath({ x: 0, y: 0 }, SUNLEAF.path, 1);
  const end = path.at(-1);
  assert.deepEqual(end, WARMTH_EFFECT.node);
  assert.equal(resonancePreview(end, WARMTH_EFFECT).potency, 1);
});

test("potion quality tiers are deterministic and clamp potency", () => {
  assert.equal(potionQuality(-1).id, "faint");
  assert.equal(potionQuality(0.35).id, "steady");
  assert.equal(potionQuality(0.65).id, "potent");
  assert.equal(potionQuality(0.9).id, "masterwork");
  assert.equal(potionQuality(2).id, "masterwork");
});

test("angle delta unwraps cleanly across the pi boundary", () => {
  const delta = unwrapAngleDelta(Math.PI - 0.1, -Math.PI + 0.1);
  assert.ok(Math.abs(delta - 0.2) < 1e-10);
});
