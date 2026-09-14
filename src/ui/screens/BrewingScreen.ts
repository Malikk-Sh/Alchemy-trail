import { polylineLength } from "../../core/math.js";
import { WARMTH_EFFECT } from "../../data/effects.js";
import { SUNLEAF } from "../../data/ingredients.js";
import { AtlasRenderer } from "../../rendering/AtlasRenderer.js";
import {
  buildIngredientPath,
  markerAtDistance,
  pathCompletion,
  potionQuality,
  resonancePreview,
  unwrapAngleDelta,
} from "../../systems/brewing/BrewMath.js";
import type { BottledPotion } from "../../types/content.js";
import type { Vec2 } from "../../types/game.js";

const STIR_WORLD_UNITS_PER_RADIAN = 36;
const GRIND_TRAVEL_FOR_FULL = 500;
const HOLD_GRIND_DELAY_MS = 260;
const HOLD_GRIND_TICK_MS = 90;
const HOLD_GRIND_DISTANCE = 14;

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
  let infusedPotency: number | null = null;
  let bottled: BottledPotion | null = null;
  let activePointer: number | null = null;
  let previousAngle: number | null = null;
  let grindPointer: number | null = null;
  let grindPoint: Vec2 | null = null;
  let grindHoldDelay: number | null = null;
  let grindHoldTimer: number | null = null;

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

  const stages = document.createElement("ol");
  stages.className = "brew-stages";
  const stageNames = ["Grind", "Stir", "Infuse", "Bottle"] as const;
  const stageItems = stageNames.map((name, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${index + 1}</span>${name}`;
    stages.append(item);
    return item;
  });

  const guidance = document.createElement("p");
  guidance.className = "brew-guidance";
  guidance.setAttribute("role", "status");
  guidance.setAttribute("aria-live", "polite");

  const canvasWrap = document.createElement("div");
  canvasWrap.className = "atlas-canvas-wrap";
  const canvas = document.createElement("canvas");
  canvas.className = "atlas-canvas";
  canvas.setAttribute("aria-label", "Essence Atlas showing Sunleaf path and Warmth resonance node");
  canvasWrap.append(canvas);
  atlasPanel.append(atlasHeader, stages, guidance, canvasWrap);

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
  const grindLabel = document.createElement("div");
  grindLabel.className = "control-label";
  const grindValue = document.createElement("strong");
  grindValue.className = "control-value";
  const grindTitle = document.createElement("span");
  grindTitle.textContent = "Grind Sunleaf";
  grindLabel.append(grindTitle, grindValue);

  const grindPad = document.createElement("button");
  grindPad.id = "grind-range";
  grindPad.type = "button";
  grindPad.className = "grind-pad";
  grindPad.setAttribute("aria-label", "Grind Sunleaf by dragging or holding on the mortar");
  grindPad.innerHTML = '<span class="mortar-icon" aria-hidden="true">✦</span><strong>Grind</strong><small>drag or hold the mortar</small>';

  const grindProgress = document.createElement("div");
  grindProgress.className = "grind-progress";
  grindProgress.setAttribute("role", "progressbar");
  grindProgress.setAttribute("aria-label", "Sunleaf grind progress");
  grindProgress.setAttribute("aria-valuemin", "0");
  grindProgress.setAttribute("aria-valuemax", "100");
  const grindProgressFill = document.createElement("span");
  grindProgress.append(grindProgressFill);

  const commitButton = document.createElement("button");
  commitButton.className = "primary-button";
  commitButton.type = "button";

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
  const resonanceMeter = document.createElement("div");
  resonanceMeter.className = "resonance-meter";
  resonanceMeter.setAttribute("aria-hidden", "true");
  const resonanceFill = document.createElement("span");
  resonanceMeter.append(resonanceFill);
  brewReadout.append(pathReadout, resonanceReadout, resonanceMeter);
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
  const currentResonance = () => resonancePreview(marker, WARMTH_EFFECT);

  const renderer = new AtlasRenderer(canvas, {
    effect: WARMTH_EFFECT,
    previewPath: previewPath(),
    committedPath,
    marker,
    completion: 0,
    resonance: currentResonance(),
    infused,
  });

  const updateStages = (resonating: boolean): void => {
    const committed = committedPath.length > 1;
    const states = [
      { done: committed, current: !committed },
      { done: infused, current: committed && !infused && !resonating },
      { done: infused, current: committed && !infused && resonating },
      { done: bottled !== null, current: infused && bottled === null },
    ];
    stageItems.forEach((item, index) => {
      const state = states[index];
      item.classList.toggle("is-done", state?.done ?? false);
      item.classList.toggle("is-current", state?.current ?? false);
    });
  };

  const update = (): void => {
    const preview = currentResonance();
    const completion = pathCompletion(committedPath, travelled);
    const draftPath = previewPath();
    const draftEnd = draftPath.at(-1) ?? { x: 0, y: 0 };
    const draftReach = resonancePreview(draftEnd, WARMTH_EFFECT);
    const grindPercent = Math.round(grindFraction * 100);

    grindValue.textContent = `${grindPercent}%`;
    grindPad.disabled = committedPath.length > 1 || infused || grindFraction >= 1;
    commitButton.disabled = committedPath.length > 1 || infused || !draftReach.resonating;
    commitButton.textContent = draftReach.resonating ? `Commit ${grindPercent}% path` : "Keep grinding";
    grindProgressFill.style.inlineSize = `${grindPercent}%`;
    grindProgress.setAttribute("aria-valuenow", `${grindPercent}`);
    grindPad.setAttribute("aria-label", `Grind Sunleaf. ${grindPercent} percent ground. Drag or hold to continue.`);
    stirPad.disabled = committedPath.length < 2 || infused;
    stirPad.classList.toggle("is-disabled", stirPad.disabled);
    infuseButton.disabled = !preview.resonating || infused;
    bottleButton.disabled = !infused || bottled !== null;

    screen.classList.toggle("is-resonating", preview.resonating && !infused);
    screen.classList.toggle("is-infused", infused);
    canvasWrap.classList.toggle("is-resonating", preview.resonating && !infused);

    pathReadout.innerHTML = `<span>Path travel</span><strong>${Math.round(completion * 100)}%</strong>`;
    resonanceReadout.innerHTML = preview.resonating
      ? `<span>Warmth resonance</span><strong>${Math.round(preview.potency * 100)}%</strong>`
      : `<span>Warmth distance</span><strong>${Math.round(preview.distance)}</strong>`;
    resonanceFill.style.inlineSize = `${Math.round(preview.potency * 100)}%`;

    if (bottled) {
      const quality = potionQuality(bottled.potency);
      guidance.textContent = `${quality.name} Warmth potion bottled. Try another brew and stop even closer to the resonance core.`;
    } else if (infused) {
      guidance.textContent = `Warmth captured at ${Math.round((infusedPotency ?? 0) * 100)}% potency. Bottle it while the essence is stable.`;
    } else if (committedPath.length > 1 && preview.resonating) {
      guidance.textContent = `Resonance found at ${Math.round(preview.potency * 100)}%. Infuse now, or stir closer to the glowing core for more potency.`;
    } else if (committedPath.length > 1) {
      guidance.textContent = "Trace circles over the cauldron. Stirring advances the marker along the path you exposed by grinding.";
    } else if (draftReach.resonating) {
      guidance.textContent = "Warmth is reachable. Commit this partial path now, or grind farther for a stronger possible infusion.";
    } else {
      guidance.textContent = "Drag across the mortar or press and hold. More grinding exposes more of Sunleaf's hidden essence path.";
    }

    updateStages(preview.resonating);
    renderer.setScene({
      effect: WARMTH_EFFECT,
      previewPath: committedPath.length > 1 ? [] : draftPath,
      committedPath,
      marker,
      completion,
      resonance: preview,
      infused,
    });

    if (bottled) {
      const quality = potionQuality(bottled.potency);
      resultCard.hidden = false;
      resultCard.dataset.quality = quality.id;
      resultCard.innerHTML = `
        <p class="eyebrow">Bottled result</p>
        <div class="result-potion">
          <div class="bottle-mark" aria-hidden="true">
            <svg viewBox="0 0 64 78"><path d="M24 5h16v12l7 8v5H17v-5l7-8V5Z"/><path d="M14 31h36v31c0 7-6 11-18 11S14 69 14 62V31Z"/><path class="bottle-liquid" d="M18 47h28v14c0 5-5 7-14 7s-14-2-14-7V47Z"/></svg>
          </div>
          <div>
            <div class="result-title"><span aria-hidden="true">◆</span><h3>${bottled.effectName} Potion</h3></div>
            <strong class="quality-badge">${quality.name}</strong>
          </div>
        </div>
        <p>Potency <strong>${Math.round(bottled.potency * 100)}%</strong> · essence carried by ${bottled.ingredientName}.</p>
        <p class="quality-copy">${quality.description}</p>
        <button type="button" class="primary-button result-reset">Brew another</button>
      `;
      resultCard.querySelector<HTMLButtonElement>(".result-reset")?.addEventListener("click", reset);
    } else {
      resultCard.hidden = true;
      resultCard.removeAttribute("data-quality");
      resultCard.replaceChildren();
    }
  };

  const stopGrindTimers = (): void => {
    if (grindHoldDelay !== null) window.clearTimeout(grindHoldDelay);
    if (grindHoldTimer !== null) window.clearInterval(grindHoldTimer);
    grindHoldDelay = null;
    grindHoldTimer = null;
  };

  const reset = (): void => {
    stopGrindTimers();
    grindTravel = 0;
    grindFraction = 0;
    committedPath = [];
    travelled = 0;
    marker = { x: 0, y: 0 };
    infused = false;
    infusedPotency = null;
    bottled = null;
    update();
  };

  const addGrindTravel = (distance: number): void => {
    if (committedPath.length > 1 || infused || grindFraction >= 1) return;
    grindTravel = Math.min(GRIND_TRAVEL_FOR_FULL, grindTravel + Math.max(0, distance));
    grindFraction = grindTravel / GRIND_TRAVEL_FOR_FULL;
    if (grindFraction >= 1) stopGrindTimers();
    update();
  };

  grindPad.addEventListener("pointerdown", (event) => {
    if (grindPad.disabled) return;
    grindPointer = event.pointerId;
    grindPoint = { x: event.clientX, y: event.clientY };
    grindPad.setPointerCapture(event.pointerId);
    grindPad.classList.add("is-grinding");
    stopGrindTimers();
    grindHoldDelay = window.setTimeout(() => {
      addGrindTravel(HOLD_GRIND_DISTANCE);
      grindHoldTimer = window.setInterval(() => addGrindTravel(HOLD_GRIND_DISTANCE), HOLD_GRIND_TICK_MS);
    }, HOLD_GRIND_DELAY_MS);
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
    stopGrindTimers();
    grindPad.classList.remove("is-grinding");
  };
  grindPad.addEventListener("pointerup", endGrinding);
  grindPad.addEventListener("pointercancel", endGrinding);
  grindPad.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    addGrindTravel(40);
  });

  commitButton.addEventListener("click", () => {
    const path = previewPath();
    const endpoint = path.at(-1);
    if (!endpoint || !resonancePreview(endpoint, WARMTH_EFFECT).resonating) return;
    committedPath = path;
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
    if (stirPad.disabled) return;
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
    const preview = currentResonance();
    if (!preview.resonating) return;
    infused = true;
    infusedPotency = preview.potency;
    update();
  });

  bottleButton.addEventListener("click", () => {
    if (!infused || bottled || infusedPotency === null) return;
    bottled = {
      effectId: WARMTH_EFFECT.id,
      effectName: WARMTH_EFFECT.name,
      potency: infusedPotency,
      ingredientId: SUNLEAF.id,
      ingredientName: SUNLEAF.name,
    };
    update();
  });

  resetButton.addEventListener("click", reset);
  screen.addEventListener("screenwillhide", () => {
    stopGrindTimers();
    renderer.destroy();
  }, { once: true });

  update();
  return screen;
}
