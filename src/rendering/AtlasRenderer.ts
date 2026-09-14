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

    const gradient = ctx.createLinearGradient(0, 0, this.#width, this.#height);
    gradient.addColorStop(0, "#173128");
    gradient.addColorStop(0.52, "#10241e");
    gradient.addColorStop(1, "#091713");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.#width, this.#height);

    this.#drawAmbientGlow(ctx);
    this.#drawTopography(ctx);
    this.#drawConstellationField(ctx);
    this.#drawCompassRose(ctx);
    this.#drawOrigin(ctx);
    this.#drawEffect(ctx, this.#scene.effect, this.#scene.resonance, this.#scene.infused);
    this.#drawPath(ctx, this.#scene.previewPath, "rgba(239, 202, 126, 0.46)", 2.25, [5, 7]);

    if (this.#scene.committedPath.length > 1) {
      this.#drawPath(ctx, this.#scene.committedPath, "rgba(231, 184, 97, 0.24)", 4, []);
      this.#drawPath(
        ctx,
        slicePolylineByFraction(this.#scene.committedPath, this.#scene.completion),
        "#63eadb",
        5.5,
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
    this.#drawVignette(ctx);
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
    const warm = ctx.createRadialGradient(
      this.#width * 0.76,
      this.#height * 0.28,
      0,
      this.#width * 0.76,
      this.#height * 0.28,
      this.#width * 0.5,
    );
    warm.addColorStop(0, "rgba(218, 173, 86, 0.10)");
    warm.addColorStop(1, "rgba(218, 173, 86, 0)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, this.#width, this.#height);

    const teal = ctx.createRadialGradient(
      this.#width * 0.24,
      this.#height * 0.72,
      0,
      this.#width * 0.24,
      this.#height * 0.72,
      this.#width * 0.42,
    );
    teal.addColorStop(0, "rgba(86, 202, 180, 0.07)");
    teal.addColorStop(1, "rgba(86, 202, 180, 0)");
    ctx.fillStyle = teal;
    ctx.fillRect(0, 0, this.#width, this.#height);
  }

  #drawTopography(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(216, 196, 145, 0.085)";
    const bands = [0.2, 0.34, 0.5, 0.68, 0.84];
    bands.forEach((band, index) => {
      ctx.beginPath();
      for (let step = 0; step <= 30; step += 1) {
        const x = (step / 30) * this.#width;
        const wave = Math.sin(step * 0.58 + index * 1.23) * (8 + index * 2);
        const y = this.#height * band + wave;
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ctx.strokeStyle = "rgba(104, 158, 123, 0.09)";
    for (let ring = 0; ring < 4; ring += 1) {
      ctx.beginPath();
      ctx.ellipse(
        this.#width * (0.2 + ring * 0.19),
        this.#height * (0.38 + (ring % 2) * 0.18),
        48 + ring * 33,
        24 + ring * 15,
        -0.22 + ring * 0.08,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  #drawConstellationField(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let index = 0; index < 34; index += 1) {
      const x = ((index * 83 + 41) % 997) / 997 * this.#width;
      const y = ((index * 137 + 19) % 809) / 809 * this.#height;
      const radius = index % 7 === 0 ? 1.8 : 0.9;
      ctx.fillStyle = index % 5 === 0
        ? "rgba(242, 204, 122, 0.26)"
        : "rgba(195, 227, 209, 0.17)";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  #drawCompassRose(ctx: CanvasRenderingContext2D): void {
    const x = this.#width - 27;
    const y = 28;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = "rgba(225, 201, 145, 0.28)";
    ctx.fillStyle = "rgba(225, 201, 145, 0.11)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(4, -3);
    ctx.lineTo(10, 0);
    ctx.lineTo(4, 3);
    ctx.lineTo(0, 10);
    ctx.lineTo(-4, 3);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-4, -3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  #drawOrigin(ctx: CanvasRenderingContext2D): void {
    const point = this.#worldToScreen({ x: 0, y: 0 });
    ctx.save();
    ctx.strokeStyle = "rgba(245, 235, 210, 0.68)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(245, 235, 210, 0.22)";
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
    glow.addColorStop(0, `rgba(255, 231, 166, ${0.65 * intensity})`);
    glow.addColorStop(0.28, `rgba(245, 178, 77, ${0.3 * intensity})`);
    glow.addColorStop(1, "rgba(239, 169, 79, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = resonance.resonating
      ? "rgba(255, 225, 162, 0.7)"
      : "rgba(239, 179, 84, 0.25)";
    ctx.lineWidth = resonance.resonating ? 2 : 1;
    ctx.setLineDash([4, 7]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.shadowColor = "rgba(239, 169, 79, 0.82)";
    ctx.shadowBlur = resonance.resonating || infused ? 22 : 10;
    ctx.fillStyle = infused ? "#fff3ca" : "#f2b85f";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.84)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const labelWidth = 58;
    ctx.fillStyle = "rgba(39, 27, 20, 0.82)";
    ctx.beginPath();
    ctx.roundRect(point.x - labelWidth / 2, point.y - 39, labelWidth, 21, 10);
    ctx.fill();
    ctx.font = "700 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f9e5bd";
    ctx.fillText(effect.name, point.x, point.y - 28.5);
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
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([...dash]);

    if (width >= 4) {
      ctx.strokeStyle = "rgba(7, 15, 12, 0.7)";
      ctx.lineWidth = width + 5;
      ctx.beginPath();
      points.forEach((point, index) => {
        const screen = this.#worldToScreen(point);
        if (index === 0) ctx.moveTo(screen.x, screen.y);
        else ctx.lineTo(screen.x, screen.y);
      });
      ctx.stroke();
    }

    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.shadowColor = width >= 5 ? "rgba(83, 234, 219, 0.38)" : "transparent";
    ctx.shadowBlur = width >= 5 ? 8 : 0;
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
    ctx.strokeStyle = `rgba(255, 215, 128, ${0.25 + potency * 0.65})`;
    ctx.lineWidth = 2 + potency * 2;
    ctx.shadowColor = "rgba(255, 197, 89, 0.38)";
    ctx.shadowBlur = 9;
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
    ctx.translate(point.x, point.y);
    ctx.rotate(Math.PI / 4);
    ctx.shadowColor = infused
      ? "rgba(255, 214, 117, 0.84)"
      : resonating
        ? "rgba(255, 214, 117, 0.78)"
        : "rgba(82, 224, 210, 0.76)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = infused ? "#fff0bd" : resonating ? "#fff1c5" : "#dcfff8";
    const size = resonating ? 13 : 11;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = infused || resonating ? "#efb354" : "#55ddd1";
    ctx.lineWidth = 3;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  #drawVignette(ctx: CanvasRenderingContext2D): void {
    const vignette = ctx.createRadialGradient(
      this.#width / 2,
      this.#height / 2,
      Math.min(this.#width, this.#height) * 0.26,
      this.#width / 2,
      this.#height / 2,
      Math.max(this.#width, this.#height) * 0.7,
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(3, 8, 6, 0.34)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.#width, this.#height);
  }
}
