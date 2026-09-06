"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eyebrow } from "./SectionKit";
import {
  compareHeating,
  FUEL,
  ASSUMED_WALLS,
  type Source,
} from "@/lib/heating-compare";
import { HEAT_LOSS, SEASON_MONTHS, TARIFF } from "@/lib/estimate";

/**
 * Секция «Сколько стоит месяц тепла» — сравнение четырёх способов отопления.
 *
 * Интерактив живёт внутри одного блока: никаких шагов и переходов, как в квизе
 * /calculator, — площадь сверху, таблица пересчитывается на месте.
 *
 * Задача секции узкая: за несколько секунд показать разницу в расходах. Всё,
 * что этой задаче не служит, снято — переключатели стен и контура (дом задан
 * допущениями, они описаны в «Как мы считаем») и колонка цены киловатт-часа.
 * Осталось два числа на строку: месяц и сезон.
 *
 * Цены угля и газа остаются полями: они меняются каждый месяц, и спорить с
 * методикой человек перестаёт, как только видит свои числа.
 */

const LABELS: Record<Source, { name: string; note: string }> = {
  coal: { name: "Уголь", note: "печь или твердотопливный котёл" },
  gas: { name: "Газовый котёл", note: "там, где газ подведён" },
  electric: { name: "Электрокотёл", note: "самый простой электрический" },
  pump: { name: "Тепловой насос", note: "то, что ставим мы" },
};

const money = (v: number) => v.toLocaleString("ru-RU");
/** Десятичная запятая: точка в русском тексте читается как опечатка. */
const dec = (v: number, digits = 2) =>
  v.toLocaleString("ru-RU", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const MIN_AREA = 20;
const MAX_AREA = 1000;

export default function HeatingCompare({ kicker = "Деньги" }: { kicker?: string }) {
  /* Площадь держим строкой: с числом нельзя стереть поле и набрать заново —
     любое промежуточное состояние тут же подменяется минимумом. */
  const [areaText, setAreaText] = useState("150");
  const [coalPrice, setCoalPrice] = useState<number>(FUEL.coal.defaultPrice);
  const [gasPrice, setGasPrice] = useState<number>(FUEL.gas.defaultPrice);

  const area = Math.min(MAX_AREA, Math.max(MIN_AREA, Number(areaText) || 0));

  const result = useMemo(
    () => compareHeating({ area, coalPrice, gasPrice }),
    [area, coalPrice, gasPrice]
  );

  const max = Math.max(...result.rows.map((r) => r.monthCost));
  const pump = result.rows.find((r) => r.source === "pump")!;
  const cheapest = result.rows
    .filter((r) => r.source !== "pump")
    .reduce((a, b) => (a.monthCost <= b.monthCost ? a : b));

  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <Eyebrow>{kicker}</Eyebrow>
            <h2 className="mt-5 max-w-[13em] text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[38px]">
              Сколько стоит месяц тепла
            </h2>
          </div>

          <label className="flex shrink-0 items-end gap-3">
            <span className="mono-label pb-2">
              Площадь дома
            </span>
            <span className="flex items-baseline gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={areaText}
                onChange={(e) => setAreaText(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                onBlur={() => setAreaText(String(area))}
                aria-label="Отапливаемая площадь, м²"
                className="w-[4.5ch] border-0 border-b-2 border-eco bg-transparent p-0 text-center num-hero text-[34px] text-graphite outline-none focus:border-eco-dark md:text-[38px]"
              />
              <span className="font-head text-[17px] font-semibold text-muted">м²</span>
            </span>
          </label>
        </div>

        {/* ─────────────────────────────── таблица: два числа на строку */}
        <div className="mt-10">
          <div className="hidden grid-cols-[1fr_minmax(0,160px)_minmax(0,160px)] gap-6 border-b border-line pb-2.5 md:grid">
            <span className="mono-label">Чем греем</span>
            <span className="mono-label text-right">
              В зимний месяц
            </span>
            <span className="mono-label text-right">
              За сезон
            </span>
          </div>

          {result.rows.map((row) => {
            const isPump = row.source === "pump";
            return (
              <div
                key={row.source}
                className={`grid grid-cols-2 items-center gap-x-6 gap-y-1 border-b border-line py-3.5 md:grid-cols-[1fr_minmax(0,160px)_minmax(0,160px)] ${
                  isPump ? "bg-tint/40" : ""
                }`}
              >
                <div className="col-span-2 md:col-span-1 md:pl-3">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span
                      className={`font-head text-[16px] font-bold md:text-[18px] ${
                        isPump ? "text-eco-dark" : "text-graphite"
                      }`}
                    >
                      {LABELS[row.source].name}
                    </span>
                    <span className="text-[13px] text-muted">
                      {LABELS[row.source].note} · {row.usage}
                    </span>
                  </span>
                  {/* Полоса длиной по счёту за месяц: разница видна раньше,
                      чем человек прочитает цифры. */}
                  <span aria-hidden className="mt-2 block h-[5px] w-full rounded-full bg-line">
                    <span
                      className={`block h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none ${
                        isPump ? "bg-eco" : "bg-heat/60"
                      }`}
                      style={{ width: `${max > 0 ? (row.monthCost / max) * 100 : 0}%` }}
                    />
                  </span>
                </div>

                <Cell label="В зимний месяц" value={`${money(row.monthCost)} сом`} strong={isPump} big />
                <Cell label="За сезон" value={`${money(row.seasonCost)} сом`} />
              </div>
            );
          })}
        </div>

        <p className="mt-6 max-w-[46em] text-[16px] leading-[1.6] text-graphite md:text-[17px]">
          Насос экономит{" "}
          <b className="num text-eco-dark">{money(cheapest.monthCost - pump.monthCost)} сом</b> в каждый зимний месяц
          против самого выгодного из остальных способов — {money(cheapest.seasonCost - pump.seasonCost)} сом за
          сезон. Разницу даёт не цена электричества, а COP {dec(result.cop, 1)}: насос не производит тепло, а
          переносит готовое.
        </p>

        {/* ─────────────────────────────── цены топлива и методика */}
        <div className="mt-8 flex flex-wrap items-start gap-x-10 gap-y-6 border-t border-line pt-6">
          <PriceField
            label="Уголь, сом за тонну"
            value={coalPrice}
            onChange={setCoalPrice}
            hint="Предельная цена местного угля в Бишкеке"
          />
          <PriceField
            label="Газ, сом за м³"
            value={gasPrice}
            onChange={setGasPrice}
            hint="Тариф для населения, меняется ежемесячно"
          />
          <Link
            href="/calculator"
            className="group ml-auto mt-1 flex items-center gap-2.5 font-head text-[14px] font-semibold text-graphite transition-colors hover:text-eco-dark"
          >
            Посчитать насос для своего дома
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <details className="group mt-6 border-t border-line">
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
            <Fact title="Какой дом взят за основу">
              Утеплённый дом в Чуйской долине: {HEAT_LOSS[ASSUMED_WALLS]} Вт на квадратный метр,{" "}
              {dec(SEASON_MONTHS, 1)} месяца сезона, 1 800 часов работы на полной мощности. Для {area} м² это{" "}
              {money(result.seasonHeatKwh)} кВт·ч тепла за сезон при теплопотерях {dec(result.heatLossKw, 1)} кВт.
              Дом без утепления потребует заметно больше — такой считает инженер на выезде, и начинать там надо с
              утепления, а не с котла.
            </Fact>
            <Fact title="Отопительные приборы">
              Сезонный COP насоса — {dec(result.cop, 1)}: среднее между тёплым полом (3,6) и радиаторами (2,5) по
              паспортам каталога. КПД угольной печи или котла — {Math.round(FUEL.coal.efficiency * 100)}%,
              настенного газового котла — {Math.round(FUEL.gas.efficiency * 100)}%, электрокотла — 99%.
            </Fact>
            <Fact title="Топливо">
              Теплотворность кара-кечинского бурого угля принята {dec(FUEL.coal.kwhPerKg)} кВт·ч/кг (≈4 000
              ккал/кг), природного газа — {dec(FUEL.gas.kwhPerM3, 1)} кВт·ч/м³. Стоимость подключения газа и
              проекта в расчёт не входит: здесь только эксплуатация.
            </Fact>
            <Fact title="Электричество">
              Тариф {dec(TARIFF.base)} сом до {money(TARIFF.blockKwh)} кВт·ч в месяц и {dec(TARIFF.high)} сом
              сверх — с мая 2026. Блок считается от всего счёта дома, поэтому к отоплению прибавлено бытовое
              потребление 350 кВт·ч, а стоимость отопления — это разница между счётом с ним и без.
            </Fact>
            <p className="text-[13.5px] leading-[1.6] text-muted md:col-span-2">
              Источники цен:{" "}
              <a
                href="https://bishkek.gov.kg/ru/post/28066"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 hover:text-eco-dark"
              >
                мэрия Бишкека — цены на угольных базах
              </a>
              ,{" "}
              <a
                href="https://economist.kg/enierghietika/2025/05/01/na-skolko-podorozhal-ghaz-dlia-kyrghyzstantsiev-s-1-maia-aktualnyie-tarify-gazproma/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 hover:text-eco-dark"
              >
                тариф «Газпром Кыргызстан» для населения
              </a>
              . Расчёт предварительный: он показывает порядок цифр, а не смету.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}

/**
 * Ячейка суммы. Значения — моно с табличными разрядами: колонка цифр
 * выстраивается посимвольно, а месяц (big) крупнее сезона — читатель
 * сравнивает сначала главные числа.
 */
function Cell({
  label,
  value,
  strong = false,
  big = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  big?: boolean;
}) {
  return (
    <div className="md:text-right">
      <span className="mono-label block text-[10px] md:hidden">{label}</span>
      <span
        className={`num block ${
          big
            ? `text-[19px] font-semibold md:text-[21px] ${strong ? "text-eco-dark" : "text-graphite"}`
            : "text-[15px] text-muted md:text-[15.5px]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

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
  const [text, setText] = useState(String(value));
  return (
    <label className="block">
      <span className="mono-label">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d.,]/g, "").slice(0, 7);
          setText(next);
          const parsed = Number(next.replace(",", "."));
          if (Number.isFinite(parsed) && parsed > 0) onChange(parsed);
        }}
        onBlur={() => setText(String(value))}
        className="mt-2 block w-[7ch] border-0 border-b-2 border-line bg-transparent p-0 num text-[20px] font-semibold text-graphite outline-none focus:border-eco"
      />
      <span className="mt-1.5 block max-w-[24em] text-[12.5px] leading-[1.5] text-muted">{hint}</span>
    </label>
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
