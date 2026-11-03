/** Resolve next/font's generated family, rather than an unregistered display name. */
export function sceneFontFamily(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim();
}
export async function waitForSceneFonts(): Promise<void> {
  const family = sceneFontFamily();
  if (!family) throw new Error("UI font CSS is unavailable");
  const sample = "Tiệm Ảnh Bất Ổn – Đường phố, Ước mơ, ằ ẵ ặ ề ễ ệ ồ ỗ ộ ờ ỡ ợ ừ ữ ự ỳ ỹ ỵ";
  const results = await Promise.all([document.fonts.load(`400 16px ${family}`, sample), document.fonts.load(`700 16px ${family}`, sample)]);
  if (results.some(faces => faces.length === 0 || faces.some(face => face.status !== "loaded"))) throw new Error("Vietnamese fonts could not load");
}