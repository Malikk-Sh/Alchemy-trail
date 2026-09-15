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

    this.#drawAtlasMaterial(ctx);
    this.#drawAmbientGlow(ctx);
    this.#drawTopography(ctx);
    this.#drawRuneField(ctx);
    this.#drawCompassRose(ctx);
    this.#drawOrigin(ctx);
    this.#drawEffect(ctx, this.#scene.effect, this.#scene.resonance, this.#scene.infused);

    this.#drawPath(ctx, this.#scene.previewPath, "rgba(236, 199, 126, 0.54)", 2.1, [5, 7], false);

    if (this.#scene.committedPath.length > 1) {
      this.#drawPath(ctx, this.#scene.committedPath, "rgba(211, 171, 98, 0.27)", 3.8, [], false);
      const travelled = slicePolylineByFraction(this.#scene.committedPath, this.#scene.completion);
      this.#drawPath(ctx, travelled, "#7ce4d2", 5.1, [], true);
      this.#drawPathAnchors(ctx, this.#scene.committedPath, travelled.length);
    }

    if (this.#scene.resonance.resonating && !this.#scene.infused) {
      this.#drawResonanceLink(
        ctx,
        this.#scene.marker,
        this.#scene.effect.node,
        this.#scene.resonance.potency,
      );
    }

    this.#drawMarker(ctx, this.#scene.marker, this.#scene.resonance.resonating, this.#scene.infused);
    this.#drawFrameEtching(ctx);
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

  #drawAtlasMaterial(ctx: CanvasRenderingContext2D): void {
    const base = ctx.createLinearGradient(0, 0, this.#width, this.#height);
    base.addColorStop(0, "#19352c");
    base.addColorStop(0.42, "#112a23");
    base.addColorStop(1, "#0a1c18");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, this.#width, this.#height);

    const wash = ctx.createRadialGradient(
      this.#width * 0.5,
      this.#height * 0.48,
      0,
      this.#width * 0.5,
      this.#height * 0.48,
      Math.max(this.#width, this.#height) * 0.72,
    );
    wash.addColorStop(0, "rgba(82, 119, 86, 0.12)");
    wash.addColorStop(0.62, "rgba(46, 78, 59, 0.04)");
    wash.addColorStop(1, "rgba(4, 11, 9, 0.28)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, this.#width, this.#height);

    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let index = 0; index < 56; index += 1) {
      const x = ((index * 73 + 31) % 991) / 991 * this.#width;
      const y = ((index * 149 + 17) % 787) / 787 * this.#height;
      const length = 5 + (index % 5) * 2;
      ctx.strokeStyle = index % 3 === 0 ? "#d8c293" : "#87a88d";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + ((index % 2) * 2 - 1));
      ctx.stroke();
    }
    ctx.restore();
  }

  #drawAmbientGlow(ctx: CanvasRenderingContext2D): void {
    const warm = ctx.createRadialGradient(
      this.#width * 0.77,
      this.#height * 0.34,
      0,
      this.#width * 0.77,
      this.#height * 0.34,
      this.#width * 0.38,
    );
    warm.addColorStop(0, "rgba(227, 173, 78, 0.14)");
    warm.addColorStop(0.42, "rgba(210, 142, 55, 0.05)");
    warm.addColorStop(1, "rgba(218, 173, 86, 0)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, this.#width, this.#height);

    const teal = ctx.createRadialGradient(
      this.#width * 0.25,
      this.#height * 0.68,
      0,
      this.#width * 0.25,
      this.#height * 0.68,
      this.#width * 0.34,
    );
    teal.addColorStop(0, "rgba(93, 205, 180, 0.08)");
    teal.addColorStop(1, "rgba(86, 202, 180, 0)");
    ctx.fillStyle = teal;
    ctx.fillRect(0, 0, this.#width, this.#height);
  }

  #drawTopography(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = 0.9;
    const bands = [0.2, 0.33, 0.49, 0.66, 0.82];
    bands.forEach((band, index) => {
      ctx.strokeStyle = index % 2 === 0
        ? "rgba(220, 199, 151, 0.075)"
        : "rgba(123, 163, 126, 0.075)";
      ctx.beginPath();
      for (let step = 0; step <= 36; step += 1) {
        const x = (step / 36) * this.#width;
        const wave = Math.sin(step * 0.49 + index * 1.31) * (6 + index * 2.2)
          + Math.cos(step * 0.23 + index) * 3.5;
        const y = this.#height * band + wave;
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    for (let ring = 0; ring < 5; ring += 1) {
      ctx.strokeStyle = ring % 2 === 0
        ? "rgba(111, 156, 121, 0.08)"
        : "rgba(205, 186, 139, 0.06)";
      ctx.beginPath();
      ctx.ellipse(
        this.#width * (0.16 + ring * 0.17),
        this.#height * (0.34 + (ring % 2) * 0.22),
        38 + ring * 27,
        19 + ring * 12,
        -0.28 + ring * 0.09,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  #drawRuneField(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let index = 0; index < 26; index += 1) {
      const x = ((index * 83 + 41) % 997) / 997 * this.#width;
      const y = ((index * 137 + 19) % 809) / 809 * this.#height;
      const radius = index % 6 === 0 ? 1.6 : 0.8;
      ctx.fillStyle = index % 5 === 0
        ? "rgba(235, 196, 117, 0.25)"
        : "rgba(193, 226, 207, 0.15)";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const marks = [
      { x: 0.14, y: 0.25, r: -0.28 },
      { x: 0.48, y: 0.17, r: 0.14 },
      { x: 0.66, y: 0.76, r: -0.08 },
      { x: 0.9, y: 0.7, r: 0.34 },
    ];
    ctx.strokeStyle = "rgba(218, 194, 139, 0.14)";
    ctx.lineWidth = 1;
    marks.forEach((mark) => {
      ctx.save();
      ctx.translate(this.#width * mark.x, this.#height * mark.y);
      ctx.rotate(mark.r);
      ctx.beginPath();
      ctx.moveTo(-5, 4);
      ctx.lineTo(0, -6);
      ctx.lineTo(5, 4);
      ctx.moveTo(-3.5, 1);
      ctx.lineTo(3.5, 1);
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  #drawCompassRose(ctx: CanvasRenderingContext2D): void {
    const x = this.#width - 25;
    const y = 26;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "rgba(226, 200, 143, 0.24)";
    ctx.fillStyle = "rgba(226, 200, 143, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.stroke();
    for (let index = 0; index < 8; index += 1) {
      ctx.save();
      ctx.rotate(index * Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(3, -3);
      ctx.lineTo(0, -5);
      ctx.lineTo(-3, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  #drawOrigin(ctx: CanvasRenderingContext2D): void {
    const point = this.#worldToScreen({ x: 0, y: 0 });
    ctx.save();
    ctx.strokeStyle = "rgba(239, 224, 192, 0.62)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(point.x - 11, point.y);
    ctx.lineTo(point.x - 5, point.y);
    ctx.moveTo(point.x + 5, point.y);
    ctx.lineTo(point.x + 11, point.y);
    ctx.moveTo(point.x, point.y - 11);
    ctx.lineTo(point.x, point.y - 5);
    ctx.moveTo(point.x, point.y + 5);
    ctx.lineTo(point.x, point.y + 11);
    ctx.stroke();
    ctx.fillStyle = "rgba(239, 224, 192, 0.28)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
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
    const intensity = infused ? 1 : resonance.resonating ? 0.58 + resonance.potency * 0.42 : 0.46;

    ctx.save();
    const glow = ctx.createRadialGradient(point.x, point.y, 2, point.x, point.y, radius * 1.08);
    glow.addColorStop(0, `rgba(255, 232, 169, ${0.68 * intensity})`);
    glow.addColorStop(0.2, `rgba(244, 181, 79, ${0.34 * intensity})`);
    glow.addColorStop(0.58, `rgba(203, 126, 43, ${0.09 * intensity})`);
    glow.addColorStop(1, "rgba(239, 169, 79, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 1.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(point.x, point.y);
    ctx.strokeStyle = resonance.resonating
      ? "rgba(255, 224, 159, 0.72)"
      : "rgba(224, 178, 91, 0.28)";
    ctx.lineWidth = resonance.resonating ? 1.8 : 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = resonance.resonating
      ? "rgba(244, 196, 104, 0.44)"
      : "rgba(219, 180, 104, 0.16)";
    ctx.lineWidth = 1;
    for (let index = 0; index < 8; index += 1) {
      ctx.save();
      ctx.rotate(index * Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.48);
      ctx.lineTo(0, -radius * 0.61);
      ctx.stroke();
      ctx.restore();
    }

    ctx.shadowColor = "rgba(239, 169, 79, 0.86)";
    ctx.shadowBlur = resonance.resonating || infused ? 24 : 10;
    ctx.rotate(Math.PI / 4);
    const nodeSize = infused ? 15 : resonance.resonating ? 14 : 12;
    ctx.fillStyle = infused ? "#fff1c2" : "#f2b65a";
    ctx.fillRect(-nodeSize / 2, -nodeSize / 2, nodeSize, nodeSize);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = infused ? "#fff8de" : "rgba(255,255,255,.82)";
    ctx.lineWidth = 2;
    ctx.strokeRect(-nodeSize / 2, -nodeSize / 2, nodeSize, nodeSize);
    ctx.rotate(-Math.PI / 4);

    const labelWidth = 62;
    ctx.fillStyle = "rgba(38, 25, 19, 0.86)";
    ctx.beginPath();
    ctx.roundRect(-labelWidth / 2, -43, labelWidth, 21, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(226, 186, 110, 0.2)";
    ctx.stroke();
    ctx.font = "700 12px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f8e4bb";
    ctx.fillText(effect.name, 0, -32.5);
    ctx.restore();
  }

  #drawPath(
    ctx: CanvasRenderingContext2D,
    points: readonly Vec2[],
    stroke: string,
    width: number,
    dash: readonly number[],
    travelled: boolean,
  ): void {
    if (points.length < 2) return;

    const drawPolyline = (): void => {
      ctx.beginPath();
      points.forEach((point, index) => {
        const screen = this.#worldToScreen(point);
        if (index === 0) ctx.moveTo(screen.x, screen.y);
        else ctx.lineTo(screen.x, screen.y);
      });
      ctx.stroke();
    };

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([...dash]);

    if (width >= 3.5) {
      ctx.strokeStyle = "rgba(4, 12, 10, 0.72)";
      ctx.lineWidth = width + 5;
      drawPolyline();
      ctx.strokeStyle = travelled ? "rgba(231, 221, 177, 0.18)" : "rgba(224, 182, 104, 0.12)";
      ctx.lineWidth = width + 1.6;
      drawPolyline();
    }

    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.shadowColor = travelled ? "rgba(102, 225, 205, 0.28)" : "transparent";
    ctx.shadowBlur = travelled ? 7 : 0;
    drawPolyline();

    if (travelled) {
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(223, 255, 246, 0.46)";
      ctx.lineWidth = 1.15;
      drawPolyline();
    }
    ctx.restore();
  }

  #drawPathAnchors(ctx: CanvasRenderingContext2D, path: readonly Vec2[], travelledPoints: number): void {
    if (path.length < 2) return;
    ctx.save();
    path.forEach((point, index) => {
      if (index === 0 || index === path.length - 1) return;
      const screen = this.#worldToScreen(point);
      const reached = index < travelledPoints;
      ctx.fillStyle = reached ? "rgba(176, 238, 219, 0.7)" : "rgba(213, 180, 116, 0.36)";
      ctx.strokeStyle = reached ? "rgba(232, 255, 247, 0.72)" : "rgba(236, 208, 153, 0.42)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, reached ? 3 : 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
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
    const middleX = (markerPoint.x + nodePoint.x) / 2;
    const middleY = (markerPoint.y + nodePoint.y) / 2 - 6;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 213, 125, ${0.22 + potency * 0.56})`;
    ctx.lineWidth = 1.4 + potency * 1.8;
    ctx.shadowColor = "rgba(255, 194, 87, 0.32)";
    ctx.shadowBlur = 8;
    ctx.setLineDash([2.5, 5.5]);
    ctx.beginPath();
    ctx.moveTo(markerPoint.x, markerPoint.y);
    ctx.quadraticCurveTo(middleX, middleY, nodePoint.x, nodePoint.y);
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

    if (resonating || infused) {
      ctx.strokeStyle = infused ? "rgba(255,220,137,.5)" : "rgba(115,232,211,.34)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, infused ? 15 : 13, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.rotate(Math.PI / 4);
    ctx.shadowColor = infused
      ? "rgba(255, 214, 117, 0.84)"
      : resonating
        ? "rgba(255, 214, 117, 0.7)"
        : "rgba(98, 222, 203, 0.62)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = infused ? "#fff0bd" : resonating ? "#fff1c5" : "#d6fff5";
    const size = resonating || infused ? 12 : 10;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = infused || resonating ? "#eeb15a" : "#58cdbc";
    ctx.lineWidth = 2;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  #drawFrameEtching(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "rgba(226, 196, 137, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(7.5, 7.5, Math.max(0, this.#width - 15), Math.max(0, this.#height - 15));
    ctx.strokeStyle = "rgba(109, 151, 118, 0.09)";
    ctx.strokeRect(11.5, 11.5, Math.max(0, this.#width - 23), Math.max(0, this.#height - 23));

    const corners: readonly Vec2[] = [
      { x: 13, y: 13 },
      { x: this.#width - 13, y: 13 },
      { x: 13, y: this.#height - 13 },
      { x: this.#width - 13, y: this.#height - 13 },
    ];
    ctx.fillStyle = "rgba(222, 191, 129, 0.16)";
    corners.forEach((corner) => {
      ctx.save();
      ctx.translate(corner.x, corner.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-2.5, -2.5, 5, 5);
      ctx.restore();
    });
    ctx.restore();
  }

  #drawVignette(ctx: CanvasRenderingContext2D): void {
    const vignette = ctx.createRadialGradient(
      this.#width / 2,
      this.#height / 2,
      Math.min(this.#width, this.#height) * 0.24,
      this.#width / 2,
      this.#height / 2,
      Math.max(this.#width, this.#height) * 0.72,
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(0.72, "rgba(2, 7, 5, 0.08)");
    vignette.addColorStop(1, "rgba(2, 7, 5, 0.4)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.#width, this.#height);
  }
}
