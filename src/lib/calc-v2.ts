/**
 * Расчёты для калькуляторов главной страницы.
 * Чистые функции без React, чтобы их можно было проверить отдельно.
 *
 * Источники чисел:
 * - тариф КР с мая 2026: 1,64 сом до 700 кВт·ч в месяц, 2,94 сом сверх
 * - выработка в Бишкеке: 1750 кВт·ч с 1 кВт установленной мощности в год
 * - модуль Trina Solar Vertex N: 635 Вт
 * - линейка тепловых насосов: PHNIX и Hisense, актуальная на 08.2026
 */

export const TARIFF_BASE = 1.64;
export const TARIFF_ABOVE = 2.94;
export const TARIFF_THRESHOLD = 700;
export const YIELD_PER_KWP = 1750;
export const PANEL_WATT = 635;

/** Сколько стоит заданное потребление за месяц по блочному тарифу. */
export function billFor(kwhPerMonth: number): number {
  if (kwhPerMonth <= TARIFF_THRESHOLD) return kwhPerMonth * TARIFF_BASE;
  return (
    TARIFF_THRESHOLD * TARIFF_BASE +
    (kwhPerMonth - TARIFF_THRESHOLD) * TARIFF_ABOVE
  );
}

/** Обратная задача: по сумме счёта восстановить потребление. */
export function kwhFromBill(somPerMonth: number): number {
  const baseBlock = TARIFF_THRESHOLD * TARIFF_BASE;
  if (somPerMonth <= baseBlock) return somPerMonth / TARIFF_BASE;
  return TARIFF_THRESHOLD + (somPerMonth - baseBlock) / TARIFF_ABOVE;
}

export type SolarResult = {
  kwhPerMonth: number;
  kwhPerYear: number;
  billPerYear: number;
  kwp: number;
  panels: number;
  yieldPerYear: number;
  /** Доля годового потребления, которую покрывает станция. */
  coverage: number;
  /** Сколько из счёта приходится на дорогой блок сверх порога. */
  aboveThresholdShare: number;
};

export function calcSolar(somPerMonth: number): SolarResult {
  const kwhPerMonth = kwhFromBill(somPerMonth);
  const kwhPerYear = kwhPerMonth * 12;
  const kwp = kwhPerYear / YIELD_PER_KWP;
  const panels = Math.ceil((kwp * 1000) / PANEL_WATT);
  // Мощность округляем до реального набора модулей
  const kwpRounded = (panels * PANEL_WATT) / 1000;
  const yieldPerYear = kwpRounded * YIELD_PER_KWP;

  const above = Math.max(0, kwhPerMonth - TARIFF_THRESHOLD);
  const aboveCost = above * TARIFF_ABOVE;
  const monthBill = billFor(kwhPerMonth);

  return {
    kwhPerMonth,
    kwhPerYear,
    billPerYear: monthBill * 12,
    kwp: kwpRounded,
    panels,
    yieldPerYear,
    coverage: Math.min(100, (yieldPerYear / kwhPerYear) * 100),
    aboveThresholdShare: monthBill > 0 ? (aboveCost / monthBill) * 100 : 0,
  };
}

export type HeatPump = {
  name: string;
  brand: string;
  kw: number;
  phases: 1 | 3;
  refrigerant: string;
  areaMin: number;
  areaMax: number;
  cooling: boolean;
  dhw: boolean;
  note?: string;
};

/** Актуальная линейка. YKR выведен из ассортимента и здесь не показывается. */
export const HEAT_PUMPS: HeatPump[] = [
  {
    name: "PHNIX G20",
    brand: "PHNIX",
    kw: 7,
    phases: 1,
    refrigerant: "R290",
    areaMin: 37,
    areaMax: 54,
    cooling: true,
    dhw: false,
    note: "Работает от обычной сети 220 В, 45 дБ",
  },
  {
    name: "Hisense Integra",
    brand: "Hisense",
    kw: 10,
    phases: 3,
    refrigerant: "R32",
    areaMin: 80,
    areaMax: 130,
    cooling: true,
    dhw: true,
    note: "Бак горячей воды 230 л встроен в колонну, COP 5.1",
  },
  {
    name: "Hisense AHZ-120",
    brand: "Hisense",
    kw: 12,
    phases: 3,
    refrigerant: "R32",
    areaMin: 63,
    areaMax: 92,
    cooling: true,
    dhw: false,
    note: "Класс A+++, COP 4.95",
  },
  {
    name: "PHNIX G40S",
    brand: "PHNIX",
    kw: 12,
    phases: 3,
    refrigerant: "R290",
    areaMin: 63,
    areaMax: 92,
    cooling: true,
    dhw: false,
    note: "COP 4.57, подтверждён Keymark",
  },
  {
    name: "Hisense AHZ-160",
    brand: "Hisense",
    kw: 16,
    phases: 3,
    refrigerant: "R32",
    areaMin: 84,
    areaMax: 123,
    cooling: true,
    dhw: false,
    note: "Класс A+++",
  },
  {
    name: "PHNIX G60S",
    brand: "PHNIX",
    kw: 17,
    phases: 3,
    refrigerant: "R290",
    areaMin: 90,
    areaMax: 131,
    cooling: true,
    dhw: false,
    note: "Не теряет мощность на радиаторах 55 °C",
  },
];

export type HeatResult = {
  models: HeatPump[];
  cascade: boolean;
  phaseLimited: boolean;
  needsUpgrade: boolean;
};

/**
 * Подбор по площади с допуском, как в боте: от areaMin*0.7 до areaMax*1.15.
 * Свыше 280 м² линейка не покрывает: нужен каскад из двух установок.
 */
export function calcHeat(area: number, phases: 1 | 3 | null): HeatResult {
  const cascade = area > 280;
  const fits = HEAT_PUMPS.filter(
    (p) => area >= p.areaMin * 0.7 && area <= p.areaMax * 1.15
  );
  const byPhase = phases === 1 ? fits.filter((p) => p.phases === 1) : fits;

  return {
    models: (byPhase.length > 0 ? byPhase : fits).slice(0, 3),
    cascade,
    phaseLimited: phases === 1 && fits.length > 0 && byPhase.length === 0,
    needsUpgrade: phases === 1 && area > 60,
  };
}

/** Аннуитетный платёж. Ставка годовая в процентах, срок в месяцах. */
export function annuity(principal: number, ratePct: number, months: number): number {
  const i = ratePct / 100 / 12;
  if (i === 0) return principal / months;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

export function formatSom(value: number): string {
  return Math.round(value).toLocaleString("ru-RU").replace(/ /g, " ");
}
