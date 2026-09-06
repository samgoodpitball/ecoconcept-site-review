/**
 * Расчёт подбора: тепловой насос и солнечная станция.
 *
 * Чистые функции без React — их вызывает и квиз /calculator, и серверная
 * секция-витрина, которая показывает пример расчёта на продуктовых страницах.
 *
 * ⚠️ Цен здесь нет и быть не должно: розничные цены публиковать не разрешено.
 * Всё, что считается, опирается на три вида чисел, каждое из которых можно
 * проверить: тариф Минэнерго, паспортные COP из каталога и физику дома.
 */

import { catalog, type CatalogItem } from "@/content/catalog";

/* ────────────────────────────────────────────────── константы расчёта */

export const TARIFF = {
  /** До 700 кВт·ч в месяц, сом/кВт·ч. Действует с мая 2026. */
  base: 1.64,
  /** Свыше 700 кВт·ч в месяц. */
  high: 2.94,
  /** Граница блока, кВт·ч в месяц на одну точку учёта. */
  blockKwh: 700,
} as const;

/**
 * Удельные теплопотери по типу стены, Вт/м².
 * Шкала для типовой застройки КР: саман и шлакоблок без утепления — верх
 * диапазона, дом по современным нормам — низ.
 */
export const HEAT_LOSS: Record<WallType, number> = {
  adobe: 120,
  brick: 100,
  aerated: 85,
  insulated: 65,
  modern: 50,
  unknown: 90,
};

/** Поправка на климат: расчётная зимняя температура по регионам. */
export const REGION_FACTOR: Record<Region, number> = {
  chui: 1.0,
  south: 0.9,
  issykkul: 1.1,
  highland: 1.2,
  other: 1.05,
};

/** Сезонный COP по температуре контура — из паспортных COP каталога. */
export const SEASON_COP: Record<Circuit, number> = {
  floor: 3.6,
  radiators: 2.5,
  both: 3.0,
  none: 3.6,
};

/** Часов работы на полной мощности за отопительный сезон (≈5,5 месяца). */
export const FULL_LOAD_HOURS = 1800;
export const SEASON_MONTHS = 5.5;

/** Бытовое потребление дома без отопления, кВт·ч в месяц — если счёт не назван. */
export const BASE_HOUSEHOLD_KWH = 350;

/** Выработка с 1 кВт установленной мощности за год в Бишкеке, кВт·ч. */
const SOLAR_YIELD_PER_KWP = 1750;

/** Мощность одной панели каталога, Вт. */
const PANEL_WATT = 635;

/* ─────────────────────────────────────────────────────────────── типы */

export type Product = "heat" | "solar" | "both";
export type Region = "chui" | "south" | "issykkul" | "highland" | "other";
export type Building = "house" | "building" | "flat" | "commercial";
export type WallType = "adobe" | "brick" | "aerated" | "insulated" | "modern" | "unknown";
export type Circuit = "radiators" | "floor" | "both" | "none";
export type Fuel = "coal" | "gas" | "electric" | "central" | "none";
export type Phase = "single" | "three" | "unknown";
export type Outages = "often" | "sometimes" | "rare";

export type Answers = {
  product: Product;
  region: Region;
  building: Building;
  /** Отапливаемая площадь, м². */
  area: number;
  floors: number;
  /** Потолки 3 м и выше. */
  tallCeilings: boolean;
  walls: WallType;
  fuel: Fuel;
  /** Что человек платит за отопление в зимний месяц, сом. Ноль — не ответил. */
  winterBill: number;
  circuit: Circuit;
  dhw: boolean;
  people: number;
  cooling: boolean;
  /** Сколько комнат охлаждаем — столько же фанкойлов в комплекте. */
  coolingRooms: number;
  phase: Phase;
  /** Выделенная мощность по договору, кВт. Ноль — «не знаю». */
  gridLimit: number;
  /** Счёт за электричество в месяц, сом. */
  powerBill: number;
  outages: Outages;
};

export const emptyAnswers: Answers = {
  product: "heat",
  region: "chui",
  building: "house",
  area: 150,
  floors: 1,
  tallCeilings: false,
  walls: "unknown",
  fuel: "coal",
  winterBill: 0,
  circuit: "none",
  dhw: true,
  people: 4,
  cooling: false,
  coolingRooms: 0,
  phase: "unknown",
  gridLimit: 0,
  powerBill: 3000,
  outages: "rare",
};

/* ─────────────────────────────────────────────── тариф и вспомогательное */

/** Стоимость месячного потребления с учётом блочного тарифа. */
export function monthlyCost(kwh: number): number {
  const base = Math.min(kwh, TARIFF.blockKwh) * TARIFF.base;
  const high = Math.max(0, kwh - TARIFF.blockKwh) * TARIFF.high;
  return base + high;
}

/** Обратная задача: сколько киловатт-часов стоит за назваными сомами. */
export function kwhFromBill(bill: number): number {
  const blockCost = TARIFF.blockKwh * TARIFF.base;
  if (bill <= blockCost) return bill / TARIFF.base;
  return TARIFF.blockKwh + (bill - blockCost) / TARIFF.high;
}

const round = (v: number, step: number) => Math.round(v / step) * step;

/* ────────────────────────────────────────────────────── тепловой насос */

export type HeatResult = {
  /** Расчётная мощность без запаса, кВт. */
  heatLossKw: number;
  /** Мощность с запасом 15% — по ней подбирается модель. */
  requiredKw: number;
  models: CatalogItem[];
  /** Модель не найдена: нужен каскад или трёхфазная сеть. */
  issue: "cascade" | "phase" | null;
  cop: number;
  /** Потребление насоса в зимний месяц, кВт·ч. */
  winterKwh: number;
  /** Среднемесячное потребление за год: отопительный сезон плюс горячая вода. */
  yearAvgKwh: number;
  /** Счёт за отопление в зимний месяц, сом, по блочному тарифу. */
  winterCost: number;
  /** Сколько из этого попадает в дорогой блок 2,94. */
  highBlockKwh: number;
  /** Тот же дом на электрокотле, сом в месяц. */
  boilerCost: number;
  /** Что человек назвал сам, сом в месяц. Ноль — не отвечал. */
  currentCost: number;
  /** Состав комплекта словами. */
  kit: string[];
  /** Ограничение по выделенной мощности. */
  gridWarning: boolean;
};

export function estimateHeat(a: Answers): HeatResult {
  const perM2 = HEAT_LOSS[a.walls];
  const ceilings = a.tallCeilings ? 1.15 : 1;
  const shape = a.floors <= 1 ? 1.05 : a.floors >= 3 ? 0.98 : 1;
  const region = REGION_FACTOR[a.region];

  const heatLossKw = (a.area * perM2 * ceilings * shape * region) / 1000;
  // Горячая вода добавляет к пиковой мощности: бак догревается параллельно отоплению.
  const dhwKw = a.dhw ? Math.min(2, 0.15 * a.people) : 0;
  const requiredKw = (heatLossKw + dhwKw) * 1.15;

  // Для дома подбираем из бытовой линейки, для объекта — из всей.
  const line = a.building === "commercial" ? undefined : "Бытовые";
  const pumps = catalog
    .filter(
      (i) =>
        i.category === "heat-pumps" &&
        typeof i.kw === "number" &&
        (line ? i.group === line : true)
    )
    .sort((x, y) => (x.kw ?? 0) - (y.kw ?? 0));

  // На 220 В в линейке одна позиция — 7 кВт. Дом крупнее требует трёх фаз,
  // и честнее сказать это сразу, чем на выезде инженера.
  const available = a.phase === "single" ? pumps.filter((i) => i.phase === "1ф") : pumps;
  const fitting = available.filter((i) => (i.kw ?? 0) >= requiredKw).slice(0, 2);

  let issue: HeatResult["issue"] = null;
  let models = fitting;
  if (fitting.length === 0) {
    const anyPhase = pumps.filter((i) => (i.kw ?? 0) >= requiredKw).slice(0, 2);
    if (a.phase === "single" && anyPhase.length > 0) {
      // Модель есть, но только трёхфазная — это решаемо, и об этом надо сказать.
      issue = "phase";
      models = anyPhase;
    } else {
      // Одной установки не хватает: собирается каскад, считается индивидуально.
      issue = "cascade";
      models = pumps.slice(-2);
    }
  }

  const cop = SEASON_COP[a.circuit];
  const seasonHeatKwh = heatLossKw * FULL_LOAD_HOURS;
  const pumpSeasonKwh = seasonHeatKwh / cop;
  const winterKwh = pumpSeasonKwh / SEASON_MONTHS;

  // Горячая вода круглый год: ≈2 кВт·ч тепла на человека в сутки.
  const dhwKwh = a.dhw ? (2 * a.people * 30) / 2.8 : 0;

  // Блочный тариф считается от всего счёта дома, а не от одного насоса:
  // бытовое потребление уже съедает часть дешёвого блока.
  const household = a.powerBill > 0 ? kwhFromBill(a.powerBill) : BASE_HOUSEHOLD_KWH;
  const totalWinter = household + winterKwh + dhwKwh;
  const winterCost = monthlyCost(totalWinter) - monthlyCost(household);
  const highBlockKwh = Math.max(0, totalWinter - TARIFF.blockKwh);

  const boilerKwh = seasonHeatKwh / SEASON_MONTHS / 0.99;
  const boilerCost = monthlyCost(household + boilerKwh) - monthlyCost(household);

  const kit: string[] = [];
  const chosen = models[0];
  if (chosen) kit.push(`Тепловой насос ${chosen.brand} ${chosen.model}, ${chosen.kw} кВт`);
  if (a.dhw && !chosen?.dhw) kit.push(`Бак горячей воды ${a.people > 4 ? "300" : "200"} л`);
  if (a.circuit === "none") kit.push("Гидромодуль и обвязка контура");
  if (a.cooling && a.coolingRooms > 0) kit.push(`Фанкойлы для охлаждения: ${a.coolingRooms} шт.`);

  return {
    heatLossKw: Math.round(heatLossKw * 10) / 10,
    requiredKw: Math.round(requiredKw * 10) / 10,
    models,
    issue,
    cop,
    winterKwh: round(winterKwh, 10),
    yearAvgKwh: round(pumpSeasonKwh / 12 + dhwKwh, 10),
    winterCost: round(winterCost, 100),
    highBlockKwh: round(highBlockKwh, 10),
    boilerCost: round(boilerCost, 100),
    currentCost: a.winterBill,
    kit,
    gridWarning: a.gridLimit > 0 && requiredKw > a.gridLimit * 0.8,
  };
}

/* ──────────────────────────────────────────────── солнечная станция */

export type SolarResult = {
  monthlyKwh: number;
  kwp: number;
  panels: number;
  yearKwh: number;
  /** Какую долю потребления закрывает станция. */
  coverage: number;
  hybrid: boolean;
  inverter: CatalogItem | null;
  /** Сколько сом в месяц уходит по дорогому блоку 2,94 — это станция срезает первым. */
  highBlockCost: number;
};

export function estimateSolar(a: Answers, extraKwh = 0): SolarResult {
  const monthlyKwh = kwhFromBill(a.powerBill) + extraKwh;
  const kwp = Math.max(1, (monthlyKwh * 12) / SOLAR_YIELD_PER_KWP);
  const panels = Math.ceil((kwp * 1000) / PANEL_WATT);
  const realKwp = (panels * PANEL_WATT) / 1000;
  const yearKwh = realKwp * SOLAR_YIELD_PER_KWP;
  const hybrid = a.outages !== "rare";
  const threePhase = a.phase === "three" || realKwp > 10;

  const inverters = catalog
    .filter(
      (i) =>
        i.category === "inverters" &&
        (hybrid ? i.type === "гибридный" : i.type === "сетевой") &&
        (threePhase ? i.phase === "3ф" : i.phase === "1ф")
    )
    .sort((x, y) => (x.kw ?? 0) - (y.kw ?? 0));
  const inverter = inverters.find((i) => (i.kw ?? 0) >= realKwp) ?? inverters.at(-1) ?? null;

  const highKwh = Math.max(0, monthlyKwh - TARIFF.blockKwh);

  return {
    monthlyKwh: round(monthlyKwh, 10),
    kwp: Math.round(realKwp * 10) / 10,
    panels,
    yearKwh: round(yearKwh, 100),
    coverage: Math.min(100, Math.round((yearKwh / (monthlyKwh * 12)) * 100)),
    hybrid,
    inverter,
    highBlockCost: round(highKwh * TARIFF.high, 100),
  };
}

/* ─────────────────────────────────────────────────────── общий расчёт */

export type Estimate = {
  heat: HeatResult | null;
  solar: SolarResult | null;
};

export function estimate(a: Answers): Estimate {
  const heat = a.product === "solar" ? null : estimateHeat(a);
  // В связке станция считается на потребление вместе с насосом: именно насос
  // выводит дом за 700 кВт·ч, где киловатт стоит вдвое дороже.
  // Станция считается на среднегодовую добавку, а не на зимний пик: насос
  // работает пять с половиной месяцев, и по зимнему месяцу станция вышла бы
  // вдвое больше нужной.
  const solar =
    a.product === "heat" ? null : estimateSolar(a, heat ? heat.yearAvgKwh : 0);
  return { heat, solar };
}

/** Дробное число с запятой — «16,1», а не «16.1». */
export function dec(v: number, digits = 1): string {
  return v.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

/** Число с пробелом как разделителем разрядов. */
export function num(v: number): string {
  return Math.round(v).toLocaleString("ru-RU").replace(/ /g, " ");
}
