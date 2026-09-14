import assert from "node:assert/strict";
import test from "node:test";

import {
  buildIngredientPath,
  markerAtDistance,
  resonancePreview,
  unwrapAngleDelta,
} from "../../dist/js/systems/brewing/BrewMath.js";

test("ingredient grind fraction slices then translates a local path", () => {
  const path = buildIngredientPath(
    { x: 100, y: 50 },
    [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ],
    0.5,
  );

  assert.deepEqual(path, [
    { x: 100, y: 50 },
    { x: 200, y: 50 },
  ]);
});

test("stir marker travels by polyline arc length", () => {
  const marker = markerAtDistance(
    [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 40 },
    ],
    50,
  );
  assert.deepEqual(marker, { x: 30, y: 20 });
});

test("resonance preview is deterministic from distance", () => {
  const effect = {
    id: "test",
    name: "Test",
    description: "",
    node: { x: 100, y: 0 },
    resonanceRadius: 50,
  };
  const preview = resonancePreview({ x: 75, y: 0 }, effect);
  assert.equal(preview.resonating, true);
  assert.equal(preview.potency, 0.5);
});

test("angle delta unwraps cleanly across the pi boundary", () => {
  const delta = unwrapAngleDelta(Math.PI - 0.1, -Math.PI + 0.1);
  assert.ok(Math.abs(delta - 0.2) < 1e-10);
});
