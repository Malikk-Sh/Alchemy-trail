import { expect, test } from "@playwright/test";

test("title screen renders without horizontal overflow", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  const title = page.locator("#game-title");
  await title.waitFor({ state: "visible" });
  await expect(title).toHaveText("Alchemy Trail");
  await expect(page.locator(".build-status")).toHaveText(
    "Foundation build · Brewing vertical slice next",
  );

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(overflow).toBe(false);
  expect(consoleErrors).toEqual([]);
});
