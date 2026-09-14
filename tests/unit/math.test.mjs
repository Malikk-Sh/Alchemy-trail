import assert from "node:assert/strict";
import test from "node:test";

import {
  add,
  distance,
  normalize,
  pointAtDistance,
  polylineLength,
  slicePolylineByFraction,
} from "../../dist/js/core/math.js";

test("vector helpers preserve deterministic geometry", () => {
  assert.deepEqual(add({ x: 2, y: -1 }, { x: 3, y: 5 }), { x: 5, y: 4 });
  assert.equal(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.deepEqual(normalize({ x: 0, y: 0 }), { x: 0, y: 0 });
});

test("polyline interpolation follows arc length", () => {
  const path = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 4 },
  ];

  assert.equal(polylineLength(path), 7);
  assert.deepEqual(pointAtDistance(path, 5), { x: 3, y: 2 });
  assert.deepEqual(pointAtDistance(path, 99), { x: 3, y: 4 });
});

test("grind fraction slicing returns the matching partial route", () => {
  const path = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ];

  assert.deepEqual(slicePolylineByFraction(path, 0.25), [
    { x: 0, y: 0 },
    { x: 5, y: 0 },
  ]);
  assert.deepEqual(slicePolylineByFraction(path, 1), path);
});
