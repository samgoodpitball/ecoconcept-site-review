/**
 * 🔒 Расчёт розничной цены «под ключ».
 *
 * ВАЖНО: закупочные цены в исходниках не хранятся. Они лежат в переменной
 * окружения PURCHASE_PRICES (JSON) и подставляются только на сервере — этот
 * модуль импортируется исключительно из серверного кода: маршрута
 * /api/estimate, серверной секции-витрины и страницы расчёта. Никогда не
 * импортировать из компонентов с "use client": содержимое модуля уедет в
 * браузерный бандл вместе с закупкой.
 *
 * Формула задана заказчиком 05.09.2026:
 *
 *     розница = закупка (EXW, $) × наценка + работы под ключ
 *
 * Считается по всему подобранному комплекту: насос, бак горячей воды,
 * фанкойлы — либо панели и инвертор для станции.
 *
 * Без переменной окружения расчёт возвращает нули: сайт покажет комплект без
 * суммы, а не выдуманную цену.
 */

import { catalog } from "@/content/catalog";
import type { Answers, HeatResult, SolarResult } from "./estimate";

type PurchaseData = {
  /** Курс доллара к сому. */
  fx: number;
  /** Наценка на закупку. */
  markup: number;
  /** Работы под ключ, сом. Одна установка на систему. */
  installKgs: number;
  /** Фанкойл на комнату, $. */
  fancoilUsd: number;
  /** Закупка EXW в долларах по slug каталога. */
  exw: Record<string, number>;
};

const EMPTY: PurchaseData = { fx: 0, markup: 0, installKgs: 0, fancoilUsd: 0, exw: {} };

/**
 * Данные читаются один раз при старте процесса. Формат — тот же JSON, что
 * лежит в .env.local и в переменных окружения Vercel; пример — в .env.example.
 */
const data: PurchaseData = (() => {
  const raw = process.env.PURCHASE_PRICES;
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as PurchaseData;
    return { ...EMPTY, ...parsed, exw: parsed.exw ?? {} };
  } catch {
    console.warn("PURCHASE_PRICES: не разобрался JSON, цена считаться не будет");
    return EMPTY;
  }
})();

/** Есть ли данные для расчёта цены. */
export const hasPricing = Object.keys(data.exw).length > 0;

const FX_USD_KGS = data.fx;
const MARKUP = data.markup;
const INSTALL_KGS = data.installKgs;
const FANCOIL_USD = data.fancoilUsd;

const exw = (slug: string) => data.exw[slug] ?? 0;

/** Округление вверх до 5 000 сом: точность формулы этого не заслуживает. */
const round5k = (v: number) => Math.ceil(v / 5000) * 5000;

export type PriceLine = { label: string; usd: number };

export type Price = {
  /** Оборудование в рознице, сом. */
  equipmentKgs: number;
  /** Работы, сом. */
  installKgs: number;
  /** Итог под ключ, сом. */
  totalKgs: number;
  /** Из чего сложилось — для CRM и для строки «в комплекте». */
  lines: PriceLine[];
};

function priceOf(lines: PriceLine[]): Price {
  const usd = lines.reduce((sum, l) => sum + l.usd, 0);
  const equipmentKgs = usd * MARKUP * FX_USD_KGS;
  return {
    equipmentKgs: round5k(equipmentKgs),
    installKgs: INSTALL_KGS,
    totalKgs: round5k(equipmentKgs + INSTALL_KGS),
    lines,
  };
}

/** Бак к насосу: у Hisense свой, к PHNIX идут комбинированные баки YKR по мощности. */
function tankFor(pumpSlug: string, pumpKw: number): string | null {
  if (pumpSlug.startsWith("hisense")) return "hisense-hdhwt-200l30he";
  if (pumpKw <= 8) return "ykr-yk-200l-combination";
  if (pumpKw <= 13) return "ykr-yk-250l-combination";
  return "ykr-yk-300l-combination";
}

export function priceHeat(a: Answers, heat: HeatResult): Price | null {
  const pump = heat.models[0];
  if (!pump || !exw(pump.slug)) return null;

  const lines: PriceLine[] = [{ label: `${pump.brand} ${pump.model}`, usd: exw(pump.slug) }];

  if (a.dhw && !pump.dhw) {
    const tank = tankFor(pump.slug, pump.kw ?? 0);
    const item = tank ? catalog.find((i) => i.slug === tank) : null;
    if (item && exw(item.slug)) {
      lines.push({ label: `Бак ${item.model}`, usd: exw(item.slug) });
    }
  }

  if (a.cooling && a.coolingRooms > 0) {
    lines.push({
      label: `Фанкойлы, ${a.coolingRooms} шт.`,
      usd: FANCOIL_USD * a.coolingRooms,
    });
  }

  return priceOf(lines);
}

export function priceSolar(solar: SolarResult): Price | null {
  const lines: PriceLine[] = [
    { label: `Панели Trina Solar, ${solar.panels} шт.`, usd: exw("trina-solar-tsm-635neg19rc-20") * solar.panels },
  ];
  if (solar.inverter && exw(solar.inverter.slug)) {
    lines.push({ label: `Инвертор ${solar.inverter.model}`, usd: exw(solar.inverter.slug) });
  }
  return priceOf(lines);
}
