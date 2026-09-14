import { expect, test } from "@playwright/test";

test("title screen renders without horizontal overflow", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Alchemy Trail" })).toBeVisible();
  await expect(page.getByText("Foundation build · Brewing vertical slice next")).toBeVisible();

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(overflow).toBe(false);
  expect(consoleErrors).toEqual([]);
});
