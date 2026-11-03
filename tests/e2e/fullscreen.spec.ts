import { expect, test } from "@playwright/test";

test("edge-to-edge world remains unchanged behind floating menus", async ({ page }, info) => {
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  for (const viewport of [{ width: 360, height: 800 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.locator("canvas").boundingBox()).toEqual({ x: 0, y: 0, ...viewport });
    await expect(page.locator(".studio-header, .studio-shell, .renderer-footer, .equipment-dock")).toHaveCount(0);
    expect(await page.locator(".game-hints").evaluate(element => getComputedStyle(element).pointerEvents)).toBe("none");
    expect(await page.evaluate(() => ({ overflow: getComputedStyle(document.documentElement).overflow, horizontal: document.documentElement.scrollWidth > innerWidth }))).toEqual({ overflow: "hidden", horizontal: false });
    await page.getByRole("button", { name: "Tùy chọn", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await page.locator("canvas").boundingBox()).toEqual({ x: 0, y: 0, ...viewport });
    await page.getByRole("button", { name: "Đóng", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Quản lý tiệm", exact: true }).click();
    expect(await page.locator("canvas").boundingBox()).toEqual({ x: 0, y: 0, ...viewport });
    await page.getByRole("button", { name: "Đóng", exact: true }).click();
    await page.screenshot({ path: info.outputPath(`fullscreen-${viewport.width}.png`) });
  }
  await page.getByRole("button", { name: "Tùy chọn", exact: true }).click();
  await page.getByRole("link", { name: "Về trang chủ" }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
});