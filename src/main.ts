import { Game } from "./app/Game.js";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("Alchemy Trail could not find the #app root element.");
}

const game = new Game(root);
game.start();
