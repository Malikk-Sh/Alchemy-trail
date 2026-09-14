import type { EffectDefinition } from "../types/content.js";
import type { Vec2 } from "../types/game.js";

export interface AtlasScene {
  effect: EffectDefinition;
  previewPath: readonly Vec2[];
  committedPath: readonly Vec2[];
  marker: Vec2;
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
    gradient.addColorStop(0, "#17251f");
    gradient.addColorStop(1, "#0d1512");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.#width, this.#height);

    this.#drawGrid(ctx);
    this.#drawOrigin(ctx);
    this.#drawEffect(ctx, this.#scene.effect, this.#scene.infused);
    this.#drawPath(ctx, this.#scene.previewPath, "rgba(231, 194, 111, 0.42)", 2, [5, 7]);
    this.#drawPath(ctx, this.#scene.committedPath, "#58ded2", 4, []);
    this.#drawMarker(ctx, this.#scene.marker);

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
    const center: Vec2 = { x: 135, y: -45 };
    const scale = Math.min(this.#width / 430, this.#height / 260);
    return {
      x: this.#width / 2 + (point.x - center.x) * scale,
      y: this.#height / 2 + (point.y - center.y) * scale,
    };
  }

  #drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "rgba(217, 191, 132, 0.08)";
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
    ctx.strokeStyle = "rgba(245, 235, 210, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  #drawEffect(ctx: CanvasRenderingContext2D, effect: EffectDefinition, infused: boolean): void {
    const point = this.#worldToScreen(effect.node);
    const scale = Math.min(this.#width / 430, this.#height / 260);
    const radius = Math.max(22, effect.resonanceRadius * scale);

    ctx.save();
    const glow = ctx.createRadialGradient(point.x, point.y, 2, point.x, point.y, radius);
    glow.addColorStop(0, infused ? "rgba(255, 234, 164, 0.95)" : "rgba(239, 179, 84, 0.48)");
    glow.addColorStop(1, "rgba(239, 179, 84, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = infused ? "#fff3ca" : "#efb354";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "700 13px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#f6ead0";
    ctx.fillText(effect.name, point.x, point.y - 18);
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

  #drawMarker(ctx: CanvasRenderingContext2D, marker: Vec2): void {
    const point = this.#worldToScreen(marker);
    ctx.save();
    ctx.shadowColor = "rgba(82, 224, 210, 0.72)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#dffcf7";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#55ddd1";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }
}
