export function createTitleScreen(): HTMLElement {
  const screen = document.createElement("section");
  screen.className = "screen title-screen";
  screen.setAttribute("aria-labelledby", "game-title");

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Apothecary field journal";

  const title = document.createElement("h1");
  title.id = "game-title";
  title.textContent = "Alchemy Trail";

  const description = document.createElement("p");
  description.className = "title-copy";
  description.textContent =
    "A tactile alchemy shop simulator about discovering the hidden geometry of ingredients.";

  const status = document.createElement("p");
  status.className = "build-status";
  status.textContent = "Foundation build · Brewing vertical slice next";

  screen.append(eyebrow, title, description, status);
  return screen;
}
