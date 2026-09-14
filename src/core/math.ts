import type { Vec2 } from "../types/game.js";

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(vector: Vec2, scalar: number): Vec2 {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

export function length(vector: Vec2): number {
  return Math.hypot(vector.x, vector.y);
}

export function distance(a: Vec2, b: Vec2): number {
  return length(sub(a, b));
}

export function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function normalize(vector: Vec2): Vec2 {
  const magnitude = length(vector);
  if (magnitude === 0) return { x: 0, y: 0 };
  return scale(vector, 1 / magnitude);
}

export function polylineLength(points: readonly Vec2[]): number {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous && current) total += distance(previous, current);
  }
  return total;
}

export function pointAtDistance(points: readonly Vec2[], targetDistance: number): Vec2 {
  if (points.length === 0) return { x: 0, y: 0 };
  const first = points[0];
  if (!first) return { x: 0, y: 0 };
  if (points.length === 1 || targetDistance <= 0) return { ...first };

  let remaining = targetDistance;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    if (!start || !end) continue;
    const segmentLength = distance(start, end);
    if (segmentLength === 0) continue;
    if (remaining <= segmentLength) {
      return lerp(start, end, remaining / segmentLength);
    }
    remaining -= segmentLength;
  }

  const last = points.at(-1);
  return last ? { ...last } : { ...first };
}

export function slicePolylineByFraction(points: readonly Vec2[], fraction: number): Vec2[] {
  if (points.length === 0) return [];
  const clamped = Math.min(1, Math.max(0, fraction));
  const total = polylineLength(points);
  const first = points[0];
  if (!first) return [];
  if (total === 0 || clamped === 0) return [{ ...first }];
  if (clamped === 1) return points.map((point) => ({ ...point }));

  const target = total * clamped;
  const result: Vec2[] = [{ ...first }];
  let travelled = 0;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    if (!start || !end) continue;
    const segmentLength = distance(start, end);
    if (segmentLength === 0) continue;

    if (travelled + segmentLength >= target) {
      const localDistance = target - travelled;
      result.push(lerp(start, end, localDistance / segmentLength));
      break;
    }

    result.push({ ...end });
    travelled += segmentLength;
  }

  return result;
}
