/**
 * 🔒 Сетка цен «под ключ» для калькулятора выгоды.
 *
 * Калькулятор считается в браузере, а цена — только на сервере: закупка лежит
 * в переменной окружения и в бандл попасть не должна. Поэтому сюда вынесен
 * посредник: сервер один раз считает лестницу сумм «под ключ» по площадям и по
 * счетам за свет, а клиент выбирает из неё ближайшую ступень.
 *
 * В браузер уходит только пара «размер объекта → сумма под ключ» — то же, что
 * человек видит в результате квиза. Ни закупочных цен, ни наценки, ни курса.
 *
 * Модуль серверный: импортировать из компонентов с "use client" нельзя.
 */

import {
  emptyAnswers,
  estimateHeat,
  estimateSolar,
  type Answers,
} from "./estimate";
import { ASSUMED_CIRCUIT, ASSUMED_WALLS } from "./heating-compare";
import { priceHeat, priceSolar } from "./pricing.server";
import type { PricePoint } from "./savings";

/**
 * Дом для сетки — тот же, что в сравнении расходов: утеплённый, Чуйская
 * долина, смешанный контур. Иначе окупаемость считалась бы по одному дому, а
 * экономия по другому.
 */
const houseFor = (area: number): Answers => ({
  ...emptyAnswers,
  area,
  walls: ASSUMED_WALLS,
  circuit: ASSUMED_CIRCUIT,
  // Трёхфазный ввод: на 220 В в линейке одна позиция на 7 кВт, и сетка
  // упёрлась бы в неё уже на 100 м².
  phase: "three",
  dhw: true,
  people: 4,
});

/** Шаг сетки: 25 м² мельче, чем шаг мощности моделей — ступени не теряются. */
const AREA_FROM = 50;
const AREA_TO = 500;
const AREA_STEP = 25;

/** Счёт за свет: от съёмной комнаты до дома с электроотоплением. */
const BILL_FROM = 1000;
const BILL_TO = 20000;
const BILL_STEP = 500;

/**
 * Лестница «площадь → насос с баком и монтажом под ключ».
 * Считается один раз при старте процесса: функции чистые, вход конечный.
 */
export const heatPriceGrid: PricePoint[] = (() => {
  const out: PricePoint[] = [];
  for (let area = AREA_FROM; area <= AREA_TO; area += AREA_STEP) {
    const answers = houseFor(area);
    const heat = estimateHeat(answers);
    // Каскад считается индивидуально — такой ступени в сетке быть не должно.
    if (heat.issue === "cascade") continue;
    const price = priceHeat(answers, heat);
    if (price && price.totalKgs > 0) out.push({ key: area, price: price.totalKgs });
  }
  return out;
})();

/** Лестница «счёт за свет → сетевая станция без батарей под ключ». */
export const solarPriceGrid: PricePoint[] = (() => {
  const out: PricePoint[] = [];
  for (let bill = BILL_FROM; bill <= BILL_TO; bill += BILL_STEP) {
    const answers: Answers = {
      ...emptyAnswers,
      product: "solar",
      powerBill: bill,
      // Сетевой инвертор без аккумуляторов: базовая станция, к которой батарея
      // добавляется отдельно и считается под задачу «что должно работать».
      outages: "rare",
    };
    const price = priceSolar(estimateSolar(answers));
    if (price && price.totalKgs > 0) out.push({ key: bill, price: price.totalKgs });
  }
  return out;
})();
