import { createTitleScreen } from "../ui/screens/TitleScreen.js";
import { ScreenManager } from "./ScreenManager.js";

export class Game {
  readonly #screens: ScreenManager;

  constructor(root: HTMLElement) {
    this.#screens = new ScreenManager(root);
    this.#screens.register("title", createTitleScreen);
  }

  start(): void {
    this.#screens.show("title");
  }
}
