export interface Vec2 {
  x: number;
  y: number;
}

export type GameScreen =
  | "title"
  | "shop"
  | "customer"
  | "brewing"
  | "bottling"
  | "sale"
  | "trader"
  | "garden"
  | "journal"
  | "atlas"
  | "upgrades"
  | "day-summary"
  | "settings";
