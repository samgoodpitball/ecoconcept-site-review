"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eyebrow } from "./SectionKit";
import {
  heatSavings,
  solarSavings,
  DHW,
  HORIZON_YEARS,
  SELF_USE_SHARE,
  type CurrentFuel,
  type PricePoint,
} from "@/lib/savings";
import { FUEL, ASSUMED_WALLS } from "@/lib/heating-compare";
import {
  HEAT_LOSS,
  SEASON_MONTHS,
  SOLAR_YIELD_PER_KWP,
  TARIFF,
  PANEL_WATT,
} from "@/lib/estimate";

/**
 * Секция «Сколько вы вернёте» — калькулятор выгоды с переключателем продукта.
 *
 * Отличие от соседней таблицы «Сколько стоит месяц тепла»: та отвечает на
 * вопрос «сколько это стоит в эксплуатации», эта — на следующий вопрос
 * покупателя, «когда вернутся вложения». Поэтому здесь появляется цена под
 * ключ и срок окупаемости, а сравнение свёрнуто до двух полос: было и стало.
 *
 * Переключатель продукта (решение заказчика 06.09.2026) держит оба направления
 * в одной секции: человек, пришедший за отоплением, видит, что тем же
 * движением считается и станция, — не уходя со страницы.
 *
 * Цены оборудования приходят пропсами: их считает серверная обёртка, потому
 * что закупка в браузерный бандл попасть не должна.
 */

type Kind = "heat" | "solar";

const FUEL_LABEL: Record<CurrentFuel, string> = {
  coal: "Уголь",
  gas: "Газовый котёл",
  electric: "Электрокотёл",
};

const money = (v: number) => Math.round(v).toLocaleString("ru-RU");
const dec = (v: number, digits = 1) =>
  v.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: digits });

/** Годы словами: «4,5 года», «6 лет», «1 год» — иначе число читается как ошибка. */
function years(v: number): string {
  const int = Math.round(v);
  const fractional = Math.abs(v - int) > 0.05;
  const word = fractional
    ? "года"
    : int % 10 === 1 && int % 100 !== 11
      ? "год"
      : [2, 3, 4].includes(int % 10) && ![12, 13, 14].includes(int % 100)
        ? "года"
        : "лет";
  return `${dec(v)} ${word}`;
}

const MIN_AREA = 20;
const MAX_AREA = 500;
const MIN_BILL = 500;
const MAX_BILL = 20000;

export default function SavingsCalculator({
  heatPrices,
  solarPrices,
  defaultKind = "heat",
  kicker = "Выгода",
}: {
  heatPrices: PricePoint[];
  solarPrices: PricePoint[];
  defaultKind?: Kind;
  kicker?: string;
}) {
  const [kind, setKind] = useState<Kind>(defaultKind);

  /* Поля держим строками: с числом нельзя стереть содержимое и набрать заново —
     любое промежуточное состояние подменяется минимумом. */
  const [areaText, setAreaText] = useState("150");
  const [billText, setBillText] = useState("3000");
  const [fuel, setFuel] = useState<CurrentFuel>("coal");
  const [coalPrice, setCoalPrice] = useState<number>(FUEL.coal.defaultPrice);
  const [gasPrice, setGasPrice] = useState<number>(FUEL.gas.defaultPrice);

  const area = Math.min(MAX_AREA, Math.max(MIN_AREA, Number(areaText) || 0));
  const bill = Math.min(MAX_BILL, Math.max(MIN_BILL, Number(billText) || 0));

  const heat = useMemo(
    () => heatSavings({ area, fuel, coalPrice, gasPrice, prices: heatPrices }),
    [area, fuel, coalPrice, gasPrice, heatPrices]
  );
  const solar = useMemo(
    () => solarSavings({ bill, prices: solarPrices }),
    [bill, solarPrices]
  );

  const isHeat = kind === "heat";

  return (
    <section className="border-t border-line bg-off">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <Eyebrow>{kicker}</Eyebrow>
            <h2 className="mt-5 max-w-[13em] text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[38px]">
              Сколько вы вернёте
            </h2>
            <p className="mt-4 max-w-[34em] text-[16px] leading-[1.6] text-muted md:text-[17px]">
              {isHeat
                ? "Разница между тем, что вы платите за отопление и горячую воду сейчас, и тем, что будете платить с насосом — за месяц, за год и за десять лет."
                : "Разница между вашим счётом за электричество и счётом с солнечной станцией — за месяц, за год и за десять лет."}
            </p>
          </div>

          {/* Переключатель продукта: две вкладки, а не выпадающий список —
              выбор из двух должен быть виден целиком. */}
          <div
            role="tablist"
            aria-label="Что считаем"
            className="flex shrink-0 border border-line bg-white"
          >
            {(["heat", "solar"] as Kind[]).map((k) => (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={kind === k}
                onClick={() => setKind(k)}
                className={`px-4 py-3 font-head text-[13.5px] font-semibold transition-colors md:px-6 md:text-[15px] ${
                  kind === k
                    ? "bg-graphite text-white"
                    : "text-muted hover:bg-tint hover:text-graphite"
                }`}
              >
                {k === "heat" ? "Тепловой насос" : "Солнечная станция"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,340px)_1fr] md:gap-8">
          {/* ───────────────────────────────────── ввод */}
          <div className="border border-line bg-white p-6 md:p-7">
            <span className="mono-label">Ваши данные</span>

            {isHeat ? (
              <div className="mt-6 flex flex-col gap-7">
                <NumberField
                  label="Отапливаемая площадь"
                  unit="м²"
                  value={areaText}
                  onChange={(v) => setAreaText(v.replace(/[^\d]/g, "").slice(0, 4))}
                  onBlur={() => setAreaText(String(area))}
                />

                <div>
                  <span className="mono-label">Чем греете сейчас</span>
                  <div className="mt-3 flex flex-col border border-line">
                    {(Object.keys(FUEL_LABEL) as CurrentFuel[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFuel(f)}
                        aria-pressed={fuel === f}
                        className={`border-b border-line px-4 py-3 text-left font-head text-[15px] font-semibold transition-colors last:border-b-0 ${
                          fuel === f
                            ? "bg-tint text-eco-dark"
                            : "text-muted hover:bg-off hover:text-graphite"
                        }`}
                      >
                        {FUEL_LABEL[f]}
                      </button>
                    ))}
                  </div>
                </div>

                {fuel === "coal" && (
                  <PriceField
                    key="coal"
                    label="Уголь, сом за тонну"
                    value={coalPrice}
                    onChange={setCoalPrice}
                    hint="Предельная цена местного угля в Бишкеке"
                  />
                )}
                {fuel === "gas" && (
                  <PriceField
                    key="gas"
                    label="Газ, сом за м³"
                    value={gasPrice}
                    onChange={setGasPrice}
                    hint="Тариф для населения, меняется ежемесячно"
                  />
                )}
                {fuel === "electric" && (
                  <p className="text-[13.5px] leading-[1.6] text-muted">
                    Электрокотёл считается по действующему тарифу: {dec(TARIFF.base, 2)} сом до{" "}
                    {money(TARIFF.blockKwh)} кВт·ч в месяц и {dec(TARIFF.high, 2)} сом сверх.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-7">
                <NumberField
                  label="Счёт за электричество"
                  unit="сом/мес"
                  value={billText}
                  onChange={(v) => setBillText(v.replace(/[^\d]/g, "").slice(0, 5))}
                  onBlur={() => setBillText(String(bill))}
                  hint="Средний месяц: по нему восстанавливается потребление"
                />
                <div className="border-t border-line pt-5">
                  <SmallRow label="Мощность станции" value={`${dec(solar.kwp)} кВт`} />
                  <SmallRow label="Панелей" value={`${solar.panels} шт. по ${PANEL_WATT} Вт`} />
                  <SmallRow label="Выработка за год" value={`≈ ${money(solar.yearKwh)} кВт·ч`} />
                  <SmallRow label="Потребление сейчас" value={`≈ ${money(solar.monthKwh)} кВт·ч/мес`} />
                </div>
              </div>
            )}
          </div>

          {/* ───────────────────────────────────── результат */}
          <div className="flex flex-col gap-5 rounded-[10px] bg-graphite p-6 text-white md:p-9">
            <span className="mono-label !text-white/60">
              {isHeat ? "Экономия за год: отопление и горячая вода" : "Экономия за год"}
            </span>

            <p className="num-hero text-[46px] text-eco-bright md:text-[64px]">
              {money(isHeat ? heat.saveYear : solar.saveYear)}
              <span className="ml-3 font-head text-[18px] font-semibold text-white/70 md:text-[22px]">
                сом
              </span>
            </p>

            {/* Две полосы «было — стало»: разница видна раньше, чем прочитаны
                числа. Длина — по счёту в месяц. */}
            <Bars
              nowLabel={isHeat ? FUEL_LABEL[fuel] : "Счёт сейчас"}
              nowValue={isHeat ? heat.currentMonth : solar.billNow}
              nextLabel={isHeat ? "Тепловой насос" : "Со станцией, годовой баланс"}
              nextValue={isHeat ? heat.pumpMonth : solar.billAfter}
              unit={isHeat ? "сом в зимний месяц" : "сом в средний месяц"}
            />

            {/* Три плитки — только деньги. Срок окупаемости лежит в «Как мы
                считаем» вместе с объяснением, почему при тарифе 1,64 сом он
                длинный: крупным шрифтом это число отвечает на вопрос, которого
                читатель ещё не задал, и заслоняет то, ради чего секция. */}
            <div className="grid gap-px overflow-hidden rounded-[8px] bg-white/15 sm:grid-cols-3">
              <Tile
                label={isHeat ? "Отопление, в зимний месяц" : "В средний месяц"}
                value={`${money(isHeat ? heat.saveMonth : solar.saveMonth)} сом`}
              />
              <Tile
                label={isHeat ? "Горячая вода, за год" : "Покрытие потребления"}
                value={isHeat ? `${money(heat.dhwSaveYear)} сом` : `${solar.coverage}%`}
              />
              <Tile
                label={`За ${HORIZON_YEARS} лет`}
                value={`${money(isHeat ? heat.saveHorizon : solar.saveHorizon)} сом`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
              <span className="text-[14.5px] leading-[1.5] text-white/75">
                {(isHeat ? heat.price : solar.price) ? (
                  <>
                    {isHeat ? "Насос с баком и монтажом" : "Станция с монтажом, без батарей"} под ключ —{" "}
                    <b className="num text-white">
                      ≈ {money((isHeat ? heat.price : solar.price)!)} сом
                    </b>
                  </>
                ) : (
                  <>
                    Объект такого размера считается индивидуально: каскад насосов или станция под задачу.
                  </>
                )}
              </span>
              <Link href="/calculator" className="btn-outline-light">
                Точный расчёт
              </Link>
            </div>

            <p className="rounded-[8px] border-l-2 border-eco-bright bg-white/5 px-4 py-3 text-[13.5px] leading-[1.6] text-white/75">
              {isHeat ? (
                <>
                  Летом та же система охлаждает дом через фанкойлы — отдельные кондиционеры покупать не
                  нужно. В деньги эту выгоду мы не переводим: она зависит от того, сколько сплитов вы
                  поставили бы вместо неё.
                </>
              ) : (
                <>
                  Цифры выше — при договоре на зачёт излишков в сеть. Без него станция срезает только то,
                  что дом потребляет в момент выработки: экономия ≈ {money(solar.saveYearDirect)} сом в год.
                  Порядок оформления счётчика и договора уточняется в энергокомпании.
                </>
              )}
            </p>
          </div>
        </div>

        {/* ───────────────────────────────────── методика */}
        <details className="group mt-8 border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
            <span className="font-head text-[15px] font-bold text-graphite group-hover:text-eco-dark md:text-[16px]">
              Как мы считаем
            </span>
            <span aria-hidden className="relative flex h-6 w-6 items-center justify-center text-eco-dark">
              <span className="absolute h-[1.5px] w-[15px] bg-current" />
              <span className="absolute h-[15px] w-[1.5px] bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <div className="grid gap-x-10 gap-y-5 pb-7 md:grid-cols-2">
            {isHeat ? (
              <>
                <Fact title="Горячая вода">
                  {DHW.kwhPerPersonDay} кВт·ч тепла на человека в сутки, {DHW.people} человека в доме,
                  круглый год. Насос греет бак с COP {dec(DHW.cop)} — ниже отопительного, потому что вода
                  нужна горячее тёплого пола. Сравнение: в доме на угле или электрокотле воду греет
                  электрический бойлер, в газифицированном — тот же котёл.
                </Fact>
                <Fact title="Дом и тепло">
                  Утеплённый дом в Чуйской долине: {HEAT_LOSS[ASSUMED_WALLS]} Вт на квадратный метр,{" "}
                  {dec(SEASON_MONTHS)} месяца сезона, 1 800 часов на полной мощности. Для {area} м² это{" "}
                  {money(heat.compare.seasonHeatKwh)} кВт·ч тепла за сезон. Сезонный COP насоса —{" "}
                  {dec(heat.compare.cop)}, КПД угольной печи — {Math.round(FUEL.coal.efficiency * 100)}%,
                  газового котла — {Math.round(FUEL.gas.efficiency * 100)}%.
                </Fact>
                <Fact title="Что входит в сумму под ключ">
                  Насос по расчётной мощности, бак горячей воды и монтаж с пусконаладкой. Не входят
                  разводка тёплого пола и радиаторы, если их нет, и охлаждение фанкойлами — их считает
                  инженер после выезда.
                </Fact>
                <Fact title="Окупаемость">
                  {heat.price
                    ? `Цена под ключ, делённая на экономию за год, даёт ${years(heat.payback ?? 0)}. `
                    : "Цена такого объекта считается индивидуально. "}
                  Срок длинный, и причина не в насосе, а в тарифе: киловатт-час в Кыргызстане стоит{" "}
                  {dec(TARIFF.base, 2)} сом — вчетверо дешевле, чем в странах, где насосы окупаются за
                  шесть лет. Расчёт ведётся в сегодняшних ценах; тариф по плану Минэнерго растёт каждый май
                  до 2030 года, уголь дорожает к зиме, а рассыпной уголь в Бишкеке уже запрещён — реальный
                  срок будет короче, но насколько, мы обещать не станем.
                </Fact>
                <Fact title="Чего здесь нет">
                  Стоимости замены котла, которую вы понесли бы и без нас, подключения газа и
                  проекта, госкредита под 6% на чистое отопление. Это отдельные деньги, и они считаются
                  на выезде, а не в поле на сайте.
                </Fact>
              </>
            ) : (
              <>
                <Fact title="Станция и выработка">
                  Мощность подбирается на годовое потребление, восстановленное по вашему счёту:{" "}
                  {money(solar.monthKwh)} кВт·ч в месяц. Расчётная выработка в Бишкеке —{" "}
                  {money(SOLAR_YIELD_PER_KWP)} кВт·ч с 1 кВт установленной мощности в год; панели по{" "}
                  {PANEL_WATT} Вт, отсюда {solar.panels} шт. и {dec(solar.kwp)} кВт. Считается годовой
                  баланс, а не каждый месяц по отдельности: зимой станция закрывает лишь часть счёта,
                  летом отдаёт избыток, и «ноль в среднем месяце» — это результат за год, а не обещание
                  нулевой квитанции в январе.
                </Fact>
                <Fact title="Тариф">
                  {dec(TARIFF.base, 2)} сом до {money(TARIFF.blockKwh)} кВт·ч в месяц и{" "}
                  {dec(TARIFF.high, 2)} сом сверх — с мая 2026. Станция срезает сначала дорогой блок,
                  поэтому экономия растёт быстрее, чем потребление.
                </Fact>
                <Fact title="Зачёт излишков">
                  Верхняя оценка считает, что выработанное сверх текущего потребления засчитывается в
                  счёт: нужен двунаправленный счётчик и договор с энергокомпанией. Нижняя берёт только
                  прямое потребление — {Math.round(SELF_USE_SHARE * 100)}% выработки. ⚠️ Доля прямого
                  потребления — оценка по профилю типового дома, а не измерение.
                </Fact>
                <Fact title="Что входит в сумму под ключ">
                  Панели, сетевой инвертор, крепления и монтаж с пусконаладкой. Аккумуляторы не входят:
                  их ёмкость подбирают под то, что должно работать при отключении света.
                </Fact>
                <Fact title="Окупаемость">
                  {solar.price && solar.payback
                    ? `Цена под ключ, делённая на экономию за год, даёт ${years(solar.payback)} при зачёте излишков и ${solar.paybackDirect ? years(solar.paybackDirect) : "заметно больше"} без него. `
                    : "Станция такого размера считается индивидуально. "}
                  Панели работают дольше этого срока: производитель гарантирует не менее 80% мощности через
                  25 лет. Расчёт в сегодняшних ценах — тариф растёт каждый май до 2030 года, и с каждым
                  повышением станция окупается быстрее.
                </Fact>
              </>
            )}
            <p className="text-[13.5px] leading-[1.6] text-muted md:col-span-2">
              Расчёт предварительный: он показывает порядок цифр, а не смету. Точную сумму инженер считает
              после бесплатного выезда — стены, окна, разводка и кровля меняют и мощность, и цену.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── примитивы */

function NumberField({
  label,
  unit,
  value,
  onChange,
  onBlur,
  hint,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mono-label">{label}</span>
      <span className="mt-2 flex items-baseline gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-label={label}
          className="w-[6ch] border-0 border-b-2 border-eco bg-transparent p-0 num-hero text-[30px] text-graphite outline-none focus:border-eco-dark md:text-[34px]"
        />
        {unit && <span className="font-head text-[16px] font-semibold text-muted">{unit}</span>}
      </span>
      {hint && <span className="mt-2 block text-[12.5px] leading-[1.5] text-muted">{hint}</span>}
    </label>
  );
}

/**
 * Цена топлива. Держит свой текст, иначе поле нельзя стереть и набрать заново:
 * состояние подменяло бы каждый промежуточный символ прежним числом. Показывает
 * дробное с запятой — точка в русском тексте читается как опечатка.
 */
function PriceField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  const [text, setText] = useState(String(value).replace(".", ","));
  return (
    <NumberField
      label={label}
      value={text}
      onChange={(v) => {
        const next = v.replace(/[^\d.,]/g, "").slice(0, 7);
        setText(next);
        const parsed = Number(next.replace(",", "."));
        if (Number.isFinite(parsed) && parsed > 0) onChange(parsed);
      }}
      onBlur={() => setText(String(value).replace(".", ","))}
      hint={hint}
    />
  );
}

function SmallRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <span className="text-[13.5px] text-muted">{label}</span>
      <span className="num text-[13.5px] font-semibold text-graphite">{value}</span>
    </span>
  );
}

function Bars({
  nowLabel,
  nowValue,
  nextLabel,
  nextValue,
  unit,
}: {
  nowLabel: string;
  nowValue: number;
  nextLabel: string;
  nextValue: number;
  unit: string;
}) {
  const max = Math.max(nowValue, nextValue, 1);
  const rows = [
    { label: nowLabel, value: nowValue, accent: false },
    { label: nextLabel, value: nextValue, accent: true },
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <span key={r.label} className="block">
          <span className="flex items-baseline justify-between gap-4">
            <span className="font-head text-[14.5px] font-semibold text-white/80">{r.label}</span>
            <span className={`num text-[15px] ${r.accent ? "text-eco-bright" : "text-white/80"}`}>
              {money(r.value)} <span className="text-white/50">{unit}</span>
            </span>
          </span>
          <span aria-hidden className="mt-1.5 block h-[6px] w-full rounded-full bg-white/12">
            <span
              className={`block h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none ${
                r.accent ? "bg-eco-bright" : "bg-white/45"
              }`}
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-graphite px-4 py-4">
      <span className="mono-label !text-[10px] !text-white/55">{label}</span>
      <span className="num mt-1.5 block text-[17px] font-semibold text-white md:text-[19px]">{value}</span>
    </div>
  );
}

function Fact({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-head text-[14px] font-bold text-graphite">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{children}</p>
    </div>
  );
}
