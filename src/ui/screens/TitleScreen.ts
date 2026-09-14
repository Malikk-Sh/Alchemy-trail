export function createTitleScreen(onStart: () => void): HTMLElement {
  const screen = document.createElement("section");
  screen.className = "screen title-screen";
  screen.setAttribute("aria-labelledby", "game-title");

  const seal = document.createElement("div");
  seal.className = "title-seal";
  seal.setAttribute("aria-hidden", "true");
  seal.textContent = "✦";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Apothecary field journal";

  const title = document.createElement("h1");
  title.id = "game-title";
  title.textContent = "Alchemy Trail";

  const description = document.createElement("p");
  description.className = "title-copy";
  description.textContent =
    "Trace the hidden geometry of ingredients, steer a living essence path, and capture effects by hand.";

  const start = document.createElement("button");
  start.className = "primary-button title-start";
  start.type = "button";
  start.textContent = "Open the Essence Atlas";
  start.addEventListener("click", onStart);

  const status = document.createElement("p");
  status.className = "build-status";
  status.textContent = "First playable brew · Sunleaf → Warmth";

  screen.append(seal, eyebrow, title, description, start, status);
  return screen;
}
