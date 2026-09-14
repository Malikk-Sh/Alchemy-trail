import type { GameScreen } from "../types/game.js";

type ScreenRenderer = () => HTMLElement;

export class ScreenManager {
  readonly #root: HTMLElement;
  readonly #renderers = new Map<GameScreen, ScreenRenderer>();
  #current: GameScreen | null = null;

  constructor(root: HTMLElement) {
    this.#root = root;
  }

  register(screen: GameScreen, renderer: ScreenRenderer): void {
    this.#renderers.set(screen, renderer);
  }

  show(screen: GameScreen): void {
    const renderer = this.#renderers.get(screen);
    if (!renderer) {
      throw new Error(`Screen '${screen}' is not registered.`);
    }

    this.#root.replaceChildren(renderer());
    this.#current = screen;
    this.#root.dataset.screen = screen;
  }

  get current(): GameScreen | null {
    return this.#current;
  }
}
