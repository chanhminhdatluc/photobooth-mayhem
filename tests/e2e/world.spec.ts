import { expect, test, type Page } from "@playwright/test";
import { project } from "../../game/isometric/projection";

async function point(page: Page, x: number, y: number) {
  const box = (await page.locator("canvas").boundingBox())!;
  return { x: box.x + x * box.width / 360, y: box.y + y * box.height / 420 };
}
async function tap(page: Page, mobile: boolean, x: number, y: number) {
  const p = await point(page, x, y);
  if (mobile) await page.touchscreen.tap(p.x, p.y); else await page.mouse.click(p.x, p.y);
}

test("walk, reject walls, inspect booth and recenter after dragging", async ({ page, isMobile }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  const target = project({ x: 2, y: 5 });
  await tap(page, isMobile, target.x, target.y);
  await expect(page.getByTestId("player-position")).toContainText("Đang đi");
  await expect(page.getByTestId("player-position")).toContainText("2,0; 5,0 · Đứng yên");
  const blocked = project({ x: 0, y: 5 });
  await tap(page, isMobile, blocked.x, blocked.y);
  await expect(page.getByText("Chỗ đó bị chắn hoặc không có lối đi tới.")).toBeVisible();
  await expect(page.getByTestId("player-position")).toContainText("2,0; 5,0 · Đứng yên");
  const booth = project({ x: 3, y: 2 });
  await tap(page, isMobile, booth.x, booth.y - 30);
  await expect(page.getByRole("region", { name: "Kiểm tra buồng chụp" })).toBeVisible();
  await expect(page.getByText("Chủ tiệm đã đến chỗ kiểm tra máy.")).toBeVisible();
  await expect(page.getByTestId("player-position")).toContainText("3,0; 3,0 · Đứng yên");
  await page.screenshot({ path: info.outputPath("shop-inspection.png"), fullPage: true });
  await page.getByRole("button", { name: "Đóng bảng kiểm tra" }).click();
  await expect(page.getByRole("region", { name: "Kiểm tra buồng chụp" })).toHaveCount(0);
  const drag = await point(page, 160, 330);
  await page.mouse.move(drag.x, drag.y); await page.mouse.down();
  await page.mouse.move(drag.x + 30, drag.y + 20, { steps: 5 }); await page.mouse.up();
  await expect(page.getByTestId("player-position")).toContainText("3,0; 3,0 · Đứng yên");
  await page.getByRole("button", { name: "Đưa góc nhìn về giữa" }).click();
  await tap(page, isMobile, target.x, target.y);
  await expect(page.getByTestId("player-position")).toContainText("2,0; 5,0 · Đứng yên");
  expect(errors).toEqual([]);
});