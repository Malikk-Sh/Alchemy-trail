import { expect, test } from "@playwright/test";

test("title screen renders without horizontal overflow", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  await page.waitForTimeout(1_000);

  const state = await page.evaluate(() => ({
    title: document.querySelector("#game-title")?.textContent ?? null,
    buildStatus: document.querySelector(".build-status")?.textContent ?? null,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    appScreen: document.querySelector("#app")?.getAttribute("data-screen") ?? null,
  }));

  expect(state.title).toBe("Alchemy Trail");
  expect(state.buildStatus).toBe("Foundation build · Brewing vertical slice next");
  expect(state.appScreen).toBe("title");
  expect(state.overflow).toBe(false);
  expect(consoleErrors).toEqual([]);
});
