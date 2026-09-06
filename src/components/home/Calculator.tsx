"use client";

import { useState } from "react";
import {
  calcSolar,
  calcHeat,
  formatSom,
  TARIFF_THRESHOLD,
  TARIFF_ABOVE,
  TARIFF_BASE,
} from "@/lib/calc-v2";

type Tab = "solar" | "heat";

/**
 * Калькулятор. Открывается на вкладке солнца: приоритет направления.
 *
 * Правило: результат показывается до того, как запрошены контакты.
 * Стоимость оборудования не показывается, пока заказчик не утвердил
 * диапазоны. Всё остальное считается из подтверждённых чисел.
 */
export default function Calculator() {
  const [tab, setTab] = useState<Tab>("solar");

  return (
    <section
      id="calculator"
      className="scroll-mt-16 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]"
    >
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-20">
        <h2 className="t-h2">Посчитайте за минуту</h2>
        <p className="t-lead mt-4">
          Предварительный расчёт по вашим данным. Точную конфигурацию инженер считает
          после бесплатного выезда на объект.
        </p>

        <div className="mt-8 flex gap-1" role="tablist" aria-label="Что считаем">
          {(
            [
              ["solar", "Солнечная станция"],
              ["heat", "Тепловой насос"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`r px-4 py-2.5 text-[0.9375rem] font-medium transition-colors ${
                tab === id
                  ? "bg-[color:var(--color-fg)] text-white"
                  : "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-[color:var(--color-border-strong)]">
          {tab === "solar" ? <SolarCalc /> : <HeatCalc />}
        </div>
      </div>
    </section>
  );
}

function SolarCalc() {
  const [bill, setBill] = useState(3000);
  const r = calcSolar(bill);
  const overExportLimit = r.kwp > 15;

  return (
    <div className="grid lg:grid-cols-[1fr_1fr]">
      <div className="border-b border-[color:var(--color-border)] py-7 pr-0 lg:border-b-0 lg:border-r lg:pr-10">
        <label htmlFor="bill" className="field-label">
          Сколько вы платите за электричество в месяц
        </label>
        <div className="flex items-baseline gap-2">
          <output htmlFor="bill" className="t-num text-[2rem] font-medium leading-none">
            {formatSom(bill)}
          </output>
          <span className="text-[0.9375rem] text-[color:var(--color-fg-muted)]">сом</span>
        </div>
        <input
          id="bill"
          type="range"
          min={500}
          max={30000}
          step={250}
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
          className="mt-5 w-full accent-[color:var(--color-brand)]"
        />
        <div className="mt-2 flex justify-between text-[0.75rem] text-[color:var(--color-fg-subtle)]">
          <span className="t-num">500</span>
          <span className="t-num">30 000</span>
        </div>

        <p className="mt-6 text-[0.875rem] leading-relaxed text-[color:var(--color-fg-muted)]">
          Это примерно{" "}
          <span className="t-num font-medium text-[color:var(--color-fg)]">
            {formatSom(r.kwhPerMonth)}
          </span>{" "}
          кВт·ч в месяц при тарифе {TARIFF_BASE} сом до {TARIFF_THRESHOLD} кВт·ч и{" "}
          {TARIFF_ABOVE} сом сверх.
        </p>

        {r.aboveThresholdShare > 5 && (
          <p className="mt-4 text-[0.875rem] leading-relaxed text-[color:var(--color-fg-muted)]">
            <span className="t-num font-medium text-[color:var(--color-fg)]">
              {Math.round(r.aboveThresholdShare)}%
            </span>{" "}
            вашего счёта приходится на киловатты сверх порога, где тариф почти вдвое выше.
            Станция срезает в первую очередь именно их.
          </p>
        )}
      </div>

      <div className="py-7 lg:pl-10">
        <p className="t-eyebrow">Что получится</p>
        <dl className="mt-4">
          <Row label="Мощность станции" value={r.kwp.toFixed(2)} unit="кВт" />
          <Row label="Модулей Trina 635 Вт" value={String(r.panels)} unit="шт" />
          <Row label="Выработка" value={formatSom(r.yieldPerYear)} unit="кВт·ч в год" />
          <Row label="Покрытие потребления" value={Math.round(r.coverage).toString()} unit="%" />
          <Row
            label="Платите за свет сейчас"
            value={formatSom(r.billPerYear)}
            unit="сом в год"
          />
        </dl>

        {overExportLimit && (
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-[color:var(--color-fg-subtle)]">
            Станция выходит за 15 кВт. Излишки в сеть выкупаются в пределах этого порога,
            поэтому конфигурацию стоит обсудить отдельно.
          </p>
        )}

        <p className="mt-5 text-[0.8125rem] leading-relaxed text-[color:var(--color-fg-subtle)]">
          Расчёт при действующем тарифе и средней инсоляции Бишкека, 1750 кВт·ч с 1 кВт в год.
          Реальная выработка зависит от ориентации и уклона кровли.
        </p>

        <a href="#lead" className="btn btn-primary mt-6 w-full">
          Получить расчёт
        </a>
      </div>
    </div>
  );
}

const AREAS = [
  { label: "до 100 м²", value: 85 },
  { label: "100-150 м²", value: 125 },
  { label: "150-250 м²", value: 200 },
  { label: "больше 250 м²", value: 300 },
];

function HeatCalc() {
  const [area, setArea] = useState(125);
  const [phases, setPhases] = useState<1 | 3 | null>(null);
  const r = calcHeat(area, phases);

  return (
    <div className="grid lg:grid-cols-[1fr_1fr]">
      <div className="border-b border-[color:var(--color-border)] py-7 pr-0 lg:border-b-0 lg:border-r lg:pr-10">
        <fieldset>
          <legend className="field-label">Площадь дома</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {AREAS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setArea(a.value)}
                aria-pressed={area === a.value}
                className={`r border px-3 py-2.5 text-[0.9375rem] transition-colors ${
                  area === a.value
                    ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand-tint)] text-[color:var(--color-brand-strong)]"
                    : "border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="field-label">Электрическая сеть в доме</legend>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {(
              [
                [1, "220 В"],
                [3, "380 В"],
                [null, "Не знаю"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => setPhases(v)}
                aria-pressed={phases === v}
                className={`r border px-3 py-2.5 text-[0.9375rem] transition-colors ${
                  phases === v
                    ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand-tint)] text-[color:var(--color-brand-strong)]"
                    : "border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="mt-6 text-[0.875rem] leading-relaxed text-[color:var(--color-fg-muted)]">
          Мощность считается по теплопотерям, а не по площади: утепление, высота потолков и
          площадь остекления меняют результат. Здесь оценка, точный расчёт делает инженер.
        </p>
      </div>

      <div className="py-7 lg:pl-10">
        <p className="t-eyebrow">Что подходит</p>

        {r.cascade ? (
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-fg-muted)]">
            Для дома такой площади одной установки мало. Собирается каскад из двух насосов,
            конфигурация считается индивидуально.
          </p>
        ) : r.models.length === 0 ? (
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-fg-muted)]">
            Под эти параметры нужен индивидуальный подбор. Оставьте заявку, инженер посчитает.
          </p>
        ) : (
          <ul className="mt-4 border-t border-[color:var(--color-border)]">
            {r.models.map((m) => (
              <li key={m.name} className="border-b border-[color:var(--color-border)] py-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[0.9375rem] font-medium">{m.name}</span>
                  <span className="t-num shrink-0 text-[0.9375rem] text-[color:var(--color-fg-muted)]">
                    {m.kw} кВт
                  </span>
                </div>
                <p className="mt-1 text-[0.8125rem] text-[color:var(--color-fg-subtle)]">
                  {m.refrigerant}, {m.phases === 1 ? "220 В" : "380 В"}
                  {m.dhw ? ", с горячей водой" : ""}
                  {m.note ? `. ${m.note}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}

        {r.needsUpgrade && (
          <p className="mt-4 text-[0.875rem] leading-relaxed text-[color:var(--color-fg-muted)]">
            На однофазной сети 220 В выбор ограничен мощностью примерно до 12 кВт. Для дома
            такой площади может потребоваться увеличение ввода до 380 В через НЭСК.
          </p>
        )}

        <p className="mt-5 text-[0.8125rem] leading-relaxed text-[color:var(--color-fg-subtle)]">
          Линейка рассчитана на морозы до −25 °C. Если объект в высокогорном районе, скажите
          об этом при заявке.
        </p>

        <a href="#lead" className="btn btn-primary mt-6 w-full">
          Получить расчёт
        </a>
      </div>
    </div>
  );
}

function Row({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[color:var(--color-border)] py-3">
      <dt className="text-[0.9375rem] text-[color:var(--color-fg-muted)]">{label}</dt>
      <dd className="shrink-0 text-right">
        <span className="t-num text-[1.0625rem] font-medium">{value}</span>{" "}
        <span className="text-[0.8125rem] text-[color:var(--color-fg-subtle)]">{unit}</span>
      </dd>
    </div>
  );
}
