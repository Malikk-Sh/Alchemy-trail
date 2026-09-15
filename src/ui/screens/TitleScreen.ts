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
  eyebrow.textContent = "Полевой журнал алхимика";

  const title = document.createElement("h1");
  title.id = "game-title";
  title.textContent = "Alchemy Trail";

  const description = document.createElement("p");
  description.className = "title-copy";
  description.textContent =
    "Исследуй скрытую геометрию ингредиентов, направляй живой путь эссенции и захватывай эффекты своими руками.";

  const start = document.createElement("button");
  start.className = "primary-button title-start";
  start.type = "button";
  start.textContent = "Открыть Атлас эссенций";
  start.addEventListener("click", onStart);

  const status = document.createElement("p");
  status.className = "build-status";
  status.textContent = "Первое зелье · Солнцелист → Тепло";

  screen.append(seal, eyebrow, title, description, start, status);
  return screen;
}
