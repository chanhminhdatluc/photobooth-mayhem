import { expect, test } from "@playwright/test";

test("local Vietnamese fonts load before canvas and narrow UI stays within viewport", async ({ page }, testInfo) => {
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  await expect(page.locator('[data-fonts-ready="true"] canvas')).toHaveCount(1);
  const fonts = await page.evaluate(async () => {
    const root = getComputedStyle(document.documentElement);
    const body = root.getPropertyValue("--font-body").trim();
    const heading = root.getPropertyValue("--font-heading").trim();
    const sample = "Tiệm Ảnh Bất Ổn – Nâng cấp – Đang lưu tiến trình…";
    const faces = await Promise.all([document.fonts.load(`400 16px ${body}`, sample), document.fonts.load(`800 24px ${heading}`, sample)]);
    return { loaded: faces.every(items => items.length > 0 && items.every(f => f.status === "loaded")), body: getComputedStyle(document.body).fontFamily, heading: getComputedStyle(document.querySelector("h1")!).fontFamily };
  });
  expect(fonts.loaded).toBe(true);
  expect(fonts.body).not.toBe(fonts.heading);
  await page.getByRole("button", { name: "Kiểm tra máy" }).click();
  for (const width of [320, 360, 1000]) {
    await page.setViewportSize({ width, height: 850 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`typography-${width}.png`), fullPage: true });
  }
});

test("font failures keep canvas unmounted and retry recovers", async ({ page }) => {
  await page.route(/\.(ttf|woff2?)(\?|$)/, route => route.abort());
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).not.toContainText("Tiệm đã sẵn sàng");
  await expect(page.getByRole("button", { name: "Thử mở lại tiệm" })).toBeVisible({ timeout: 20000 });
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.unroute(/\.(ttf|woff2?)(\?|$)/);
  // A fresh navigation retries failed network font faces as well as the renderer.
  await page.reload();
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
});