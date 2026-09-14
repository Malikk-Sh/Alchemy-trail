import { createBrewingScreen } from "../ui/screens/BrewingScreen.js";
import { createTitleScreen } from "../ui/screens/TitleScreen.js";
import { ScreenManager } from "./ScreenManager.js";

export class Game {
  readonly #screens: ScreenManager;

  constructor(root: HTMLElement) {
    this.#screens = new ScreenManager(root);
    this.#screens.register("title", () => createTitleScreen(() => this.#screens.show("brewing")));
    this.#screens.register("brewing", () => createBrewingScreen(() => this.#screens.show("title")));
  }

  start(): void {
    this.#screens.show("title");
  }
}
