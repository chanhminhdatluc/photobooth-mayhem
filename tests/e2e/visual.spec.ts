import { expect, test } from "@playwright/test";
import { shopBounds } from "../../game/rendering/camera";

test("responsive framing and manager frames remain live", async ({ page }) => {
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  for (const size of [{ width: 360, height: 740 }, { width: 1000, height: 850 }, { width: 740, height: 360 }]) {
    await page.setViewportSize(size);
    await expect.poll(async () => {
      const c = await page.locator("canvas").evaluate(canvas => JSON.parse(canvas.dataset.camera!) as { width: number; height: number; zoom: number });
      const b = shopBounds();
      return c.zoom >= 2.5 && c.zoom <= 5 && ((b.right - b.left) * c.zoom > c.width || (b.bottom - b.top) * c.zoom > c.height);
    }).toBe(true);
  }
  await page.getByRole("button", { name: "Kiểm tra máy" }).click();
  const frames = new Set<string>();
  for (let i = 0; i < 8; i++) { frames.add(await page.locator("canvas").getAttribute("data-actor-frame") ?? ""); await page.waitForTimeout(140); }
  expect(frames.size).toBeGreaterThan(1);
  await expect(page.getByText("Chủ tiệm đã đến chỗ kiểm tra máy.")).toBeVisible();
});