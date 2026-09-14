import { slicePolylineByFraction } from "../core/math.js";
import type { ResonancePreview } from "../systems/brewing/BrewMath.js";
import type { EffectDefinition } from "../types/content.js";
import type { Vec2 } from "../types/game.js";

export interface AtlasScene {
  effect: EffectDefinition;
  previewPath: readonly Vec2[];
  committedPath: readonly Vec2[];
  marker: Vec2;
  completion: number;
  resonance: ResonancePreview;
  infused: boolean;
}

export class AtlasRenderer {
  readonly #canvas: HTMLCanvasElement;
  readonly #context: CanvasRenderingContext2D;
  readonly #resizeObserver: ResizeObserver;
  #scene: AtlasScene;
  #width = 1;
  #height = 1;
  #dpr = 1;

  constructor(canvas: HTMLCanvasElement, scene: AtlasScene) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D is required for the Essence Atlas.");

    this.#canvas = canvas;
    this.#context = context;
    this.#scene = scene;
    this.#resizeObserver = new ResizeObserver(() => this.#resize());
    this.#resizeObserver.observe(canvas);
    this.#resize();
  }

  setScene(scene: AtlasScene): void {
    this.#scene = scene;
    this.render();
  }

  destroy(): void {
    this.#resizeObserver.disconnect();
  }

  render(): void {
    const ctx = this.#context;
    ctx.save();
    ctx.setTransform(this.#dpr, 0, 0, this.#dpr, 0, 0);
    ctx.clearRect(0, 0, this.#width, this.#height);

    const gradient = ctx.createLinearGradient(0, 0, 0, this.#height);
    gradient.addColorStop(0, "#1a2c25");
    gradient.addColorStop(1, "#0c1512");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.#width, this.#height);

    this.#drawAmbientGlow(ctx);
    this.#drawGrid(ctx);
    this.#drawOrigin(ctx);
    this.#drawEffect(ctx, this.#scene.effect, this.#scene.resonance, this.#scene.infused);
    this.#drawPath(ctx, this.#scene.previewPath, "rgba(231, 194, 111, 0.42)", 2, [5, 7]);

    if (this.#scene.committedPath.length > 1) {
      this.#drawPath(ctx, this.#scene.committedPath, "rgba(227, 176, 92, 0.26)", 3, []);
      this.#drawPath(
        ctx,
        slicePolylineByFraction(this.#scene.committedPath, this.#scene.completion),
        "#58ded2",
        5,
        [],
      );
    }

    if (this.#scene.resonance.resonating && !this.#scene.infused) {
      this.#drawResonanceLink(
        ctx,
        this.#scene.marker,
        this.#scene.effect.node,
        this.#scene.resonance.potency,
      );
    }

    this.#drawMarker(
      ctx,
      this.#scene.marker,
      this.#scene.resonance.resonating,
      this.#scene.infused,
    );
    ctx.restore();
  }

  #resize(): void {
    const rect = this.#canvas.getBoundingClientRect();
    this.#width = Math.max(1, rect.width);
    this.#height = Math.max(1, rect.height);
    this.#dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.#canvas.width = Math.round(this.#width * this.#dpr);
    this.#canvas.height = Math.round(this.#height * this.#dpr);
    this.render();
  }

  #worldToScreen(point: Vec2): Vec2 {
    const center: Vec2 = { x: 125, y: -44 };
    const scale = Math.min(this.#width / 410, this.#height / 250);
    return {
      x: this.#width / 2 + (point.x - center.x) * scale,
      y: this.#height / 2 + (point.y - center.y) * scale,
    };
  }

  #drawAmbientGlow(ctx: CanvasRenderingContext2D): void {
    const glow = ctx.createRadialGradient(
      this.#width * 0.72,
      this.#height * 0.24,
      0,
      this.#width * 0.72,
      this.#height * 0.24,
      this.#width * 0.48,
    );
    glow.addColorStop(0, "rgba(104, 167, 124, 0.10)");
    glow.addColorStop(1, "rgba(104, 167, 124, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, this.#width, this.#height);
  }

  #drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "rgba(217, 191, 132, 0.07)";
    ctx.lineWidth = 1;
    const spacing = 34;

    for (let x = 0; x <= this.#width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.#height);
      ctx.stroke();
    }

    for (let y = 0; y <= this.#height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.#width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  #drawOrigin(ctx: CanvasRenderingContext2D): void {
    const point = this.#worldToScreen({ x: 0, y: 0 });
    ctx.save();
    ctx.strokeStyle = "rgba(245, 235, 210, 0.68)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(245, 235, 210, 0.2)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  #drawEffect(
    ctx: CanvasRenderingContext2D,
    effect: EffectDefinition,
    resonance: ResonancePreview,
    infused: boolean,
  ): void {
    const point = this.#worldToScreen(effect.node);
    const scale = Math.min(this.#width / 410, this.#height / 250);
    const radius = Math.max(24, effect.resonanceRadius * scale);
    const intensity = infused ? 1 : resonance.resonating ? 0.58 + resonance.potency * 0.42 : 0.45;

    ctx.save();
    const glow = ctx.createRadialGradient(point.x, point.y, 2, point.x, point.y, radius);
    glow.addColorStop(0, `rgba(255, 225, 147, ${0.55 * intensity})`);
    glow.addColorStop(0.45, `rgba(239, 169, 79, ${0.2 * intensity})`);
    glow.addColorStop(1, "rgba(239, 169, 79, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = resonance.resonating
      ? "rgba(255, 220, 146, 0.55)"
      : "rgba(239, 179, 84, 0.2)";
    ctx.lineWidth = resonance.resonating ? 2 : 1;
    ctx.setLineDash([4, 7]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.shadowColor = "rgba(239, 169, 79, 0.7)";
    ctx.shadowBlur = resonance.resonating || infused ? 18 : 8;
    ctx.fillStyle = infused ? "#fff3ca" : "#efb354";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "700 13px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#f6ead0";
    ctx.fillText(effect.name, point.x, point.y - 20);
    ctx.restore();
  }

  #drawPath(
    ctx: CanvasRenderingContext2D,
    points: readonly Vec2[],
    stroke: string,
    width: number,
    dash: readonly number[],
  ): void {
    if (points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([...dash]);
    ctx.beginPath();
    points.forEach((point, index) => {
      const screen = this.#worldToScreen(point);
      if (index === 0) ctx.moveTo(screen.x, screen.y);
      else ctx.lineTo(screen.x, screen.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  #drawResonanceLink(
    ctx: CanvasRenderingContext2D,
    marker: Vec2,
    node: Vec2,
    potency: number,
  ): void {
    const markerPoint = this.#worldToScreen(marker);
    const nodePoint = this.#worldToScreen(node);
    ctx.save();
    ctx.strokeStyle = `rgba(255, 211, 119, ${0.25 + potency * 0.65})`;
    ctx.lineWidth = 2 + potency * 2;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(markerPoint.x, markerPoint.y);
    ctx.lineTo(nodePoint.x, nodePoint.y);
    ctx.stroke();
    ctx.restore();
  }

  #drawMarker(
    ctx: CanvasRenderingContext2D,
    marker: Vec2,
    resonating: boolean,
    infused: boolean,
  ): void {
    const point = this.#worldToScreen(marker);
    ctx.save();
    ctx.shadowColor = infused
      ? "rgba(255, 214, 117, 0.78)"
      : resonating
        ? "rgba(255, 214, 117, 0.72)"
        : "rgba(82, 224, 210, 0.72)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = infused ? "#fff0bd" : resonating ? "#fff1c5" : "#dffcf7";
    ctx.beginPath();
    ctx.arc(point.x, point.y, resonating ? 9 : 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = infused || resonating ? "#efb354" : "#55ddd1";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }
}
