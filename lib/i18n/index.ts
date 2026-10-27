import { viVN } from "./vi-VN";
export const DEFAULT_LOCALE = "vi-VN";
export type MessageKey = keyof typeof viVN;
type Slots<S extends string> = S extends `${string}{${infer P}}${infer Rest}` ? P | Slots<Rest> : never;
type Arguments<K extends MessageKey> = [Slots<(typeof viVN)[K]>] extends [never] ? [] : [Record<Slots<(typeof viVN)[K]>, string | number>];
export function t<K extends MessageKey>(key: K, ...args: Arguments<K>): string {
  const template = viVN[key];
  if (!template) throw new Error(`Missing translation: ${key}`);
  const values = args[0] as Record<string, string | number> | undefined;
  return template.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = values?.[name];
    if (value === undefined) throw new Error(`Missing translation parameter: ${name}`);
    return String(value);
  });
}
export function formatVnd(value: number): string {
  if (!Number.isSafeInteger(value)) throw new Error("VND must be a safe integer");
  return new Intl.NumberFormat(DEFAULT_LOCALE, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(value);
}
export function formatDate(value: Date): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" }).format(value);
}