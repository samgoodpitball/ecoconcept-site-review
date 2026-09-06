/**
 * Тонкая обёртка над счётчиками. ID счётчиков ещё не подключены
 * ([TODO: GA4 / Яндекс.Метрика]) — пока события просто не отправляются,
 * но вызовы уже расставлены по коду, поэтому подключение сведётся
 * к добавлению скриптов счётчиков в layout.
 */
type EventName =
  | "lead_submit"
  | "calculator_submit"
  | "whatsapp_click"
  | "telegram_click"
  | "call_click"
  | "catalog_price_request";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event, ...params });
    window.gtag?.("event", event, params);
    const metrikaId = process.env.NEXT_PUBLIC_YM_ID;
    if (metrikaId && window.ym) window.ym(Number(metrikaId), "reachGoal", event, params);
  } catch {
    // Аналитика не должна ломать пользовательский сценарий
  }
}
