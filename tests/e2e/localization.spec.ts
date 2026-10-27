import { expect, test } from "@playwright/test";
test("Vietnamese is default even with an English browser locale", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ locale: "en-US", baseURL });
  const page = await context.newPage();
  for (const route of ["/", "/game", "/missing-page"]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi-VN");
    if (route === "/game") {
      await expect(page.getByTestId("renderer-status")).toContainText("Tiệm đã sẵn sàng");
      await page.getByRole("button", { name: "Kiểm tra máy" }).click();
      await expect(page.getByRole("heading", { name: "Buồng chụp cơ bản" })).toBeVisible();
    }
    expect(await page.locator("body").innerText()).not.toMatch(/Renderer|Walking|Idle|Back home|Not saved|PHOTOBOOTH MAYHEM|This preview|Not Found/);
  }
  await expect(page.getByRole("heading", { name: "Đi lạc ngõ rồi bạn ơi!" })).toBeVisible();
  await context.close();
});