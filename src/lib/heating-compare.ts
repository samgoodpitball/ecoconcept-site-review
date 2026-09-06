/**
 * Сравнение стоимости отопления: уголь, газ, электрокотёл, тепловой насос.
 *
 * Чистые функции без React. Считают одно и то же тепло, полученное разными
 * способами, и переводят его в сомы по ценам топлива.
 *
 * Правило то же, что во всём расчётном слое: наших цен здесь нет. В формулах
 * участвуют только проверяемые числа — тариф Минэнерго, цены топлива из
 * открытых источников, паспортные COP каталога и физика дома. Каждое допущение
 * вынесено в константу с комментарием, потому что все они показываются
 * пользователю в блоке «как мы считаем».
 *
 * ⚠️ Цены топлива меняются: газ Газпром пересчитывает ежемесячно по курсу,
 * уголь дорожает к зиме. Поэтому обе цены — параметры, а не константы: на
 * странице они лежат в полях, которые человек правит под свою реальность.
 */

import {
  FULL_LOAD_HOURS,
  HEAT_LOSS,
  REGION_FACTOR,
  SEASON_COP,
  SEASON_MONTHS,
  BASE_HOUSEHOLD_KWH,
  monthlyCost,
  type Circuit,
  type WallType,
} from "./estimate";

/* ────────────────────────────────────────── допущения по видам топлива */

export const FUEL = {
  coal: {
    /**
     * Кара-кечинский бурый уголь. Теплотворность в источниках расходится:
     * 24.kg приводит «максимум 3,5 тыс. ккал», исследование КРСУ называет уголь
     * высококалорийным. Берём 4 000 ккал/кг = 4,65 кВт·ч/кг — середину, ближе
     * к нижней границе, чтобы не завышать проигрыш угля.
     */
    kwhPerKg: 4.65,
    /**
     * КПД бытового угольного котла или печи. Паспортные значения котлов —
     * 70–75%, кирпичной печи — 50–60%. Берём 60%: печей в частном секторе
     * больше, а котёл без автоматики редко держит паспортный режим.
     */
    efficiency: 0.6,
    /** Сом за тонну. Предельная цена местного угля в Бишкеке. */
    defaultPrice: 6000,
  },
  gas: {
    /** Низшая теплота сгорания природного газа, кВт·ч/м³ (33,5 МДж/м³). */
    kwhPerM3: 9.3,
    /** КПД настенного газового котла в реальном режиме. */
    efficiency: 0.92,
    /** Сом за м³ для населения. Газпром пересчитывает тариф ежемесячно. */
    defaultPrice: 22.7,
  },
  /** КПД электрокотла: всё, что взято из сети, уходит в воду. */
  electricEfficiency: 0.99,
} as const;

export type Source = "coal" | "gas" | "electric" | "pump";

export type CompareInput = {
  /** Отапливаемая площадь, м². */
  area: number;
  /** Сом за тонну угля. */
  coalPrice: number;
  /** Сом за м³ газа. */
  gasPrice: number;
};

export type CompareRow = {
  source: Source;
  /** Сом в средний месяц отопительного сезона. */
  monthCost: number;
  /** Сом за весь сезон. */
  seasonCost: number;
  /** Сом за киловатт-час тепла — число, не зависящее от размера дома. */
  perKwh: number;
  /** Расход в натуре за сезон: тонны, кубометры или киловатт-часы. */
  usage: string;
};

/**
 * Дом, для которого считаем, задан жёстко — секция отвечает на вопрос «сколько
 * это стоит», а не «какой у меня дом»: каждый лишний переключатель уводит от
 * ответа. Взято утеплённое строение (65 Вт/м²): дом без утепления сначала
 * утепляют, а не ставят в него насос.
 */
export const ASSUMED_WALLS: WallType = "insulated";

/**
 * Сезонный COP 3,0 — среднее между тёплым полом (3,6) и радиаторами (2,5).
 * Брать лучший случай было бы удобно и нечестно.
 */
export const ASSUMED_CIRCUIT: Circuit = "both";

export type CompareResult = {
  /** Расчётные теплопотери дома, кВт. */
  heatLossKw: number;
  /** Тепло, нужное дому за сезон, кВт·ч. */
  seasonHeatKwh: number;
  /** Сезонный COP насоса, взятый в расчёт. */
  cop: number;
  rows: CompareRow[];
  /** Насколько насос дешевле самого дешёвого из остальных, раз. */
  advantage: number;
};

const round = (v: number, step: number) => Math.round(v / step) * step;

/**
 * Стоимость электричества именно на отопление.
 *
 * Блочный тариф считается от всего счёта дома, а не от одного прибора: бытовое
 * потребление уже занимает часть дешёвого блока, и отопление ложится сверху.
 * Поэтому цена отопления — это разница между счётом дома с ним и без него.
 */
function heatingElectricityCost(heatingKwh: number): number {
  return monthlyCost(BASE_HOUSEHOLD_KWH + heatingKwh) - monthlyCost(BASE_HOUSEHOLD_KWH);
}

export function compareHeating(input: CompareInput): CompareResult {
  const perM2 = HEAT_LOSS[ASSUMED_WALLS];
  // Регион считаем чуйским: секция про Бишкек, а выбирать регион здесь —
  // это уже четвёртый вопрос, ради которого секцию закроют.
  const heatLossKw = (input.area * perM2 * REGION_FACTOR.chui) / 1000;

  const seasonHeatKwh = heatLossKw * FULL_LOAD_HOURS;
  const monthHeatKwh = seasonHeatKwh / SEASON_MONTHS;
  const cop = SEASON_COP[ASSUMED_CIRCUIT];

  /* Уголь: тепло → сожжённые килограммы → тонны → сомы. */
  const coalKgSeason = seasonHeatKwh / (FUEL.coal.kwhPerKg * FUEL.coal.efficiency);
  const coalSeason = (coalKgSeason / 1000) * input.coalPrice;

  /* Газ: тепло → кубометры → сомы. */
  const gasM3Season = seasonHeatKwh / (FUEL.gas.kwhPerM3 * FUEL.gas.efficiency);
  const gasSeason = gasM3Season * input.gasPrice;

  /* Электрокотёл и насос: тепло → киловатт-часы из сети → блочный тариф. */
  const boilerKwhMonth = monthHeatKwh / FUEL.electricEfficiency;
  const boilerMonth = heatingElectricityCost(boilerKwhMonth);

  const pumpKwhMonth = monthHeatKwh / cop;
  const pumpMonth = heatingElectricityCost(pumpKwhMonth);

  const raw: CompareRow[] = [
    {
      source: "coal",
      monthCost: coalSeason / SEASON_MONTHS,
      seasonCost: coalSeason,
      perKwh: coalSeason / seasonHeatKwh,
      usage: `${(coalKgSeason / 1000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} т за сезон`,
    },
    {
      source: "gas",
      monthCost: gasSeason / SEASON_MONTHS,
      seasonCost: gasSeason,
      perKwh: gasSeason / seasonHeatKwh,
      usage: `${Math.round(gasM3Season).toLocaleString("ru-RU")} м³ за сезон`,
    },
    {
      source: "electric",
      monthCost: boilerMonth,
      seasonCost: boilerMonth * SEASON_MONTHS,
      perKwh: (boilerMonth * SEASON_MONTHS) / seasonHeatKwh,
      usage: `${Math.round(boilerKwhMonth).toLocaleString("ru-RU")} кВт·ч в месяц`,
    },
    {
      source: "pump",
      monthCost: pumpMonth,
      seasonCost: pumpMonth * SEASON_MONTHS,
      perKwh: (pumpMonth * SEASON_MONTHS) / seasonHeatKwh,
      usage: `${Math.round(pumpKwhMonth).toLocaleString("ru-RU")} кВт·ч в месяц`,
    },
  ];

  const rows: CompareRow[] = raw.map((r) => ({
    ...r,
    monthCost: round(r.monthCost, 100),
    seasonCost: round(r.seasonCost, 100),
    perKwh: Math.round(r.perKwh * 100) / 100,
  }));

  const pump = rows.find((r) => r.source === "pump")!;
  const cheapestOther = Math.min(...rows.filter((r) => r.source !== "pump").map((r) => r.seasonCost));

  return {
    heatLossKw: Math.round(heatLossKw * 10) / 10,
    seasonHeatKwh: round(seasonHeatKwh, 100),
    cop,
    rows,
    advantage: pump.seasonCost > 0 ? Math.round((cheapestOther / pump.seasonCost) * 10) / 10 : 0,
  };
}
