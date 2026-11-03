import { expect, it } from "vitest";
import { clampCameraCenter, fitCamera, shopBounds } from "../../game/rendering/camera";
it("uses readable zoom and clamps pan instead of fitting a miniature room", () => {
  const b = shopBounds();
  for (const [w, h] of [[360, 800], [390, 844], [430, 932], [768, 1024], [1280, 800]]) {
    const c = fitCamera(w!, h!);
    expect(c.zoom).toBeGreaterThanOrEqual(2.5); expect(c.zoom).toBeLessThanOrEqual(5);
    expect((b.right - b.left) * c.zoom > w! || (b.bottom - b.top) * c.zoom > h!).toBe(true);
    const low = clampCameraCenter(-10000, -10000, w!, h!, c.zoom);
    const high = clampCameraCenter(10000, 10000, w!, h!, c.zoom);
    expect(low.x).toBeLessThanOrEqual(high.x); expect(low.y).toBeLessThanOrEqual(high.y);
    expect(clampCameraCenter(low.x, low.y, w!, h!, c.zoom)).toEqual(low);
  }
});
