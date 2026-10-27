import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, formatDate, formatNumber, formatVnd, t } from "../../lib/i18n";
import { viVN } from "../../lib/i18n/vi-VN";
import { ECONOMY } from "../../game/config/economy";
import { WorldModel } from "../../game/world/WorldModel";

describe("Vietnamese localization", () => {
  it("defaults to Vietnamese with nonempty catalog entries", () => {
    expect(DEFAULT_LOCALE).toBe("vi-VN");
    for (const value of Object.values(viVN)) expect(value.trim().length).toBeGreaterThan(0);
    expect(t("brand.title")).toBe("Tiệm Ảnh Bất Ổn");
  });
  it("interpolates named parameters", () => expect(t("game.position", { x: "2,0", y: "3,0", state: t("game.idle") })).toBe("Chủ tiệm: 2,0; 3,0 · Đứng yên"));
  it("formats integer VND without fractional currency", () => {
    expect(formatVnd(ECONOMY.startingCashVnd).replace(/\s/g, " ")).toBe("20.000.000 ₫");
    expect(formatVnd(ECONOMY.sessionPriceVnd).replace(/\s/g, " ")).toBe("70.000 ₫");
    expect(ECONOMY.repairCostVnd).toBe(250000); expect(ECONOMY.printerUpgradeCostVnd).toBe(3000000);
    for (const value of [1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) expect(() => formatVnd(value)).toThrow();
  });
  it("formats numbers and dates consistently in Vietnam time", () => {
    expect(formatNumber(1234.5)).toBe("1.234,5");
    expect(formatDate(new Date("2026-10-27T18:00:00Z"))).toBe("28/10/2026");
  });
  it("exposes localization keys rather than prose from simulation", () => {
    const world = new WorldModel(); expect(world.view().message).toBe("world.hint");
    world.move({ x: 0, y: 0 }); expect(t(world.view().message)).toBe("Chỗ đó bị chắn hoặc không có lối đi tới.");
  });
});