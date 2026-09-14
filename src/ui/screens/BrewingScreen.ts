import { SUNLEAF } from "../../data/ingredients.js";
import { WARMTH_EFFECT } from "../../data/effects.js";
import { polylineLength } from "../../core/math.js";
import { AtlasRenderer } from "../../rendering/AtlasRenderer.js";
import {
  buildIngredientPath,
  markerAtDistance,
  resonancePreview,
  unwrapAngleDelta,
} from "../../systems/brewing/BrewMath.js";
import type { BottledPotion } from "../../types/content.js";
import type { Vec2 } from "../../types/game.js";

const STIR_WORLD_UNITS_PER_RADIAN = 28;
const GRIND_TRAVEL_FOR_FULL = 520;

export function createBrewingScreen(onExit: () => void): HTMLElement {
  const screen = document.createElement("section");
  screen.className = "screen brewing-screen";
  screen.setAttribute("aria-labelledby", "brew-title");

  let grindTravel = 0;
  let grindFraction = 0;
  let committedPath: Vec2[] = [];
  let travelled = 0;
  let marker: Vec2 = { x: 0, y: 0 };
  let infused = false;
  let bottled: BottledPotion | null = null;
  let activePointer: number | null = null;
  let previousAngle: number | null = null;
  let grindPointer: number | null = null;
  let grindPoint: Vec2 | null = null;

  const header = document.createElement("header");
  header.className = "game-topbar";

  const back = document.createElement("button");
  back.className = "icon-button";
  back.type = "button";
  back.setAttribute("aria-label", "Back to title");
  back.textContent = "‹";
  back.addEventListener("click", onExit);

  const brand = document.createElement("div");
  brand.className = "brand-lockup";
  brand.innerHTML = '<span aria-hidden="true">🌿</span><strong>Alchemy Trail</strong>';

  const day = document.createElement("span");
  day.className = "day-chip";
  day.textContent = "Day 1";

  header.append(back, brand, day);

  const atlasPanel = document.createElement("section");
  atlasPanel.className = "atlas-panel";

  const atlasHeader = document.createElement("div");
  atlasHeader.className = "panel-heading-row";
  atlasHeader.innerHTML = '<div><p class="eyebrow">Essence Atlas</p><h2 id="brew-title">First infusion</h2></div><span class="effect-chip">Warmth</span>';

  const canvasWrap = document.createElement("div");
  canvasWrap.className = "atlas-canvas-wrap";
  const canvas = document.createElement("canvas");
  canvas.className = "atlas-canvas";
  canvas.setAttribute("aria-label", "Essence Atlas showing Sunleaf path and Warmth resonance node");
  canvasWrap.append(canvas);

  atlasPanel.append(atlasHeader, canvasWrap);

  const workbench = document.createElement("section");
  workbench.className = "workbench";

  const ingredientCard = document.createElement("article");
  ingredientCard.className = "parchment-card ingredient-card";
  ingredientCard.innerHTML = `
    <div class="ingredient-symbol" aria-hidden="true">${SUNLEAF.symbol}</div>
    <div class="ingredient-copy">
      <p class="eyebrow">Ingredient</p>
      <h3>${SUNLEAF.name}</h3>
      <p>${SUNLEAF.description}</p>
    </div>
  `;

  const grindBlock = document.createElement("div");
  grindBlock.className = "control-block";
  const grindLabel = document.createElement("label");
  grindLabel.className = "control-label";
  grindLabel.htmlFor = "grind-range";
  const grindValue = document.createElement("strong");
  grindValue.className = "control-value";
  const grindTitle = document.createElement("span");
  grindTitle.textContent = "Grind Sunleaf";
  grindLabel.append(grindTitle, grindValue);

  const grindPad = document.createElement("button");
  grindPad.id = "grind-range";
  grindPad.type = "button";
  grindPad.className = "grind-pad";
  grindPad.setAttribute("aria-label", "Grind Sunleaf by dragging across the mortar");
  grindPad.innerHTML = '<span class="mortar-icon" aria-hidden="true">✦</span><strong>Grind</strong><small>drag across the mortar</small>';

  const grindProgress = document.createElement("div");
  grindProgress.className = "grind-progress";
  const grindProgressFill = document.createElement("span");
  grindProgress.append(grindProgressFill);

  const commitButton = document.createElement("button");
  commitButton.className = "primary-button";
  commitButton.type = "button";
  commitButton.textContent = "Commit ingredient";

  grindBlock.append(grindLabel, grindPad, grindProgress, commitButton);

  const stirBlock = document.createElement("div");
  stirBlock.className = "stir-block";
  const stirPad = document.createElement("button");
  stirPad.type = "button";
  stirPad.className = "stir-pad";
  stirPad.setAttribute("aria-label", "Stir the cauldron by tracing circles with your pointer");
  stirPad.innerHTML = '<span class="stir-spoon" aria-hidden="true">↻</span><strong>Stir</strong><small>trace circles</small>';

  const brewReadout = document.createElement("div");
  brewReadout.className = "brew-readout";
  const pathReadout = document.createElement("div");
  const resonanceReadout = document.createElement("div");
  brewReadout.append(pathReadout, resonanceReadout);
  stirBlock.append(stirPad, brewReadout);

  const actionRow = document.createElement("div");
  actionRow.className = "action-row";
  const resetButton = document.createElement("button");
  resetButton.className = "secondary-button";
  resetButton.type = "button";
  resetButton.textContent = "Reset";

  const infuseButton = document.createElement("button");
  infuseButton.className = "primary-button";
  infuseButton.type = "button";
  infuseButton.textContent = "Infuse Warmth";

  const bottleButton = document.createElement("button");
  bottleButton.className = "secondary-button";
  bottleButton.type = "button";
  bottleButton.textContent = "Bottle";

  actionRow.append(resetButton, infuseButton, bottleButton);

  const resultCard = document.createElement("article");
  resultCard.className = "parchment-card result-card";
  resultCard.hidden = true;

  workbench.append(ingredientCard, grindBlock, stirBlock, actionRow, resultCard);
  screen.append(header, atlasPanel, workbench);

  const previewPath = (): Vec2[] => buildIngredientPath({ x: 0, y: 0 }, SUNLEAF.path, grindFraction);

  const renderer = new AtlasRenderer(canvas, {
    effect: WARMTH_EFFECT,
    previewPath: previewPath(),
    committedPath,
    marker,
    infused,
  });

  const update = (): void => {
    const preview = resonancePreview(marker, WARMTH_EFFECT);
    const total = polylineLength(committedPath);
    const completion = total > 0 ? Math.min(1, travelled / total) : 0;

    grindValue.textContent = `${Math.round(grindFraction * 100)}%`;
    grindPad.disabled = committedPath.length > 1 || infused || grindFraction >= 1;
    commitButton.disabled = committedPath.length > 1 || infused || grindFraction < 0.08;
    grindProgressFill.style.inlineSize = `${Math.round(grindFraction * 100)}%`;
    grindPad.setAttribute("aria-label", `Grind Sunleaf. ${Math.round(grindFraction * 100)} percent ground.`);
    stirPad.classList.toggle("is-disabled", committedPath.length < 2 || infused);
    infuseButton.disabled = !preview.resonating || infused;
    bottleButton.disabled = !infused || bottled !== null;

    pathReadout.innerHTML = `<span>Path</span><strong>${Math.round(completion * 100)}%</strong>`;
    resonanceReadout.innerHTML = preview.resonating
      ? `<span>Resonance</span><strong>${Math.round(preview.potency * 100)}%</strong>`
      : `<span>Warmth distance</span><strong>${Math.round(preview.distance)}</strong>`;

    renderer.setScene({
      effect: WARMTH_EFFECT,
      previewPath: committedPath.length > 1 ? [] : previewPath(),
      committedPath,
      marker,
      infused,
    });

    if (bottled) {
      resultCard.hidden = false;
      resultCard.innerHTML = `
        <p class="eyebrow">Bottled result</p>
        <div class="result-title"><span aria-hidden="true">◆</span><h3>${bottled.effectName} Potion</h3></div>
        <p>Potency <strong>${Math.round(bottled.potency * 100)}%</strong> · essence carried by ${bottled.ingredientName}.</p>
        <button type="button" class="primary-button result-reset">Brew another</button>
      `;
      resultCard.querySelector<HTMLButtonElement>(".result-reset")?.addEventListener("click", reset);
    } else {
      resultCard.hidden = true;
      resultCard.replaceChildren();
    }
  };

  const reset = (): void => {
    grindTravel = 0;
    grindFraction = 0;
    committedPath = [];
    travelled = 0;
    marker = { x: 0, y: 0 };
    infused = false;
    bottled = null;
    update();
  };

  const addGrindTravel = (distance: number): void => {
    if (committedPath.length > 1 || infused) return;
    grindTravel = Math.min(GRIND_TRAVEL_FOR_FULL, grindTravel + Math.max(0, distance));
    grindFraction = grindTravel / GRIND_TRAVEL_FOR_FULL;
    update();
  };

  grindPad.addEventListener("pointerdown", (event) => {
    if (grindPad.disabled) return;
    grindPointer = event.pointerId;
    grindPoint = { x: event.clientX, y: event.clientY };
    grindPad.setPointerCapture(event.pointerId);
    grindPad.classList.add("is-grinding");
  });

  grindPad.addEventListener("pointermove", (event) => {
    if (grindPointer !== event.pointerId || !grindPoint) return;
    const next = { x: event.clientX, y: event.clientY };
    const travel = Math.min(48, Math.hypot(next.x - grindPoint.x, next.y - grindPoint.y));
    grindPoint = next;
    addGrindTravel(travel);
  });

  const endGrinding = (event: PointerEvent): void => {
    if (grindPointer !== event.pointerId) return;
    grindPointer = null;
    grindPoint = null;
    grindPad.classList.remove("is-grinding");
  };

  grindPad.addEventListener("pointerup", endGrinding);
  grindPad.addEventListener("pointercancel", endGrinding);
  grindPad.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    addGrindTravel(36);
  });

  commitButton.addEventListener("click", () => {
    committedPath = previewPath();
    travelled = 0;
    marker = committedPath[0] ? { ...committedPath[0] } : { x: 0, y: 0 };
    update();
  });

  const stirByRadians = (radians: number): void => {
    if (committedPath.length < 2 || infused) return;
    travelled = Math.min(polylineLength(committedPath), travelled + Math.abs(radians) * STIR_WORLD_UNITS_PER_RADIAN);
    marker = markerAtDistance(committedPath, travelled);
    update();
  };

  stirPad.addEventListener("pointerdown", (event) => {
    if (committedPath.length < 2 || infused) return;
    activePointer = event.pointerId;
    stirPad.setPointerCapture(event.pointerId);
    const rect = stirPad.getBoundingClientRect();
    previousAngle = Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
    stirPad.classList.add("is-stirring");
  });

  stirPad.addEventListener("pointermove", (event) => {
    if (activePointer !== event.pointerId || previousAngle === null) return;
    const rect = stirPad.getBoundingClientRect();
    const angle = Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
    stirByRadians(unwrapAngleDelta(previousAngle, angle));
    previousAngle = angle;
  });

  const endStir = (event: PointerEvent): void => {
    if (activePointer !== event.pointerId) return;
    activePointer = null;
    previousAngle = null;
    stirPad.classList.remove("is-stirring");
  };

  stirPad.addEventListener("pointerup", endStir);
  stirPad.addEventListener("pointercancel", endStir);

  stirPad.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    stirByRadians(Math.PI / 3);
  });

  infuseButton.addEventListener("click", () => {
    const preview = resonancePreview(marker, WARMTH_EFFECT);
    if (!preview.resonating) return;
    infused = true;
    update();
  });

  bottleButton.addEventListener("click", () => {
    if (!infused || bottled) return;
    const preview = resonancePreview(marker, WARMTH_EFFECT);
    bottled = {
      effectId: WARMTH_EFFECT.id,
      effectName: WARMTH_EFFECT.name,
      potency: preview.potency,
      ingredientId: SUNLEAF.id,
      ingredientName: SUNLEAF.name,
    };
    update();
  });

  resetButton.addEventListener("click", reset);
  screen.addEventListener("screenwillhide", () => renderer.destroy(), { once: true });

  update();
  return screen;
}
