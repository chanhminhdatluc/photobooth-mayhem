import { expect, test } from "@playwright/test";

test("home, renderer pixels, resize, navigation cleanup and reload", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /TIỆM ẢNH BẤT ỔN/ })).toBeVisible();
  await page.getByRole("link", { name: /Vào thăm tiệm/ }).click();
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  await expect(page.locator("canvas")).toHaveCount(1);
  // Verify a colored booth pixel differs from the background, not just an empty canvas.
  expect(await page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    const background = [...ctx.getImageData(1, 1, 1, 1).data];
    const booth = [...ctx.getImageData(120, 140, 1, 1).data];
    return booth[3] === 255 && background.some((value, i) => value !== booth[i]);
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("renderer.png"), fullPage: true });
  for (const viewport of [{ width: 320, height: 640 }, { width: 740, height: 360 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const box = await page.locator("canvas").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
  }
  for (let i = 0; i < 3; i++) {
    await page.getByRole("link", { name: "Về trang chủ" }).click();
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("link", { name: /Vào thăm tiệm/ }).click();
    await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
    await expect(page.locator("canvas")).toHaveCount(1);
  }
  await page.reload();
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  expect(errors).toEqual([]);
});

test("SSR home renders without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /TIỆM ẢNH BẤT ỔN/ })).toBeVisible();
  await page.goto("/game");
  await expect(page.getByText("Cần bật JavaScript để hiển thị tiệm ảnh.")).toBeVisible();
  await context.close();
});