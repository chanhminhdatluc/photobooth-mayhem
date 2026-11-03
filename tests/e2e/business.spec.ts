import { expect, test } from "@playwright/test";

test("open, pause, resume, close and start consecutive business days", async ({ page }) => {
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  await page.getByRole("button", { name: "Quản lý tiệm", exact: true }).click();
  const panel = page.getByTestId("business-panel");
  await expect(panel).toContainText("Ngày 1");
  await expect(panel).toContainText("Tiệm đang đóng cửa");
  await panel.getByRole("button", { name: "Mở cửa" }).click();
  await expect(panel).toContainText("Tiệm đang mở cửa");
  await expect(panel.getByText("Yêu cầu xuất hiện khách đã phát: 0")).toBeVisible();
  await panel.getByRole("button", { name: "Tạm dừng" }).click();
  await expect(panel).toContainText("Ngày kinh doanh đang tạm dừng");
  const pausedElapsed = await panel.locator("p").filter({ hasText: "Thời gian mở cửa:" }).innerText();
  await page.waitForTimeout(250);
  await expect(panel.locator("p").filter({ hasText: "Thời gian mở cửa:" })).toHaveText(pausedElapsed);
  await panel.getByRole("button", { name: "Tiếp tục" }).click();
  await expect(panel).toContainText("Tiệm đang mở cửa");
  await panel.getByRole("button", { name: "Đóng ngày" }).click();
  await expect(panel.getByTestId("day-summary")).toContainText("Tổng kết ngày 1");
  await expect(panel.getByTestId("day-summary")).toContainText("Chưa có giao dịch trong ngày này.");
  await expect(panel.getByRole("button", { name: "Mở cửa" })).toBeVisible();
  await panel.getByRole("button", { name: "Mở cửa" }).click();
  await expect(panel).toContainText("Ngày 2");
  await expect(panel).toContainText("Tiệm đang mở cửa");
  await expect(panel.getByTestId("day-summary")).toContainText("Tổng kết ngày 1");
});

test("React route remount creates one playable simulation without duplicate clocks", async ({ page }) => {
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  await page.getByRole("button", { name: "Mở cửa", exact: true }).click();
  await page.getByRole("button", { name: "Tùy chọn", exact: true }).click();
  await page.getByRole("link", { name: "Về trang chủ" }).click();
  await page.getByRole("link", { name: /Vào thăm tiệm/ }).click();
  await page.getByRole("button", { name: "Quản lý tiệm", exact: true }).click();
  const panel = page.getByTestId("business-panel");
  await expect(panel).toContainText("Ngày 1");
  await panel.getByRole("button", { name: "Mở cửa" }).click();
  await expect(panel).toContainText("Tiệm đang mở cửa");
  await page.waitForTimeout(300);
  await expect(panel.getByText("Yêu cầu xuất hiện khách đã phát: 0")).toBeVisible();
});

test("fixed-step day clock emits a scheduled customer request", async ({ page }) => {
  test.setTimeout(45000);
  await page.goto("/game");
  await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
  await page.getByRole("button", { name: "Quản lý tiệm", exact: true }).click();
  const panel = page.getByTestId("business-panel");
  await panel.getByRole("button", { name: "Mở cửa" }).click();
  await expect(panel.getByText("Yêu cầu xuất hiện khách đã phát: 1")).toBeVisible({ timeout: 35000 });
  await panel.getByRole("button", { name: "Đóng ngày" }).click();
  await expect(panel.getByTestId("day-summary")).toContainText("Tổng kết ngày 1");
});