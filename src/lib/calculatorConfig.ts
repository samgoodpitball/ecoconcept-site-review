/**
 * Константы калькуляторов — единственное место, где их нужно править.
 *
 * ВНИМАНИЕ: значения, помеченные TODO, — рабочие предположения, а не
 * подтверждённые цифры. Пока заказчик их не подтвердил, результаты
 * калькулятора остаются ориентиром: на странице об этом сказано прямо.
 * Заменить на реальные — и ничего больше в коде трогать не нужно.
 */
export const calculatorConfig = {
  // TODO: подтвердить актуальный курс
  currency: { usdToKgs: 89 },

  solar: {
    // TODO: удельная выработка по городам КР, кВт·ч на 1 кВт·п в год
    yieldPerKwpYear: {
      default: 1500,
      Бишкек: 1500,
      Ош: 1600,
      "Джалал-Абад": 1550,
      Каракол: 1450,
      Нарын: 1550,
      Талас: 1500,
      Баткен: 1620,
    } as Record<string, number>,
    // TODO: помесячный профиль выработки под широту КР (сумма = 1)
    monthlyProfile: [0.045, 0.06, 0.085, 0.1, 0.115, 0.12, 0.125, 0.115, 0.095, 0.07, 0.045, 0.03],
    // TODO: действующий тариф КР, с учётом ступени свыше 700 кВт·ч
    tariffKgsPerKwh: 2.16,
    // TODO: какая доля излишков реально засчитывается
    exportShareCounted: 0.7,
    // TODO: ценовые ориентиры «от», $/кВт
    pricePerKwUsd: { grid: 350, hybrid: 700 },
    // TODO: углеродный след сети КР
    co2FactorKgPerKwh: 0.45,
    cities: ["Бишкек", "Ош", "Джалал-Абад", "Каракол", "Нарын", "Талас", "Баткен"],
    powerPresets: [3, 5, 8, 10, 15, 20, 30],
  },

  heatPump: {
    // TODO: удельные теплопотери под типовую застройку КР, Вт/м²
    heatLossWPerM2: { good: 50, average: 80, poor: 120 },
    safetyFactor: 1.15,
    // TODO: часы работы на полной мощности за сезон
    fullLoadHours: 2000,
    // TODO: усреднённый сезонный COP по линейке
    scop: 3.8,
    tariffKgsPerKwh: 2.16,
    electricBoilerEff: 0.99,
    // TODO: цена угля и КПД котла
    coal: { kWhPerKg: 5.0, boilerEff: 0.6, priceKgsPerKg: 6 },
    // TODO: цена газа и КПД котла
    gas: { kWhPerM3: 9.5, boilerEff: 0.92, priceKgsPerM3: 20 },
    co2CoalKgPerKwh: 0.34,
    // TODO: ориентир «от» за комплект
    equipmentFromUsd: 2500,
  },
} as const;

export const monthLabels = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

/** Подбор модели по требуемой мощности (таблица из спецификации калькулятора). */
export function recommendModel(requiredKw: number, _needsExtremeFrost: boolean): { name: string; slug?: string; note: string } {
  if (requiredKw <= 7) return { name: "PHNIX G20", slug: "phnix-g20", note: "хватает однофазной сети 220 В" };
  if (requiredKw <= 12) return { name: "PHNIX G40S или Hisense AHZ-120", slug: "phnix-g40s", note: "оптимум для типового коттеджа" };
  if (requiredKw <= 17) return { name: "PHNIX G60S или Hisense AHZ-160", slug: "phnix-g60s", note: "для больших домов" };
  return { name: "Каскад из нескольких насосов", note: "для такой мощности собираем каскадную схему — посчитаем индивидуально" };
}
