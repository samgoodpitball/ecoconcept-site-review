import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

export type SlotMedia = { url: string; alt?: string | null; width?: number | null; height?: number | null };

/**
 * Карта «slotId → загруженный файл». Кэшируется на рендер, чтобы страница
 * с десятком слотов не ходила в базу десять раз.
 *
 * Если база недоступна (например, локальная сборка без подключения) — возвращаем
 * пустую карту: страницы соберутся, на месте изображений останутся плейсхолдеры.
 */
export const getSlotMediaMap = cache(async (): Promise<Map<string, SlotMedia>> => {
  const map = new Map<string, SlotMedia>();
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "media",
      where: { slotId: { exists: true } },
      limit: 500,
      depth: 0,
      pagination: false,
    });
    for (const doc of res.docs) {
      const slotId = (doc as { slotId?: string | null }).slotId;
      const url = (doc as { url?: string | null }).url;
      if (!slotId || !url) continue;
      map.set(slotId, {
        url,
        alt: (doc as { alt?: string | null }).alt,
        width: (doc as { width?: number | null }).width,
        height: (doc as { height?: number | null }).height,
      });
    }
  } catch {
    // Тихо продолжаем с плейсхолдерами — это не ошибка сборки.
  }
  return map;
});
