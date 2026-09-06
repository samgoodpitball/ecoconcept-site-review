/**
 * Выгода: сколько денег остаётся у клиента после замены отопления на тепловой
 * насос и после установки солнечной станции.
 *
 * Чистые функции без React, как и весь расчётный слой. Отличие от
 * [heating-compare] в вопросе: там «сколько стоит месяц тепла», здесь —
 * «сколько я верну и когда». Поэтому физика дома не дублируется, а берётся из
 * `compareHeating`; здесь только арифметика разницы, горизонта и окупаемости.
 *
 * Цен оборудования в этом модуле нет: закупка живёт на сервере
 * ([pricing.server]), а в браузер приходит готовая сетка сумм «под ключ»
 * ([savings.server]) — клиент выбирает из неё ближайшую ступень.
 */

import { compareHeating, FUEL, type CompareResult, type Source } from "./heating-compare";
import {
  BASE_HOUSEHOLD_KWH,
  kwhFromBill,
  monthlyCost,
  PANEL_WATT,
  SOLAR_YIELD_PER_KWP,
} from "./estimate";

/** Горизонт, на который считаем накопленную выгоду. */
export const HORIZON_YEARS = 10;

/**
 * Какая доля выработки станции потребляется домом сразу, без отдачи в сеть.
 *
 * ⚠️ Гипотеза, а не измерение: типовой профиль дома (пик потребления вечером,
 * пик выработки в полдень) даёт 30–45%. Взято 40%. Число нужно только для
 * нижней границы вилки — сценария, когда договор на зачёт излишков не оформлен.
 */
export const SELF_USE_SHARE = 0.4;

/* ──────────────────────────────────────────────────────── горячая вода */

/**
 * Горячая вода — вторая половина выгоды насоса и единственная, которая идёт
 * круглый год. Допущения те же, что в подборе комплекта ([estimate]).
 */
export const DHW = {
  /** Тепла на человека в сутки, кВт·ч: душ, кухня, уборка. */
  kwhPerPersonDay: 2,
  /** Сколько человек в доме, если не спрашиваем. */
  people: 4,
  /**
   * COP насоса на нагреве воды — ниже отопительного: бак греется до 50–55 °C,
   * а не до температуры тёплого пола.
   */
  cop: 2.8,
  /** КПД электрического бойлера — с ним сравниваем в доме без газа. */
  boilerEfficiency: 0.99,
} as const;

/* ─────────────────────────────────────────── сетка цен, приходящая с сервера */

/**
 * Ступень цены «под ключ»: `key` — площадь дома (м²) или счёт за свет
 * (сом/мес), `price` — сумма под ключ для этой ступени.
 */
export type PricePoint = { key: number; price: number };

/**
 * Ближайшая подходящая ступень: первая, которая покрывает запрос. Цена
 * ступенчатая, потому что ступенчат сам подбор — модели насосов и число
 * панелей идут дискретно, между ними интерполировать нечего.
 */
export function pickPrice(grid: PricePoint[], key: number): number | null {
  if (grid.length === 0) return null;
  const hit = grid.find((p) => p.key >= key);
  // Запрос крупнее последней ступени — цену не выдумываем: такой объект
  // считает инженер, и калькулятор об этом честно молчит.
  return hit ? hit.price : null;
}

/**
 * Сколько стоит киловатт-час, добавленный к счёту дома.
 *
 * Блочный тариф считается от всей квитанции, а не от прибора: бытовое
 * потребление уже занимает часть дешёвого блока, и новая нагрузка ложится
 * сверху. Поэтому цена — разница между счётом с ней и без.
 */
function extraElectricityCost(kwh: number): number {
  return monthlyCost(BASE_HOUSEHOLD_KWH + kwh) - monthlyCost(BASE_HOUSEHOLD_KWH);
}

/* ─────────────────────────────────────────────────────── тепловой насос */

/** Чем человек греется сейчас — то, с чем сравниваем насос. */
export type CurrentFuel = Exclude<Source, "pump">;

export type HeatSavings = {
  /** Полный расчёт сравнения — из него берутся расходы и допущения. */
  compare: CompareResult;
  /** Расход на нынешнем топливе, сом в зимний месяц. */
  currentMonth: number;
  /** Расход с насосом, сом в зимний месяц. */
  pumpMonth: number;
  /** Экономия в зимний месяц, сом. */
  saveMonth: number;
  /** Экономия за отопительный сезон, сом. */
  saveSeason: number;
  /** Экономия на горячей воде за год, сом. */
  dhwSaveYear: number;
  /** Отопление плюс горячая вода за год, сом. */
  saveYear: number;
  /** То же за десять лет. */
  saveHorizon: number;
  /** Система под ключ, сом. Ноль — цены для такого дома в сетке нет. */
  price: number | null;
  /** Через сколько лет вернутся вложения. Ноль — считать не из чего. */
  payback: number | null;
};

export function heatSavings(input: {
  area: number;
  fuel: CurrentFuel;
  coalPrice: number;
  gasPrice: number;
  prices: PricePoint[];
}): HeatSavings {
  const compare = compareHeating({
    area: input.area,
    coalPrice: input.coalPrice,
    gasPrice: input.gasPrice,
  });

  const current = compare.rows.find((r) => r.source === input.fuel)!;
  const pump = compare.rows.find((r) => r.source === "pump")!;

  const saveMonth = current.monthCost - pump.monthCost;
  const saveSeason = current.seasonCost - pump.seasonCost;

  /* Горячая вода: одно и то же тепло, полученное насосом и тем, чем его греют
     сейчас. В доме на угле или электрокотле воду летом всё равно греет
     электрический бойлер — с ним и сравниваем; в газифицированном доме воду
     греет тот же котёл. */
  const dhwHeatMonth = DHW.kwhPerPersonDay * DHW.people * 30;
  const dhwPumpMonth = extraElectricityCost(dhwHeatMonth / DHW.cop);
  const dhwCurrentMonth =
    input.fuel === "gas"
      ? (dhwHeatMonth / (FUEL.gas.kwhPerM3 * FUEL.gas.efficiency)) * input.gasPrice
      : extraElectricityCost(dhwHeatMonth / DHW.boilerEfficiency);
  const dhwSaveYear = Math.max(0, (dhwCurrentMonth - dhwPumpMonth) * 12);

  const saveYear = saveSeason + dhwSaveYear;
  const price = pickPrice(input.prices, input.area);

  return {
    compare,
    currentMonth: current.monthCost,
    pumpMonth: pump.monthCost,
    saveMonth,
    saveSeason,
    dhwSaveYear: Math.round(dhwSaveYear / 100) * 100,
    saveYear: Math.round(saveYear / 100) * 100,
    saveHorizon: Math.round((saveYear * HORIZON_YEARS) / 100) * 100,
    price,
    // Насос дороже топки углём — вложение возвращается разницей в счетах.
    // Если разницы нет (дешёвый газ у самого дома), срок не показываем: делить
    // на ноль и обещать «окупится когда-нибудь» — не расчёт.
    payback: price && saveYear > 0 ? Math.round((price / saveYear) * 10) / 10 : null,
  };
}

/* ──────────────────────────────────────────────────── солнечная станция */

export type SolarSavings = {
  /** Потребление, восстановленное по счёту, кВт·ч в месяц. */
  monthKwh: number;
  /** Мощность станции, кВт. */
  kwp: number;
  panels: number;
  /** Выработка за год, кВт·ч. */
  yearKwh: number;
  /** Счёт сейчас, сом в месяц. */
  billNow: number;
  /** Счёт после станции при зачёте излишков, сом в месяц. */
  billAfter: number;
  /** Экономия в средний месяц, сом. */
  saveMonth: number;
  /** Экономия за год, сом. */
  saveYear: number;
  saveHorizon: number;
  /** Нижняя граница: без договора на зачёт, только прямое потребление. */
  saveYearDirect: number;
  price: number | null;
  payback: number | null;
  /** Верхняя граница срока — без зачёта излишков. */
  paybackDirect: number | null;
  /** Какую долю годового потребления закрывает станция, %. */
  coverage: number;
};

export function solarSavings(input: { bill: number; prices: PricePoint[] }): SolarSavings {
  const monthKwh = kwhFromBill(input.bill);

  // Станция считается на годовое потребление: летний избыток компенсирует
  // зимний недобор. Панели дискретны, поэтому мощность округляется вверх.
  const panels = Math.max(1, Math.ceil(((monthKwh * 12) / SOLAR_YIELD_PER_KWP) * 1000 / PANEL_WATT));
  const kwp = (panels * PANEL_WATT) / 1000;
  const yearKwh = kwp * SOLAR_YIELD_PER_KWP;
  const monthGen = yearKwh / 12;

  const billNow = monthlyCost(monthKwh);
  const billAfter = monthlyCost(Math.max(0, monthKwh - monthGen));
  const saveMonth = billNow - billAfter;
  const saveYear = saveMonth * 12;

  // Нижняя граница: счётчик обычный, договора на зачёт нет — из счёта уходит
  // только то, что дом потребил в момент выработки.
  const directKwh = Math.min(monthKwh, monthGen * SELF_USE_SHARE);
  const saveYearDirect = (billNow - monthlyCost(monthKwh - directKwh)) * 12;

  const price = pickPrice(input.prices, input.bill);

  return {
    monthKwh: Math.round(monthKwh),
    kwp: Math.round(kwp * 10) / 10,
    panels,
    yearKwh: Math.round(yearKwh / 100) * 100,
    billNow: Math.round(billNow / 100) * 100,
    billAfter: Math.round(billAfter / 100) * 100,
    saveMonth: Math.round(saveMonth / 100) * 100,
    saveYear: Math.round(saveYear / 100) * 100,
    saveHorizon: Math.round((saveYear * HORIZON_YEARS) / 100) * 100,
    saveYearDirect: Math.round(saveYearDirect / 100) * 100,
    price,
    payback: price && saveYear > 0 ? Math.round((price / saveYear) * 10) / 10 : null,
    paybackDirect:
      price && saveYearDirect > 0 ? Math.round((price / saveYearDirect) * 10) / 10 : null,
    coverage: Math.min(100, Math.round((yearKwh / (monthKwh * 12)) * 100)),
  };
}
