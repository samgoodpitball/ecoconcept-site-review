import SavingsCalculator from "./SavingsCalculator";
import { heatPriceGrid, solarPriceGrid } from "@/lib/savings.server";

/**
 * Серверная обёртка калькулятора выгоды.
 *
 * Нужна ровно для одного: цена «под ключ» считается из закупки, а закупка живёт
 * в переменной окружения и в браузер не уходит. Сервер отдаёт клиенту готовую
 * лестницу сумм, дальше калькулятор работает без сети.
 *
 * Без PURCHASE_PRICES лестницы пустые: секция покажет экономию и промолчит про
 * окупаемость — вместо выдуманной цены строка «считает инженер».
 */
export default function SavingsSection({
  defaultKind = "heat",
  kicker = "Выгода",
}: {
  defaultKind?: "heat" | "solar";
  kicker?: string;
}) {
  return (
    <SavingsCalculator
      heatPrices={heatPriceGrid}
      solarPrices={solarPriceGrid}
      defaultKind={defaultKind}
      kicker={kicker}
    />
  );
}
